"""Aggregation service consolidating all usage computation for admin and per-user endpoints."""

import re
from datetime import UTC, date, datetime, time, timedelta
from typing import Any

from sqlalchemy import Date, Select, cast, func, literal, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.sql.elements import ColumnElement

from ..db.models import Agent, ChatMessage, ChatSession, Group, TokenUsage, User, UserGroup
from ..schemas.analytics import (
    BreakdownOut,
    BreakdownRequest,
    BreakdownSeriesItem,
    BudgetItemOut,
    BudgetStatusFilter,
    Dimension,
    FiltersIn,
    Interval,
    Metric,
    MeUsageOut,
    MeUsagePoint,
    SeriesItem,
    TimelineOut,
    TimelineRequest,
)

_UUID_RE = re.compile(
    r"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$",
    re.IGNORECASE,
)


def _day_bucket(column: Any, dialect_name: str) -> ColumnElement[Any]:
    """Return a portable day-truncation expression for grouping by calendar day.

    SQLite stores ``DateTime`` values as text, so ``CAST(col AS DATE)`` yields a
    numeric value rather than a date; its ``date()`` function is used instead.
    PostgreSQL casts the timestamp to a real ``DATE``.

    Args:
        column: The timestamp column to truncate to a calendar day.
        dialect_name: The active SQLAlchemy dialect name (e.g. "sqlite").

    Returns:
        A SQL expression producing one value per UTC calendar day.
    """
    if dialect_name == "sqlite":
        return func.date(column)
    return cast(column, Date)


def _coerce_day(value: date | str) -> date:
    """Normalize a day-bucket query result to a ``date`` object.

    SQLite returns an ISO ``YYYY-MM-DD`` string from ``date()``; PostgreSQL
    returns a ``date`` directly.

    Args:
        value: Either a ``date`` or an ISO date string.

    Returns:
        The corresponding ``date`` instance.

    Raises:
        TypeError: When ``value`` is neither a ``date`` nor a string.
    """
    if isinstance(value, datetime):
        return value.date()
    if isinstance(value, date):
        return value
    if isinstance(value, str):
        return date.fromisoformat(value)
    raise TypeError(f"Unexpected day-bucket value type: {type(value)!r}")


async def get_filters(db: AsyncSession) -> tuple[list[User], list[Agent], list[Group]]:
    """Fetch all users, agents, and groups for filter dropdowns.

    Args:
        db: Async database session.

    Returns:
        A tuple of (users, agents, groups) lists with no filtering or pagination.
    """
    users_result = await db.execute(select(User))
    agents_result = await db.execute(select(Agent))
    groups_result = await db.execute(select(Group))

    users = list(users_result.scalars().all())
    agents = list(agents_result.scalars().all())
    groups = list(groups_result.scalars().all())

    return users, agents, groups


def get_iso_week_monday(d: date) -> date:
    """Return the Monday of the ISO week containing the given date.

    Args:
        d: Any calendar date.

    Returns:
        The Monday (start) of the ISO week that contains ``d``.
    """
    return d - timedelta(days=d.weekday())


def roll_up_daily_to_weekly(daily: dict[date, float]) -> dict[date, float]:
    """Sum daily values into week buckets keyed by their Monday date.

    Args:
        daily: Mapping of individual dates to numeric values.

    Returns:
        A dict keyed by Monday dates with values summed from all days in that
        ISO week present in ``daily``.
    """
    weekly: dict[date, float] = {}
    for d, value in daily.items():
        monday = get_iso_week_monday(d)
        weekly[monday] = weekly.get(monday, 0.0) + value
    return weekly


def roll_up_daily_to_monthly(daily: dict[date, float]) -> dict[str, float]:
    """Sum daily values into month buckets keyed by "YYYY-MM" strings.

    Args:
        daily: Mapping of individual dates to numeric values.

    Returns:
        A dict keyed by "YYYY-MM" strings with values summed from all days in
        that calendar month present in ``daily``.
    """
    monthly: dict[str, float] = {}
    for d, value in daily.items():
        key = d.strftime("%Y-%m")
        monthly[key] = monthly.get(key, 0.0) + value
    return monthly


def generate_daily_labels(from_date: date, to_date: date) -> list[str]:
    """Generate a list of "YYYY-MM-DD" labels for each day in the inclusive range.

    Args:
        from_date: Start date (inclusive).
        to_date: End date (inclusive).

    Returns:
        Ordered list of ISO-formatted date strings covering every day from
        ``from_date`` through ``to_date``.
    """
    labels: list[str] = []
    current = from_date
    while current <= to_date:
        labels.append(current.isoformat())
        current += timedelta(days=1)
    return labels


def generate_weekly_labels(from_date: date, to_date: date) -> list[str]:
    """Generate a list of "YYYY-MM-DD" labels for each Monday in the range.

    The first label is the Monday of the ISO week containing ``from_date``.
    Subsequent labels are each following Monday up to and including the Monday
    of the week containing ``to_date``.

    Args:
        from_date: Start date (inclusive).
        to_date: End date (inclusive).

    Returns:
        Ordered list of ISO-formatted Monday date strings.
    """
    labels: list[str] = []
    current = get_iso_week_monday(from_date)
    end_monday = get_iso_week_monday(to_date)
    while current <= end_monday:
        labels.append(current.isoformat())
        current += timedelta(weeks=1)
    return labels


