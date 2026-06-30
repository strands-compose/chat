# Frontend Project Map

Concrete navigation aid for `ui/`. The exact file names will drift over time —
trust the **roles** and the "read first" pointers more than any single name.
When in doubt, open the folder's `index.ts` barrel to see its public surface.

## Layout

```
ui/
├── package.json            # scripts: dev, build, build:backend, lint, test, preview
├── vite.config.ts          # @ alias → ./src; multi-entry build; /api+/auth+/admin proxy to :8000
├── tsconfig.app.json       # strict; "@/*" → "./src/*"; verbatimModuleSyntax (type-only imports)
├── eslint.config.js
├── index.html              # main app entry  (#root)
├── login.html              # auth entry      (#auth-root)
├── admin/dashboard.html    # admin entry     (#admin-root)
└── src/
    ├── apps/               # entry points + composition roots (one folder per HTML entry)
    │   ├── chat/           # index.tsx → ChatApp.tsx (providers) → AppShell.tsx (frame)
    │   ├── auth/           # index.tsx → AuthApp.tsx
    │   └── admin/          # index.tsx → AdminApp.tsx
    ├── index.css           # global stylesheet + design tokens (single source of color/theme)
    ├── test-setup.ts       # vitest/jsdom setup
    ├── components/         # reusable primitives (dumb, domain-free) + the charts/ package
    ├── views/              # smart compositions (shell views + feature screens)
    ├── contexts/           # app-wide providers + consumer hooks
    ├── hooks/              # cross-cutting stateful hooks
    ├── store/              # Zustand global state + streaming/ orchestration
    ├── services/           # network modules (api.ts, adminApi.ts) + utils.ts (pure helpers)
    └── types/              # shared type defs (api, common/domain, analytics)
```

## Where to read first, by task

| Task | Read these first |
|------|------------------|
| New HTML entry / composition root | `apps/chat/` (`index.tsx`, `ChatApp.tsx`, `AppShell.tsx`), then `apps/auth/`, `apps/admin/` |
| New primitive | `components/Button/` (simplest), `components/index.ts` barrel |
| Primitive wrapping a headless lib | `components/Tooltip/`, `components/DropdownMenu/`, `components/Collapsible/`, `components/Tabs/` (Radix); `components/MultiSelect/` (Radix + TanStack Virtual) |
| Dialog / overlay primitive | `components/Dialog/` (base), `components/ConfirmDialog/`, `components/ErrorDialog/`, `components/DropOverlay/` |
| Charts (primitive package) | `components/charts/` — `echartsCore.ts` (tree-shaken runtime + React wrapper), `chartOptions.ts` (option builders), `bucketLabels.ts`, `index.ts` barrel |
| New app-shell piece | `views/Header.tsx`, `views/Sidebar.tsx`, `views/index.ts` |
| New feature screen | `views/chat/` (full feature), `views/workflow/`, `views/auth/`, `views/profile/`, `views/admin/` |
| Feature-local selectors/types | `views/workflow/workflow-selectors.ts`, `workflow-types.ts` |
| Feature-scoped provider + hook | `views/profile/contexts/ProfileContext.tsx` + `views/profile/hooks/useProfileContext.ts`; `views/admin/contexts/AdminFiltersContext.tsx` + `views/admin/hooks/useAdminFilters.ts` |
| Forms | `views/auth/AuthView.tsx`, `views/profile/AccountForm.tsx` (TanStack Form) |
| Data table | `views/admin/BudgetTable.tsx` (TanStack Table + `components/Pagination`) |
| New app-wide context/provider | `contexts/ThemeContext.tsx`, `contexts/AppConfigContext.tsx`, `contexts/AuthContext.tsx`, `contexts/index.ts` |
| Global store / inline selectors | `store/chatStore.ts`, `store/index.ts` |
| Streaming / SSE orchestration | `store/streaming/` (`index.ts` dispatcher, `handlers.ts`, `scheduler.ts`, `state.ts`, `types.ts`) |
| New API call | `services/api.ts` (chat/auth/sessions/media) or `services/adminApi.ts` (analytics); export via `services/index.ts` |
| Pure helper | `services/utils.ts` (e.g. `cn`, `formatCost`, `formatFileSize`, date helpers, `validateAttachments`) |
| New cross-cutting hook | `hooks/useAsyncData.ts`, `hooks/useFetchOnce.ts`, `hooks/useColorMode.ts`, `hooks/useAutoScroll.ts`, `hooks/index.ts` |
| Shared types | `types/api.ts`, `types/common.ts`, `types/analytics.ts`, `types/index.ts` |

