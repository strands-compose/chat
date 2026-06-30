"""Argon2id password hashing and verification utilities."""

from argon2 import PasswordHasher
from argon2.exceptions import InvalidHashError, VerificationError, VerifyMismatchError

from ..config import Settings

# Pre-computed Argon2id hash of "dummy_password" with default parameters (m=65536, t=3, p=4).
# Used by dummy_verify() to equalise timing on user-not-found code paths.
_DUMMY_HASH: str = (
    "$argon2id$v=19$m=65536,t=3,p=4"
    "$ukV71VssfxwNhYsEr8+hgw"
    "$iHKFebZg98gtHNGz3fBcioaavOEwwuAEF0/uGl7dBf4"
)


def hash_password(password: str, settings: Settings) -> str:
    """Hash *password* with Argon2id using parameters from *settings*.

    Args:
        password: The plaintext password to hash.
        settings: Application settings supplying Argon2id tuning parameters.

    Returns:
        An Argon2id hash string (PHC format) suitable for storage.
    """
    ph = PasswordHasher(
        memory_cost=settings.ARGON2_MEMORY_KIB,
        time_cost=settings.ARGON2_TIME_COST,
        parallelism=settings.ARGON2_PARALLELISM,
    )
    return ph.hash(password)


def verify_password(password: str, stored_hash: str, settings: Settings) -> bool:
    """Verify *password* against a stored Argon2id *stored_hash*.

    Args:
        password: The plaintext password supplied by the caller.
        stored_hash: The stored Argon2id hash string (PHC format).
        settings: Application settings supplying Argon2id tuning parameters.

    Returns:
        True if *password* matches *stored_hash*, False otherwise.
    """
    ph = PasswordHasher(
        memory_cost=settings.ARGON2_MEMORY_KIB,
        time_cost=settings.ARGON2_TIME_COST,
        parallelism=settings.ARGON2_PARALLELISM,
    )
    try:
        ph.verify(stored_hash, password)
        return True
    except VerifyMismatchError:
        return False
    except VerificationError:
        return False
    except InvalidHashError:
        return False


def dummy_verify(settings: Settings) -> None:
    """Run a dummy Argon2id verification to equalise timing on user-not-found.

    Prevents username enumeration via timing side-channel.

    Args:
        settings: Application settings (Argon2id parameters must match real hashes).
    """
    verify_password("dummy_password", _DUMMY_HASH, settings)
