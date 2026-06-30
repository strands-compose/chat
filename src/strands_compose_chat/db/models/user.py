"""ORM model for the User entity."""

from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import Boolean, CheckConstraint, DateTime, Float, Index, String, func, text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ..base import Base, _new_uuid

if TYPE_CHECKING:
    from .api_key import ApiKey
    from .chat_session import ChatSession
    from .group import Group


class User(Base):
    """Registered user — local or externally provisioned via JIT."""

    __tablename__ = "users"

    __table_args__ = (
        Index(
            "uq_users_provider_subject",
            "auth_provider",
            "external_subject",
            unique=True,
            sqlite_where=text("external_subject IS NOT NULL"),
            postgresql_where=text("external_subject IS NOT NULL"),
        ),
        CheckConstraint("budget >= 0.0", name="check_user_budget_positive"),
    )

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=_new_uuid)
    username: Mapped[str] = mapped_column(String, nullable=False, unique=True)
    email: Mapped[str] = mapped_column(String, nullable=False)
    auth_provider: Mapped[str] = mapped_column(String, nullable=False)
    external_subject: Mapped[str | None] = mapped_column(String, nullable=True)
    password_hash: Mapped[str | None] = mapped_column(String, nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    is_superuser: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    first_name: Mapped[str | None] = mapped_column(String(128), nullable=True)
    last_name: Mapped[str | None] = mapped_column(String(128), nullable=True)
    location: Mapped[str | None] = mapped_column(String(256), nullable=True)
    company: Mapped[str | None] = mapped_column(String(256), nullable=True)
    department: Mapped[str | None] = mapped_column(String(256), nullable=True)
    budget: Mapped[float] = mapped_column(Float, nullable=False, default=10.00)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=func.now(), onupdate=func.now()
    )

    groups: Mapped[list["Group"]] = relationship(
        "Group", secondary="user_groups", back_populates="members"
    )
    chat_sessions: Mapped[list["ChatSession"]] = relationship(
        "ChatSession", back_populates="user", cascade="all, delete-orphan"
    )
    api_keys: Mapped[list["ApiKey"]] = relationship(
        "ApiKey", back_populates="user", cascade="all, delete-orphan"
    )

    def __repr__(self) -> str:  # pragma: no cover
        return f"<User id={self.id!r} username={self.username!r}>"

    def __str__(self) -> str:
        return self.username
