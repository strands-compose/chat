"""Service-layer tests for analytics aggregation.

Covers session and monthly usage summaries, KPI aggregation, day-bucketed
metrics, and the top-N ranking helper. Dialect-sensitive cases (day bucketing)
run on the Postgres tier.
"""

from datetime import UTC, date, datetime, time

import pytest
from sqlalchemy.ext.asyncio import AsyncSession

from strands_compose_chat.analytics.service import (
    apply_top_n_other,
    get_daily_buckets,
    get_monthly_spend,
    get_session_usage_summary,
    get_summary,
)
from strands_compose_chat.schemas.analytics import Dimension, Metric
from tests.factories import (
    make_agent,
    make_chat_session,
    make_token_usage,
    make_user,
    persist,
)


def _ts(d: date) -> datetime:
    """Build a UTC datetime at noon on the given date."""
    return datetime.combine(d, time(12, 0, 0), tzinfo=UTC)


async def test_session_usage_summary_equals_arithmetic_sum(db: AsyncSession) -> None:
    user = make_user()
    agent = make_agent()
    await persist(db, user, agent)

    session = make_chat_session(user_id=user.id, agent_id=agent.id)
    await persist(db, session)

    records = [
        make_token_usage(
            chat_session_id=session.id,
            user_id=user.id,
            input_tokens=100,
            output_tokens=50,
            cost=0.01,
        ),
        make_token_usage(
            chat_session_id=session.id,
            user_id=user.id,
            input_tokens=200,
            output_tokens=80,
            cost=0.02,
        ),
        make_token_usage(
            chat_session_id=session.id,
            user_id=user.id,
            input_tokens=300,
            output_tokens=120,
            cost=0.03,
        ),
    ]
    await persist(db, *records)

    inp, out, cost = await get_session_usage_summary(db, session.id)

    assert inp == 100 + 200 + 300
    assert out == 50 + 80 + 120
    assert cost == pytest.approx(0.01 + 0.02 + 0.03)


async def test_session_usage_summary_returns_zeros_for_empty_session(db: AsyncSession) -> None:
    user = make_user()
    agent = make_agent()
    await persist(db, user, agent)

    session = make_chat_session(user_id=user.id, agent_id=agent.id)
    await persist(db, session)

    inp, out, cost = await get_session_usage_summary(db, session.id)

    assert inp == 0
    assert out == 0
    assert cost == 0.0


async def test_session_usage_summary_scoped_to_session(db: AsyncSession) -> None:
    user = make_user()
    agent = make_agent()
    await persist(db, user, agent)

    session_a = make_chat_session(user_id=user.id, agent_id=agent.id)
    session_b = make_chat_session(user_id=user.id, agent_id=agent.id)
    await persist(db, session_a, session_b)

    await persist(
        db,
        make_token_usage(
            chat_session_id=session_a.id,
            user_id=user.id,
            input_tokens=100,
            output_tokens=50,
            cost=0.01,
        ),
    )
    await persist(
        db,
        make_token_usage(
            chat_session_id=session_b.id,
            user_id=user.id,
            input_tokens=999,
            output_tokens=999,
            cost=9.99,
        ),
    )

    inp, out, cost = await get_session_usage_summary(db, session_a.id)

    assert inp == 100
    assert out == 50
    assert cost == pytest.approx(0.01)


async def test_monthly_spend_equals_arithmetic_sum_of_records(db: AsyncSession) -> None:
    user = make_user()
    agent = make_agent()
    await persist(db, user, agent)

    session = make_chat_session(user_id=user.id, agent_id=agent.id)
    await persist(db, session)

    # The frozen clock is 2024-01-15 — use explicit datetimes within the same month.
    this_month = datetime(2024, 1, 10, 12, 0, 0, tzinfo=UTC)

    costs = [0.01, 0.02, 0.03]
    records = [
        make_token_usage(
            chat_session_id=session.id,
            user_id=user.id,
            input_tokens=10,
            output_tokens=5,
            cost=c,
        )
        for c in costs
    ]
    for r in records:
        r.created_at = this_month
    await persist(db, *records)

    spend = await get_monthly_spend(db, user.id)

    assert spend == pytest.approx(sum(costs))


async def test_monthly_spend_returns_zero_for_user_with_no_records(db: AsyncSession) -> None:
    user = make_user()
    await persist(db, user)

    spend = await get_monthly_spend(db, user.id)

    assert spend == 0.0


async def test_monthly_spend_scoped_to_user(db: AsyncSession) -> None:
    user_a = make_user()
    user_b = make_user()
    agent = make_agent()
    await persist(db, user_a, user_b, agent)

    session_a = make_chat_session(user_id=user_a.id, agent_id=agent.id)
    session_b = make_chat_session(user_id=user_b.id, agent_id=agent.id)
    await persist(db, session_a, session_b)

    this_month = datetime(2024, 1, 10, 12, 0, 0, tzinfo=UTC)

    rec_a = make_token_usage(
        chat_session_id=session_a.id, user_id=user_a.id, input_tokens=10, output_tokens=5, cost=0.05
    )
    rec_a.created_at = this_month
    rec_b = make_token_usage(
        chat_session_id=session_b.id,
        user_id=user_b.id,
        input_tokens=99,
        output_tokens=99,
        cost=9.99,
    )
    rec_b.created_at = this_month
    await persist(db, rec_a, rec_b)

    spend = await get_monthly_spend(db, user_a.id)

    assert spend == pytest.approx(0.05)


