"""Admin view for the ChatSession model."""

import json
from typing import Any

from fastapi import Request
from markupsafe import Markup
from sqlalchemy import String, cast, or_
from sqlalchemy.orm import selectinload

from ...db.models import Agent, ChatSession, User
from .base import BaseModelView


def _format_manifest(model: Any, _prop: Any) -> Any:
    """Pretty-print the manifest JSON in a scrollable <pre> block."""
    value = getattr(model, "manifest", None)
    if value is None:
        return ""
    try:
        text = json.dumps(value, indent=2, ensure_ascii=False)
    except (TypeError, ValueError):
        text = str(value)
    return Markup(  # nosec B704 — manifest is backend-generated JSON, not user HTML
        f'<pre style="margin:0;padding:8px;background:var(--tblr-secondary-bg);'
        f"border:1px solid var(--tblr-border-color);"
        f"border-radius:4px;max-height:400px;overflow:auto;color:var(--tblr-body-color);"
        f'font-size:0.8em;white-space:pre;">{text}</pre>'
    )


def _summarise_token_usage(rows: list[Any]) -> str:
    """Return 'Total: X input, Y output' with narrow-space thousands separators."""
    total_in = sum(r.input_tokens for r in rows)
    total_out = sum(r.output_tokens for r in rows)

    def fmt(n: int) -> str:
        return f"{n:,}".replace(",", "\u202f")

    return f"Total: {fmt(total_in)} input, {fmt(total_out)} output"


class ChatSessionAdmin(BaseModelView, model=ChatSession):
    """Read-only admin view for chat sessions.

    Sessions are created by the application, not by admins. Create, edit, and
    delete are intentionally disabled; only list and detail are available.
    Hard-deleting a session would risk discarding linked financial/audit data,
    so removal of personal data is done via the user "Anonymize user" action.

    The search box matches against the session owner's username, the agent
    name, the session title, and the session_id.
    """

    name = "Chat Session"
    name_plural = "Chat Sessions"
    icon = "fa-solid fa-comments"

    can_create = False
    can_edit = False
    can_delete = False

    column_list = [
        ChatSession.title,
        ChatSession.user,
        ChatSession.agent,
        ChatSession.created_at,
        ChatSession.last_used_at,
        ChatSession.is_archived,
    ]
    column_details_list = [
        ChatSession.session_id,
        ChatSession.user,
        ChatSession.agent,
        ChatSession.title,
        ChatSession.created_at,
        ChatSession.last_used_at,
        ChatSession.is_archived,
        ChatSession.manifest,
        ChatSession.manifest_captured_at,
        ChatSession.token_usage,
    ]

    # Needs at least one entry so sqladmin renders the search bar.
    # Actual search logic is in search_query — this list is not used for querying.
    column_searchable_list = [ChatSession.session_id]
    column_default_sort = [(ChatSession.last_used_at, True)]

    column_formatters_detail = {ChatSession.manifest: _format_manifest}

    def search_placeholder(self) -> str:  # type: ignore[override]
        """Return a human-readable placeholder describing what can be searched."""
        return "username, agent name, title, session id"

    def search_query(self, stmt: Any, term: str) -> Any:
        """Search sessions by owner username, agent name, title, or session id.

        Joins ``user`` and ``agent`` so the term is matched (case-insensitive
        substring) against ``users.username``, ``agents.name``,
        ``chat_sessions.title``, and ``chat_sessions.session_id``.

        Args:
            stmt: The current SQLAlchemy select statement.
            term: The raw search string from the query parameter.

        Returns:
            The statement with a WHERE clause filtering by any of the above fields.
        """
        pattern = f"%{term}%"
        return (
            stmt.join(ChatSession.user)
            .join(ChatSession.agent)
            .where(
                or_(
                    cast(User.username, String).ilike(pattern),
                    cast(Agent.name, String).ilike(pattern),
                    cast(ChatSession.title, String).ilike(pattern),
                    cast(ChatSession.session_id, String).ilike(pattern),
                )
            )
        )

    def __init__(self) -> None:
        """Exclude token_usage from relation names so the template treats it as a plain value."""
        super().__init__()
        # The details template checks _relation_names to decide whether to render
        # a value as a linked relation or plain text. Removing token_usage here
        # forces the plain {{ formatted_value }} branch so get_detail_value controls
        # the output entirely.
        self._relation_names = [n for n in self._relation_names if n != "token_usage"]
        self._details_relation_names = [
            n for n in self._details_relation_names if n != "token_usage"
        ]

    def details_query(self, request: Request) -> Any:
        """Eagerly load token_usage to avoid DetachedInstanceError."""
        return super().details_query(request).options(selectinload(ChatSession.token_usage))

    async def get_detail_value(
        self, obj: Any, prop: str, request: Request | None = None
    ) -> tuple[Any, Any]:
        """Render token_usage as a summarised total string."""
        if prop == "token_usage":
            try:
                rows = getattr(obj, "token_usage", None) or []
            except Exception:  # noqa: BLE001
                rows = []
            value = _summarise_token_usage(rows) if rows else "—"
            return value, value
        return await super().get_detail_value(obj, prop, request)
