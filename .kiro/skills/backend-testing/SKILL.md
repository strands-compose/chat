---
name: backend-testing
description: Write, repair, and reason about tests for the Python backend in src/strands_compose_chat. Use whenever adding, fixing, or reviewing tests under tests/, or deciding what to test for a backend change. Backend tests only; not the React UI in ui/.
metadata:
  area: backend
  stack: pytest,pytest-asyncio,httpx,sqlalchemy-async,hypothesis
---

# Backend Testing

The testing doctrine for the Python backend (`src/strands_compose_chat/`).
It defines **what is worth testing, what is not, and how**, so the suite stays
small, fast, trustworthy, and cheap to live with. It describes principles and
shapes, not a file list — features come and go, the doctrine stays.

One sentence to internalise: **a test exists to catch a real regression in
behaviour, contract, or security — never to mirror the code or freeze its
wording.** If a test can break when nothing a user or caller depends on
changed, it is a liability, not an asset.

Read `references/test-patterns.md` for the concrete, copy-paste templates
(async client, factories, faking the agent SDK, the contract snapshot,
property tests). This file is the law; that file is the toolbox.

---

## Core Principles — NON-NEGOTIABLE

1. **Test behaviour and contracts, not implementation.** Assert on observable
   outcomes: returned values, persisted state, status codes, response *shape*,
   raised error *type*. Never on log lines, human-readable messages, prose,
   or internal call sequences.
2. **Confidence per line is the metric.** Optimise for the most regressions
   caught per test maintained — not coverage percentage, not test count. A
   smaller suite that people trust beats a large one they ignore.
3. **A green suite must mean "safe to ship"; a red test must mean "something
   real broke."** Anything that fails for innocuous reasons gets fixed or
   deleted, not tolerated.
4. **Determinism is mandatory.** No real network, no wall-clock dependence, no
   shared mutable state, no ordering assumptions, no `sleep`-based waits. Flaky
   is treated as broken.
5. **Mock only what you own.** Substitute *your own* abstractions; never reach
   into third-party internals (see Mocking Policy).
6. **Tests are read more than written — favour DAMP over DRY.** Each test reads
   top-to-bottom as a small story. Clarity beats cleverness and reuse.
7. **Smallest reasonable test.** One behaviour per test. Cover a rule once, at
   the lowest layer that can prove it.

---

## The Shape — What to Test (and how much)

We are an integration-weighted suite **with a fast unit core**. Weight effort
roughly in this order; let the code under test decide, not dogma.

- **Service logic + queries (the core, most tests).** Exercise
  `service.py`-style functions against a real database session. Assert state
  transitions and invariants: row created/updated, soft-delete hides rows,
  visibility/permission rules, pagination bounds, aggregation math, monotonic
  sequences, uniqueness. This is where bugs actually live and where tests are
  cheapest and most stable.
- **Pure computation + security invariants (unit, fast, no DB or HTTP).**
  Cost/pricing math, token accounting, content-block building, redirect
  validation, password hashing parameters, the constant-time / enumeration-safe
  auth path (same opaque failure for unknown user vs wrong password vs disabled).
  These are deterministic functions — test them directly; property-based where
  a rule generalises (see below).
- **Route contracts (thin, per endpoint).** Status code, response *shape*
  (keys/types, validated against the `Out` schema), and **the auth gate exists**
  (401/403 unauthenticated/unauthorized). Do not re-test business rules through
  HTTP that are already proven at the service layer, and do not assert on error
  prose.
- **The HTTP contract as a whole (one snapshot).** An OpenAPI snapshot test
  guards every path/method/status/request/response shape against accidental
  drift. Intentional changes are a reviewed diff. Requires `response_model` on
  every real route (audit this).
- **Persistence wiring (a few guards).** `migrate` runs clean on an empty DB;
  ORM metadata matches migrations (no drift); critical constraints exist.
- **Streaming / SSE (one happy path + one error path).** With the agent SDK
  faked at our seam: assert the event sequence and that best-effort persistence
  still records the turn. Not exhaustive event permutations.

---

## What We DO NOT Test

This list is as important as the one above. Do not write tests that assert on:

- **Log output, warning text, error/exception *messages*, or human copy.** Only
  the error *type* / *status* is contract.
