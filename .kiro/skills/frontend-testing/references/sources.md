# Sources

The public guidance behind the rules in `../SKILL.md`, paraphrased. Rules
marked *owner decision* are choices for this project, not external consensus.

| Rule in SKILL.md | Source |
|------------------|--------|
| Test user-visible behaviour, not implementation | [Playwright — Best Practices](https://playwright.dev/docs/best-practices); [Kent C. Dodds — Testing Implementation Details](https://kentcdodds.com/blog/testing-implementation-details) |
| Role + accessible name first; label for fields; test id last; no CSS/XPath | [Playwright — Locators](https://playwright.dev/docs/locators); [Testing Library — Query priority](https://testing-library.com/docs/queries/about#priority) |
| Placeholder and `title` are not reliable names | [Testing Library — Query priority](https://testing-library.com/docs/queries/about#priority) |
| Strict locators; avoid `.nth()` | [Playwright — Locators: strictness](https://playwright.dev/docs/locators#strictness) |
| Web-first assertions; no one-shot `isVisible()` checks | [Playwright — Best Practices](https://playwright.dev/docs/best-practices#use-web-first-assertions); [Playwright — Writing tests](https://playwright.dev/docs/writing-tests) |
| Full isolation per test; serial mode discouraged | [Playwright — Browser contexts](https://playwright.dev/docs/browser-contexts); [Playwright — Retries: serial mode](https://playwright.dev/docs/test-retries#serial-mode) |
| Control third-party/backend data through the network API | [Playwright — Best Practices](https://playwright.dev/docs/best-practices#avoid-testing-third-party-dependencies); [Playwright — Mock APIs](https://playwright.dev/docs/mock) |
| Page routes outrank context routes; `fallback` vs `continue` | [Playwright — Page.route](https://playwright.dev/docs/api/class-page#page-route); [Playwright — Route](https://playwright.dev/docs/api/class-route) |
| A fulfilled body is a string/Buffer, delivered whole | [Playwright — Route.fulfill](https://playwright.dev/docs/api/class-route#route-fulfill) |
| Fixed clock for time-dependent UI | [Playwright — Clock](https://playwright.dev/docs/clock) |
| Fixtures for reusable setup with paired teardown | [Playwright — Fixtures](https://playwright.dev/docs/test-fixtures) |
| `webServer`, `baseURL`, `reuseExistingServer` | [Playwright — Web server](https://playwright.dev/docs/test-webserver) |
| CI: Linux, only the browsers you need, `workers: 1`, global timeout, upload report | [Playwright — CI](https://playwright.dev/docs/ci); [Playwright — Best Practices](https://playwright.dev/docs/best-practices#optimize-browser-downloads-on-ci) |
| Retries + `trace: 'on-first-retry'`; `failOnFlakyTests` | [Playwright — Trace viewer](https://playwright.dev/docs/trace-viewer-intro); [Playwright — TestConfig](https://playwright.dev/docs/api/class-testconfig#test-config-fail-on-flaky-tests) |
| Tags for a smoke subset | [Playwright — Annotations](https://playwright.dev/docs/test-annotations) |
| Lint tests for missing `await`; type-check tests | [Playwright — Best Practices: lint your tests](https://playwright.dev/docs/best-practices#lint-your-tests); [Playwright — TypeScript](https://playwright.dev/docs/test-typescript); [Biome — noPlaywrightMissingAwait](https://biomejs.dev/linter/rules/no-playwright-missing-await/); [Biome — noFloatingPromises](https://biomejs.dev/linter/rules/no-floating-promises/) |
| No whole-page snapshots | [Kent C. Dodds — Effective Snapshot Testing](https://kentcdodds.com/blog/effective-snapshot-testing); [Playwright — ARIA snapshots](https://playwright.dev/docs/aria-snapshots) |
| Pixel baselines need one pinned OS/browser (why screenshots are deferred) | [Playwright — Visual comparisons](https://playwright.dev/docs/test-snapshots); [Argos — Why screenshots differ across OSes](https://argos-ci.com/blog/playwright-screenshots-differ-macos-linux) |
| Confidence over coverage; fewer, more integrated tests; don't chase 100% | [Kent C. Dodds — Write tests. Not too many. Mostly integration.](https://kentcdodds.com/blog/write-tests); [Kent C. Dodds — Testing Trophy](https://kentcdodds.com/blog/the-testing-trophy-and-testing-classifications) |
| Keep end-to-end to critical journeys | [Google Testing Blog — Just Say No to More End-to-End Tests](https://testing.googleblog.com/2015/04/just-say-no-to-more-end-to-end-tests.html); [Martin Fowler — The Practical Test Pyramid](https://martinfowler.com/articles/practical-test-pyramid.html); [Martin Fowler — Shapes of testing](https://martinfowler.com/articles/2021-test-shapes.html) |
| Real browsers over jsdom for UI behaviour; Playwright for e2e, Vitest for units | [Epic Web — Vitest Browser Mode vs Playwright](https://www.epicweb.dev/vitest-browser-mode-vs-playwright); [Vitest — Browser Mode](https://vitest.dev/guide/browser/) |
| Fake timers only replace globals that exist | [Vitest — Fake timers config](https://vitest.dev/config/faketimers) |
| *Owner decision:* Playwright e2e is the main suite; no jsdom component tests; no screenshots yet; no axe / WCAG scans; Chromium only | — |
