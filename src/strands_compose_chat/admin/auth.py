"""sqladmin AuthenticationBackend and shared admin identity resolution.

Two independent identities grant access:

1. A dedicated admin-panel login (``/admin/login``) that authenticates an active
   local superuser against its password hash. Works regardless of external OIDC
   configuration so an operator can always reach the panel.

2. The application session cookie, when it belongs to an active superuser.
   Lets a superuser authenticated via OIDC reach the panel without a second login.

``resolve_admin_user`` is the single source of truth for admin identity resolution,
shared by both ``AdminAuthBackend`` and the FastAPI ``get_admin_user`` dependency.
"""

import structlog
from fastapi import Request, Response
from fastapi.responses import RedirectResponse
from sqladmin.authentication import AuthenticationBackend
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..auth.passwords import dummy_verify, verify_password
from ..config import Settings
from ..db.base import AsyncSessionLocal
from ..db.models import User

logger: structlog.stdlib.BoundLogger = structlog.get_logger(__name__)

_ADMIN_SESSION_KEY = "admin_user_id"
_USER_SESSION_KEY = "user_id"


async def resolve_admin_user(request: Request, db: AsyncSession) -> User | None:
    """Return the active superuser from either admin session or app session.

    Checks request.session["admin_user_id"] first. If absent or stale, falls
    back to request.session["user_id"] + is_superuser check. Returns None
    when neither path yields an active superuser.

    Args:
        request: The incoming FastAPI/Starlette request.
        db: Async database session.

    Returns:
        Active superuser User instance, or None.
    """
    admin_user_id = request.session.get(_ADMIN_SESSION_KEY)
    if admin_user_id:
        result = await db.execute(select(User).where(User.id == str(admin_user_id)))
        user = result.scalar_one_or_none()
        if user and user.is_active and user.is_superuser:
            return user

    user_id = request.session.get(_USER_SESSION_KEY)
    if user_id:
        result = await db.execute(select(User).where(User.id == str(user_id)))
        user = result.scalar_one_or_none()
        if user and user.is_active and user.is_superuser:
            return user

    return None


class AdminAuthBackend(AuthenticationBackend):
    """sqladmin AuthenticationBackend enforcing superuser access."""

    def __init__(self, settings: Settings) -> None:
        super().__init__(secret_key=settings.SESSION_SECRET_KEY)
        # Don't install a second SessionMiddleware on the admin sub-app.
        # Two nested instances share scope["session"]; the inner one emptying it
        # causes the outer send_wrapper to clear the main session cookie on logout.
        self.middlewares = []
        self._settings = settings

    @property
    def _login_url(self) -> str:
        return f"{self._settings.URL_PREFIX}/admin/login"

    async def login(self, request: Request) -> bool:
        """Authenticate an active local superuser from the admin login form.

        ``dummy_verify`` runs when no matching user is found so all failure
        paths take the same time, preventing username enumeration via timing.
        """
        form = await request.form()
        username = str(form.get("username") or "")
        password = str(form.get("password") or "")

        user = await self._load_local_superuser(username)
        if user is None:
            dummy_verify(self._settings)
            password_ok = False
        else:
            password_ok = verify_password(password, user.password_hash or "", self._settings)

        if user is None or not password_ok:
            logger.warning("Admin login failed", username=username)
            return False

        request.session[_ADMIN_SESSION_KEY] = user.id
        logger.info("Admin login succeeded", user_id=user.id, username=user.username)
        return True

    async def logout(self, request: Request) -> Response:
        """Pop only the admin session entry; the application SSO identity is left intact."""
        request.session.pop(_ADMIN_SESSION_KEY, None)
        return RedirectResponse(url=self._login_url, status_code=302)

    async def authenticate(self, request: Request) -> Response | bool:
        """Grant access via the admin session or the app session (superuser only)."""
        async with AsyncSessionLocal() as db:
            user = await resolve_admin_user(request, db)
        return user is not None

    async def _load_local_superuser(self, username: str) -> User | None:
        """Return an active local superuser by username, or None."""
        if not username:
            return None

        async with AsyncSessionLocal() as db:
            result = await db.execute(
                select(User).where(
                    User.username == username,
                    User.auth_provider == "local",
                )
            )
            user = result.scalar_one_or_none()

        if user is None or not user.is_active or not user.is_superuser:
            return None
        return user
