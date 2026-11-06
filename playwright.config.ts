import { defineConfig, devices } from '@playwright/test';
import 'dotenv/config';
import { PROJECT } from './src/data/project.js';
import { URLS } from './src/data/urls.js';

/**
 * Central Playwright configuration.
 * - SauceDemo UI tests log in once per browser and reuse the session
 *   through `storageState`.
 * - API / GraphQL suites call their services directly (no browser needed).
 * Docs: https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  timeout: 30_000,
  expect: {
    timeout: 5_000,
    toHaveScreenshot: { maxDiffPixelRatio: 0.02, animations: 'disabled' },
  },

  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }],
    [
      'allure-playwright',
      {
        resultsDir: 'allure-results',
        detail: true,
        environmentInfo: {
          Project: PROJECT.name,
          Framework: 'Playwright + TypeScript',
          Owner: PROJECT.owner,
          Node: process.version,
          OS: `${process.platform} ${process.arch}`,
        },
        categories: [
          { name: 'Ignored / skipped', matchedStatuses: ['skipped'] },
          { name: 'Product defects', matchedStatuses: ['failed'] },
          { name: 'Test defects (broken)', matchedStatuses: ['broken'] },
          {
            name: 'Outdated visual baseline',
            matchedStatuses: ['failed'],
            messageRegex: '.*[Ss]creenshot comparison failed.*',
          },
        ],
      },
    ],
  ],

  use: {
    baseURL: process.env.BASE_URL ?? URLS.todoMvcBase,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10_000,
  },

  projects: [
    // Auth setup: logs in once and saves the session (storageState).
    // There is one setup project per browser so each CI matrix job only has
    // to install the single browser it actually uses.
    {
      name: 'setup-chromium',
      testMatch: /.*\.setup\.ts/,
      use: { ...devices['Desktop Chrome'], baseURL: URLS.saucedemo },
    },
    {
      name: 'setup-firefox',
      testMatch: /.*\.setup\.ts/,
      use: { ...devices['Desktop Firefox'], baseURL: URLS.saucedemo },
    },
    {
      name: 'setup-webkit',
      testMatch: /.*\.setup\.ts/,
      use: { ...devices['Desktop Safari'], baseURL: URLS.saucedemo },
    },

    // Functional projects (these run in CI). Visual and setup specs are left
    // out: visual snapshots are OS-specific and would break a cross-platform
    // browser matrix.
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['setup-chromium'],
      testIgnore: [/visual\//, /.*\.setup\.ts/],
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      dependencies: ['setup-firefox'],
      testIgnore: [/visual\//, /.*\.setup\.ts/],
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
      dependencies: ['setup-webkit'],
      testIgnore: [/visual\//, /.*\.setup\.ts/],
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 7'] },
      dependencies: ['setup-chromium'],
      testIgnore: [/(api|visual)\//, /.*\.setup\.ts/],
    },

    // Visual regression project - run locally with `npm run test:visual`.
    {
      name: 'visual',
      use: { ...devices['Desktop Chrome'] },
      testMatch: /visual\//,
    },
  ],
});