def generate_monthly_labels(from_date: date, to_date: date) -> list[str]:
    """Generate a list of "YYYY-MM" labels for each month touched by the range.

    Args:
        from_date: Start date (inclusive).
        to_date: End date (inclusive).

    Returns:
        Ordered list of "YYYY-MM" strings for every calendar month that
        overlaps with [from_date, to_date].
    """
    labels: list[str] = []
    current_year = from_date.year
    current_month = from_date.month
    end_year = to_date.year
    end_month = to_date.month

    while (current_year, current_month) <= (end_year, end_month):
        labels.append(f"{current_year:04d}-{current_month:02d}")
        if current_month == 12:
            current_year += 1
            current_month = 1
        else:
            current_month += 1
    return labels


def _validate_filter_ids(filters: FiltersIn | None) -> None:
    """Validate UUID format for all provided filter ID values.

    Args:
        filters: Optional filter constraints containing user_ids, agent_ids,
            and/or group_ids.

    Raises:
        ValueError: When any provided ID value does not match UUID format.
    """
    if filters is None:
        return

    for field_name, ids in [
        ("user_ids", filters.user_ids),
        ("agent_ids", filters.agent_ids),
        ("group_ids", filters.group_ids),
    ]:
        if not ids:
            continue
        for id_value in ids:
            if not _UUID_RE.match(id_value):
                raise ValueError(f"Invalid UUID format in {field_name}: {id_value!r}")


async def get_daily_buckets(
    db: AsyncSession,
    from_date: date,
    to_date: date,
    metric: Metric,
    dimension: Dimension,
    filters: FiltersIn | None = None,
) -> dict[tuple[date, str], float]:
    """Return raw {(day, dimension_value): metric_value} from a single SQL query.

    Builds a half-open UTC window for sargable date filtering. The cast to Date
    appears only in SELECT/GROUP BY for day bucketing, never in WHERE.

    Args:
        db: Async database session.
        from_date: Start date (inclusive).
        to_date: End date (inclusive).
        metric: Which metric to aggregate (cost, tokens, or hits).
        dimension: How to slice the data (none, user, agent, or group).
        filters: Optional filter constraints restricting by user, agent, or
            group membership.

    Returns:
        A dict mapping (day, dimension_key) tuples to aggregated float values.
        Returns an empty dict when no rows match.

    Raises:
        ValueError: When any provided filter ID is malformed.
    """
    _validate_filter_ids(filters)

    from_dt = datetime.combine(from_date, time.min, tzinfo=UTC)
    to_dt = datetime.combine(to_date + timedelta(days=1), time.min, tzinfo=UTC)

    dialect_name = db.bind.dialect.name

    if metric in (Metric.cost, Metric.tokens):
        stmt = _build_cost_tokens_stmt(from_dt, to_dt, metric, dimension, filters, dialect_name)
    else:
        stmt = _build_hits_stmt(from_dt, to_dt, dimension, filters, dialect_name)

    result = await db.execute(stmt)
    rows = result.all()

    buckets: dict[tuple[date, str], float] = {}
    for row in rows:
        buckets[(_coerce_day(row.day), row.dim_key)] = float(row.value or 0.0)

    return buckets


def _build_cost_tokens_stmt(
    from_dt: datetime,
    to_dt: datetime,
    metric: Metric,
    dimension: Dimension,
    filters: FiltersIn | None,
    dialect_name: str,
) -> Select[tuple[Any, ...]]:
    """Build the SELECT statement for cost/tokens metrics with dimension joins.

    Args:
        from_dt: Inclusive lower bound (UTC datetime).
        to_dt: Exclusive upper bound (UTC datetime).
        metric: Either cost or tokens.
        dimension: Dimension to group by.
        filters: Optional filter constraints.
        dialect_name: The active SQLAlchemy dialect name.

    Returns:
        A SQLAlchemy select statement ready for execution.
    """
    day_col = _day_bucket(TokenUsage.created_at, dialect_name).label("day")

    if metric == Metric.cost:
        agg_col = func.sum(TokenUsage.cost).label("value")
    else:
        agg_col = func.sum(TokenUsage.input_tokens + TokenUsage.output_tokens).label("value")

    dim_col = _get_dim_col(dimension)

    stmt = select(day_col, dim_col, agg_col).select_from(TokenUsage)

    # Dimension joins require ChatSession as a bridge
    needs_session_join = dimension != Dimension.none or _filters_need_session_join(filters)

    if needs_session_join:
        stmt = stmt.join(ChatSession, ChatSession.id == TokenUsage.chat_session_id)

    stmt = _apply_dimension_joins(stmt, dimension, ChatSession)
    stmt = stmt.where(
        TokenUsage.created_at >= from_dt,
        TokenUsage.created_at < to_dt,
    )
    stmt = _apply_filters(stmt, filters)
    stmt = stmt.group_by(day_col, dim_col).order_by(day_col)

    return stmt


def _build_hits_stmt(
    from_dt: datetime,
    to_dt: datetime,
    dimension: Dimension,
    filters: FiltersIn | None,
    dialect_name: str,
) -> Select[tuple[Any, ...]]:
    """Build the SELECT statement for hits metric with dimension joins.

    Args:
        from_dt: Inclusive lower bound (UTC datetime).
        to_dt: Exclusive upper bound (UTC datetime).
        dimension: Dimension to group by.
        filters: Optional filter constraints.
        dialect_name: The active SQLAlchemy dialect name.

    Returns:
        A SQLAlchemy select statement ready for execution.
    """
    day_col = _day_bucket(ChatMessage.created_at, dialect_name).label("day")
    agg_col = func.count(ChatMessage.id).label("value")
    dim_col = _get_dim_col(dimension)

    stmt = (
        select(day_col, dim_col, agg_col)
        .select_from(ChatMessage)
        .join(ChatSession, ChatSession.id == ChatMessage.chat_session_id)
    )

    stmt = _apply_dimension_joins(stmt, dimension, ChatSession)
    stmt = stmt.where(
        ChatMessage.role == "assistant",
        ChatMessage.is_success == True,  # noqa: E712
        ChatMessage.created_at >= from_dt,
        ChatMessage.created_at < to_dt,
    )
    stmt = _apply_filters(stmt, filters)
    stmt = stmt.group_by(day_col, dim_col).order_by(day_col)

    return stmt


