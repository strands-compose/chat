"""Route-contract tests for ``sessions.routes``: one test per endpoint
asserting HTTP status code, Out-schema shape, and the unauthenticated 401 gate.

Tests authenticate by calling the real ``POST /auth/login`` endpoint and letting
the httpx client carry the session cookie on subsequent requests.
"""

import uuid

from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from strands_compose_chat.auth.passwords import hash_password
from strands_compose_chat.db.models import User
from strands_compose_chat.schemas.sessions import (
    MessageOut,
    SessionDetailOut,
    SessionListItemOut,
    SessionUsageSummaryOut,
)
from tests.conftest import _TEST_SETTINGS
from tests.factories import (
    make_agent,
    make_chat_message,
    make_chat_session,
    make_user,
    persist,
)

_DEFAULT_PASSWORD = "test-password-abc123!"  # pragma: allowlist secret


async def _login_as(
    client: AsyncClient,
    db: AsyncSession,
    *,
    password: str = _DEFAULT_PASSWORD,
) -> User:
    """Create a local user, log in via POST /auth/login, and return the User.

    The httpx client's cookie jar carries the session cookie automatically for
    all subsequent requests in the test.
    """
    username = f"u_{uuid.uuid4().hex[:10]}"
    user = make_user(
        username=username,
        auth_provider="local",
        password_hash=hash_password(password, _TEST_SETTINGS),
    )
    await persist(db, user)

    resp = await client.post(
        "/auth/login",
        json={"username": username, "password": password},
    )
    assert resp.status_code == 200, f"login failed: {resp.text}"
    return user


async def test_list_sessions_requires_auth(client: AsyncClient) -> None:
    """Unauthenticated request to GET /api/v1/sessions returns 401."""
    resp = await client.get("/api/v1/sessions")
    assert resp.status_code == 401


async def test_list_sessions_returns_200_and_session_list_shape(
    client: AsyncClient, db: AsyncSession
) -> None:
    """Authenticated GET /api/v1/sessions returns 200 and a list matching SessionListItemOut."""
    user = await _login_as(client, db)
    agent = make_agent()
    await persist(db, agent)
    session = make_chat_session(user_id=user.id, agent_id=agent.id)
    await persist(db, session)

    resp = await client.get("/api/v1/sessions")

    assert resp.status_code == 200
    items = resp.json()
    assert isinstance(items, list)
    assert len(items) >= 1
    for item in items:
        SessionListItemOut.model_validate(item)


async def test_list_sessions_empty_for_user_with_no_sessions(
    client: AsyncClient, db: AsyncSession
) -> None:
    """GET /api/v1/sessions returns 200 with an empty list when user has no sessions."""
    await _login_as(client, db)

    resp = await client.get("/api/v1/sessions")

    assert resp.status_code == 200
    assert resp.json() == []


async def test_list_sessions_422_on_invalid_query_params(
    client: AsyncClient, db: AsyncSession
) -> None:
    """GET /api/v1/sessions with a non-integer limit returns 422."""
    await _login_as(client, db)

    resp = await client.get("/api/v1/sessions?limit=notanint")

    assert resp.status_code == 422


async def test_get_session_requires_auth(client: AsyncClient) -> None:
    """Unauthenticated request to GET /api/v1/sessions/{session_id} returns 401."""
    resp = await client.get("/api/v1/sessions/sess_abc")
    assert resp.status_code == 401


async def test_get_session_returns_200_and_session_detail_shape(
    client: AsyncClient, db: AsyncSession
) -> None:
    """Authenticated GET /api/v1/sessions/{session_id} returns 200 and SessionDetailOut shape."""
    user = await _login_as(client, db)
    agent = make_agent()
    await persist(db, agent)
    session = make_chat_session(user_id=user.id, agent_id=agent.id)
    await persist(db, session)

    resp = await client.get(f"/api/v1/sessions/{session.session_id}")

    assert resp.status_code == 200
    SessionDetailOut.model_validate(resp.json())


async def test_get_session_returns_404_for_unknown_session(
    client: AsyncClient, db: AsyncSession
) -> None:
    """GET /api/v1/sessions/{session_id} returns 404 when the session does not exist."""
    await _login_as(client, db)

    resp = await client.get("/api/v1/sessions/sess_doesnotexist000000")

    assert resp.status_code == 404


async def test_rename_session_requires_auth(client: AsyncClient) -> None:
    """Unauthenticated PATCH /api/v1/sessions/{session_id} returns 401."""
    resp = await client.patch("/api/v1/sessions/sess_abc", json={"title": "New title"})
    assert resp.status_code == 401


async def test_rename_session_returns_200_and_session_detail_shape(
    client: AsyncClient, db: AsyncSession
) -> None:
    """Authenticated PATCH /api/v1/sessions/{session_id} returns 200 and SessionDetailOut shape."""
    user = await _login_as(client, db)
    agent = make_agent()
    await persist(db, agent)
    session = make_chat_session(user_id=user.id, agent_id=agent.id, title="old title")
    await persist(db, session)

    resp = await client.patch(
        f"/api/v1/sessions/{session.session_id}",
        json={"title": "new title"},
    )

    assert resp.status_code == 200
    SessionDetailOut.model_validate(resp.json())


