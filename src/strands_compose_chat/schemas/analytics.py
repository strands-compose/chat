"""Pydantic v2 request/response schemas for analytics endpoints."""

from datetime import date
from enum import Enum
from typing import Annotated, Literal

from pydantic import BaseModel, BeforeValidator, ConfigDict, Field, model_validator


def _round_cost(v: float) -> float:
    """Round a raw cost value to 2 decimal places on ingestion."""
    return round(v, 2)


# Annotated float that always rounds to 2 decimal places when a model is built.
Cost = Annotated[float, BeforeValidator(_round_cost)]


class Interval(str, Enum):
    """Supported time bucket intervals for aggregation."""

    daily = "daily"
    weekly = "weekly"
    monthly = "monthly"


class Metric(str, Enum):
    """Available metrics for timeline and breakdown queries."""

    cost = "cost"
    tokens = "tokens"
    hits = "hits"


class Dimension(str, Enum):
    """Stack-by dimension for time-series and breakdown queries."""

    none = "none"
    user = "user"
    agent = "agent"
    group = "group"


class BudgetStatusFilter(str, Enum):
    """Budget table filter options."""

    all = "all"
    approaching = "approaching"
    over = "over"


class SortOrder(str, Enum):
    """Supported sort orders for budget table."""

    pct_desc = "pct_desc"


class FiltersIn(BaseModel):
    """Shared filter object for POST request bodies.

    Args:
        user_ids: Restrict results to sessions owned by these users.
        agent_ids: Restrict results to sessions using these agents.
        group_ids: Restrict results to sessions owned by users in these groups.
    """

    user_ids: list[str] | None = None
    agent_ids: list[str] | None = None
    group_ids: list[str] | None = None


class UserRef(BaseModel):
    """A user reference for filter dropdowns.

    Args:
        id: User identifier.
        username: Display name.
    """

    id: str
    username: str


class AgentRef(BaseModel):
    """An agent reference for filter dropdowns.

    Args:
        id: Agent identifier.
        name: Display name.
    """

    id: str
    name: str


class GroupRef(BaseModel):
    """A group reference for filter dropdowns.

    Args:
        id: Group identifier.
        name: Display name.
    """

    id: str
    name: str


class FiltersOut(BaseModel):
    """Response for GET /analytics/filters.

    Args:
        users: All users available for filtering.
        agents: All agents available for filtering.
        groups: All groups available for filtering.
    """

    users: list[UserRef]
    agents: list[AgentRef]
    groups: list[GroupRef]


class SummaryRequest(BaseModel):
    """Request body for POST /analytics/summary.

    Args:
        from_date: Start date (inclusive), aliased as "from" in JSON.
        to_date: End date (inclusive), aliased as "to" in JSON.
        filters: Optional filter constraints restricting by user, agent, or group.
    """

    from_date: date = Field(alias="from")
    to_date: date = Field(alias="to")
    filters: FiltersIn | None = None

    model_config = ConfigDict(populate_by_name=True)

    @model_validator(mode="after")
    def validate_date_range(self) -> "SummaryRequest":
        """Ensure from_date does not exceed to_date."""
        if self.from_date > self.to_date:
            raise ValueError("from must be <= to")
        return self


class SummaryOut(BaseModel):
    """Response body for POST /analytics/summary.

    Args:
        total_cost: Sum of TokenUsage.cost in the range.
        input_tokens: Sum of TokenUsage.input_tokens in the range.
        output_tokens: Sum of TokenUsage.output_tokens in the range.
        hits: Count of assistant messages that are not errors in the range.
        active_users: Count of distinct users with token usage in the range.
    """

    total_cost: Cost
    input_tokens: int
    output_tokens: int
    hits: int
    active_users: int


class TimelineRequest(BaseModel):
    """Request body for POST /analytics/timeline.

    Args:
        from_date: Start date (inclusive), aliased as "from" in JSON.
        to_date: End date (inclusive), aliased as "to" in JSON.
        interval: Time bucket granularity (daily, weekly, monthly).
        metric: Which metric to aggregate (cost, tokens, hits).
        stack_by: Dimension to split series by (none, user, agent, group).
        filters: Optional filter constraints.
        max_series: Maximum number of distinct series before folding into "Other".
    """

    from_date: date = Field(alias="from")
    to_date: date = Field(alias="to")
    interval: Interval
    metric: Metric
    stack_by: Dimension
    filters: FiltersIn | None = None
    max_series: int = Field(default=10, ge=1, le=100)

    model_config = ConfigDict(populate_by_name=True)

    @model_validator(mode="after")
    def validate_date_range(self) -> "TimelineRequest":
        """Ensure from_date does not exceed to_date."""
        if self.from_date > self.to_date:
            raise ValueError("from must be <= to")
        return self