def _get_dim_col(dimension: Dimension) -> ColumnElement[Any]:
    """Return the SQLAlchemy column expression for the given dimension.

    Args:
        dimension: The dimension to resolve.

    Returns:
        A labeled column expression for use in SELECT and GROUP BY.
    """
    if dimension == Dimension.none:
        return literal("_total").label("dim_key")
    if dimension == Dimension.user:
        return User.username.label("dim_key")
    if dimension == Dimension.agent:
        return func.coalesce(Agent.name, "Unknown").label("dim_key")
    # dimension == Dimension.group
    return func.coalesce(Group.name, "No group").label("dim_key")


def _apply_dimension_joins(
    stmt: Select[tuple[Any, ...]], dimension: Dimension, session_cls: type[ChatSession]
) -> Select[tuple[Any, ...]]:
    """Apply dimension-specific JOIN clauses to the statement.

    Args:
        stmt: The current select statement.
        dimension: Which dimension to join for.
        session_cls: The ChatSession model class (already joined).

    Returns:
        The statement with additional joins applied.
    """
    if dimension == Dimension.none:
        return stmt

    if dimension == Dimension.user:
        stmt = stmt.join(User, User.id == session_cls.user_id)
    elif dimension == Dimension.agent:
        stmt = stmt.outerjoin(Agent, Agent.id == session_cls.agent_id)
    elif dimension == Dimension.group:
        stmt = stmt.outerjoin(UserGroup, UserGroup.user_id == session_cls.user_id)
        stmt = stmt.outerjoin(Group, Group.id == UserGroup.group_id)

    return stmt


def _filters_need_session_join(filters: FiltersIn | None) -> bool:
    """Determine if any active filter requires a ChatSession join.

    Args:
        filters: Optional filter constraints.

    Returns:
        True if any filter is present and non-empty.
    """
    if filters is None:
        return False
    return bool(filters.user_ids or filters.agent_ids or filters.group_ids)


def _apply_filters(
    stmt: Select[tuple[Any, ...]], filters: FiltersIn | None
) -> Select[tuple[Any, ...]]:
    """Apply filter WHERE clauses to the statement.

    Args:
        stmt: The current select statement.
        filters: Optional filter constraints.

    Returns:
        The statement with filter predicates applied.
    """
    if filters is None:
        return stmt

    if filters.user_ids:
        stmt = stmt.where(ChatSession.user_id.in_(filters.user_ids))

    if filters.agent_ids:
        stmt = stmt.where(ChatSession.agent_id.in_(filters.agent_ids))

    if filters.group_ids:
        subq = (
            select(UserGroup.user_id)
            .where(UserGroup.group_id.in_(filters.group_ids))
            .scalar_subquery()
        )
        stmt = stmt.where(ChatSession.user_id.in_(subq))

    return stmt


def apply_top_n_other(
    series_totals: dict[str, float],
    max_n: int,
) -> tuple[list[str], set[str]]:
    """Rank series by total descending, return top names and overflow set.

    Args:
        series_totals: Mapping of series name to aggregate total value.
        max_n: Maximum number of top series to retain.

    Returns:
        A tuple of (top_n_names, other_names) where top_n_names is a list
        sorted descending by value and other_names contains all remaining
        names. other_names is empty when len(series_totals) <= max_n.
    """
    ranked = sorted(series_totals, key=lambda k: series_totals[k], reverse=True)
    if len(ranked) <= max_n:
        return ranked, set()
    top = ranked[:max_n]
    others = set(ranked[max_n:])
    return top, others


async def get_timeline(db: AsyncSession, request: TimelineRequest) -> TimelineOut:
    """Build a time-series response for the given timeline request.

    Fetches raw daily buckets, applies interval rollup if needed, generates
    labels for the full date range, and fills zeros for missing buckets.

    When stack_by is a dimension value, produces one series per dimension value
    ranked by total descending, capped at max_series, with an "Other" series
    for all excluded dimension values.

    Args:
        db: Async database session.
        request: Validated timeline request with date range, metric, interval,
            stack_by dimension, and optional filters.

    Returns:
        A TimelineOut with labels covering the full requested range and one or
        more named series.
    """
    buckets = await get_daily_buckets(
        db,
        request.from_date,
        request.to_date,
        request.metric,
        request.stack_by,
        request.filters,
    )

    if request.stack_by == Dimension.none:
        return _build_unstacked_timeline(buckets, request)

    return _build_stacked_timeline(buckets, request)


def _build_unstacked_timeline(
    buckets: dict[tuple[date, str], float],
    request: TimelineRequest,
) -> TimelineOut:
    """Build a single-series timeline for stack_by=none.

    Args:
        buckets: Raw daily buckets with "_total" as the dimension key.
        request: The timeline request parameters.

    Returns:
        TimelineOut with one series named after the metric.
    """
    daily: dict[date, float] = {day: value for (day, _dim_key), value in buckets.items()}

    labels = _generate_labels(request.interval, request.from_date, request.to_date)
    rolled = _roll_up_daily(daily, request.interval)
    values = [rolled.get(label, 0.0) for label in labels]

    series = [SeriesItem(name=request.metric.value, data=values)]

    return TimelineOut(
        interval=request.interval.value,
        metric=request.metric.value,
        labels=labels,
        series=series,
    )