async def test_rename_session_returns_404_for_unknown_session(
    client: AsyncClient, db: AsyncSession
) -> None:
    """PATCH /api/v1/sessions/{session_id} returns 404 when the session does not exist."""
    await _login_as(client, db)

    resp = await client.patch(
        "/api/v1/sessions/sess_doesnotexist000000",
        json={"title": "irrelevant"},
    )

    assert resp.status_code == 404


async def test_rename_session_422_on_missing_title(client: AsyncClient, db: AsyncSession) -> None:
    """PATCH /api/v1/sessions/{session_id} with no body returns 422."""
    await _login_as(client, db)

    resp = await client.patch(
        "/api/v1/sessions/sess_irrelevant",
        json={},
    )

    assert resp.status_code == 422


async def test_rename_session_422_on_empty_title(client: AsyncClient, db: AsyncSession) -> None:
    """PATCH /api/v1/sessions/{session_id} with an empty title string returns 422."""
    await _login_as(client, db)

    resp = await client.patch(
        "/api/v1/sessions/sess_irrelevant",
        json={"title": ""},
    )

    assert resp.status_code == 422


async def test_list_messages_requires_auth(client: AsyncClient) -> None:
    """Unauthenticated GET /api/v1/sessions/{session_id}/messages returns 401."""
    resp = await client.get("/api/v1/sessions/sess_abc/messages")
    assert resp.status_code == 401


async def test_list_messages_returns_200_and_message_list_shape(
    client: AsyncClient, db: AsyncSession
) -> None:
    """Authenticated GET /api/v1/sessions/{session_id}/messages returns 200 and list[MessageOut] shape."""
    user = await _login_as(client, db)
    agent = make_agent()
    await persist(db, agent)
    session = make_chat_session(user_id=user.id, agent_id=agent.id)
    await persist(db, session)
    message = make_chat_message(chat_session_id=session.id, seq=1, role="user")
    await persist(db, message)

    resp = await client.get(f"/api/v1/sessions/{session.session_id}/messages")

    assert resp.status_code == 200
    items = resp.json()
    assert isinstance(items, list)
    assert len(items) >= 1
    for item in items:
        MessageOut.model_validate(item)


async def test_list_messages_returns_empty_list_when_no_messages(
    client: AsyncClient, db: AsyncSession
) -> None:
    """GET /api/v1/sessions/{session_id}/messages returns 200 with empty list when no messages."""
    user = await _login_as(client, db)
    agent = make_agent()
    await persist(db, agent)
    session = make_chat_session(user_id=user.id, agent_id=agent.id)
    await persist(db, session)

    resp = await client.get(f"/api/v1/sessions/{session.session_id}/messages")

    assert resp.status_code == 200
    assert resp.json() == []


async def test_list_messages_returns_404_for_unknown_session(
    client: AsyncClient, db: AsyncSession
) -> None:
    """GET /api/v1/sessions/{session_id}/messages returns 404 when the session does not exist."""
    await _login_as(client, db)

    resp = await client.get("/api/v1/sessions/sess_doesnotexist000000/messages")

    assert resp.status_code == 404


async def test_delete_session_requires_auth(client: AsyncClient) -> None:
    """Unauthenticated DELETE /api/v1/sessions/{session_id} returns 401."""
    resp = await client.delete("/api/v1/sessions/sess_abc")
    assert resp.status_code == 401


async def test_delete_session_returns_204_no_body(client: AsyncClient, db: AsyncSession) -> None:
    """Authenticated DELETE /api/v1/sessions/{session_id} returns 204 with no body."""
    user = await _login_as(client, db)
    agent = make_agent()
    await persist(db, agent)
    session = make_chat_session(user_id=user.id, agent_id=agent.id)
    await persist(db, session)

    resp = await client.delete(f"/api/v1/sessions/{session.session_id}")

    assert resp.status_code == 204
    assert resp.content == b""


async def test_delete_session_returns_404_for_unknown_session(
    client: AsyncClient, db: AsyncSession
) -> None:
    """DELETE /api/v1/sessions/{session_id} returns 404 when the session does not exist."""
    await _login_as(client, db)

    resp = await client.delete("/api/v1/sessions/sess_doesnotexist000000")

    assert resp.status_code == 404


async def test_get_usage_requires_auth(client: AsyncClient) -> None:
    """Unauthenticated GET /api/v1/sessions/{session_id}/usage returns 401."""
    resp = await client.get("/api/v1/sessions/sess_abc/usage")
    assert resp.status_code == 401


async def test_get_usage_returns_200_and_usage_summary_shape(
    client: AsyncClient, db: AsyncSession
) -> None:
    """Authenticated GET /api/v1/sessions/{session_id}/usage returns 200 and SessionUsageSummaryOut shape."""
    user = await _login_as(client, db)
    agent = make_agent()
    await persist(db, agent)
    session = make_chat_session(user_id=user.id, agent_id=agent.id)
    await persist(db, session)

    resp = await client.get(f"/api/v1/sessions/{session.session_id}/usage")

    assert resp.status_code == 200
    SessionUsageSummaryOut.model_validate(resp.json())


async def test_get_usage_returns_404_for_unknown_session(
    client: AsyncClient, db: AsyncSession
) -> None:
    """GET /api/v1/sessions/{session_id}/usage returns 404 when the session does not exist."""
    await _login_as(client, db)

    resp = await client.get("/api/v1/sessions/sess_doesnotexist000000/usage")

    assert resp.status_code == 404
