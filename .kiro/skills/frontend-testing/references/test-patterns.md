# Frontend Test Patterns

Copy-paste shapes that implement `../SKILL.md`. If anything here conflicts with
SKILL.md, SKILL.md wins. Exact signatures live in `ui/e2e/support/*.ts` — read
them before your first spec. `ui/e2e/chat/new-chat.spec.ts` is the reference
spec.

---

## 1. The harness

| File | Exports | Job |
|------|---------|-----|
| `e2e/support/test.ts` | `test`, `expect` | Playwright `test` + auto fixtures: `backend` (fresh fake per test) and the console guard. Option `consoleErrors: { allow: RegExp[] }` (an object, because Playwright reads a bare `[a, b]` in `test.use` as a fixture tuple). |
| `e2e/support/fake-backend.ts` | `FakeBackend`, `isBackendUrl`, types `RecordedRequest`, `InvocationBody`, `Reply`, `Gate` | Stateful, fail-closed fake of `/auth/**`, `/api/v1/**`, `/admin`. |
| `e2e/support/sse.ts` | `streamTurn`, `errorTurn`, `sseBody`, `DEMO_TURN` | Valid stream event sequences and SSE bodies. |
| `e2e/support/data.ts` | `makeUser`, `makeAgent`, `makeSession`, `makeMessage`, `makeExchange`, `makeSessionUsage`, `makeUsagePoint`, `makeUserUsage`, `makeAnalytics`, `makeProviders`, `makeCapabilities`, `makeId` | Typed builders; defaults from the demo fixtures; deterministic ids per test. |

Fake state (set before `page.goto`):

| Field | Default |
|-------|---------|
| `user` | demo user; `null` → `GET /auth/me` is 401 |
| `credentials`, `loginNext` | `alice` / `correct-horse`; `'/'` |
| `providers` | local sign-in on, no OIDC, no registration |
| `agents` | `[makeAgent()]` (the demo agent, 3 suggested questions) |
| `capabilities` | demo media capabilities (images + documents, 5 MB/file) |
| `sessions`, `messages` | `[]`, `{}` |
| `sessionUsage` | demo usage summary |
| `userUsage` | function: one point (cost 1, 1000 in / 100 out tokens) per requested day |
| `analytics` | `makeAnalytics()` (2 users, 1 agent, 1 group, 3-day timeline, 2 budgets) |
| `reply` | `streamTurn({ text: 'Done.' })`; array or `(request) => events` |
| `now` | `2026-07-15T09:00:00Z` — timestamp for sessions the fake creates |

Observations: `backend.requests` (every backend request, parsed),
`backend.requestsTo(method, path | RegExp)`, `backend.unhandled`.

What the fake does on `POST /api/v1/invocations`: mints `new-session-N` when
the request has no `session_id` and puts it first in `sessions` (title = the
prompt); stores the user message (with attachment metadata); waits for a held
gate if any (a Stop aborts it and stores nothing more; teardown releases
any gate still held); rewrites
`session_start.data.session_id`; stores the assistant message (the `error`
text with `is_success: false` if the stream has an `error` event); then sends
the SSE body.

---

## 2. A journey spec

```ts
import { test, expect } from '../support/test';
import { streamTurn } from '../support/sse';

test('a new chat streams the answer and becomes a saved session', { tag: '@smoke' }, async ({ page, backend }) => {
  backend.reply = streamTurn({
    text: 'The weather in Oslo is sunny.',
    tools: [{ name: 'get_weather', input: { city: 'Oslo' }, result: 'sunny' }],
  });

  await page.goto('/');
  const composer = page.getByRole('textbox', { name: 'Message' });

  await test.step('send the first message', async () => {
    await composer.fill('What is the weather in Oslo?');
    await composer.press('Enter');
  });

  await test.step('the answer and the workflow panel appear', async () => {
    await expect(
      page.getByRole('article', { name: 'Assistant said' }).getByText('The weather in Oslo is sunny.'),
    ).toBeVisible();
    const workflow = page.getByRole('region', { name: 'Workflow' });
    await expect(workflow.getByText('Completed')).toBeVisible();
    await expect(workflow.getByRole('button', { name: 'Close workflow panel' })).toBeVisible();
  });

  await test.step('the turn was sent as a new session and the URL follows', async () => {
    const sent = backend.requestsTo('POST', '/api/v1/invocations');
    expect(sent).toHaveLength(1);
    expect(sent[0].body).toEqual({ prompt: 'What is the weather in Oslo?', agent_id: backend.agents[0].id });
    await expect(page).toHaveURL(/[?&]session_id=new-session-\d+/);
    await expect(
      page.getByRole('region', { name: 'Chat history' }).getByText('What is the weather in Oslo?'),
    ).toBeVisible();
  });
});
```