def _build_stacked_timeline(
    buckets: dict[tuple[date, str], float],
    request: TimelineRequest,
) -> TimelineOut:
    """Build a multi-series timeline for stack_by != none.

    Produces one series per dimension value, ranked by total descending,
    capped at max_series. Appends an "Other" series when excluded dimension
    values exist.

    Args:
        buckets: Raw daily buckets with dimension keys.
        request: The timeline request parameters.

    Returns:
        TimelineOut with ranked series and optional "Other" series.
    """
    labels = _generate_labels(request.interval, request.from_date, request.to_date)

    if not buckets:
        return TimelineOut(
            interval=request.interval.value,
            metric=request.metric.value,
            labels=labels,
            series=[],
        )

    # Compute per-dimension daily dicts and totals
    dim_daily: dict[str, dict[date, float]] = {}
    for (day, dim_key), value in buckets.items():
        if dim_key not in dim_daily:
            dim_daily[dim_key] = {}
        dim_daily[dim_key][day] = dim_daily[dim_key].get(day, 0.0) + value

    series_totals: dict[str, float] = {
        name: sum(daily.values()) for name, daily in dim_daily.items()
    }

    top_n_names, other_names = apply_top_n_other(series_totals, request.max_series)

    series: list[SeriesItem] = []
    for name in top_n_names:
        rolled = _roll_up_daily(dim_daily[name], request.interval)
        values = [rolled.get(label, 0.0) for label in labels]
        series.append(SeriesItem(name=name, data=values))

    if other_names:
        other_daily: dict[date, float] = {}
        for name in other_names:
            for day, value in dim_daily[name].items():
                other_daily[day] = other_daily.get(day, 0.0) + value
        rolled = _roll_up_daily(other_daily, request.interval)
        values = [rolled.get(label, 0.0) for label in labels]
        series.append(SeriesItem(name="Other", data=values))

    return TimelineOut(
        interval=request.interval.value,
        metric=request.metric.value,
        labels=labels,
        series=series,
    )


def _generate_labels(interval: Interval, from_date: date, to_date: date) -> list[str]:
    """Generate time-bucket labels for the given interval and date range.

    Args:
        interval: The bucketing interval.
        from_date: Start date (inclusive).
        to_date: End date (inclusive).

    Returns:
        Ordered list of label strings covering the full range.
    """
    if interval == Interval.daily:
        return generate_daily_labels(from_date, to_date)
    if interval == Interval.weekly:
        return generate_weekly_labels(from_date, to_date)
    return generate_monthly_labels(from_date, to_date)


def _roll_up_daily(daily: dict[date, float], interval: Interval) -> dict[str, float]:
    """Roll up daily values by interval, returning string-keyed buckets.

    Args:
        daily: Mapping of dates to values.
        interval: The target interval for rollup.

    Returns:
        A dict keyed by label strings with rolled-up values.
    """
    if interval == Interval.daily:
        return {d.isoformat(): v for d, v in daily.items()}
    if interval == Interval.weekly:
        weekly = roll_up_daily_to_weekly(daily)
        return {d.isoformat(): v for d, v in weekly.items()}
    return roll_up_daily_to_monthly(daily)


async def get_summary(
    db: AsyncSession,
    from_date: date,
    to_date: date,
    filters: FiltersIn | None = None,
) -> tuple[float, int, int, int, int]:
    """Return aggregate KPI totals for the given date range and filters.

    Cost and token sums come from a single ``TokenUsage`` aggregate; hits and
    active-user counts come from their own queries. Each metric returns 0 when
    its own source has no matching rows.

    Args:
        db: Async database session.
        from_date: Start date (inclusive).
        to_date: End date (inclusive).
        filters: Optional filter constraints restricting by user, agent, or
            group membership.

    Returns:
        A tuple of (total_cost, input_tokens, output_tokens, hits, active_users).

    Raises:
        ValueError: When any provided filter ID is malformed.
    """
    _validate_filter_ids(filters)

    from_dt = datetime.combine(from_date, time.min, tzinfo=UTC)
    to_dt = datetime.combine(to_date + timedelta(days=1), time.min, tzinfo=UTC)

    total_cost, input_tokens, output_tokens = await _get_summary_token_totals(
        db, from_dt, to_dt, filters
    )
    hits = await _get_summary_hits(db, from_dt, to_dt, filters)
    active_users = await _get_summary_active_users(db, from_dt, to_dt, filters)

    return total_cost, input_tokens, output_tokens, hits, active_users


async def _get_summary_token_totals(
    db: AsyncSession,
    from_dt: datetime,
    to_dt: datetime,
    filters: FiltersIn | None,
) -> tuple[float, int, int]:
    """Sum cost, input tokens, and output tokens from TokenUsage in one query.

    Args:
        db: Async database session.
        from_dt: Inclusive lower bound (UTC datetime).
        to_dt: Exclusive upper bound (UTC datetime).
        filters: Optional filter constraints.

    Returns:
        A tuple of (total_cost, input_tokens, output_tokens); zeros when no
        rows match.
    """
    stmt = (
        select(
            func.coalesce(func.sum(TokenUsage.cost), 0.0),
            func.coalesce(func.sum(TokenUsage.input_tokens), 0),
            func.coalesce(func.sum(TokenUsage.output_tokens), 0),
        )
        .select_from(TokenUsage)
        .where(
            TokenUsage.created_at >= from_dt,
            TokenUsage.created_at < to_dt,
        )
    )

    if _filters_need_session_join(filters):
        stmt = stmt.join(ChatSession, ChatSession.id == TokenUsage.chat_session_id)
        stmt = _apply_filters(stmt, filters)

    row = (await db.execute(stmt)).one()
    return float(row[0]), int(row[1]), int(row[2])


