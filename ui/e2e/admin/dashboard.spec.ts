import type { Page } from '@playwright/test';
import { test, expect } from '../support/test';
import { makeAnalytics } from '../support/data';
import type { FakeBackend } from '../support/fake-backend';
import type {
  BreakdownRequest,
  BudgetItemOut,
  FiltersRequest,
  SummaryRequest,
  TimelineRequest,
} from '@/types/analytics';

const TODAY = new Date('2026-07-15T12:00:00Z');

type AnalyticsEndpoint = 'summary' | 'timeline' | 'breakdown';

function calls(backend: FakeBackend, endpoint: AnalyticsEndpoint): number {
  return backend.requestsTo('POST', `/api/v1/analytics/${endpoint}`).length;
}

/** Parsed body of the newest request to an analytics endpoint. */
function lastBody<T>(backend: FakeBackend, endpoint: AnalyticsEndpoint): T | undefined {
  return backend.requestsTo('POST', `/api/v1/analytics/${endpoint}`).at(-1)?.body as T | undefined;
}

/** Opens the dashboard and waits until every chart has finished its first load. */
async function openDashboard(page: Page): Promise<void> {
  await page.clock.setFixedTime(TODAY);
  await page.goto('/admin/dashboard');
  await expect(page.getByRole('heading', { name: 'Usage Analytics' })).toBeVisible();
  await expect(page.getByRole('combobox', { name: 'Users' })).toBeVisible();
  await expect(page.getByRole('status', { name: 'Loading chart' })).toHaveCount(0);
}

test('KPI tiles show the summary for the current month', { tag: '@smoke' }, async ({ page, backend }) => {
  await openDashboard(page);

  await test.step('every tile shows its summary value', async () => {
    await expect(page.getByRole('group', { name: 'Total Cost' })).toContainText('$12.50');
    await expect(page.getByRole('group', { name: 'Input Tokens' })).toContainText('120,000');
    await expect(page.getByRole('group', { name: 'Output Tokens' })).toContainText('15,000');
    await expect(page.getByRole('group', { name: 'Cache Read Tokens' })).toContainText('40,000');
    await expect(page.getByRole('group', { name: 'Cache Write Tokens' })).toContainText('5,000');
    await expect(page.getByRole('group', { name: 'Hits' })).toContainText('42');
    await expect(page.getByRole('group', { name: 'Active Users' })).toContainText('2');
  });

  await test.step('all three analytics requests cover the month to date with no filters', async () => {
    await expect.poll(() => calls(backend, 'summary') > 0 && calls(backend, 'timeline') > 0 && calls(backend, 'breakdown') > 0).toBe(true);
    const summary = lastBody<SummaryRequest>(backend, 'summary');
    expect(summary?.from).toBe('2026-07-01');
    expect(summary?.to).toBe('2026-07-15');
    expect(summary?.filters?.user_ids ?? null).toBeNull();

    const timeline = lastBody<TimelineRequest>(backend, 'timeline');
    expect(timeline).toMatchObject({ from: '2026-07-01', to: '2026-07-15', interval: 'daily', metric: 'cost', stack_by: 'none' });
    expect(timeline?.filters).toBeUndefined();

    const breakdown = lastBody<BreakdownRequest>(backend, 'breakdown');
    expect(breakdown).toMatchObject({ from: '2026-07-01', to: '2026-07-15', category: 'user', metric: 'cost', stack_by: 'none' });
    expect(breakdown?.filters).toBeUndefined();
  });
});

