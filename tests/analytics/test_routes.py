"""Route-contract tests for the analytics slice.

One test per endpoint asserting HTTP status, response shape against the declared
Out schema, and the auth gate. ``CurrentUser`` (me_usage) authenticates via
session cookie only; the admin-gated endpoints return 401 for both
unauthenticated and non-superuser callers. Tests log in through the real
``POST /auth/login`` endpoint and let the client carry the session cookie.
"""

import uuid

from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from strands_compose_chat.auth.passwords import hash_password
from strands_compose_chat.db.models import User
from strands_compose_chat.schemas.analytics import (
    BreakdownOut,
    BudgetItemOut,
    FiltersOut,
    MeUsageOut,
    SummaryOut,
    TimelineOut,
)
from tests.conftest import _TEST_SETTINGS
from tests.factories import as_user, make_user, persist

_DEFAULT_PASSWORD = "test-password-abc123!"  # pragma: allowlist secret


async def _login_as(
    client: AsyncClient,
    db: AsyncSession,
    *,
    is_superuser: bool = False,
    password: str = _DEFAULT_PASSWORD,
) -> User:
    """Create a local user, persist them, log in via POST /auth/login, and
    return the User. The client's cookie jar carries the session cookie for all
    subsequent requests in the test.
    """
    username = f"u_{uuid.uuid4().hex[:10]}"
    user = make_user(
        username=username,
        auth_provider="local",
        is_superuser=is_superuser,
        password_hash=hash_password(password, _TEST_SETTINGS),
    )
    await persist(db, user)

    resp = await client.post("/auth/login", json={"username": username, "password": password})
    assert resp.status_code == 200, f"login failed: {resp.text}"
    return user


async def test_me_usage_returns_200_and_valid_shape(client: AsyncClient, db: AsyncSession) -> None:
    await _login_as(client, db)

    resp = await client.get(
        "/api/v1/users/me/usage",
        params={"from": "2024-01-01", "to": "2024-01-31", "interval": "daily"},
    )

    assert resp.status_code == 200
    MeUsageOut.model_validate(resp.json())


async def test_me_usage_returns_401_when_unauthenticated(client: AsyncClient) -> None:
    resp = await client.get(
        "/api/v1/users/me/usage",
        params={"from": "2024-01-01", "to": "2024-01-31", "interval": "daily"},
    )

    assert resp.status_code == 401


async def test_me_usage_returns_401_for_api_key_bearer(
    client: AsyncClient, db: AsyncSession
) -> None:
    """CurrentUser is session-only, so a Bearer API key is rejected with 401."""
    headers = await as_user(db)

    resp = await client.get(
        "/api/v1/users/me/usage",
        params={"from": "2024-01-01", "to": "2024-01-31", "interval": "daily"},
        headers=headers,
    )

    assert resp.status_code == 401


async def test_filters_returns_200_and_valid_shape(client: AsyncClient, db: AsyncSession) -> None:
    await _login_as(client, db, is_superuser=True)

    resp = await client.get("/api/v1/analytics/filters")

    assert resp.status_code == 200
    body = FiltersOut.model_validate(resp.json())
    assert isinstance(body.users, list)
    assert isinstance(body.agents, list)
    assert isinstance(body.groups, list)


async def test_filters_returns_401_when_unauthenticated(client: AsyncClient) -> None:
    resp = await client.get("/api/v1/analytics/filters")

    assert resp.status_code == 401


async def test_filters_returns_401_for_non_admin(client: AsyncClient, db: AsyncSession) -> None:
    await _login_as(client, db, is_superuser=False)

    resp = await client.get("/api/v1/analytics/filters")

    assert resp.status_code == 401


_TIMELINE_BODY = {
    "from": "2024-01-01",
    "to": "2024-01-31",
    "interval": "daily",
    "metric": "cost",
    "stack_by": "none",
}


