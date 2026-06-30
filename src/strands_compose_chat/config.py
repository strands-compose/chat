"""Application configuration via pydantic-settings."""

import base64
import functools
import re
from typing import Literal
from urllib.parse import urlparse

from pydantic import field_validator, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

_SENSITIVE_PATTERN = re.compile(r"SECRET|PASSWORD|TOKEN|KEY", re.IGNORECASE)


class OidcConfigurationError(ValueError):
    """Raised when OIDC provider configuration is missing or invalid at startup."""


class OidcProviderSettings(BaseSettings):
    """Validated configuration for a single OIDC provider.

    Instantiated once per provider id by the registry builder with a runtime ``_env_prefix``
    of ``OIDC_{ID}_`` (e.g. id 'okta' -> OIDC_OKTA_*). Because it is a pydantic-settings
    model, each field resolves from both the process environment and the project ``.env``
    file natively, with the process environment taking precedence.

    Args:
        discovery_url: Absolute URL of the provider's .well-known/openid-configuration.
        client_id: OAuth client id.
        client_secret: Client secret, or None for a public (PKCE-only) client.
        scopes: Space-delimited scope string; 'openid' is always force-included.
        username_claim: Claim used to derive the username at JIT provisioning.
        display_name: Login button label (the builder defaults it to the id when unset).
        logout_url: Optional fallback end-session URL.
    """

    model_config = SettingsConfigDict(env_file=".env", extra="ignore", case_sensitive=False)

    discovery_url: str
    client_id: str
    client_secret: str | None = None
    scopes: str = "openid email profile"
    username_claim: str = "preferred_username"
    display_name: str | None = None
    logout_url: str | None = None

    @field_validator("discovery_url")
    @classmethod
    def _validate_discovery_url(cls, value: str) -> str:
        """Require an absolute http(s) discovery URL."""
        parsed = urlparse(value)
        if parsed.scheme not in {"http", "https"} or not parsed.netloc:
            raise ValueError("discovery_url must be an absolute http(s) URL")
        return value

    @field_validator("scopes")
    @classmethod
    def _force_openid_scope(cls, value: str) -> str:
        """Force-include 'openid', preserving order and de-duplicating."""
        scopes = value.split()
        ordered = ["openid", *[s for s in scopes if s != "openid"]]
        return " ".join(dict.fromkeys(ordered))


