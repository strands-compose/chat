"""Unit tests for analytics.service.compute_cost."""

import pytest
from hypothesis import given, settings
from hypothesis import strategies as st

from strands_compose_chat.analytics.service import compute_cost


def test_compute_cost_returns_zero_when_both_token_counts_are_zero() -> None:
    result = compute_cost(
        input_cost_per_million=3.0,
        output_cost_per_million=15.0,
        input_tokens=0,
        output_tokens=0,
    )
    assert result == 0.0


def test_compute_cost_charges_only_input_tokens_when_output_is_zero() -> None:
    result = compute_cost(
        input_cost_per_million=3.0,
        output_cost_per_million=15.0,
        input_tokens=1_000_000,
        output_tokens=0,
    )
    assert result == pytest.approx(3.0)


def test_compute_cost_charges_only_output_tokens_when_input_is_zero() -> None:
    result = compute_cost(
        input_cost_per_million=3.0,
        output_cost_per_million=15.0,
        input_tokens=0,
        output_tokens=1_000_000,
    )
    assert result == pytest.approx(15.0)


def test_compute_cost_sums_input_and_output_costs() -> None:
    # 500_000 input @ $3.00/1M = $1.50; 200_000 output @ $15.00/1M = $3.00
    result = compute_cost(
        input_cost_per_million=3.0,
        output_cost_per_million=15.0,
        input_tokens=500_000,
        output_tokens=200_000,
    )
    assert result == pytest.approx(4.50)


def test_compute_cost_scales_linearly_with_token_counts() -> None:
    result = compute_cost(
        input_cost_per_million=1.0,
        output_cost_per_million=2.0,
        input_tokens=100,
        output_tokens=100,
    )
    assert result == pytest.approx(0.0003)


def test_compute_cost_return_type_is_float() -> None:
    result = compute_cost(
        input_cost_per_million=1.0,
        output_cost_per_million=1.0,
        input_tokens=0,
        output_tokens=0,
    )
    assert isinstance(result, float)


def test_compute_cost_return_type_is_float_for_nonzero_tokens() -> None:
    result = compute_cost(
        input_cost_per_million=1.0,
        output_cost_per_million=1.0,
        input_tokens=1,
        output_tokens=1,
    )
    assert isinstance(result, float)


def test_compute_cost_is_zero_when_rates_are_zero() -> None:
    result = compute_cost(
        input_cost_per_million=0.0,
        output_cost_per_million=0.0,
        input_tokens=1_000_000,
        output_tokens=1_000_000,
    )
    assert result == pytest.approx(0.0)


def test_compute_cost_applies_input_rate_independently_of_output_rate() -> None:
    result = compute_cost(
        input_cost_per_million=5.0,
        output_cost_per_million=99.0,
        input_tokens=2_000_000,
        output_tokens=0,
    )
    assert result == pytest.approx(10.0)


def test_compute_cost_applies_output_rate_independently_of_input_rate() -> None:
    result = compute_cost(
        input_cost_per_million=99.0,
        output_cost_per_million=4.0,
        input_tokens=0,
        output_tokens=3_000_000,
    )
    assert result == pytest.approx(12.0)


_token_count = st.integers(min_value=0, max_value=10_000_000)
_rate = st.floats(min_value=0.0, max_value=1_000.0, allow_nan=False, allow_infinity=False)


@pytest.mark.property
@settings(max_examples=100)
@given(
    input_cost_per_million=_rate,
    output_cost_per_million=_rate,
    input_tokens=_token_count,
    output_tokens=_token_count,
)
def test_compute_cost_is_non_negative_for_all_valid_inputs(
    input_cost_per_million: float,
    output_cost_per_million: float,
    input_tokens: int,
    output_tokens: int,
) -> None:
    result = compute_cost(
        input_cost_per_million=input_cost_per_million,
        output_cost_per_million=output_cost_per_million,
        input_tokens=input_tokens,
        output_tokens=output_tokens,
    )
    assert result >= 0.0


@pytest.mark.property
@settings(max_examples=100)
@given(
    rate=_rate,
    token_count_a=_token_count,
    token_count_b=_token_count,
)
def test_compute_cost_is_monotonic_in_token_counts(
    rate: float,
    token_count_a: int,
    token_count_b: int,
) -> None:
    a, b = min(token_count_a, token_count_b), max(token_count_a, token_count_b)
    cost_a = compute_cost(
        input_cost_per_million=rate,
        output_cost_per_million=rate,
        input_tokens=a,
        output_tokens=0,
    )
    cost_b = compute_cost(
        input_cost_per_million=rate,
        output_cost_per_million=rate,
        input_tokens=b,
        output_tokens=0,
    )
    assert cost_a <= cost_b
