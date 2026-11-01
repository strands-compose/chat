# Chapter 09 — Configuration Reference

Every setting the app reads, with its default and what happens when you get it wrong. Settings live in [`config.py`](../src/strands_compose_chat/config.py). The Gunicorn variables at the end belong to the Docker example, not to the app.

## How Settings Are Loaded

For each setting the app looks, in this order, at:

1. the process environment (ECS task definition, `docker run -e`, `export`)
2. a `.env` file in the **current working directory** (not next to the package)
3. the default in the tables below

Names are case-insensitive. Unknown names are ignored without a warning, so a typo such as `TRUSTED_HOST` does nothing. Settings are read once at startup. Change one, restart the process.

Lists are JSON arrays: `TRUSTED_HOSTS=["chat.example.com"]`. A bare value like `TRUSTED_HOSTS=chat.example.com` stops startup with `error parsing value for field`. Booleans take `true` / `false`.

> **Watch out:** a bad value never degrades quietly. Validation runs when the app module is imported, so the process exits with the error and no port opens. In Gunicorn this shows up as `Worker failed to boot`.

## Core

| Name | Default | Meaning and notes |
|------|---------|-------------------|
| `APP_ENV` | `dev` | `dev`, `test` or `prod`. Anything else is rejected. See [Production Checks](#production-checks) |
| `URL_PREFIX` | empty | Serve everything under a sub-path, e.g. `/ai/chat`. A leading `/` is added and trailing `/` removed. Also scopes the session cookie path |
| `CUSTOM_HEADER_TITLE` | none | Page title (browser tab and header) in place of the built-in one |
| `CHAT_SESSION_MAX_PAGE_SIZE` | `100` | Upper bound for the `limit` of the chat history list. Larger requests are clamped |

## Database

| Name | Default | Meaning and notes |
|------|---------|-------------------|
| `DATABASE_URL` | `sqlite+aiosqlite:///./strands-chat.sqlite` | Only `sqlite+aiosqlite://` and `postgresql+psycopg://` work. Any other scheme raises `ValueError` at import. The SQLite path is relative to the working directory. Postgres needs the `[postgres]` extra |

Details in [Chapter 10](Chapter_10.md).

## Sessions and Cookies

| Name | Default | Meaning and notes |
|------|---------|-------------------|
| `SESSION_SECRET_KEY` | none, **required** | Signs the session cookie and the admin login. See the rule below |
| `SESSION_TTL_SECONDS` | `43200` (12 h) | Cookie `max_age` |
| `SESSION_COOKIE_NAME` | `strands_chat_session` | Rename it when several apps share one domain |

The cookie is always `SameSite=lax`, and `Secure` whenever `APP_ENV` is not `dev`.

The key must be at least 32 bytes. If the value is valid standard base64 it is decoded first, and the *decoded* length counts. Otherwise the length of the text counts. So `openssl rand -hex 16` (32 characters, decodes to 24 bytes) is **rejected**, while `python -c "import secrets; print(secrets.token_urlsafe(32))"`, `openssl rand -base64 32` and `openssl rand -hex 32` all pass.

## Security

| Name | Default | Meaning and notes |
|------|---------|-------------------|
| `TRUSTED_HOSTS` | `["localhost","127.0.0.1"]` | Allowed `Host` headers. Anything else gets `400 Invalid host header`. `/health` and `/ready` are exempt. `*` is rejected in prod |
| `CORS_ALLOWED_ORIGINS` | `["http://localhost:5173"]` | Origins allowed to call the API from a browser, with credentials. You only need it when the UI is served from another origin. Set your real URL or `[]`. `*` is rejected in prod |
| `FRAME_ANCESTORS` | `["self"]` | Who may embed the app in an iframe. `["self"]` allows the same origin, `[]` or `["none"]` forbids all. Anything else fails validation. Admin pages always allow same-origin framing |

## Authentication

| Name | Default | Meaning and notes |
|------|---------|-------------------|
| `AUTH_LOCAL_SIGNIN_ENABLED` | `true` | `false` removes username/password sign-in. Needs at least one OIDC provider, or startup fails. It also forces registration off |
| `AUTH_REGISTRATION_ENABLED` | unset | Self sign-up. When unset: on without OIDC providers, off with them. An explicit value wins |
| `PASSWORD_MIN_LENGTH` | `12` | Applies to sign-up and to passwords set in the admin panel. The bootstrap password is not checked |
| `ARGON2_MEMORY_KIB` | `65536` | Memory per password hash (64 MiB). Each login in progress holds this much |
| `ARGON2_TIME_COST` | `3` | Argon2id iterations |
| `ARGON2_PARALLELISM` | `4` | Argon2id lanes |
| `OIDC_PROVIDERS` | `[]` | JSON array of provider ids, e.g. `["entra","okta"]`. Each id needs its own keys below |
| `OIDC_REDIRECT_URI` | inferred | Full callback URL, e.g. `https://chat.example.com/auth/callback`. When unset the app builds it from the request, which relies on the proxy headers. Set it explicitly behind a load balancer |

Lower the Argon2 costs and you weaken stored hashes. Raise them and logins use more memory and CPU. Existing hashes keep working because each hash carries its own parameters.

### OIDC Provider Keys

For an id `entra`, the app reads `OIDC_ENTRA_*` (the id is upper-cased). Missing required keys stop startup with a message that names the provider.

| Name | Default | Meaning and notes |
|------|---------|-------------------|
| `OIDC_<ID>_DISCOVERY_URL` | **required** | Absolute `http(s)` URL of `.well-known/openid-configuration` |
| `OIDC_<ID>_CLIENT_ID` | **required** | OAuth client id |
| `OIDC_<ID>_CLIENT_SECRET` | none | Leave unset for a public client. PKCE (S256) is always used |
| `OIDC_<ID>_SCOPES` | `openid email profile` | Space-separated. `openid` is always added |
| `OIDC_<ID>_USERNAME_CLAIM` | `preferred_username` | Claim used for the username of a new user. Falls back to `sub` when the claim is missing |
| `OIDC_<ID>_DISPLAY_NAME` | the id | Text on the sign-in button |
| `OIDC_<ID>_LOGOUT_URL` | none | Read but not used today. Logout only clears the app session ([Chapter 07](Chapter_07.md)) |

## Attachments

| Name | Default | Meaning and notes |
|------|---------|-------------------|
| `CHAT_MEDIA_MAX_FILE_BYTES` | `5242880` (5 MiB) | Largest single file. Must not exceed the total, or startup fails |
| `CHAT_MEDIA_MAX_TOTAL_BYTES` | `20971520` (20 MiB) | Combined size of all files in one message |
| `CHAT_MEDIA_MAX_BLOCK_COUNT` | `10` | Files per message |

The server publishes these limits on `GET /api/v1/media/capabilities`, and the web UI enforces them before it uploads. The backend itself does not re-check size or count. Anything beyond that is left to the agent that receives the payload, so a script calling the API directly is not stopped here.

## Logging

| Name | Default | Meaning and notes |
|------|---------|-------------------|
| `LOG_LEVEL` | `INFO` | Standard level names. An unknown name falls back to `INFO` |
| `LOG_FORMAT` | `console` | `json` or `console`. Use `json` in production so CloudWatch can parse fields |

## Admin Bootstrap

| Name | Default | Meaning and notes |
|------|---------|-------------------|
| `ADMIN_BOOTSTRAP_USERNAME` | none | Both must be set, or nothing happens |
| `ADMIN_BOOTSTRAP_PASSWORD` | none | At startup, if no superuser exists, one is created from these two |

Behaviour on later restarts is in [Chapter 13](Chapter_13.md#bootstrap-admin).

## Production Checks

`APP_ENV=prod` changes the following. Anything not listed behaves the same in every environment.

| Check | Effect |
|-------|--------|
| `*` in `CORS_ALLOWED_ORIGINS` | Startup fails |
| `*` in `TRUSTED_HOSTS` | Startup fails |
| `DATABASE_URL` starts with `sqlite` | Startup fails |
| Session cookie | `Secure` (any `APP_ENV` except `dev`). The browser drops it on plain HTTP, so sign-in appears to do nothing |
| Local agent URLs | The admin form requires `https://` ([Chapter 06](Chapter_06.md)) |

> **Watch out:** prod does not force you to change the defaults. If you leave `TRUSTED_HOSTS` alone, the app starts and then answers every real request with `400`.

## Gunicorn Variables

Read by [`gunicorn.conf.py`](../examples/02-docker/gunicorn.conf.py) in the Docker example, not by the app. Advice on values is in [Chapter 11](Chapter_11.md#gunicorn-settings).

| Name | Default | Meaning |
|------|---------|---------|
| `GUNICORN_BIND` | `0.0.0.0:8000` | Listen address |
| `WEB_CONCURRENCY` | `1` | Worker processes |
| `GUNICORN_MAX_REQUESTS` | `1000` | Recycle a worker after about this many requests. `0` disables |
| `GUNICORN_MAX_REQUESTS_JITTER` | `100` | Random extra requests so workers do not recycle together |
| `GUNICORN_TIMEOUT` | `120` | Seconds without a worker heartbeat before Gunicorn kills it |
| `GUNICORN_GRACEFUL_TIMEOUT` | `30` | Seconds a worker gets to finish after a stop or reload signal |
| `GUNICORN_KEEPALIVE` | `30` | Idle keep-alive seconds on client connections |
| `FORWARDED_ALLOW_IPS` | `*` | Proxies whose `X-Forwarded-*` headers are trusted |
| `GUNICORN_ACCESSLOG` | `-` (stdout) | Access log target |
| `GUNICORN_ERRORLOG` | `-` (stdout) | Error log target |

## Not App Settings

AWS credentials and region for calling AgentCore come from the standard AWS chain (task role on ECS, profile or environment variables elsewhere). The region of each agent is stored on the agent itself ([Chapter 06](Chapter_06.md)).

## Next

[Chapter 10 — Database](Chapter_10.md)
