import { test, expect } from '../../src/fixtures/fixtures.js';
import { TODOS } from '../../src/data/todos.js';
import { labelSuite } from '../../src/utils/allureLabels.js';

/**
 * Visual regression tests using Playwright's built-in snapshot comparison.
 * Baselines are stored next to this spec in `todo.visual.spec.ts-snapshots/`.
 *
 * Run locally:
 *   npm run test:visual            # compare against the baselines
 *   npm run test:visual:update     # (re)generate the baselines
 *
 * Element-level screenshots (not full page) keep results stable across
 * viewport and scrollbar differences; animations are disabled in the config.
 */
test.beforeEach(async () => {
  await labelSuite('Visual Regression', 'TodoMVC snapshots');
});

test.describe('TodoMVC - visual regression', () => {
  test('empty app matches baseline', async ({ page }) => {
    await page.goto('/todomvc');
    await expect(page.locator('.todoapp')).toHaveScreenshot('todo-empty.png');
  });

  test('populated list matches baseline', async ({ todoPage, page }) => {
    await todoPage.addTodos(TODOS);
    await todoPage.toggleByTitle(TODOS[0]);
    await expect(page.locator('.todoapp')).toHaveScreenshot(
      'todo-populated.png',
    );
  });
});
