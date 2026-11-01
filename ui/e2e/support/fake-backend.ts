/**
 * Stateful, fail-closed fake of the backend contract the UI talks to:
 * `/auth/**`, `/api/v1/**` (incl. analytics) and the `/admin` link target.
 *
 * - Routes every URL Vite would proxy to the real backend, so nothing leaves the
 *   browser. A backend URL this fake does not handle is aborted, recorded in
 *   `unhandled`, and fails the test at fixture teardown.
 * - Behaves like the server: a new chat mints a session, a turn is persisted
 *   before its stream is sent, so the UI's refetches see consistent data.
 * - Logs every backend request in `requests` for "what did the app send" checks.
 *
 * Tests set public fields before `page.goto`. One-off responses (errors, odd
 * statuses) belong in the test via `page.route(url, handler, { times: 1 })`,
 * which outranks these context routes.
 */

import type { BrowserContext, Request, Route } from '@playwright/test';
import type {
  Agent,
  AuthProvidersResponse,
  CurrentUser,
  Session,
  SessionMessage,
  SessionUsageSummary,
} from '@/services/api';
import type { AttachmentMetadata, BackendStreamEvent, MediaCapabilities } from '@/types';
import type { MeUsageOut } from '@/types/analytics';
import {
  makeAgent,
  makeAnalytics,
  makeCapabilities,
  makeId,
  makeProviders,
  makeSession,
  makeSessionUsage,
  makeUsagePoint,
  makeUser,
  makeUserUsage,
  type AnalyticsData,
} from './data';
import { sseBody, streamTurn } from './sse';

// ====== TYPES ======

/** A file part of a multipart invocation. */
export interface RecordedFile {
  field: string;
  filename: string;
  type: string;
  size: number;
}

/** One backend request as the app sent it. */
export interface RecordedRequest {
  method: string;
  path: string;
  query: Record<string, string>;
  /** Parsed JSON body; for multipart invocations, the parsed `payload` field. */
  body: unknown;
  /** File parts of a multipart body (empty otherwise). */
  files: RecordedFile[];
}

/** The JSON envelope of `POST /api/v1/invocations`. */
export interface InvocationBody {
  prompt: string;
  agent_id: string;
  session_id?: string;
}

/** Events for the next turns, or a function deciding them from the request. */
export type Reply = readonly BackendStreamEvent[] | ((request: InvocationBody) => readonly BackendStreamEvent[]);

/** Holds the next invocation's response until released. */
export interface Gate {
  release(): void;
}

interface Fulfilment {
  status: number;
  contentType?: string;
  headers?: Record<string, string>;
  body?: string;
}

// ====== ROUTING ======

/**
 * True for paths Vite's dev server proxies to the real backend
 * (`^/api/`, `^/auth/`, `^/admin` except `/admin/dashboard`), with URL_PREFIX
 * forced empty by playwright.config.ts.
 */
export function isBackendUrl(url: URL): boolean {
  return /^\/(api|auth)\//.test(url.pathname) || /^\/admin(?!\/dashboard)(\/|$)/.test(url.pathname);
}

function json(status: number, body: unknown): Fulfilment {
  return { status, contentType: 'application/json', body: JSON.stringify(body) };
}

function problem(status: number, detail: string): Fulfilment {
  return { status, contentType: 'application/problem+json', body: JSON.stringify({ detail }) };
}

function html(title: string): Fulfilment {
  return { status: 200, contentType: 'text/html', body: `<!doctype html><title>${title}</title><h1>${title}</h1>` };
}

/** The answer text a real backend would persist for a finished turn. */
function assistantText(events: readonly BackendStreamEvent[]): string {
  const end = events.find((e) => e.type === 'session_end');
  if (typeof end?.data.text === 'string') return end.data.text;
  return events
    .filter((e) => e.type === 'token')
    .map((e) => (typeof e.data.text === 'string' ? e.data.text : ''))
    .join('');
}

// ====== FAKE ======

export class FakeBackend {
  // ---- State a test may set before page.goto ----

  /** The signed-in user; `null` makes `GET /auth/me` answer 401. */
  user: CurrentUser | null = makeUser();
  /** Credentials `POST /auth/login` accepts. */
  credentials = { username: 'alice', password: 'correct-horse' }; // pragma: allowlist secret
  /** Where a successful login sends the browser. */
  loginNext = '/';
  providers: AuthProvidersResponse = makeProviders();
  agents: Agent[] = [makeAgent()];
  capabilities: MediaCapabilities = makeCapabilities();
  /** Newest first, as the backend lists them. */
  sessions: Session[] = [];
  /** Stored messages per `session_id`. */
  messages: Record<string, SessionMessage[]> = {};
  sessionUsage: SessionUsageSummary = makeSessionUsage();
  /** `GET /api/v1/users/me/usage`; default: one point (cost 1) per requested day bucket. */
  userUsage: (query: { from: string; to: string; interval: string }) => MeUsageOut = ({ from, to, interval }) =>
    makeUserUsage(interval, dayLabels(from, to).map((label) => makeUsagePoint(label)));
  analytics: AnalyticsData = makeAnalytics();
  /** Stream for every invocation. */
  reply: Reply = streamTurn({ text: 'Done.' });
  /** Clock for rows the fake creates (new sessions). Set it when the test fixes the page clock. */
  now: () => Date = () => new Date('2026-07-15T09:00:00Z');

