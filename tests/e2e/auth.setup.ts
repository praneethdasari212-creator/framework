import { test as setup } from '@playwright/test';
import { LoginPage } from '../../src/pages/saucedemo/LoginPage.js';
import { InventoryPage } from '../../src/pages/saucedemo/InventoryPage.js';
import { VALID_USER } from '../../src/data/users.js';
import { AUTH_FILE } from '../../src/data/urls.js';

/**
 * Authentication setup: log in once and save the session to disk.
 * Authenticated suites reuse that state instead of logging in for every test,
 * which is faster and mirrors how real-world suites are organised.
 */
setup('authenticate as standard_user', async ({ page }) => {
  const login = new LoginPage(page);
  await login.goto();
  await login.login(VALID_USER.username, VALID_USER.password);
  await new InventoryPage(page).expectLoaded();
  await page.context().storageState({ path: AUTH_FILE });
});