class SeriesItem(BaseModel):
    """A single named data series in a timeline response.

    Args:
        name: Display name of the series (metric name or dimension value).
        data: Numeric values aligned positionally with the parent labels array.
    """

    name: str
    data: list[Cost]


class TimelineOut(BaseModel):
    """Response body for POST /analytics/timeline.

    Args:
        interval: The interval used for bucketing (daily, weekly, monthly).
        metric: The metric that was aggregated (cost, tokens, hits).
        labels: Ordered time-bucket labels aligned with series data arrays.
        series: One or more named data series.
    """

    interval: str
    metric: str
    labels: list[str]
    series: list[SeriesItem]


class BreakdownRequest(BaseModel):
    """Request body for POST /analytics/breakdown.

    Args:
        from_date: Start date (inclusive), aliased as "from" in JSON.
        to_date: End date (inclusive), aliased as "to" in JSON.
        category: Dimension to rank by (user, agent, or group).
        stack_by: Dimension to split series by (none, user, agent, group).
        metric: Which metric to aggregate (cost, tokens, hits).
        filters: Optional filter constraints restricting by user, agent, or group.
        max_items: Maximum number of ranked category labels before folding into "Other".
        max_series: Maximum number of distinct series before folding into "Other".
    """

    from_date: date = Field(alias="from")
    to_date: date = Field(alias="to")
    category: Literal["user", "agent", "group"]
    stack_by: Dimension
    metric: Metric
    filters: FiltersIn | None = None
    max_items: int = Field(default=20, ge=1, le=100)
    max_series: int = Field(default=10, ge=1, le=25)

    model_config = ConfigDict(populate_by_name=True)

    @model_validator(mode="after")
    def validate_date_range(self) -> "BreakdownRequest":
        """Ensure from_date does not exceed to_date."""
        if self.from_date > self.to_date:
            raise ValueError("from must be <= to")
        return self


class BreakdownSeriesItem(BaseModel):
    """A single named data series in a breakdown response.

    Args:
        name: Display name of the series (metric name or stack_by dimension value).
        values: Numeric values aligned positionally with the parent labels array.
    """

    name: str
    values: list[Cost]


class BreakdownOut(BaseModel):
    """Response body for POST /analytics/breakdown.

    Args:
        metric: The metric that was aggregated (cost, tokens, hits).
        category: The category dimension used for ranking (user, agent, group).
        labels: Ranked category labels in descending total order.
        series: One or more named data series with values aligned to labels.
    """

    metric: str
    category: str
    labels: list[str]
    series: list[BreakdownSeriesItem]


class BudgetItemOut(BaseModel):
    """A single user's budget status for the current month.

    Args:
        user_id: User identifier.
        username: Display name of the user.
        spend: Total spend for the current UTC month.
        budget: User's configured monthly budget.
        pct_used: Fraction of budget consumed (0.0 when budget is 0).
        status: Classification — "ok", "warn", or "danger".
        is_over: Whether the user has exceeded their budget.
    """

    user_id: str
    username: str
    spend: Cost
    budget: float
    pct_used: float
    status: Literal["ok", "warn", "danger"]
    is_over: bool


class MeUsagePoint(BaseModel):
    """A single time-bucket data point for per-user usage.

    Args:
        label: Human-readable bucket label (date, week, or month string).
        cost: Total cost in this bucket.
        input_tokens: Total input tokens in this bucket.
        output_tokens: Total output tokens in this bucket.
    """

    label: str
    cost: Cost
    input_tokens: int
    output_tokens: int


class MeUsageOut(BaseModel):
    """Response body for GET /users/me/usage.

    Args:
        interval: The interval used for bucketing (daily, weekly, monthly).
        points: Ordered list of usage data points covering the full requested range.
    """

    interval: str
    points: list[MeUsagePoint]
