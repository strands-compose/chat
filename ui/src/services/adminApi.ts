import type {
  FiltersOut,
  SummaryRequest,
  SummaryOut,
  TimelineRequest,
  TimelineOut,
  BreakdownRequest,
  BreakdownOut,
  BudgetItemOut,
} from '@/types/analytics';
import { readAppBase } from './utils';
import { fetchWithTimeout, extractError } from './http';

const BASE_URL = readAppBase();
const ANALYTICS = `${BASE_URL}/api/v1/analytics`;

/** Fetch all available filter options (users, agents, groups). */
export async function getFilters(): Promise<FiltersOut> {
  const res = await fetchWithTimeout(`${ANALYTICS}/filters`, { credentials: 'include' });
  if (!res.ok) {
    throw new Error(await extractError(res, `GET /filters failed: ${res.status}`));
  }
  return (await res.json()) as FiltersOut;
}

/** Fetch KPI summary for the given date range and filters. */
export async function postSummary(body: SummaryRequest): Promise<SummaryOut> {
  const res = await fetchWithTimeout(`${ANALYTICS}/summary`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(await extractError(res, `POST /summary failed: ${res.status}`));
  }
  return (await res.json()) as SummaryOut;
}

/** Fetch timeline series data for the given parameters. */
export async function postTimeline(body: TimelineRequest): Promise<TimelineOut> {
  const res = await fetchWithTimeout(`${ANALYTICS}/timeline`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(await extractError(res, `POST /timeline failed: ${res.status}`));
  }
  return (await res.json()) as TimelineOut;
}

/** Fetch breakdown data by category with optional stacking. */
export async function postBreakdown(body: BreakdownRequest): Promise<BreakdownOut> {
  const res = await fetchWithTimeout(`${ANALYTICS}/breakdown`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(await extractError(res, `POST /breakdown failed: ${res.status}`));
  }
  return (await res.json()) as BreakdownOut;
}

/** Fetch per-user budget status rows, optionally filtered by status. */
export async function getBudgets(status?: string, sort?: string): Promise<BudgetItemOut[]> {
  const params = new URLSearchParams();
  if (status) params.set('status', status);
  if (sort) params.set('sort', sort);

  const query = params.toString();
  const url = query ? `${ANALYTICS}/budgets?${query}` : `${ANALYTICS}/budgets`;

  const res = await fetchWithTimeout(url, { credentials: 'include' });
  if (!res.ok) {
    throw new Error(await extractError(res, `GET /budgets failed: ${res.status}`));
  }
  return (await res.json()) as BudgetItemOut[];
}