- **Exact response *strings*, key casing, or field order** beyond what the
  declared schema guarantees.
- **Implementation details:** private helpers, internal call counts/order,
  which query the ORM emitted, intermediate variables.
- **Framework or library behaviour** — FastAPI routing, Pydantic validation,
  SQLAlchemy emitting SQL, alembic mechanics. Trust your dependencies.
- **Trivia:** `__repr__`, getters/setters, config defaults, constants,
  dataclass field assignment.
- **Anything that forces a test edit after a behaviour-preserving refactor.**
  If a refactor that kept behaviour identical breaks a test, the test was wrong.

When tempted to assert on a message or a wording, assert on the **type, status,
or state** behind it instead.

---

## Folder Structure — MANDATED

`tests/` mirrors the backend's vertical slices and flat foundations. Keep it
shallow and predictable; a reader finds the test for a slice without searching.

```
tests/
├── conftest.py            # root fixtures: app, async client, db session, settings override
├── factories.py           # test-data builders (functions, sensible defaults + overrides)
├── fakes/                 # hand-written fakes for owned seams (e.g. the agent client façade)
├── contract/
│   └── test_openapi_snapshot.py   # the HTTP-contract snapshot + committed baseline
├── db/
│   └── test_migrations.py         # upgrade-clean + metadata/migration drift
├── unit/                  # pure logic + security invariants — no DB, no HTTP
│   ├── test_pricing.py
│   ├── test_auth_invariants.py
│   └── ...
└── <slice>/               # one folder per feature slice: auth, agents, sessions, media, analytics
    ├── test_service.py    # logic + queries against a real session
    └── test_routes.py     # thin contract: status, shape, auth gate
```

Rules:
- **Mirror the slice, don't mirror the file.** `tests/agents/test_service.py`
  covers the slice's logic regardless of how many modules it spans. Do not
  create one test file per source file.
- New slice → new folder with the same `test_service.py` / `test_routes.py`
  pair. Pure-logic modules → a file under `unit/`.
- Shared setup lives in `conftest.py`; shared object construction lives in
  `factories.py`. Nothing else is shared.

---

## Mocking Policy — "Don't Mock What You Don't Own"

The backend's only true external dependencies are the **agent SDK
(`strands-compose` / `strands-compose-agentcore`)** and **OIDC provider HTTP**.

- **Never mock SDK or HTTP internals directly.** Mock at the thin abstraction
  *we* own — the per-invocation client builder / agent client façade and the
  OIDC wrapper. Substitute a hand-written **fake** (in `tests/fakes/`) that
  implements our interface and yields canned `StreamEvent`s / tokens / claims.
- **Prefer fakes over `Mock`.** A fake is a real object with a working
  implementation; it survives refactors and reads clearly. Reserve
  `unittest.mock` for forcing hard-to-produce conditions (timeouts, network
  errors), and when you must, use `spec_set=` so typos and API drift fail loudly.
- **Never mock your own services or the database.** Use the real service and a
  real (test) DB session. Mocking what you're testing tests nothing.
- If a third-party object is hard to fake, that is a signal our façade around it
  is too thin or missing — fix the seam, don't bury the SDK in test boilerplate.

---

## Database Strategy — Parity Where It Counts

- **Default to a real DB session, not mocks.** Service tests run against an
  actual database with migrations applied.
- **Two engines, on purpose.** Fast local loop and most tests run on
  **SQLite**; **dialect-sensitive code MUST also run on PostgreSQL in CI**
  (Docker/Testcontainers). SQLite silently diverges on JSON columns, native
  types, case-sensitivity, and transaction isolation — the analytics
  aggregation buckets, any `func.now()`/server-default behaviour, and anything
  behind a SQLite-vs-Postgres helper branch are Postgres-required.
- **Isolation per test.** Each test gets a clean state via transaction rollback
  (or a fresh schema). Tests never depend on rows from another test or on
  execution order.
- **Migrations are real.** Schema is created by running migrations in at least
  the migration-guard test, so a broken migration fails the suite.

---

## Test Data — Builders, Not Fixture Sprawl

- **Use builder functions in `factories.py`** that construct domain/ORM objects
  with sensible defaults and accept overrides for only the fields the test cares
  about: `make_user(is_superuser=True)`, `make_agent(kind="local")`. This keeps
  each test's *relevant* inputs visible and the irrelevant ones out of sight.
