"""Service-layer tests for the media slice.

``build_capabilities`` is a pure function that derives the capability response
from the agentcore ``MEDIA_FORMATS`` registry and the application settings.
"""

from strands_compose_agentcore import MEDIA_FORMATS

from strands_compose_chat.config import Settings
from strands_compose_chat.media.service import build_capabilities
from strands_compose_chat.schemas.media import MediaCapabilitiesOut

_SESSION_SECRET = "t" * 43

_SETTINGS = Settings(
    SESSION_SECRET_KEY=_SESSION_SECRET,
    CHAT_MEDIA_MAX_FILE_BYTES=5 * 1024 * 1024,
    CHAT_MEDIA_MAX_TOTAL_BYTES=20 * 1024 * 1024,
    CHAT_MEDIA_MAX_BLOCK_COUNT=10,
)


def test_build_capabilities_result_is_valid_schema() -> None:
    result = build_capabilities(_SETTINGS)

    assert isinstance(result, MediaCapabilitiesOut)
    MediaCapabilitiesOut.model_validate(result.model_dump())


def test_build_capabilities_limit_fields_reflect_custom_settings() -> None:
    custom = Settings(
        SESSION_SECRET_KEY=_SESSION_SECRET,
        CHAT_MEDIA_MAX_FILE_BYTES=1 * 1024 * 1024,
        CHAT_MEDIA_MAX_TOTAL_BYTES=4 * 1024 * 1024,
        CHAT_MEDIA_MAX_BLOCK_COUNT=3,
    )
    result = build_capabilities(custom)

    assert result.max_file_bytes == 1 * 1024 * 1024
    assert result.max_total_bytes == 4 * 1024 * 1024
    assert result.max_block_count == 3


def test_build_capabilities_includes_image_and_document_categories() -> None:
    result = build_capabilities(_SETTINGS)

    category_names = {c.category for c in result.categories}
    assert {"image", "document"} <= category_names


def test_build_capabilities_category_count_matches_registry() -> None:
    expected_categories = {spec.category for spec in MEDIA_FORMATS}
    result = build_capabilities(_SETTINGS)

    assert len(result.categories) == len(expected_categories)


def test_build_capabilities_total_format_count_matches_registry() -> None:
    result = build_capabilities(_SETTINGS)

    total_formats = sum(len(cat.formats) for cat in result.categories)
    assert total_formats == len(MEDIA_FORMATS)


def test_build_capabilities_image_category_contains_expected_formats() -> None:
    expected_image_formats = {spec.format for spec in MEDIA_FORMATS if spec.category == "image"}
    result = build_capabilities(_SETTINGS)

    image_cat = next(c for c in result.categories if c.category == "image")
    assert {f.format for f in image_cat.formats} == expected_image_formats


def test_build_capabilities_document_category_contains_expected_formats() -> None:
    expected_doc_formats = {spec.format for spec in MEDIA_FORMATS if spec.category == "document"}
    result = build_capabilities(_SETTINGS)

    doc_cat = next(c for c in result.categories if c.category == "document")
    assert {f.format for f in doc_cat.formats} == expected_doc_formats
