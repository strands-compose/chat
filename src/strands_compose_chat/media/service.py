"""Derive attachment media capabilities from the agentcore format registry."""

from strands_compose_agentcore import MEDIA_FORMATS

from ..config import Settings
from ..schemas.media import MediaCapabilitiesOut, MediaCategoryOut, MediaFormatOut


def build_capabilities(settings: Settings) -> MediaCapabilitiesOut:
    """Build the supported attachment capabilities from the format registry.

    Groups the public ``strands_compose_agentcore.MEDIA_FORMATS`` registry by
    category, preserving registry order, and pairs the result with the
    configured size and count limits. The registry is the single source of
    truth, so adding a format upstream surfaces here automatically.

    Args:
        settings: Application settings supplying the media size and count
            limits.

    Returns:
        The supported attachment categories and the configured size/count
        limits.
    """
    categories: dict[str, MediaCategoryOut] = {}
    for spec in MEDIA_FORMATS:
        category = categories.get(spec.category)
        if category is None:
            category = MediaCategoryOut(category=spec.category, formats=[])
            categories[spec.category] = category
        category.formats.append(
            MediaFormatOut(
                format=spec.format,
                extensions=list(spec.extensions),
                mime_type=spec.mime_type,
            )
        )

    return MediaCapabilitiesOut(
        categories=list(categories.values()),
        max_file_bytes=settings.CHAT_MEDIA_MAX_FILE_BYTES,
        max_total_bytes=settings.CHAT_MEDIA_MAX_TOTAL_BYTES,
        max_block_count=settings.CHAT_MEDIA_MAX_BLOCK_COUNT,
    )
