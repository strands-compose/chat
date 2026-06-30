"""RFC 9457 Problem Details error handling."""

from http import HTTPStatus
from typing import Any

import structlog
from fastapi import FastAPI, HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from pydantic import BaseModel, ConfigDict

logger: structlog.stdlib.BoundLogger = structlog.get_logger(__name__)

PROBLEM_JSON_CONTENT_TYPE = "application/problem+json"


class ProblemDetails(BaseModel):
    """RFC 9457 Problem Details response body."""

    model_config = ConfigDict(extra="allow")

    type: str = "about:blank"
    title: str
    status: int
    detail: str
    instance: str


class ProblemDetailsException(Exception):
    """Raise to return a structured RFC 9457 response from any route."""

    def __init__(
        self,
        status_code: int,
        detail: str,
        title: str | None = None,
        type_uri: str = "about:blank",
        **extra: Any,
    ) -> None:
        super().__init__(detail)
        self.status_code = status_code
        self.detail = detail
        self.title = title or _default_title(status_code)
        self.type_uri = type_uri
        self.extra = extra


def _default_title(status_code: int) -> str:
    try:
        return HTTPStatus(status_code).phrase
    except ValueError:
        return "Error"


def _problem_response(
    status_code: int,
    title: str,
    detail: str,
    request: Request,
    type_uri: str = "about:blank",
    **extra: Any,
) -> JSONResponse:
    body = ProblemDetails(
        type=type_uri,
        title=title,
        status=status_code,
        detail=detail,
        instance=request.url.path,
        **extra,
    )
    return JSONResponse(
        status_code=status_code,
        content=body.model_dump(),
        media_type=PROBLEM_JSON_CONTENT_TYPE,
    )


async def http_exception_handler(request: Request, exc: HTTPException) -> JSONResponse:
    """Handle FastAPI/Starlette HTTPException as a Problem Details response."""
    detail = exc.detail if isinstance(exc.detail, str) else str(exc.detail)
    return _problem_response(
        status_code=exc.status_code,
        title=_default_title(exc.status_code),
        detail=detail,
        request=request,
    )


async def validation_exception_handler(
    request: Request, exc: RequestValidationError
) -> JSONResponse:
    """Handle Pydantic RequestValidationError as a Problem Details response.

    The per-field summary and the structured ``errors`` list are built from the
    validation errors with the ``input`` and ``ctx`` keys stripped, so submitted
    values (passwords, tokens, emails) are never reflected back to the caller.
    """
    raw_errors = exc.errors()
    field_summaries = []
    safe_errors = []
    for err in raw_errors:
        loc = " -> ".join(str(part) for part in err.get("loc", []))
        msg = err.get("msg", "invalid value")
        field_summaries.append(f"{loc}: {msg}" if loc else msg)
        safe_errors.append(
            {
                "loc": list(err.get("loc", [])),
                "msg": msg,
                "type": err.get("type", ""),
            }
        )
    detail = "; ".join(field_summaries) if field_summaries else "Request validation failed."
    return _problem_response(
        status_code=422,
        title="Validation Error",
        detail=detail,
        request=request,
        errors=safe_errors,
    )


async def problem_details_exception_handler(
    request: Request, exc: ProblemDetailsException
) -> JSONResponse:
    """Handle ProblemDetailsException raised by route handlers."""
    return _problem_response(
        status_code=exc.status_code,
        title=exc.title,
        detail=exc.detail,
        request=request,
        type_uri=exc.type_uri,
        **exc.extra,
    )


async def unhandled_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """Catch-all handler for unexpected exceptions.

    Logs the full exception internally but returns a generic HTTP 500 response
    that contains no exception message, traceback, or internal details.
    """
    logger.error(
        "Unhandled exception",
        method=request.method,
        path=request.url.path,
        exc_info=True,
    )
    return _problem_response(
        status_code=500,
        title="Internal Server Error",
        detail="An unexpected error occurred. Please try again later.",
        request=request,
    )


def register_exception_handlers(app: FastAPI) -> None:
    """Register all Problem Details exception handlers on *app*."""
    app.add_exception_handler(RequestValidationError, validation_exception_handler)  # type: ignore
    app.add_exception_handler(ProblemDetailsException, problem_details_exception_handler)  # type: ignore
    app.add_exception_handler(HTTPException, http_exception_handler)  # type: ignore
    app.add_exception_handler(Exception, unhandled_exception_handler)
