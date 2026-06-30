"""Media support for chat attachments: capabilities reporting and content blocks."""

from .blocks import build_content_block, resolve_format
from .service import build_capabilities

__all__ = ["build_capabilities", "build_content_block", "resolve_format"]
