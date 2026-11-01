import { defineConfig } from '@playwright/test';
import base from './playwright.config';

/**
 * Smoke test of the GitHub Pages demo: the built files in dist/ (from
 * `npm run build:demo`), served by `vite preview` the way Pages serves them.
 * Same settings and fixtures as the main e2e run; only the specs in e2e/demo
 * and the server differ. The demo has no backend, so the fail-closed fake turns
 * any backend call into a failure.
 */
const PORT = Number(process.env.E2E_DEMO_PORT ?? 5182);
const BASE_URL = `http://127.0.0.1:${PORT}`;

export default defineConfig({
  ...base,
  testIgnore: undefined,
  testMatch: 'demo/**/*.spec.ts',
  use: { ...base.use, baseURL: BASE_URL },
  webServer: {
    command: `npx vite preview --mode demo --host 127.0.0.1 --port ${PORT} --strictPort`,
    url: `${BASE_URL}/`,
    reuseExistingServer: false,
    // A static server is up at once; a missing dist/index.html never answers 2xx.
    timeout: 30_000,
  },
});
