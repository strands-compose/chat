import type { Page } from '@playwright/test';
import { test, expect } from '../support/test';
import { makeExchange, makeSession } from '../support/data';

const NOW = new Date('2026-07-15T12:00:00Z');

/** The sidebar row of a session. Its actions show on hover only. */
function sessionRow(page: Page, title: string) {
  return page
    .getByRole('region', { name: 'Chat history' })
    .getByRole('listitem')
    .filter({ has: page.getByRole('button', { name: title, exact: true }) });
}

test('renaming a session sends one PATCH with the new title and shows it', async ({ page, backend }) => {
  await page.clock.setFixedTime(NOW);
  backend.now = () => NOW;
  const trip = makeSession({ title: 'Travel plan', last_used_at: '2026-07-15T08:00:00' });
  const report = makeSession({ title: 'Quarterly report', last_used_at: '2026-07-15T07:00:00' });
  backend.sessions = [trip, report];

  await page.goto('/');
  const patches = (): number => backend.requestsTo('PATCH', `/api/v1/sessions/${trip.session_id}`).length;
  const before = patches();

  await sessionRow(page, 'Travel plan').hover();
  await sessionRow(page, 'Travel plan').getByRole('button', { name: 'Rename session' }).click();

  const dialog = page.getByRole('dialog', { name: 'Rename Session' });
  const nameField = dialog.getByRole('textbox', { name: 'Session Name' });
  await expect(nameField).toHaveValue('Travel plan');
  await nameField.fill('Trip to Oslo');
  await dialog.getByRole('button', { name: 'Rename', exact: true }).click();

  await expect.poll(patches).toBe(before + 1);
  expect(backend.requestsTo('PATCH', `/api/v1/sessions/${trip.session_id}`).at(-1)?.body).toEqual({
    title: 'Trip to Oslo',
  });
  await expect(dialog).toBeHidden();
  await expect(sessionRow(page, 'Trip to Oslo')).toBeVisible();
  await expect(sessionRow(page, 'Travel plan')).toHaveCount(0);
  await expect(sessionRow(page, 'Quarterly report')).toBeVisible();
});

test('deleting a session asks for confirmation, sends one DELETE and clears the chat if it was open', async ({
  page,
  backend,
}) => {
  await page.clock.setFixedTime(NOW);
  backend.now = () => NOW;
  const open = makeSession({ title: 'Open chat', last_used_at: '2026-07-15T08:00:00' });
  const other = makeSession({ title: 'Other chat', last_used_at: '2026-07-15T07:00:00' });
  backend.sessions = [open, other];
  backend.messages[open.session_id] = makeExchange('Tell me a fact', 'Octopuses have three hearts.');

  await page.goto('/');
  const deletes = (id: string): number => backend.requestsTo('DELETE', `/api/v1/sessions/${id}`).length;
  const dialog = page.getByRole('alertdialog', { name: 'Delete Session' });

  await page.getByRole('region', { name: 'Chat history' }).getByRole('button', { name: 'Open chat' }).click();
  await expect(page.getByText('Octopuses have three hearts.')).toBeVisible();

  await test.step('cancelling the confirmation keeps the session', async () => {
    const before = deletes(other.session_id);
    await sessionRow(page, 'Other chat').hover();
    await sessionRow(page, 'Other chat').getByRole('button', { name: 'Delete session' }).click();
    await expect(dialog).toBeVisible();
    await dialog.getByRole('button', { name: 'Cancel' }).click();

    await expect(dialog).toBeHidden();
    await expect(sessionRow(page, 'Other chat')).toBeVisible();
    expect(deletes(other.session_id)).toBe(before);
  });

  await test.step('deleting a session that is not open leaves the open chat alone', async () => {
    const before = deletes(other.session_id);
    await sessionRow(page, 'Other chat').hover();
    await sessionRow(page, 'Other chat').getByRole('button', { name: 'Delete session' }).click();
    await dialog.getByRole('button', { name: 'Delete', exact: true }).click();

    await expect.poll(() => deletes(other.session_id)).toBe(before + 1);
    await expect(sessionRow(page, 'Other chat')).toHaveCount(0);
    await expect(page.getByText('Octopuses have three hearts.')).toBeVisible();
    await expect(page).toHaveURL(new RegExp(`[?&]session_id=${open.session_id}(&|$)`));
  });

  await test.step('deleting the open session clears the chat', async () => {
    const before = deletes(open.session_id);
    await sessionRow(page, 'Open chat').hover();
    await sessionRow(page, 'Open chat').getByRole('button', { name: 'Delete session' }).click();
    await dialog.getByRole('button', { name: 'Delete', exact: true }).click();

    await expect.poll(() => deletes(open.session_id)).toBe(before + 1);
    await expect(sessionRow(page, 'Open chat')).toHaveCount(0);
    await expect(page.getByText('Octopuses have three hearts.')).toHaveCount(0);
    await expect(page.getByRole('heading', { name: /Welcome to/ })).toBeVisible();
    await expect(page).not.toHaveURL(/session_id=/);
  });
});

