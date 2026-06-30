"""Unit tests for auth.service.safe_next_url.

Checks that permitted relative paths are returned as-is and that non-permitted
targets (absolute URLs, protocol-relative URLs, scheme-bearing strings,
backslash paths, and missing/empty inputs) fall back to the prefix root.
"""

import pytest

from strands_compose_chat.auth.service import safe_next_url


def test_simple_relative_path_is_accepted() -> None:
    result = safe_next_url("/dashboard", prefix="")
    assert result == "/dashboard"


def test_relative_path_with_query_string_is_accepted() -> None:
    result = safe_next_url("/search?q=hello", prefix="")
    assert result == "/search?q=hello"


def test_relative_path_with_fragment_is_accepted() -> None:
    result = safe_next_url("/page#section", prefix="")
    assert result == "/page#section"


def test_nested_relative_path_is_accepted() -> None:
    result = safe_next_url("/a/b/c", prefix="")
    assert result == "/a/b/c"


def test_root_slash_is_accepted() -> None:
    result = safe_next_url("/", prefix="")
    assert result == "/"


def test_relative_path_with_prefix_is_accepted() -> None:
    result = safe_next_url("/ai/chat/dashboard", prefix="/ai/chat")
    assert result == "/ai/chat/dashboard"


def test_none_input_falls_back_to_prefix_root() -> None:
    result = safe_next_url(None, prefix="")
    assert result == "/"


def test_empty_string_falls_back_to_prefix_root() -> None:
    result = safe_next_url("", prefix="")
    assert result == "/"


def test_absolute_http_url_is_rejected() -> None:
    result = safe_next_url("http://evil.example.com/steal", prefix="")
    assert result == "/"


def test_absolute_https_url_is_rejected() -> None:
    result = safe_next_url("https://evil.example.com/steal", prefix="")
    assert result == "/"


def test_protocol_relative_url_is_rejected() -> None:
    result = safe_next_url("//evil.example.com/steal", prefix="")
    assert result == "/"


def test_scheme_with_colon_in_path_is_rejected() -> None:
    result = safe_next_url("/path:evil", prefix="")
    assert result == "/"


def test_backslash_path_is_rejected() -> None:
    result = safe_next_url("\\evil", prefix="")
    assert result == "/"


def test_backslash_inside_path_is_rejected() -> None:
    result = safe_next_url("/valid\\then\\evil", prefix="")
    assert result == "/"


def test_no_leading_slash_is_rejected() -> None:
    result = safe_next_url("relative/path", prefix="")
    assert result == "/"


def test_javascript_scheme_is_rejected() -> None:
    result = safe_next_url("javascript:alert(1)", prefix="")
    assert result == "/"


def test_fallback_includes_prefix() -> None:
    result = safe_next_url(None, prefix="/ai/chat")
    assert result == "/ai/chat/"


def test_fallback_on_rejection_includes_prefix() -> None:
    result = safe_next_url("http://evil.example.com", prefix="/ai/chat")
    assert result == "/ai/chat/"


@pytest.mark.parametrize(
    "next_url",
    [
        "/valid",
        None,
        "",
        "http://evil.com",
        "//evil.com",
        "no-slash",
        "/colon:here",
        "/back\\slash",
    ],
)
def test_return_value_is_always_a_string(next_url: str | None) -> None:
    result = safe_next_url(next_url, prefix="")
    assert isinstance(result, str)
