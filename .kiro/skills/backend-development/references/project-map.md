# Backend Project Map

Concrete navigation aid for `src/strands_compose_chat/`. The exact file names
will drift over time — trust the **roles** and the "read first" pointers more
than any single name. When in doubt, open a feature's `routes.py` + `service.py`
pair to see how a slice is wired.

## Layout

```
src/strands_compose_chat/
├── app.py            # composition root: create_app() — handlers, middleware, routers, admin, frontend, lifespan
├── deps.py           # DI providers + Annotated aliases (DbSession, AppSettings, OidcRegistry); per-request session
├── config.py         # pydantic-settings Settings + cached get_settings(); prod-safety validators; secret redaction
├── errors.py         # RFC 9457 Problem Details: ProblemDetailsException + registered handlers
├── logging.py        # structlog configuration + PII redaction processor
├── bootstrap.py      # first-run superuser seeding (lifespan)
├── frontend.py       # serve compiled SPA (static + Jinja shell) with cache headers; auth-gated pages
├── db/
│   ├── base.py       # async engine, AsyncSessionLocal, declarative Base, UUID default helper
│   ├── models/       # one ORM class per file; __init__.py barrel re-exports (the one __all__)
│   └── migrations/   # Alembic async env.py + versions/ (DATABASE_URL injected from Settings at runtime)
├── schemas/          # Pydantic v2 DTOs, one module per feature surface (…In / …Out)
├── middleware/       # ASGI/Starlette middleware, one concern per file (e.g. security headers)
├── admin/            # sqladmin: auth.py (backend + resolve_admin_user) + views/ (one ModelView per file)
├── agents/           # FEATURE: registry read + visibility, per-invocation client, SSE invocation + persistence
├── auth/             # FEATURE: local login, OIDC, API keys, sessions, JIT provisioning, current-user deps
├── sessions/         # FEATURE: chat-session CRUD + message history
├── media/            # FEATURE: attachment capabilities + Strands content-block building
├── analytics/        # FEATURE: usage aggregation (admin + per-user); split routers; local schemas.py
├── static/           # compiled frontend (populated by `just build-ui`; absent in editable installs)
└── templates/        # server-rendered Jinja shells (app.html, login.html)
```

## Where to read first, by task

| Task | Read these first |
|------|------------------|
| New feature slice (router + logic) | `sessions/routes.py` + `sessions/service.py` (cleanest CRUD pair) |
| New read endpoint with visibility rules | `agents/routes.py` + `agents/service.py` |
| Streaming / SSE endpoint | `agents/invocation.py` (route), `agents/streaming.py` (event loop + best-effort persistence), `agents/client.py` |
| Parsing JSON + multipart requests | `agents/payload.py`, `media/blocks.py` |
| New request/response schema | `schemas/sessions.py`, `schemas/auth.py`; analytics' co-located `analytics/schemas.py` |
| New ORM model | `db/models/chat_session.py` (relationships + constraints), `db/models/user.py`; then the `db/models/__init__.py` barrel |
| Schema/table change → migration | `db/migrations/env.py`, then `just revision "msg"` |
| New dependency / auth gate | `deps.py`, `auth/current_user.py` (CurrentUser / ApiKeyOrSessionUser / AdminUser) |
| Auth flows (login, OIDC, API keys) | `auth/routes.py`, `auth/service.py`, `auth/oidc.py`, `auth/api_key.py`, `auth/passwords.py`, `auth/jit.py` |
| New config knob | `config.py` (add a typed field + validator) |
| New admin screen | `admin/views/agent.py` (forms + soft-delete), `admin/views/base.py`, `admin/views/__init__.py` barrel |
| Custom admin page (non-table) | `admin/views/dashboard.py` (`BaseView` + `add_base_view` in `app.py`) |
| Admin auth / identity | `admin/auth.py` |
| New error shape / handler | `errors.py` |
| Cross-cutting middleware | `middleware/security_headers.py` |
| App assembly / router registration | `app.py` |
| Aggregation / reporting queries | `analytics/service.py` (dialect-portable buckets, top-N folding) |

## Conventions observed in the tree

- **Feature shape:** `routes.py` (thin HTTP) + `service.py` (async functions,
  `db` first arg, no FastAPI) + focused helpers. Two audiences → split routers
  (`analytics/routes_admin.py` + `routes_me.py`).
- **Routers:** `router = APIRouter(prefix="/x", tags=["x"])`; handlers declare an
  auth dependency, a `response_model`, delegate to a service, and raise
  `ProblemDetailsException`. Section-separator banner comments (`# ---`) group
  long route/service files.
