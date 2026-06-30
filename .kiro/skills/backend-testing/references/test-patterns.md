# Backend Test Patterns

Concrete, copy-paste starting points that implement the doctrine in
`../SKILL.md`. These are **shapes to adapt**, not files to reproduce verbatim —
match the real names in `src/strands_compose_chat/` when you write them. If a
pattern here conflicts with SKILL.md, SKILL.md wins.

> Tooling assumed (already in the project): `pytest`, `pytest-asyncio`
> (auto mode), `httpx`. `hypothesis` is added when the first property test
> lands. PostgreSQL parity uses Docker/Testcontainers in CI.

---

## 1. The async client + DB session (root `conftest.py`)

Drive the app in-process — no live server. Each test gets an isolated session
that rolls back, so tests never leak state into each other.

```python

from collections.abc import AsyncIterator

import pytest
from httpx import ASGITransport, AsyncClient

from strands_compose_chat.app import create_app
from strands_compose_chat.db.base import Base, engine, AsyncSessionLocal


@pytest.fixture(scope="session", autouse=True)
async def _schema() -> AsyncIterator[None]:
    # Real schema. For the Postgres tier this runs migrations instead (see §6).
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


@pytest.fixture
async def db() -> AsyncIterator:
    # Per-test transaction rolled back at the end → isolation without re-creating schema.
    async with AsyncSessionLocal() as session:
        yield session
        await session.rollback()


@pytest.fixture
async def client() -> AsyncIterator[AsyncClient]:
    app = create_app()
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as c:
        yield c
```

Notes:
- Override the per-request DB dependency to hand routes the *test* session so
  HTTP tests and assertions see the same transaction (use FastAPI
  `dependency_overrides` on the session provider in `deps.py`).
- Settings: construct test `Settings` (a valid `SESSION_SECRET_KEY`, SQLite URL)
  and override `get_settings`, rather than mutating the environment.

---

## 2. Test-data builders (`factories.py`)

Functions with sensible defaults; the test passes only what it cares about.
Readable at the call site, no fixture web.

```python

from strands_compose_chat.db.models import Agent, User


def make_user(**overrides) -> User:
    data = {"username": "alice", "is_superuser": False, "auth_provider": "local"}
    return User(**{**data, **overrides})


def make_agent(**overrides) -> Agent:
    data = {"name": "demo", "agent_kind": "local"}
    return Agent(**{**data, **overrides})


async def persist(db, *objs):
    db.add_all(objs)
    await db.flush()   # generated ids/defaults populated; the dependency/fixture owns commit
    return objs
```

Add a builder the second time you need an object, not the first. Keep builders
flat — no inheritance trees, no "object mother" god-class.

---

## 3. Service test — logic + queries against a real session

The bulk of the suite. Assert state and rules, not SQL or messages.

```python
async def test_archiving_session_hides_it_from_default_listing(db):
    user = make_user()
    await persist(db, user)
    session = await create_session(db, user_id=user.id, agent_id=...)

    await archive_session(db, session_id=session.id, user_id=user.id)

    visible = await list_sessions(db, user_id=user.id)
    assert session.id not in {s.id for s in visible}


async def test_login_is_enumeration_safe(db):
    # Same opaque failure type for unknown user and wrong password.
    with pytest.raises(InvalidCredentials):
        await authenticate(db, username="ghost", password="x")
    user = make_user(password_hash=hash_password("correct-horse"))  # pragma: allowlist secret
    await persist(db, user)
    with pytest.raises(InvalidCredentials):
        await authenticate(db, username=user.username, password="wrong")  # pragma: allowlist secret
```

---

## 4. Route test — thin contract only

Status, shape, auth gate. Validate the body through the response schema so the
assertion tracks the contract, not hand-written keys.

```python
async def test_list_sessions_requires_auth(client):
    resp = await client.get("/api/v1/sessions")
    assert resp.status_code == 401


async def test_list_sessions_returns_session_shape(client, as_user):
    resp = await client.get("/api/v1/sessions", headers=as_user)
    assert resp.status_code == 200
    # Shape, not wording: parsing through the Out schema proves the contract.
    SessionListOut.model_validate(resp.json())
```

Don't re-test business rules here that §3 already proves. Don't assert on error
text — only on `status_code`.

---

## 5. Faking the agent SDK at *our* seam (`tests/fakes/`)

Mock what we own (the client façade), never the SDK internals. A fake is a real
object yielding canned events.

```python
class FakeAgentClient:
    """Stand-in for the owned agent-client façade. Yields scripted events."""

    def __init__(self, events):
        self._events = events

    async def stream(self, *args, **kwargs):
        for event in self._events:
            yield event


async def test_invocation_persists_turn_on_success(db, monkeypatch):
    fake = FakeAgentClient(events=[text_delta("Hel"), text_delta("lo"), turn_done()])
    monkeypatch.setattr("strands_compose_chat.agents.client.build_client", lambda *_a, **_k: fake)

    events = [e async for e in run_invocation(db, ...)]

    assert any(is_done(e) for e in events)
    messages = await get_messages(db, session_id=...)
    assert messages[-1].role == "assistant"   # best-effort persistence recorded the turn
```

Use `unittest.mock` only to force conditions a fake can't easily produce
(timeouts, transport errors), always with `spec_set=`.

---

## 6. The OpenAPI contract snapshot (`tests/contract/`)

One test guards every path/method/status/shape. `app.openapi()` works even
though the served spec is disabled (`openapi_url=None`). Regenerate the baseline
deliberately and review the diff as the record of an intentional contract change.

```python
import json
import os
from pathlib import Path

from strands_compose_chat.app import create_app

_BASELINE = Path(__file__).parent / "openapi.snapshot.json"


def test_openapi_contract_is_stable():
    spec = json.dumps(create_app().openapi(), sort_keys=True, indent=2)

    if os.environ.get("UPDATE_SNAPSHOT"):
        _BASELINE.write_text(spec + "\n")
        return

    assert spec + "\n" == _BASELINE.read_text(), (
        "OpenAPI contract changed. If intentional, regenerate with "
        "UPDATE_SNAPSHOT=1 and review the diff in the PR."
    )
```

Precondition: every real route declares a `response_model`; otherwise the
snapshot under-specifies that endpoint and guards nothing.

---

## 7. Migration guard (`tests/db/`)

```python
async def test_migrations_apply_clean_on_empty_db():
    # Run `alembic upgrade head` against a fresh database; failure = broken migration.
    ...


async def test_orm_matches_migrations():
    # autogenerate against head yields no operations → no schema drift.
    ...
```

Run this (and dialect-sensitive service tests) on the **PostgreSQL** CI tier,
because SQLite will not surface the divergences that matter in production.

---

## 8. Property-based test (Hypothesis) — invariants only

```python
from hypothesis import given, strategies as st


@given(
    prompt_tokens=st.integers(min_value=0, max_value=10_000_000),
    completion_tokens=st.integers(min_value=0, max_value=10_000_000),
)
def test_cost_is_non_negative_and_monotonic(prompt_tokens, completion_tokens):
    cost = compute_cost(prompt_tokens, completion_tokens, rate=...)
    assert cost >= 0
    assert compute_cost(prompt_tokens + 1, completion_tokens, rate=...) >= cost
```

Assert the *property* (non-negative, monotonic, round-trips, bounded) — never a
line-by-line recomputation of the implementation, which would just duplicate the
code and its bugs.
