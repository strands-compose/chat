"""Auth routes: register, login, logout, callback, me."""

from datetime import UTC, datetime

import structlog
from fastapi import APIRouter, Query, Request, Response
from fastapi.responses import RedirectResponse
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError

from ..analytics.service import get_monthly_spend
from ..config import Settings
from ..db.models import User
from ..deps import AppSettings, DbSession, OidcRegistry
from ..errors import ProblemDetailsException
from ..schemas.auth import (
    AuthProviderInfo,
    AuthProvidersOut,
    LoginIn,
    LoginOut,
    MeOut,
    MePatchIn,
    RegisterIn,
)
from .current_user import CurrentUser
from .jit import jit_provision
from .oidc import ExternalAuthError
from .passwords import dummy_verify, hash_password, verify_password
from .service import (
    load_group_names,
    safe_next_url,
    update_user_profile,
    user_to_me_out,
)

logger: structlog.stdlib.BoundLogger = structlog.get_logger(__name__)

router = APIRouter(prefix="/auth", tags=["auth"])

# Session key for the authenticated user id.
_USER_SESSION_KEY = "user_id"
# Session key for the OIDC provider that authenticated the current session.
_OIDC_PROVIDER_SESSION_KEY = "oidc_provider"
# Session key used to store the post-login return URL between /login and /callback.
_AUTH_NEXT_SESSION_KEY = "auth_next"


def _build_callback_redirect_uri(request: Request, settings: Settings) -> str:
    """Build the absolute callback redirect_uri for the OIDC flow.

    Returns OIDC_REDIRECT_URI verbatim when set; otherwise infers the URL from the
    request. ``request.url_for`` honors ``X-Forwarded-Proto`` for the scheme and the
    proxy-preserved ``Host`` when uvicorn runs with ``--proxy-headers``. The inferred
    value is logged so operators can register it with identity providers.

    Args:
        request: The current Starlette request.
        settings: Application settings.

    Returns:
        The absolute callback redirect_uri string.
    """
    if settings.OIDC_REDIRECT_URI:
        return settings.OIDC_REDIRECT_URI
    redirect_uri = str(request.url_for("auth_callback"))
    logger.info("OIDC callback redirect_uri (inferred): %s", redirect_uri)
    return redirect_uri


def _absolute_login_url(request: Request, settings: Settings) -> str:
    """Absolute URL of the SPA login page for post-logout redirects.

    Derived from OIDC_REDIRECT_URI by replacing the trailing ``/auth/callback`` with
    ``/login`` when set; otherwise derived from the request base URL combined with
    URL_PREFIX and ``/login``.

    Args:
        request: The current Starlette request.
        settings: Application settings.

    Returns:
        The absolute SPA login page URL.
    """
    if settings.OIDC_REDIRECT_URI:
        return settings.OIDC_REDIRECT_URI.removesuffix("/auth/callback") + "/login"
    return f"{str(request.base_url).rstrip('/')}{settings.URL_PREFIX}/login"


# ---------------------------------------------------------------------------
# Provider discovery
# ---------------------------------------------------------------------------


@router.get("/providers", response_model=AuthProvidersOut)
async def list_providers(settings: AppSettings, registry: OidcRegistry) -> AuthProvidersOut:
    """Public description of available login methods.

    Returns the list of configured OIDC providers (id and display_name only),
    whether self-service registration is enabled, and the default provider id
    for automatic login (null when not configured). Requires no authentication.
    """
    return AuthProvidersOut(
        registration_enabled=bool(settings.AUTH_REGISTRATION_ENABLED),
        providers=[
            AuthProviderInfo(id=p.id, display_name=p.display_name) for p in registry.values()
        ],
    )


# ---------------------------------------------------------------------------
# Local auth: register / login / logout
# ---------------------------------------------------------------------------


