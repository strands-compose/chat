---
name: frontend-testing
description: Write, repair, and review tests for the React UI in ui/ — Playwright end-to-end journeys against a fake backend, plus Vitest unit tests for pure logic. Use whenever adding, fixing, or reviewing anything under ui/e2e/ or any ui/src/**/*.test.ts, or deciding what to test for a UI change. UI tests only; not the Python backend.
metadata:
  area: frontend
  stack: playwright,vitest,fast-check
---

# Frontend Testing

The testing doctrine for the web UI (`ui/`). It defines **what is worth
testing, what is not, and how**, so the suite stays small, fast, trustworthy,
and cheap to live with.

One sentence to internalise: **a UI test proves that a user can do a thing and
sees the right result — it never inspects how the code did it.** If a test can
break when nothing a user sees, does, or sends changed, it is a liability.

Read before writing any test:

1. This file — the law. Every rule is stated once, here.
2. `references/test-patterns.md` — the harness API and copy-paste shapes.
3. `references/coverage-map.md` — the journeys this app must keep covered.
4. The `frontend-development` skill when a test forces an app fix (e.g. a
   missing accessible name).
5. The harness itself, `ui/e2e/support/*.ts`, for exact signatures.

`references/sources.md` lists the public guidance behind each rule.

---

## Core Principles — NON-NEGOTIABLE

1. **Test user-visible behaviour.** Find elements the way a user or a screen
   reader does. Assert what is rendered, the URL, and what the app sent to the
   backend. Never CSS classes, DOM shape, component names, React state, or the
   Zustand store.
2. **Few, coherent journeys.** One e2e test = one starting state + one user
   path to an outcome, with assertions along the way. Mutually exclusive states
   (logged out, no agents, OIDC-only) are separate tests in the same spec. Each
   journey is covered once. Length is not a goal.
3. **Deterministic or deleted.** Backend faked at the network boundary, fixed
   clock where time shows, fixed locale/timezone, no sleeps, no order
   dependence. A test reported *flaky* fails CI and is fixed or removed.
4. **The network boundary is the only seam.** The UI's contract is our
   backend's HTTP + SSE. Fake that with real-shaped, typed data. Never replace
   app modules, the store, or `fetch` inside the page.
5. **Static checks are the floor.** `tsc` and Biome run before any test. On
   `e2e/`, Biome's Playwright rules and `noFloatingPromises` report a missing
   `await`.

The owner's decisions behind this shape: Playwright e2e is the main suite;
Vitest covers pure logic; no jsdom component tests; no pixel screenshots for
now (stable baselines need a pinned Docker image); no axe / WCAG
accessibility scans; Chromium only.

---

## The Shape — What to Test

| Layer | Tool | Where | Proves |
|-------|------|-------|--------|
| Static | `tsc -b`, Biome | all of `ui/` | types, hook rules, missing `await`, format |
| Unit | Vitest (Node) | `ui/src/**/name.test.ts`, next to the code | pure logic with many input cases |
| End-to-end | Playwright (Chromium) | `ui/e2e/<area>/*.spec.ts` | critical journeys through the real app |

- **E2E is the main suite.** It runs the real bundle in a real browser, so one
  journey exercises routing, providers, store, services, SSE parsing, and
  rendering together.
- **Unit tests take the combinatorics:** SSE chunk boundaries, every stream
  event type, formatters, limits, label bucketing. Push *combinatorial pure
  logic* down; do not add a unit test just because an e2e test caught an
  integration bug.
- **Prove a rule once,** at the lowest layer that can prove it.
- `references/coverage-map.md` is the inventory. Extend the matching spec
  instead of adding a near-duplicate.

---

## What We DO NOT Test

- **Styling and layout:** colours, contrast, classes, positions, animation.
- **Accessibility audits:** no axe / WCAG scans. The app still follows WCAG
  (see the `frontend-development` skill); it is reviewed, not tested.
- **Implementation details:** store fields, hook calls, props, render counts,
  internal DOM nesting.
- **Third-party behaviour:** Radix focus logic, ECharts drawing, markdown and
  highlighter output beyond "the key content is visible", TanStack internals.
- **Long copy verbatim.** Assert text only when the text *is* the behaviour (an
  error the user must read, a title they navigate by), matching its stable core
  (`/budget exceeded/i`).
- **Mount-time GET counts.** The dev server runs React StrictMode, which runs
  mount effects twice in development. Assert the outcome instead.
