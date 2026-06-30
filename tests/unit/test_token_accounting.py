"""Unit tests for the token-accounting roll-up helpers in analytics.service.

Covers roll_up_daily_to_weekly, roll_up_daily_to_monthly, and
_roll_up_daily_int, which fold per-day token (or cost) counts into period totals.
"""

from datetime import date, timedelta

import pytest
from hypothesis import given, settings
from hypothesis import strategies as st

from strands_compose_chat.analytics.service import (
    _roll_up_daily_int,
    roll_up_daily_to_monthly,
    roll_up_daily_to_weekly,
)
from strands_compose_chat.schemas.analytics import Interval


def test_roll_up_daily_to_weekly_sums_two_days_in_the_same_week() -> None:
    daily = {
        date(2024, 1, 1): 100.0,
        date(2024, 1, 2): 50.0,
    }
    result = roll_up_daily_to_weekly(daily)
    assert result == {date(2024, 1, 1): 150.0}


def test_roll_up_daily_to_weekly_keeps_days_from_different_weeks_separate() -> None:
    daily = {
        date(2024, 1, 1): 200.0,
        date(2024, 1, 8): 300.0,
    }
    result = roll_up_daily_to_weekly(daily)
    assert result == {
        date(2024, 1, 1): 200.0,
        date(2024, 1, 8): 300.0,
    }


def test_roll_up_daily_to_weekly_sums_all_seven_days_of_a_week() -> None:
    daily = {date(2024, 1, d): float(d) for d in range(1, 8)}
    result = roll_up_daily_to_weekly(daily)
    assert result == {date(2024, 1, 1): 28.0}


def test_roll_up_daily_to_weekly_produces_correct_total_across_two_partial_weeks() -> None:
    daily = {
        date(2024, 1, 3): 10.0,
        date(2024, 1, 8): 20.0,
    }
    result = roll_up_daily_to_weekly(daily)
    assert result[date(2024, 1, 1)] == 10.0
    assert result[date(2024, 1, 8)] == 20.0


def test_roll_up_daily_to_weekly_returns_empty_dict_for_empty_input() -> None:
    result = roll_up_daily_to_weekly({})
    assert result == {}


def test_roll_up_daily_to_weekly_single_day_equals_that_days_value() -> None:
    daily = {date(2024, 3, 14): 999.0}
    result = roll_up_daily_to_weekly(daily)
    # Thursday 2024-03-14 belongs to the week starting Monday 2024-03-11
    assert result == {date(2024, 3, 11): 999.0}


def test_roll_up_daily_to_monthly_sums_three_days_in_the_same_month() -> None:
    daily = {
        date(2024, 2, 1): 10.0,
        date(2024, 2, 15): 20.0,
        date(2024, 2, 29): 30.0,
    }
    result = roll_up_daily_to_monthly(daily)
    assert result == {"2024-02": 60.0}


def test_roll_up_daily_to_monthly_keeps_different_months_separate() -> None:
    daily = {
        date(2024, 1, 31): 100.0,
        date(2024, 2, 1): 200.0,
    }
    result = roll_up_daily_to_monthly(daily)
    assert result == {"2024-01": 100.0, "2024-02": 200.0}


def test_roll_up_daily_to_monthly_produces_correct_total_across_three_months() -> None:
    daily = {
        date(2024, 1, 5): 1.0,
        date(2024, 1, 20): 2.0,
        date(2024, 2, 10): 3.0,
        date(2024, 3, 1): 4.0,
        date(2024, 3, 31): 5.0,
    }
    result = roll_up_daily_to_monthly(daily)
    assert result["2024-01"] == 3.0
    assert result["2024-02"] == 3.0
    assert result["2024-03"] == 9.0


def test_roll_up_daily_to_monthly_returns_empty_dict_for_empty_input() -> None:
    result = roll_up_daily_to_monthly({})
    assert result == {}


def test_roll_up_daily_to_monthly_single_day_equals_that_days_value() -> None:
    daily = {date(2024, 6, 15): 42.0}
    result = roll_up_daily_to_monthly(daily)
    assert result == {"2024-06": 42.0}


def test_roll_up_daily_to_monthly_key_format_is_yyyy_mm() -> None:
    daily = {date(2024, 3, 1): 1.0}
    result = roll_up_daily_to_monthly(daily)
    assert "2024-03" in result


def test_roll_up_daily_int_daily_interval_preserves_each_days_value() -> None:
    daily = {
        date(2024, 1, 1): 100,
        date(2024, 1, 2): 200,
        date(2024, 1, 3): 300,
    }
    result = _roll_up_daily_int(daily, Interval.daily)
    assert result == {
        "2024-01-01": 100,
        "2024-01-02": 200,
        "2024-01-03": 300,
    }