test('picking a preset date range re-requests every analytics endpoint with the new dates', async ({ page, backend }) => {
  await openDashboard(page);
  const before = { summary: calls(backend, 'summary'), timeline: calls(backend, 'timeline'), breakdown: calls(backend, 'breakdown') };

  await page.getByRole('button', { name: /Jul 1, 2026 - Jul 15, 2026/ }).click();
  await page.getByRole('button', { name: 'Last 7 days' }).click();

  await expect(page.getByRole('button', { name: /Jul 9, 2026 - Jul 15, 2026/ })).toBeVisible();
  await expect.poll(() => calls(backend, 'summary')).toBe(before.summary + 1);
  await expect.poll(() => calls(backend, 'timeline')).toBe(before.timeline + 1);
  await expect.poll(() => calls(backend, 'breakdown')).toBe(before.breakdown + 1);
  expect(lastBody<SummaryRequest>(backend, 'summary')).toMatchObject({ from: '2026-07-09', to: '2026-07-15' });
  expect(lastBody<TimelineRequest>(backend, 'timeline')).toMatchObject({ from: '2026-07-09', to: '2026-07-15' });
  expect(lastBody<BreakdownRequest>(backend, 'breakdown')).toMatchObject({ from: '2026-07-09', to: '2026-07-15' });
});

// The dates sent must be the local days the picker shows, whatever the browser's timezone.
for (const timezoneId of ['Europe/Warsaw', 'America/Los_Angeles']) {
  test.describe(`in ${timezoneId}`, () => {
    test.use({ timezoneId });

    test('the default and preset ranges are sent as the local days shown', async ({ page, backend }) => {
      await openDashboard(page);

      await test.step('the default range is the month to date', async () => {
        await expect(page.getByRole('button', { name: /Jul 1, 2026 - Jul 15, 2026/ })).toBeVisible();
        await expect.poll(() => calls(backend, 'summary') > 0 && calls(backend, 'timeline') > 0 && calls(backend, 'breakdown') > 0).toBe(true);
        for (const endpoint of ['summary', 'timeline', 'breakdown'] as const) {
          expect(lastBody<SummaryRequest>(backend, endpoint)).toMatchObject({ from: '2026-07-01', to: '2026-07-15' });
        }
      });

      await test.step('the last 7 days preset sends the same days it shows', async () => {
        const before = calls(backend, 'breakdown');
        await page.getByRole('button', { name: /Jul 1, 2026 - Jul 15, 2026/ }).click();
        await page.getByRole('button', { name: 'Last 7 days' }).click();

        await expect(page.getByRole('button', { name: /Jul 9, 2026 - Jul 15, 2026/ })).toBeVisible();
        await expect.poll(() => calls(backend, 'breakdown')).toBe(before + 1);
        for (const endpoint of ['summary', 'timeline', 'breakdown'] as const) {
          expect(lastBody<SummaryRequest>(backend, endpoint)).toMatchObject({ from: '2026-07-09', to: '2026-07-15' });
        }
      });
    });
  });
}

test('the usage-over-time chart requests again with the chosen interval, metric and stacking', async ({ page, backend }) => {
  await openDashboard(page);
  const timelineChart = page.getByRole('region', { name: 'Usage Over Time' });
  await expect(timelineChart).toBeVisible();

  await test.step('choosing Weekly requests the weekly interval', async () => {
    const before = calls(backend, 'timeline');
    await timelineChart.getByRole('group', { name: 'Interval' }).getByRole('button', { name: 'Weekly' }).click();

    await expect.poll(() => calls(backend, 'timeline')).toBe(before + 1);
    expect(lastBody<TimelineRequest>(backend, 'timeline')).toMatchObject({ interval: 'weekly', metric: 'cost', stack_by: 'none' });
    await expect(timelineChart.getByRole('button', { name: 'Weekly', pressed: true })).toBeVisible();
  });

  await test.step('choosing Tokens requests the tokens metric', async () => {
    const before = calls(backend, 'timeline');
    await timelineChart.getByRole('group', { name: 'Metric' }).getByRole('button', { name: 'Tokens' }).click();

    await expect.poll(() => calls(backend, 'timeline')).toBe(before + 1);
    expect(lastBody<TimelineRequest>(backend, 'timeline')).toMatchObject({ interval: 'weekly', metric: 'tokens' });
  });

  await test.step('stacking by agent requests the agent stack and offers a series limit', async () => {
    const before = calls(backend, 'timeline');
    await timelineChart.getByRole('button', { name: 'Stack by: None' }).click();
    await page.getByRole('menuitem', { name: 'Agent' }).click();

    await expect.poll(() => calls(backend, 'timeline')).toBe(before + 1);
    expect(lastBody<TimelineRequest>(backend, 'timeline')).toMatchObject({ stack_by: 'agent', max_series: 10 });
    await expect(timelineChart.getByRole('button', { name: 'Stack by: Agent' })).toBeVisible();
  });

  await test.step('choosing a lower series limit requests it', async () => {
    const before = calls(backend, 'timeline');
    await timelineChart.getByRole('button', { name: 'Max groups: 10' }).click();
    await page.getByRole('menuitem', { name: '5', exact: true }).click();

    await expect.poll(() => calls(backend, 'timeline')).toBe(before + 1);
    expect(lastBody<TimelineRequest>(backend, 'timeline')).toMatchObject({ stack_by: 'agent', max_series: 5 });
  });

  await test.step('a series with no usage shows the empty state', async () => {
    await page.route(
      '**/api/v1/analytics/timeline',
      (route) =>
        route.fulfill({
          json: { interval: 'weekly', metric: 'tokens', labels: ['2026-07-13'], series: [{ name: 'total', data: [0] }] },
        }),
      { times: 1 },
    );
    await timelineChart.getByRole('group', { name: 'Interval' }).getByRole('button', { name: 'Monthly' }).click();

    await expect(timelineChart.getByText('No data for selected range')).toBeVisible();
  });
});

