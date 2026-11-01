import { streamTurn } from '../support/sse';
import { expect, test } from '../support/test';

test('a running turn shows Running and Stop generation and locks the composer', async ({
  page,
  backend,
}) => {
  const gate = backend.holdReply();

  await page.goto('/');
  const composer = page.getByRole('textbox', { name: 'Message' });
  await composer.fill('Long task');
  await composer.press('Enter');

  await expect(
    page.getByRole('region', { name: 'Workflow' }).getByText('Running', { exact: true }),
  ).toBeVisible();
  await expect(page.getByRole('button', { name: 'Stop generation' })).toBeVisible();
  await expect(composer).toBeDisabled();
  await expect(page.getByRole('main').getByText('Long task', { exact: true })).toBeVisible();

  gate.release();
  await expect(composer).toBeEnabled();
});

test('stopping a running turn after confirming shows the stop notice and frees the composer', async ({
  page,
  backend,
}) => {
  backend.holdReply();

  await page.goto('/');
  const composer = page.getByRole('textbox', { name: 'Message' });
  await composer.fill('Long task');
  await composer.press('Enter');

  const dialog = page.getByRole('alertdialog', { name: 'Agent is running' });
  await page.getByRole('button', { name: 'Stop generation' }).click();
  await dialog.getByRole('button', { name: 'Stop agent' }).click();

  await expect(dialog).toBeHidden();
  await expect(page.getByRole('main').getByText('Generation stopped by user.')).toBeVisible();
  await expect(composer).toBeEnabled();

  await test.step('the next message goes through', async () => {
    await composer.fill('Try again');
    await composer.press('Enter');
    await expect(page.getByRole('main').getByText('Done.', { exact: true })).toBeVisible();
  });
});

test('choosing Keep running leaves the turn going and the answer still arrives', async ({
  page,
  backend,
}) => {
  backend.reply = streamTurn({ text: 'Finished the long task.' });
  const gate = backend.holdReply();

  await page.goto('/');
  const composer = page.getByRole('textbox', { name: 'Message' });
  await composer.fill('Long task');
  await composer.press('Enter');

  const dialog = page.getByRole('alertdialog', { name: 'Agent is running' });
  await page.getByRole('button', { name: 'Stop generation' }).click();
  await dialog.getByRole('button', { name: 'Keep running' }).click();

  await expect(dialog).toBeHidden();
  await expect(
    page.getByRole('region', { name: 'Workflow' }).getByText('Running', { exact: true }),
  ).toBeVisible();
  await expect(composer).toBeDisabled();

  gate.release();

  await expect(page.getByRole('main').getByText('Finished the long task.')).toBeVisible();
  await expect(
    page.getByRole('region', { name: 'Workflow' }).getByText('Completed', { exact: true }),
  ).toBeVisible();
  await expect(composer).toBeEnabled();
});

test('starting a new chat while the agent runs asks for confirmation before leaving', async ({
  page,
  backend,
}) => {
  backend.holdReply();

  await page.goto('/');
  const composer = page.getByRole('textbox', { name: 'Message' });
  await composer.fill('Long task');
  await composer.press('Enter');
  await expect(page.getByRole('button', { name: 'Stop generation' })).toBeVisible();

  const dialog = page.getByRole('alertdialog', { name: 'Agent is running' });

  await test.step('declining keeps the running turn', async () => {
    await page.getByRole('button', { name: 'New chat' }).click();
    await dialog.getByRole('button', { name: 'Keep running' }).click();
    await expect(dialog).toBeHidden();
    await expect(page.getByRole('main').getByText('Long task', { exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Stop generation' })).toBeVisible();
  });

  await test.step('confirming stops the agent and opens an empty chat', async () => {
    await page.getByRole('button', { name: 'New chat' }).click();
    await dialog.getByRole('button', { name: 'Stop agent' }).click();
    await expect(dialog).toBeHidden();
    await expect(page.getByRole('main').getByText('Long task', { exact: true })).toBeHidden();
    await expect(composer).toBeEnabled();
  });
});
