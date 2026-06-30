---
name: frontend-development
description: Build and extend the web UI in the ui/ directory. Use when adding or editing components, views, contexts, hooks, store, or services in ui/src. Frontend only; not the Python backend.
metadata:
  area: frontend
  stack: react,typescript,vite,zustand
---

# Frontend Development

Rules for the **web UI** in `ui/` (React 19 + TypeScript + Vite + Zustand). They
describe the mental model and conventions, not the current set of files —
components, views, and features come and go, the rules stay.

The UI talks to the backend **only** through the service layer (`services/`).
Never reason about backend internals here; treat the network boundary as a
contract. This skill is about `ui/` only — do not touch the Python backend.

Before creating anything new, read a sibling that plays the same role and copy
its shape. Matching the existing pattern matters more than any rule below.
See `references/project-map.md` for where each role lives, the concrete stack,
and what to read first — load it whenever you are unsure where something goes.

---

## Core Principles — NON-NEGOTIABLE

1. **Composition over inheritance** — build big things out of small, focused pieces.
2. **Explicit over implicit** — no hidden globals, no auto-registration. Pass props, return values, wire things up by hand.
3. **Single responsibility** — each file/component/hook does one thing.
4. **Dumb primitives, smart views** — reusable building blocks know nothing about the app; views know the app and assemble primitives.
5. **One-way dependencies** — inner layers never import outward (see Dependency Direction).
6. **Smallest reasonable change** — don't refactor unrelated code to land a feature.

---

## The Mental Model — Where Does It Go?

The tree under `ui/src/` is organised by **role**, not by file type. When adding
code, decide what *role* it plays and place it accordingly. Ask in order:

### `apps/` — entry points + composition roots
The UI ships as **multiple independent entries** (e.g. the main app, a sign-in
screen, an admin panel), each mounted into its own HTML file. Every entry lives
in `apps/<name>/` and has two parts:

- **`index.tsx`** — the React entry: finds its root DOM node, reads any
  backend-injected config, and renders the app root. No app logic.
- **`<Name>App.tsx`** — the **composition root**: wires the provider stack and
  renders the shell/top view. The only place that knows about all the pieces at
  once. Keep it thin — it wires, it doesn't implement.

A larger entry may add a structural **`AppShell`** (the frame: top bar, side nav,
panels) that the App root renders inside its providers.

- **Rule:** providers are wired **once**, here, in the correct nesting order.
  Don't re-provide app-wide context deeper in the tree.
- App roots and entries are the **one place** where a default export and a plain
  arrow component (no `memo`) are fine — they render once.

### `components/` — reusable primitives
Dumb, presentational building blocks: buttons, inputs, menus, tooltips, badges,
layout wrappers, dialogs, markdown renderers — anything visual and generic.

- **Rule:** a primitive MUST NOT import from `apps/`, `views/`, `store/`, the
  network modules in `services/`, or `contexts/`.
- It receives everything via props and communicates out via callbacks.
- If you can describe it without mentioning the app's domain, it's a primitive.
- Prefer wrapping a headless library primitive (e.g. Radix) over hand-rolling
  interaction, focus, and accessibility logic.
- It MAY use the **pure helpers** in `services/` (e.g. the `cn` class joiner,
  formatters) and `types/` — those carry no domain or network knowledge.
- **Shape:** each primitive is a folder `Name/` with `Name.tsx`,
  `Name.module.css`, and an `index.ts`. A primitive that needs no styles of its
  own may omit the CSS file.
- **Primitive packages:** a primitive may instead be a small *package* of related
  modules (e.g. a charting layer = a vendor wrapper + pure option builders +
  label formatters) behind one `index.ts`. Still domain-free; internal modules
  stay package-private. Use this only when one `.tsx` genuinely isn't the unit.
- The folder-level `components/index.ts` barrel re-exports the public primitives.

### `views/` — smart compositions
Everything that knows the app's domain and is wired to state, services, and
contexts. Two kinds live here:

- **App-shell views** at the `views/` root (top bar, side nav, structural bars)
  — the frame that arranges feature screens.
