import { test as base } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { TodoPage } from '../pages/TodoPage.js';

/**
 * Custom fixtures hand ready-to-use building blocks to the tests, so specs
 * stay declarative and free of setup boilerplate.
 */
type Fixtures = {
  /** TodoMVC page object, already navigated to the app. */
  todoPage: TodoPage;
  /**
   * Factory for an axe-core scanner limited to WCAG 2.0 / 2.1 A and AA.
   * Keeping it here means the accessibility rules are configured once.
   */
  makeAxeBuilder: () => AxeBuilder;
};

export const test = base.extend<Fixtures>({
  todoPage: async ({ page }, use) => {
    const todoPage = new TodoPage(page);
    await todoPage.goto();
    await use(todoPage);
  },

  makeAxeBuilder: async ({ page }, use) => {
    const make = () =>
      new AxeBuilder({ page }).withTags([
        'wcag2a',
        'wcag2aa',
        'wcag21a',
        'wcag21aa',
      ]);
    await use(make);
  },
});

export { expect } from '@playwright/test';
