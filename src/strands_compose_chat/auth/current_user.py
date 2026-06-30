"""Session and API-key identity resolution for protected routes.

Browser users are identified by the signed session cookie (``user_id``
key, written at login). Programmatic callers authenticate with a
``Bearer sck_…`` API key. Both planes resolve to an active ``User``
and set ``request.state.user_id`` for downstream middleware.
"""

from typing import Annotated

import structlog
from fastapi import Depends, Request
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..admin.auth import resolve_admin_user
from ..db.models import User
from ..deps import get_db
from ..errors import ProblemDetailsException
from .api_key import KEY_PREFIX, resolve_api_key

logger: structlog.stdlib.BoundLogger = structlog.get_logger(__name__)

_USER_SESSION_KEY = "user_id"


def _bearer_api_key(request: Request) -> str | None:
    """Return the bearer credential when it is an API key (sck_), else None.

    A bearer token that is present but does NOT start with the ``sck_``
    prefix causes a 401 — it never falls back to the session.

    Args:
        request: The incoming FastAPI/Starlette request.

    Returns:
        The raw API-key string, or None when no Authorization header is
        present.

    Raises:
        ProblemDetailsException: With status 401 when the bearer credential
            is present but not an API key.
    """
    header = request.headers.get("Authorization", "")
    if not header.startswith("Bearer "):
        return None
    token = header[len("Bearer ") :].strip()
    if not token:
        return None
    if token.startswith(KEY_PREFIX):
        return token
    raise ProblemDetailsException(status_code=401, detail="Authentication required")


async def _resolve_session_user(request: Request, db: AsyncSession) -> User | None:
    """Return the active user referenced by the session cookie, or None.

    Reads ``request.session["user_id"]`` without writing, so
    ``SessionMiddleware`` never emits a ``Set-Cookie`` from this path.

    Args:
        request: The incoming FastAPI/Starlette request.
        db: Async database session.

    Returns:
        The active User ORM instance, or None when the session has no
        user_id or the user is missing/inactive.
    """
    user_id = request.session.get(_USER_SESSION_KEY)
    if not user_id:
        return None
    result = await db.execute(select(User).where(User.id == str(user_id)))
    user = result.scalar_one_or_none()
    if user is None or not user.is_active:
        logger.warning(
            "session user missing or inactive",
            user_id=str(user_id),
            found=user is not None,
        )
        return None
    request.state.user_id = user.id
    return user


async def get_current_user(
    request: Request,
    db: AsyncSession = Depends(get_db),
) -> User:
    """FastAPI dependency: resolve the browser-authenticated user (session only).

    Raises ``ProblemDetailsException(401)`` when the session does not
    carry an active user — never leaks the reason.

    Args:
        request: The incoming FastAPI/Starlette request.
        db: Injected async database session.

    Returns:
        The active User ORM instance for the authenticated caller.

    Raises:
        ProblemDetailsException: With status 401 on any authentication failure.
    """
    user = await _resolve_session_user(request, db)
    if user is None:
        logger.warning(
            "get_current_user: no session identity",
            session_present=bool(request.session.get(_USER_SESSION_KEY)),
        )
        raise ProblemDetailsException(status_code=401, detail="Authentication required")
    return user


async def get_api_key_or_session_user(
    request: Request,
    db: AsyncSession = Depends(get_db),
) -> User:
    """FastAPI dependency: resolve an API-key or browser session user.

    Checks for a ``Bearer sck_…`` credential first; if absent, falls back
    to the session cookie. Raises 401 when neither plane resolves.

    Args:
        request: The incoming FastAPI/Starlette request.
        db: Injected async database session.

    Returns:
        The active User ORM instance for the authenticated caller.

    Raises:
        ProblemDetailsException: With status 401 on any authentication failure.
    """
    api_key = _bearer_api_key(request)
    if api_key is not None:
        return await resolve_api_key(api_key, request, db)
    user = await _resolve_session_user(request, db)
    if user is None:
        logger.warning(
            "get_api_key_or_session_user: no identity resolved",
            session_present=bool(request.session.get(_USER_SESSION_KEY)),
            has_bearer=bool(request.headers.get("Authorization")),
        )
        raise ProblemDetailsException(status_code=401, detail="Authentication required")
    return user


CurrentUser = Annotated[User, Depends(get_current_user)]
ApiKeyOrSessionUser = Annotated[User, Depends(get_api_key_or_session_user)]


async def get_admin_user(
    request: Request,
    db: AsyncSession = Depends(get_db),
) -> User:
    """FastAPI dependency: resolve an active superuser or raise 401.

    Args:
        request: The incoming FastAPI/Starlette request.
        db: Injected async database session.

    Returns:
        The active superuser User instance.

    Raises:
        ProblemDetailsException: HTTP 401 when no active superuser is found.
    """
    user = await resolve_admin_user(request, db)
    if user is None:
        raise ProblemDetailsException(status_code=401, detail="Authentication required")
    return user


AdminUser = Annotated[User, Depends(get_admin_user)]


async def get_optional_session_user(request: Request, db: AsyncSession) -> User | None:
    """Return the active session user without raising on absence.

    Suitable for page-level auth gates that need to check identity without
    forcing a 401 response. Delegates entirely to the existing private resolver
    so no query or session-reading logic is duplicated.

    Args:
        request: The incoming FastAPI/Starlette request.
        db: Async database session.

    Returns:
        The active User ORM instance, or None when the session has no valid user.
    """
    return await _resolve_session_user(request, db)
