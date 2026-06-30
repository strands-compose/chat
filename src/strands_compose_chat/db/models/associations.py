"""Association (join) tables for User-Group and Agent-Group M2M relationships."""

from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, Index, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ..base import Base

if TYPE_CHECKING:
    from .agent import Agent
    from .group import Group
    from .user import User


class UserGroup(Base):
    """Composite-PK join table linking users to groups."""

    __tablename__ = "user_groups"

    __table_args__ = (Index("ix_user_groups_group_id", "group_id"),)

    user_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("users.id", ondelete="CASCADE"),
        primary_key=True,
    )
    group_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("groups.id", ondelete="CASCADE"),
        primary_key=True,
    )

    user: Mapped["User"] = relationship("User", overlaps="groups,members")
    group: Mapped["Group"] = relationship("Group", overlaps="groups,members")

    def __repr__(self) -> str:  # pragma: no cover
        return f"<UserGroup user_id={self.user_id!r} group_id={self.group_id!r}>"


class AgentGroup(Base):
    """Composite-PK join table connecting agents to groups."""

    __tablename__ = "agent_groups"

    __table_args__ = (Index("ix_agent_groups_group_id", "group_id"),)

    agent_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("agents.id", ondelete="CASCADE"),
        primary_key=True,
    )
    group_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("groups.id", ondelete="CASCADE"),
        primary_key=True,
    )

    agent: Mapped["Agent"] = relationship("Agent", overlaps="access_groups,agents")
    group: Mapped["Group"] = relationship("Group", overlaps="access_groups,agents")

    def __repr__(self) -> str:  # pragma: no cover
        return f"<AgentGroup agent_id={self.agent_id!r} group_id={self.group_id!r}>"
