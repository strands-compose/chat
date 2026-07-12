import type {
  ChatRequest,
  ChatStreamEvent,
  BackendStreamEvent,
  MediaCapabilities,
  Attachment,
  AttachmentMetadata,
} from '../types';
import type { MeUsageOut } from '@/types/analytics';
import { readAppBase } from './utils';
import { fetchWithTimeout, extractError } from './http';

// ====== CONSTANTS ======
// Read the URL prefix injected by the backend at runtime.
const BASE_URL = readAppBase();

export const LOGIN_URL = `${BASE_URL}/login`;
const API_V1 = `${BASE_URL}/api/v1`;
const INVOCATIONS_URL = `${API_V1}/invocations`;
const AGENTS_URL = `${API_V1}/agents`;
const SESSIONS_URL = `${API_V1}/sessions`;
const MEDIA_URL = `${API_V1}/media`;
const AUTH_URL = `${BASE_URL}/auth`;

/** Default timeout for short JSON requests. The streaming endpoint is exempt. */

// ====== TYPES ======

export interface Agent {
  id: string;
  name: string;
  description: string;
  agent_kind: string;
  multimodal: boolean;
  suggested_questions: string[] | null;
}

/** Matches SessionListItemOut from the backend. */
export interface Session {
  id: string;
  session_id: string;
  agent_id: string;
  title: string | null;
  created_at: string;
  last_used_at: string;
  is_archived: boolean;
}

/** Authenticated user profile — matches MeOut from the backend. */
export interface CurrentUser {
  id: string;
  username: string;
  email: string;
  auth_provider: string;
  groups: string[];
  is_active: boolean;
  is_superuser: boolean;
  budget: number;
  usage: number;
  created_at: string;
  updated_at: string;
  first_name: string | null;
  last_name: string | null;
  location: string | null;
  company: string | null;
  department: string | null;
}

/** Payload for PATCH /auth/me — only the fields being updated, trimmed non-null values. */
export interface ProfilePatchPayload {
  first_name?: string;
  last_name?: string;
  location?: string;
  company?: string;
  department?: string;
}

/** Credentials for POST /auth/login. */
export interface LoginCredentials {
  username: string;
  password: string;
}

/** Result of a successful POST /auth/login — contains the redirect destination. */
export interface LoginResult {
  next: string;
}

/** Payload for POST /auth/register. */
export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}

// ====== AGENTS ======

/** Fetch the list of available agents. */
export async function fetchAgents(): Promise<Agent[]> {
  const res = await fetchWithTimeout(AGENTS_URL);
  if (!res.ok) throw new Error(`Failed to fetch agents: ${res.status}`);
  // Backend returns a plain array (list[AgentOut]).
  return (await res.json()) as Agent[];
}

// ====== MEDIA ======

/** Fetch supported attachment formats and configured size/count limits. */
export async function fetchMediaCapabilities(): Promise<MediaCapabilities> {
  const res = await fetchWithTimeout(`${MEDIA_URL}/capabilities`);
  if (!res.ok) throw new Error(`Failed to fetch media capabilities: ${res.status}`);
  return (await res.json()) as MediaCapabilities;
}

// ====== AUTH ======

/** Return the authenticated user, or null when no valid session exists. */
export async function fetchCurrentUser(): Promise<CurrentUser | null> {
  const res = await fetchWithTimeout(`${AUTH_URL}/me`);
  if (res.status === 401) return null;
  if (!res.ok) throw new Error(`Failed to fetch current user: ${res.status}`);
  return (await res.json()) as CurrentUser;
}