async def _get_summary_hits(
    db: AsyncSession,
    from_dt: datetime,
    to_dt: datetime,
    filters: FiltersIn | None,
) -> int:
    """Count ChatMessage hits (assistant, non-error) within the half-open window.

    Joins ChatSession via chat_session_id and applies user/agent/group filters
    on the session.

    Args:
        db: Async database session.
        from_dt: Inclusive lower bound (UTC datetime).
        to_dt: Exclusive upper bound (UTC datetime).
        filters: Optional filter constraints.

    Returns:
        Hit count as an int, or 0 when no rows match.
    """
    stmt = (
        select(func.count(ChatMessage.id))
        .select_from(ChatMessage)
        .join(ChatSession, ChatSession.id == ChatMessage.chat_session_id)
        .where(
            ChatMessage.role == "assistant",
            ChatMessage.is_success == True,  # noqa: E712
            ChatMessage.created_at >= from_dt,
            ChatMessage.created_at < to_dt,
        )
    )

    stmt = _apply_filters(stmt, filters)

    result = await db.execute(stmt)
    value = result.scalar_one_or_none()
    return int(value or 0)


async def _get_summary_active_users(
    db: AsyncSession,
    from_dt: datetime,
    to_dt: datetime,
    filters: FiltersIn | None,
) -> int:
    """Count distinct TokenUsage.user_id values within the half-open window.

    Args:
        db: Async database session.
        from_dt: Inclusive lower bound (UTC datetime).
        to_dt: Exclusive upper bound (UTC datetime).
        filters: Optional filter constraints.

    Returns:
        Active user count as an int, or 0 when no rows match.
    """
    stmt = (
        select(func.count(func.distinct(TokenUsage.user_id)))
        .select_from(TokenUsage)
        .where(
            TokenUsage.created_at >= from_dt,
            TokenUsage.created_at < to_dt,
        )
    )

    if _filters_need_session_join(filters):
        stmt = stmt.join(ChatSession, ChatSession.id == TokenUsage.chat_session_id)
        stmt = _apply_filters(stmt, filters)

    result = await db.execute(stmt)
    value = result.scalar_one_or_none()
    return int(value or 0)


async def get_breakdown(db: AsyncSession, request: BreakdownRequest) -> BreakdownOut:
    """Build a ranked breakdown response for the given request.

    Fetches daily buckets grouped by category, ranks them by total, applies
    top-N with "Other" folding, then builds series aligned to the ranked labels.

    When stack_by is a dimension value, produces cross-tabulated series: each
    series represents a stack_by value with one entry per category label.

    Args:
        db: Async database session.
        request: Validated breakdown request with date range, category,
            stack_by dimension, metric, and optional filters.

    Returns:
        A BreakdownOut with ranked labels and one or more named series.
        Returns empty labels and series when no records match.
    """
    category_dim = Dimension(request.category)

    category_buckets = await get_daily_buckets(
        db,
        request.from_date,
        request.to_date,
        request.metric,
        category_dim,
        request.filters,
    )

    if not category_buckets:
        return BreakdownOut(
            metric=request.metric.value,
            category=request.category,
            labels=[],
            series=[],
        )

    # Sum across days to get totals per category key
    category_totals: dict[str, float] = {}
    for (_day, cat_key), value in category_buckets.items():
        category_totals[cat_key] = category_totals.get(cat_key, 0.0) + value

    top_categories, _other_categories = apply_top_n_other(category_totals, request.max_items)

    # Build labels in descending-total order; top-N only, no "Other" bar.
    labels = list(top_categories)

    if request.stack_by == Dimension.none:
        return _build_unstacked_breakdown(
            request,
            labels,
            top_categories,
            category_totals,
        )

    return await _build_stacked_breakdown(
        db,
        request,
        labels,
        top_categories,
    )


def _build_unstacked_breakdown(
    request: BreakdownRequest,
    labels: list[str],
    top_categories: list[str],
    category_totals: dict[str, float],
) -> BreakdownOut:
    """Build a single-series breakdown for stack_by=none.

    Args:
        request: The breakdown request parameters.
        labels: Ranked labels in descending-total order.
        top_categories: Top-N category names in rank order.
        category_totals: Mapping of category name to total value.

    Returns:
        BreakdownOut with one series named after the metric.
    """
    values: list[float] = [category_totals[cat] for cat in top_categories]
    series = [BreakdownSeriesItem(name=request.metric.value, values=values)]

    return BreakdownOut(
        metric=request.metric.value,
        category=request.category,
        labels=labels,
        series=series,
    )


async def _build_stacked_breakdown(
    db: AsyncSession,
    request: BreakdownRequest,
    labels: list[str],
    top_categories: list[str],
) -> BreakdownOut:
    """Build a multi-series breakdown for stack_by != none.

    Performs a cross-tabulation query grouping by both category and stack_by
    dimensions. Produces one series per top stack_by value (capped at
    max_series) plus an aggregated "Other" series for the remainder.

    Args:
        db: Async database session.
        request: The breakdown request parameters.
        labels: Ranked category labels (bars) in descending-total order.
        top_categories: Top-N category names in rank order.

    Returns:
        BreakdownOut with top-M named series and an optional "Other" series.
    """
    category_dim = Dimension(request.category)

    cross_tab = await _get_cross_tab(
        db,
        request.from_date,
        request.to_date,
        request.metric,
        category_dim,
        request.stack_by,
        request.filters,
    )

    # Rank stack_by values by their total across all top categories.
    series_totals: dict[str, float] = {}
    for (_cat_key, stack_key), value in cross_tab.items():
        series_totals[stack_key] = series_totals.get(stack_key, 0.0) + value

    top_series, other_series = apply_top_n_other(series_totals, request.max_series)

    series: list[BreakdownSeriesItem] = []
    for series_name in top_series:
        values: list[float] = [cross_tab.get((cat, series_name), 0.0) for cat in top_categories]
        series.append(BreakdownSeriesItem(name=series_name, values=values))

    # Fold all remaining stack_by values into a single "Other" series.
    if other_series:
        other_values: list[float] = [
            sum(cross_tab.get((cat, s), 0.0) for s in other_series) for cat in top_categories
        ]
        series.append(BreakdownSeriesItem(name="Other", values=other_values))

    return BreakdownOut(
        metric=request.metric.value,
        category=request.category,
        labels=labels,
        series=series,
    )