async def test_timeline_returns_200_and_valid_shape(client: AsyncClient, db: AsyncSession) -> None:
    await _login_as(client, db, is_superuser=True)

    resp = await client.post("/api/v1/analytics/timeline", json=_TIMELINE_BODY)

    assert resp.status_code == 200
    body = TimelineOut.model_validate(resp.json())
    assert isinstance(body.labels, list)
    assert isinstance(body.series, list)


async def test_timeline_returns_401_when_unauthenticated(client: AsyncClient) -> None:
    resp = await client.post("/api/v1/analytics/timeline", json=_TIMELINE_BODY)

    assert resp.status_code == 401


async def test_timeline_returns_401_for_non_admin(client: AsyncClient, db: AsyncSession) -> None:
    await _login_as(client, db, is_superuser=False)

    resp = await client.post("/api/v1/analytics/timeline", json=_TIMELINE_BODY)

    assert resp.status_code == 401


_SUMMARY_BODY = {"from": "2024-01-01", "to": "2024-01-31"}


async def test_summary_returns_200_and_valid_shape(client: AsyncClient, db: AsyncSession) -> None:
    await _login_as(client, db, is_superuser=True)

    resp = await client.post("/api/v1/analytics/summary", json=_SUMMARY_BODY)

    assert resp.status_code == 200
    body = SummaryOut.model_validate(resp.json())
    assert isinstance(body.total_cost, float)
    assert isinstance(body.input_tokens, int)
    assert isinstance(body.output_tokens, int)
    assert isinstance(body.hits, int)
    assert isinstance(body.active_users, int)


async def test_summary_returns_401_when_unauthenticated(client: AsyncClient) -> None:
    resp = await client.post("/api/v1/analytics/summary", json=_SUMMARY_BODY)

    assert resp.status_code == 401


async def test_summary_returns_401_for_non_admin(client: AsyncClient, db: AsyncSession) -> None:
    await _login_as(client, db, is_superuser=False)

    resp = await client.post("/api/v1/analytics/summary", json=_SUMMARY_BODY)

    assert resp.status_code == 401


_BREAKDOWN_BODY = {
    "from": "2024-01-01",
    "to": "2024-01-31",
    "category": "user",
    "stack_by": "none",
    "metric": "cost",
}


async def test_breakdown_returns_200_and_valid_shape(client: AsyncClient, db: AsyncSession) -> None:
    await _login_as(client, db, is_superuser=True)

    resp = await client.post("/api/v1/analytics/breakdown", json=_BREAKDOWN_BODY)

    assert resp.status_code == 200
    body = BreakdownOut.model_validate(resp.json())
    assert isinstance(body.labels, list)
    assert isinstance(body.series, list)


async def test_breakdown_returns_401_when_unauthenticated(client: AsyncClient) -> None:
    resp = await client.post("/api/v1/analytics/breakdown", json=_BREAKDOWN_BODY)

    assert resp.status_code == 401


async def test_breakdown_returns_401_for_non_admin(client: AsyncClient, db: AsyncSession) -> None:
    await _login_as(client, db, is_superuser=False)

    resp = await client.post("/api/v1/analytics/breakdown", json=_BREAKDOWN_BODY)

    assert resp.status_code == 401


async def test_budgets_returns_200_and_valid_shape(client: AsyncClient, db: AsyncSession) -> None:
    await _login_as(client, db, is_superuser=True)

    resp = await client.get("/api/v1/analytics/budgets")

    assert resp.status_code == 200
    items = resp.json()
    assert isinstance(items, list)
    for item in items:
        BudgetItemOut.model_validate(item)


async def test_budgets_returns_401_when_unauthenticated(client: AsyncClient) -> None:
    resp = await client.get("/api/v1/analytics/budgets")

    assert resp.status_code == 401


async def test_budgets_returns_401_for_non_admin(client: AsyncClient, db: AsyncSession) -> None:
    await _login_as(client, db, is_superuser=False)

    resp = await client.get("/api/v1/analytics/budgets")

    assert resp.status_code == 401