/** Authenticate with username and password. Returns the validated redirect destination. */
export async function login(credentials: LoginCredentials): Promise<LoginResult> {
  const res = await fetchWithTimeout(`${AUTH_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  if (!res.ok) throw new Error(await extractError(res, 'Invalid credentials.'));
  const body = (await res.json()) as LoginResult;
  return body;
}

/** Create a new local account. Does not log the user in. */
export async function register(payload: RegisterPayload): Promise<CurrentUser> {
  const res = await fetchWithTimeout(`${AUTH_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await extractError(res, 'Registration failed.'));
  return (await res.json()) as CurrentUser;
}

/** Navigate to the logout endpoint, which clears the cookie and handles IdP sign-out. */
export function logout(): void {
  window.location.href = `${AUTH_URL}/logout`;
}

/** One configured OIDC provider as exposed by GET /auth/providers. */
export interface AuthProviderInfo {
  id: string;
  display_name: string;
}

/** Response body for GET /auth/providers. */
export interface AuthProvidersResponse {
  registration_enabled: boolean;
  providers: AuthProviderInfo[];
}

/** Fetch available auth providers and registration status. */
export async function fetchAuthProviders(): Promise<AuthProvidersResponse> {
  const res = await fetchWithTimeout(`${AUTH_URL}/providers`);
  if (!res.ok) throw new Error(`Failed to fetch auth providers: ${res.status}`);
  return (await res.json()) as AuthProvidersResponse;
}

/** Navigate to the OIDC login endpoint for a given provider. The backend reads
 * the post-login destination from the session, so no `next` query param is needed. */
export function startProviderLogin(providerId: string): void {
  window.location.href = `${AUTH_URL}/login/${encodeURIComponent(providerId)}`;
}

/** Update the authenticated user's profile fields. Returns the updated user. */
export async function patchCurrentUser(payload: ProfilePatchPayload): Promise<CurrentUser> {
  const res = await fetchWithTimeout(`${AUTH_URL}/me`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await extractError(res, 'Failed to update profile.'));
  return (await res.json()) as CurrentUser;
}

/** Fetch pre-bucketed usage summary for the authenticated user. */
export async function fetchUserUsageSummary(
  fromDate: string,
  toDate: string,
  interval: string,
): Promise<MeUsageOut> {
  const params = new URLSearchParams({ from: fromDate, to: toDate, interval });
  const res = await fetchWithTimeout(`${API_V1}/users/me/usage?${params.toString()}`);
  if (!res.ok) throw new Error(await extractError(res, 'Failed to fetch usage summary.'));
  return (await res.json()) as MeUsageOut;
}

// ====== SESSIONS ======

/** Fetch the list of chat sessions for the authenticated user. */
export async function fetchSessions(limit = 50, offset = 0): Promise<Session[]> {
  const res = await fetchWithTimeout(`${SESSIONS_URL}?limit=${limit}&offset=${offset}`);
  if (!res.ok) throw new Error(`Failed to fetch sessions: ${res.status}`);
  return (await res.json()) as Session[];
}

/** Rename a session by id. Returns the updated session. */
export async function renameSession(sessionId: string, title: string): Promise<Session> {
  const res = await fetchWithTimeout(`${SESSIONS_URL}/${encodeURIComponent(sessionId)}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  });
  if (!res.ok) throw new Error(`Failed to rename session: ${res.status}`);
  return (await res.json()) as Session;
}

/** Soft-delete (archive) a session by id. */
export async function deleteSession(sessionId: string): Promise<void> {
  const res = await fetchWithTimeout(`${SESSIONS_URL}/${encodeURIComponent(sessionId)}`, {
    method: 'DELETE',
  });
  if (!res.ok && res.status !== 204) throw new Error(`Failed to delete session: ${res.status}`);
}

/** Matches MessageOut from the backend. */
export interface SessionMessage {
  role: 'user' | 'assistant';
  content: string;
  seq: number;
  is_success: boolean;
  /** Always present; empty array when the message has no attachments. */
  attachments: AttachmentMetadata[];
}

/** Fetch the stored messages for a session, ordered ascending by seq. */
export async function fetchSessionMessages(sessionId: string): Promise<SessionMessage[]> {
  const res = await fetchWithTimeout(`${SESSIONS_URL}/${encodeURIComponent(sessionId)}/messages`);
  if (!res.ok) throw new Error(`Failed to fetch session messages: ${res.status}`);
  return (await res.json()) as SessionMessage[];
}

/** Aggregated token usage and inferred cost returned by GET /api/v1/sessions/{session_id}/usage. */
export interface SessionUsageSummary {
  input_tokens: number;
  output_tokens: number;
  total_cost: number;
}

/** Fetch the aggregated token usage and total cost for a session in a single request. */
export async function fetchSessionUsage(sessionId: string): Promise<SessionUsageSummary> {
  const res = await fetchWithTimeout(`${SESSIONS_URL}/${encodeURIComponent(sessionId)}/usage`);
  if (!res.ok) throw new Error(`Failed to fetch session usage: ${res.status}`);
  return (await res.json()) as SessionUsageSummary;
}

// ====== EVENT MAPPING ======

/**
 * Pull token usage from a `agent_complete`/`multiagent_complete` payload, supporting
 * both top-level (`input_tokens`) and nested (`usage.input_tokens`) shapes.
 */
const extractUsage = (data: Record<string, unknown>): { input_tokens?: number; output_tokens?: number } => {
  const usage = (data.usage as Record<string, unknown> | undefined) ?? {};
  return {
    input_tokens: (data.input_tokens ?? usage.input_tokens) as number | undefined,
    output_tokens: (data.output_tokens ?? usage.output_tokens) as number | undefined,
  };
};

/**
 * Map a raw backend StreamEvent to the normalised ChatStreamEvent
 * consumed by the frontend hooks.
 */
export const mapBackendEvent = (raw: BackendStreamEvent): ChatStreamEvent | null => {
  const { type, agent_name, data } = raw;

  switch (type) {
    case 'token':
      return { type: 'token', content: data.text as string, agent_name };

    case 'reasoning':
      return { type: 'reasoning', content: data.text as string, agent_name };

    case 'tool_start':
      return {
        type: 'tool_start',
        name: (data.tool_label ?? data.tool_name) as string,
        input: data.tool_input,
        agent_name,
      };

    case 'tool_end':
      return {
        type: 'tool_end',
        name: (data.tool_label ?? data.tool_name) as string,
        output: data.tool_result as string | undefined,
        status: data.status as 'success' | 'error',
        agent_name,
      };

    case 'agent_complete':
      return { type: 'agent_complete', agent_name, ...extractUsage(data) };

    case 'multiagent_complete':
      return { type: 'multiagent_complete', agent_name, ...extractUsage(data) };

    case 'error':
      return { type: 'error', content: (data.text ?? '') as string, agent_name };

    case 'node_start':
      return { type: 'node_start', node_id: data.node_id as string, agent_name };

    case 'node_stop':
      return { type: 'node_stop', node_id: data.node_id as string, agent_name };

    case 'session_start': {
      const entry = data.entry as { name?: string } | undefined;
      return {
        type: 'session_start',
        agent_name: entry?.name ?? agent_name,
        session_id: data.session_id as string | undefined,
      };
    }

    case 'session_end':
      return { type: 'session_end', agent_name };

    case 'agent_start':
      return { type: 'agent_start', agent_name };

    case 'multiagent_start':
      return { type: 'multiagent_start', agent_name };

    case 'handoff':
      return { type: 'handoff', agent_name };

    default:
      if (type) console.warn('Unknown backend event type:', type, raw);
      return null;
  }
};

// ====== STREAM CHAT ======

/**
 * Build a `multipart/form-data` body for an invocation with attachments. The
 * JSON envelope goes in a `payload` field, then each attachment becomes a
 * `file:<index>` part with indices that are unique, contiguous, and start at 0.
 */
function buildMultipart(envelope: ChatRequest, attachments: Attachment[]): FormData {
  const formData = new FormData();
  formData.append('payload', JSON.stringify(envelope));
  attachments.forEach((attachment, i) => {
    formData.append(`file:${i}`, attachment.file, attachment.name);
  });
  return formData;
}

/**
 * Stream chat response from the /invocations endpoint via SSE.
 *
 * When `attachments` is non-empty the request is posted as `multipart/form-data`
 * (the browser sets the boundary, so no manual `Content-Type`); otherwise it is
 * posted as a JSON body.
 */
export async function* streamChat(
  request: ChatRequest,
  sessionId: string,
  attachments: Attachment[] = [],
  signal?: AbortSignal,
): AsyncGenerator<ChatStreamEvent, void, unknown> {
  // Omit session_id for a new conversation — the backend mints one and returns
  // it on the session_start event. Sending an empty string would fail
  // server-side validation (min length).
  const envelope = sessionId ? { ...request, session_id: sessionId } : request;

  const init: RequestInit =
    attachments.length > 0
      ? {
          method: 'POST',
          headers: { Accept: 'text/event-stream' },
          body: buildMultipart(envelope, attachments),
          signal,
        }
      : {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'text/event-stream' },
          body: JSON.stringify(envelope),
          signal,
        };

  const response = await fetch(INVOCATIONS_URL, init);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error('Response body is not readable');
  }

  const decoder = new TextDecoder();
  let buffer = '';

  const processDataLine = function* (data: string): Generator<ChatStreamEvent> {
    if (!data || data === 'keep-alive') return;
    try {
      const raw = JSON.parse(data) as BackendStreamEvent;
      const event = mapBackendEvent(raw);
      if (event) yield event;
    } catch {
      const preview = data.length > 100 ? `${data.substring(0, 100)}...` : data;
      console.warn('Failed to parse SSE event (skipping):', preview);
    }
  };

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          yield* processDataLine(line.slice(6).trim());
        }
      }
    }

    if (buffer.trim().startsWith('data: ')) {
      yield* processDataLine(buffer.trim().slice(6).trim());
    }
  } finally {
    reader.releaseLock();
  }
}