class Settings(BaseSettings):
    """Typed configuration for the Chat Backend API.

    Reads from environment variables and an optional .env file.
    Sensitive fields (names containing SECRET, PASSWORD, TOKEN, or KEY) are
    excluded from any __repr__ / log output.
    """

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    APP_ENV: Literal["dev", "test", "prod"] = "dev"
    URL_PREFIX: str = ""
    SESSION_COOKIE_NAME: str = "strands_chat_session"

    DATABASE_URL: str = "sqlite+aiosqlite:///./strands-chat.sqlite"

    SESSION_SECRET_KEY: str = ""
    SESSION_TTL_SECONDS: int = 12 * 3600

    CORS_ALLOWED_ORIGINS: list[str] = ["http://localhost:5173"]
    TRUSTED_HOSTS: list[str] = ["localhost", "127.0.0.1"]

    CHAT_SESSION_MAX_PAGE_SIZE: int = 100
    """Maximum number of sessions returned in a single paginated request."""

    PASSWORD_MIN_LENGTH: int = 12

    ARGON2_MEMORY_KIB: int = 65536
    ARGON2_TIME_COST: int = 3
    ARGON2_PARALLELISM: int = 4

    LOG_LEVEL: str = "INFO"
    LOG_FORMAT: Literal["json", "console"] = "console"

    ADMIN_BOOTSTRAP_USERNAME: str | None = None
    ADMIN_BOOTSTRAP_PASSWORD: str | None = None

    CUSTOM_HEADER_TITLE: str | None = None
    """Optional title shown in the app header and browser tab"""

    OIDC_PROVIDERS: list[str] = []
    """JSON array of configured OIDC provider ids (e.g. '["okta","entra"]')."""

    OIDC_REDIRECT_URI: str | None = None
    """Complete OIDC callback redirect_uri; None means infer from the request."""

    AUTH_REGISTRATION_ENABLED: bool | None = None
    """Self-service registration gate; None means derive from OIDC_PROVIDERS."""

    CHAT_MEDIA_MAX_FILE_BYTES: int = 5 * 1024 * 1024
    """Maximum size, in bytes, of a single attached file."""

    CHAT_MEDIA_MAX_TOTAL_BYTES: int = 20 * 1024 * 1024
    """Maximum combined size, in bytes, of all attachments in one message."""

    CHAT_MEDIA_MAX_BLOCK_COUNT: int = 10
    """Maximum number of attachments allowed in one message."""

    # ---------------------------------------------------------------------------
    # Validators
    # ---------------------------------------------------------------------------

    @field_validator("URL_PREFIX")
    @classmethod
    def validate_url_prefix(cls, v: str) -> str:
        """Normalise URL_PREFIX: strip trailing slashes; ensure leading slash when non-empty."""
        v = v.rstrip("/")
        if v and not v.startswith("/"):
            v = f"/{v}"
        return v

    @model_validator(mode="after")
    def _validate_session_secret_key(self) -> "Settings":
        """SESSION_SECRET_KEY must decode to >= 32 bytes of entropy."""
        key = self.SESSION_SECRET_KEY
        if not key:
            raise ValueError(
                "SESSION_SECRET_KEY is required and must decode to at least 32 bytes of entropy"
            )
        try:
            decoded = base64.b64decode(key, validate=True)
            entropy_bytes = len(decoded)
        except Exception:
            entropy_bytes = len(key.encode("utf-8"))

        if entropy_bytes < 32:
            raise ValueError(
                f"SESSION_SECRET_KEY must decode to at least 32 bytes of entropy "
                f"(got {entropy_bytes} bytes)"
            )
        return self

    @model_validator(mode="after")
    def _validate_prod_restrictions(self) -> "Settings":
        """Production-mode restrictions on CORS, trusted hosts, and DB."""
        if self.APP_ENV != "prod":
            return self
        if "*" in self.CORS_ALLOWED_ORIGINS:
            raise ValueError("CORS_ALLOWED_ORIGINS must not contain '*' in prod")
        if "*" in self.TRUSTED_HOSTS:
            raise ValueError("TRUSTED_HOSTS must not contain '*' in prod")
        if self.DATABASE_URL.startswith("sqlite"):
            raise ValueError("DATABASE_URL must not use SQLite in prod")
        return self

    @model_validator(mode="after")
    def _default_registration_enabled(self) -> "Settings":
        """Default AUTH_REGISTRATION_ENABLED: off when OIDC providers exist, on otherwise.

        An explicit value always wins; this validator only acts when the value is None.
        """
        if self.AUTH_REGISTRATION_ENABLED is None:
            self.AUTH_REGISTRATION_ENABLED = not bool(self.OIDC_PROVIDERS)
        return self

    @model_validator(mode="after")
    def _validate_media_limits(self) -> "Settings":
        """Per-file media limit must not exceed the total media limit."""
        if self.CHAT_MEDIA_MAX_FILE_BYTES > self.CHAT_MEDIA_MAX_TOTAL_BYTES:
            raise ValueError(
                f"CHAT_MEDIA_MAX_FILE_BYTES ({self.CHAT_MEDIA_MAX_FILE_BYTES}) must not exceed "
                f"CHAT_MEDIA_MAX_TOTAL_BYTES ({self.CHAT_MEDIA_MAX_TOTAL_BYTES})"
            )
        return self

    def __repr__(self) -> str:
        """Return a repr that redacts sensitive field values."""
        parts: list[str] = []
        for field_name in self.__class__.model_fields:
            if _SENSITIVE_PATTERN.search(field_name):
                parts.append(f"{field_name}=<redacted>")
            else:
                parts.append(f"{field_name}={getattr(self, field_name)!r}")
        return f"Settings({', '.join(parts)})"

    def safe_dict(self) -> dict[str, object]:
        """Return a dict of all settings with sensitive values redacted."""
        result: dict[str, object] = {}
        for field_name in self.__class__.model_fields:
            if _SENSITIVE_PATTERN.search(field_name):
                result[field_name] = "<redacted>"
            else:
                result[field_name] = getattr(self, field_name)
        return result


@functools.lru_cache(maxsize=1)
def get_settings() -> Settings:
    """Return the process-wide cached Settings instance.

    Constructs the Settings on first call and caches it for subsequent calls.
    """
    return Settings()
