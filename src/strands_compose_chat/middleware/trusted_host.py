"""TrustedHostMiddleware variant that exempts LB probe paths from host validation."""

from starlette.middleware.trustedhost import TrustedHostMiddleware
from starlette.types import Receive, Scope, Send


class HealthExemptTrustedHostMiddleware(TrustedHostMiddleware):
    """TrustedHostMiddleware that skips host validation for LB health/readiness probes.

    ALB target-group health checks reach the container via its private IP, so
    the probe's Host header is the container IP — never a value in
    TRUSTED_HOSTS.  We bypass host validation only for the exact probe paths;
    every other request is still strictly enforced.

    Args:
        app: The ASGI application to wrap.
        allowed_hosts: Sequence of hostnames allowed through host validation.
        www_redirect: When True, redirect non-www to www (passed to parent).
        exempt_paths: Frozenset of path strings that skip host validation.
            Both the prefixed and un-prefixed probe paths should be included so
            the exemption works regardless of whether the app uses ASGI
            ``root_path`` or mounts routes directly under the prefix.
    """

    def __init__(
        self,
        app,  # type: ignore[override]  # starlette parent uses untyped ASGIApp alias
        allowed_hosts: list[str] | None = None,
        www_redirect: bool = True,
        exempt_paths: frozenset[str] = frozenset(),
    ) -> None:
        super().__init__(app, allowed_hosts=allowed_hosts, www_redirect=www_redirect)
        self.exempt_paths = exempt_paths

    async def __call__(self, scope: Scope, receive: Receive, send: Send) -> None:
        """Pass probe paths through without host validation; enforce all others."""
        if scope["type"] == "http" and scope.get("path", "").rstrip("/") in self.exempt_paths:
            await self.app(scope, receive, send)
            return
        await super().__call__(scope, receive, send)
