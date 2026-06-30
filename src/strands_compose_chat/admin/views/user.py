"""Admin view for the User model."""

from typing import Any

import structlog
from fastapi import Request
from fastapi.responses import RedirectResponse
from markupsafe import Markup
from sqladmin import action
from wtforms import Form, PasswordField, SelectField
from wtforms.validators import NumberRange, Optional

from ...auth.service import anonymize_user
from ...db.models import User
from ...deps import get_oidc_registry
from .base import BaseModelView, _badge

logger: structlog.stdlib.BoundLogger = structlog.get_logger(__name__)


def _format_auth_provider(model: Any, _prop: Any) -> Markup:
    """Render auth_provider as a coloured badge using the provider display name."""
    provider: str = getattr(model, "auth_provider", "") or ""
    colour_map = {
        "local": "#6c757d",
    }
    colour = colour_map.get(provider) or "#0d6efd"

    label = provider.capitalize()
    if provider.startswith("oidc:"):
        pid = provider.removeprefix("oidc:")
        oidc_provider = get_oidc_registry().get(pid)
        label = oidc_provider.display_name if oidc_provider else pid

    return _badge(label or "—", colour)


class UserAdmin(BaseModelView, model=User):
    """Admin view for the users table.

    ``password_hash`` is never exposed in the form — it is set only via the
    virtual ``password`` field injected by ``scaffold_form``. OIDC users
    always get ``password_hash=None`` regardless of what the form submitted.
    """

    name = "User"
    name_plural = "Users"
    icon = "fa-solid fa-users"

    # Users are never hard-deleted: that would cascade-destroy chat sessions and
    # the linked token-usage ledger. Deactivate via is_active, or strip personal
    # data with the "Anonymize user" action below.
    can_delete = False

    column_list = [
        User.username,
        User.first_name,
        User.last_name,
        User.email,
        User.groups,
        User.is_active,
        User.is_superuser,
        User.auth_provider,
    ]
    column_details_list = [
        User.username,
        User.first_name,
        User.last_name,
        User.email,
        User.location,
        User.company,
        User.department,
        User.groups,
        User.budget,
        User.is_active,
        User.is_superuser,
        User.auth_provider,
        User.external_subject,
        User.created_at,
        User.updated_at,
    ]
    form_columns = [
        User.username,
        User.email,
        User.auth_provider,
        User.first_name,
        User.last_name,
        User.location,
        User.company,
        User.department,
        User.groups,
        User.budget,
        User.is_active,
        User.is_superuser,
    ]

    # auth_provider is create-only. Editing it on an existing OIDC user would
    # overwrite the JIT-provisioned identity key, breaking their next login.
    form_create_rules = [
        "username",
        "email",
        "auth_provider",
        "password",
        "first_name",
        "last_name",
        "location",
        "company",
        "department",
        "groups",
        "budget",
        "is_active",
        "is_superuser",
    ]
    form_edit_rules = [
        "username",
        "email",
        "password",
        "first_name",
        "last_name",
        "location",
        "company",
        "department",
        "groups",
        "budget",
        "is_active",
        "is_superuser",
    ]

    form_overrides = {"auth_provider": SelectField}
    form_args = {
        "auth_provider": {
            "choices": [("local", "Local")],
            "description": "Authentication provider. Use 'Local' for password-based accounts.",
        },
        "budget": {
            "label": "Monthly Budget",
            "description": "Monthly user budget in USD.",
            "validators": [NumberRange(min=0.0, message="Budget must be a positive number.")],
        },
    }

    column_searchable_list = [User.username, User.email, User.first_name, User.last_name]
    column_default_sort = [(User.created_at, True)]

    # groups renders as badge list via BaseModelView.get_list_value / get_detail_value
    _badge_relation_props = {"groups": "#d79750"}

    column_formatters = {User.auth_provider: _format_auth_provider}
    column_formatters_detail = column_formatters

    form_ajax_refs = {
        "groups": {
            "fields": ("name",),
            "order_by": "name",
        }
    }

    async def scaffold_form(self, rules: list[str] | None = None) -> type[Form]:
        """Inject a virtual write-only ``password`` field positioned after ``auth_provider``.

        The field has no backing column. Its position is controlled via
        ``creation_counter`` — a WTForms internal ordering float. Setting it to
        ``auth_provider.creation_counter + 0.5`` places it directly below
        auth_provider without redeclaring the full field order. ``on_model_change``
        pops it before persistence.
        """
        form = await super().scaffold_form(rules)
        password = PasswordField(
            "Password",
            validators=[Optional()],
            description=(
                "Leave empty to keep the existing password. Ignored for external providers (OIDC)."
            ),
            render_kw={"class": "form-control", "autocomplete": "new-password"},
        )
        # On edit auth_provider is absent, so anchor password to email instead.
        anchor_field = getattr(form, "auth_provider", None) or getattr(form, "email")
        password.creation_counter = anchor_field.creation_counter + 0.5  # ty: ignore
        setattr(form, "password", password)
        return form

    async def on_model_change(
        self,
        data: dict[str, Any],
        model: Any,
        is_created: bool,
        request: Any,
    ) -> None:
        """Hash the password for local users; force ``password_hash=None`` for OIDC providers.

        OIDC users must never carry a password hash, so it is explicitly nulled
        regardless of what the form submitted.
        """
        password = data.pop("password", None)
        # Fall back to model when auth_provider isn't in the form (edit path).
        provider = data.get("auth_provider") or getattr(model, "auth_provider", None)
        if provider != "local":
            data["password_hash"] = None
            return

        from ...deps import get_settings  # noqa: PLC0415

        settings = get_settings()
        if is_created and not password:
            raise ValueError("A local user requires a password.")
        if password:
            if len(password) < settings.PASSWORD_MIN_LENGTH:
                raise ValueError(
                    f"Password must be at least {settings.PASSWORD_MIN_LENGTH} characters long."
                )
            from ...auth.passwords import hash_password  # noqa: PLC0415

            data["password_hash"] = hash_password(password, settings)

    @action(
        name="anonymize",
        label="Anonymize user",
        confirmation_message=(
            "Permanently remove this user's personal information and scrub their "
            "chat content? The account is kept and deactivated, and all usage / "
            "billing history is preserved. This cannot be undone."
        ),
        add_in_detail=True,
        add_in_list=True,
    )
    async def anonymize(self, request: Request) -> RedirectResponse:
        """Anonymise the selected user(s) via the auth service.

        Available from both the user list (batch) and a user's detail page.
        ``pks`` carries the selected record id(s). Users that cannot be
        anonymised (e.g. the last active superuser) are skipped and logged
        rather than aborting the whole batch.

        Args:
            request: The admin request; ``pks`` query param holds the id(s).

        Returns:
            Redirect back to the user list view.
        """
        pks = request.query_params.get("pks", "")
        ids = [pk for pk in pks.split(",") if pk]
        async with self.session_maker() as session:
            for user_id in ids:
                try:
                    await anonymize_user(session, user_id)
                except ValueError:
                    logger.warning("anonymize skipped", user_id=user_id, exc_info=True)
                    continue
            await session.commit()
        return RedirectResponse(request.url_for("admin:list", identity=self.identity))
