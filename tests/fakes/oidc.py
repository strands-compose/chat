"""Fake OIDC provider standing in for ``auth.oidc.OIDCProvider``.

Implements the full ``OIDCProvider`` interface so tests can drive the
JIT-provisioning and login-callback paths without authlib or a real IdP.

Inject via the registry dependency::

    app.dependency_overrides[get_oidc_registry] = lambda: {"fake": FakeOIDCProvider()}

or inside a single test::

    monkeypatch.setattr(
        "strands_compose_chat.deps.get_oidc_registry",
        lambda: {"fake": FakeOIDCProvider()},
    )
"""

from fastapi import Request
from fastapi.responses import RedirectResponse, Response


class FakeOIDCProvider:
    """Stand-in for ``auth.oidc.OIDCProvider``.

    Returns canned verified claims from ``complete()`` so the JIT provisioning
    and login-callback paths can be exercised without a real IdP.

    Args:
        provider_id: Value returned by the ``id`` property.
        display_name: Value returned by the ``display_name`` property.
        username_claim: Claim key used to derive the username; returned by the
            ``username_claim`` property and present in the canned claims dict.
        claims: Canned verified-claims dict returned by ``complete()``. When
            ``None`` the fake builds a minimal default dict containing ``sub``
            and the configured ``username_claim`` key so callers never receive
            an empty or invalid claims payload.
        logout_url: URL returned by ``resolve_logout_url()``; ``None`` means
            single sign-out is not available for this provider.
        authorize_redirect_url: The location the fake redirects to when
            ``authorize_redirect()`` is called. Defaults to
            ``"/auth/fake/callback"``, which is never a real route but is
            sufficient for tests that only care that a redirect was returned.
    """

    def __init__(
        self,
        *,
        provider_id: str = "fake",
        display_name: str = "Fake IdP",
        username_claim: str = "preferred_username",
        claims: dict | None = None,
        logout_url: str | None = None,
        authorize_redirect_url: str = "/auth/fake/callback",
    ) -> None:
        self._id = provider_id
        self._display_name = display_name
        self._username_claim = username_claim
        self._logout_url = logout_url
        self._authorize_redirect_url = authorize_redirect_url

        if claims is not None:
            self._claims = claims
        else:
            # jit_provision requires "sub"; username_claim must be present so it
            # can be used as a username.
            self._claims = {
                "sub": f"{provider_id}-user-sub",
                username_claim: f"{provider_id}_user",
                "email": f"{provider_id}_user@example.invalid",
            }

    @property
    def id(self) -> str:
        """The provider id."""
        return self._id

    @property
    def display_name(self) -> str:
        """The human-facing provider label."""
        return self._display_name

    @property
    def username_claim(self) -> str:
        """The claim key used to derive a username at JIT provisioning."""
        return self._username_claim

    @property
    def auth_provider_value(self) -> str:
        """The value stored in User.auth_provider: ``'oidc:{id}'``."""
        return f"oidc:{self._id}"

    async def authorize_redirect(self, request: Request, redirect_uri: str) -> Response:
        """Return a 302 redirect to the configured ``authorize_redirect_url``.

        Tests that assert a redirect was issued can inspect the response's
        ``Location`` header. ``request`` and ``redirect_uri`` are unused.
        """
        return RedirectResponse(url=self._authorize_redirect_url, status_code=302)

    async def complete(self, request: Request | None) -> dict:
        """Return a copy of the canned verified claims.

        ``request`` is unused and accepts ``None`` so test code can call without
        a real request.
        """
        return dict(self._claims)

    async def resolve_logout_url(self, post_logout_redirect_uri: str) -> str | None:
        """Return the configured logout URL, or ``None`` when unavailable.

        ``post_logout_redirect_uri`` is unused; the canned URL is returned as-is.
        """
        return self._logout_url
