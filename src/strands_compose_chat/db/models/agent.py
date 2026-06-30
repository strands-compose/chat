"""ORM model for the Agent registry entry."""

from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import JSON, Boolean, CheckConstraint, DateTime, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ..base import Base, _new_uuid

if TYPE_CHECKING:
    from .chat_session import ChatSession
    from .group import Group


_AGENTS_KIND_CHECK = (
    "(agent_kind = 'agentcore_runtime'"
    " AND agent_runtime_arn IS NOT NULL"
    " AND endpoint_url IS NULL)"
    " OR "
    "(agent_kind = 'local'"
    " AND endpoint_url IS NOT NULL"
    " AND agent_runtime_arn IS NULL"
    " AND region IS NULL)"
)


class Agent(Base):
    """Agent registry entry.

    id is a standard UUID (VARCHAR 36).
    The ck_agents_kind_columns CHECK constraint enforces that agentcore_runtime
    rows carry (agent_runtime_arn, region) and local rows carry endpoint_url.
    Access is controlled through the ``access_groups`` relationship: an agent is
    visible only to users sharing at least one group via the agent_groups join
    table.  An agent with no access_groups is closed to all non-superusers.
    """

    __tablename__ = "agents"

    __table_args__ = (CheckConstraint(_AGENTS_KIND_CHECK, name="ck_agents_kind_columns"),)

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=_new_uuid)
    name: Mapped[str] = mapped_column(String, nullable=False, unique=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True, server_default="")
    agent_kind: Mapped[str] = mapped_column(String, nullable=False)
    agent_runtime_arn: Mapped[str | None] = mapped_column(String, nullable=True)
    region: Mapped[str | None] = mapped_column(String, nullable=True)
    endpoint_url: Mapped[str | None] = mapped_column(String, nullable=True)
    enabled: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    multimodal: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    suggested_questions: Mapped[list[str] | None] = mapped_column(JSON, nullable=True, default=None)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=func.now(), onupdate=func.now()
    )

    access_groups: Mapped[list["Group"]] = relationship(
        "Group", secondary="agent_groups", back_populates="agents"
    )
    chat_sessions: Mapped[list["ChatSession"]] = relationship("ChatSession", back_populates="agent")

    def __repr__(self) -> str:  # pragma: no cover
        return f"<Agent id={self.id!r} kind={self.agent_kind!r}>"

    def __str__(self) -> str:
        return self.name
