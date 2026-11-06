# Contributing

Thanks for your interest in improving this framework. This guide keeps changes
consistent and the pipeline green.

## Prerequisites

- Node.js 20 or newer (22 LTS recommended)
- Java 8+ (only needed to build the Allure report locally)

## Setup

```bash
npm install
npx playwright install
```

## Development workflow

1. Create a branch from `main`: `git checkout -b feat/short-description`.
2. Make your change together with a matching test.
3. Run the relevant suite locally (see the scripts in the README).
4. Run the quality gate before pushing:
   ```bash
   npm run validate   # type-check + ESLint + Prettier
   ```
5. Open a pull request against `main`.

A Husky pre-commit hook auto-formats and lints staged files and type-checks the
project, so most problems are caught before they reach CI.

## Conventions

- **Commits** follow [Conventional Commits](https://www.conventionalcommits.org/)
  (`feat:`, `fix:`, `ci:`, `docs:`, `test:`, `refactor:`, `chore:`).
- **Locators** prefer user-facing roles / test IDs (`getByRole`, `getByTestId`)
  over brittle CSS or XPath.
- **Assertions** use Playwright's web-first `expect`; never `waitForTimeout`.
- **Page logic** lives in Page Objects under `src/pages`; specs stay declarative.
- **Test data** lives in `src/data`; **fixtures** in `src/fixtures`.
- **Tags** `@smoke` / `@regression` are added to new tests where relevant.

## Adding a test suite

- Put specs under `tests/<area>` (`e2e`, `api`, `web`, `a11y`, `visual`).
- Call `labelSuite(parentSuite, feature)` from `src/utils/allureLabels.ts` in a
  `test.beforeEach` so the Allure report groups the suite correctly.

## CI

Every push / PR runs: quality gate, then a cross-browser matrix (Chromium,
Firefox, WebKit). Pushes to `main` also publish the Allure report to GitHub
Pages.

## Reporting issues

Use the issue templates (bug report / feature request) and include reproduction
steps, expected vs. actual behaviour, and environment details.
