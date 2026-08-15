"""Admin view for the ModelPricing model."""

from typing import Any, ClassVar

from ...db.models import ModelPricing
from .base import BaseModelView


class ModelPricingAdmin(BaseModelView, model=ModelPricing):
    """Admin view for per-model token pricing.

    Pricing is reference data managed by admins, so create, edit, and delete
    are all enabled. The ``(model_id, provider)`` pair is unique.
    """

    name = "Model Pricing"
    name_plural = "Model Pricing"
    icon = "fa-solid fa-usd"

    column_list: ClassVar[list[Any]] = [
        ModelPricing.model_id,
        ModelPricing.provider,
        ModelPricing.input_token_price,
        ModelPricing.output_token_price,
        ModelPricing.created_at,
        ModelPricing.updated_at,
    ]
    column_details_list: ClassVar[list[Any]] = [
        ModelPricing.model_id,
        ModelPricing.provider,
        ModelPricing.input_token_price,
        ModelPricing.output_token_price,
        ModelPricing.created_at,
        ModelPricing.updated_at,
    ]
    form_columns: ClassVar[list[Any]] = [
        ModelPricing.model_id,
        ModelPricing.provider,
        ModelPricing.input_token_price,
        ModelPricing.output_token_price,
    ]

    column_searchable_list: ClassVar[list[Any]] = [ModelPricing.model_id, ModelPricing.provider]
    column_default_sort: ClassVar[list[Any]] = [(ModelPricing.model_id, False)]

    form_args: ClassVar[dict[str, Any]] = {
        "input_token_price": {
            "description": "Price in USD per 1 million input tokens.",
        },
        "output_token_price": {
            "description": "Price in USD per 1 million output tokens.",
        },
    }