---

## 3. Arrange through the fake

```ts
import { makeExchange, makeSession } from '../support/data';

test('a deep link restores that session', async ({ page, backend }) => {
  const session = makeSession({ title: 'Quarterly report' });
  backend.sessions = [session];
  backend.messages[session.session_id] = makeExchange('Summarise Q3', 'Revenue grew 12%.');

  await page.goto(`/?session_id=${session.session_id}`);

  await expect(page.getByText('Revenue grew 12%.')).toBeVisible();
  await expect(page.getByRole('region', { name: 'Chat history' }).getByText('Quarterly report')).toBeVisible();
});
```

---

## 4. A request the user caused

Baseline, act, poll for exactly one new request, then check its contract.

```ts
const renames = (): number => backend.requestsTo('PATCH', `/api/v1/sessions/${session.session_id}`).length;
const before = renames();

await page.getByRole('button', { name: 'Rename session' }).click();
await page.getByRole('textbox', { name: 'Session Name' }).fill('Q3 numbers');
await page.getByRole('button', { name: 'Rename', exact: true }).click();

await expect.poll(renames).toBe(before + 1);
expect(backend.requestsTo('PATCH', `/api/v1/sessions/${session.session_id}`).at(-1)?.body).toEqual({ title: 'Q3 numbers' });
await expect(page.getByRole('region', { name: 'Chat history' }).getByText('Q3 numbers')).toBeVisible();
```

---

## 5. One-off responses with `page.route`

Page routes outrank the fake's context routes. Use `{ times: 1 }` so later
requests fall back to the fake.

```ts
test('an invocation refused by the server shows its reason', async ({ page }) => {
  await page.route(
    '**/api/v1/invocations',
    (route) => route.fulfill({ status: 402, json: { detail: 'Monthly budget exceeded.' } }),
    { times: 1 },
  );

  await page.goto('/');
  const composer = page.getByRole('textbox', { name: 'Message' });
  await composer.fill('Hi');
  await composer.press('Enter');

  await expect(page.getByText('Monthly budget exceeded.')).toBeVisible();
});
```

- Transport failure (no HTTP response at all): `route.abort('failed')`.
- An override that handles only some requests calls `route.fallback()` for the
  rest. **Never `route.continue()`** — it sends the request to the real network.
- The browser's "Failed to load resource" line for a mocked error status is
  ignored by the guard. An app-level `console.error` is not:

```ts
// The store logs the refused restore; the user-visible fallback is asserted below.
test.use({ consoleErrors: { allow: [/^\[chatStore\] restoreSession failed:/] } });
```

---

## 6. Holding a stream open

The fulfilled SSE body arrives in one piece, so "while the agent works" is a
held request. Stop opens a confirmation first.

```ts
test('stopping a running turn after confirming returns the composer', async ({ page, backend }) => {
  backend.holdReply();

  await page.goto('/');
  const composer = page.getByRole('textbox', { name: 'Message' });
  await composer.fill('Long task');
  await composer.press('Enter');

  await expect(page.getByText('Running')).toBeVisible();
  await page.getByRole('button', { name: 'Stop generation' }).click();
  await page.getByRole('alertdialog', { name: 'Agent is running' }).getByRole('button', { name: 'Stop agent' }).click();

  await expect(page.getByText('Generation stopped by user.')).toBeVisible();
  await expect(composer).toBeEnabled();
});
```

`holdReply()` returns `{ release }` for tests that let the turn finish
(`gate.release()`, then assert the answer). Unreleased gates are released at
teardown.

---

## 7. Stream builders

```ts
backend.reply = streamTurn({ text: 'Done.' });                         // one agent, word-by-word tokens
backend.reply = streamTurn({ text: 'Sunny.', tools: [{ name: 'get_weather', input: { city: 'Oslo' }, result: 'sunny' }] });
backend.reply = streamTurn({ text: 'Answer.', reasoning: 'Thinking about it.' });
backend.reply = errorTurn('Model throttled.', { tools: [{ name: 'get_weather' }] }); // tools, then an error event: a failed turn
backend.reply = (request) => streamTurn({ text: `You said: ${request.prompt}` });
backend.reply = DEMO_TURN;                                             // recorded delegate turn (main → doc_expert ×3, developer; list/read doc tools) — only when that is the behaviour under test
```

---

