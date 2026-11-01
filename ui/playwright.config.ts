import { defineConfig, devices } from '@playwright/test';

/**
 * End-to-end tests for the UI. Rules: .kiro/skills/frontend-testing/SKILL.md.
 *
 * One Vite dev server on a fixed loopback port, never the developer's :5173.
 * Every backend call is answered by the fake in e2e/support/fake-backend.ts.
 *
 * URL_PREFIX is forced empty so Vite proxies exactly /api/, /auth/ and /admin —
 * the same prefixes the fake routes fail-closed. The proxy target is a closed
 * port, so even a request the fake missed can never reach a live backend.
 */
// Overridable so several runs can share one machine without clashing.
const PORT = Number(process.env.E2E_PORT ?? 5181);
const BASE_URL = `http://127.0.0.1:${PORT}`;
const OUTPUT_DIR = process.env.E2E_OUTPUT_DIR ?? 'test-results';
const REPORT_DIR = process.env.E2E_REPORT_DIR ?? 'playwright-report';
const isCI = !!process.env.CI;

export default defineConfig({
  testDir: './e2e',
  // The Pages demo build has its own run: playwright.demo.config.ts.
  testIgnore: 'demo/**',
  tsconfig: './tsconfig.e2e.json',
  outputDir: OUTPUT_DIR,
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  failOnFlakyTests: isCI,
  workers: isCI ? 1 : undefined,
  globalTimeout: isCI ? 15 * 60_000 : undefined,
  reporter: [isCI ? ['github'] : ['list'], ['html', { open: 'never', outputFolder: REPORT_DIR }]],
  use: {
    ...devices['Desktop Chrome'],
    baseURL: BASE_URL,
    viewport: { width: 1440, height: 900 },
    locale: 'en-US',
    timezoneId: 'UTC',
    colorScheme: 'light',
    serviceWorkers: 'block',
    trace: 'on-first-retry',
  },
  webServer: {
    command: `npx vite --host 127.0.0.1 --port ${PORT} --strictPort`,
    url: `${BASE_URL}/`,
    env: { URL_PREFIX: '', API_PROXY_TARGET: 'http://127.0.0.1:9' },
    reuseExistingServer: false,
    timeout: 60_000,
  },
});
