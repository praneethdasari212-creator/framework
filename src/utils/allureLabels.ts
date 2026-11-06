import * as allure from 'allure-js-commons';
import { PROJECT } from '../data/project.js';

/**
 * Applies the standard Allure labels so the report groups every suite the
 * same way. Call it from `test.beforeEach` in each spec file.
 */
export async function labelSuite(
  parentSuite: string,
  feature: string,
): Promise<void> {
  await allure.parentSuite(parentSuite);
  await allure.epic(PROJECT.epic);
  await allure.feature(feature);
  await allure.owner(PROJECT.owner);
}
