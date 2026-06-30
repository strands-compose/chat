---
name: backend-development
description: Build and extend the Python backend in src/strands_compose_chat. Use when adding or editing routes, services, models, schemas, dependencies, migrations, admin views, or app wiring. Backend only; not the React UI in ui/.
metadata:
  area: backend
  stack: python,fastapi,sqlalchemy-async,pydantic,structlog
---

# Backend Development

Rules for the **Python backend** in `src/strands_compose_chat/` (FastAPI +
async SQLAlchemy 2.0 + Pydantic v2 + structlog). They describe the mental model
and conventions, not the current set of files — features come and go, the rules
stay.

The backend talks to agents **only** through `strands-compose` /
`strands-compose-agentcore`. Before building anything that touches agents,
media formats, or client transport, check the installed SDK
(`.venv/lib/python*/site-packages/strands-compose*/`) and use what it provides
rather than re-implementing it. This skill is about the backend only — do not
touch the `ui/` frontend.

Before creating anything new, read a sibling that plays the same role and copy
its shape. Matching the existing pattern matters more than any rule below. See
`references/project-map.md` for where each role lives, the concrete stack, and
what to read first — load it whenever you are unsure where something goes.

---

## Core Principles — NON-NEGOTIABLE

1. **Strands-first** — if the SDK provides it, use it directly; never re-implement it.
2. **Composition over inheritance** — small, focused modules and functions that compose.
3. **Explicit over implicit** — no hidden globals, no auto-registration. Wire routers, middleware, and dependencies by hand in the app factory.
4. **Single responsibility** — each module does one thing; one ORM model per file, one admin view per file.
5. **Thin edges, fat middle** — HTTP handlers and ORM models stay thin; business logic lives in services.
6. **One-way dependencies** — outer layers (routes) depend on inner layers (services, models); inner layers never import outward (see Dependency Direction).
7. **Smallest reasonable change** — don't refactor unrelated code to land a feature.

---

## The Mental Model — Where Does It Go?

The tree under `src/strands_compose_chat/` is organised by **role**. A feature
is a **vertical slice** (a package like `agents/`, `auth/`, `sessions/`,
`media/`, `analytics/`); cross-cutting concerns are **flat modules** at the
package root. When adding code, decide what *role* it plays. Ask in order:

### Feature packages — `agents/`, `auth/`, `sessions/`, `media/`, `analytics/`
A self-contained slice the product thinks of as "a thing". Each owns its HTTP
surface and its logic, and is built from these roles:

- **`routes.py` — the HTTP edge.** An `APIRouter(prefix=…, tags=[…])` with thin
  handlers. A handler resolves dependencies, calls one or more service
  functions, maps the result to a response schema, and raises
  `ProblemDetailsException` for domain errors. **No business logic, no raw
  queries beyond a trivial delegation.** When a feature has two audiences, split
  the routers (e.g. `routes_admin.py` + `routes_me.py`).
- **`service.py` — the logic + data-access core.** Module-level **async
  functions** (not classes) whose first parameter is `db: AsyncSession`. They
  run queries, enforce invariants, and return ORM rows / scalars / plain tuples.
  **A service must not import from FastAPI** — no `Request`, no `Depends`, no
  routing. If you reach for `Request`, the logic belongs in the route or a
  dependency.
- **Focused helper modules** — one responsibility each (e.g. a client builder, a
  request parser, a stream/persistence layer, password hashing, an OIDC wrapper,
  a provisioning routine, content-block builders). Split these out the moment a
  `service.py` starts doing two jobs.

### `schemas/` — the wire contract (Pydantic v2)
Request/response DTOs, **one module per feature surface**, kept separate from
ORM models. `In` suffix for request bodies, `Out` for responses. Validation,
field constraints, and coercion live here. Schemas import only Pydantic and SDK
types — never ORM models, never service code.

### `db/` — persistence
- **`base.py`** — the async `engine`, the `AsyncSessionLocal` sessionmaker, the
  declarative `Base`, and shared column helpers (e.g. the UUID default). The
  single source of engine/session construction.
