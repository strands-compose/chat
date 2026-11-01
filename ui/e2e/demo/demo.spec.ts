// Runs against the built GitHub Pages demo (playwright.demo.config.ts), not the dev server.
import { expect, test } from '../support/test';

const QUESTION = 'What is Strands Compose and what problem does it solve?';

test('the demo opens with the demo agent, its questions and the sample chats', {
  tag: '@smoke',
}, async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('button', { name: 'Demo Agent' })).toBeVisible();
  await expect(page.getByRole('button', { name: QUESTION })).toBeVisible();
  await expect(
    page
      .getByRole('region', { name: 'Chat history' })
      .getByRole('button', { name: 'Demo of Strands Compose' }),
  ).toBeVisible();
});

test('a suggested question starts the recorded workflow without any backend', async ({
  page,
  backend,
}) => {
  await page.goto('/');
  await page.getByRole('button', { name: QUESTION }).click();

  await expect(page.getByRole('article', { name: 'You said' }).getByText(QUESTION)).toBeVisible();
  const workflow = page.getByRole('region', { name: 'Workflow' });
  await expect(workflow.getByText('Running')).toBeVisible();
  await expect(workflow.getByRole('button', { name: /Collapse Doc Expert/i })).toBeVisible();
  expect(backend.requests).toEqual([]);
});
