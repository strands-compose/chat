import { test, expect } from '../support/test';

test.describe('light system preference', () => {
  test.use({ colorScheme: 'light' });

  test('the first load is light, the toggle flips it and the choice survives a reload', async ({ page }) => {
    await page.goto('/');
    const root = page.locator('html');

    await test.step('first load follows prefers-color-scheme', async () => {
      await expect(root).toHaveAttribute('data-theme', 'light');
      await expect(page.getByRole('button', { name: 'Switch to dark mode' })).toBeVisible();
    });

    await test.step('the toggle switches to dark', async () => {
      await page.getByRole('button', { name: 'Switch to dark mode' }).click();

      await expect(root).toHaveAttribute('data-theme', 'dark');
      await expect(page.getByRole('button', { name: 'Switch to light mode' })).toBeVisible();
    });

    await test.step('the choice survives a reload in the same tab', async () => {
      await page.reload();

      await expect(root).toHaveAttribute('data-theme', 'dark');
      await expect(page.getByRole('button', { name: 'Switch to light mode' })).toBeVisible();
    });

    await test.step('toggling back returns to light', async () => {
      await page.getByRole('button', { name: 'Switch to light mode' }).click();

      await expect(root).toHaveAttribute('data-theme', 'light');
    });
  });
});

test.describe('dark system preference', () => {
  test.use({ colorScheme: 'dark' });

  test('the first load is dark and the toggle switches to light', async ({ page }) => {
    await page.goto('/');
    const root = page.locator('html');

    await expect(root).toHaveAttribute('data-theme', 'dark');
    await expect(page.getByRole('button', { name: 'Switch to light mode' })).toBeVisible();

    await page.getByRole('button', { name: 'Switch to light mode' }).click();

    await expect(root).toHaveAttribute('data-theme', 'light');
    await expect(page.getByRole('button', { name: 'Switch to dark mode' })).toBeVisible();
  });
});
