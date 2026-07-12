/**
 * Demo drop-in for `api.ts`, used only in the static GitHub Pages build.
 *
 * It mirrors every value export of `api.ts` but serves recorded fixtures
 * instead of talking to a backend, so the UI runs as a fully static page with
 * no network. It is wired in *exclusively* by the `demo-api-swap` Vite plugin
 * (mode `demo`); production builds never import this module or its fixtures, so
 * neither ends up in the shipped bundle.
 */

import type { ChatRequest, ChatStreamEvent, MediaCapabilities, Attachment } from '../types';
import type { MeUsageOut, MeUsagePoint } from '@/types/analytics';
import type {
  Agent,
  Session,
  CurrentUser,
  LoginCredentials,
  LoginResult,
  RegisterPayload,
  SessionMessage,
  SessionUsageSummary,
  AuthProvidersResponse,
  ProfilePatchPayload,
} from './api';
import { mapBackendEvent } from './api';
import { readAppBase } from './utils';

import { me as meFixture } from './demo-fixtures/me';
import { agents as agentsFixture } from './demo-fixtures/agents';
import { sessions as sessionsFixture } from './demo-fixtures/sessions';
import { usage as usageFixture } from './demo-fixtures/usage';
import { capabilities as capabilitiesFixture } from './demo-fixtures/capabilities';
import { messages as messagesFixture } from './demo-fixtures/messages';
import { events as DEMO_EVENTS } from './demo-fixtures/events';

// ====== RE-EXPORTS ======

// LOGIN_URL never triggers a redirect in demo (fetchCurrentUser always returns a
// user), but consumers import it, so keep the real value.
export { LOGIN_URL } from './api';

// ====== CONSTANTS ======

const MEDIA_CAPABILITIES = capabilitiesFixture as unknown as MediaCapabilities;
const SESSION_USAGE = usageFixture as unknown as SessionUsageSummary;

/** Playback cadence for the replayed stream, in milliseconds. */
const TOKEN_DELAY_MS = 12;
const EVENT_DELAY_MS = 400;

// ====== MUTABLE DEMO STATE ======

// Copied out of the fixtures so profile edits and session mutations persist for
// the lifetime of the page without touching the imported JSON.
let currentUser: CurrentUser = { ...(meFixture as unknown as CurrentUser) };
let sessions: Session[] = (sessionsFixture as unknown as Session[]).map((s) => ({ ...s }));

// ====== HELPERS ======

/** Resolve after `ms`, or reject with an AbortError if `signal` fires first. */
function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException('Aborted', 'AbortError'));
      return;
    }
    const onAbort = (): void => {
      clearTimeout(timer);
      signal?.removeEventListener('abort', onAbort);
      reject(new DOMException('Aborted', 'AbortError'));
    };
    const timer = setTimeout(() => {
      signal?.removeEventListener('abort', onAbort);
      resolve();
    }, ms);
    signal?.addEventListener('abort', onAbort);
  });
}

// ====== USAGE SYNTHESIS ======

/** Length of the trailing daily window, in days, ending on today. */
const DEMO_USAGE_DAYS = 90;

interface UsageDay {
  cost: number;
  input_tokens: number;
  output_tokens: number;
}

