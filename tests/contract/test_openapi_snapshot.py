"""Whole-contract OpenAPI snapshot and response_model audit.

Two tests live here. The first serialises the OpenAPI document in canonical form
and compares it byte-for-byte against the committed baseline; run with
``UPDATE_SNAPSHOT=1`` to regenerate the baseline. The second walks every
``APIRoute`` on the application (including sub-routers) and asserts that any
route returning a response body declares a ``response_model``. Routes that
return no JSON body are exempt structurally — by response class, status code,
tag, or schema-exclusion flag — never by a path allow-list.
"""

import json
import os
import typing
from pathlib import Path

from fastapi import FastAPI
from fastapi.routing import APIRoute
from starlette.responses import JSONResponse, RedirectResponse, Response, StreamingResponse

from strands_compose_chat.app import create_app

_BASELINE = Path(__file__).parent / "openapi.snapshot.json"


def _canonical(spec: dict) -> str:
    """Serialise *spec* in canonical form: sorted keys, 2-space indent, trailing newline."""
    return json.dumps(spec, sort_keys=True, indent=2) + "\n"


def _collect_api_routes(router: object) -> list[APIRoute]:
    """Recursively collect all ``APIRoute`` instances from *router*.

    FastAPI stores sub-routers (added via ``include_router``) as
    ``_IncludedRouter`` objects that expose an ``original_router`` attribute
    holding the real ``APIRouter``.  Plain ``Mount`` objects may also carry a
    ``routes`` list.  Both are walked recursively so no sub-router is missed.
    """
    routes: list[APIRoute] = []
    for route in getattr(router, "routes", []):
        if isinstance(route, APIRoute):
            routes.append(route)
        # _IncludedRouter wraps an APIRouter contributed via include_router().
        if hasattr(route, "original_router"):
            routes.extend(_collect_api_routes(route.original_router))
        elif hasattr(route, "routes"):
            routes.extend(_collect_api_routes(route))
    return routes


def _endpoint_return_type(route: APIRoute) -> type | None:
    """Resolve the concrete return type declared on *route*'s endpoint function.

    Returns the class object, or ``None`` when the annotation is absent or
    cannot be resolved (e.g. forward references at collection time).
    """
    try:
        hints = typing.get_type_hints(route.endpoint)
    except Exception:  # noqa: BLE001
        return None
    ret = hints.get("return")
    return ret if isinstance(ret, type) else None


def _is_exempt(route: APIRoute) -> bool:
    """Return ``True`` when *route* is exempt from the ``response_model`` requirement.

    Exemption criteria (structural/declarative — never a path-string allow-list):

    * ``include_in_schema=False`` — frontend HTML pages served as SPA shells.
    * ``status_code == 204`` — routes that return No Content by declaration.
    * ``"health"`` in route tags — liveness/readiness probes.
    * Endpoint return annotation is a subclass of ``RedirectResponse`` or of
      the base ``Response`` class (but **not** ``JSONResponse``) — OIDC
      login/logout/callback handlers that always redirect, never return JSON.
    * Endpoint return annotation is a subclass of ``StreamingResponse`` — the
      SSE invocation endpoint.
    """
    if not route.include_in_schema:
        return True
    if route.status_code == 204:
        return True
    if "health" in (route.tags or []):
        return True

    ret = _endpoint_return_type(route)
    if ret is not None:
        if issubclass(ret, StreamingResponse):
            return True
        if issubclass(ret, RedirectResponse):
            return True
        # Generic starlette Response (but not JSONResponse) — covers logout /
        # oidc_login which declare "-> Response" and always redirect.
        if issubclass(ret, Response) and not issubclass(ret, JSONResponse):
            return True

    return False


def test_openapi_contract_is_stable() -> None:
    """Snapshot test: canonical serialisation must match the committed baseline.

    When ``UPDATE_SNAPSHOT=1`` is set, the baseline is regenerated and the
    equality assertion is skipped. Outside update mode, a missing baseline
    causes an immediate failure without creating the file.
    """
    app: FastAPI = create_app()
    spec: dict = app.openapi()
    canonical: str = _canonical(spec)

    if os.environ.get("UPDATE_SNAPSHOT"):
        _BASELINE.write_text(canonical, encoding="utf-8")
        return  # baseline regenerated — skip equality check

    assert _BASELINE.exists(), (
        f"OpenAPI baseline is missing: {_BASELINE}. "
        "Generate it with: UPDATE_SNAPSHOT=1 uv run pytest tests/contract/test_openapi_snapshot.py"
    )

    baseline: str = _BASELINE.read_text(encoding="utf-8")
    assert canonical == baseline, (
        "OpenAPI contract changed. If intentional, regenerate with "
        "UPDATE_SNAPSHOT=1 and review the diff in the PR."
    )


def test_every_body_returning_route_declares_response_model() -> None:
    """Audit: every non-exempt route must declare a response_model.

    Walks all ``APIRoute`` instances on the application — including those
    registered on sub-routers — skips routes exempt by response class, status
    code, tag, or schema-exclusion flag, and collects any route whose
    ``response_model`` is ``None``.  Reports each offending path + method on
    failure.
    """
    app: FastAPI = create_app()
    all_routes = _collect_api_routes(app.router)

    offenders: list[str] = []
    for route in all_routes:
        if _is_exempt(route):
            continue
        if route.response_model is None:
            methods = ", ".join(sorted(route.methods or []))
            offenders.append(f"{methods} {route.path}")

    assert not offenders, (
        "The following routes return a body but declare no response_model:\n"
        + "\n".join(f"  {o}" for o in sorted(offenders))
    )