  // ---- Read-only observations ----

  /** Every backend request, in order. */
  readonly requests: RecordedRequest[] = [];
  /** `METHOD /path` of every backend request the fake did not handle. */
  readonly unhandled: string[] = [];

  /** Gates not yet taken by an invocation, in order. */
  private readonly gates: Array<Gate & { wait: Promise<void> }> = [];
  /** Every gate ever created, so teardown can release one an invocation is waiting on. */
  private readonly allGates: Gate[] = [];
  private readonly pending = new Set<Promise<void>>();

  /** Hold the next invocation's response until `release()` (or test teardown). */
  holdReply(): Gate {
    let release = (): void => {};
    const wait = new Promise<void>((resolve) => {
      release = resolve;
    });
    const gate = { release, wait };
    this.gates.push(gate);
    this.allGates.push(gate);
    return { release };
  }

  /** Requests matching a method and path (string or pattern). */
  requestsTo(method: string, path: string | RegExp): RecordedRequest[] {
    return this.requests.filter(
      (r) => r.method === method && (typeof path === 'string' ? r.path === path : path.test(r.path)),
    );
  }

  /** Route all backend URLs of the context to this fake. */
  async install(context: BrowserContext): Promise<void> {
    await context.route(isBackendUrl, (route) => this.track(this.handle(route)));
  }

  /** Teardown: release held replies and wait for every in-flight handler. */
  async settle(): Promise<void> {
    for (const gate of this.allGates) gate.release();
    await Promise.allSettled([...this.pending]);
  }

  // ====== HANDLING ======

  private track(work: Promise<void>): Promise<void> {
    this.pending.add(work);
    return work.finally(() => this.pending.delete(work));
  }

  private async handle(route: Route): Promise<void> {
    const recorded = await record(route.request());
    this.requests.push(recorded);

    if (recorded.method === 'POST' && recorded.path === '/api/v1/invocations') {
      await this.invoke(route, recorded);
      return;
    }

    const response = this.respond(recorded);
    if (!response) {
      this.unhandled.push(`${recorded.method} ${recorded.path}`);
      await route.abort('blockedbyclient');
      return;
    }
    await route.fulfill(response);
  }

  /** Answer one non-streaming request, or `null` when the fake has no handler. */
  private respond({ method, path, query, body }: RecordedRequest): Fulfilment | null {
    const key = `${method} ${path}`;
    const sessionMatch = /^\/api\/v1\/sessions\/([^/]+)(\/messages|\/usage)?$/.exec(path);

    // ---- auth ----
    if (key === 'GET /auth/me') return this.user ? json(200, this.user) : problem(401, 'Not authenticated');
    if (key === 'PATCH /auth/me') {
      if (!this.user) return problem(401, 'Not authenticated');
      this.user = { ...this.user, ...(body as Partial<CurrentUser>) };
      return json(200, this.user);
    }
    if (key === 'POST /auth/login') {
      const { username, password } = body as { username: string; password: string };
      const ok = username === this.credentials.username && password === this.credentials.password;
      return ok ? json(200, { next: this.loginNext }) : problem(401, 'Invalid username or password.');
    }
    if (key === 'POST /auth/register') {
      if (!this.providers.registration_enabled) return problem(403, 'Registration is disabled.');
      const { username, email } = body as { username: string; email: string };
      return json(201, makeUser({ id: makeId('user'), username, email }));
    }
    if (key === 'GET /auth/providers') return json(200, this.providers);
    if (key === 'GET /auth/logout') return { status: 302, headers: { location: '/login' } };
    if (method === 'GET' && path.startsWith('/auth/login/')) return html(`Sign in with ${path.slice('/auth/login/'.length)}`);
    if (key === 'GET /admin') return html('Admin');

    // ---- agents / media / usage ----
    if (key === 'GET /api/v1/agents') return json(200, this.agents);
    if (key === 'GET /api/v1/media/capabilities') return json(200, this.capabilities);
    if (key === 'GET /api/v1/users/me/usage') {
      return json(200, this.userUsage({ from: query.from, to: query.to, interval: query.interval }));
    }

    // ---- sessions ----
    if (key === 'GET /api/v1/sessions') {
      const limit = Number(query.limit ?? 50);
      const offset = Number(query.offset ?? 0);
      return json(200, this.sessions.slice(offset, offset + limit));
    }
    if (sessionMatch) {
      const [, sessionId, sub] = sessionMatch;
      const session = this.sessions.find((s) => s.session_id === sessionId);
      if (!session) return problem(404, 'Session not found.');
      if (method === 'GET' && sub === '/messages') return json(200, this.messages[sessionId] ?? []);
      if (method === 'GET' && sub === '/usage') return json(200, this.sessionUsage);
      if (method === 'GET' && !sub) return json(200, session);
      if (method === 'PATCH' && !sub) {
        session.title = (body as { title: string }).title;
        return json(200, session);
      }
      if (method === 'DELETE' && !sub) {
        this.sessions = this.sessions.filter((s) => s.session_id !== sessionId);
        return { status: 204 };
      }
    }

    // ---- analytics (admin dashboard) ----
    if (key === 'GET /api/v1/analytics/filters') return json(200, this.analytics.filters);
    if (key === 'POST /api/v1/analytics/summary') return json(200, this.analytics.summary);
    if (key === 'POST /api/v1/analytics/timeline') return json(200, this.analytics.timeline);
    if (key === 'POST /api/v1/analytics/breakdown') return json(200, this.analytics.breakdown);
    if (key === 'GET /api/v1/analytics/budgets') return json(200, this.analytics.budgets);

    return null;
  }

