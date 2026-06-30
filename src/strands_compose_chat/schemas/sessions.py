"""Pydantic v2 request/response schemas for session endpoints.

Models
------
- SessionListItemOut      — item in GET /api/v1/sessions list response
- SessionDetailOut        — GET /api/v1/sessions/{session_id} response
- SessionRenameIn         — PATCH /api/v1/sessions/{session_id} request body
- AttachmentMetadataOut   — single attachment entry nested inside MessageOut
- MessageOut              — item in GET /api/v1/sessions/{session_id}/messages response
- SessionUsageSummaryOut  — GET /api/v1/sessions/{session_id}/usage response
"""

from datetime import datetime
from typing import Annotated, Any, Literal

from pydantic import BaseModel, BeforeValidator, Field, field_validator


def _round_cost(v: float) -> float:
    """Round a raw cost value to 2 decimal places on ingestion."""
    return round(v, 2)


Cost = Annotated[float, BeforeValidator(_round_cost)]

# ---------------------------------------------------------------------------
# Response schemas
# ---------------------------------------------------------------------------


class SessionListItemOut(BaseModel):
    """Single item in the session list response for GET /api/v1/sessions.

    Represents a chat session row as seen by the owning user.
    """

    id: str
    session_id: str
    agent_id: str
    title: str | None
    created_at: datetime
    last_used_at: datetime
    is_archived: bool


class SessionDetailOut(SessionListItemOut):
    """Full session detail response for GET /api/v1/sessions/{session_id}.

    Extends ``SessionListItemOut`` with the captured SessionManifest JSON
    and the timestamp at which it was first written.

    ``manifest`` is ``None`` until the first ``event: session_start`` SSE
    message is observed for this session.
    """

    manifest: dict | None
    manifest_captured_at: datetime | None


class AttachmentMetadataOut(BaseModel):
    """A single file attachment descriptor nested inside a ``MessageOut``.

    Serialised from the JSON stored in ``chat_messages.attachments``.

    Args:
        filename: Original upload filename, or ``"upload"`` when absent.
        size: Byte length of the file content (positive integer).
        type: Either ``"image"`` or ``"document"``.
    """

    filename: str
    size: int
    type: Literal["image", "document"]


class MessageOut(BaseModel):
    """Single message item in the GET /api/v1/sessions/{session_id}/messages response.

    ``is_success`` is ``False`` only for assistant messages that represent an
    invocation failure; user and normal assistant rows serialize ``True``.

    ``attachments`` is always present and is an empty list when the message has
    no attachment metadata (column is ``NULL`` or an empty JSON array).
    """

    role: str
    content: str
    seq: int
    is_success: bool
    attachments: list[AttachmentMetadataOut] = Field(default_factory=list)

    @field_validator("attachments", mode="before")
    @classmethod
    def _coerce_null_to_empty(cls, value: Any) -> Any:
        """Coerce a ``NULL`` attachments column into an empty list.

        The ORM exposes ``None`` for the nullable ``attachments`` column. The
        API contract requires an empty array rather than ``null``, so ``None``
        is mapped to ``[]`` before validation.

        Args:
            value: The raw value read from the ORM attribute.

        Returns:
            ``[]`` when *value* is ``None``, otherwise *value* unchanged.
        """
        if value is None:
            return []
        return value


class SessionUsageSummaryOut(BaseModel):
    """Aggregated token usage and inferred cost for a session.

    Returned by ``GET /api/v1/sessions/{session_id}/usage``.
    Sums all ``token_usage`` rows linked to the session in a single query.
    Cost is computed from persisted ``cost`` values — models without a
    pricing entry at invocation time contribute 0.
    """

    input_tokens: int
    output_tokens: int
    total_cost: Cost


# ---------------------------------------------------------------------------
# Request schemas
# ---------------------------------------------------------------------------


class SessionRenameIn(BaseModel):
    """Request body for PATCH /api/v1/sessions/{session_id}.

    ``title`` is required and must be a non-empty string of at most 255
    characters.
    """

    title: str = Field(min_length=1, max_length=255)
