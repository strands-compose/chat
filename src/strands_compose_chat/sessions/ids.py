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
# Tag that replaces the user suffix when the owner is anonymised.
_ANONYMIZED_SUFFIX = "ANONYMIZED"
# A canonical UUID at the start of a session id, followed by the suffix separator or the end.
_LEADING_UUID = re.compile(
    r"^([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})(?:_|$)", re.IGNORECASE
)


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


def anonymized_session_id(session_id: str | None) -> str:
    """Replace the user suffix of a session id with a non-personal tag.

    Keeps the leading UUID of a ``<uuid>_<USER-SUFFIX>`` id, so the session can
    still be matched to AgentCore logs and traces. Ids that do not start with a
    UUID (client-supplied) and ``None`` get a fresh UUID instead.

    Args:
        session_id: The current session id, or ``None`` to mint a fresh one.

    Returns:
        A session id of the form ``<uuid>_ANONYMIZED``.
    """
    match = _LEADING_UUID.match(session_id or "")
    prefix = match.group(1) if match else str(uuid4())
    return f"{prefix}_{_ANONYMIZED_SUFFIX}"
