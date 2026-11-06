import { test } from '@playwright/test';
import { InventoryPage } from '../../src/pages/saucedemo/InventoryPage.js';
import { CartPage } from '../../src/pages/saucedemo/CartPage.js';
import { CheckoutPage } from '../../src/pages/saucedemo/CheckoutPage.js';
import { PRODUCTS } from '../../src/data/products.js';
import { URLS, AUTH_FILE } from '../../src/data/urls.js';
import { labelSuite } from '../../src/utils/allureLabels.js';

/**
 * End-to-end purchase flow on SauceDemo, run as an already-logged-in user via
 * the saved session (see auth.setup.ts). Covers a real multi-page journey:
 * inventory -> cart -> checkout -> order confirmation.
 */
test.use({
  baseURL: URLS.saucedemo,
  storageState: AUTH_FILE,
});

test.beforeEach(async () => {
  await labelSuite('End-to-End (UI)', 'SauceDemo - Checkout');
});

test.describe(
  'SauceDemo checkout (authenticated)',
  { tag: '@regression' },
  () => {
    test(
      'completes a purchase of two items',
      { tag: '@smoke' },
      async ({ page }) => {
        const inventory = new InventoryPage(page);
        await inventory.goto();
        await inventory.expectLoaded();

        await inventory.addToCart(PRODUCTS.backpack);
        await inventory.addToCart(PRODUCTS.bikeLight);
        await inventory.expectCartCount(2);
        await inventory.openCart();

        const cart = new CartPage(page);
        await cart.expectItemCount(2);
        await cart.checkout();

        const checkout = new CheckoutPage(page);
        await checkout.fillInformation('Test', 'User', '560001');
        await checkout.finish();
        await checkout.expectOrderComplete();
      },
    );
  },
);
