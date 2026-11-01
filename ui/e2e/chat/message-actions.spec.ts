import type { Page } from '@playwright/test';
import { makeExchange, makeSession } from '../support/data';
import type { FakeBackend } from '../support/fake-backend';
import { expect, test } from '../support/test';

const QUESTION = 'Summarise Q3';
const ANSWER = 'Revenue grew 12%.\n\nMargins improved on cost cuts.';
const CODE_ANSWER =
  'Run this command:\n\n```bash\necho "hello world"\n```\n\nThen check the output.';

/** Open a stored session whose single exchange is `question` → `answer`. */
async function openExchange(
  { page, backend }: { page: Page; backend: FakeBackend },
  question: string,
  answer: string,
): Promise<void> {
  const session = makeSession({ title: question });
  backend.sessions = [session];
  backend.messages[session.session_id] = makeExchange(question, answer);
  await page.goto(`/?session_id=${session.session_id}`);
}

test.describe('copying', () => {
  test.use({ permissions: ['clipboard-read', 'clipboard-write'] });

  test('Copy message puts the message text on the clipboard', async ({ page, backend }) => {
    await openExchange({ page, backend }, QUESTION, ANSWER);
    const readClipboard = (): Promise<string> =>
      page.evaluate(() => navigator.clipboard.readText());
    const yours = page.getByRole('article', { name: 'You said' });
    const assistant = page.getByRole('article', { name: 'Assistant said' });
    await expect(yours.getByText(QUESTION)).toBeVisible();
    await expect(assistant.getByText('Revenue grew 12%.')).toBeVisible();

    await test.step('your message', async () => {
      await yours.getByRole('button', { name: 'Copy message' }).click();

      await expect.poll(readClipboard).toBe(QUESTION);
    });

    await test.step('the assistant answer', async () => {
      await assistant.getByRole('button', { name: 'Copy message' }).click();

      await expect.poll(readClipboard).toBe(ANSWER);
    });
  });

  test('Copy code puts a fenced code block on the clipboard', async ({ page, backend }) => {
    await openExchange({ page, backend }, 'How do I greet?', CODE_ANSWER);
    const assistant = page.getByRole('article', { name: 'Assistant said' });
    await expect(assistant.getByText('Then check the output.')).toBeVisible();

    await assistant.getByRole('button', { name: 'Copy code' }).click();

    await expect
      .poll(() => page.evaluate(() => navigator.clipboard.readText()))
      .toBe('echo "hello world"');
  });
});

test('Collapse all messages hides message bodies and Expand all messages shows them again', async ({
  page,
  backend,
}) => {
  await openExchange({ page, backend }, QUESTION, ANSWER);
  const assistant = page.getByRole('article', { name: 'Assistant said' });
  const detail = assistant.getByText('Margins improved on cost cuts.');
  await expect(detail).toBeVisible();

  await test.step('collapse all keeps only a one-line preview', async () => {
    await page.getByRole('button', { name: 'Collapse all messages' }).click();

    await expect(detail).toBeHidden();
    await expect(assistant.getByText('Revenue grew 12%.')).toBeVisible();
    await expect(assistant.getByRole('button', { name: 'Expand message' }).first()).toBeVisible();
  });

  await test.step('expand all restores the full answer', async () => {
    await page.getByRole('button', { name: 'Expand all messages' }).click();

    await expect(detail).toBeVisible();
    await expect(assistant.getByRole('button', { name: 'Collapse message' })).toBeVisible();
  });
});

test('the full-width choice survives a reload', async ({ page, backend }) => {
  await openExchange({ page, backend }, QUESTION, ANSWER);

  await test.step('full width is the default', async () => {
    await expect(page.getByRole('button', { name: 'Use compact width' })).toBeVisible();
  });

  await test.step('switching to compact is kept after a reload', async () => {
    await page.getByRole('button', { name: 'Use compact width' }).click();
    await expect(page.getByRole('button', { name: 'Use full width' })).toBeVisible();

    await page.reload();

    await expect(
      page.getByRole('article', { name: 'Assistant said' }).getByText('Revenue grew 12%.'),
    ).toBeVisible();
    await expect(page.getByRole('button', { name: 'Use full width' })).toBeVisible();
  });

  await test.step('switching back to full width is kept after a reload', async () => {
    await page.getByRole('button', { name: 'Use full width' }).click();
    await expect(page.getByRole('button', { name: 'Use compact width' })).toBeVisible();

    await page.reload();

    await expect(page.getByRole('button', { name: 'Use compact width' })).toBeVisible();
  });
});