@router.post("/register", status_code=201, response_model=MeOut)
async def register(
    request: Request,
    body: RegisterIn,
    response: Response,
    db: DbSession,
    settings: AppSettings,
) -> MeOut:
    """Register a new local user.

    Gated on AUTH_REGISTRATION_ENABLED (403 when disabled) and PASSWORD_MIN_LENGTH (422).
    """
    if not settings.AUTH_REGISTRATION_ENABLED:
        raise ProblemDetailsException(
            status_code=403,
            detail="User registration is currently disabled.",
        )
    if len(body.password) < settings.PASSWORD_MIN_LENGTH:
        raise ProblemDetailsException(
            status_code=422,
            detail=f"Password must be at least {settings.PASSWORD_MIN_LENGTH} characters long.",
        )

    password_hash = hash_password(body.password, settings)
    now = datetime.now(UTC)
    user = User(
        username=body.username,
        email=str(body.email),
        auth_provider="local",
        external_subject=None,
        password_hash=password_hash,
        is_active=True,
        is_superuser=False,
        created_at=now,
        updated_at=now,
    )
    db.add(user)
    try:
        await db.flush()
    except IntegrityError as exc:
        raise ProblemDetailsException(
            status_code=409,
            detail="Username or email is already taken.",
        ) from exc
    response.status_code = 201
    return user_to_me_out(user, [], 0.0)


@router.post("/login", response_model=LoginOut)
async def login(
    request: Request,
    body: LoginIn,
    db: DbSession,
    settings: AppSettings,
) -> LoginOut:
    """Authenticate a local user with username and password.

    Returns a single 401 "Invalid credentials" for any combination of unknown
    user / disabled account / wrong password so attackers cannot use response
    timing or wording to probe state.
    """
    result = await db.execute(
        select(User).where(User.username == body.username, User.auth_provider == "local")
    )
    user = result.scalar_one_or_none()

    # Always run a verify_password (or equivalent-cost dummy) before any
    # is_active / not-found branching so all failure paths take the same time.
    if user is None:
        dummy_verify(settings)
        password_ok = False
    else:
        password_ok = verify_password(body.password, user.password_hash or "", settings)

    if user is None or not user.is_active or not password_ok:
        raise ProblemDetailsException(
            status_code=401,
            detail="Invalid credentials.",
        )

    request.session[_USER_SESSION_KEY] = user.id
    request.session.pop(_OIDC_PROVIDER_SESSION_KEY, None)
    groups = await load_group_names(db, user.id)
    destination = safe_next_url(
        request.session.pop(_AUTH_NEXT_SESSION_KEY, None), settings.URL_PREFIX
    )
    return LoginOut(**user_to_me_out(user, groups, 0.0).model_dump(), next=destination)


@router.get("/logout")
async def logout(
    request: Request,
    settings: AppSettings,
    registry: OidcRegistry,
) -> Response:
    """Clear the session and perform single sign-out per resolution order.

    Reads the OIDC provider from the session, clears the session unconditionally,
    then redirects to the provider's end-session endpoint (if available) or the
    local SPA login page.
    """
    provider_id = request.session.get(_OIDC_PROVIDER_SESSION_KEY)
    provider = registry.get(provider_id) if provider_id else None
    login_page = f"{settings.URL_PREFIX}/login"
    request.session.clear()

    if provider is not None:
        end_session_url = await provider.resolve_logout_url(_absolute_login_url(request, settings))
        if end_session_url:
            return RedirectResponse(url=end_session_url, status_code=302)

    return RedirectResponse(url=login_page, status_code=302)


# ---------------------------------------------------------------------------
# External auth: server-side Authorization Code Flow
# ---------------------------------------------------------------------------


