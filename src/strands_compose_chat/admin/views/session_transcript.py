"""Admin transcript view — renders a full chat session as a readable conversation.

A custom ``BaseView`` exposed at ``{base_url}/session-transcript/{pk}`` that
loads one ``ChatSession`` with all its messages and renders them top-to-bottom
as chat bubbles. It exists because the per-message admin list forces operators
to inspect one message at a time, which makes reviewing a whole conversation
(final answers, where a turn errored, how the user reacted) painful.
"""

from typing import Any

import structlog
from fastapi import Request
from sqladmin import BaseView, expose
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from starlette.responses import RedirectResponse, Response

from ...config import get_settings
from ...db.base import AsyncSessionLocal
from ...db.models import ChatSession
from .base import _format_datetime

logger: structlog.stdlib.BoundLogger = structlog.get_logger(__name__)


def _build_message(message: Any) -> dict[str, Any]:
    """Extract a message ORM row into a plain dict for template rendering.

    Values are copied out while the database session is still open so the
    template never touches a detached ORM instance.

    Args:
        message: A ``ChatMessage`` ORM row.

    Returns:
        A dict with role, content, seq, is_success, created_at (formatted), and
        a normalised list of attachment dicts.
    """
    raw_attachments = message.attachments or []
    attachments = [
        {
            "filename": item.get("filename", "upload"),
            "size": item.get("size", 0),
            "type": item.get("type", "document"),
        }
        for item in raw_attachments
        if isinstance(item, dict)
    ]
    return {
        "role": message.role,
        "content": message.content,
        "seq": message.seq,
        "is_success": message.is_success,
        "created_at": _format_datetime(message.created_at),
        "attachments": attachments,
    }


class SessionTranscriptView(BaseView):
    """Full-page chat transcript for a single session, rendered inside admin.

    Registered via ``admin.add_base_view(SessionTranscriptView)`` in ``app.py``
    and reached from the "View transcript" action on ``ChatSessionAdmin``.
    sqladmin wraps the exposed handler in ``login_required``, so the route is
    behind the admin authentication gate like every other admin page. The view
    is hidden from the sidebar — it is only meaningful for a specific session.
    """

    name = "Session Transcript"
    icon = "fa-solid fa-comments"

    def is_visible(self, request: Request) -> bool:
        """Hide this view from the sidebar navigation."""
        return False

    @expose(
        "/session-transcript/{pk}",
        methods=["GET"],
        identity="session-transcript",
        include_in_schema=False,
    )
    async def transcript(self, request: Request) -> Response:
        """Render the transcript for the session identified by the ``pk`` path param.

        Loads the session with its owner, agent, and messages eagerly, sorts the
        messages by ``seq``, and renders them as a conversation. When no session
        matches the ``pk``, redirects back to the chat session list.

        Args:
            request: The current Starlette request; ``pk`` path param holds the
                ``ChatSession.id`` primary key.

        Returns:
            An HTML response rendering ``session_transcript.html``, or a redirect
            to the session list when the session is not found.
        """
        pk = request.path_params["pk"]

        async with AsyncSessionLocal() as db:
            result = await db.execute(
                select(ChatSession)
                .where(ChatSession.id == pk)
                .options(
                    selectinload(ChatSession.user),
                    selectinload(ChatSession.agent),
                    selectinload(ChatSession.messages),
                )
            )
            session = result.scalar_one_or_none()

            if session is None:
                logger.info("transcript requested for unknown session", session_pk=pk)
                return RedirectResponse(
                    url=str(request.url_for("admin:list", identity="chat-session")),
                    status_code=302,
                )

            header = {
                "session_id": session.session_id,
                "title": session.title,
                "username": str(session.user) if session.user is not None else session.user_id,
                "agent_name": str(session.agent) if session.agent is not None else session.agent_id,
                "created_at": _format_datetime(session.created_at),
                "last_used_at": _format_datetime(session.last_used_at),
                "is_archived": session.is_archived,
            }
            messages = [_build_message(m) for m in sorted(session.messages, key=lambda m: m.seq)]

        context = {
            "url_prefix": get_settings().URL_PREFIX,
            "title": session.title or "Chat transcript",
            "subtitle": header["session_id"],
            "header": header,
            "messages": messages,
            "back_url": str(request.url_for("admin:details", identity="chat-session", pk=pk)),
        }
        return await self.templates.TemplateResponse(request, "session_transcript.html", context)