test('the breakdown chart requests again with the chosen category, metric, top-N and stacking', async ({ page, backend }) => {
  await openDashboard(page);
  const breakdownChart = page.getByRole('region', { name: 'Top Breakdown' });
  await expect(breakdownChart).toBeVisible();

  await test.step('choosing Agents requests the agent category', async () => {
    const before = calls(backend, 'breakdown');
    await breakdownChart.getByRole('group', { name: 'Category' }).getByRole('button', { name: 'Agents' }).click();

    await expect.poll(() => calls(backend, 'breakdown')).toBe(before + 1);
    expect(lastBody<BreakdownRequest>(backend, 'breakdown')).toMatchObject({ category: 'agent', metric: 'cost' });
  });

  await test.step('choosing Hits requests the hits metric', async () => {
    const before = calls(backend, 'breakdown');
    await breakdownChart.getByRole('group', { name: 'Metric' }).getByRole('button', { name: 'Hits' }).click();

    await expect.poll(() => calls(backend, 'breakdown')).toBe(before + 1);
    expect(lastBody<BreakdownRequest>(backend, 'breakdown')).toMatchObject({ category: 'agent', metric: 'hits' });
  });

  await test.step('choosing Top: 5 requests five items', async () => {
    const before = calls(backend, 'breakdown');
    await breakdownChart.getByRole('button', { name: 'Top: 10' }).click();
    await page.getByRole('menuitem', { name: '5', exact: true }).click();

    await expect.poll(() => calls(backend, 'breakdown')).toBe(before + 1);
    expect(lastBody<BreakdownRequest>(backend, 'breakdown')).toMatchObject({ max_items: 5 });
  });

  await test.step('grouping by group requests it and warns that totals can overlap', async () => {
    const before = calls(backend, 'breakdown');
    await breakdownChart.getByRole('group', { name: 'Category' }).getByRole('button', { name: 'Groups' }).click();

    await expect.poll(() => calls(backend, 'breakdown')).toBe(before + 1);
    expect(lastBody<BreakdownRequest>(backend, 'breakdown')).toMatchObject({ category: 'group' });
    await expect(breakdownChart.getByText(/group totals may exceed the grand total/i)).toBeVisible();
  });

  await test.step('stacking by user requests the user stack', async () => {
    const before = calls(backend, 'breakdown');
    await breakdownChart.getByRole('button', { name: 'Stack by: None' }).click();
    await page.getByRole('menuitem', { name: 'User' }).click();

    await expect.poll(() => calls(backend, 'breakdown')).toBe(before + 1);
    expect(lastBody<BreakdownRequest>(backend, 'breakdown')).toMatchObject({ stack_by: 'user', max_series: 10 });
  });
});