function toYMD(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function parseYMD(s: string): Date {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

/** FNV-1a hash — turns a date key into a stable 32-bit seed. */
function hashStr(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Mulberry32 PRNG — deterministic 0..1 sequence from a seed. */
function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Deterministic usage for a single calendar date. Values depend only on the
 * date, so they are stable across reloads and identical no matter which
 * interval aggregates them. Days outside the trailing DEMO_USAGE_DAYS window
 * (older, or in the future) return zero.
 */
function dailyUsage(date: Date): UsageDay {
  const today = startOfToday();
  const windowStart = new Date(today);
  windowStart.setDate(windowStart.getDate() - (DEMO_USAGE_DAYS - 1));

  const t = date.getTime();
  if (t < windowStart.getTime() || t > today.getTime()) {
    return { cost: 0, input_tokens: 0, output_tokens: 0 };
  }

  const rnd = mulberry32(hashStr(toYMD(date)));
  const r1 = rnd();
  const r2 = rnd();
  const r3 = rnd();

  // Weekends run lighter than weekdays; every day still has some activity.
  const isWeekend = date.getDay() === 0 || date.getDay() === 6;
  const dayFactor = isWeekend ? 0.3 + r3 * 0.25 : 0.7 + r3 * 0.5;

  const input = Math.round((400_000 + r1 * 2_200_000) * dayFactor);
  const output = Math.round(input * (0.06 + r2 * 0.05));
  // Blended $/token so cost tracks token volume for both chart modes.
  const cost = input * 0.9e-6 + output * 9e-6;

  return { cost, input_tokens: input, output_tokens: output };
}

/** Bucket key for a date under the requested interval (matches formatBucketLabel). */
function bucketKey(date: Date, interval: string): string {
  if (interval === 'monthly') {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  }
  if (interval === 'weekly') {
    const dow = (date.getDay() + 6) % 7; // Monday = 0
    const weekStart = new Date(date);
    weekStart.setDate(weekStart.getDate() - dow);
    return toYMD(weekStart);
  }
  return toYMD(date);
}

/** Sum of generated daily cost from the first of the current month through today. */
function currentMonthUsageCost(): number {
  const today = startOfToday();
  const cursor = new Date(today.getFullYear(), today.getMonth(), 1);
  let sum = 0;
  while (cursor.getTime() <= today.getTime()) {
    sum += dailyUsage(cursor).cost;
    cursor.setDate(cursor.getDate() + 1);
  }
  return Math.round(sum * 100) / 100;
}

/** The current user with `usage` recomputed to match the generated month-to-date spend. */
function publicUser(): CurrentUser {
  return { ...currentUser, usage: currentMonthUsageCost() };
}

// ====== AGENTS / MEDIA ======

export async function fetchAgents(): Promise<Agent[]> {
  return (agentsFixture as unknown as Agent[]).map((a) => ({ ...a }));
}

export async function fetchMediaCapabilities(): Promise<MediaCapabilities> {
  return MEDIA_CAPABILITIES;
}

// ====== AUTH ======

export async function fetchCurrentUser(): Promise<CurrentUser | null> {
  return publicUser();
}

export async function login(credentials: LoginCredentials): Promise<LoginResult> {
  void credentials;
  return { next: readAppBase() || '/' };
}

export async function register(payload: RegisterPayload): Promise<CurrentUser> {
  return { ...publicUser(), username: payload.username, email: payload.email };
}

export function logout(): void {
  // No backend to clear a cookie against — just reload the static page.
  window.location.reload();
}

export async function fetchAuthProviders(): Promise<AuthProvidersResponse> {
  return { registration_enabled: false, providers: [] };
}

export function startProviderLogin(providerId: string): void {
  void providerId;
}

export async function patchCurrentUser(payload: ProfilePatchPayload): Promise<CurrentUser> {
  currentUser = { ...currentUser, ...payload };
  return publicUser();
}

export async function fetchUserUsageSummary(
  fromDate: string,
  toDate: string,
  interval: string,
): Promise<MeUsageOut> {
  const from = parseYMD(fromDate);
  const to = parseYMD(toDate);
  const round2 = (n: number): number => Math.round(n * 100) / 100;

  // Insertion order follows the ascending date cursor, so points stay chronological.
  const points: MeUsagePoint[] = [];
  const buckets = new Map<string, MeUsagePoint>();

  const cursor = new Date(from);
  while (cursor.getTime() <= to.getTime()) {
    const usage = dailyUsage(cursor);
    const key = bucketKey(cursor, interval);
    let point = buckets.get(key);
    if (!point) {
      point = { label: key, cost: 0, input_tokens: 0, output_tokens: 0 };
      buckets.set(key, point);
      points.push(point);
    }
    point.cost += usage.cost;
    point.input_tokens += usage.input_tokens;
    point.output_tokens += usage.output_tokens;
    cursor.setDate(cursor.getDate() + 1);
  }

  for (const point of points) {
    point.cost = round2(point.cost);
  }

  return { interval, points };
}

// ====== SESSIONS ======

export async function fetchSessions(limit = 50, offset = 0): Promise<Session[]> {
  return sessions.slice(offset, offset + limit).map((s) => ({ ...s }));
}

export async function renameSession(sessionId: string, title: string): Promise<Session> {
  sessions = sessions.map((s) => (s.session_id === sessionId ? { ...s, title } : s));
  const updated = sessions.find((s) => s.session_id === sessionId);
  if (!updated) throw new Error(`Session not found: ${sessionId}`);
  return { ...updated };
}

export async function deleteSession(sessionId: string): Promise<void> {
  sessions = sessions.filter((s) => s.session_id !== sessionId);
}

export async function fetchSessionMessages(sessionId: string): Promise<SessionMessage[]> {
  void sessionId;
  return (messagesFixture as unknown as SessionMessage[]).map((m) => ({ ...m }));
}

export async function fetchSessionUsage(sessionId: string): Promise<SessionUsageSummary> {
  void sessionId;
  return { ...SESSION_USAGE };
}

// ====== STREAM CHAT ======

/**
 * Replay the recorded invocation as a live SSE-like stream. The outgoing
 * request is ignored — every send yields the same recorded conversation.
 */
export async function* streamChat(
  request: ChatRequest,
  sessionId: string,
  attachments: Attachment[] = [],
  signal?: AbortSignal,
): AsyncGenerator<ChatStreamEvent, void, unknown> {
  void request;
  void sessionId;
  void attachments;

  for (const raw of DEMO_EVENTS) {
    if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');
    const event = mapBackendEvent(raw);
    if (!event) continue;
    yield event;
    await sleep(event.type === 'token' ? TOKEN_DELAY_MS : EVENT_DELAY_MS, signal);
  }
}
