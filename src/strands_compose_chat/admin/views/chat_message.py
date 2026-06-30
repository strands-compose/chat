"""Admin view for the ChatMessage model."""

import json
from typing import Any

from fastapi import Request
from markupsafe import Markup
from sqlalchemy import String, cast, or_
from sqlalchemy.orm import selectinload

from ...db.models import Agent, ChatMessage, ChatSession, User
from .base import BaseModelView


def _format_content(model: object, _prop: object) -> object:
    """Render message content in a scrollable pre block."""
    value = getattr(model, "content", None)
    if not value:
        return ""
    return Markup(  # nosec B704 — content is stored text, rendered inside a pre tag with no HTML
        f'<pre style="margin:0;padding:8px;background:var(--tblr-secondary-bg);'
        f"border:1px solid var(--tblr-border-color);"
        f"border-radius:4px;max-height:400px;overflow:auto;color:var(--tblr-body-color);"
        f'font-size:0.8em;white-space:pre-wrap;">{value}</pre>'
    )


def _format_attachments(model: object, _prop: object) -> object:
    """Pretty-print the manifest JSON in a scrollable <pre> block."""
    value = getattr(model, "attachments", None)
    if value is None:
        return ""
    try:
        text = json.dumps(value, indent=2, ensure_ascii=False)
    except (TypeError, ValueError):
        text = str(value)
    return Markup(  # nosec B704 — attachments is backend-generated JSON, not user HTML
        f'<pre style="margin:0;padding:8px;background:var(--tblr-secondary-bg);'
        f"border:1px solid var(--tblr-border-color);"
        f"border-radius:4px;max-height:400px;overflow:auto;color:var(--tblr-body-color);"
        f'font-size:0.8em;white-space:pre;">{text}</pre>'
    )


def _format_role(model: object, _prop: object) -> object:
    """Render role as a colored badge."""
    role = getattr(model, "role", None)
    if role == "user":
        color = "#0d6efd"
    elif role == "assistant":
        color = "#198754"
    else:
        color = "#6c757d"
    label = (role or "—").capitalize()
    return Markup(  # nosec B704 — role is a backend-controlled enum value
        f'<span style="display:inline-block;padding:2px 8px;border-radius:4px;'
        f"background:{color};color:#fff;font-size:0.8em;"
        f'font-weight:600;">{label}</span>'
    )


class ChatMessageAdmin(BaseModelView, model=ChatMessage):
    """Read-only admin view for chat messages.

    Messages are written by the application, not by admins.  Create, edit,
    and delete are all disabled — the view is strictly for inspection.

    The search box matches against the username of the session owner and the
    name of the agent used in the session, joining through ``chat_session``.
    """

    name = "Chat Message"
    name_plural = "Chat Messages"
    icon = "fa-solid fa-message"

    can_create = False
    can_edit = False
    can_delete = False

    column_list = [
        ChatMessage.role,
        ChatMessage.is_success,
        ChatMessage.seq,
        ChatMessage.chat_session,
        ChatMessage.created_at,
    ]
    column_details_list = [
        ChatMessage.id,
        ChatMessage.chat_session,
        ChatMessage.role,
        ChatMessage.is_success,
        ChatMessage.seq,
        ChatMessage.content,
        ChatMessage.attachments,
        ChatMessage.created_at,
    ]

    # Needs at least one entry so sqladmin renders the search bar.
    # Actual search logic is in search_query — this list is not used for querying.
    column_searchable_list = [ChatMessage.id]
    column_default_sort = [(ChatMessage.created_at, True)]

    column_formatters = {ChatMessage.role: _format_role}
    column_formatters_detail = {
        ChatMessage.role: _format_role,
        ChatMessage.content: _format_content,
        ChatMessage.attachments: _format_attachments,
    }

    def search_placeholder(self) -> str:  # type: ignore[override]
        """Return a human-readable placeholder describing what can be searched."""
        return "username, agent name"

    def search_query(self, stmt: Any, term: str) -> Any:
        """Search messages by session owner username or session agent name.

        Joins ``chat_session → user`` and ``chat_session → agent`` so a single
        search term is matched (case-insensitive substring) against both
        ``users.username`` and ``agents.name``.

        Args:
            stmt: The current SQLAlchemy select statement.
            term: The raw search string from the query parameter.

        Returns:
            The statement with a WHERE clause filtering by username or agent name.
        """
        pattern = f"%{term}%"
        return (
            stmt.join(ChatMessage.chat_session)
            .join(ChatSession.user)
            .join(ChatSession.agent)
            .where(
                or_(
                    cast(User.username, String).ilike(pattern),
                    cast(Agent.name, String).ilike(pattern),
                )
            )
        )

    def list_query(self, request: Request) -> Any:
        """Eagerly load chat_session → user and agent for __str__ label rendering."""
        return (
            super()
            .list_query(request)
            .options(
                selectinload(ChatMessage.chat_session).selectinload(ChatSession.user),
                selectinload(ChatMessage.chat_session).selectinload(ChatSession.agent),
            )
        )

    def details_query(self, request: Request) -> Any:
        """Eagerly load chat_session → user and agent for __str__ label rendering."""
        return (
            super()
            .details_query(request)
            .options(
                selectinload(ChatMessage.chat_session).selectinload(ChatSession.user),
                selectinload(ChatMessage.chat_session).selectinload(ChatSession.agent),
            )
        )
