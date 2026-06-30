"""Pydantic v2 response schemas for the media capabilities endpoint."""

from pydantic import BaseModel


class MediaFormatOut(BaseModel):
    """A single supported attachment format.

    Mirrors one ``strands_compose_agentcore`` media format spec, exposing only
    what the UI needs to constrain and validate file selection.
    """

    format: str
    """Format token, e.g. ``"png"`` or ``"pdf"``."""

    extensions: list[str]
    """Leading-dot file extensions, e.g. ``[".jpg", ".jpeg"]``."""

    mime_type: str
    """MIME type for the format, e.g. ``"image/png"``."""


class MediaCategoryOut(BaseModel):
    """A category grouping of supported attachment formats."""

    category: str
    """Category identifier: ``"image"`` or ``"document"``."""

    formats: list[MediaFormatOut]
    """Formats belonging to this category."""


class MediaCapabilitiesOut(BaseModel):
    """Supported attachment formats and configured size/count limits."""

    categories: list[MediaCategoryOut]
    """Supported formats grouped by category."""

    max_file_bytes: int
    """Maximum size, in bytes, of a single attached file."""

    max_total_bytes: int
    """Maximum combined size, in bytes, of all attachments in one message."""

    max_block_count: int
    """Maximum number of attachments allowed in one message."""