- **`models/`** — ORM models, **one class per file**, re-exported through the
  package `__init__.py` barrel (the one place `__all__` lives). A model knows
  only its table; it imports `Base` and references siblings under
  `TYPE_CHECKING` only.
- **`migrations/`** — Alembic (async `env.py`). Every schema change is a
  generated migration; the database is never altered by hand.

### App wiring + cross-cutting foundation (package root)
Flat modules every feature leans on. Touch these deliberately:

- **`app.py`** — the **composition root**: `create_app()` builds the FastAPI app,
  registers exception handlers, adds middleware (in reverse order — last added
  is outermost), includes routers under the URL prefix, mounts the admin panel
  and the frontend, and defines health/readiness. The only place that knows
  about all the pieces at once. Keep it assembling, not implementing.
- **`deps.py`** — dependency-injection providers and their `Annotated` type
  aliases (`DbSession`, `AppSettings`, …). The per-request DB session lives here
  (commit on success, rollback on error).
- **`config.py`** — typed `Settings` (pydantic-settings) + a cached
  `get_settings()`. The single source of configuration.
- **`errors.py`** — the RFC 9457 Problem Details model, `ProblemDetailsException`,
  and the handlers registered on the app.
- **`logging.py`** — structlog configuration and the PII redaction processor.
- **`middleware/`** — ASGI/Starlette middleware (one concern per file).
- **`bootstrap.py`**, **`frontend.py`** — first-run superuser seeding and serving
  the compiled SPA + Jinja shell.

### `admin/` — the operator console (sqladmin)
The **write surface** for registry/reference data (agents, model pricing, API
keys) and a read surface for operational tables. **One `ModelView` per file**,
all extending the shared `BaseModelView`; custom non-table pages (e.g. a
dashboard) are a sqladmin `BaseView` registered with `add_base_view`. `auth.py`
holds the admin authentication backend and the single `resolve_admin_user`
identity resolver. When data is admin-managed, expose it here rather than
building a public write API.

---

## Route vs Service — the key distinction

| | **route** (`routes.py`) | **service** (`service.py`) |
|---|---|---|
| Knows HTTP? | Yes — status codes, request/response, query params | No — pure async logic |
| Imports FastAPI? | Yes (`APIRouter`, `Depends`, `Request`) | **Never** |
| Touches the DB? | Only by calling a service | Yes — owns the queries |
| Returns | A response **schema** | ORM rows / scalars / tuples |
| Raises | `ProblemDetailsException` | `ValueError`/`KeyError`/… (route maps to HTTP) or `ProblemDetailsException` for clear HTTP semantics |
| Test of placement | "Is this about the wire?" → route | "Would this survive swapping FastAPI for a CLI?" → service |

When a handler grows conditionals and queries, the logic belongs in a service.
When a service reaches for `Request` or builds responses, that part belongs in
the route.

---

## Dependency Direction (read this twice)

Imports flow **one way**. Inner layers never reach outward.

```
admin/  ─┐
routes  ─┴─>  services  ─>  db.models  +  schemas
   │              │
   └─ deps ───────┘            (foundation, imported by anyone)
                          config · errors · logging · db.base
```

- `schemas` and `db.models` are the floor: they depend only on Pydantic / SDK
  types (schemas) and `db.base` (models).
- `services` sit above and own logic + queries; they import models, schemas,
  errors — **not FastAPI**.
- `routes` and `admin` sit on top: HTTP/UI edges that compose services + deps.
- `config`, `errors`, `logging`, `db.base` are foundation — imported freely,
  importing nothing application-specific.
- A service importing FastAPI, a model importing a service, or a schema
  importing a model is a design smell — stop and move the logic to its layer.

---

## Python Conventions

- **module docstring** at the top of every module, describing shortly
  the module's one responsibility.
- **Fully typed signatures** — every function/method (public *and* private)
  declares parameter and return types. Use `X | None`, `X | Y`, `list`, `dict`,
  `tuple` — never `Optional`, `Union`, `List`, `Dict`. Type SQLAlchemy builders
  too (`stmt: Select[...]`, `-> Select[...]`); don't leave query helpers untyped.
