import type { Page } from '@playwright/test';
import { test, expect } from '../support/test';
import { makeUsagePoint, makeUser, makeUserUsage } from '../support/data';

const FIXED_NOW = new Date('2026-07-15T12:00:00Z');

async function openProfile(page: Page) {
  await page.getByRole('button', { name: 'User menu' }).click();
  await page.getByRole('menuitem', { name: 'Profile' }).click();
  const dialog = page.getByRole('dialog', { name: 'Profile' });
  await expect(dialog).toBeVisible();
  return dialog;
}

test('the account form saves only the changed, trimmed fields', { tag: '@smoke' }, async ({ page, backend }) => {
  backend.user = makeUser({
    username: 'alice',
    email: 'alice@example.com',
    first_name: 'Alice',
    last_name: 'Liddell',
    company: 'Wonderland Ltd',
  });
  const patches = (): number => backend.requestsTo('PATCH', '/auth/me').length;

  await page.goto('/');
  const dialog = await openProfile(page);

  await test.step('the form shows the current profile', async () => {
    await expect(dialog.getByLabel('First name')).toHaveValue('Alice');
    await expect(dialog.getByLabel('Last name')).toHaveValue('Liddell');
    await expect(dialog.getByLabel('Company')).toHaveValue('Wonderland Ltd');
    await expect(dialog.getByRole('button', { name: 'Save changes' })).toBeDisabled();
  });

  await test.step('saving sends one PATCH with the changed fields, trimmed', async () => {
    const before = patches();
    await dialog.getByLabel('First name').fill('  Alicia  ');
    await dialog.getByLabel('Company').fill(' Acme ');
    await dialog.getByRole('button', { name: 'Save changes' }).click();

    await expect.poll(patches).toBe(before + 1);
    expect(backend.requestsTo('PATCH', '/auth/me').at(-1)?.body).toEqual({ first_name: 'Alicia', company: 'Acme' });
  });

  await test.step('the dialog shows the saved values', async () => {
    await expect(dialog.getByRole('button', { name: /Saved/ })).toBeVisible();
    await expect(dialog.getByLabel('First name')).toHaveValue('Alicia');
    await expect(dialog.getByLabel('Company')).toHaveValue('Acme');
    await expect(dialog.getByLabel('Last name')).toHaveValue('Liddell');
  });
});

test('a failed save shows the reason and keeps the edits', async ({ page, backend }) => {
  backend.user = makeUser({ username: 'alice', email: 'alice@example.com', first_name: 'Alice' });
  // The page route answers the PATCH itself, so the fake never sees it: count it here.
  const refused: unknown[] = [];

  await page.goto('/');
  const dialog = await openProfile(page);
  await page.route(
    '**/auth/me',
    (route) => {
      if (route.request().method() !== 'PATCH') return route.fallback();
      refused.push(route.request().postDataJSON());
      return route.fulfill({ status: 500, json: { detail: 'Profile service is down.' } });
    },
    { times: 1 },
  );

  await dialog.getByLabel('First name').fill('Alicia');
  await dialog.getByRole('button', { name: 'Save changes' }).click();

  await expect(dialog.getByRole('alert')).toContainText('Profile service is down.');
  expect(refused).toEqual([{ first_name: 'Alicia' }]);
  expect(backend.requestsTo('PATCH', '/auth/me')).toHaveLength(0);
  await expect(dialog.getByLabel('First name')).toHaveValue('Alicia');
  await expect(dialog.getByRole('button', { name: 'Save changes' })).toBeEnabled();
});