- **Feature views** in subfolders `views/<feature>/` — a self-contained slice a
  user thinks of as "a thing" (a screen, a panel, a workflow).

Rules for views:
- A feature folder is **flat by default**: its entry component, its parts, and
  any feature-only selectors/types live directly in the folder.
- **Feature-scoped state may live in nested `contexts/` and `hooks/`
  subfolders** when a feature owns its own provider + consumer hook (state that
  only that feature reads, e.g. a dashboard's filter state or a dialog's tab
  state). Do **not** add a nested `components/` subfolder — reusable primitives
  belong in the global `components/`; if a feature grows visually, split it into
  sub-features instead.
- Views MAY import from `components/`, `store/`, `services/`, `hooks/`,
  `contexts/`, `types/`. **Feature views SHOULD NOT import other feature views.**
  If two features need the same thing, it isn't feature-specific — promote it
  (shared primitive → `components/`, shared pure logic → `services/`, shared hook
  → `hooks/`).
- **App-shell views MAY compose feature views** (the shell mounts/launches
  features — e.g. a header opening a profile panel). That is the shell doing its
  job, not a cross-feature dependency.
- A part stays in its feature even if it looks generic, as long as it carries
  domain knowledge (specific data shapes, labels, formatting). Promote to a
  primitive only when it's used by 2+ features AND is domain-free.

### `contexts/` — shared cross-tree state (providers + hooks)
React contexts for state that many parts read but that isn't global store data:
theme, app config, auth, capability probes, local UI scopes. Each context
exposes the context object, its `use<Name>()` consumer hook, and its
`<Name>Provider`. The `contexts/index.ts` barrel re-exports providers and hooks.
App-wide providers are wired **once** in the relevant App root (`apps/<name>/`).

- **Rule:** shared cross-tree state goes through a context provided once — never
  by calling the same stateful hook in multiple components (that creates
  independent, desynced copies).
- **Splitting for Fast Refresh:** a provider file that is a component should
  export *only* the provider. Put the context object + `use<Name>()` hook + value
  type in a sibling non-component module so the component file stays
  Refresh-clean. (Feature-scoped contexts follow the same split:
  `contexts/XxxContext.tsx` = provider, `hooks/useXxx.ts` = context + hook + type.)

### `store/` — global, mutable application state
Reactive runtime state shared across an app (Zustand), plus the
streaming/orchestration logic that drives it. Read it with **inline selectors**
at the call site (`useStore(s => s.x)`, `useShallow` for object selects). Complex,
view-specific derivations live in a **selector module next to the view that uses
them**, not in the store.

- **Rule:** do NOT put static config or derived-once values here. Static config
  lives in a context (provided once); purely-local UI state lives in the
  component (or a feature-scoped context).
- Mutable orchestration state that must change *outside* React's update cycle
  (abort controllers, buffers flushed on a frame timer) may live in module-local
  variables alongside the store, by design — keep it documented.

### `services/` — the outside world + pure helpers
- **Network modules** (e.g. `api.ts`, and one per distinct backend surface such
  as `adminApi.ts`) are the only code that knows wire formats and endpoints
  (HTTP, streaming, request/response mapping). Components and views call these;
  they never call `fetch` directly. When you add a second network module, mirror
  the first: same fetch wrapper, same error-extraction, same timeout policy.
- **Pure helpers** (`utils.ts`) hold framework-agnostic, dependency-light
  functions: no React, no network, minimal-to-no domain (e.g. the `cn`
  class-name joiner, formatters, small validators). These are the only part of
  `services/` a primitive may import.

### `hooks/` — reusable stateful logic
Cross-cutting React hooks used by more than one view (data fetching, scroll,
drag, color mode, …). Feature-specific hooks stay inside their feature folder.

- **Rule:** data fetching goes through a hook that calls a service module — never
  `fetch` in a component. Reuse the shared async-data/fetch-once hooks rather
  than re-implementing loading/error/race handling per view.

### `types/` — shared type definitions
Types used across multiple modules. A type used by only one file stays in that
file. The `types/index.ts` barrel is the public surface.

