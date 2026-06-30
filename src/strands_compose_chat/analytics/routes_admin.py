"""Admin analytics router — all endpoints gated by admin_required."""

from typing import Literal

from fastapi import APIRouter

from ..auth.current_user import AdminUser
from ..deps import DbSession
from ..schemas.analytics import (
    AgentRef,
    BreakdownOut,
    BreakdownRequest,
    BudgetItemOut,
    BudgetStatusFilter,
    FiltersOut,
    GroupRef,
    SummaryOut,
    SummaryRequest,
    TimelineOut,
    TimelineRequest,
    UserRef,
)
from .service import get_breakdown, get_budgets, get_filters, get_summary, get_timeline

router = APIRouter(prefix="/analytics", tags=["analytics"])


@router.get("/filters", response_model=FiltersOut)
async def filters_handler(_admin: AdminUser, db: DbSession) -> FiltersOut:
    """Return all users, agents, and groups for admin filter dropdowns.

    Args:
        _admin: Authenticated admin user (used for auth gating only).
        db: Async database session.

    Returns:
        FiltersOut with users, agents, and groups lists.
    """
    users, agents, groups = await get_filters(db)

    return FiltersOut(
        users=[UserRef(id=u.id, username=u.username) for u in users],
        agents=[AgentRef(id=a.id, name=a.name) for a in agents],
        groups=[GroupRef(id=g.id, name=g.name) for g in groups],
    )


@router.post("/timeline", response_model=TimelineOut)
async def timeline_handler(
    _admin: AdminUser,
    db: DbSession,
    body: TimelineRequest,
) -> TimelineOut:
    """Return time-series data for the admin analytics timeline chart.

    Args:
        _admin: Authenticated admin user (used for auth gating only).
        db: Async database session.
        body: Timeline request parameters including date range, metric, and interval.

    Returns:
        TimelineOut with labels and one or more data series.
    """
    return await get_timeline(db, body)


@router.post("/summary", response_model=SummaryOut)
async def summary_handler(
    _admin: AdminUser,
    db: DbSession,
    body: SummaryRequest,
) -> SummaryOut:
    """Return aggregate KPI totals for the admin analytics summary cards.

    Args:
        _admin: Authenticated admin user (used for auth gating only).
        db: Async database session.
        body: Summary request parameters including date range and optional filters.

    Returns:
        SummaryOut with total_cost, input_tokens, output_tokens, hits,
        and active_users.
    """
    cost, input_tokens, output_tokens, hits, active_users = await get_summary(
        db, body.from_date, body.to_date, body.filters
    )

    return SummaryOut(
        total_cost=cost,
        input_tokens=input_tokens,
        output_tokens=output_tokens,
        hits=hits,
        active_users=active_users,
    )


@router.post("/breakdown", response_model=BreakdownOut)
async def breakdown_handler(
    _admin: AdminUser,
    db: DbSession,
    body: BreakdownRequest,
) -> BreakdownOut:
    """Return ranked breakdown data for the admin analytics breakdown chart.

    Args:
        _admin: Authenticated admin user (used for auth gating only).
        db: Async database session.
        body: Breakdown request parameters including date range, category, metric,
            and stack_by dimension.

    Returns:
        BreakdownOut with ranked labels and one or more data series.
    """
    return await get_breakdown(db, body)


@router.get("/budgets", response_model=list[BudgetItemOut])
async def budgets_handler(
    _admin: AdminUser,
    db: DbSession,
    status: BudgetStatusFilter = BudgetStatusFilter.all,
    sort: Literal["pct_desc"] = "pct_desc",
) -> list[BudgetItemOut]:
    """Return per-user budget status for the current UTC month.

    Args:
        _admin: Authenticated admin user (used for auth gating only).
        db: Async database session.
        status: Filter by budget status — all, approaching, or over.
        sort: Sort order — only "pct_desc" is accepted (422 otherwise).

    Returns:
        List of BudgetItemOut sorted by pct_used descending.
    """
    return await get_budgets(db, status_filter=status)
