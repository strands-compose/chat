import { test, expect } from '../support/test';
import { makeProviders } from '../support/data';

test('signing in with good credentials posts them once and navigates to next', async ({ page, backend }) => {
  backend.loginNext = '/welcome-back';
  // The page navigates to `next`; the fake has no such page, so serve a stub.
  await page.route('**/welcome-back', (route) => route.fulfill({ contentType: 'text/html', body: '<h1>Welcome back</h1>' }));

  await page.goto('/login');
  await page.getByLabel('Username').fill('alice');
  await page.getByLabel('Password').fill('correct-horse'); // pragma: allowlist secret
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();

  await expect(page).toHaveURL(/\/welcome-back$/);
  const logins = backend.requestsTo('POST', '/auth/login');
  expect(logins).toHaveLength(1);
  expect(logins[0].body).toEqual({ username: 'alice', password: 'correct-horse' }); // pragma: allowlist secret
});

test('bad credentials show the server detail and keep what was typed', async ({ page, backend }) => {
  await page.goto('/login');
  const username = page.getByLabel('Username');
  const password = page.getByLabel('Password');
  await username.fill('alice');
  await password.fill('wrong-password'); // pragma: allowlist secret
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();

  await expect(page.getByRole('alert')).toHaveText('Invalid username or password.');
  await expect(page).toHaveURL(/\/login$/);
  await expect(username).toHaveValue('alice');
  await expect(password).toHaveValue('wrong-password'); // pragma: allowlist secret
  expect(backend.requestsTo('POST', '/auth/login')).toHaveLength(1);
});

test('OIDC providers render as buttons and start the provider login', async ({ page, backend }) => {
  backend.providers = makeProviders({
    providers: [
      { id: 'okta', display_name: 'Okta' },
      { id: 'github', display_name: 'GitHub' },
    ],
  });

  await page.goto('/login');
  await expect(page.getByRole('button', { name: 'Sign in with GitHub' })).toBeVisible();

  await page.getByRole('button', { name: 'Sign in with Okta' }).click();

  await expect(page).toHaveURL(/\/auth\/login\/okta$/);
  await expect(page.getByRole('heading', { name: 'Sign in with okta' })).toBeVisible();
});

test('OIDC-only configuration shows the provider buttons without the local form', async ({ page, backend }) => {
  backend.providers = makeProviders({
    local_signin_enabled: false,
    providers: [{ id: 'okta', display_name: 'Okta' }],
  });

  await page.goto('/login');

  await expect(page.getByRole('button', { name: 'Sign in with Okta' })).toBeVisible();
  await expect(page.getByLabel('Username')).toHaveCount(0);
  await expect(page.getByLabel('Password')).toHaveCount(0);
});

test('without registration there is no sign-up option', async ({ page }) => {
  await page.goto('/login');

  await expect(page.getByLabel('Username')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Sign up' })).toHaveCount(0);
});

test('with registration enabled, sign-up rejects mismatched passwords then creates the account', async ({
  page,
  backend,
}) => {
  backend.providers = makeProviders({ registration_enabled: true });
  backend.credentials = { username: 'newbie', password: 'brand-new-pass' }; // pragma: allowlist secret
  backend.loginNext = '/welcome-back';
  await page.route('**/welcome-back', (route) => route.fulfill({ contentType: 'text/html', body: '<h1>Welcome back</h1>' }));

  await page.goto('/login');
  await page.getByRole('button', { name: 'Sign up' }).click();

  await expect(page.getByText('Create your account')).toBeVisible();
  await page.getByLabel('Username').fill('newbie');
  await page.getByLabel('Email').fill('newbie@example.com');
  await page.getByLabel('Password', { exact: true }).fill('brand-new-pass'); // pragma: allowlist secret
  await page.getByLabel('Repeat password').fill('different-pass'); // pragma: allowlist secret
  await page.getByRole('button', { name: 'Create account' }).click();

  await test.step('mismatched passwords are rejected and nothing is sent', async () => {
    await expect(page.getByRole('alert')).toHaveText('Passwords do not match.');
    expect(backend.requestsTo('POST', '/auth/register')).toHaveLength(0);
    expect(backend.requestsTo('POST', '/auth/login')).toHaveLength(0);
  });

  await test.step('matching passwords register, sign in, and navigate to next', async () => {
    await page.getByLabel('Repeat password').fill('brand-new-pass'); // pragma: allowlist secret
    await page.getByRole('button', { name: 'Create account' }).click();

    await expect(page).toHaveURL(/\/welcome-back$/);
    const registrations = backend.requestsTo('POST', '/auth/register');
    expect(registrations).toHaveLength(1);
    expect(registrations[0].body).toEqual({
      username: 'newbie',
      email: 'newbie@example.com',
      password: 'brand-new-pass', // pragma: allowlist secret
    });
    expect(backend.requestsTo('POST', '/auth/login')).toHaveLength(1);
  });
});