- **The fixtures themselves.** They are data; test the UI that renders them.
- **Anything that forces a test edit after a behaviour-preserving refactor.**
  If that happens, the test was wrong — fix or delete it.

---

## Locators

Interactive controls are found by **role + accessible name**. In order:

1. `getByRole(role, { name })` — the default for every button, link, textbox,
   heading, dialog, tab, menu item, region.
2. `getByLabel` — form fields.
3. `getByText` — non-interactive content (a message, a session title).
4. `getByAltText` — images.
5. `getByTestId` — only for an element with no user-facing identity; add the
   `data-testid` to the app with a comment saying why.

Rules:
- **No CSS or XPath**, no `getByTitle`, no `getByPlaceholder` for controls.
  `title` is a tooltip and placeholder is hint text; neither is a reliable
  accessible name.
- **Missing name = app bug.** If a control cannot be found by role + name, add
  an `aria-label` (icon buttons) or a real `<label>` in the app, following the
  `frontend-development` skill. Duplicated controls (two "Metric" toggles) are
  scoped through a named region or heading; add one if missing.
- **Scope, then chain:** `page.getByRole('region', { name: 'Chat history' })
  .getByRole('button', { name: 'Rename session' })`; pick a list item with
  `.filter({ hasText })` / `.filter({ has })`.
- **Answer text shows twice** — in the thread and in the workflow panel. Scope
  thread content to `getByRole('article', { name: 'Assistant said' })` (or
  `'You said'`) and panel content to `getByRole('region', { name: 'Workflow' })`.
- **No `.first()` / `.nth()`** unless order is the thing asserted. Strictness
  errors mean "scope better".
- Key handles listed in the coverage map are verified prerequisites. When one
  changes, update the spec and the map together.

---

## Assertions

- **Web-first only:** `await expect(locator).toBeVisible()`, `toHaveText`,
  `toContainText`, `toHaveCount`, `toHaveValue`, `toBeEnabled`, `toHaveURL`.
  They retry. `expect(await locator.isVisible()).toBe(true)` checks once and
  races the UI — forbidden.
- **Non-DOM conditions** (the request log, the clipboard) use
  `await expect.poll(() => …)`, never a sleep loop.
- **Requests the user caused** (send, rename, delete, save, load more,
  filters): take a baseline count, act, poll until exactly one new matching
  request exists, then assert its parsed body/query. Assert contract fields
  only (`prompt`, `agent_id`, presence of `session_id`, PATCH fields), never
  headers. Never destructure an unchecked request array.
- `expect.soft` is fine for several independent checks within one step.
- Never raise a timeout to make a test pass. Slow means a real performance bug
  or a missing mock.

---

## The Fake Backend

One stateful fake (`e2e/support/fake-backend.ts`) answers the whole backend
contract — `/auth/**`, `/api/v1/**` (incl. analytics) — and is attached to
every test by an auto fixture.

- **Fail-closed.** Vite's dev server proxies `/api/`, `/auth/` and `/admin`
  (except `/admin/dashboard`) to `127.0.0.1:8000`, where a developer may run a
  live backend with real data. The fixture routes every URL matching those
  prefixes before navigation. Anything the fake does not handle is **aborted,
  recorded, and fails the test at teardown** with the full list. Service
  workers are blocked, and the test servers proxy to a closed port
  (`API_PROXY_TARGET`), so the real backend is never reached.
- **Page-route overrides bypass the request log.** `backend.requests` sees only
  what reaches the fake; an override that fulfils a request records it itself.
- **Test-scoped state.** Each test gets a fresh fake built with
  `structuredClone`; no mutable state at module scope; ids are deterministic.
- **Small defaults.** One demo-derived user, one agent, no sessions, minimal
  capabilities, and a short reply (`streamTurn({ text: 'Done.' })`). Opt into
  more (sessions, the recorded multi-agent `DEMO_TURN`) only when that data is
  the behaviour under test.
- **Arrange through state, before `page.goto`.** The fake behaves like the
  server: a new chat mints a session, a finished turn is stored before the
  stream is sent, so the UI's refetches see consistent data.
- **Typed data only.** Defaults come from `src/services/demo-fixtures/`; extra
  rows come from the builders in `e2e/support/data.ts`. No untyped JSON.
