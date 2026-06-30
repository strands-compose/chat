"""Session service for chat_sessions CRUD operations."""

from datetime import UTC, datetime
from typing import Any

from sqlalchemy import func, select, update
from sqlalchemy.ext.asyncio import AsyncSession

from ..db.models import ChatSession
from ..db.models.chat_message import ChatMessage
from ..errors import ProblemDetailsException

_TITLE_MAX_LENGTH = 64
_TITLE_TRUNCATE_AT = 61


def _derive_title(prompt: Any) -> str | None:
    """Derive a session title from the first user prompt.

    Extracts plain text from the prompt (string, dict, or list of content
    blocks) and truncates to 64 characters, appending ``…`` when truncated.

    Args:
        prompt: Raw prompt value from ``InvocationJsonIn``.

    Returns:
        A non-empty title string, or ``None`` when no text can be extracted.
    """
    if isinstance(prompt, str):
        text = prompt.strip()
    elif isinstance(prompt, dict):
        text = str(prompt.get("text", "")).strip()
    elif isinstance(prompt, list):
        for block in prompt:
            if isinstance(block, dict) and block.get("text"):
                text = str(block["text"]).strip()
                break
        else:
            return None
    else:
        return None

    if not text:
        return None
    if len(text) <= _TITLE_MAX_LENGTH:
        return text
    return text[:_TITLE_TRUNCATE_AT] + "…"


async def list_user_sessions(
    db: AsyncSession,
    user_id: str,
    *,
    limit: int = 50,
    offset: int = 0,
) -> list[ChatSession]:
    """Return non-archived sessions for *user_id*, newest first."""
    result = await db.execute(
        select(ChatSession)
        .where(
            ChatSession.user_id == user_id,
            ChatSession.is_archived.is_(False),
        )
        .order_by(ChatSession.last_used_at.desc())
        .limit(limit)
        .offset(offset)
    )
    return list(result.scalars().all())


async def get_user_session(
    db: AsyncSession,
    user_id: str,
    session_id: str,
) -> ChatSession | None:
    """Return a single non-archived session owned by *user_id*, or None."""
    result = await db.execute(
        select(ChatSession).where(
            ChatSession.session_id == session_id,
            ChatSession.user_id == user_id,
            ChatSession.is_archived.is_(False),
        )
    )
    return result.scalar_one_or_none()


async def rename_user_session(
    db: AsyncSession,
    user_id: str,
    session_id: str,
    title: str,
) -> ChatSession | None:
    """Set *title* on the session and return the updated row, or None."""
    session = await get_user_session(db, user_id, session_id)
    if session is None:
        return None
    session.title = title
    await db.flush()
    return session


async def archive_user_session(
    db: AsyncSession,
    user_id: str,
    session_id: str,
) -> bool:
    """Archive the session (is_archived=True). Returns True if found."""
    session = await get_user_session(db, user_id, session_id)
    if session is None:
        return False
    session.is_archived = True
    await db.flush()
    return True


async def touch_last_used(db: AsyncSession, session_id: str) -> None:
    """Update last_used_at to the current UTC time for *session_id*."""
    await db.execute(
        update(ChatSession)
        .where(ChatSession.session_id == session_id)
        .values(last_used_at=datetime.now(UTC))
    )


async def lock_or_create(
    db: AsyncSession,
    user_id: str,
    session_id: str,
    agent_id: str | None,
    prompt: Any = None,
) -> tuple[ChatSession, bool]:
    """Implement the pre-stream session lock decision table.

    Returns ``(ChatSession, is_new)`` where ``is_new`` is ``True`` when a new
    row was inserted and ``False`` when an existing row was resumed.

    The *prompt* is used to derive an automatic title for new sessions from
    the first 64 characters of the user message.

    Raises:
        ProblemDetailsException: HTTP 409 for cross-user or agent-lock
            conflicts; HTTP 422 when agent_id is absent for a new session.
    """
    result = await db.execute(select(ChatSession).where(ChatSession.session_id == session_id))
    existing: ChatSession | None = result.scalar_one_or_none()

    if existing is not None:
        if existing.user_id != user_id:
            raise ProblemDetailsException(
                status_code=409,
                detail="session belongs to a different user",
            )
        if agent_id is not None and existing.agent_id != agent_id:
            raise ProblemDetailsException(
                status_code=409,
                detail="session is locked to a different agent",
            )
        return existing, False

    if agent_id is None:
        raise ProblemDetailsException(
            status_code=422,
            detail="agent_id is required when starting a new session",
        )

    now = datetime.now(UTC)
    new_session = ChatSession(
        user_id=user_id,
        session_id=session_id,
        agent_id=agent_id,
        manifest=None,
        manifest_captured_at=None,
        title=_derive_title(prompt),
        created_at=now,
        last_used_at=now,
        is_archived=False,
    )
    db.add(new_session)
    await db.flush()
    return new_session, True


async def next_seq(db: AsyncSession, chat_session_id: str) -> int:
    """Return the next sequence number for a session's messages.

    Queries ``max(seq)`` for all messages belonging to *chat_session_id* and
    returns that value plus one. Returns ``1`` when the session has no
    messages yet.

    Args:
        db: The active async database session.
        chat_session_id: The primary key of the owning ``chat_sessions`` row.

    Returns:
        An integer >= 1 that is one greater than the current maximum ``seq``,
        or ``1`` when no messages exist for the session.
    """
    result = await db.execute(
        select(func.max(ChatMessage.seq)).where(ChatMessage.chat_session_id == chat_session_id)
    )
    current_max: int | None = result.scalar_one_or_none()
    if current_max is None:
        return 1
    return current_max + 1


async def list_session_messages(
    db: AsyncSession,
    chat_session_id: str,
) -> list[ChatMessage]:
    """Return all messages for a session ordered by ``seq`` ascending.

    Args:
        db: The active async database session.
        chat_session_id: The primary key of the owning ``chat_sessions`` row.

    Returns:
        A list of :class:`~..db.models.chat_message.ChatMessage` rows in
        ascending ``seq`` order; an empty list when the session has no
        messages.
    """
    result = await db.execute(
        select(ChatMessage)
        .where(ChatMessage.chat_session_id == chat_session_id)
        .order_by(ChatMessage.seq.asc())
    )
    return list(result.scalars().all())
