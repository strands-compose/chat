# Coverage Map

The journeys the UI suite must keep covered, and where each lives. Before
adding a spec, find its row and extend that spec. When a feature ships, add or
update its row in the same change.

Each bullet is one test (one starting state + one path). "Key handles" are the
accessible names the app exposes; they are verified prerequisites — when one
changes, update the spec and this table together.

## End-to-end (`ui/e2e/`)

| Spec | Tests | Key handles |
|------|-------|-------------|
| `auth/auth-gate.spec.ts` | • `GET /auth/me` 401 → browser lands on `/login` • a successful login whose `next` is `/?session_id=<id>` is followed exactly and restores that session • `/auth/me` 500 → error dialog, no redirect | URL, `alertdialog` |
| `auth/login.spec.ts` | • good credentials → `POST /auth/login` body → navigates to `next` • bad credentials → alert shows the server's `detail`, fields keep their values • OIDC providers render and start `/auth/login/<id>` • registration form only when `registration_enabled`; passwords must match | labels `Username`, `Email`, `Password`, `Repeat password`; role `alert` <!-- pragma: allowlist secret --> |
| `chat/welcome.spec.ts` | • agent shown, suggested questions listed, clicking one sends it • description panel opens and closes • `?agent_id=` preselects the agent • no agents → empty state, composer unusable | `Show agent description` / `Hide agent description`, `Close description panel` |
| `chat/new-chat.spec.ts` | • **exists** — new chat: request has `prompt` + `agent_id`, no `session_id`; answer; workflow `Completed`; URL `session_id`; history row • follow-up turn sends the minted `session_id` and both answers stay visible • recorded `DEMO_TURN`: workflow lists every agent and tool, nested runs collapse/expand | textbox `Message`, articles `You said` / `Assistant said`, region `Workflow`, `Close workflow panel`, `Collapse <agent>` |
| `chat/streaming.spec.ts` | • held turn: `Running`, composer disabled, `Stop generation` • Stop → confirm `Stop agent` → "Generation stopped by user.", composer usable • Stop → `Keep running` → turn continues and finishes after release • New chat while running asks the same confirmation | `Stop generation`, `alertdialog` "Agent is running", `Stop agent`, `Keep running`, `New chat` |
| `chat/errors.spec.ts` | • invocation 4xx with Problem Details → failed turn shows `detail` • a refused follow-up closes the workflow panel instead of showing the previous turn; that turn still opens from its `Workflow` button • `errorTurn` with a tool → failed turn, `Error` status, and the tool step kept in the workflow panel • transport abort (`route.abort('failed')`) → failed turn, composer usable • `Resend message` on the user message re-sends the same prompt | `Resend message`, status `Error` |
| `chat/session-restore.spec.ts` | • sidebar lists sessions grouped by day (fixed clock); clicking one loads its messages, agent and session usage • a session opened while the agent list is still loading shows the agent's name, not its id • `?session_id=` deep link restores • unknown id → new-chat state and the URL drops the param | region `Chat history` → lists `Today` / `Yesterday` / `This week` / `Older` → listitems |
| `chat/session-manage.spec.ts` | • rename → one PATCH with `{ title }`, new title shown • delete → confirm → one DELETE, row gone, an open chat is cleared • `Load more` requests the next page with the right `offset` and appends it • failed rename/delete → error dialog with the server's reason, existing title/row unchanged | `Rename session`, dialog "Rename Session", `Session Name`, `Rename`, `Delete session`, alertdialog "Delete Session" → `Delete`, alertdialogs "Rename failed" / "Delete failed" → `OK`, `Load more` |
| `chat/message-actions.spec.ts` | • `Copy message` puts the text on the clipboard • `Copy code` copies a code block • collapse all / expand all • full-width toggle survives reload | `Copy message`, `Copy code`, `Collapse all messages`, `Expand all messages`, `Use full width` / `Use compact width` |
| `chat/attachments.spec.ts` | • pick an image → chip → sent as multipart (`payload` JSON + `file:0`) → shown on the user message • unsupported type or over-limit file → error dialog, nothing sent • `Remove <name>` drops it before sending • agent without multimodal → `File upload not supported` explains | `Add attachment` → menu items `Image` / `Document`, `Preview <name>`, `Remove <name>`, `File upload not supported` |
| `chat/theme.spec.ts` | • first load follows `prefers-color-scheme` • toggle flips `data-theme`; the choice survives reload in the same tab (`sessionStorage`) | `Switch to dark mode` / `Switch to light mode` |
| `chat/mobile.spec.ts` | • narrow viewport: sidebar starts collapsed, picking a session returns to the chat, the description control is absent, after a turn completes the answer is visible (workflow panel closed) | `Expand sidebar`, `Collapse sidebar` |
| `profile/profile.spec.ts` | • the window closes with Escape and with a click outside • `User menu` → Profile → account form PATCHes only changed, trimmed fields • failed save → alert shown, edits kept • usage tab (fixed clock) shows totals; interval and chart-mode switches re-request • agents tab lists agents • `Sign out` navigates to `/auth/logout` • `Admin panel` shows only for superusers | `User menu`, menu items `Profile` / `Admin panel` / `Sign out`, `dialog` "Profile", tablist `Profile sections`, groups `Interval`, `Chart mode` |
| `demo/demo.spec.ts` (`npm run test:demo`) | • the built demo opens with the demo agent, its questions and the sample chats • a suggested question starts the recorded workflow with zero backend requests | `Demo Agent`, region `Workflow`, `Collapse Doc Expert` |
| `admin/dashboard.spec.ts` | • KPI tiles show `/summary` values • a preset date range re-requests every endpoint • in Europe/Warsaw and America/Los_Angeles the default and preset ranges are sent as the local days shown • timeline and breakdown request again with the chosen interval / metric / category / stacking • user/agent/group filters send the selected ids • budget table filters by username, pages, and shows its empty states | regions `Usage Over Time` / `Top Breakdown` (each has its own `Metric` group), KPI groups by label, `Interval`, `Category`, `Users` / `Agents` / `Groups`, `Filter by username`, navigation `Pagination` |