- **One-off responses** use `page.route(url, handler, { times: 1 })` in the
  test. Exception: requests fired on mount (`/auth/me`, agents, sessions) run
  twice under StrictMode and the first result is discarded, so override those
  for the whole test. Page routes always outrank the fake's context routes. Inside an
  override, unmatched branches call `route.fallback()` — **never
  `route.continue()`**, which sends the request on to the real network.
- **Streams.** A fulfilled SSE body arrives in one piece. Full turns: set
  `backend.reply`. "While the agent works" states: `backend.holdReply()`
  returns a gate; assert the in-flight UI, then release it (or let the user
  stop). The fixture releases leftover gates at teardown. Token-by-token
  rendering and chunk boundaries are unit-tested.
- **Banned:** patching `fetch`/`EventSource` with `addInitScript`, importing
  app modules into the page, the demo-mode API swap as the e2e mock (it skips
  `api.ts` and its parser), and HAR recordings of a real server.

---

## Isolation & Determinism

- **Every test stands alone:** own browser context (Playwright default), own
  fake, own `page.goto`. No `serial` mode, no shared page.
- **Time:** when dates, "this month", or relative times show, call
  `page.clock.setFixedTime(...)` before `page.goto`. Use `page.clock.install()`
  + `runFor` when the app's own timers must run. Locale `en-US`
  and timezone `UTC` are fixed in the config.
- **Theme:** the config pins `colorScheme: 'light'`. Dark tests set
  `test.use({ colorScheme: 'dark' })`.
- **Viewport:** desktop by default. Mobile behaviour lives in one spec with an
  explicit narrow viewport.
- **Never** `page.waitForTimeout`, `waitForLoadState('networkidle')`, or
  `setTimeout` in a test. Wait for the state the user waits for.
- **Console guard:** every `console.error` and uncaught page error fails the
  test. A test that provokes one on purpose allows it locally with
  `test.use({ consoleErrors: { allow: [/^\[chatStore\] restoreSession failed:/] } })`
  — anchored patterns, each must match at least once, with a comment saying
  why. Chromium's "Failed to load resource" line is ignored only for backend
  URLs, because the fail-closed fake answers or reports every one of them.

---

## Unit Tests (Vitest)

- **Co-located:** `foo.ts` → `foo.test.ts` beside it. `npm run test`. Node
  environment by default; import `describe/it/expect` from `vitest`.
- **In scope:** pure functions and pure state machines — `streamChat` framing,
  `mapBackendEvent`, `store/streaming` handlers and scheduler,
  `workflow-selectors`, `live-activity`, `services/utils`, `toolInputPreview`,
  `bucketLabels`, `usage-points`. See the coverage map for the rule each one
  must prove.
- **Out of scope:** rendering React components, and chart option builders'
  styling.
- **DOM on import:** `api.ts` reads the `app-base` meta tag when imported, so
  its tests start with `// @vitest-environment jsdom`.
- **Stub only platform edges:** `vi.stubGlobal('fetch', …)` returning a real
  `Response` with a real `ReadableStream`. Never `vi.mock` our own modules; a
  unit that needs that is covered by e2e instead. A module's declared
  side-effect interface (e.g. `StreamingSideEffects`) may be a recording
  object — it is the boundary the module defines.
- **Timers:** `vi.useFakeTimers()` does not create browser-only APIs in Node.
  The scheduler uses `requestAnimationFrame`, so stub it (and
  `cancelAnimationFrame`) on top of fake timers. Restore globals and real
  timers in `afterEach`.
- **Property tests (fast-check)** where a rule holds for any input: the SSE
  parser yields the same events however bytes are split (including inside a
  multi-byte character); formatters never throw or return `NaN`. Assert the
  invariant, never a re-implementation.

---

## Folder Structure — MANDATED

