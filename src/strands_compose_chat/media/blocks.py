"""Build Strands content blocks from uploaded files.

Format resolution is driven entirely by the agentcore ``MEDIA_FORMATS``
registry: a file's extension (or, as a fallback, its declared MIME type) is
matched to a registry entry, and that entry's category decides whether an image
or document block is built. The registry is the single source of truth, so a
format added upstream is supported here with no local change.
"""

import re
import uuid
from pathlib import Path
from typing import Any, cast

import structlog
from strands_compose_agentcore import MEDIA_FORMATS, MediaFormatSpec, document, image
from strands_compose_agentcore.media import DocumentFormat, ImageFormat

from ..errors import ProblemDetailsException

logger: structlog.stdlib.BoundLogger = structlog.get_logger(__name__)

_SPEC_BY_EXTENSION: dict[str, MediaFormatSpec] = {
    extension: spec for spec in MEDIA_FORMATS for extension in spec.extensions
}
_SPEC_BY_MIME: dict[str, MediaFormatSpec] = {spec.mime_type: spec for spec in MEDIA_FORMATS}

# Bedrock Converse restricts document names to alphanumeric, whitespace,
# hyphens, parentheses, and square brackets, and rejects consecutive whitespace.
_DISALLOWED_NAME_CHARS = re.compile(r"[^A-Za-z0-9 ()\[\]-]+")
_CONSECUTIVE_WHITESPACE = re.compile(r"\s{2,}")


def _document_name(filename: str) -> str:
    """Build a unique, Bedrock-safe document name from a filename.

    The extension is dropped, characters outside Bedrock's allowed set are
    replaced with a hyphen, runs of whitespace are collapsed, and a short
    random suffix is appended so names stay unique across turns (Bedrock
    rejects duplicate document names within a session).

    Args:
        filename: The original uploaded filename.

    Returns:
        A sanitised, unique document name.
    """
    stem = _DISALLOWED_NAME_CHARS.sub("-", Path(filename).stem)
    stem = _CONSECUTIVE_WHITESPACE.sub(" ", stem).strip()
    if not stem:
        stem = "document"
    return "%s-%s" % (stem, uuid.uuid4().hex[:8])


def resolve_format(filename: str, content_type: str | None = None) -> MediaFormatSpec:
    """Resolve the registry format spec for an uploaded file.

    The file extension is tried first; when it is unknown (or absent) the
    declared MIME type is used as a fallback.

    Args:
        filename: Original name of the uploaded file, used for its extension.
        content_type: MIME type declared for the upload, if any.

    Returns:
        The matching format spec from the registry.

    Raises:
        ProblemDetailsException: No supported format matches the file.
    """
    spec = _SPEC_BY_EXTENSION.get(Path(filename).suffix.lower())
    if spec is None and content_type:
        spec = _SPEC_BY_MIME.get(content_type.split(";")[0].strip().lower())
    if spec is None:
        raise ProblemDetailsException(
            422,
            f"Cannot determine a supported media format for {filename!r}. "
            "Ensure the filename has a recognised extension.",
        )
    return spec


def build_content_block(
    filename: str, data: bytes, content_type: str | None = None
) -> dict[str, Any]:
    """Build an image or document content block from uploaded bytes.

    Args:
        filename: Original name of the uploaded file.
        data: Raw file bytes.
        content_type: MIME type declared for the upload, if any.

    Returns:
        A Strands content block dict (an ``image`` or ``document`` block).

    Raises:
        ProblemDetailsException: No supported format matches the file.
    """
    spec = resolve_format(filename, content_type)
    if spec.category == "image":
        logger.debug(
            "built image content block",
            filename=filename,
            format=spec.format,
            byte_count=len(data),
        )
        return dict(image(data, format=cast(ImageFormat, spec.format)))

    name = _document_name(filename)
    logger.debug(
        "built document content block",
        filename=filename,
        document_name=name,
        format=spec.format,
        byte_count=len(data),
    )
    return dict(document(data, format=cast(DocumentFormat, spec.format), name=name))
