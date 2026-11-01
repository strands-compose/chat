/**
 * Typed test-data builders. Defaults come from the demo fixtures, so every row
 * has the exact shape the backend returns; a test passes only the fields it
 * cares about.
 *
 * Ids come from a counter that the backend fixture resets before each test, so
 * they are deterministic within a test and never collide across builders.
 */

import type {
  Agent,
  AuthProvidersResponse,
  CurrentUser,
  Session,
  SessionMessage,
  SessionUsageSummary,
} from '@/services/api';
import { agents as demoAgents } from '@/services/demo-fixtures/agents';
import { capabilities as demoCapabilities } from '@/services/demo-fixtures/capabilities';
import { me as demoUser } from '@/services/demo-fixtures/me';
import { usage as demoUsage } from '@/services/demo-fixtures/usage';
import type { MediaCapabilities } from '@/types';
import type {
  BreakdownOut,
  BudgetItemOut,
  FiltersOut,
  MeUsageOut,
  MeUsagePoint,
  SummaryOut,
  TimelineOut,
} from '@/types/analytics';

// ====== IDS ======

let nextId = 1;

/** Restart id generation. Called by the backend fixture before every test. */
export function resetIds(): void {
  nextId = 1;
}

/** A deterministic id such as `session-3`. */
export function makeId(prefix: string): string {
  return `${prefix}-${nextId++}`;
}

// ====== AUTH ======

export function makeUser(overrides: Partial<CurrentUser> = {}): CurrentUser {
  return { ...structuredClone(demoUser as CurrentUser), ...overrides };
}

export function makeProviders(
  overrides: Partial<AuthProvidersResponse> = {},
): AuthProvidersResponse {
  return { registration_enabled: false, local_signin_enabled: true, providers: [], ...overrides };
}

// ====== AGENTS / MEDIA ======

export function makeAgent(overrides: Partial<Agent> = {}): Agent {
  const base = structuredClone(demoAgents[0] as Agent);
  return { ...base, ...overrides };
}

export function makeCapabilities(overrides: Partial<MediaCapabilities> = {}): MediaCapabilities {
  return { ...structuredClone(demoCapabilities as unknown as MediaCapabilities), ...overrides };
}

// ====== SESSIONS ======

export function makeSession(overrides: Partial<Session> = {}): Session {
  const sessionId = overrides.session_id ?? makeId('session');
  const now = '2026-07-15T09:00:00';
  return {
    id: `row-${sessionId}`,
    session_id: sessionId,
    agent_id: demoAgents[0].id,
    title: `Chat ${sessionId}`,
    created_at: now,
    last_used_at: now,
    is_archived: false,
    ...overrides,
  };
}

export function makeMessage(
  overrides: Partial<SessionMessage> & Pick<SessionMessage, 'role' | 'content' | 'seq'>,
): SessionMessage {
  return { is_success: true, attachments: [], ...overrides };
}

/** A user question and its answer, with consecutive seq numbers. */
export function makeExchange(question: string, answer: string, firstSeq = 1): SessionMessage[] {
  return [
    makeMessage({ role: 'user', content: question, seq: firstSeq }),
    makeMessage({ role: 'assistant', content: answer, seq: firstSeq + 1 }),
  ];
}

export function makeSessionUsage(
  overrides: Partial<SessionUsageSummary> = {},
): SessionUsageSummary {
  return { ...structuredClone(demoUsage), ...overrides };
}

// ====== USAGE ======

/** Usage point for one bucket. */
export function makeUsagePoint(label: string, overrides: Partial<MeUsagePoint> = {}): MeUsagePoint {
  return {
    label,
    cost: 1,
    input_tokens: 1000,
    output_tokens: 100,
    cache_read_input_tokens: 0,
    cache_write_input_tokens: 0,
    ...overrides,
  };
}

export function makeUserUsage(interval: string, points: MeUsagePoint[]): MeUsageOut {
  return { interval, points };
}

// ====== ANALYTICS (admin) ======

export interface AnalyticsData {
  filters: FiltersOut;
  summary: SummaryOut;
  timeline: TimelineOut;
  breakdown: BreakdownOut;
  budgets: BudgetItemOut[];
}

export function makeAnalytics(overrides: Partial<AnalyticsData> = {}): AnalyticsData {
  return {
    filters: {
      users: [
        { id: 'user-alice', username: 'alice' },
        { id: 'user-bob', username: 'bob' },
      ],
      agents: [{ id: demoAgents[0].id, name: demoAgents[0].name }],
      groups: [{ id: 'group-research', name: 'research' }],
    },
    summary: {
      total_cost: 12.5,
      input_tokens: 120_000,
      output_tokens: 15_000,
      cache_read_input_tokens: 40_000,
      cache_write_input_tokens: 5_000,
      hits: 42,
      active_users: 2,
    },
    timeline: {
      interval: 'daily',
      metric: 'cost',
      labels: ['2026-07-13', '2026-07-14', '2026-07-15'],
      series: [{ name: 'total', data: [3.5, 4, 5] }],
    },
    breakdown: {
      metric: 'cost',
      category: 'user',
      labels: ['alice', 'bob'],
      series: [{ name: 'total', values: [8, 4.5] }],
    },
    budgets: [
      {
        user_id: 'user-alice',
        username: 'alice',
        spend: 8,
        budget: 10,
        pct_used: 80,
        status: 'warn',
        is_over: false,
      },
      {
        user_id: 'user-bob',
        username: 'bob',
        spend: 4.5,
        budget: 100,
        pct_used: 4.5,
        status: 'ok',
        is_over: false,
      },
    ],
    ...overrides,
  };
}
