import { DEMO_TURN, streamTurn } from '../support/sse';
import { expect, test } from '../support/test';

test('a new chat streams the answer and becomes a saved session', { tag: '@smoke' }, async ({
  page,
  backend,
}) => {
  backend.reply = streamTurn({
    text: 'The weather in Oslo is sunny.',
    tools: [{ name: 'get_weather', input: { city: 'Oslo' }, result: 'sunny' }],
  });

  await page.goto('/');
  const composer = page.getByRole('textbox', { name: 'Message' });

  await test.step('send the first message', async () => {
    await composer.fill('What is the weather in Oslo?');
    await composer.press('Enter');
  });

  await test.step('the answer and the workflow panel appear', async () => {
    await expect(
      page
        .getByRole('article', { name: 'Assistant said' })
        .getByText('The weather in Oslo is sunny.'),
    ).toBeVisible();
    const workflow = page.getByRole('region', { name: 'Workflow' });
    await expect(workflow.getByText('Completed')).toBeVisible();
    await expect(workflow.getByRole('button', { name: 'Close workflow panel' })).toBeVisible();
  });

  await test.step('the turn was sent as a new session and the URL follows', async () => {
    const sent = backend.requestsTo('POST', '/api/v1/invocations');
    expect(sent).toHaveLength(1);
    expect(sent[0].body).toEqual({
      prompt: 'What is the weather in Oslo?',
      agent_id: backend.agents[0].id,
    });
    await expect(page).toHaveURL(/[?&]session_id=new-session-\d+/);
    await expect(
      page.getByRole('region', { name: 'Chat history' }).getByText('What is the weather in Oslo?'),
    ).toBeVisible();
  });
});

test('a follow-up turn sends the minted session_id and keeps both answers visible', async ({
  page,
  backend,
}) => {
  backend.reply = (request) => streamTurn({ text: `Answer to: ${request.prompt}` });

  await page.goto('/');
  const composer = page.getByRole('textbox', { name: 'Message' });

  await test.step('the first turn creates the session', async () => {
    await composer.fill('First question');
    await composer.press('Enter');
    await expect(page.getByRole('main').getByText('Answer to: First question')).toBeVisible();
    await expect(page).toHaveURL(/[?&]session_id=new-session-\d+/);
    await expect(composer).toBeEnabled();
  });

  await test.step('the follow-up reuses that session and both answers stay', async () => {
    const sessionId = new URL(page.url()).searchParams.get('session_id');
    expect(sessionId).toMatch(/^new-session-\d+$/);
    const invocations = (): number => backend.requestsTo('POST', '/api/v1/invocations').length;
    const before = invocations();

    await composer.fill('Second question');
    await composer.press('Enter');

    await expect.poll(invocations).toBe(before + 1);
    expect(backend.requestsTo('POST', '/api/v1/invocations').at(-1)?.body).toEqual({
      prompt: 'Second question',
      agent_id: backend.agents[0].id,
      session_id: sessionId,
    });
    await expect(page.getByRole('main').getByText('Answer to: Second question')).toBeVisible();
    await expect(page.getByRole('main').getByText('Answer to: First question')).toBeVisible();
    const thread = page.getByRole('main');
    await expect(thread.getByText('First question', { exact: true })).toBeVisible();
    await expect(thread.getByText('Second question', { exact: true })).toBeVisible();
  });
});

test('the workflow panel lists the agents and tools of a recorded turn and folds a nested run', async ({
  page,
  backend,
}) => {
  backend.reply = DEMO_TURN;

  await page.goto('/');
  const composer = page.getByRole('textbox', { name: 'Message' });
  await composer.fill('What is Strands Compose?');
  await composer.press('Enter');

  const workflow = page.getByRole('region', { name: 'Workflow' });

  await test.step('the finished turn lists every agent run and tool', async () => {
    await expect(workflow.getByText('Completed', { exact: true })).toBeVisible();
    await expect(workflow.getByRole('button', { name: 'Collapse Main' })).toBeVisible();
    await expect(workflow.getByRole('button', { name: 'Collapse Developer' })).toBeVisible();
    await expect(workflow.getByRole('button', { name: 'Collapse Doc Expert' })).toHaveCount(3);
    await expect(workflow.getByText('×3', { exact: true })).toBeVisible();
    await expect(workflow.getByRole('button', { name: /^Ask Developer/ })).toBeVisible();
    await expect(workflow.getByText('list docs', { exact: true })).toHaveCount(2);
    await expect(workflow.getByText('read doc', { exact: true })).toHaveCount(5);
  });

  await test.step('collapsing the nested Developer run hides its tools, expanding restores them', async () => {
    await workflow.getByRole('button', { name: 'Collapse Developer' }).click();
    await expect(workflow.getByRole('button', { name: 'Expand Developer' })).toBeVisible();
    await expect(workflow.getByText('list docs', { exact: true })).toHaveCount(1);
    await expect(workflow.getByText('read doc', { exact: true })).toHaveCount(2);

    await workflow.getByRole('button', { name: 'Expand Developer' }).click();
    await expect(workflow.getByRole('button', { name: 'Collapse Developer' })).toBeVisible();
    await expect(workflow.getByText('list docs', { exact: true })).toHaveCount(2);
    await expect(workflow.getByText('read doc', { exact: true })).toHaveCount(5);
  });
});
