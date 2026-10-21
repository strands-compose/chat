"""Session id minting: a UUID tagged with the owning user for easy identification."""

import re
import unicodedata
from uuid import uuid4

from ..db.models import User

# Keeps the id well inside AgentCore's 33-256 character runtime session id limit
# (36-char UUID + "_" + suffix).
_SUFFIX_MAX_LENGTH = 64
_NON_ALNUM = re.compile(r"[^A-Z0-9]+")
# Letters NFKD does not decompose into base + accent, so they would otherwise be dropped.
_TRANSLITERATE = str.maketrans({"ł": "l", "Ł": "L", "ø": "o", "Ø": "O", "đ": "d", "Đ": "D"})


def user_session_suffix(user: User) -> str:
    """Build the identifying suffix for a user's session ids.

    Uses the email, falling back to the username, then uppercases it, strips
    accents, and collapses every run of other characters into a single ``-``.
    ``john.doe@gmail.com`` becomes ``JOHN-DOE-GMAIL-COM`` and ``Michal$ Nowak``
    becomes ``MICHAL-NOWAK``.

    Args:
        user: The user the session belongs to.

    Returns:
        The sanitized suffix, or an empty string when nothing usable remains.
    """
    raw = user.email or user.username or ""
    ascii_text = (
        unicodedata.normalize("NFKD", raw.translate(_TRANSLITERATE))
        .encode("ascii", "ignore")
        .decode()
    )
    cleaned = _NON_ALNUM.sub("-", ascii_text.upper()).strip("-")
    return cleaned[:_SUFFIX_MAX_LENGTH].rstrip("-")


def new_session_id(user: User) -> str:
    """Mint a session id of the form ``<uuid>_<USER-SUFFIX>``.

    Falls back to the bare UUID when the user yields no usable suffix.

    Args:
        user: The user starting the session.

    Returns:
        A new, globally unique session id.
    """
    session_id = str(uuid4())
    suffix = user_session_suffix(user)
    return f"{session_id}_{suffix}" if suffix else session_id
