import { makeAgent } from '../support/data';
import { expect, test } from '../support/test';

test('clicking a suggested question sends exactly that prompt to the shown agent', async ({
  page,
  backend,
}) => {
  const agent = backend.agents[0];
  const suggestions = agent.suggested_questions ?? [];
  expect(suggestions.length).toBeGreaterThan(1);

  await page.goto('/');

  await test.step('the agent and its suggested questions are shown', async () => {
    await expect(page.getByRole('button', { name: agent.name, exact: true })).toBeVisible();
    for (const question of suggestions) {
      await expect(page.getByRole('button', { name: question })).toBeVisible();
    }
  });

  await test.step('clicking one sends that prompt', async () => {
    await page.getByRole('button', { name: suggestions[1] }).click();

    await expect(
      page.getByRole('article', { name: 'You said' }).getByText(suggestions[1]),
    ).toBeVisible();
    await expect(
      page.getByRole('article', { name: 'Assistant said' }).getByText('Done.'),
    ).toBeVisible();
    const sent = backend.requestsTo('POST', '/api/v1/invocations');
    expect(sent).toHaveLength(1);
    expect(sent[0].body).toEqual({ prompt: suggestions[1], agent_id: agent.id });
  });
});

test('the agent description panel opens and closes', async ({ page, backend }) => {
  backend.agents = [makeAgent({ description: 'Answers questions about invoices and refunds.' })];

  await page.goto('/');
  const description = page.getByText('Answers questions about invoices and refunds.');
  await expect(page.getByRole('button', { name: 'Show agent description' })).toBeVisible();
  await expect(description).toBeHidden();

  await test.step('the help button opens the panel', async () => {
    await page.getByRole('button', { name: 'Show agent description' }).click();

    await expect(description).toBeVisible();
    await expect(page.getByRole('button', { name: 'Hide agent description' })).toBeVisible();
  });

  await test.step('the close button inside the panel closes it', async () => {
    await page.getByRole('button', { name: 'Close description panel' }).click();

    await expect(description).toBeHidden();
    await expect(page.getByRole('button', { name: 'Show agent description' })).toBeVisible();
  });

  await test.step('the help button toggles it open and shut again', async () => {
    await page.getByRole('button', { name: 'Show agent description' }).click();
    await expect(description).toBeVisible();

    await page.getByRole('button', { name: 'Hide agent description' }).click();

    await expect(description).toBeHidden();
  });
});

test('?agent_id= preselects that agent for the first message', async ({ page, backend }) => {
  const alpha = makeAgent({
    id: 'agent-alpha',
    name: 'Alpha',
    suggested_questions: ['Ask Alpha something'],
  });
  const beta = makeAgent({
    id: 'agent-beta',
    name: 'Beta',
    suggested_questions: ['Ask Beta something'],
  });
  backend.agents = [alpha, beta];

  await page.goto(`/?agent_id=${beta.id}`);

  await test.step('Beta is selected, not the first agent in the list', async () => {
    await expect(page.getByRole('button', { name: 'Beta', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Alpha', exact: true })).toBeHidden();
    await expect(page.getByRole('button', { name: 'Ask Beta something' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Ask Alpha something' })).toBeHidden();
  });

  await test.step('the turn is sent to Beta', async () => {
    await page.getByRole('button', { name: 'Ask Beta something' }).click();

    await expect(
      page.getByRole('article', { name: 'Assistant said' }).getByText('Done.'),
    ).toBeVisible();
    const sent = backend.requestsTo('POST', '/api/v1/invocations');
    expect(sent).toHaveLength(1);
    expect(sent[0].body).toEqual({ prompt: 'Ask Beta something', agent_id: beta.id });
  });
});

test('without any agents the welcome screen explains it and offers no composer', async ({
  page,
  backend,
}) => {
  backend.agents = [];

  await page.goto('/');

  await expect(page.getByRole('alert')).toContainText(/do not have access to any AI agents/i);
  await expect(page.getByRole('textbox', { name: 'Message' })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Send message' })).toHaveCount(0);
  expect(backend.requestsTo('POST', '/api/v1/invocations')).toEqual([]);
});
