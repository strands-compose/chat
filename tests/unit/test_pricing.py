"""Unit tests for analytics.service.compute_cost."""

import pytest
from hypothesis import given, settings
from hypothesis import strategies as st

from strands_compose_chat.analytics.service import compute_cost
from tests.factories import make_model_pricing

# USD per 1M tokens. Each token kind has its own rate, so every case shows
# which rate was applied to which count.
_RATES = {
    "input_token_price": 3.0,
    "output_token_price": 15.0,
    "cache_read_token_price": 0.30,
    "cache_write_token_price": 3.75,
}
_NO_CACHE_RATES = {**_RATES, "cache_read_token_price": 0.0, "cache_write_token_price": 0.0}


@pytest.mark.parametrize(
    ("rates", "input_tokens", "output_tokens", "cache_read", "cache_write", "expected"),
    [
        pytest.param(_RATES, 0, 0, 0, 0, 0.0, id="no-tokens"),
        pytest.param(_RATES, 500_000, 200_000, 0, 0, 1.50 + 3.00, id="input-and-output"),
        pytest.param(_RATES, 2_000_000, 0, 0, 0, 6.0, id="input-only"),
        pytest.param(_RATES, 0, 3_000_000, 0, 0, 45.0, id="output-only"),
        pytest.param(_RATES, 0, 0, 2_000_000, 1_000_000, 0.60 + 3.75, id="cache-read-and-write"),
        pytest.param(
            _RATES,
            1_000_000,
            1_000_000,
            1_000_000,
            1_000_000,
            3.0 + 15.0 + 0.30 + 3.75,
            id="all-four-kinds",
        ),
        pytest.param(_NO_CACHE_RATES, 0, 0, 5_000_000, 5_000_000, 0.0, id="no-cache-rates"),
    ],
)
def test_compute_cost_bills_each_token_kind_at_its_own_rate(
    rates: dict[str, float],
    input_tokens: int,
    output_tokens: int,
    cache_read: int,
    cache_write: int,
    expected: float,
) -> None:
    pricing = make_model_pricing(**rates)

    result = compute_cost(
        pricing,
        input_tokens=input_tokens,
        output_tokens=output_tokens,
        cache_read_input_tokens=cache_read,
        cache_write_input_tokens=cache_write,
    )

    assert result == pytest.approx(expected)


def test_compute_cost_is_zero_when_the_model_has_no_pricing() -> None:
    result = compute_cost(
        None,
        input_tokens=1_000_000,
        output_tokens=1_000_000,
        cache_read_input_tokens=1_000_000,
        cache_write_input_tokens=1_000_000,
    )

    assert result == 0.0


def test_compute_cost_rounds_to_six_decimal_places() -> None:
    # 1 token @ $1.234567891/1M = $0.000001234567891
    pricing = make_model_pricing(input_token_price=1.234567891, output_token_price=0.0)

    result = compute_cost(
        pricing,
        input_tokens=1,
        output_tokens=0,
        cache_read_input_tokens=0,
        cache_write_input_tokens=0,
    )

    assert result == 0.000001


_token_count = st.integers(min_value=0, max_value=10_000_000)
_rate = st.floats(min_value=0.0, max_value=1_000.0, allow_nan=False, allow_infinity=False)


@pytest.mark.property
@settings(max_examples=100)
@given(
    rate=_rate,
    input_tokens=_token_count,
    output_tokens=_token_count,
    cache_read=_token_count,
    cache_write=_token_count,
)
def test_compute_cost_is_non_negative_for_all_valid_inputs(
    rate: float,
    input_tokens: int,
    output_tokens: int,
    cache_read: int,
    cache_write: int,
) -> None:
    pricing = make_model_pricing(
        input_token_price=rate,
        output_token_price=rate,
        cache_read_token_price=rate,
        cache_write_token_price=rate,
    )

    result = compute_cost(
        pricing,
        input_tokens=input_tokens,
        output_tokens=output_tokens,
        cache_read_input_tokens=cache_read,
        cache_write_input_tokens=cache_write,
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
    pricing = make_model_pricing(input_token_price=rate, output_token_price=rate)

    cost_a = compute_cost(
        pricing,
        input_tokens=a,
        output_tokens=0,
        cache_read_input_tokens=0,
        cache_write_input_tokens=0,
    )
    cost_b = compute_cost(
        pricing,
        input_tokens=b,
        output_tokens=0,
        cache_read_input_tokens=0,
        cache_write_input_tokens=0,
    )

    assert cost_a <= cost_b