## 8. Time, theme, viewport, clipboard

```ts
test('usage totals cover the current month', async ({ page, backend }) => {
  await page.clock.setFixedTime(new Date('2026-07-15T12:00:00Z')); // before goto
  backend.now = () => new Date('2026-07-15T12:00:00Z');
  await page.goto('/');
  // …
});

test.describe('dark theme', () => {
  test.use({ colorScheme: 'dark' });
  // …
});

test.describe('mobile', () => {
  test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  // …
});

test.describe('clipboard', () => {
  test.use({ permissions: ['clipboard-read', 'clipboard-write'] });

  test('copying a message puts its text on the clipboard', async ({ page }) => {
    // … click "Copy message" …
    await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toContain('Revenue grew 12%.');
  });
});
```

`page.evaluate` is allowed for browser facts a user observes (clipboard,
`localStorage`/`sessionStorage` surviving a reload) — never to reach React or
the store. The theme lives in `data-theme` on `<html>`; asserting
`toHaveAttribute('data-theme', 'dark')` is the one sanctioned attribute check,
because every colour token keys off it.

---

## 9. Unit test — pure helper

```ts
import { describe, expect, it } from 'vitest';
import { formatFileSize } from './utils';

describe('formatFileSize', () => {
  it.each([
    [0, '0.00 B'],
    [1024, '1.00 KB'],
    [1_520_435, '1.45 MB'],
  ])('formats %d bytes as %s', (bytes, expected) => {
    expect(formatFileSize(bytes)).toBe(expected);
  });
});
```

---

## 10. Unit test — SSE parser, any chunk split (fast-check)

```ts
// @vitest-environment jsdom
// api.ts reads the app-base meta tag when imported, so it needs a DOM.
import { afterEach, describe, expect, it, vi } from 'vitest';
import fc from 'fast-check';
import { streamChat } from './api';

const FRAMES = [
  'data: {"type":"session_start","agent_name":"main","timestamp":"t","data":{"session_id":"s1"}}\n\n',
  'data: keep-alive\n\n',
  'data: {"type":"token","agent_name":"main","timestamp":"t","data":{"text":"Hé"}}\n\n',
  'data: {"type":"session_end","agent_name":"main","timestamp":"t","data":{}}',
].join('');

/** A Response whose body arrives split at the given byte offsets. */
function chunkedResponse(bytes: Uint8Array, cuts: number[]): Response {
  const bounds = [0, ...new Set(cuts), bytes.length].sort((a, b) => a - b);
  return new Response(
    new ReadableStream<Uint8Array>({
      start(controller) {
        for (let i = 0; i < bounds.length - 1; i++) controller.enqueue(bytes.slice(bounds[i], bounds[i + 1]));
        controller.close();
      },
    }),
  );
}

afterEach(() => vi.unstubAllGlobals());

describe('streamChat', () => {
  it('yields the same events however the byte stream is split', async () => {
    const bytes = new TextEncoder().encode(FRAMES);
    await fc.assert(
      fc.asyncProperty(fc.array(fc.integer({ min: 1, max: bytes.length - 1 }), { maxLength: 12 }), async (cuts) => {
        vi.stubGlobal('fetch', vi.fn(async () => chunkedResponse(bytes, cuts)));
        const seen: string[] = [];
        for await (const event of streamChat({ prompt: 'x', agent_id: 'a' }, '')) {
          seen.push(event.type === 'token' ? `token:${event.content}` : event.type);
        }
        expect(seen).toEqual(['session_start', 'token:Hé', 'session_end']);
      }),
    );
  });
});
```

Keep helpers obviously correct; a buggy helper makes a property test
worthless. Cuts inside `é` (two bytes) are part of what this proves.

---

## 11. Unit test — stream handlers

```ts
// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest';
import { events } from '@/services/demo-fixtures/events';
import { mapBackendEvent } from '@/services/api';
import { dispatchStreamEvent, resetStreamingState } from '@/store/streaming';
import type { StreamingSideEffects } from '@/store/streaming';

beforeEach(() => resetStreamingState());

// Build a StreamingSideEffects that records what it receives (commitFinal
// patch, onSessionEnd trace + tokens), dispatch every mapped recorded event,
// then assert the final text, that every tool item is closed, the agent set,
// and the token totals.
```

The side-effects object is the module's declared boundary, so a recording
implementation fakes a seam we own, not the code under test. The scheduler
uses `requestAnimationFrame`: stub it and `cancelAnimationFrame` on top of
`vi.useFakeTimers()`, and restore both in `afterEach`.
