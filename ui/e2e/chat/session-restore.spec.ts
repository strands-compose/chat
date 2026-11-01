import { test, expect } from '../support/test';
import { makeAgent, makeExchange, makeSession, makeSessionUsage } from '../support/data';

const NOW = new Date('2026-07-15T12:00:00Z');

const SESSION_USAGE = makeSessionUsage({
  input_tokens: 1200,
  output_tokens: 300,
  cache_read_input_tokens: 0,
  cache_write_input_tokens: 0,
  total_cost: 0.5,
});

test('opening a session before the agent list has loaded still shows the agent name', async ({ page, backend }) => {
  const research = makeAgent({ id: 'agent-research', name: 'Research Agent', suggested_questions: [] });
  backend.agents = [makeAgent(), research];
  const oslo = makeSession({ title: 'Oslo trip', agent_id: research.id });
  backend.sessions = [oslo];
  backend.messages[oslo.session_id] = makeExchange('What should I pack for Oslo?', 'Pack layers and a rain jacket.');

  // Hold the agent list so the session is opened while it is still loading.
  let releaseAgents = (): void => {};
  const agentsHeld = new Promise<void>((resolve) => {
    releaseAgents = resolve;
  });
  await page.route('**/api/v1/agents', async (route) => {
    await agentsHeld;
    await route.fulfill({ json: backend.agents });
  });

  // The welcome screen starts the agent fetch on mount; open the session only once it is in flight.
  const agentsRequested = page.waitForRequest('**/api/v1/agents');
  await page.goto('/');
  await agentsRequested;
  await page.getByRole('region', { name: 'Chat history' }).getByRole('button', { name: 'Oslo trip' }).click();
  await expect(page.getByRole('article', { name: 'Assistant said' }).getByText('Pack layers and a rain jacket.')).toBeVisible();

  releaseAgents();

  await expect(page.getByText('Research Agent', { exact: true })).toBeVisible();
  await expect(page.getByText('agent-research')).toHaveCount(0);
});

test('restoring a session from the sidebar shows its messages, agent and usage', async ({ page, backend }) => {
  await page.clock.setFixedTime(NOW);
  backend.now = () => NOW;

  const research = makeAgent({ id: 'agent-research', name: 'Research Agent', suggested_questions: [] });
  backend.agents = [makeAgent(), research];
  backend.sessionUsage = SESSION_USAGE;

  const budget = makeSession({
    title: 'Budget review',
    last_used_at: '2026-07-15T08:30:00',
    agent_id: backend.agents[0].id,
  });
  const oslo = makeSession({ title: 'Oslo trip', last_used_at: '2026-07-14T06:00:00', agent_id: research.id });
  const hiring = makeSession({ title: 'Hiring plan', last_used_at: '2026-07-11T12:00:00' });
  const old = makeSession({ title: 'Old notes', last_used_at: '2026-06-20T12:00:00' });
  backend.sessions = [budget, oslo, hiring, old];
  backend.messages[budget.session_id] = makeExchange('How is the budget?', 'Spending is on plan.');
  backend.messages[oslo.session_id] = makeExchange('What should I pack for Oslo?', 'Pack layers and a rain jacket.');

  await page.goto('/');
  const history = page.getByRole('region', { name: 'Chat history' });
  // The welcome screen's agent selector shows the default agent once the agent list has loaded.
  await expect(page.getByRole('button', { name: 'Demo Agent' })).toBeVisible();

  await test.step('sessions are grouped by day, newest group first', async () => {
    await expect(history.getByText(/^(Today|Yesterday|This week|Older)$/)).toHaveText([
      'Today',
      'Yesterday',
      'This week',
      'Older',
    ]);
    await expect(history.getByRole('list', { name: 'Today' }).getByRole('button', { name: 'Budget review' })).toBeVisible();
    await expect(history.getByRole('list', { name: 'Yesterday' }).getByRole('button', { name: 'Oslo trip' })).toBeVisible();
    await expect(history.getByRole('list', { name: 'This week' }).getByRole('button', { name: 'Hiring plan' })).toBeVisible();
    await expect(history.getByRole('list', { name: 'Older' }).getByRole('button', { name: 'Old notes' })).toBeVisible();
  });

  await test.step('clicking a session loads its messages, agent and usage', async () => {
    await history.getByRole('button', { name: 'Oslo trip' }).click();

    await expect(page.getByText('Pack layers and a rain jacket.')).toBeVisible();
    await expect(page.getByText('What should I pack for Oslo?')).toBeVisible();
    await expect(page.getByText('Research Agent', { exact: true })).toBeVisible();
    await expect(page).toHaveURL(new RegExp(`[?&]session_id=${oslo.session_id}(&|$)`));

    const usage = page.getByRole('group', { name: 'Session usage' });
    await expect(usage).toContainText('$0.50');
    await usage.getByRole('button', { name: /^Tokens\s*1\s500$/ }).click();
    await expect(page.getByText('Input tokens')).toBeVisible();
    await expect(page.getByText(/^1\s200$/)).toBeVisible();
    await expect(page.getByText('Output tokens')).toBeVisible();
    await expect(page.getByText(/^300$/)).toBeVisible();
    await page.keyboard.press('Escape');
  });

  await test.step('switching to another session replaces the thread and the agent', async () => {
    await history.getByRole('button', { name: 'Budget review' }).click();

    await expect(page.getByText('Spending is on plan.')).toBeVisible();
    await expect(page.getByText('Pack layers and a rain jacket.')).toHaveCount(0);
    await expect(page.getByText('Demo Agent', { exact: true })).toBeVisible();
    await expect(page).toHaveURL(new RegExp(`[?&]session_id=${budget.session_id}(&|$)`));
  });
});

