"""ORM model for individual chat messages within a session."""

from datetime import datetime
from typing import TYPE_CHECKING, Any

from sqlalchemy import (
    JSON,
    Boolean,
    CheckConstraint,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
    UniqueConstraint,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ..base import Base, _new_uuid

if TYPE_CHECKING:
    from .chat_session import ChatSession


class ChatMessage(Base):
    """A single persisted message within a chat session.

    Stores the user prompt text (role ``user``) or the assistant's final answer
    (role ``assistant``) for one exchange. The user row is written when the turn
    starts; the assistant row is written on ``session_end`` (or an error row on
    ``error``). Each write uses its own short-lived database session so a
    persistence failure never interrupts the stream.

    Args:
        id: UUID4 primary key.
        chat_session_id: FK to the owning ``chat_sessions`` row; cascades on delete.
        role: Either ``'user'`` or ``'assistant'`` — enforced by a CheckConstraint.
        content: Verbatim prompt text (user) or final answer (assistant).
        seq: Monotonically increasing per-session sequence number.
        is_success: Whether this assistant message was delivered successfully (not an error).
        attachments: JSON list of attachment metadata objects for ``user`` rows,
            or ``NULL`` when the message has no attachments. Assistant rows are
            always ``NULL``.
        created_at: Insertion timestamp with timezone, defaulting to ``func.now()``.
    """

    __tablename__ = "chat_messages"

    __table_args__ = (
        CheckConstraint("role IN ('user','assistant')", name="ck_chat_messages_role"),
        UniqueConstraint("chat_session_id", "seq", name="uq_chat_messages_session_seq"),
    )

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=_new_uuid)
    chat_session_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("chat_sessions.id", ondelete="CASCADE"),
        nullable=False,
    )
    role: Mapped[str] = mapped_column(String, nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    seq: Mapped[int] = mapped_column(Integer, nullable=False)
    is_success: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    attachments: Mapped[Any | None] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=func.now()
    )

    chat_session: Mapped["ChatSession"] = relationship("ChatSession", back_populates="messages")

    def __repr__(self) -> str:  # pragma: no cover
        return (
            f"<ChatMessage id={self.id!r} session={self.chat_session_id!r} "
            f"role={self.role!r} seq={self.seq}>"
        )

    def __str__(self) -> str:  # pragma: no cover
        return f"[{self.role}] seq={self.seq}"
