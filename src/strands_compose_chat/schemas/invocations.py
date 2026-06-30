"""Pydantic v2 request schemas for the invocation endpoint."""

from typing import Any

from pydantic import BaseModel, Field

# The prompt envelope as it arrives over HTTP: plain text, a single content
# block, or a list of content blocks. Content blocks are validated downstream
# by the media layer (build_content_block / resolve_format); we deliberately do
# not pull the SDK's content-block types into our request schema, both to keep
# the HTTP contract independent of SDK internals and because those types are
# typing.TypedDicts that Pydantic cannot build a schema from on Python < 3.12.
PromptInput = str | dict[str, Any] | list[dict[str, Any]]


class InvocationJsonIn(BaseModel):
    """JSON envelope for ``POST /api/v1/invocations``.

    For multipart/form-data requests this model is parsed from the ``payload``
    form field (a JSON string).  File uploads are collected separately and
    appended to ``prompt`` by ``payload.parse_request``.
    """

    session_id: str | None = Field(
        default=None,
        min_length=33,
        max_length=256,
        description="Session identifier. Minted by the backend when omitted (new conversation).",
    )
    agent_id: str | None = Field(
        default=None,
        pattern=r"^[a-z0-9]+(?:-[a-z0-9]+)*$",
        max_length=64,
        description=(
            "Kebab-case agent slug. Required when starting a new session; "
            "optional when resuming an existing one."
        ),
    )
    prompt: PromptInput = Field(
        description=(
            "The prompt: a plain text string, a single content-block dict, "
            "or a list of content-block dicts."
        ),
    )