## Conventions observed in the tree

- **Entry shape:** `apps/<name>/index.tsx` (mount + read meta) → `<Name>App.tsx`
  (provider stack). The chat entry adds `AppShell.tsx` for the structural frame.
  App roots use a default export + plain arrow (rendered once).
- **Primitive folder shape:** `Name/Name.tsx` + `Name/Name.module.css` +
  `Name/index.ts`. Some use `index.tsx` directly (e.g. `SplitLayout`). A
  primitive that adds no styles may omit the CSS file (e.g. `RenameSessionDialog`).
  `components/charts/` is a multi-file **primitive package** (no `.module.css`,
  exposes pure builders + a vendor wrapper through its barrel).
- **View entry naming:** feature folders expose an `XxxView.tsx` (or a `Dialog`)
  entry plus flat parts (e.g. `chat/ChatView.tsx`, `chat/MessageList.tsx`,
  `chat/Message.tsx`, `chat/ControlBar.tsx`). Lazily-loaded features re-export a
  `default` from their barrel and are loaded via `lazy(() => import('@/views/<feature>'))`.
- **Feature-scoped state:** `views/<feature>/contexts/` holds the provider
  component, `views/<feature>/hooks/` holds the context object + `use<Name>()`
  hook + value type (split so the provider file stays Fast-Refresh clean).
  Nested `components/` subfolders are **not** used — primitives go to `components/`.
- **Context file shape:** app-wide contexts in `contexts/` export the provider,
  the `use<Name>()` hook, and the value type; `contexts/index.ts` re-exports them.
- **Store selectors:** there is no central `selectors.ts`. Read state with inline
  selectors (`useChatStore(s => …)`, `useShallow` for object selects);
  view-specific derivations live next to the view (e.g. `workflow-selectors.ts`).
- **Barrels:** `components/index.ts`, `views/index.ts` (shell views),
  per-feature `index.ts`, `contexts/index.ts`, `store/index.ts`,
  `services/index.ts`, `hooks/index.ts`, `types/index.ts` are the public edges.
  Import across areas via `@/<area>`; import within a folder relatively.

## Provider wiring (per app root)

Each entry wires only the providers it needs, outermost → innermost:

- **chat** (`apps/chat/ChatApp.tsx`): `AppConfigProvider` → `ThemeProvider` →
  `AuthProvider` → `MediaCapabilitiesProvider` → `TooltipProvider` → `AppShell`.
  `AppShell` adds a `CollapseProvider` around the chat view.
- **auth** (`apps/auth/AuthApp.tsx`): `AppConfigProvider` → `ThemeProvider`.
- **admin** (`apps/admin/AdminApp.tsx`): `ThemeProvider` → `TooltipProvider`.

Add a new app-wide provider here, once, in the appropriate position.

## Design tokens

`src/index.css` is the single source of theme. Token namespaces:

- **Brand** `--aws-*` (e.g. `--aws-orange`, `--aws-header-bg`, the font stack).
- **Semantic** `--sc-*` for surfaces/text/borders
  (`--sc-bg-*`, `--sc-text-*`, `--sc-border-*`), defined for both light and the
  `[data-theme="dark"]` block. `useColorMode` sets `data-theme` on `<html>`.

Read tokens in CSS via `var(--token)`; in chart option builders via the
`cssVar()` helper in `components/charts`. Never hardcode a hex that should be a
token — add the token (light + dark) instead.

## Stack notes

- React 19, TypeScript ~5.9 (strict, `verbatimModuleSyntax` → type-only imports required).
- **Zustand** for global store; inline selectors + `useShallow`.
- **Radix** for headless primitives (tooltip, dropdown, collapsible, tabs,
  popover, alert-dialog).
- **TanStack** Form (auth + account forms), Table (budget table), Virtual
  (multi-select option list).
- **Markdown:** `react-markdown` + `remark-gfm`; code highlighting via
  `refractor` (Prism core) → `hast-util-to-html` injected as pre-escaped HTML.
  Raw HTML is intentionally **not** parsed (no `rehype-raw`) — re-enabling it
  without a sanitizer would be an XSS vector on agent/tool output.
- **Charts:** tree-shaken `echarts/core` + `echarts-for-react/lib/core`, wrapped
  in `components/charts`.
- **Icons:** `react-icons`.
- Vite dev server proxies `/api`, `/auth`, and `/admin` (except `/admin/dashboard`)
  to `http://127.0.0.1:8000`; `URL_PREFIX` from the root `.env` adjusts the paths.
- `npm run build:backend` builds into the Python package's `static/` dir.
