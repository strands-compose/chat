# Strands Compose Chat — UI

The web interface of Strands Compose Chat: React 19, TypeScript, Vite and Zustand. It ships as three pages — the chat (`index.html`), sign-in (`login.html`) and the admin dashboard (`admin/dashboard.html`) — and talks to the Python backend only through `src/services/`.

## Setup

Node.js 22+ and the backend checkout one level up.

```bash
npm ci
npx playwright install chromium   # only for the end-to-end tests
```

## Run

| You want | Run | Then open |
|----------|-----|-----------|
| The UI against a real backend | `uv run --directory .. scc serve` in one terminal, `npm run dev` in another | <http://localhost:5173> |
| The UI with no backend (recorded demo data) | `npm run dev -- --mode demo` | <http://localhost:5173> |

The dev server proxies `/api`, `/auth` and `/admin` (except `/admin/dashboard`) to `http://127.0.0.1:8000`, following `URL_PREFIX` from the root `.env`.

## Scripts

| Script | What it does |
|--------|--------------|
| `dev` | Dev server with hot reload |
| `build` | Type-check (`tsc -b`) and build into `dist/` |
| `build:backend` | Build into the Python package (`../src/strands_compose_chat/static`); same as `just build-ui` |
| `build:demo` | Static demo for GitHub Pages: no backend, recorded fixtures |
| `lint` | Biome: check format, import order and lint |
| `format` | Biome: fix format, import order and safe lint findings |
| `test` | Unit tests (Vitest) |
| `test:e2e` | End-to-end tests (Playwright) against a fake backend |
| `test:demo` | Build the demo and smoke-test it, as the Pages deploy does |
| `preview` | Serve `dist/`, e.g. after `build:demo` |

Before you push, run (bash, zsh, PowerShell 7+, cmd):

```bash
npm run lint && npm run build && npm test && npm run test:e2e && npm run test:demo
```

CI runs the same, building with `build:backend`.

## Layout

```
src/
├── apps/         one folder per page: mount point + provider stack
├── views/        screens and the app shell (chat, workflow, auth, profile, admin)
├── components/   reusable, app-agnostic primitives
├── store/        Zustand store; store/streaming/ turns stream events into the workflow panel
├── services/     API clients (api.ts, adminApi.ts), pure helpers, demo API + fixtures
├── contexts/  hooks/  types/
└── index.css     global styles and every theme token (light + dark)
e2e/              Playwright journeys; e2e/support/ holds the fake backend
```

## Tests

| Kind | Where | Notes |
|------|-------|-------|
| Unit | `src/**/name.test.ts`, next to the code | Pure logic only: stream parsing, selectors, formatters |
| End-to-end | `e2e/<area>/*.spec.ts` | Real app in Chromium. Every backend call is answered by the fake in `e2e/support/`; nothing reaches a live server |
| Demo smoke | `e2e/demo/` | Runs against the built Pages demo (`playwright.demo.config.ts`) |

Test servers use ports 5181 and 5182, so they run alongside `npm run dev`. Debug with `npx playwright test --ui`.

## Code style

- [Biome](https://biomejs.dev) formats and lints everything; the config is `biome.jsonc`. The git hook runs `npm run format` on commit.
- A deliberate exception is a `// biome-ignore lint/<group>/<rule>: <reason>` comment above the element.
- Accessibility follows WCAG 2.2 AA: icon buttons get an `aria-label`, colours come from the tokens in `src/index.css`.

The full rules — where code goes, naming, styling, what and how to test — live in the skills: [frontend-development](../.kiro/skills/frontend-development/SKILL.md) and [frontend-testing](../.kiro/skills/frontend-testing/SKILL.md).