- **Google-style docstrings** on every public class, function, and method. The
  **class docstring goes on the class body** for ORM models and Pydantic schemas
  (it documents the table/contract); for behavioural classes prefer documenting
  `__init__`. Keep `Args:`/`Returns:`/`Raises:` accurate.
- **Early returns** — handle edge cases first; keep nesting ≤ 3 levels.
- **Raise specific exceptions** (`ValueError`, `KeyError`, `TypeError`,
  `RuntimeError`) with a contextual message. When re-raising inside an `except`,
  **chain with `raise … from exc`**.
- **Never swallow exceptions silently** and never use a bare `except:`. The one
  sanctioned broad catch is **best-effort side-effects** (e.g. persistence
  during a live stream): catch `Exception`, **log with `exc_info=True`**, mark it
  `# noqa: BLE001`, and document *why* in the docstring. The request/stream must
  survive; the failure must be visible in logs.
- **Return copies from properties** exposing mutable state: `return list(self._items)`.
- **Naming:** `PascalCase` classes · `snake_case` functions/methods ·
  `UPPER_SNAKE_CASE` constants · `_prefix` for private. No abbreviations in
  public APIs. Booleans read as `is_`/`has_`/`enable_`. Don't shadow builtins
  (`hash`, `id`, `type`) — use `digest`, `record_id`, `kind`.
- **Time is UTC and aware** — `datetime.now(UTC)` (import `UTC` from `datetime`).
  Never naive datetimes, never `utcnow()`.
- **Import order** stdlib → third-party → local (ruff-enforced, autofixed).
  `__all__` only in `__init__.py`. Avoid function-local imports; reserve them
  for breaking genuine import cycles and mark `# noqa: PLC0415`.

---

## Configuration, Logging & Errors

- **Config:** read everything through `get_settings()` (cached singleton) or the
  `AppSettings` dependency. **Never read `os.environ` directly**, never hardcode
  secrets or limits — add a typed `Settings` field with a default and a
  validator. Enforce production safety in `model_validator`s (reject `*` CORS,
  SQLite, etc. when `APP_ENV == "prod"`). Sensitive fields stay redacted in any
  repr / dump.
- **Logging:** one `structlog` logger per module
  (`logger = structlog.get_logger(__name__)` at module level). Pass context as
  **keyword fields** (`logger.info("…", user_id=user.id)`) or `%s` args — never
  f-strings in log calls. **Never `print()`.** Never log secrets, tokens,
  passwords, or full auth headers; the redactor is a safety net, not a licence.
- **Errors:** raise `ProblemDetailsException(status_code, detail, …)` for every
  client-facing error — never a bare `HTTPException` for domain failures and
  never a raw 500 with internals. Error responses must not leak stack traces,
  secrets, or submitted values; the unhandled-exception handler returns a
  generic 500 and logs the detail server-side.

---

## Data & Persistence

- **Models:** SQLAlchemy 2.0 typed mapping (`Mapped[...]` + `mapped_column`).
  String UUID primary keys default to the shared UUID helper; timestamps are
  `DateTime(timezone=True)` with `server`/`func.now()` defaults. Express
  invariants as DB constraints in `__table_args__` (`CheckConstraint`, `Index`,
  `UniqueConstraint`) — don't rely on application code alone. Define
  relationships with `back_populates` and an explicit `cascade`. Give models a
  `__repr__` (`# pragma: no cover`) and a `__str__` for admin labels.
- **Sessions:** the per-request session from the `DbSession` dependency commits
  on success and rolls back on error — let it. Inside a request, `flush()` to get
  generated values; **let the dependency commit**. Work that must outlive the
  request cycle (background tasks, streaming side-effects) opens its **own**
  short-lived `AsyncSessionLocal()` and commits/rolls back itself.
- **Queries:** always async, parameterised through the ORM (never string-built
  SQL). Eager-load relationships you will read (`selectinload`) to avoid
  lazy-load surprises under async. Keep dialect-specific branches (SQLite vs
  Postgres) behind a small helper.