test('the users, agents and groups filters send the selected ids with every analytics request', async ({ page, backend }) => {
  backend.analytics = makeAnalytics({
    filters: {
      users: [
        { id: 'user-alice', username: 'alice' },
        { id: 'user-bob', username: 'bob' },
      ],
      agents: [{ id: 'agent-helper', name: 'Helper' }],
      groups: [{ id: 'group-research', name: 'research' }],
    },
  });
  await openDashboard(page);

  /** Runs `action`, waits for exactly one new request per endpoint, returns their filters. */
  async function filtersSentBy(action: () => Promise<void>): Promise<Record<AnalyticsEndpoint, FiltersRequest | null | undefined>> {
    const before = { summary: calls(backend, 'summary'), timeline: calls(backend, 'timeline'), breakdown: calls(backend, 'breakdown') };
    await action();
    await expect.poll(() => calls(backend, 'summary')).toBe(before.summary + 1);
    await expect.poll(() => calls(backend, 'timeline')).toBe(before.timeline + 1);
    await expect.poll(() => calls(backend, 'breakdown')).toBe(before.breakdown + 1);
    return {
      summary: lastBody<SummaryRequest>(backend, 'summary')?.filters,
      timeline: lastBody<TimelineRequest>(backend, 'timeline')?.filters,
      breakdown: lastBody<BreakdownRequest>(backend, 'breakdown')?.filters,
    };
  }

  await test.step('typing in the filter box narrows the option list', async () => {
    await page.getByRole('combobox', { name: 'Users' }).click();
    await expect(page.getByRole('checkbox', { name: 'alice' })).toBeVisible();
    await expect(page.getByRole('checkbox', { name: 'bob' })).toBeVisible();

    await page.getByRole('textbox', { name: 'Filter Users' }).fill('bo');

    await expect(page.getByRole('checkbox', { name: 'bob' })).toBeVisible();
    await expect(page.getByRole('checkbox', { name: 'alice' })).toHaveCount(0);
    await page.getByRole('textbox', { name: 'Filter Users' }).fill('');
  });

  await test.step('selecting a user sends that user id', async () => {
    const sent = await filtersSentBy(() => page.getByRole('checkbox', { name: 'alice' }).click());

    expect(sent.summary?.user_ids).toEqual(['user-alice']);
    expect(sent.timeline?.user_ids).toEqual(['user-alice']);
    expect(sent.breakdown?.user_ids).toEqual(['user-alice']);
    await page.keyboard.press('Escape');
    await expect(page.getByRole('button', { name: 'Remove alice' })).toBeVisible();
  });

  await test.step('selecting an agent adds its id next to the user', async () => {
    await page.getByRole('combobox', { name: 'Agents' }).click();
    const sent = await filtersSentBy(() => page.getByRole('checkbox', { name: 'Helper' }).click());

    for (const filters of [sent.summary, sent.timeline, sent.breakdown]) {
      expect(filters?.user_ids).toEqual(['user-alice']);
      expect(filters?.agent_ids).toEqual(['agent-helper']);
    }
    await page.keyboard.press('Escape');
  });

  await test.step('selecting a group adds its id too', async () => {
    await page.getByRole('combobox', { name: 'Groups' }).click();
    const sent = await filtersSentBy(() => page.getByRole('checkbox', { name: 'research' }).click());

    for (const filters of [sent.summary, sent.timeline, sent.breakdown]) {
      expect(filters?.user_ids).toEqual(['user-alice']);
      expect(filters?.agent_ids).toEqual(['agent-helper']);
      expect(filters?.group_ids).toEqual(['group-research']);
    }
    await page.keyboard.press('Escape');
  });

  await test.step('removing the user badge drops only the user ids', async () => {
    const sent = await filtersSentBy(() => page.getByRole('button', { name: 'Remove alice' }).click());

    for (const filters of [sent.summary, sent.timeline, sent.breakdown]) {
      expect(filters?.user_ids ?? null).toBeNull();
      expect(filters?.agent_ids).toEqual(['agent-helper']);
      expect(filters?.group_ids).toEqual(['group-research']);
    }
  });
});

