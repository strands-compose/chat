"""ORM model for the Group entity."""

from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ..base import Base, _new_uuid

if TYPE_CHECKING:
    from .agent import Agent
    from .user import User


class Group(Base):
    """Named collection of users used for coarse-grained agent visibility."""

    __tablename__ = "groups"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=_new_uuid)
    name: Mapped[str] = mapped_column(String, nullable=False, unique=True)
    description: Mapped[str | None] = mapped_column(String, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=func.now()
    )

    members: Mapped[list["User"]] = relationship(
        "User", secondary="user_groups", back_populates="groups"
    )
    agents: Mapped[list["Agent"]] = relationship(
        "Agent", secondary="agent_groups", back_populates="access_groups"
    )

    def __repr__(self) -> str:  # pragma: no cover
        return f"<Group id={self.id!r} name={self.name!r}>"

    def __str__(self) -> str:
        return self.name