@router.get("/login/{provider_id}")
async def oidc_login(
    provider_id: str,
    request: Request,
    settings: AppSettings,
    registry: OidcRegistry,
    next_url: str | None = Query(default=None, alias="next"),
) -> Response:
    """Begin the OIDC Authorization Code Flow for a configured provider.

    Validates provider presence before any provider interaction. Stores the
    provider id and validated next URL in the session, then redirects the user
    to the identity provider's authorization endpoint with PKCE (S256).

    Args:
        provider_id: The configured OIDC provider identifier.
        request: The incoming request (used for session and url_for).
        settings: Injected application settings.
        registry: The cached OIDC provider registry.
        next_url: Optional same-origin path to redirect to after login.

    Returns:
        A redirect response to the identity provider's authorization endpoint.

    Raises:
        ProblemDetailsException: 404 when the provider is not configured;
            502 when the provider is unreachable.
    """
    provider = registry.get(provider_id)
    if provider is None:
        raise ProblemDetailsException(
            status_code=404,
            detail=(
                f"Identity provider '{provider_id}' is not configured. "
                f"Please contact your administrator."
            ),
        )

    request.session[_OIDC_PROVIDER_SESSION_KEY] = provider_id
    request.session[_AUTH_NEXT_SESSION_KEY] = safe_next_url(next_url, settings.URL_PREFIX)

    redirect_uri = _build_callback_redirect_uri(request, settings)
    try:
        return await provider.authorize_redirect(request, redirect_uri)
    except ExternalAuthError as exc:
        raise ProblemDetailsException(
            status_code=502,
            detail="The identity provider is currently unavailable. Please try again.",
        ) from exc


@router.get("/callback", name="auth_callback")
async def oidc_callback(
    request: Request,
    db: DbSession,
    settings: AppSettings,
    registry: OidcRegistry,
) -> RedirectResponse:
    """Complete the OIDC flow, provision the user, and establish the session.

    The identity provider redirects here with ?code=...&state=... after the
    user authenticates. The backend reads the provider id from the session,
    exchanges the code for tokens via authlib (which validates state, nonce,
    and the ID-token signature), JIT-provisions a User, and redirects to the
    validated post-login destination.

    Args:
        request: The incoming request (carries session and callback query params).
        db: Injected async database session.
        settings: Injected application settings.
        registry: The cached OIDC provider registry.
    """
    provider_id = request.session.get(_OIDC_PROVIDER_SESSION_KEY)
    if not provider_id:
        raise ProblemDetailsException(
            status_code=400,
            detail="No active sign-in was found. Please start the login process again.",
        )

    provider = registry.get(provider_id)
    if provider is None:
        raise ProblemDetailsException(
            status_code=400,
            detail="The sign-in session is no longer valid. Please start the login again.",
        )

    try:
        claims = await provider.complete(request)
    except ExternalAuthError as exc:
        raise ProblemDetailsException(
            status_code=401,
            detail="Authentication failed. Please try signing in again.",
        ) from exc

    user = await jit_provision(db, claims, provider.auth_provider_value, provider.username_claim)

    if not user.is_active:
        raise ProblemDetailsException(
            status_code=403,
            detail="Your account is deactivated. Please contact your administrator.",
        )

    request.session[_USER_SESSION_KEY] = user.id
    request.session[_OIDC_PROVIDER_SESSION_KEY] = provider_id
    destination = safe_next_url(
        request.session.pop(_AUTH_NEXT_SESSION_KEY, None), settings.URL_PREFIX
    )
    return RedirectResponse(url=destination, status_code=302)


# ---------------------------------------------------------------------------
# Me
# ---------------------------------------------------------------------------


@router.get("/me", response_model=MeOut)
async def me(current_user: CurrentUser, db: DbSession) -> MeOut:
    """Return the authenticated user's profile."""
    groups = await load_group_names(db, current_user.id)
    usage = await get_monthly_spend(db, current_user.id)
    return user_to_me_out(current_user, groups, usage)


@router.patch("/me", response_model=MeOut)
async def patch_me(current_user: CurrentUser, body: MePatchIn, db: DbSession) -> MeOut:
    """Update the authenticated user's profile fields.

    Applies only the non-``None`` fields from the request body to the current
    user. Unauthenticated requests are rejected with 401 by the ``CurrentUser``
    dependency before this handler runs. Field-length violations are rejected
    with 422 by Pydantic before this handler runs.

    Args:
        current_user: The authenticated user, resolved by the ``CurrentUser`` dependency.
        body: Patch payload containing the optional profile fields to update.
        db: Injected async database session.

    Returns:
        The updated user profile as a ``MeOut`` response.
    """
    updated_user = await update_user_profile(db, current_user, body)
    groups = await load_group_names(db, updated_user.id)
    usage = await get_monthly_spend(db, updated_user.id)
    return user_to_me_out(updated_user, groups, usage)