- **Services return ORM rows or scalars/tuples;** routes convert to schemas with
  `Model.model_validate(obj, from_attributes=True)`.
- **Models:** `String(36)` UUID PK (`default=_new_uuid`), `DateTime(timezone=True)`
  with `func.now()`, constraints in `__table_args__`, `relationship(...,
  back_populates=..., cascade=...)`, sibling imports under `TYPE_CHECKING`,
  `__repr__` (`# pragma: no cover`) on every model and a `__str__` wherever the
  admin needs a human-readable label (join-table models often have only `__repr__`).
- **Schemas:** centralized under `schemas/`, one module per surface, `…In`/`…Out`
  split. (Analytics keeps its own `schemas.py` next to its service.)
- **DI aliases:** `deps.py` exposes `DbSession`, `AppSettings`, `OidcRegistry`;
  `auth/current_user.py` exposes `CurrentUser`, `ApiKeyOrSessionUser`, `AdminUser`.
- **Admin:** one `ModelView` per file extending `BaseModelView`, registered in
  `app.py` via `admin.add_view(...)`; custom non-table pages are a sqladmin
  `BaseView` (e.g. `DashboardView`) registered via `admin.add_base_view(...)`.
  Registry writes (agents, pricing, keys) live here, not in a public API;
  destructive registry edits use soft-delete.
- **Barrels:** `db/models/__init__.py` and `admin/views/__init__.py` carry the
  `__all__`; import models/views through them.

## DB schema at a glance

Ten tables, async SQLAlchemy. Core entities and links:

- **users** — local or OIDC-provisioned identities (`auth_provider`,
  `external_subject`, `password_hash | None`, `budget`, `is_superuser`).
- **groups** + join tables **user_groups**, **agent_groups** — coarse-grained
  agent visibility (a user sees an agent only via shared group membership).
- **agents** — registry rows; `agent_kind` ∈ {`agentcore_runtime`, `local`} with
  a CHECK constraint pairing kind to its required columns.
- **chat_sessions** — per-user conversation, locked to one `agent_id`; stores the
  captured `manifest`; soft-archived via `is_archived`.
- **chat_messages** — `user`/`assistant` rows, monotonic `seq` per session,
  optional `attachments` JSON, `is_success` for error bubbles.
- **token_usage** — per-invocation token + cost record (`user_id` denormalised
  for billing); **model_pricing** — admin-managed per-model rates.

## App wiring (composition root)

`create_app()` in `app.py`, in order: register exception handlers → add
middleware (reverse order: SessionMiddleware, security headers, TrustedHost,
CORS, GZip) → include feature routers under `{URL_PREFIX}/api/v1` (auth router
under the bare prefix) → mount the sqladmin panel and register each view → define
`/health` + `/ready` → mount the frontend. Startup work (logging config, OIDC
registry validation, superuser bootstrap) runs in the `lifespan` context.

Add a new router, middleware, or admin view **here**, once, in the right
position.

## Stack notes

- **Python ≥ 3.11** (ruff targets 3.13). **FastAPI** + **Starlette** middleware;
  **uvicorn** with `--proxy-headers` behind a proxy.
- **SQLAlchemy 2.0 async** (`sqlalchemy[asyncio]`), `aiosqlite` for dev, `psycopg`
  (the `[postgres]` extra) for Postgres in prod. **Alembic** for migrations.
- **Pydantic v2** + **pydantic-settings** for schemas and config.
- **structlog** for logging (JSON in prod, console in dev) with PII redaction.
- **sqladmin** + **WTForms** for the admin panel; **authlib** for OIDC;
  **argon2-cffi** for password hashing; **itsdangerous** via Starlette
  `SessionMiddleware` for signed session cookies.
- **strands-compose** / **strands-compose-agentcore** — agent invocation,
  streaming `StreamEvent`s, media format registry, and content-block builders.
  The single source of truth for anything agent- or media-format-related.
- **Tooling:** `ruff` (lint + format, line length 100, Google docstrings), `ty`
  (type check), `bandit` (security), `pytest` + `pytest-asyncio` (+ coverage).
  Orchestrated through `just` (`tasks/*.just`); run via `uv run just …`.
- **Packaging:** hatchling builds `src/strands_compose_chat`, bundling
  `static/**` when present. Container build is multi-stage (Node UI → uv deps →
  slim non-root runtime).