- **Migrations:** any model change ships with a generated Alembic revision
  (`just revision "msg"`); review the autogenerated script before committing.
  `DATABASE_URL` comes from `Settings` at runtime, not from `alembic.ini`.

---

## Schemas & Validation

- Pydantic v2 `BaseModel`. Separate `…In` (request) and `…Out` (response) models;
  build `Out` from ORM rows with `model_validate(obj, from_attributes=True)`.
- Constrain at the edge: `Field(min_length=…, max_length=…, pattern=…)`,
  `field_validator`/`model_validator` for coercion and cross-field rules, reusable
  `Annotated` types for repeated shapes (e.g. a rounded-cost float).
- Schemas are the API contract — keep internal/infrastructure fields out of
  `Out` models. Don't return ORM objects directly from routes.

---

## Security (non-negotiable on the auth/identity paths)

- Every route declares an auth dependency (`CurrentUser`, `ApiKeyOrSessionUser`,
  or `AdminUser`). A new network-exposed endpoint without an auth gate is a bug —
  flag it.
- Passwords: Argon2id with parameters from `Settings`. Authentication is
  **constant-time and enumeration-safe** — run a dummy verify on the not-found
  path and return a single opaque 401 for every failure mode (unknown user,
  wrong password, disabled, expired).
- Store only hashes of credentials (passwords, API keys); reveal a raw secret
  once and never persist it. Validate redirect targets against open-redirect.
- No `eval`/`exec`, no `pickle` on untrusted data, no `subprocess(shell=True)`.

---

## Adding to the Project — Checklist

1. **Decide the role** (route? service? helper module? schema? model? dependency?
   admin view? app wiring?) and place the file in the matching feature package or
   root module. Unsure → `references/project-map.md`.
2. **Read a sibling first.** Open an existing file of the same role and mirror its
   structure, docstrings, and types before writing.
3. **Check direction:** would this import break the one-way flow? If a service
   needs `Request`, lift that part into the route or a dependency.
4. **Reuse before creating.** Search services, helpers, and `deps.py` first;
   extract a new helper only on the second use — don't pre-abstract.
5. **Model change → migration.** Update the model, then generate and review an
   Alembic revision.
6. **Wire once** in the app factory (router under the prefix, middleware in the
   right position); keep `create_app` thin.
7. **Verify** before declaring done — see Verify below.

---

## Verify

Run from the repository root:

```bash
uv run just check    # ruff format-check + ruff lint + ty type-check + bandit
uv run just test     # pytest with coverage gate
```

`just check` is the gate (format, lint, types, security); it must pass before a
change is done. Do not start the `uvicorn` server to verify — it's a
long-running process; rely on `check` and `test`.

---

## Things NOT to Do

- Don't re-implement what `strands-compose` / `strands-compose-agentcore`
  already provides — check the installed SDK first.
- Don't put business logic or raw queries in `routes.py`; don't import FastAPI
  in a `service.py`.
- Don't import a service from a model, or a model from a schema — respect the
  one-way flow.
- Don't read `os.environ` directly or hardcode secrets/limits — add a `Settings`
  field.
- Don't `print()` for diagnostics, and don't use f-strings inside log calls —
  use structlog with `%s`/kwargs.
- Don't raise bare `HTTPException` for domain errors or leak internals/secrets in
  responses — raise `ProblemDetailsException`.
- Don't swallow exceptions silently or use bare `except:`; the only broad catch
  is the logged, documented best-effort side-effect.
- Don't use `Optional[X]`/`Union`/`List`/`Dict`, leave a signature untyped, or
  shadow a builtin name.
- Don't change a model without a migration; don't hand-edit the database.
- Don't add an unauthenticated network endpoint, log a secret, or weaken the
  constant-time auth paths.
- Don't add `__all__` outside `__init__.py`.
- Don't add files or folders outside the scope of the task at hand.
- Don't leave broken or commented-out code; if you find something broken in the
  area you're working, fix it.
- Comments explain **what** and **why**, never **when** or **how it changed**.
