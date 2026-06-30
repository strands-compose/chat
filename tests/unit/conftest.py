"""Unit-test conftest that shadows the root autouse DB/HTTP fixtures.

Unit tests are pure-logic, so the session-scoped async ``_schema`` fixture from
the root conftest is replaced here with a synchronous no-op to keep this
sub-directory free of any database or HTTP setup.
"""

import pytest


@pytest.fixture(scope="session", autouse=True)
def _schema() -> None:  # type: ignore[override]
    """No-op override: unit tests require no database schema."""
