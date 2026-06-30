"""Parse invocation requests (JSON or multipart) into a Strands-ready prompt.

The downstream agent server validates payloads itself (size limits, media
decoding) via ``parse_payload``.  Here we only:

* unwrap the JSON envelope so we can read ``session_id`` / ``agent_id`` for
  session bookkeeping, and
* turn any uploaded ``file:<index>`` parts into Strands content blocks and
  append them to the prompt.
"""

import json
from typing import Any

import structlog
from fastapi import Request
from starlette.datastructures import FormData, UploadFile

from ..errors import ProblemDetailsException
from ..media.blocks import build_content_block
from ..schemas.invocations import InvocationJsonIn

logger: structlog.stdlib.BoundLogger = structlog.get_logger(__name__)


async def parse_request(request: Request) -> tuple[InvocationJsonIn, Any, list[dict[str, Any]]]:
    """Return validated body, Strands-ready prompt, and attachment metadata.

    Args:
        request: The incoming invocation request (JSON or multipart).

    Returns:
        A tuple of the validated body, the merged Strands prompt, and a list of
        attachment metadata dicts (``filename``, ``size``, ``type``). The list
        is empty for JSON requests and for multipart requests with no usable
        file parts.
    """
    if "multipart/form-data" in request.headers.get("content-type", ""):
        body, file_blocks, attachments = await _parse_multipart(request)
    else:
        body, file_blocks, attachments = await _parse_json(request), [], []
    return body, _merge_prompt(body.prompt, file_blocks), attachments


# ---------------------------------------------------------------------------
# JSON / multipart envelopes
# ---------------------------------------------------------------------------


async def _parse_json(request: Request) -> InvocationJsonIn:
    try:
        data = await request.json()
    except (json.JSONDecodeError, ValueError) as exc:
        raise ProblemDetailsException(422, f"Request body is not valid JSON: {exc}") from exc
    return InvocationJsonIn.model_validate(data)


async def _parse_multipart(
    request: Request,
) -> tuple[InvocationJsonIn, list[dict[str, Any]], list[dict[str, Any]]]:
    form = await request.form()
    payload_str = form.get("payload")
    if payload_str is None:
        raise ProblemDetailsException(422, "Multipart request must include a 'payload' form field.")
    try:
        payload_dict = json.loads(str(payload_str))
    except (json.JSONDecodeError, TypeError) as exc:
        raise ProblemDetailsException(
            422, f"'payload' form field is not valid JSON: {exc}"
        ) from exc
    body = InvocationJsonIn.model_validate(payload_dict)
    file_blocks, attachments = await _blocks_and_attachments_from_form(form)
    if not file_blocks:
        logger.warning(
            "multipart invocation carried no usable file parts",
            agent_id=body.agent_id,
        )
    return body, file_blocks, attachments


def _merge_prompt(prompt: Any, file_blocks: list[dict[str, Any]]) -> Any:
    """Append uploaded file blocks after the user-supplied prompt blocks."""
    if not file_blocks:
        return prompt
    if isinstance(prompt, str):
        return [{"text": prompt}, *file_blocks]
    if isinstance(prompt, dict):
        return [prompt, *file_blocks]
    if isinstance(prompt, list):
        return [*prompt, *file_blocks]
    return file_blocks


# ---------------------------------------------------------------------------
# Multipart file parts - Strands content blocks
# ---------------------------------------------------------------------------


async def _blocks_and_attachments_from_form(
    form: FormData,
) -> tuple[list[dict[str, Any]], list[dict[str, Any]]]:
    """Return content blocks and attachment metadata for every ``file:<index>`` part.

    Both lists are ordered by ascending part index and share the same length:
    each upload yields exactly one content block and one metadata entry.

    Args:
        form: The parsed multipart form data.

    Returns:
        A tuple ``(file_blocks, attachments)`` where ``file_blocks`` are Strands
        content blocks and ``attachments`` are metadata dicts with ``filename``,
        ``size``, and ``type`` keys.
    """
    parts = _collect_parts(form)
    logger.debug(
        "collected multipart file parts",
        file_part_count=len(parts),
        filenames=[parts[idx].filename for idx in sorted(parts)],
    )
    file_blocks: list[dict[str, Any]] = []
    attachments: list[dict[str, Any]] = []
    for idx in sorted(parts):
        block, meta = await _build_block_and_metadata(parts[idx])
        file_blocks.append(block)
        attachments.append(meta)
    return file_blocks, attachments


def _collect_parts(form: FormData) -> dict[int, UploadFile]:
    """Return ``{index: upload}`` for each ``file:<index>`` form field."""
    parts: dict[int, UploadFile] = {}
    for key, value in form.multi_items():
        if not key.startswith("file:") or not isinstance(value, UploadFile):
            continue
        try:
            parts[int(key[len("file:") :])] = value
        except ValueError as exc:
            raise ProblemDetailsException(
                422,
                f"File part key {key!r} has a non-integer index. "
                "Expected format: 'file:<non-negative integer>'.",
            ) from exc
    return parts


async def _build_block_and_metadata(upload: UploadFile) -> tuple[dict[str, Any], dict[str, Any]]:
    """Read *upload* into a Strands content block and its attachment metadata.

    The attachment ``type`` is derived from the resolved content block kind
    (``image`` or ``document``), so it always matches how the file was sent to
    the agent.

    Args:
        upload: The uploaded file part.

    Returns:
        A tuple ``(block, metadata)`` where ``block`` is a Strands content block
        dict and ``metadata`` has ``filename``, ``size``, and ``type`` keys.
    """
    filename = upload.filename or "file"
    data = await upload.read()
    block = build_content_block(filename, data, upload.content_type)
    metadata = {
        "filename": upload.filename or "upload",
        "size": len(data),
        "type": "image" if "image" in block else "document",
    }
    return block, metadata