---

## Component vs View — the key distinction

| | **component** (`components/`) | **view** (`views/`) |
|---|---|---|
| Knows the domain? | No — generic, reusable | Yes — labels, data shapes, workflows |
| Reads app state? | No — props in, callbacks out | Yes — store, services, contexts |
| Reused across the app? | Designed to be | Usually one place |
| Can import store/network/contexts? | **No** | Yes |
| Test of placement | "Could this live in any React app?" → component | "Does removing the app break its meaning?" → view |

When a piece carries domain knowledge, it's a view part — even if it looks
generic. Promote to a primitive only once it's used by 2+ features AND is
domain-free.

---

## Dependency Direction (read this twice)

Imports flow **one way**. Inner layers never reach outward.

```
apps/  →  views  →  components  →  services (pure helpers) + types
              ↓
   store / services (network) / hooks / contexts
```

- `components` is the floor: it depends only on pure helpers and `types`.
- `views` sit above and compose primitives + state + contexts.
- `apps` sit on top and wire everything (providers + shell).
- A primitive importing a view/store/context, or a feature view importing another
  feature view, is a design smell — stop and promote the shared piece instead.

---

## Component Conventions

- **Arrow-function components, memoized at the export site.** Pattern:
  ```tsx
  const CompComponent = (props: CompProps): ReactElement => { /* ... */ };
  export const Comp = memo(CompComponent);
  ```
  Keep the internal name as `XxxComponent`. Two narrow exceptions:
  - **App roots / entries** (`apps/`) may use a plain arrow + default export.
  - **Generic components** may use a `function` declaration when the `<T>` type
    parameter would be ambiguous as an arrow in `.tsx`
    (`function ListComponent<T>(props: ListProps<T>): ReactElement`). Still
    memoize at the export site.
- **Compose the return from small named render helpers.** Do not build one deep
  JSX tree full of inline `? :` and `&&`. Extract `renderHeader`, `renderItem`,
  `renderEmpty`, etc., each returning `ReactElement` (or `ReactElement | null`).
  The final `return` should read as a short assembly of those helpers.
- **Section-separator banner comments** group a file into scannable regions.
  Use the ones that apply, in top-to-bottom order, e.g.:
  ```tsx
  // ======================
  // TYPES            (or CONSTANTS / HELPERS — module-level, above the component)
  // ======================
  ```
  ```tsx
  // ======================
  // STATE, HOOKS & REFS   (useState/useRef/useEffect/selectors/derived values)
  // ======================
  ```
  ```tsx
  // ======================
  // HANDLERS              (useCallback handlers and pure transforms)
  // ======================
  ```
  ```tsx
  // ======================
  // RENDER FUNCTIONS      (the renderXxx helpers)
  // ======================
  ```
  The final `return` follows with no extra banner. Small primitives may collapse
  to a single `// RENDER` banner. The exact label set is flexible; consistency
  within a file and matching siblings is what matters.
- **Explicit types everywhere.** Every component has a typed `Props` interface;
  every helper and handler declares parameter and return types. Use type-only
  imports (`import type { ReactElement, KeyboardEvent } from 'react'`). Prefer
  named type-only imports over the `React.` namespace (`KeyboardEvent`, not
  `React.KeyboardEvent`). Never `JSX.Element`, never `any`.
- **Early returns.** Handle edge cases first; keep nesting shallow (max ~3).
- **Error boundaries** may be class components (React requires it). Everything
  else is an arrow function.

---

## Styling Conventions

- One CSS Module per component, co-located (`Component.module.css`).
- Compose multiple/conditional classes through the shared `cn` helper. A single
  static class can stay a plain string; **anything conditional uses `cn`**, not
  hand-rolled template-string concatenation.
- **Theme through design tokens (CSS custom properties). Never hardcode a color
  that has — or should have — a token.** This includes status colors
  (success/warning/danger) and error text: if a token is missing, **add the
  token** (light + dark) rather than inlining a hex value in TS or CSS. A hex
  literal in a `.tsx`/`.ts` file or a `.module.css` is a red flag — the only
  acceptable raw colors are a data-visualization palette (e.g. multi-series chart
  colors) that is intentionally fixed across themes.
