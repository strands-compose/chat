import { makeExchange, makeSession, makeUser } from '../support/data';
import { expect, test } from '../support/test';

test('a signed-out visitor is sent to the login page', async ({ page, backend }) => {
  backend.user = null;

  await page.goto('/');

  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole('button', { name: 'Sign in', exact: true })).toBeVisible();
});

test('logging in follows the returned next URL exactly and restores that session', async ({
  page,
  backend,
}) => {
  const session = makeSession({ title: 'Quarterly report' });
  backend.sessions = [session];
  backend.messages[session.session_id] = makeExchange('Summarise Q3', 'Revenue grew 12%.');
  backend.user = null;
  backend.loginNext = `/?session_id=${session.session_id}`;

  await page.goto('/');
  await expect(page).toHaveURL(/\/login$/);

  await page.getByLabel('Username').fill('alice');
  await page.getByLabel('Password').fill('correct-horse'); // pragma: allowlist secret
  // The login sets the auth cookie; the fake models that by knowing the user from now on.
  backend.user = makeUser();
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();

  await expect(page).toHaveURL(`/?session_id=${session.session_id}`);
  await expect(page.getByText('Revenue grew 12%.')).toBeVisible();
  await expect(
    page.getByRole('region', { name: 'Chat history' }).getByText('Quarterly report'),
  ).toBeVisible();
});

test('a failing session check shows the error dialog and does not redirect', async ({ page }) => {
  // Every attempt fails: StrictMode runs the mount-time session check twice and ignores the first result.
  await page.route('**/auth/me', (route) =>
    route.fulfill({ status: 500, json: { detail: 'Boom' } }),
  );

  await page.goto('/');

  const dialog = page.getByRole('alertdialog', { name: 'Error' });
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText(/failed to fetch current user/i);
  await expect(page).toHaveURL(/\/$/);
});
