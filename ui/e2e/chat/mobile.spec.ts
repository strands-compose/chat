import { makeExchange, makeSession } from '../support/data';
import { expect, test } from '../support/test';

test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });

test('the sidebar starts collapsed and picking a session returns to the chat', async ({
  page,
  backend,
}) => {
  const budget = makeSession({ title: 'Budget review' });
  backend.sessions = [budget];
  backend.messages[budget.session_id] = makeExchange('How is the budget?', 'Spending is on plan.');

  await page.goto('/');
  const history = page.getByRole('region', { name: 'Chat history' });

  await test.step('the sidebar is collapsed', async () => {
    await expect(page.getByRole('button', { name: 'Expand sidebar' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Collapse sidebar' })).toHaveCount(0);
    await expect(history.getByRole('button', { name: 'Budget review' })).toHaveCount(0);
  });

  await test.step('opening it lists the sessions', async () => {
    await page.getByRole('button', { name: 'Expand sidebar' }).click();

    await expect(page.getByRole('button', { name: 'Collapse sidebar' })).toBeVisible();
    await expect(history.getByRole('button', { name: 'Budget review' })).toBeVisible();
  });

  await test.step('picking a session closes the sidebar and shows its messages', async () => {
    await history.getByRole('button', { name: 'Budget review' }).click();

    await expect(page.getByText('Spending is on plan.')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Expand sidebar' })).toBeVisible();
    await expect(history.getByRole('button', { name: 'Budget review' })).toHaveCount(0);
  });
});

test('the welcome screen has no agent description control', async ({ page, backend }) => {
  const agent = backend.agents[0];
  expect(agent.description?.trim()).toBeTruthy();

  await page.goto('/');
  // The agent has loaded once its suggested questions are listed.
  await expect(
    page.getByRole('button', { name: agent.suggested_questions?.[0] ?? '' }),
  ).toBeVisible();

  await expect(page.getByRole('button', { name: 'Show agent description' })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Hide agent description' })).toHaveCount(0);
});

test('when a turn completes the workflow panel closes and the answer is visible', async ({
  page,
  backend,
}) => {
  const gate = backend.holdReply();

  await page.goto('/');
  const composer = page.getByRole('textbox', { name: 'Message' });
  await composer.fill('Say hello');
  await composer.press('Enter');

  const workflow = page.getByRole('region', { name: 'Workflow' });

  await test.step('while the agent works the workflow panel is open', async () => {
    await expect(workflow).toBeVisible();
    await expect(workflow.getByText('Running', { exact: true })).toBeVisible();
  });

  await test.step('once it completes the panel closes and the answer shows', async () => {
    gate.release();

    await expect(workflow).toBeHidden();
    await expect(
      page.getByRole('article', { name: 'Assistant said' }).getByText('Done.'),
    ).toBeVisible();
    await expect(composer).toBeEnabled();
  });
});