async def _get_cross_tab(
    db: AsyncSession,
    from_date: date,
    to_date: date,
    metric: Metric,
    category_dim: Dimension,
    stack_by_dim: Dimension,
    filters: FiltersIn | None,
) -> dict[tuple[str, str], float]:
    """Query a cross-tabulation grouped by both category and stack_by dimensions.

    Returns totals (summed across all days) for each (category_key, stack_by_key)
    pair within the date range.

    Args:
        db: Async database session.
        from_date: Start date (inclusive).
        to_date: End date (inclusive).
        metric: Which metric to aggregate.
        category_dim: The category dimension (user, agent, or group).
        stack_by_dim: The stack_by dimension (user, agent, or group).
        filters: Optional filter constraints.

    Returns:
        A dict mapping (category_key, stack_by_key) to aggregated float values.
    """
    _validate_filter_ids(filters)

    from_dt = datetime.combine(from_date, time.min, tzinfo=UTC)
    to_dt = datetime.combine(to_date + timedelta(days=1), time.min, tzinfo=UTC)

    if metric in (Metric.cost, Metric.tokens):
        stmt = _build_cross_tab_cost_tokens(
            from_dt, to_dt, metric, category_dim, stack_by_dim, filters
        )
    else:
        stmt = _build_cross_tab_hits(from_dt, to_dt, category_dim, stack_by_dim, filters)

    result = await db.execute(stmt)
    rows = result.all()

    cross_tab: dict[tuple[str, str], float] = {}
    for row in rows:
        key = (row.cat_key, row.stack_key)
        cross_tab[key] = cross_tab.get(key, 0.0) + float(row.value or 0.0)

    return cross_tab


def _get_dim_col_aliased(dimension: Dimension, alias: str) -> ColumnElement[Any]:
    """Return the SQLAlchemy column expression for the given dimension with a custom alias.

    Args:
        dimension: The dimension to resolve.
        alias: The label name for the column.

    Returns:
        A labeled column expression for use in SELECT and GROUP BY.
    """
    if dimension == Dimension.none:
        return literal("_total").label(alias)
    if dimension == Dimension.user:
        return User.username.label(alias)
    if dimension == Dimension.agent:
        return func.coalesce(Agent.name, "Unknown").label(alias)
    # dimension == Dimension.group
    return func.coalesce(Group.name, "No group").label(alias)


def _apply_both_dimension_joins(
    stmt: Select[tuple[Any, ...]],
    category_dim: Dimension,
    stack_by_dim: Dimension,
    session_cls: type[ChatSession],
) -> Select[tuple[Any, ...]]:
    """Apply joins for both category and stack_by dimensions, avoiding duplicates.

    Args:
        stmt: The current select statement.
        category_dim: The category dimension.
        stack_by_dim: The stack_by dimension.
        session_cls: The ChatSession model class (already joined).

    Returns:
        The statement with all necessary joins applied.
    """
    joined_tables: set[str] = set()

    for dim in (category_dim, stack_by_dim):
        if dim == Dimension.none:
            continue
        if dim == Dimension.user and "user" not in joined_tables:
            stmt = stmt.join(User, User.id == session_cls.user_id)
            joined_tables.add("user")
        elif dim == Dimension.agent and "agent" not in joined_tables:
            stmt = stmt.outerjoin(Agent, Agent.id == session_cls.agent_id)
            joined_tables.add("agent")
        elif dim == Dimension.group and "group" not in joined_tables:
            stmt = stmt.outerjoin(UserGroup, UserGroup.user_id == session_cls.user_id)
            stmt = stmt.outerjoin(Group, Group.id == UserGroup.group_id)
            joined_tables.add("group")

    return stmt


def _build_cross_tab_cost_tokens(
    from_dt: datetime,
    to_dt: datetime,
    metric: Metric,
    category_dim: Dimension,
    stack_by_dim: Dimension,
    filters: FiltersIn | None,
) -> Select[tuple[Any, ...]]:
    """Build SELECT for cross-tab cost/tokens grouped by category and stack_by.

    Args:
        from_dt: Inclusive lower bound (UTC datetime).
        to_dt: Exclusive upper bound (UTC datetime).
        metric: Either cost or tokens.
        category_dim: Category dimension for grouping.
        stack_by_dim: Stack-by dimension for grouping.
        filters: Optional filter constraints.

    Returns:
        A SQLAlchemy select statement ready for execution.
    """
    if metric == Metric.cost:
        agg_col = func.sum(TokenUsage.cost).label("value")
    else:
        agg_col = func.sum(TokenUsage.input_tokens + TokenUsage.output_tokens).label("value")

    cat_col = _get_dim_col_aliased(category_dim, "cat_key")
    stack_col = _get_dim_col_aliased(stack_by_dim, "stack_key")

    stmt = select(cat_col, stack_col, agg_col).select_from(TokenUsage)
    stmt = stmt.join(ChatSession, ChatSession.id == TokenUsage.chat_session_id)
    stmt = _apply_both_dimension_joins(stmt, category_dim, stack_by_dim, ChatSession)
    stmt = stmt.where(
        TokenUsage.created_at >= from_dt,
        TokenUsage.created_at < to_dt,
    )
    stmt = _apply_filters(stmt, filters)
    stmt = stmt.group_by(cat_col, stack_col)

    return stmt