test('Load more requests the next page at the right offset and appends it', async ({ page, backend }) => {
  await page.clock.setFixedTime(NOW);
  backend.now = () => NOW;
  // The sidebar shows 50 sessions per page (SESSIONS_PAGE_SIZE) and asks for one extra row to learn if more exist.
  const pageSize = 50;
  const total = 60;
  backend.sessions = Array.from({ length: total }, (_, i) =>
    makeSession({
      session_id: `bulk-${i + 1}`,
      title: `Topic ${i + 1}`,
      last_used_at: `2026-07-15T11:${String(59 - i).padStart(2, '0')}:00`,
    }),
  );

  await page.goto('/');
  const history = page.getByRole('region', { name: 'Chat history' });
  const nextPageRequests = (): number =>
    backend.requestsTo('GET', '/api/v1/sessions').filter((r) => r.query.offset === String(pageSize)).length;

  await expect(history.getByRole('button', { name: 'Topic 50', exact: true })).toBeVisible();
  await expect(history.getByRole('button', { name: 'Topic 51', exact: true })).toHaveCount(0);

  const before = nextPageRequests();
  await history.getByRole('button', { name: 'Load more' }).click();

  await expect.poll(nextPageRequests).toBe(before + 1);
  const request = backend
    .requestsTo('GET', '/api/v1/sessions')
    .filter((r) => r.query.offset === String(pageSize))
    .at(-1);
  expect(request?.query.limit).toBe(String(pageSize + 1));
  await expect(history.getByRole('button', { name: 'Topic 51', exact: true })).toBeVisible();
  await expect(history.getByRole('button', { name: 'Topic 60', exact: true })).toBeVisible();
  await expect(history.getByRole('button', { name: 'Topic 1', exact: true })).toBeVisible();
  await expect(history.getByRole('button', { name: 'Load more' })).toHaveCount(0);
});

test.describe('failed rename', () => {
  // The store logs the failure; the error dialog and the unchanged sidebar are asserted below.
  test.use({ consoleErrors: { allow: [/^\[chatStore\] renameSession failed:/] } });

  test('a failed rename shows the reason and leaves the existing title', async ({ page, backend }) => {
    await page.clock.setFixedTime(NOW);
    const trip = makeSession({ title: 'Travel plan', last_used_at: '2026-07-15T08:00:00' });
    backend.sessions = [trip];

    const attempts: unknown[] = [];
    await page.route(
      `**/api/v1/sessions/${trip.session_id}`,
      (route) => {
        if (route.request().method() !== 'PATCH') return route.fallback();
        attempts.push(route.request().postDataJSON());
        return route.fulfill({ status: 500, json: { detail: 'Boom' } });
      },
      { times: 1 },
    );

    await page.goto('/');
    await sessionRow(page, 'Travel plan').hover();
    await sessionRow(page, 'Travel plan').getByRole('button', { name: 'Rename session' }).click();
    const dialog = page.getByRole('dialog', { name: 'Rename Session' });
    await dialog.getByRole('textbox', { name: 'Session Name' }).fill('Trip to Oslo');
    await dialog.getByRole('button', { name: 'Rename', exact: true }).click();

    const error = page.getByRole('alertdialog', { name: 'Rename failed' });
    await expect(error).toContainText('Boom');
    await error.getByRole('button', { name: 'OK' }).click();
    await expect(error).toBeHidden();

    expect(attempts).toEqual([{ title: 'Trip to Oslo' }]);
    await expect(sessionRow(page, 'Travel plan')).toBeVisible();
    await expect(sessionRow(page, 'Trip to Oslo')).toHaveCount(0);
    expect(backend.requestsTo('PATCH', `/api/v1/sessions/${trip.session_id}`)).toHaveLength(0);
  });

});

test.describe('failed delete', () => {
  // The store logs the failure; the error dialog and the unchanged sidebar are asserted below.
  test.use({ consoleErrors: { allow: [/^\[chatStore\] deleteSession failed:/] } });

  test('a failed delete shows the reason and keeps the row and the open chat', async ({ page, backend }) => {
    await page.clock.setFixedTime(NOW);
    const open = makeSession({ title: 'Open chat', last_used_at: '2026-07-15T08:00:00' });
    backend.sessions = [open];
    backend.messages[open.session_id] = makeExchange('Tell me a fact', 'Octopuses have three hearts.');

    const attempts: string[] = [];
    await page.route(
      `**/api/v1/sessions/${open.session_id}`,
      (route) => {
        if (route.request().method() !== 'DELETE') return route.fallback();
        attempts.push(route.request().method());
        return route.fulfill({ status: 500, json: { detail: 'Boom' } });
      },
      { times: 1 },
    );

    await page.goto('/');
    await page.getByRole('region', { name: 'Chat history' }).getByRole('button', { name: 'Open chat' }).click();
    await expect(page.getByText('Octopuses have three hearts.')).toBeVisible();

    await sessionRow(page, 'Open chat').hover();
    await sessionRow(page, 'Open chat').getByRole('button', { name: 'Delete session' }).click();
    await page.getByRole('alertdialog', { name: 'Delete Session' }).getByRole('button', { name: 'Delete', exact: true }).click();

    const error = page.getByRole('alertdialog', { name: 'Delete failed' });
    await expect(error).toContainText('Boom');
    await error.getByRole('button', { name: 'OK' }).click();
    await expect(error).toBeHidden();

    expect(attempts).toHaveLength(1);
    await expect(sessionRow(page, 'Open chat')).toBeVisible();
    await expect(page.getByText('Octopuses have three hearts.')).toBeVisible();
    await expect(page).toHaveURL(new RegExp(`[?&]session_id=${open.session_id}(&|$)`));
  });
});
