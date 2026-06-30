"""Admin view for the ApiKey model."""

from datetime import UTC, datetime
from typing import Any

from fastapi.responses import RedirectResponse
from sqladmin import action
from sqladmin.secret import Secret
from sqlalchemy import select
from wtforms.validators import DataRequired, ValidationError

from ...auth.api_key import generate_api_key, hash_api_key
from ...db.models import ApiKey
from .base import BaseModelView


def _future_datetime(form: Any, field: Any) -> None:
    """WTForms validator: reject an expiration that is not in the future. Naive datetimes are treated as UTC."""
    value = field.data
    if value is None:
        return
    if value.tzinfo is None:
        value = value.replace(tzinfo=UTC)
    if value <= datetime.now(UTC):
        raise ValidationError("Expiration date must be in the future.")


class ApiKeyAdmin(BaseModelView, model=ApiKey):
    """Admin view for the api_keys table.

    On create, the raw key and key_prefix are generated server-side (the secret
    is never entered by hand). Only the SHA-256 hash of the key is stored; the
    raw value is revealed to the superuser exactly once via a modal immediately
    after creation and never shown again. Revocation is a soft action that
    stamps ``revoked_at``.

    API keys can be assigned to any active user regardless of auth provider.
    """

    name = "API Key"
    name_plural = "API Keys"
    icon = "fa-solid fa-key"

    column_list = [
        ApiKey.name,
        ApiKey.user,
        ApiKey.created_at,
        ApiKey.expires_at,
        ApiKey.last_used_at,
        ApiKey.revoked_at,
    ]
    column_details_list = [
        ApiKey.name,
        ApiKey.user,
        ApiKey.key_prefix,
        ApiKey.created_at,
        ApiKey.expires_at,
        ApiKey.last_used_at,
        ApiKey.revoked_at,
    ]
    form_columns = [
        ApiKey.name,
        ApiKey.user,
        ApiKey.expires_at,
    ]

    column_searchable_list = [ApiKey.name, ApiKey.key_prefix]
    column_default_sort = [(ApiKey.created_at, True)]

    form_args = {
        "user": {
            "validators": [DataRequired(message="An owning user is required.")],
        },
        "expires_at": {
            "validators": [
                DataRequired(message="An expiration date is required."),
                _future_datetime,
            ],
            "description": "Required. Must be a future date — the key stops working after this time.",
        },
    }

    form_ajax_refs = {
        "user": {
            "fields": ("username",),
            "order_by": "username",
        }
    }

    async def on_model_change(
        self, data: dict[str, Any], model: Any, is_created: bool, request: Any
    ) -> None:
        """Generate and hash the API key on create.

        On create: generates a raw key, stores only its SHA-256 hash, and stashes
        the raw value on ``request.state`` for ``after_model_change`` to reveal once.
        """
        if not is_created:
            return
        name = (data.get("name") or "").strip()
        if not name:
            raise ValueError("API key requires a non-empty name.")
        raw_key, key_prefix = generate_api_key()
        data["secret_hash"] = hash_api_key(raw_key)
        data["key_prefix"] = key_prefix
        request.state._new_api_key_raw = raw_key

    async def after_model_change(
        self, data: dict[str, Any], model: Any, is_created: bool, request: Any
    ) -> None:
        """Trigger sqladmin's one-time Secret modal with the raw key (no-cache response, never logged)."""
        if not is_created:
            return
        raw_key = getattr(request.state, "_new_api_key_raw", None)
        if raw_key:
            Secret.reveal_once(
                request,
                value=raw_key,
                title="API key created",
                label="Copy this key now — it will not be shown again.",
            )

    @action(name="revoke", label="Revoke", confirmation_message="Revoke selected API keys?")
    async def revoke(self, request: Any) -> Any:
        """Soft-revoke: stamp ``revoked_at`` on selected keys that are not yet revoked."""
        pks = request.query_params.get("pks", "")
        ids = [pk for pk in pks.split(",") if pk]
        async with self.session_maker() as session:
            result = await session.execute(select(ApiKey).where(ApiKey.id.in_(ids)))
            for record in result.scalars().all():
                if record.revoked_at is None:
                    record.revoked_at = datetime.now(UTC)
            await session.commit()
        return RedirectResponse(request.url_for("admin:list", identity=self.identity))
