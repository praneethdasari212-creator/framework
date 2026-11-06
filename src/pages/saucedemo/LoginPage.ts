import { type Page, type Locator, expect } from '@playwright/test';
import { BasePage } from '../BasePage.js';

/** SauceDemo login page - https://www.saucedemo.com */
export class LoginPage extends BasePage {
  readonly path = '/';

  private readonly username: Locator;
  private readonly password: Locator;
  private readonly loginButton: Locator;
  private readonly error: Locator;

  constructor(page: Page) {
    super(page);
    this.username = page.getByPlaceholder('Username');
    this.password = page.getByPlaceholder('Password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.error = page.locator('[data-test="error"]');
  }

  async login(user: string, pass: string): Promise<void> {
    await this.username.fill(user);
    await this.password.fill(pass);
    await this.loginButton.click();
  }

  async expectError(message: string | RegExp): Promise<void> {
    await expect(this.error).toContainText(message);
  }
}
