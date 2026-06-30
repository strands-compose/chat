"""Security invariants for the password layer. No DB, no HTTP.

Enumeration-safety of the login flow (unknown user / wrong password / disabled
account all failing alike) is a property of the composed handler, so it lives in
the auth route tests against a real database, not here.
"""

from strands_compose_chat.auth.passwords import hash_password, verify_password
from strands_compose_chat.config import Settings

_SETTINGS = Settings(SESSION_SECRET_KEY="t" * 43)


def test_a_password_verifies_against_its_own_hash() -> None:
    stored = hash_password("correct-horse-battery-staple", _SETTINGS)
    assert verify_password("correct-horse-battery-staple", stored, _SETTINGS) is True


def test_a_wrong_password_does_not_verify() -> None:
    stored = hash_password("correct-horse-battery-staple", _SETTINGS)
    assert verify_password("not-the-password", stored, _SETTINGS) is False


def test_argon2_parameters_meet_the_security_floor() -> None:
    # Guards against silently weakening the hashing cost. Floors, not exact
    # values, so deliberately strengthening the parameters stays green.
    settings = Settings(SESSION_SECRET_KEY="t" * 43)
    assert settings.ARGON2_MEMORY_KIB >= 65536
    assert settings.ARGON2_TIME_COST >= 3
    assert settings.ARGON2_PARALLELISM >= 4
