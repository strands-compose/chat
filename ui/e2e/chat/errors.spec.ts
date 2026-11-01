import { errorTurn, streamTurn } from '../support/sse';
import { expect, test } from '../support/test';

test('an invocation refused with Problem Details shows its detail as a failed turn', async ({
  page,
}) => {
  await page.route(
    '**/api/v1/invocations',
    (route) =>
      route.fulfill({
        status: 402,
        contentType: 'application/problem+json',
        json: { detail: 'Monthly budget exceeded.' },
      }),
    { times: 1 },
  );

  await page.goto('/');
  const composer = page.getByRole('textbox', { name: 'Message' });
  await composer.fill('Hi');
  await composer.press('Enter');

  await expect(page.getByRole('main').getByText('Monthly budget exceeded.')).toBeVisible();
  await expect(composer).toBeEnabled();
});

test('a refused follow-up turn does not show the previous turn as its workflow', async ({
  page,
  backend,
}) => {
  backend.reply = streamTurn({
    text: 'It is sunny today.',
    tools: [{ name: 'get_weather', input: { day: 'today' }, result: 'sunny' }],
  });

  await page.goto('/');
  const composer = page.getByRole('textbox', { name: 'Message' });
  const workflow = page.getByRole('region', { name: 'Workflow' });
  await composer.fill('Weather today?');
  await composer.press('Enter');
  await expect(workflow.getByText('Completed')).toBeVisible();

  await page.route(
    '**/api/v1/invocations',
    (route) => route.fulfill({ status: 402, json: { detail: 'Monthly budget exceeded.' } }),
    { times: 1 },
  );
  await composer.fill('And tomorrow?');
  await composer.press('Enter');

  await expect(page.getByRole('main').getByText('Monthly budget exceeded.')).toBeVisible();
  await expect(workflow).toBeHidden();

  await test.step('the earlier turn can still be opened from its message', async () => {
    await page
      .getByRole('article', { name: 'Assistant said' })
      .filter({ hasText: 'It is sunny today.' })
      .getByRole('button', { name: 'Workflow' })
      .click();
    await expect(workflow.getByText('Completed')).toBeVisible();
    await expect(workflow.getByText('get weather')).toBeVisible();
  });
});

test('an error event in the stream shows a failed turn, Error and the steps that ran before it', async ({
  page,
  backend,
}) => {
  backend.reply = errorTurn('Model throttled.', {
    tools: [{ name: 'get_weather', input: { city: 'Oslo' }, result: 'sunny' }],
  });

  await page.goto('/');
  const composer = page.getByRole('textbox', { name: 'Message' });
  await composer.fill('Hi');
  await composer.press('Enter');

  const workflow = page.getByRole('region', { name: 'Workflow' });
  await expect(page.getByRole('main').getByText('Model throttled.')).toBeVisible();
  await expect(workflow.getByText('Error', { exact: true })).toBeVisible();
  await expect(workflow.getByText('get weather')).toBeVisible();
  await expect(composer).toBeEnabled();
});

test('a transport failure shows a failed turn and leaves the composer usable', async ({ page }) => {
  await page.route('**/api/v1/invocations', (route) => route.abort('failed'), { times: 1 });

  await page.goto('/');
  const composer = page.getByRole('textbox', { name: 'Message' });
  await composer.fill('Hi');
  await composer.press('Enter');

  await expect(page.getByRole('main').getByText(/failed to fetch/i)).toBeVisible();
  await expect(composer).toBeEnabled();

  await test.step('the next message goes through', async () => {
    await composer.fill('Hi again');
    await composer.press('Enter');
    await expect(page.getByRole('main').getByText('Done.', { exact: true })).toBeVisible();
  });
});

test('Resend message sends the same prompt again', async ({ page, backend }) => {
  backend.reply = (request) => streamTurn({ text: `You said: ${request.prompt}` });

  await page.goto('/');
  const composer = page.getByRole('textbox', { name: 'Message' });
  await composer.fill('Summarise Q3');
  await composer.press('Enter');
  await expect(page.getByRole('main').getByText('You said: Summarise Q3')).toBeVisible();
  await expect(composer).toBeEnabled();

  const invocations = (): number => backend.requestsTo('POST', '/api/v1/invocations').length;
  const before = invocations();

  await page.getByRole('button', { name: 'Resend message' }).click();

  await expect.poll(invocations).toBe(before + 1);
  expect(backend.requestsTo('POST', '/api/v1/invocations').at(-1)?.body).toMatchObject({
    prompt: 'Summarise Q3',
    agent_id: backend.agents[0].id,
  });
  await expect(page.getByRole('main').getByText('You said: Summarise Q3')).toHaveCount(2);
});