- **Avoid the giant `conftest` fixture web** and ever-growing "object mother"
  god-helpers. A fixture is justified only for genuine shared *infrastructure*
  (app, client, db session), not for business objects.
- **DAMP, not DRY, inside a test.** Inline the setup that tells the story.
  Don't hide the arrange step behind loops, multi-level helpers, or `setUp`
  magic the reader must chase. Light duplication across tests is fine and
  expected.

---

## Conventions

- **Naming states the behaviour and the expectation:**
  `test_archiving_session_hides_it_from_default_listing`, not `test_archive`.
  The name should read as a sentence and not just echo the method under test.
- **Arrange-Act-Assert**, visibly separated. One logical behaviour per test;
  one reason to fail.
- **Failures must be actionable.** Use precise assertions and let the value show
  in the diff; add a short message only when the assertion alone is ambiguous.
- **Async:** `pytest-asyncio` (auto mode is configured). Use the async client
  and async session; never block the loop.
- **Parametrize** equivalent cases instead of copy-pasting near-identical tests;
  keep each case independently named/identifiable.
- Typed signatures, semantics and syntax consistent with the rest of the codebase.
---

## Property-Based Testing (Hypothesis) — Targeted

Use it where a rule must hold across a domain of inputs, not for example-by-example
checks. Strong fits here: cost/pricing rounding never goes negative and is
monotonic in tokens; pagination math stays within bounds for any page/size;
content-block building round-trips/total-size invariants; token accounting sums
correctly. Keep generators tight and assert the **invariant**, not a recomputation
of the implementation. It complements unit tests; it does not replace contract or
service tests.

---

## Coverage & Mutation — Signal, Not Theatre

- **Coverage is a floor and a gap-finder, never a goal.** A high number with
  weak assertions is false confidence; tests that execute lines without
  asserting are forbidden. Do not chase 100%, and do not add tests purely to
  move the number.
- **Assertion quality is the real signal.** For the modules that matter most
  (pricing/billing, auth, analytics aggregation), validate the suite with
  **mutation testing** periodically — if a deliberately broken operator still
  passes, the test is missing an assertion. Treat surviving mutants, not
  uncovered lines, as the to-do list.

---

## CI & Fast Feedback

- The fast tier (unit + SQLite service/route/contract tests) runs on every
  change and must stay quick enough to run constantly.
- A CI job runs the **PostgreSQL** tier for dialect-sensitive tests and the
  migration guard.
- The gate is `uv run just check` (format, lint, types, security) **plus** the
  test run. A change is not done until both pass. Never start the long-running
  `uvicorn` server to verify — drive the app in-process via the async client.

---

## Adding or Repairing a Test — Checklist

1. **Name the behaviour** you're protecting in one sentence. If you can't, you
   probably shouldn't write the test.
2. **Pick the lowest layer** that can prove it: pure logic → `unit/`; logic +
   data → slice `test_service.py`; wire/contract → slice `test_routes.py` or the
   snapshot.
3. **Read a sibling test first** and mirror its shape, naming, and factories.
4. **Use a real DB and real services; fake only owned external seams.**
5. **Assert on state/type/status/shape — never on text.**
6. **When a test breaks after a refactor:** first ask *did behaviour change?*
   If no, the test was over-specified — fix the test (or delete it), don't
   contort the code. If yes, the test did its job — update the expectation.
7. **Run the gate** (`just check` + tests) before declaring done.

---

## Anti-Patterns — Do NOT

- Assert on log messages, error/exception text, or response wording.
- Mock the agent SDK, `httpx`, or the database directly; mock your own seams.
- Mock the very service/function under test.
- Build one test file per source file, or re-test service rules through HTTP.
- Add a test that only raises the coverage number, or a test with no assertion.
- Hide a test's arrange step behind clever helpers, loops, or `setUp` magic.
- Use `sleep`, real clocks, real network, random unseeded data, or cross-test
  shared state.
- Pin behaviour to SQLite when the code ships on Postgres in production.
- Leave a flaky test "for later" — quarantine and fix, or delete.
- Snapshot-test anything other than the deliberate, reviewed API contract.