  /**
   * `POST /api/v1/invocations`: persist like the backend (session row and user
   * message first, then the answer or the error), then send the SSE body.
   */
  private async invoke(route: Route, recorded: RecordedRequest): Promise<void> {
    const request = recorded.body as InvocationBody;
    // The user can stop a held turn: the page aborts the fetch. Fulfilling an
    // aborted request never settles, so a held reply races the abort.
    const aborted = new Promise<'aborted'>((resolve) => {
      const page = route.request().frame().page();
      const onFailed = (failed: Request): void => {
        if (failed !== route.request()) return;
        page.off('requestfailed', onFailed);
        resolve('aborted');
      };
      page.on('requestfailed', onFailed);
    });
    const sessionId = request.session_id ?? makeId('new-session');

    if (!request.session_id) {
      const stamp = this.now().toISOString().replace('Z', '');
      this.sessions = [
        makeSession({ session_id: sessionId, agent_id: request.agent_id, title: request.prompt, created_at: stamp, last_used_at: stamp }),
        ...this.sessions,
      ];
    }
    const stored = (this.messages[sessionId] ??= []);
    const seq = stored.reduce((max, m) => Math.max(max, m.seq), 0) + 1;
    stored.push({
      role: 'user',
      content: request.prompt,
      seq,
      is_success: true,
      attachments: recorded.files.map(toAttachmentMetadata),
    });

    const gate = this.gates.shift();
    if (gate) {
      const outcome = await Promise.race([gate.wait.then(() => 'released' as const), aborted]);
      // Like the real backend, a client disconnect stops the turn: no answer is stored.
      if (outcome === 'aborted') return;
    }

    const events = (typeof this.reply === 'function' ? this.reply(request) : this.reply).map((e) =>
      e.type === 'session_start' ? { ...e, data: { ...e.data, session_id: sessionId } } : e,
    );
    const error = events.find((e) => e.type === 'error');
    stored.push({
      role: 'assistant',
      content: error ? (typeof error.data.text === 'string' ? error.data.text : '') : assistantText(events),
      seq: seq + 1,
      is_success: !error,
      attachments: [],
    });

    await route.fulfill({
      status: 200,
      contentType: 'text/event-stream',
      headers: { 'cache-control': 'no-cache' },
      body: sseBody(events),
    });
  }
}

// ====== HELPERS ======

async function record(request: Request): Promise<RecordedRequest> {
  const url = new URL(request.url());
  const contentType = (await request.headerValue('content-type')) ?? '';
  const buffer = request.postDataBuffer();
  let body: unknown = undefined;
  const files: RecordedFile[] = [];

  if (buffer && contentType.startsWith('multipart/form-data')) {
    const form = await new Response(new Uint8Array(buffer), { headers: { 'content-type': contentType } }).formData();
    for (const [field, value] of form.entries()) {
      if (typeof value === 'string') {
        if (field === 'payload') body = JSON.parse(value);
      } else {
        files.push({ field, filename: value.name, type: value.type, size: value.size });
      }
    }
  } else if (buffer && buffer.length > 0) {
    const text = buffer.toString('utf8');
    body = contentType.includes('json') ? JSON.parse(text) : text;
  }

  return {
    method: request.method(),
    path: url.pathname,
    query: Object.fromEntries(url.searchParams),
    body,
    files,
  };
}

function toAttachmentMetadata(file: RecordedFile): AttachmentMetadata {
  return { filename: file.filename, size: file.size, type: file.type.startsWith('image/') ? 'image' : 'document' };
}

/** `YYYY-MM-DD` for every day from `from` to `to`, inclusive. */
function dayLabels(from: string, to: string): string[] {
  const labels: string[] = [];
  if (!from || !to) return labels;
  for (let d = new Date(`${from}T00:00:00Z`); d <= new Date(`${to}T00:00:00Z`); d.setUTCDate(d.getUTCDate() + 1)) {
    labels.push(d.toISOString().slice(0, 10));
  }
  return labels;
}