- Both light and dark must work — verify both. Don't rely on
  `var(--token, #fallback)` to paper over a token that was never defined; the
  fallback silently wins and the theme breaks.
- No global styles outside the designated global stylesheet (`index.css`) and the
  token definitions it holds.

---

## TypeScript & Naming

- Components/types/interfaces: `PascalCase`. Functions/hooks/vars: `camelCase`.
  Module-level constants: `UPPER_SNAKE_CASE`. Hooks start with `use`. Booleans
  read as `is`/`has`/`can`. (A type alias is `PascalCase` — not `UPPER_SNAKE`.)
- Prefer `X | undefined`, `X | Y`, `unknown` over loose typing. No `any`.
- No abbreviations in public APIs.

---

## Imports & Barrels

- Use the `@/` alias for cross-area imports (`@/components`, `@/store`,
  `@/contexts`, `@/services`, `@/hooks`, `@/types`). It maps to `ui/src/`.
- Use relative imports only within the same feature/folder.
- **Import an area through its barrel**, not deep paths — `@/components`, not
  `@/components/Button/Button`. Deep imports into another area's internals are a
  smell; if the barrel doesn't export what you need, **add it to the barrel**
  rather than reaching past it. (Keeping each area's barrel complete is part of
  the public-edge contract.)
- `index.ts` barrels are for the public edge of a folder (the primitives layer, a
  feature's entry, the contexts/store/services/types public surface). Don't
  barrel deep internals; that invites circular imports and slows tooling.
- A lazily-loaded feature exposes a `default` export from its barrel so the App
  root can `lazy(() => import('@/views/<feature>'))`.

---

## Adding to the Project — Checklist

1. **Decide the role** (entry/root? primitive? view part? shell? context? store?
   service? hook?) and place the file in the matching area. Unsure →
   `references/project-map.md`.
2. **Read a sibling first.** Open an existing file of the same role and mirror its
   structure, banners, and types before writing.
3. **Check direction:** would this import break the one-way flow? If a primitive
   needs app state, it's not a primitive — lift the state out and pass props.
4. **Reuse before creating.** Search `components/`, `hooks/`, and `services/`
   first. Extract a new primitive/helper only when something is used in 2+ places
   — don't pre-abstract.
5. **Co-locate** the component, its styles, and its types together; export through
   the folder barrel and keep that barrel complete.
6. **Wire providers once** in the App root; keep it thin.
7. **Verify** before declaring done — see Verify below.

---

## Verify

Run from the `ui/` directory:

```bash
npm run lint     # eslint
npm run build    # tsc -b && vite build (type-check + production build)
npm run test     # vitest run
```

`npm run build` is the type-check gate (`tsc -b`). Lint and build must pass before
considering a change done. Don't start `npm run dev` to verify — it's a
long-running server; use `build`/`test` instead.

---

## Things NOT to Do

- Don't let `components/` import from `apps/`, `views/`, `store/`, the network
  modules in `services/`, or `contexts/`.
- Don't import one feature view from another — promote the shared piece instead.
- Don't call `fetch` outside the `services/` network modules; fetch through a hook.
- Don't put static config or one-time-derived values in the global store.
- Don't build deep inline JSX trees — extract render helpers.
- Don't hardcode themeable colors (status/error/chrome) — add and use a token.
  Don't lean on `var(--token, #hex)` for a token that isn't actually defined.
- Don't reach past an area's barrel with deep import paths — complete the barrel.
- Don't duplicate a helper (date formatting, byte/size formatting, validation)
  across files — put it in `services/utils.ts` (or a feature helper) and import it.
- Don't pre-abstract. Wait for the second use.
- Don't add files or folders outside the scope of the task at hand.
- Don't leave broken or commented-out code; if you find something broken in the
  area you're working, fix it.
- Comments explain **what** and **why**, never **when** or **how it changed**.
