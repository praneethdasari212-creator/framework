import { test } from '@playwright/test';
import { LoginPage } from '../../src/pages/saucedemo/LoginPage.js';
import { InventoryPage } from '../../src/pages/saucedemo/InventoryPage.js';
import { VALID_USER, LOGIN_SCENARIOS } from '../../src/data/users.js';
import { URLS } from '../../src/data/urls.js';
import { labelSuite } from '../../src/utils/allureLabels.js';

/**
 * SauceDemo authentication tests. The negative cases are generated from one
 * data source (LOGIN_SCENARIOS), so adding a case is a one-line data change
 * with no new test code.
 *
 * These run in a fresh, unauthenticated browser context.
 */
test.use({ baseURL: URLS.saucedemo });

test.beforeEach(async () => {
  await labelSuite('End-to-End (UI)', 'SauceDemo - Authentication');
});

test.describe('SauceDemo login', { tag: '@regression' }, () => {
  test(
    'valid credentials reach the inventory',
    { tag: '@smoke' },
    async ({ page }) => {
      const login = new LoginPage(page);
      await login.goto();
      await login.login(VALID_USER.username, VALID_USER.password);
      await new InventoryPage(page).expectLoaded();
    },
  );

  for (const scenario of LOGIN_SCENARIOS) {
    test(`rejects ${scenario.name}`, async ({ page }) => {
      const login = new LoginPage(page);
      await login.goto();
      await login.login(scenario.username, scenario.password);
      await login.expectError(scenario.error);
    });
  }

  // Documented backlog: kept as a skipped test so the gap shows up in the
  // report (Categories -> Ignored / skipped) instead of being forgotten.
  test('locks the account after repeated failed logins', async () => {
    // eslint-disable-next-line playwright/no-skipped-test -- intentional documented backlog
    test.skip(
      true,
      'Pending: brute-force lockout scenario planned for a future iteration',
    );
  });
});