async def test_summary_cost_and_token_totals_equal_arithmetic_sum(db: AsyncSession) -> None:
    user = make_user()
    agent = make_agent()
    await persist(db, user, agent)

    session = make_chat_session(user_id=user.id, agent_id=agent.id)
    await persist(db, session)

    ts_in_range = datetime(2024, 1, 15, 12, 0, 0, tzinfo=UTC)

    inputs = [(100, 50, 0.01), (200, 80, 0.02), (300, 120, 0.03)]
    records = []
    for inp, out, cost in inputs:
        r = make_token_usage(
            chat_session_id=session.id,
            user_id=user.id,
            input_tokens=inp,
            output_tokens=out,
            cost=cost,
        )
        r.created_at = ts_in_range
        records.append(r)
    await persist(db, *records)

    from_date = date(2024, 1, 10)
    to_date = date(2024, 1, 20)

    total_cost, inp_total, out_total, hits, active_users = await get_summary(db, from_date, to_date)

    expected_cost = sum(c for _, _, c in inputs)
    expected_inp = sum(i for i, _, _ in inputs)
    expected_out = sum(o for _, o, _ in inputs)

    assert total_cost == pytest.approx(expected_cost)
    assert inp_total == expected_inp
    assert out_total == expected_out


async def test_summary_returns_zeros_when_no_records_in_range(db: AsyncSession) -> None:
    from_date = date(2024, 1, 1)
    to_date = date(2024, 1, 31)

    total_cost, inp, out, hits, active_users = await get_summary(db, from_date, to_date)

    assert total_cost == 0.0
    assert inp == 0
    assert out == 0
    assert hits == 0
    assert active_users == 0


async def test_summary_active_users_counts_distinct_users(db: AsyncSession) -> None:
    user_a = make_user()
    user_b = make_user()
    agent = make_agent()
    await persist(db, user_a, user_b, agent)

    session_a = make_chat_session(user_id=user_a.id, agent_id=agent.id)
    session_b = make_chat_session(user_id=user_b.id, agent_id=agent.id)
    await persist(db, session_a, session_b)

    ts = datetime(2024, 1, 15, 12, 0, 0, tzinfo=UTC)

    # Two records for user_a, one for user_b.
    recs = [
        make_token_usage(
            chat_session_id=session_a.id,
            user_id=user_a.id,
            input_tokens=10,
            output_tokens=5,
            cost=0.01,
        ),
        make_token_usage(
            chat_session_id=session_a.id,
            user_id=user_a.id,
            input_tokens=20,
            output_tokens=10,
            cost=0.02,
        ),
        make_token_usage(
            chat_session_id=session_b.id,
            user_id=user_b.id,
            input_tokens=30,
            output_tokens=15,
            cost=0.03,
        ),
    ]
    for r in recs:
        r.created_at = ts
    await persist(db, *recs)

    _, _, _, _, active_users = await get_summary(db, date(2024, 1, 10), date(2024, 1, 20))

    assert active_users == 2


@pytest.mark.postgres
async def test_daily_buckets_cost_totals_equal_arithmetic_sum(db: AsyncSession) -> None:
    user = make_user()
    agent = make_agent()
    await persist(db, user, agent)

    session = make_chat_session(user_id=user.id, agent_id=agent.id)
    await persist(db, session)

    day1 = date(2024, 1, 10)
    day2 = date(2024, 1, 11)
    ts1 = datetime.combine(day1, time(12, 0, 0), tzinfo=UTC)
    ts2 = datetime.combine(day2, time(12, 0, 0), tzinfo=UTC)

    # Two records on day1, one on day2.
    rec1 = make_token_usage(
        chat_session_id=session.id, user_id=user.id, input_tokens=100, output_tokens=50, cost=0.01
    )
    rec1.created_at = ts1
    rec2 = make_token_usage(
        chat_session_id=session.id, user_id=user.id, input_tokens=200, output_tokens=80, cost=0.02
    )
    rec2.created_at = ts1
    rec3 = make_token_usage(
        chat_session_id=session.id, user_id=user.id, input_tokens=300, output_tokens=120, cost=0.05
    )
    rec3.created_at = ts2
    await persist(db, rec1, rec2, rec3)

    buckets = await get_daily_buckets(
        db,
        from_date=day1,
        to_date=day2,
        metric=Metric.cost,
        dimension=Dimension.none,
    )

    day1_total = buckets.get((day1, "_total"), 0.0)
    day2_total = buckets.get((day2, "_total"), 0.0)

    assert day1_total == pytest.approx(0.01 + 0.02)
    assert day2_total == pytest.approx(0.05)