def _build_cross_tab_hits(
    from_dt: datetime,
    to_dt: datetime,
    category_dim: Dimension,
    stack_by_dim: Dimension,
    filters: FiltersIn | None,
) -> Select[tuple[Any, ...]]:
    """Build SELECT for cross-tab hits grouped by category and stack_by.

    Args:
        from_dt: Inclusive lower bound (UTC datetime).
        to_dt: Exclusive upper bound (UTC datetime).
        category_dim: Category dimension for grouping.
        stack_by_dim: Stack-by dimension for grouping.
        filters: Optional filter constraints.

    Returns:
        A SQLAlchemy select statement ready for execution.
    """
    agg_col = func.count(ChatMessage.id).label("value")
    cat_col = _get_dim_col_aliased(category_dim, "cat_key")
    stack_col = _get_dim_col_aliased(stack_by_dim, "stack_key")

    stmt = (
        select(cat_col, stack_col, agg_col)
        .select_from(ChatMessage)
        .join(ChatSession, ChatSession.id == ChatMessage.chat_session_id)
    )

    stmt = _apply_both_dimension_joins(stmt, category_dim, stack_by_dim, ChatSession)
    stmt = stmt.where(
        ChatMessage.role == "assistant",
        ChatMessage.is_success == True,  # noqa: E712
        ChatMessage.created_at >= from_dt,
        ChatMessage.created_at < to_dt,
    )
    stmt = _apply_filters(stmt, filters)
    stmt = stmt.group_by(cat_col, stack_col)

    return stmt


async def get_budgets(
    db: AsyncSession,
    status_filter: BudgetStatusFilter = BudgetStatusFilter.all,
) -> list[BudgetItemOut]:
    """Return per-user current-month spend vs budget with status classification.

    Computes each active user's spend for the current UTC month, compares it
    against their configured budget, and classifies the result as ok, warn, or
    danger. Results are sorted by pct_used descending.

    Args:
        db: Async database session.
        status_filter: Optional filter to restrict results to approaching
            (warn/danger but not over) or over-budget users only.

    Returns:
        A list of BudgetItemOut sorted by pct_used descending.
    """
    month_start = datetime.now(UTC).replace(day=1, hour=0, minute=0, second=0, microsecond=0)

    # Step 1: grouped query for current-month spend per user
    spend_stmt = (
        select(TokenUsage.user_id, func.sum(TokenUsage.cost).label("total_cost"))
        .where(TokenUsage.created_at >= month_start)
        .group_by(TokenUsage.user_id)
    )
    spend_result = await db.execute(spend_stmt)
    spend_map: dict[str, float] = {
        row.user_id: float(row.total_cost or 0.0) for row in spend_result.all()
    }

    # Step 2: fetch all active users
    users_stmt = select(User).where(User.is_active == True)  # noqa: E712
    users_result = await db.execute(users_stmt)
    users = users_result.scalars().all()

    # Step 3: Python LEFT JOIN — compute budget items
    items: list[BudgetItemOut] = []
    for user in users:
        spend = spend_map.get(user.id, 0.0)
        budget = user.budget or 0.0

        pct_used = spend / budget if budget > 0 else 0.0

        if pct_used < 0.5:
            status = "ok"
        elif pct_used < 0.85:
            status = "warn"
        else:
            status = "danger"

        is_over = spend >= budget if budget > 0 else spend > 0

        items.append(
            BudgetItemOut(
                user_id=user.id,
                username=user.username,
                spend=spend,
                budget=budget,
                pct_used=pct_used,
                status=status,
                is_over=is_over,
            )
        )

    # Apply status_filter
    if status_filter == BudgetStatusFilter.approaching:
        items = [item for item in items if item.status in ("warn", "danger") and not item.is_over]
    elif status_filter == BudgetStatusFilter.over:
        items = [item for item in items if item.is_over]

    # Sort by pct_used descending
    items.sort(key=lambda item: item.pct_used, reverse=True)

    return items


async def get_monthly_spend(db: AsyncSession, user_id: str) -> float:
    """Sum TokenUsage.cost for a user since the first day of the current UTC month.

    Single SQL aggregate query used on the budget-gate hot path. Uses the raw
    ``created_at`` column in the WHERE clause (sargable, index-friendly).

    Args:
        db: Async database session.
        user_id: The primary key of the user.

    Returns:
        Total cost as a float, or 0.0 when no records exist.
    """
    now = datetime.now(UTC)
    start_of_month = datetime(now.year, now.month, 1, tzinfo=UTC)

    result = await db.execute(
        select(func.sum(TokenUsage.cost)).where(
            TokenUsage.user_id == user_id,
            TokenUsage.created_at >= start_of_month,
        )
    )
    return float(result.scalar_one_or_none() or 0.0)