```
ui/
├── playwright.config.ts      # main run: one Vite dev server on a loopback port, Chromium; ignores e2e/demo
├── playwright.demo.config.ts # demo smoke: e2e/demo against `vite preview` of the demo build
├── tsconfig.e2e.json         # e2e/ + config; `@/*` → src/*; referenced by tsconfig.json
├── e2e/
│   ├── support/              # the harness — changed on purpose only, reviewed like app code
│   │   ├── test.ts           # `test` + `expect`: backend fixture, console guard
│   │   ├── fake-backend.ts   # stateful, fail-closed fake of /auth and /api/v1
│   │   ├── sse.ts            # SSE bodies + stream event builders
│   │   └── data.ts           # typed builders: makeUser, makeSession, makeMessage, …
│   ├── auth/  chat/  profile/  admin/   # one spec per journey area
│   └── demo/                 # Pages demo smoke only (run by playwright.demo.config.ts)
└── src/**/name.test.ts       # unit tests beside the code
```

- **Specs import `test` and `expect` from `e2e/support/test`**, never from
  `@playwright/test`, or the fake and the guard do not run.
- **One spec per journey area**, not per component. No page-object classes;
  inline locators read better at this size.
- **Harness changes** are allowed only when a journey needs a capability the
  fake lacks; keep them minimal and typed.

---

## Conventions

- **Names state the behaviour:** `restoring a session from the sidebar shows
  its messages and usage`.
- **Arrange → Act → Assert.** Arrange = fake state (+ clock). Act = what the
  user does. Assert = what the user sees and what the app sent. Long journeys
  label phases with `test.step`.
- **DAMP over DRY.** The data a test depends on is visible in the test.
- **Tags:** the minimal "app still works" set is tagged `@smoke`.
- **Typed everything** with the app's own types from `@/types` and
  `@/services` (type-only imports). No `any`.

---

## Running & CI

```bash
cd ui
npm run lint          # biome check: format, imports, lint (Playwright rules on e2e/)
npm run format        # biome check --write: fix all of the above
npm run build         # tsc -b (app, node, e2e) && vite build
npm run test          # vitest run
npm run test:e2e      # playwright test — starts its own dev server
npm run test:demo     # build the Pages demo and smoke-test it
npx playwright test --ui           # local debugging
npx playwright test path --repeat-each=5   # prove a new spec is stable
```

- Playwright starts one Vite dev server on a fixed loopback port (`E2E_PORT`,
  default 5181) with `--strictPort` and `reuseExistingServer: false`, never on
  the developer's `:5173`.
- **Demo smoke:** `npm run test:demo` builds the GitHub Pages demo
  (`build:demo`) and runs `e2e/demo/` against those files with `vite preview`
  (`playwright.demo.config.ts`, port `E2E_DEMO_PORT`, default 5182). The Pages
  workflow runs it before upload, so a broken demo is never deployed. Keep it
  to "it loads" and "a question starts the workflow"; behaviour belongs in the
  main suite.
- CI (Linux, Chromium only): lint → build → unit → e2e, `workers: 1`,
  `retries: 2`, `trace: 'on-first-retry'`, `failOnFlakyTests: true`,
  `forbidOnly`, global timeout; the HTML report is uploaded on failure. Retries
  exist only to capture a trace. Debug from the trace.
- A skipped test needs a linked issue and a reason in the skip message.
- Done = all four commands pass locally and new specs pass `--repeat-each=5`.

---

## Adding or Repairing a Test — Checklist

1. **Name the journey or rule** in one sentence. If you cannot, don't write it.
2. **Find its row** in the coverage map; extend that spec.
3. **Pick the layer:** pure logic → unit; anything a user does → e2e.
4. **Read a sibling spec and the harness**, mirror their shape.
5. **Arrange through the fake;** override one response with `page.route(...,
   { times: 1 })`; fix the clock if dates show.
6. **Role + name locators, web-first assertions,** request checks by baseline.
7. **Broken after a refactor?** Behaviour unchanged → the test was
   over-specified; fix it. Behaviour changed → update the expectation.
8. **Run the gate** and `--repeat-each=5` for new specs.

---

## Anti-Patterns — Do NOT

- Sleep or wait on the network (`waitForTimeout`, `networkidle`, `setTimeout`).
- Check UI state without retrying (`expect(await x.isVisible())`).
- Locate by CSS, XPath, title, or placeholder; use `.nth()` for convenience.
- Assert store state, props, styling, or mount-time GET counts.
- Let any request reach the real backend; use `route.continue()` in an
  override; record HARs.
- Patch `fetch` in the page, or `vi.mock` our own modules.
- Share state between tests or use `serial` mode.
- Snapshot whole pages (DOM, ARIA, or pixels).
- Raise timeouts or retries to hide flakiness.
- Allow a console error without a reason.
- Add axe, WCAG scans, or any other automated accessibility audit.
- Import `test` from `@playwright/test` in a spec.
- Add features to make a test pass. A missing behaviour (e.g. no error shown
  on a failed save) is reported, not invented.