@pytest.mark.postgres
async def test_daily_buckets_token_totals_equal_arithmetic_sum(db: AsyncSession) -> None:
    user = make_user()
    agent = make_agent()
    await persist(db, user, agent)

    session = make_chat_session(user_id=user.id, agent_id=agent.id)
    await persist(db, session)

    day = date(2024, 1, 10)
    ts = datetime.combine(day, time(12, 0, 0), tzinfo=UTC)

    records = [
        (100, 50),
        (200, 80),
        (300, 120),
    ]
    orm_recs = []
    for inp, out in records:
        r = make_token_usage(
            chat_session_id=session.id,
            user_id=user.id,
            input_tokens=inp,
            output_tokens=out,
            cost=0.0,
        )
        r.created_at = ts
        orm_recs.append(r)
    await persist(db, *orm_recs)

    buckets = await get_daily_buckets(
        db,
        from_date=day,
        to_date=day,
        metric=Metric.tokens,
        dimension=Dimension.none,
    )

    expected = sum(i + o for i, o in records)
    assert buckets.get((day, "_total"), 0.0) == pytest.approx(expected)


@pytest.mark.postgres
async def test_daily_buckets_empty_when_no_records_in_range(db: AsyncSession) -> None:
    buckets = await get_daily_buckets(
        db,
        from_date=date(2024, 6, 1),
        to_date=date(2024, 6, 30),
        metric=Metric.cost,
        dimension=Dimension.none,
    )

    assert buckets == {}


def test_apply_top_n_other_returns_all_when_at_or_under_limit() -> None:
    totals = {"a": 3.0, "b": 1.0, "c": 2.0}

    top, others = apply_top_n_other(totals, max_n=5)

    assert set(top) == {"a", "b", "c"}
    assert others == set()


def test_apply_top_n_other_returns_sorted_descending() -> None:
    totals = {"x": 10.0, "y": 50.0, "z": 30.0, "w": 20.0}

    top, _ = apply_top_n_other(totals, max_n=2)

    assert top == ["y", "z"]


def test_apply_top_n_other_overflow_set_contains_remaining_names() -> None:
    totals = {"a": 10.0, "b": 5.0, "c": 2.0, "d": 1.0}

    top, others = apply_top_n_other(totals, max_n=2)

    assert top == ["a", "b"]
    assert others == {"c", "d"}


def test_apply_top_n_other_empty_input_returns_empty() -> None:
    top, others = apply_top_n_other({}, max_n=5)

    assert top == []
    assert others == set()


@pytest.mark.postgres
async def test_day_bucket_groups_same_calendar_day_together(db: AsyncSession) -> None:
    """Records created on the same UTC calendar day land in the same bucket."""
    user = make_user()
    agent = make_agent()
    await persist(db, user, agent)

    session = make_chat_session(user_id=user.id, agent_id=agent.id)
    await persist(db, session)

    target_day = date(2024, 1, 15)
    ts_morning = datetime.combine(target_day, time(8, 0, 0), tzinfo=UTC)
    ts_evening = datetime.combine(target_day, time(20, 0, 0), tzinfo=UTC)

    rec1 = make_token_usage(
        chat_session_id=session.id, user_id=user.id, input_tokens=10, output_tokens=5, cost=0.10
    )
    rec1.created_at = ts_morning
    rec2 = make_token_usage(
        chat_session_id=session.id, user_id=user.id, input_tokens=20, output_tokens=10, cost=0.20
    )
    rec2.created_at = ts_evening
    await persist(db, rec1, rec2)

    buckets = await get_daily_buckets(
        db,
        from_date=target_day,
        to_date=target_day,
        metric=Metric.cost,
        dimension=Dimension.none,
    )

    assert len(buckets) == 1
    assert buckets.get((target_day, "_total"), 0.0) == pytest.approx(0.10 + 0.20)


@pytest.mark.postgres
async def test_day_bucket_separates_records_on_different_days(db: AsyncSession) -> None:
    """Records on different calendar days land in separate buckets."""
    user = make_user()
    agent = make_agent()
    await persist(db, user, agent)

    session = make_chat_session(user_id=user.id, agent_id=agent.id)
    await persist(db, session)

    day1 = date(2024, 1, 10)
    day2 = date(2024, 1, 12)

    rec1 = make_token_usage(
        chat_session_id=session.id, user_id=user.id, input_tokens=10, output_tokens=5, cost=0.10
    )
    rec1.created_at = datetime.combine(day1, time(12, 0, 0), tzinfo=UTC)
    rec2 = make_token_usage(
        chat_session_id=session.id, user_id=user.id, input_tokens=20, output_tokens=10, cost=0.20
    )
    rec2.created_at = datetime.combine(day2, time(12, 0, 0), tzinfo=UTC)
    await persist(db, rec1, rec2)

    buckets = await get_daily_buckets(
        db,
        from_date=day1,
        to_date=day2,
        metric=Metric.cost,
        dimension=Dimension.none,
    )

    assert len(buckets) == 2
    assert (day1, "_total") in buckets
    assert (day2, "_total") in buckets
