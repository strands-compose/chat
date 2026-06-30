"""OIDC engine: provider wrapper and registry builder using authlib."""

from urllib.parse import urlencode

import structlog
from authlib.integrations.starlette_client import OAuth, OAuthError, StarletteOAuth2App
from fastapi import Request
from fastapi.responses import Response
from pydantic import ValidationError

from ..config import OidcConfigurationError, OidcProviderSettings, Settings

logger: structlog.stdlib.BoundLogger = structlog.get_logger(__name__)


class ExternalAuthError(Exception):
    """Raised when an OIDC Authorization Code Flow cannot be completed.

    Args:
        detail: Human-readable failure description (never includes tokens or secrets).
    """

    def __init__(self, detail: str) -> None:
        """Initialise with a human-readable detail string.

        Args:
            detail: Human-readable failure description (never includes tokens or secrets).
        """
        super().__init__(detail)
        self.detail = detail


class OIDCProvider:
    """Thin wrapper over a single authlib OIDC client.

    Exposes only the operations the login flow needs. Discovery, PKCE state, nonce, and
    signature validation are delegated to authlib; this class adds identity metadata and
    logout resolution.
    """

    def __init__(
        self,
        provider_id: str,
        config: OidcProviderSettings,
        client: StarletteOAuth2App,
    ) -> None:
        """Initialise with a provider id, validated config, and authlib client.

        Args:
            provider_id: Provider id exactly as listed in OIDC_PROVIDERS.
            config: The validated per-provider OidcProviderSettings.
            client: The authlib StarletteOAuth2App registered for this provider.
        """
        self._id = provider_id
        self._config = config
        self._client = client

    @property
    def id(self) -> str:
        """The provider id."""
        return self._id

    @property
    def display_name(self) -> str:
        """The human-facing provider label (falls back to the id when unset)."""
        return self._config.display_name or self._id

    @property
    def username_claim(self) -> str:
        """The claim used to derive a username at JIT provisioning."""
        return self._config.username_claim

    @property
    def auth_provider_value(self) -> str:
        """The value stored in User.auth_provider: 'oidc:{id}'."""
        return f"oidc:{self._id}"

    async def authorize_redirect(self, request: Request, redirect_uri: str) -> Response:
        """Begin the Authorization Code Flow; returns a redirect to the IdP.

        authlib generates state + nonce + PKCE verifier (S256) and stores them in the
        request session before redirecting.

        Args:
            request: The current Starlette request.
            redirect_uri: The absolute callback URL registered with the provider.

        Returns:
            A redirect response to the identity provider's authorization endpoint.
        """
        return await self._client.authorize_redirect(request, redirect_uri)

    async def complete(self, request: Request) -> dict:
        """Complete the flow and return verified ID-token claims.

        authlib exchanges the code (with the PKCE verifier), validates state + nonce, and
        verifies the ID-token signature against the provider's cached JWKS.

        Args:
            request: The current Starlette request (contains callback params + session).

        Returns:
            A dict of verified userinfo claims from the ID token.

        Raises:
            ExternalAuthError: If the provider errored, the user cancelled, or the token
                was invalid/expired.
        """
        try:
            token = await self._client.authorize_access_token(request)
        except OAuthError as exc:
            raise ExternalAuthError(f"OIDC flow failed: {exc.error}") from exc
        claims = token.get("userinfo")
        if not claims:
            raise ExternalAuthError("ID token did not yield verified claims")
        return dict(claims)

    async def resolve_logout_url(self, post_logout_redirect_uri: str) -> str | None:
        """Resolve the single-sign-out URL, or None when no sign-out is possible.

        Resolution order: discovery end_session_endpoint, then the configured
        OIDC_{ID}_LOGOUT_URL, then None. Discovery failures are isolated.

        Args:
            post_logout_redirect_uri: Where to redirect after the IdP signs the user out.

        Returns:
            The fully-qualified end-session URL, or None when unavailable.
        """
        end_session = await self._end_session_endpoint()
        if end_session:
            query = urlencode({"post_logout_redirect_uri": post_logout_redirect_uri})
            return f"{end_session}?{query}"
        if self._config.logout_url:
            return self._config.logout_url
        return None

    async def _end_session_endpoint(self) -> str | None:
        """Fetch the end_session_endpoint from the provider's discovery document.

        Returns None and logs a warning when discovery is unavailable.
        """
        try:
            metadata = await self._client.load_server_metadata()
        except (OAuthError, OSError, ValueError):
            logger.warning(
                "OIDC discovery unavailable at logout for %s",
                self._id,
            )
            return None
        return metadata.get("end_session_endpoint")


def build_oidc_registry(settings: Settings) -> dict[str, OIDCProvider]:
    """Build the provider registry from settings without any network I/O.

    For each id in settings.OIDC_PROVIDERS, instantiate OidcProviderSettings with a runtime
    _env_prefix of OIDC_{ID}_ so each provider's keys resolve from os.environ and .env
    natively. Missing required keys raise pydantic ValidationError, re-raised as
    OidcConfigurationError naming the provider id and offending keys; duplicate ids are
    rejected before instantiation; display_name defaults to the id when unset.

    Args:
        settings: The application Settings instance.

    Returns:
        A mapping of provider id to OIDCProvider wrapper.

    Raises:
        OidcConfigurationError: On duplicate ids or invalid/missing provider configuration.
    """
    oauth = OAuth()
    registry: dict[str, OIDCProvider] = {}
    seen: set[str] = set()

    for pid in settings.OIDC_PROVIDERS:
        key = pid.upper()
        if key in seen:
            raise OidcConfigurationError(f"Duplicate OIDC provider id {pid!r}")
        seen.add(key)

        try:
            cfg = OidcProviderSettings(_env_prefix=f"OIDC_{key}_")  # ty: ignore
        except ValidationError as exc:
            missing = [".".join(str(loc) for loc in e["loc"]) for e in exc.errors()]
            raise OidcConfigurationError(
                f"Provider {pid!r} is missing required configuration: {', '.join(missing)}. "
                f"Set OIDC_{key}_DISCOVERY_URL, OIDC_{key}_CLIENT_ID, etc."
            ) from exc

        if not cfg.display_name:
            cfg.display_name = pid

        client_kwargs: dict[str, object] = {
            "scope": cfg.scopes,
            "code_challenge_method": "S256",
        }

        register_kwargs: dict[str, object] = {
            "name": pid,
            "server_metadata_url": cfg.discovery_url,
            "client_id": cfg.client_id,
            "client_kwargs": client_kwargs,
        }
        if cfg.client_secret is not None:
            register_kwargs["client_secret"] = cfg.client_secret

        oauth.register(**register_kwargs)
        registry[pid] = OIDCProvider(pid, cfg, oauth.create_client(pid))

    return registry
