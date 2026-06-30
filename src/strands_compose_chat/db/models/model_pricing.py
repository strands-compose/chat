"""ORM model for admin-managed per-model token pricing."""

from datetime import datetime

from sqlalchemy import DateTime, Float, String, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column

from ..base import Base, _new_uuid


class ModelPricing(Base):
    """Admin-managed per-model token pricing for cost calculation."""

    __tablename__ = "model_pricing"

    __table_args__ = (
        UniqueConstraint("model_id", "provider", name="uq_model_pricing_model_provider"),
    )

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=_new_uuid)
    model_id: Mapped[str] = mapped_column(String, nullable=False)
    provider: Mapped[str] = mapped_column(String, nullable=False)
    input_token_price: Mapped[float] = mapped_column(Float, nullable=False)
    output_token_price: Mapped[float] = mapped_column(Float, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=func.now(), onupdate=func.now()
    )

    def __repr__(self) -> str:  # pragma: no cover
        return f"<ModelPricing model_id={self.model_id!r} provider={self.provider!r}>"