## Unit (`ui/src/**/name.test.ts`)

| Module | Rule to prove |
|--------|---------------|
| `services/api.ts` — `streamChat` | same events for any chunk split (fast-check, incl. inside multi-byte chars); `keep-alive` and non-`data:` lines ignored; malformed JSON skipped and the stream continues; trailing frame without newline parsed; non-OK response throws the Problem Details `detail` (fallback when absent); multipart body (`payload` + `file:<i>`) when attachments are given, JSON otherwise; no `session_id` field when empty |
| `services/api.ts` — `mapBackendEvent` | each backend type maps to the right normalised event; usage read from top level or nested `usage`; `session_start` agent from `entry.name`; unknown type → `null` |
| `store/streaming/*` | recorded `DEMO_TURN` dispatched end to end → final text, every tool closed, agent set, token totals; `error` commits a failed turn once (later errors ignored); scheduler coalesces flushes per frame |
| `views/workflow/workflow-selectors.ts` | `buildAgentRuns` nesting and run construction; `summarizeAgents`; `selectWorkflowTrace` / `selectWorkflowTokens` pick the selected or live turn |
| `views/chat/live-activity.ts` | `selectLiveActivity` label for each in-flight state |
| `services/utils.ts` | `formatFileSize` (**started**), `formatCost`, `formatTokenCount`, `formatAgentLabel`, `validateAttachments` limits, month boundaries / `toDateParam` / `formatNextMonthReset` (fixed dates), `usageColor` thresholds |
| `components/ToolBadge/toolInputPreview.ts` | preview for string / object / empty / huge / nested input |
| `components/charts/bucketLabels.ts` | daily / weekly / monthly display labels |
| `views/profile/usage-points.ts` | `pointTotalTokens` sums every token category |