async def get_session_usage_summary(
    db: AsyncSession,
    chat_session_id: str,
) -> tuple[int, int, float]:
    """Return (input_tokens, output_tokens, total_cost) for a chat session.

    Single aggregate query over all ``token_usage`` rows for the given session.

    Args:
        db: Async database session.
        chat_session_id: The primary key of the owning chat session.

    Returns:
        A tuple of (input_tokens, output_tokens, total_cost). All values are
        zero when no usage records exist for the session.
    """
    result = await db.execute(
        select(
            func.coalesce(func.sum(TokenUsage.input_tokens), 0),
            func.coalesce(func.sum(TokenUsage.output_tokens), 0),
            func.coalesce(func.sum(TokenUsage.cost), 0.0),
        ).where(TokenUsage.chat_session_id == chat_session_id)
    )
    row = result.one()
    return int(row[0]), int(row[1]), float(row[2])


def compute_cost(
    input_cost_per_million: float,
    output_cost_per_million: float,
    input_tokens: int,
    output_tokens: int,
) -> float:
    """Compute token cost from per-million pricing and token counts.

    Args:
        input_cost_per_million: Price per 1,000,000 input tokens.
        output_cost_per_million: Price per 1,000,000 output tokens.
        input_tokens: Number of input tokens consumed.
        output_tokens: Number of output tokens consumed.

    Returns:
        The total cost as a float. Returns 0.0 when both token counts are 0.
    """
    if input_tokens == 0 and output_tokens == 0:
        return 0.0
    return (
        input_tokens / 1_000_000 * input_cost_per_million
        + output_tokens / 1_000_000 * output_cost_per_million
    )


async def get_user_usage(
    db: AsyncSession,
    user_id: str,
    from_date: date,
    to_date: date,
    interval: Interval,
) -> MeUsageOut:
    """Return pre-bucketed cost and token usage for a single user.

    Fetches daily buckets for cost, input_tokens, and output_tokens scoped to
    the given user, rolls them up by interval, generates labels covering the
    full range, and fills zeros for missing buckets.

    Args:
        db: Async database session.
        user_id: The primary key of the user to query.
        from_date: Start date (inclusive).
        to_date: End date (inclusive).
        interval: Time bucket granularity (daily, weekly, monthly).

    Returns:
        A MeUsageOut with the requested interval and a list of MeUsagePoint
        entries in ascending chronological order covering every bucket in
        the range.
    """
    daily = await _get_daily_user_usage(db, from_date, to_date, user_id)

    daily_cost: dict[date, float] = {day: cost for day, (cost, _i, _o) in daily.items()}
    daily_input: dict[date, int] = {day: inp for day, (_c, inp, _o) in daily.items()}
    daily_output: dict[date, int] = {day: out for day, (_c, _i, out) in daily.items()}

    labels = _generate_labels(interval, from_date, to_date)
    rolled_cost = _roll_up_daily(daily_cost, interval)
    rolled_input = _roll_up_daily_int(daily_input, interval)
    rolled_output = _roll_up_daily_int(daily_output, interval)

    points: list[MeUsagePoint] = []
    for label in labels:
        points.append(
            MeUsagePoint(
                label=label,
                cost=rolled_cost.get(label, 0.0),
                input_tokens=rolled_input.get(label, 0),
                output_tokens=rolled_output.get(label, 0),
            )
        )

    return MeUsageOut(interval=interval.value, points=points)


async def _get_daily_user_usage(
    db: AsyncSession,
    from_date: date,
    to_date: date,
    user_id: str,
) -> dict[date, tuple[float, int, int]]:
    """Fetch per-day cost, input, and output token sums for a single user.

    Args:
        db: Async database session.
        from_date: Start date (inclusive).
        to_date: End date (inclusive).
        user_id: The user to scope the query to.

    Returns:
        A dict mapping dates to (cost, input_tokens, output_tokens) tuples.
    """
    from_dt = datetime.combine(from_date, time.min, tzinfo=UTC)
    to_dt = datetime.combine(to_date + timedelta(days=1), time.min, tzinfo=UTC)

    day_col = _day_bucket(TokenUsage.created_at, db.bind.dialect.name).label("day")
    stmt = (
        select(
            day_col,
            func.sum(TokenUsage.cost).label("total_cost"),
            func.sum(TokenUsage.input_tokens).label("total_input"),
            func.sum(TokenUsage.output_tokens).label("total_output"),
        )
        .select_from(TokenUsage)
        .join(ChatSession, ChatSession.id == TokenUsage.chat_session_id)
        .where(
            TokenUsage.created_at >= from_dt,
            TokenUsage.created_at < to_dt,
            ChatSession.user_id == user_id,
        )
        .group_by(day_col)
        .order_by(day_col)
    )

    result = await db.execute(stmt)
    buckets: dict[date, tuple[float, int, int]] = {}
    for row in result.all():
        buckets[_coerce_day(row.day)] = (
            float(row.total_cost or 0.0),
            int(row.total_input or 0),
            int(row.total_output or 0),
        )
    return buckets


def _roll_up_daily_int(daily: dict[date, int], interval: Interval) -> dict[str, int]:
    """Roll up daily integer values by interval, returning string-keyed buckets.

    Args:
        daily: Mapping of dates to integer values.
        interval: The target interval for rollup.

    Returns:
        A dict keyed by label strings with rolled-up integer values. Weekly
        keys are the ISO-week Monday in YYYY-MM-DD form, matching the labels
        produced by ``generate_weekly_labels``.
    """
    if interval == Interval.daily:
        return {d.isoformat(): v for d, v in daily.items()}
    if interval == Interval.weekly:
        weekly: dict[str, int] = {}
        for d, value in daily.items():
            key = get_iso_week_monday(d).isoformat()
            weekly[key] = weekly.get(key, 0) + value
        return weekly
    # monthly
    monthly: dict[str, int] = {}
    for d, value in daily.items():
        key = d.strftime("%Y-%m")
        monthly[key] = monthly.get(key, 0) + value
    return monthly
