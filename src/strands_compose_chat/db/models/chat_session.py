"""ORM model for per-user chat sessions."""

from datetime import datetime
from typing import TYPE_CHECKING, Any

from sqlalchemy import JSON, Boolean, CheckConstraint, DateTime, ForeignKey, Index, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ..base import Base, _new_uuid

if TYPE_CHECKING:
    from .agent import Agent
    from .chat_message import ChatMessage
    from .token_usage import TokenUsage
    from .user import User


_SESSION_ID_LENGTH_CHECK = "length(session_id) >= 33 AND length(session_id) <= 256"


class ChatSession(Base):
    """Per-user chat session row.

    session_id is a UI-generated string (33-256 chars) globally unique across
    all users. agent_id is locked for the lifetime of the session.
    manifest stores the SessionManifest JSON captured from the first
    session_start SSE event; NULL until that event is observed.
    """

    __tablename__ = "chat_sessions"

    __table_args__ = (
        CheckConstraint(_SESSION_ID_LENGTH_CHECK, name="ck_chat_sessions_session_id_length"),
        Index(
            "ix_chat_sessions_user_last_used",
            "user_id",
            "last_used_at",
            postgresql_ops={"last_used_at": "DESC"},
        ),
        Index("ix_chat_sessions_user_session", "user_id", "session_id"),
    )

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=_new_uuid)
    user_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )
    session_id: Mapped[str] = mapped_column(String(256), nullable=False, unique=True)
    agent_id: Mapped[str] = mapped_column(String(36), ForeignKey("agents.id"), nullable=False)
    manifest: Mapped[Any | None] = mapped_column(JSON, nullable=True)
    manifest_captured_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    title: Mapped[str | None] = mapped_column(String, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=func.now()
    )
    last_used_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=func.now()
    )
    is_archived: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

    user: Mapped["User"] = relationship("User", back_populates="chat_sessions")
    agent: Mapped["Agent"] = relationship("Agent", back_populates="chat_sessions")
    token_usage: Mapped[list["TokenUsage"]] = relationship(
        "TokenUsage", back_populates="chat_session"
    )
    messages: Mapped[list["ChatMessage"]] = relationship(
        "ChatMessage", back_populates="chat_session", cascade="all, delete-orphan"
    )

    def __repr__(self) -> str:  # pragma: no cover
        return f"<ChatSession id={self.id!r} session_id={self.session_id!r}>"

    def __str__(self) -> str:  # pragma: no cover
        user_label = str(self.user) if self.user is not None else self.user_id
        agent_label = str(self.agent) if self.agent is not None else self.agent_id
        created = self.created_at.strftime("%Y-%m-%d %H:%M") if self.created_at else ""
        return f"User: {user_label} / Agent: {agent_label} / {created}"
