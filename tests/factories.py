"""Builders for test data.

Plain module-level functions with sensible defaults and ``**overrides``. Each
returns a valid ORM object with no arguments, applies only the fields you name,
and lets the ORM constructor raise on an unknown field. No base classes, no
object-mother.

    user = make_user(username="alice", is_superuser=True)
    agent = make_agent(agent_kind="local")
    await persist(db, user, agent)
    headers = await as_user(db, user)
"""

import uuid
from collections.abc import Sequence
from typing import TypeVar, overload

from sqlalchemy.ext.asyncio import AsyncSession

from strands_compose_chat.auth.api_key import generate_api_key, hash_api_key
from strands_compose_chat.db.models import (
    Agent,
    ApiKey,
    ChatMessage,
    ChatSession,
    Group,
    ModelPricing,
    TokenUsage,
    User,
)


def _new_id() -> str:
    return str(uuid.uuid4())


def _new_session_id() -> str:
    # Long enough to satisfy the 33-256 char session_id check constraint.
    return f"sess_{uuid.uuid4().hex}{uuid.uuid4().hex}"


def make_user(**overrides: object) -> User:
    """Build a local, active, non-superuser ``User``."""
    defaults: dict[str, object] = {
        "username": f"user_{uuid.uuid4().hex[:8]}",
        "email": f"user_{uuid.uuid4().hex[:8]}@example.com",
        "auth_provider": "local",
        "is_active": True,
        "is_superuser": False,
    }
    return User(**{**defaults, **overrides})


def make_agent(**overrides: object) -> Agent:
    """Build an enabled local ``Agent``.

    The agents table's check constraint requires a local agent to carry an
    ``endpoint_url`` with no runtime ARN, and an ``agentcore_runtime`` agent the
    reverse. For the latter pass ``agent_kind="agentcore_runtime"``,
    ``agent_runtime_arn=...`` and ``endpoint_url=None``.
    """
    defaults: dict[str, object] = {
        "name": f"agent_{uuid.uuid4().hex[:8]}",
        "agent_kind": "local",
        "endpoint_url": "http://localhost:8080",
        "enabled": True,
    }
    return Agent(**{**defaults, **overrides})


def make_group(**overrides: object) -> Group:
    """Build a ``Group``."""
    defaults: dict[str, object] = {"name": f"group_{uuid.uuid4().hex[:8]}"}
    return Group(**{**defaults, **overrides})


def make_chat_session(**overrides: object) -> ChatSession:
    """Build a ``ChatSession``. ``user_id``/``agent_id`` default to placeholder UUIDs;
    pass real ids when the test needs valid foreign keys."""
    defaults: dict[str, object] = {
        "user_id": _new_id(),
        "session_id": _new_session_id(),
        "agent_id": _new_id(),
        "is_archived": False,
    }
    return ChatSession(**{**defaults, **overrides})


def make_chat_message(**overrides: object) -> ChatMessage:
    """Build a user ``ChatMessage``. ``chat_session_id`` defaults to a placeholder UUID."""
    defaults: dict[str, object] = {
        "chat_session_id": _new_id(),
        "role": "user",
        "content": "Hello, agent.",
        "seq": 1,
        "is_success": True,
    }
    return ChatMessage(**{**defaults, **overrides})


def make_model_pricing(**overrides: object) -> ModelPricing:
    """Build a ``ModelPricing`` row."""
    defaults: dict[str, object] = {
        "model_id": f"model-{uuid.uuid4().hex[:8]}",
        "provider": "bedrock",
        "input_token_price": 0.0003,
        "output_token_price": 0.0015,
    }
    return ModelPricing(**{**defaults, **overrides})


def make_token_usage(**overrides: object) -> TokenUsage:
    """Build a ``TokenUsage`` row. ``chat_session_id``/``user_id`` default to placeholder UUIDs."""
    defaults: dict[str, object] = {
        "chat_session_id": _new_id(),
        "user_id": _new_id(),
        "agent_name": "demo-agent",
        "input_tokens": 100,
        "output_tokens": 50,
        "cost": 0.0,
    }
    return TokenUsage(**{**defaults, **overrides})


_T1 = TypeVar("_T1")
_T2 = TypeVar("_T2")
_T3 = TypeVar("_T3")
_T4 = TypeVar("_T4")


@overload
async def persist(db: AsyncSession, obj1: _T1, /) -> tuple[_T1]: ...


@overload
async def persist(db: AsyncSession, obj1: _T1, obj2: _T2, /) -> tuple[_T1, _T2]: ...


@overload
async def persist(db: AsyncSession, obj1: _T1, obj2: _T2, obj3: _T3, /) -> tuple[_T1, _T2, _T3]: ...


@overload
async def persist(
    db: AsyncSession, obj1: _T1, obj2: _T2, obj3: _T3, obj4: _T4, /
) -> tuple[_T1, _T2, _T3, _T4]: ...


@overload
async def persist(db: AsyncSession, *objs: object) -> Sequence[object]: ...


async def persist(db: AsyncSession, *objs: object) -> Sequence[object] | tuple[object, ...]:
    """Add the objects and flush so ids and defaults are populated. The caller owns commit."""
    db.add_all(objs)
    await db.flush()
    return objs


async def as_user(
    db: AsyncSession,
    user: User | None = None,
    *,
    superuser: bool = False,
) -> dict[str, str]:
    """Persist a user with a real API key and return a Bearer auth header for it.

    Using a real ``sck_`` key drives the actual auth dependency chain rather than
    stubbing it. Pass an existing ``user`` to key a request as that user.
    """
    if user is None:
        user = make_user(is_superuser=superuser)
        await persist(db, user)
    elif user.id is None:
        await persist(db, user)

    raw_key, key_prefix = generate_api_key()
    api_key = ApiKey(
        user_id=user.id,
        name="test-key",
        secret_hash=hash_api_key(raw_key),
        key_prefix=key_prefix,
    )
    await persist(db, api_key)

    return {"Authorization": f"Bearer {raw_key}"}
