"""Admin view for the TokenUsage model."""

from typing import Any

import structlog
from fastapi import Request
from sqladmin import action
from sqlalchemy import String, cast, or_, select
from sqlalchemy.orm import selectinload
from starlette.responses import RedirectResponse

from ...analytics.service import compute_cost
from ...db.base import AsyncSessionLocal
from ...db.models import Agent, ChatSession, ModelPricing, TokenUsage, User
from .base import BaseModelView

logger: structlog.stdlib.BoundLogger = structlog.get_logger(__name__)


class TokenUsageAdmin(BaseModelView, model=TokenUsage):
    """Admin view for per-agent token usage records.

    Token usage is an immutable financial/audit ledger: rows are written only by
    the application and cannot be created, edited, or deleted from the admin.
    The recorded ``cost`` can be recomputed from current pricing via the
    ``Recalculate cost`` action, which is the only sanctioned mutation.

    The search box matches against the session owner's username, the
    ``agent_name`` column on the usage row itself, the agent name from
    the related session, and ``model_id``.
    """

    name = "Token Usage"
    name_plural = "Token Usage"
    icon = "fa-solid fa-coins"

    can_create = False
    can_edit = False
    can_delete = False

    column_list = [
        TokenUsage.agent_name,
        TokenUsage.chat_session,
        TokenUsage.cost,
        TokenUsage.input_tokens,
        TokenUsage.output_tokens,
        TokenUsage.model_id,
        TokenUsage.provider,
        TokenUsage.created_at,
    ]
    column_details_list = [
        TokenUsage.chat_session,
        TokenUsage.agent_name,
        TokenUsage.model_id,
        TokenUsage.provider,
        TokenUsage.cost,
        TokenUsage.input_tokens,
        TokenUsage.output_tokens,
        TokenUsage.created_at,
    ]

    # Needs at least one entry so sqladmin renders the search bar.
    # Actual search logic is in search_query — this list is not used for querying.
    column_searchable_list = [TokenUsage.agent_name]
    column_default_sort = [(TokenUsage.created_at, True)]

    def search_placeholder(self) -> str:  # type: ignore[override]
        """Return a human-readable placeholder describing what can be searched."""
        return "username, agent name, model id"

    @action(
        name="recalculate_cost",
        label="Recalculate cost",
        confirmation_message=(
            "Recalculate cost for selected rows using current model pricing? "
            "Rows whose model_id or provider has no pricing entry, will be set to 0."
        ),
        add_in_detail=True,
        add_in_list=True,
    )
    async def recalculate_cost(self, request: Request) -> RedirectResponse:
        """Recalculate cost for selected TokenUsage rows from current ModelPricing.

        Loads each selected row, looks up the current pricing entry by
        ``(model_id, provider)``, recomputes cost using the same formula as the
        streaming layer, and commits all updates in a single transaction.
        Rows with no matching pricing entry are set to ``0.0``.

        Args:
            request: The incoming admin request; ``pks`` query param contains
                comma-separated primary keys of the selected rows.

        Returns:
            Redirect back to the token usage list view.
        """
        pks_raw = request.query_params.get("pks", "")
        pks = [pk for pk in pks_raw.split(",") if pk]

        redirect_url = request.url_for("admin:list", identity=self.identity)

        if not pks:
            return RedirectResponse(url=str(redirect_url), status_code=302)

        updated = 0
        async with AsyncSessionLocal() as session:
            try:
                # Load all selected rows in one query.
                rows_result = await session.execute(
                    select(TokenUsage).where(TokenUsage.id.in_(pks))
                )
                rows = list(rows_result.scalars().all())

                # Build a pricing lookup keyed by (model_id, provider) — one
                # query covers all distinct combinations in the selection.
                pairs = {(r.model_id, r.provider) for r in rows if r.model_id and r.provider}
                pricing_map: dict[tuple[str, str], ModelPricing] = {}
                if pairs:
                    # Define pair conditions list
                    conditions = [
                        (ModelPricing.model_id == mid) & (ModelPricing.provider == prov)
                        for mid, prov in pairs
                    ]
                    # Execute query
                    pricing_result = await session.execute(
                        select(ModelPricing).where(or_(*conditions))
                    )
                    for pricing in pricing_result.scalars().all():
                        pricing_map[(pricing.model_id, pricing.provider)] = pricing

                for row in rows:
                    pricing = (
                        pricing_map.get((row.model_id, row.provider))
                        if row.model_id and row.provider
                        else None
                    )
                    if pricing:
                        in_price = float(pricing.input_token_price)
                        out_price = float(pricing.output_token_price)
                    else:
                        in_price = 0.0
                        out_price = 0.0

                    new_cost = round(
                        compute_cost(in_price, out_price, row.input_tokens, row.output_tokens),
                        6,
                    )
                    row.cost = new_cost
                    updated += 1

                await session.commit()
                logger.info(
                    "recalculated token usage cost",
                    updated=updated,
                    admin_user=getattr(request.state, "user_id", None),
                )
            except Exception:
                await session.rollback()
                logger.exception("failed to recalculate token usage cost")

        return RedirectResponse(url=str(redirect_url), status_code=302)

    def search_query(self, stmt: Any, term: str) -> Any:
        """Search token usage by username, agent name (row or session), or model id.

        Joins ``chat_session → user`` and ``chat_session → agent`` so the term
        is matched (case-insensitive substring) against:

        - ``users.username`` — the session owner
        - ``token_usage.agent_name`` — the sub-agent that produced the row
        - ``agents.name`` — the entry agent of the session
        - ``token_usage.model_id`` — the model used

        Args:
            stmt: The current SQLAlchemy select statement.
            term: The raw search string from the query parameter.

        Returns:
            The statement with a WHERE clause filtering by any of the above fields.
        """
        pattern = f"%{term}%"
        return (
            stmt.join(TokenUsage.chat_session)
            .join(ChatSession.user)
            .join(ChatSession.agent)
            .where(
                or_(
                    cast(User.username, String).ilike(pattern),
                    cast(TokenUsage.agent_name, String).ilike(pattern),
                    cast(Agent.name, String).ilike(pattern),
                    cast(TokenUsage.model_id, String).ilike(pattern),
                )
            )
        )

    def list_query(self, request: Request) -> Any:
        """Eagerly load chat_session → user and agent for __str__ label rendering."""
        return (
            super()
            .list_query(request)
            .options(
                selectinload(TokenUsage.chat_session).selectinload(ChatSession.user),
                selectinload(TokenUsage.chat_session).selectinload(ChatSession.agent),
            )
        )

    def details_query(self, request: Request) -> Any:
        """Eagerly load chat_session → user and agent for __str__ label rendering."""
        return (
            super()
            .details_query(request)
            .options(
                selectinload(TokenUsage.chat_session).selectinload(ChatSession.user),
                selectinload(TokenUsage.chat_session).selectinload(ChatSession.agent),
            )
        )
