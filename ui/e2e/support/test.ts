/**
 * The `test` and `expect` every spec imports. Never import them from
 * `@playwright/test` directly, or these fixtures do not run.
 *
 * Auto fixtures, per test:
 * - `backend`: a fresh FakeBackend routed into the browser context before the
 *   first navigation. Teardown releases held replies and fails the test if the
 *   app called a backend URL the fake does not handle.
 * - console guard: any `console.error` or uncaught page error fails the test,
 *   unless the test allows it with `test.use({ consoleErrors: { allow: [/^…/] } })`.
 */

import { test as base, expect } from '@playwright/test';
import { resetIds } from './data';
import { FakeBackend, isBackendUrl } from './fake-backend';

/**
 * Console errors a test provokes on purpose. An object, not a bare array:
 * Playwright reads `[a, b]` in `test.use` as a `[value, options]` tuple.
 */
export interface ConsoleErrorPolicy {
  /** Anchored patterns; every entry must match at least once, so stale allowances fail loudly. */
  allow: RegExp[];
}

interface Fixtures {
  backend: FakeBackend;
  consoleErrors: ConsoleErrorPolicy;
  // biome-ignore lint/suspicious/noConfusingVoidType: Playwright types a value-less fixture as void, so `use()` takes no argument.
  consoleGuard: void;
}

export const test = base.extend<Fixtures>({
  consoleErrors: [{ allow: [] }, { option: true }],

  backend: [
    async ({ page }, use) => {
      resetIds();
      const backend = new FakeBackend();
      await backend.install(page.context());
      await use(backend);
      await backend.settle();
      expect(backend.unhandled, 'backend requests the fake does not handle').toEqual([]);
    },
    { auto: true },
  ],

  consoleGuard: [
    async ({ page, consoleErrors }, use) => {
      const unexpected: string[] = [];
      const matched = new Set<RegExp>();

      const check = (text: string): void => {
        const allowance = consoleErrors.allow.find((pattern) => pattern.test(text));
        if (allowance) matched.add(allowance);
        else unexpected.push(text);
      };

      page.on('console', (message) => {
        if (message.type() !== 'error') return;
        const text = message.text();
        // Every backend URL is answered (or reported) by the fail-closed fake,
        // so the browser's own line for a mocked error status is not a finding.
        const source = message.location().url;
        if (text.startsWith('Failed to load resource') && source && isBackendUrl(new URL(source)))
          return;
        check(text);
      });
      page.on('pageerror', (error) => check(`Uncaught: ${error.message}`));

      await use();

      expect(unexpected, 'unexpected console errors').toEqual([]);
      expect(
        consoleErrors.allow.filter((pattern) => !matched.has(pattern)).map(String),
        'consoleErrors.allow entries that never matched',
      ).toEqual([]);
    },
    { auto: true },
  ],
});

export { expect };
