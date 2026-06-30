"""Structured logging configuration with PII redaction."""

import logging
import sys
from typing import Any

import structlog
from structlog.types import EventDict, WrappedLogger

from .config import Settings

# Field names that must never appear in log output.
_REDACTED_FIELDS = frozenset(
    [
        "password",
        "password_hash",
        "id_token",
        "authorization",
        "cookie",
        "set-cookie",
    ]
)

# Header names (case-insensitive) that are stripped from any ``headers`` dict/list.
_SENSITIVE_HEADERS = frozenset(["authorization", "cookie", "set-cookie"])


class PIIRedactor:
    """structlog processor that drops known-sensitive fields from every event dict.

    This is a **field-name allowlist** — it strips specific key names regardless
    of which route or handler emitted the log.  Route-aware heuristics were
    removed because they relied on fragile string-matching and silently went
    stale when new endpoints were added.

    What it strips:
      - Top-level keys in ``_REDACTED_FIELDS`` (password, id_token, etc.).
      - Header entries in ``_SENSITIVE_HEADERS`` (Authorization, Cookie, Set-Cookie)
        from both dict and list-of-tuples ``headers`` values.
    """

    def __call__(
        self,
        logger: WrappedLogger,
        method: str,
        event_dict: EventDict,
    ) -> EventDict:
        headers = event_dict.get("headers")
        if isinstance(headers, dict):
            event_dict["headers"] = {
                k: v for k, v in headers.items() if k.lower() not in _SENSITIVE_HEADERS
            }
        elif isinstance(headers, (list, tuple)):
            event_dict["headers"] = [
                (k, v)
                for k, v in headers
                if (k.decode("latin-1") if isinstance(k, bytes) else k).lower()
                not in _SENSITIVE_HEADERS
            ]

        for key in _REDACTED_FIELDS:
            event_dict.pop(key, None)

        return event_dict


def configure_logging(settings: Settings) -> None:
    """Configure structlog with the full processor chain."""
    log_level_name = getattr(settings, "LOG_LEVEL", "INFO")
    log_level = getattr(logging, log_level_name.upper(), logging.INFO)

    logging.basicConfig(format="%(message)s", stream=sys.stdout, level=log_level)

    shared_processors: list[Any] = [
        structlog.contextvars.merge_contextvars,
        structlog.stdlib.add_log_level,
        structlog.processors.TimeStamper(fmt="iso"),
        PIIRedactor(),
        structlog.processors.StackInfoRenderer(),
        structlog.processors.ExceptionRenderer(),
        structlog.processors.CallsiteParameterAdder(
            [
                structlog.processors.CallsiteParameter.FILENAME,
                structlog.processors.CallsiteParameter.FUNC_NAME,
                structlog.processors.CallsiteParameter.LINENO,
            ]
        ),
    ]

    log_format = getattr(settings, "LOG_FORMAT", "json")
    if log_format == "console":
        renderer: Any = structlog.dev.ConsoleRenderer(
            exception_formatter=structlog.dev.plain_traceback,
        )
    else:
        renderer = structlog.processors.JSONRenderer()

    structlog.configure(
        processors=shared_processors + [renderer],
        wrapper_class=structlog.make_filtering_bound_logger(log_level),
        context_class=dict,
        logger_factory=structlog.PrintLoggerFactory(file=sys.stdout),
        cache_logger_on_first_use=True,
    )


def get_logger(name: str) -> structlog.stdlib.BoundLogger:
    """Return a structlog logger bound to the given name."""
    return structlog.get_logger(name)
