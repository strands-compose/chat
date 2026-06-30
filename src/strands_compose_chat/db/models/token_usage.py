"""ORM model for per-invocation token usage records."""

from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import CheckConstraint, DateTime, Float, ForeignKey, Index, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ..base import Base, _new_uuid

if TYPE_CHECKING:
    from .chat_session import ChatSession


class TokenUsage(Base):
    """Per-agent per-invocation token consumption record.

    user_id is denormalized from ChatSession for fast billing queries
    without requiring a join.
    """

    __tablename__ = "token_usage"

    __table_args__ = (
        Index("ix_token_usage_user_id", "user_id"),
        Index("ix_token_usage_session", "chat_session_id"),
        Index(
            "ix_token_usage_user_created",
            "user_id",
            "created_at",
            postgresql_ops={"created_at": "DESC"},
        ),
        CheckConstraint("cost >= 0.0", name="check_token_usage_cost_positive"),
    )

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=_new_uuid)
    chat_session_id: Mapped[str] = mapped_column(
        String(36),
        # RESTRICT, not CASCADE: token usage is an immutable financial/audit
        # ledger. The database refuses to delete a session that has usage rows,
        # so cost history can never be destroyed as a side effect of a delete.
        ForeignKey("chat_sessions.id", ondelete="RESTRICT"),
        nullable=False,
    )
    user_id: Mapped[str] = mapped_column(String(36), nullable=False)
    agent_name: Mapped[str] = mapped_column(String, nullable=False)
    model_id: Mapped[str | None] = mapped_column(String, nullable=True)
    provider: Mapped[str | None] = mapped_column(String, nullable=True)
    input_tokens: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    output_tokens: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    cost: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=func.now()
    )

    chat_session: Mapped["ChatSession"] = relationship("ChatSession", back_populates="token_usage")

    def __repr__(self) -> str:  # pragma: no cover
        return (
            f"<TokenUsage id={self.id!r} agent={self.agent_name!r} "
            f"in={self.input_tokens} out={self.output_tokens}>"
        )

    def __str__(self) -> str:  # pragma: no cover
        return f"Agent: {self.agent_name}, in={self.input_tokens}, out={self.output_tokens}"
