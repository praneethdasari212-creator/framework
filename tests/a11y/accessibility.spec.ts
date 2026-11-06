import { test, expect } from '../../src/fixtures/fixtures.js';
import { labelSuite } from '../../src/utils/allureLabels.js';

/**
 * Automated accessibility checks with axe-core (WCAG 2.0 / 2.1, levels A + AA).
 * Automated scans catch a useful share of WCAG problems, but they complement
 * manual and assistive-technology testing rather than replace it.
 *
 * Critical violations fail the test; every violation (any impact level) is
 * attached to the report for triage.
 */
const BLOCKING_IMPACTS = new Set(['critical']);

test.beforeEach(async () => {
  await labelSuite('Accessibility', 'WCAG (axe-core)');
});

test.describe('Accessibility @regression', () => {
  test('TodoMVC has no critical WCAG violations', async ({
    todoPage,
    makeAxeBuilder,
  }, testInfo) => {
    await todoPage.addTodo('Audit accessibility');

    const results = await makeAxeBuilder().analyze();

    await testInfo.attach('axe-results.json', {
      body: JSON.stringify(results.violations, null, 2),
      contentType: 'application/json',
    });

    const blocking = results.violations.filter((v) =>
      BLOCKING_IMPACTS.has(v.impact ?? ''),
    );
    expect(blocking, JSON.stringify(blocking.map((v) => v.id))).toEqual([]);
  });
});