test('a session_id deep link restores that session', async ({ page, backend }) => {
  const research = makeAgent({ id: 'agent-research', name: 'Research Agent', suggested_questions: [] });
  backend.agents = [makeAgent(), research];
  backend.sessionUsage = SESSION_USAGE;

  const session = makeSession({ title: 'Quarterly report', agent_id: research.id });
  backend.sessions = [session];
  backend.messages[session.session_id] = makeExchange('Summarise Q3', 'Revenue grew 12%.');

  await page.goto(`/?session_id=${session.session_id}`);

  await expect(page.getByText('Revenue grew 12%.')).toBeVisible();
  await expect(page.getByText('Summarise Q3')).toBeVisible();
  await expect(page.getByText('Research Agent', { exact: true })).toBeVisible();
  await expect(
    page.getByRole('group', { name: 'Session usage' }).getByRole('button', { name: /^Tokens\s*1\s500$/ }),
  ).toBeVisible();
  await expect(page.getByRole('region', { name: 'Chat history' }).getByRole('button', { name: 'Quarterly report' })).toBeVisible();
  await expect(page).toHaveURL(new RegExp(`[?&]session_id=${session.session_id}(&|$)`));
});

test.describe('unknown session id', () => {
  // The store logs the refused restore; the user-visible fallback is asserted below.
  test.use({ consoleErrors: { allow: [/^\[chatStore\] restoreSession failed:/] } });

  test('falls back to the new-chat state and drops the param from the URL', async ({ page, backend }) => {
    const known = makeSession({ title: 'Quarterly report' });
    backend.sessions = [known];
    backend.messages[known.session_id] = makeExchange('Summarise Q3', 'Revenue grew 12%.');

    await page.goto('/?session_id=ghost-session');

    await expect(page.getByRole('heading', { name: /Welcome to/ })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Message' })).toBeEnabled();
    await expect(page).not.toHaveURL(/session_id=/);
    expect(backend.requestsTo('GET', '/api/v1/sessions/ghost-session/messages').length).toBeGreaterThan(0);
    await expect(page.getByText('Revenue grew 12%.')).toHaveCount(0);
  });
});