def test_roll_up_daily_int_weekly_interval_sums_same_week_entries() -> None:
    daily = {
        date(2024, 1, 1): 500,
        date(2024, 1, 5): 300,
    }
    result = _roll_up_daily_int(daily, Interval.weekly)
    assert result == {"2024-01-01": 800}


def test_roll_up_daily_int_weekly_interval_keeps_different_weeks_separate() -> None:
    daily = {
        date(2024, 1, 1): 1000,
        date(2024, 1, 8): 2000,
    }
    result = _roll_up_daily_int(daily, Interval.weekly)
    assert result == {"2024-01-01": 1000, "2024-01-08": 2000}


def test_roll_up_daily_int_monthly_interval_sums_same_month_entries() -> None:
    daily = {
        date(2024, 5, 1): 1_000,
        date(2024, 5, 15): 2_000,
        date(2024, 5, 31): 3_000,
    }
    result = _roll_up_daily_int(daily, Interval.monthly)
    assert result == {"2024-05": 6_000}


def test_roll_up_daily_int_monthly_interval_keeps_different_months_separate() -> None:
    daily = {
        date(2024, 4, 30): 400,
        date(2024, 5, 1): 500,
    }
    result = _roll_up_daily_int(daily, Interval.monthly)
    assert result == {"2024-04": 400, "2024-05": 500}


def test_roll_up_daily_int_returns_empty_dict_for_empty_input_daily() -> None:
    assert _roll_up_daily_int({}, Interval.daily) == {}


def test_roll_up_daily_int_returns_empty_dict_for_empty_input_weekly() -> None:
    assert _roll_up_daily_int({}, Interval.weekly) == {}


def test_roll_up_daily_int_returns_empty_dict_for_empty_input_monthly() -> None:
    assert _roll_up_daily_int({}, Interval.monthly) == {}


def test_roll_up_daily_int_single_entry_equals_that_entrys_token_count() -> None:
    daily = {date(2024, 7, 4): 12_345}
    result_daily = _roll_up_daily_int(daily, Interval.daily)
    result_weekly = _roll_up_daily_int(daily, Interval.weekly)
    result_monthly = _roll_up_daily_int(daily, Interval.monthly)

    assert list(result_daily.values()) == [12_345]
    assert list(result_weekly.values()) == [12_345]
    assert list(result_monthly.values()) == [12_345]


def test_roll_up_daily_int_zero_token_entries_sum_to_zero() -> None:
    daily = {
        date(2024, 8, 1): 0,
        date(2024, 8, 2): 0,
        date(2024, 8, 3): 0,
    }
    result = _roll_up_daily_int(daily, Interval.monthly)
    assert result == {"2024-08": 0}


def test_roll_up_daily_int_multiple_weeks_produce_correct_per_week_totals() -> None:
    # Week 1: 100 + 200 + 300 = 600; week 2: 50 + 150 = 200
    daily = {
        date(2024, 1, 1): 100,
        date(2024, 1, 3): 200,
        date(2024, 1, 5): 300,
        date(2024, 1, 8): 50,
        date(2024, 1, 11): 150,
    }
    result = _roll_up_daily_int(daily, Interval.weekly)
    assert result["2024-01-01"] == 600
    assert result["2024-01-08"] == 200


_token_count = st.integers(min_value=0, max_value=10_000_000)

# Dates are expressed as integer offsets from a fixed epoch so Hypothesis can
# shrink them easily and results never depend on wall-clock time.
_EPOCH = date(2024, 1, 1)
_date_token_pairs = st.lists(
    st.tuples(
        st.integers(min_value=0, max_value=3_650),
        _token_count,
    ),
    min_size=0,
    max_size=50,
)


def _pairs_to_daily(pairs: list[tuple[int, int]]) -> dict[date, int]:
    # Duplicate offsets are summed, matching what the service sees when the same
    # calendar day appears twice in a query result.
    daily: dict[date, int] = {}
    for offset, value in pairs:
        d = _EPOCH + timedelta(days=offset)
        daily[d] = daily.get(d, 0) + value
    return daily


@pytest.mark.property
@settings(max_examples=100)
@given(
    pairs=_date_token_pairs,
    interval=st.sampled_from(list(Interval)),
)
def test_roll_up_daily_int_total_equals_arithmetic_sum_of_inputs(
    pairs: list[tuple[int, int]],
    interval: Interval,
) -> None:
    daily = _pairs_to_daily(pairs)

    result = _roll_up_daily_int(daily, interval)

    expected_total = sum(daily.values())
    actual_total = sum(result.values())

    assert actual_total == expected_total
