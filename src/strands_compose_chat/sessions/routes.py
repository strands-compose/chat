"""Session management routes."""

from fastapi import APIRouter, Query

from ..analytics.service import get_session_usage_summary
from ..auth.current_user import CurrentUser
from ..deps import AppSettings, DbSession
from ..errors import ProblemDetailsException
from ..schemas.sessions import (
    MessageOut,
    SessionDetailOut,
    SessionListItemOut,
    SessionRenameIn,
    SessionUsageSummaryOut,
)
from .service import (
    archive_user_session,
    get_user_session,
    list_session_messages,
    list_user_sessions,
    rename_user_session,
)

router = APIRouter(prefix="/sessions", tags=["sessions"])


def _not_found(session_id: str) -> ProblemDetailsException:
    return ProblemDetailsException(
        status_code=404,
        detail=f"Session '{session_id}' not found.",
    )


@router.get("", response_model=list[SessionListItemOut])
async def list_sessions(
    current_user: CurrentUser,
    db: DbSession,
    settings: AppSettings,
    limit: int = Query(default=50, ge=1),
    offset: int = Query(default=0, ge=0),
) -> list[SessionListItemOut]:
    """Return all non-archived sessions for the authenticated user, newest first."""
    limit = min(limit, settings.CHAT_SESSION_MAX_PAGE_SIZE)
    sessions = await list_user_sessions(db, current_user.id, limit=limit, offset=offset)
    return [
        SessionListItemOut.model_validate(session, from_attributes=True) for session in sessions
    ]


@router.get("/{session_id}", response_model=SessionDetailOut)
async def get_session(
    session_id: str,
    current_user: CurrentUser,
    db: DbSession,
) -> SessionDetailOut:
    """Return the full detail for a single session owned by the authenticated user."""
    session = await get_user_session(db, current_user.id, session_id)
    if session is None:
        raise _not_found(session_id)
    return SessionDetailOut.model_validate(session, from_attributes=True)


@router.patch("/{session_id}", response_model=SessionDetailOut)
async def rename_session(
    session_id: str,
    body: SessionRenameIn,
    current_user: CurrentUser,
    db: DbSession,
) -> SessionDetailOut:
    """Rename the title of a session owned by the authenticated user."""
    session = await rename_user_session(db, current_user.id, session_id, body.title)
    if session is None:
        raise _not_found(session_id)
    return SessionDetailOut.model_validate(session, from_attributes=True)


@router.get("/{session_id}/messages", response_model=list[MessageOut])
async def list_messages(
    session_id: str,
    current_user: CurrentUser,
    db: DbSession,
) -> list[MessageOut]:
    """Return all messages for a session owned by the authenticated user.

    Messages are returned in ascending ``seq`` order. An empty list is returned
    when the session exists but has no stored messages.

    Args:
        session_id: The session identifier from the URL path.
        current_user: The authenticated user resolved by the ``CurrentUser``
            dependency; raises HTTP 401 when unauthenticated.
        db: The active async database session.

    Returns:
        A list of :class:`~..schemas.sessions.MessageOut` items ordered by
        ascending ``seq``.

    Raises:
        ProblemDetailsException: HTTP 404 when the session does not exist or
            is not owned by the authenticated user.
    """
    session = await get_user_session(db, current_user.id, session_id)
    if session is None:
        raise _not_found(session_id)
    messages = await list_session_messages(db, session.id)
    return [MessageOut.model_validate(message, from_attributes=True) for message in messages]


@router.delete("/{session_id}", status_code=204)
async def delete_session(
    session_id: str,
    current_user: CurrentUser,
    db: DbSession,
) -> None:
    """Soft-delete (archive) a session owned by the authenticated user."""
    deleted = await archive_user_session(db, current_user.id, session_id)
    if not deleted:
        raise _not_found(session_id)
    return None


@router.get("/{session_id}/usage", response_model=SessionUsageSummaryOut)
async def get_usage(
    session_id: str,
    current_user: CurrentUser,
    db: DbSession,
) -> SessionUsageSummaryOut:
    """Return the aggregated token usage and total cost for a session.

    Runs a single query that sums ``input_tokens``, ``output_tokens``, and
    ``cost`` across all ``token_usage`` rows for the session. All fields are
    ``0`` / ``0.0`` when no invocations have been recorded yet.

    Args:
        session_id: The session identifier from the URL path.
        current_user: The authenticated user resolved by the ``CurrentUser``
            dependency; raises HTTP 401 when unauthenticated.
        db: The active async database session.

    Returns:
        A :class:`~..schemas.sessions.SessionUsageSummaryOut` with
        ``input_tokens``, ``output_tokens``, and ``total_cost``.

    Raises:
        ProblemDetailsException: HTTP 404 when the session does not exist or
            is not owned by the authenticated user.
    """
    session = await get_user_session(db, current_user.id, session_id)
    if session is None:
        raise _not_found(session_id)
    input_tokens, output_tokens, total_cost = await get_session_usage_summary(db, session.id)
    return SessionUsageSummaryOut(
        input_tokens=input_tokens,
        output_tokens=output_tokens,
        total_cost=total_cost,
    )
