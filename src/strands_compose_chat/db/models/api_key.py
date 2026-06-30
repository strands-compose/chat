"""ORM model for user API keys."""

from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, ForeignKey, Index, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ..base import Base, _new_uuid

if TYPE_CHECKING:
    from .user import User


class ApiKey(Base):
    """An API credential owned by a user.

    Only a SHA-256 hash of the credential is stored (``secret_hash``); the raw
    key is shown to a superuser exactly once at creation and never persisted in
    plaintext. The non-secret ``key_prefix`` is used for display and log
    identification.
    """

    __tablename__ = "api_keys"

    __table_args__ = (
        Index("ix_api_keys_user_id", "user_id"),
        Index("ix_api_keys_secret_hash", "secret_hash", unique=True),
    )

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=_new_uuid)
    user_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    secret_hash: Mapped[str] = mapped_column(String(64), nullable=False, unique=True)
    key_prefix: Mapped[str] = mapped_column(String(16), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=func.now()
    )
    expires_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    last_used_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    revoked_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    user: Mapped["User"] = relationship("User", back_populates="api_keys")

    def __repr__(self) -> str:  # pragma: no cover
        return f"<ApiKey id={self.id!r} name={self.name!r} prefix={self.key_prefix!r}>"

    def __str__(self) -> str:
        return f"{self.name} ({self.key_prefix})"
