import { test, expect } from '@playwright/test';
import { URLS } from '../../src/data/urls.js';
import { labelSuite } from '../../src/utils/allureLabels.js';

/**
 * Lightweight web-UI checks against the public Playwright docs site.
 * Shows navigation and role-based locators.
 */
test.beforeEach(async () => {
  await labelSuite('Web UI', 'playwright.dev');
});

test.describe('playwright.dev', () => {
  test.use({ baseURL: URLS.playwrightDev });

  test('home page loads with hero call-to-action', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Playwright/);
    await expect(page.getByRole('link', { name: 'Get started' })).toBeVisible();
  });

  test('navigates to the Docs intro page', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Get started' }).click();
    await expect(page).toHaveURL(/.*intro/);
    await expect(
      page.getByRole('heading', { name: 'Installation' }),
    ).toBeVisible();
  });
});
