"""Unit tests for media.blocks.build_content_block and media.blocks.resolve_format."""

import base64
import re

import pytest
from hypothesis import given, settings
from hypothesis import strategies as st

from strands_compose_chat.errors import ProblemDetailsException
from strands_compose_chat.media.blocks import build_content_block, resolve_format


@pytest.mark.parametrize(
    ("filename", "expected_format", "expected_category"),
    [
        ("photo.jpg", "jpeg", "image"),
        ("image.jpeg", "jpeg", "image"),
        ("diagram.png", "png", "image"),
        ("animation.gif", "gif", "image"),
        ("banner.webp", "webp", "image"),
        ("report.pdf", "pdf", "document"),
        ("data.csv", "csv", "document"),
        ("notes.txt", "txt", "document"),
    ],
)
def test_resolve_format_maps_extension_to_format_and_category(
    filename: str,
    expected_format: str,
    expected_category: str,
) -> None:
    spec = resolve_format(filename)

    assert spec.format == expected_format
    assert spec.category == expected_category


def test_resolve_format_is_case_insensitive_for_extensions() -> None:
    spec_lower = resolve_format("file.jpg")
    spec_upper = resolve_format("FILE.JPG")

    assert spec_lower.format == spec_upper.format
    assert spec_lower.category == spec_upper.category


@pytest.mark.parametrize(
    ("filename", "content_type", "expected_format", "expected_category"),
    [
        ("upload_12345", "image/jpeg", "jpeg", "image"),
        ("attachment", "application/pdf", "pdf", "document"),
    ],
)
def test_resolve_format_falls_back_to_mime_type_when_extension_is_unknown(
    filename: str,
    content_type: str,
    expected_format: str,
    expected_category: str,
) -> None:
    spec = resolve_format(filename, content_type)

    assert spec.format == expected_format
    assert spec.category == expected_category


def test_resolve_format_strips_mime_type_parameters_before_lookup() -> None:
    # Content-Type headers often carry charset or boundary parameters.
    spec = resolve_format("data", "text/plain; charset=utf-8")

    assert spec.format == "txt"
    assert spec.category == "document"


def test_resolve_format_extension_takes_precedence_over_mime_type() -> None:
    spec = resolve_format("image.png", "application/octet-stream")

    assert spec.format == "png"
    assert spec.category == "image"


@pytest.mark.parametrize(
    ("filename", "content_type"),
    [
        ("file.xyz123", None),
        ("no_extension", None),
        ("binary.bin", "application/octet-stream"),
    ],
)
def test_resolve_format_raises_for_unsupported_or_missing_format(
    filename: str,
    content_type: str | None,
) -> None:
    with pytest.raises(ProblemDetailsException) as exc_info:
        resolve_format(filename, content_type)

    assert exc_info.value.status_code == 422


@pytest.mark.parametrize(
    ("filename", "expected_format"),
    [
        ("photo.jpg", "jpeg"),
        ("photo.jpeg", "jpeg"),
        ("diagram.png", "png"),
        ("animation.gif", "gif"),
        ("banner.webp", "webp"),
    ],
)
def test_build_content_block_image_block_shape(filename: str, expected_format: str) -> None:
    data = b"raw_image_data"
    result = build_content_block(filename, data)

    assert "image" in result
    assert "document" not in result
    assert result["image"]["format"] == expected_format
    assert result["image"]["source"]["base64"] == base64.b64encode(data).decode()


@pytest.mark.parametrize(
    ("filename", "expected_format"),
    [
        ("report.pdf", "pdf"),
        ("data.csv", "csv"),
        ("notes.txt", "txt"),
    ],
)
def test_build_content_block_document_block_shape(filename: str, expected_format: str) -> None:
    data = b"document_bytes"
    result = build_content_block(filename, data)

    assert "document" in result
    assert "image" not in result
    assert "name" in result["document"]
    assert result["document"]["format"] == expected_format
    assert result["document"]["source"]["base64"] == base64.b64encode(data).decode()


def test_build_content_block_document_name_is_derived_from_stem() -> None:
    result = build_content_block("report.pdf", b"pdf_bytes")

    name = result["document"]["name"]
    assert re.match(r"^report-[0-9a-f]{8}$", name), f"unexpected name: {name!r}"


def test_build_content_block_uses_mime_fallback_for_extensionless_image_upload() -> None:
    data = b"jpeg_bytes"
    result = build_content_block("upload_abc", data, content_type="image/jpeg")

    assert "image" in result
    assert result["image"]["format"] == "jpeg"
    assert result["image"]["source"]["base64"] == base64.b64encode(data).decode()


def test_build_content_block_uses_mime_fallback_for_extensionless_document_upload() -> None:
    data = b"pdf_content"
    result = build_content_block("attachment", data, content_type="application/pdf")

    assert "document" in result
    assert result["document"]["format"] == "pdf"


def test_build_content_block_raises_for_unsupported_file_type() -> None:
    with pytest.raises(ProblemDetailsException) as exc_info:
        build_content_block("binary.exe", b"executable_bytes")

    assert exc_info.value.status_code == 422


def test_build_content_block_raises_problem_details_exception_type() -> None:
    with pytest.raises(ProblemDetailsException):
        build_content_block("archive.tar.gz", b"archive_bytes")


_SUPPORTED_EXTENSIONS = [
    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".webp",
    ".pdf",
    ".csv",
    ".doc",
    ".docx",
    ".xls",
    ".xlsx",
    ".html",
    ".htm",
    ".txt",
    ".md",
]

_filenames = st.builds(
    lambda stem, ext: f"{stem}{ext}",
    stem=st.from_regex(r"[A-Za-z0-9_-]{1,20}", fullmatch=True),
    ext=st.sampled_from(_SUPPORTED_EXTENSIONS),
)


@pytest.mark.property
@settings(max_examples=100)
@given(filename=_filenames, data=st.binary(min_size=1, max_size=4096))
def test_build_content_block_round_trip_base64_decodes_to_original_bytes(
    filename: str,
    data: bytes,
) -> None:
    result = build_content_block(filename, data)

    category = next(iter(result))
    encoded = result[category]["source"]["base64"]
    recovered = base64.b64decode(encoded)

    assert recovered == data


@pytest.mark.property
@settings(max_examples=100)
@given(filename=_filenames, data=st.binary(min_size=1, max_size=4096))
def test_build_content_block_size_equals_raw_byte_length(
    filename: str,
    data: bytes,
) -> None:
    result = build_content_block(filename, data)

    category = next(iter(result))
    encoded = result[category]["source"]["base64"]
    block_size = len(base64.b64decode(encoded))

    assert block_size == len(data)