test('the usage tab shows the totals and re-requests for another interval', async ({ page, backend }) => {
  await page.clock.setFixedTime(FIXED_NOW);
  backend.now = () => FIXED_NOW;
  backend.userUsage = ({ interval }) =>
    interval === 'weekly'
      ? makeUserUsage(interval, [makeUsagePoint('2026-06-29', { cost: 3, input_tokens: 2000, output_tokens: 500 })])
      : makeUserUsage(interval, [
          makeUsagePoint('2026-07-03', { cost: 1.25, input_tokens: 1000, output_tokens: 200 }),
          makeUsagePoint('2026-07-10', { cost: 2.5, input_tokens: 3000, output_tokens: 400, cache_read_input_tokens: 500 }),
        ]);
  const usageRequests = (): number => backend.requestsTo('GET', '/api/v1/users/me/usage').length;

  await page.goto('/');
  const dialog = await openProfile(page);
  await dialog.getByRole('tab', { name: 'Usage' }).click();

  await test.step('daily totals and rows for the current month', async () => {
    await expect(dialog.getByText('$3.75')).toBeVisible();
    await expect(dialog.getByRole('button', { name: /Tokens\s*5\s100/ })).toBeVisible();
    await expect(dialog.getByRole('row', { name: /3 Jul 2026\s*\$1\.25/ })).toBeVisible();
    await expect(dialog.getByRole('row', { name: /10 Jul 2026\s*\$2\.50/ })).toBeVisible();
    const last = backend.requestsTo('GET', '/api/v1/users/me/usage').at(-1);
    expect(last?.query).toEqual({ from: '2026-07-01', to: '2026-07-31', interval: 'daily' });
  });

  await test.step('switching to Weekly requests that interval and shows its data', async () => {
    const before = usageRequests();
    await dialog.getByRole('group', { name: 'Interval' }).getByRole('button', { name: 'Weekly' }).click();

    await expect.poll(usageRequests).toBe(before + 1);
    expect(backend.requestsTo('GET', '/api/v1/users/me/usage').at(-1)?.query.interval).toBe('weekly');
    await expect(dialog.getByRole('row', { name: /29 Jun 2026\s*\$3\.00/ })).toBeVisible();
    await expect(dialog.getByRole('button', { name: /Tokens\s*2\s500/ })).toBeVisible();
  });

  await test.step('switching to Monthly requests that interval', async () => {
    const before = usageRequests();
    await dialog.getByRole('group', { name: 'Interval' }).getByRole('button', { name: 'Monthly' }).click();

    await expect.poll(usageRequests).toBe(before + 1);
    expect(backend.requestsTo('GET', '/api/v1/users/me/usage').at(-1)?.query.interval).toBe('monthly');
  });

  await test.step('Chart mode Tokens lists tokens instead of cost, from the data already loaded', async () => {
    await dialog.getByRole('group', { name: 'Interval' }).getByRole('button', { name: 'Daily' }).click();
    await expect(dialog.getByRole('row', { name: /3 Jul 2026\s*\$1\.25/ })).toBeVisible();
    const before = usageRequests();

    await dialog.getByRole('group', { name: 'Chart mode' }).getByRole('button', { name: 'Tokens' }).click();

    await expect(dialog.getByRole('columnheader', { name: 'Cache R' })).toBeVisible();
    await expect(dialog.getByRole('row', { name: /10 Jul 2026\s*3,000\s*400\s*500/ })).toBeVisible();
    expect(usageRequests()).toBe(before);
  });
});

test('the agents tab lists the available agents', async ({ page, backend }) => {
  const [first] = backend.agents;
  const second = { ...first, id: 'agent-reviewer', name: 'Reviewer', description: 'Reviews pull requests.' };
  backend.agents = [first, second];

  await page.goto('/');
  const dialog = await openProfile(page);
  await dialog.getByRole('tab', { name: 'Agents' }).click();

  await expect(dialog.getByRole('button', { name: new RegExp(first.name) })).toBeVisible();
  await dialog.getByRole('button', { name: /Reviewer/ }).click();
  await expect(dialog.getByText('Reviews pull requests.')).toBeVisible();
});

test('the profile window closes with Escape and with a click outside it', async ({ page }) => {
  await page.goto('/');

  const dialog = await openProfile(page);
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();

  await openProfile(page);
  await page.mouse.click(5, 5); // the backdrop, outside the centred window
  await expect(dialog).toBeHidden();
});

test('Sign out goes through the logout endpoint to the sign-in page', async ({ page, backend }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'User menu' }).click();
  await page.getByRole('menuitem', { name: 'Sign out' }).click();

  // The fake answers /auth/logout like the backend: a redirect to the sign-in page.
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByLabel('Username')).toBeVisible();
  expect(backend.requestsTo('GET', '/auth/logout')).toHaveLength(1);
});

test.describe('the user menu', () => {
  test('offers the Admin panel to superusers', async ({ page, backend }) => {
    backend.user = makeUser({ is_superuser: true });

    await page.goto('/');
    await page.getByRole('button', { name: 'User menu' }).click();

    await expect(page.getByRole('menuitem', { name: 'Admin panel' })).toBeVisible();
    await expect(page.getByRole('menuitem', { name: 'Profile' })).toBeVisible();
  });

  test('hides the Admin panel from regular users', async ({ page, backend }) => {
    backend.user = makeUser({ is_superuser: false });

    await page.goto('/');
    await page.getByRole('button', { name: 'User menu' }).click();

    await expect(page.getByRole('menuitem', { name: 'Profile' })).toBeVisible();
    await expect(page.getByRole('menuitem', { name: 'Admin panel' })).toHaveCount(0);
  });
});
