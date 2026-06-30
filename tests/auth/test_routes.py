"""Contract tests for the /auth/* endpoints: status, response shape, auth gate.

Business rules live in test_service.py. The login tests also pin the
enumeration-safe contract: unknown user, wrong password, and disabled account
all fail with the same 401.

/auth/me and PATCH /auth/me authenticate by session cookie only, so those tests
log in through POST /auth/login first and let the client carry the cookie.
"""

from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from strands_compose_chat.auth.passwords import hash_password
from strands_compose_chat.schemas.auth import AuthProvidersOut, LoginOut, MeOut
from tests.conftest import _TEST_SETTINGS
from tests.factories import make_user, persist

_PASSWORD = "correct-horse-battery-staple"  # pragma: allowlist secret


async def _login(client: AsyncClient, db: AsyncSession) -> None:
    """Create a local user and log in; the client cookie jar carries the session."""
    user = make_user(
        password_hash=hash_password(_PASSWORD, _TEST_SETTINGS),
        auth_provider="local",
    )
    await persist(db, user)
    resp = await client.post("/auth/login", json={"username": user.username, "password": _PASSWORD})
    assert resp.status_code == 200, resp.text


async def test_list_providers_returns_provider_shape(client: AsyncClient) -> None:
    resp = await client.get("/auth/providers")
    assert resp.status_code == 200
    AuthProvidersOut.model_validate(resp.json())


async def test_register_creates_a_user_and_returns_me_shape(
    client: AsyncClient, db: AsyncSession
) -> None:
    resp = await client.post(
        "/auth/register",
        json={
            "username": "newuser01",
            "email": "newuser01@example.com",
            "password": "supersecretpassword123",  # pragma: allowlist secret
        },
    )
    assert resp.status_code == 201
    MeOut.model_validate(resp.json())


async def test_register_rejects_a_missing_field_with_422(client: AsyncClient) -> None:
    resp = await client.post("/auth/register", json={"username": "usr", "email": "bad@example.com"})
    assert resp.status_code == 422


async def test_register_rejects_an_invalid_username_with_422(client: AsyncClient) -> None:
    resp = await client.post(
        "/auth/register",
        json={
            "username": "bad user",
            "email": "ok@example.com",
            "password": "supersecret123",  # pragma: allowlist secret
        },
    )
    assert resp.status_code == 422


async def test_login_returns_login_shape_on_valid_credentials(
    client: AsyncClient, db: AsyncSession
) -> None:
    user = make_user(password_hash=hash_password(_PASSWORD, _TEST_SETTINGS), auth_provider="local")
    await persist(db, user)
    resp = await client.post("/auth/login", json={"username": user.username, "password": _PASSWORD})
    assert resp.status_code == 200
    LoginOut.model_validate(resp.json())


async def test_login_rejects_a_malformed_body_with_422(client: AsyncClient) -> None:
    resp = await client.post("/auth/login", json={"username": "someone"})
    assert resp.status_code == 422


async def test_login_with_an_unknown_user_returns_401(client: AsyncClient) -> None:
    resp = await client.post("/auth/login", json={"username": "ghost", "password": _PASSWORD})
    assert resp.status_code == 401


async def test_login_with_a_wrong_password_returns_401(
    client: AsyncClient, db: AsyncSession
) -> None:
    user = make_user(password_hash=hash_password(_PASSWORD, _TEST_SETTINGS), auth_provider="local")
    await persist(db, user)
    resp = await client.post(
        "/auth/login",
        json={"username": user.username, "password": "wrong-password"},  # pragma: allowlist secret
    )
    assert resp.status_code == 401


async def test_login_to_a_disabled_account_returns_401(
    client: AsyncClient, db: AsyncSession
) -> None:
    user = make_user(
        password_hash=hash_password(_PASSWORD, _TEST_SETTINGS),
        auth_provider="local",
        is_active=False,
    )
    await persist(db, user)
    resp = await client.post("/auth/login", json={"username": user.username, "password": _PASSWORD})
    assert resp.status_code == 401


async def test_logout_redirects(client: AsyncClient) -> None:
    resp = await client.get("/auth/logout", follow_redirects=False)
    assert resp.status_code == 302


async def test_oidc_login_with_an_unknown_provider_returns_404(client: AsyncClient) -> None:
    resp = await client.get("/auth/login/nonexistent-provider")
    assert resp.status_code == 404


async def test_oidc_callback_without_an_active_signin_returns_400(client: AsyncClient) -> None:
    resp = await client.get("/auth/callback")
    assert resp.status_code == 400


async def test_me_returns_me_shape_when_authenticated(
    client: AsyncClient, db: AsyncSession
) -> None:
    await _login(client, db)
    resp = await client.get("/auth/me")
    assert resp.status_code == 200
    MeOut.model_validate(resp.json())


async def test_me_requires_auth(client: AsyncClient) -> None:
    resp = await client.get("/auth/me")
    assert resp.status_code == 401


async def test_patch_me_returns_me_shape(client: AsyncClient, db: AsyncSession) -> None:
    await _login(client, db)
    resp = await client.patch("/auth/me", json={"first_name": "Alice"})
    assert resp.status_code == 200
    MeOut.model_validate(resp.json())


async def test_patch_me_requires_auth(client: AsyncClient) -> None:
    resp = await client.patch("/auth/me", json={"first_name": "Alice"})
    assert resp.status_code == 401


async def test_patch_me_rejects_an_overlong_field_with_422(
    client: AsyncClient, db: AsyncSession
) -> None:
    await _login(client, db)
    resp = await client.patch("/auth/me", json={"first_name": "x" * 200})
    assert resp.status_code == 422
