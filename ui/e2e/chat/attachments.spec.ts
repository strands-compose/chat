import type { Page } from '@playwright/test';
import { test, expect } from '../support/test';
import { makeAgent, makeCapabilities } from '../support/data';
import { streamTurn } from '../support/sse';

/** A valid 1x1 PNG, so the chip thumbnail really renders. */
const PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
  'base64',
);

interface PickedFile {
  name: string;
  mimeType: string;
  buffer: Buffer;
}

/** Opens the Add attachment menu, chooses a category and hands the files to the native picker. */
async function pickFiles(page: Page, category: 'Image' | 'Document', files: PickedFile[]): Promise<void> {
  await page.getByRole('button', { name: 'Add attachment' }).click();
  const chooser = page.waitForEvent('filechooser');
  await page.getByRole('menuitem', { name: category }).click();
  await (await chooser).setFiles(files);
}

const shot: PickedFile = { name: 'shot.png', mimeType: 'image/png', buffer: PNG };

test('an attached image is sent as multipart and shown on the user message', async ({ page, backend }) => {
  backend.reply = streamTurn({ text: 'I can see the image.' });

  await page.goto('/');
  const composer = page.getByRole('textbox', { name: 'Message' });
  await expect(page.getByRole('button', { name: 'Add attachment' })).toBeEnabled();

  await test.step('picking an image adds a chip', async () => {
    await pickFiles(page, 'Image', [shot]);

    await expect(page.getByRole('button', { name: 'Preview shot.png' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Remove shot.png' })).toBeVisible();
    await expect(page.getByAltText('shot.png')).toBeVisible();
  });

  await test.step('sending posts the payload JSON and one file part', async () => {
    const invocations = (): number => backend.requestsTo('POST', '/api/v1/invocations').length;
    const before = invocations();

    await composer.fill('What is in this picture?');
    await composer.press('Enter');

    await expect.poll(invocations).toBe(before + 1);
    const sent = backend.requestsTo('POST', '/api/v1/invocations').at(-1);
    expect(sent?.body).toEqual({ prompt: 'What is in this picture?', agent_id: backend.agents[0].id });
    expect(sent?.files).toEqual([{ field: 'file:0', filename: 'shot.png', type: 'image/png', size: PNG.length }]);
  });

  await test.step('the attachment moves from the composer to the user message', async () => {
    const userMessage = page.getByRole('article', { name: 'You said' });
    await expect(userMessage.getByText('shot.png')).toBeVisible();
    await expect(userMessage.getByText(`Image · ${PNG.length}.00 B`)).toBeVisible();
    await expect(page.getByRole('button', { name: 'Preview shot.png' })).toBeHidden();
    await expect(page.getByRole('article', { name: 'Assistant said' }).getByText('I can see the image.')).toBeVisible();
  });
});

test('Remove drops an attachment before sending, so the message goes out without files', async ({ page, backend }) => {
  await page.goto('/');
  const composer = page.getByRole('textbox', { name: 'Message' });
  await expect(page.getByRole('button', { name: 'Add attachment' })).toBeEnabled();

  await pickFiles(page, 'Image', [shot]);
  await expect(page.getByRole('button', { name: 'Preview shot.png' })).toBeVisible();

  await page.getByRole('button', { name: 'Remove shot.png' }).click();
  await expect(page.getByRole('button', { name: 'Preview shot.png' })).toBeHidden();

  await composer.fill('Never mind the picture');
  await composer.press('Enter');

  await expect(page.getByRole('article', { name: 'Assistant said' }).getByText('Done.')).toBeVisible();
  const sent = backend.requestsTo('POST', '/api/v1/invocations');
  expect(sent).toHaveLength(1);
  expect(sent[0].files).toEqual([]);
  expect(sent[0].body).toEqual({ prompt: 'Never mind the picture', agent_id: backend.agents[0].id });
});

test('an unsupported file type shows an error dialog and attaches nothing', async ({ page, backend }) => {
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Add attachment' })).toBeEnabled();

  await pickFiles(page, 'Image', [{ name: 'run.exe', mimeType: 'application/x-msdownload', buffer: Buffer.from('MZ') }]);

  const dialog = page.getByRole('alertdialog', { name: 'Unsupported file type' });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByText(/run\.exe/)).toBeVisible();
  await expect(page.getByRole('button', { name: 'Preview run.exe' })).toBeHidden();

  await dialog.getByRole('button', { name: 'OK' }).click();
  await expect(dialog).toBeHidden();
  expect(backend.requestsTo('POST', '/api/v1/invocations')).toEqual([]);
});

test('a file over the size limit shows an error dialog and attaches nothing', async ({ page, backend }) => {
  backend.capabilities = makeCapabilities({ max_file_bytes: 1024 });

  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Add attachment' })).toBeEnabled();

  await pickFiles(page, 'Image', [{ name: 'big.png', mimeType: 'image/png', buffer: Buffer.alloc(2048, 1) }]);

  const dialog = page.getByRole('alertdialog', { name: 'Attachment too large' });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByText(/per-file limit/)).toBeVisible();
  await expect(page.getByRole('button', { name: 'Preview big.png' })).toBeHidden();

  await dialog.getByRole('button', { name: 'OK' }).click();
  await expect(dialog).toBeHidden();
  expect(backend.requestsTo('POST', '/api/v1/invocations')).toEqual([]);
});

test('an agent without multimodal support explains why upload is unavailable', async ({ page, backend }) => {
  backend.agents = [makeAgent({ multimodal: false })];

  await page.goto('/');
  const unsupported = page.getByRole('button', { name: 'File upload not supported' });
  await expect(unsupported).toBeVisible();
  await expect(page.getByRole('button', { name: 'Add attachment' })).toHaveCount(0);

  await unsupported.click();

  const dialog = page.getByRole('alertdialog', { name: 'File upload not supported' });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByText(/does not support file upload/)).toBeVisible();

  await dialog.getByRole('button', { name: 'OK' }).click();
  await expect(dialog).toBeHidden();
});