test.describe('user budgets', () => {
  test('the budget table filters by username and pages through the rows', async ({ page, backend }) => {
    const budgets: BudgetItemOut[] = Array.from({ length: 20 }, (_, i) => {
      const n = String(i + 1).padStart(2, '0');
      return { user_id: `user-${n}`, username: `user${n}`, spend: i + 1, budget: 100, pct_used: i + 1, status: 'ok', is_over: false };
    });
    budgets[0] = { ...budgets[0], spend: 95, pct_used: 95, status: 'danger' };
    backend.analytics = makeAnalytics({ budgets });
    await openDashboard(page);

    const budgetTable = page.getByRole('table');
    const pagination = page.getByRole('navigation', { name: 'Pagination' });

    await test.step('the first page lists 15 of 20 users with their status', async () => {
      await expect(pagination).toContainText('1-15 of 20');
      await expect(budgetTable.getByRole('row')).toHaveCount(16); // header + 15
      await expect(budgetTable.getByRole('row').filter({ hasText: 'user01' })).toContainText('HIGH');
      await expect(budgetTable.getByRole('cell', { name: 'user16', exact: true })).toHaveCount(0);
      await expect(pagination.getByRole('button', { name: 'Previous page' })).toBeDisabled();
    });

    await test.step('next page shows the remaining five', async () => {
      await pagination.getByRole('button', { name: 'Next page' }).click();

      await expect(pagination).toContainText('16-20 of 20');
      await expect(budgetTable.getByRole('row')).toHaveCount(6);
      await expect(budgetTable.getByRole('cell', { name: 'user20', exact: true })).toBeVisible();
      await expect(pagination.getByRole('button', { name: 'Next page' })).toBeDisabled();
    });

    await test.step('filtering by username returns to page one with the matches', async () => {
      await page.getByRole('textbox', { name: 'Filter by username' }).fill('user1');

      await expect(pagination).toContainText('1-10 of 10');
      await expect(budgetTable.getByRole('row')).toHaveCount(11);
      await expect(budgetTable.getByRole('cell', { name: 'user10', exact: true })).toBeVisible();
      await expect(budgetTable.getByRole('cell', { name: 'user02', exact: true })).toHaveCount(0);
    });

    await test.step('a filter with no match says so, clearing it restores the list', async () => {
      await page.getByRole('textbox', { name: 'Filter by username' }).fill('nobody');
      await expect(page.getByText('No users match')).toBeVisible();

      await page.getByRole('button', { name: 'Clear filter' }).click();

      await expect(page.getByRole('textbox', { name: 'Filter by username' })).toHaveValue('');
      await expect(pagination).toContainText('1-15 of 20');
    });

    await test.step('a smaller page size splits the list into more pages', async () => {
      await pagination.getByRole('combobox', { name: 'Rows per page' }).selectOption('5');

      await expect(pagination).toContainText('1-5 of 20');
      await expect(pagination).toContainText('1 / 4');
      await expect(budgetTable.getByRole('row')).toHaveCount(6);
    });
  });

  test('a user without a budget shows the spend only', async ({ page, backend }) => {
    backend.analytics = makeAnalytics({
      budgets: [{ user_id: 'user-carol', username: 'carol', spend: 3.2, budget: 0, pct_used: 0, status: 'ok', is_over: false }],
    });
    await openDashboard(page);

    await expect(page.getByRole('table').getByRole('row').filter({ hasText: 'carol' })).toContainText('$3.20 / no budget');
  });

  test('no budgets shows the empty state', async ({ page, backend }) => {
    backend.analytics = makeAnalytics({ budgets: [] });
    await openDashboard(page);

    await expect(page.getByText('No budget data available.')).toBeVisible();
  });
});
