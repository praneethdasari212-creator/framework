import { test, expect } from '@playwright/test';
import { URLS } from '../../src/data/urls.js';
import { labelSuite } from '../../src/utils/allureLabels.js';

/**
 * GraphQL API tests against the public Countries API.
 * Shows querying with variables, asserting nested data and validating a
 * collection response - the GraphQL counterpart of the REST suite.
 */
const GRAPHQL = URLS.countriesGraphql;

test.beforeEach(async () => {
  await labelSuite('GraphQL API', 'Countries GraphQL');
});

test.describe('Countries GraphQL API', { tag: '@regression' }, () => {
  test(
    'queries a country by code with variables',
    { tag: '@smoke' },
    async ({ request }) => {
      const res = await request.post(GRAPHQL, {
        data: {
          query: `query Country($code: ID!) {
            country(code: $code) { name capital currency }
          }`,
          variables: { code: 'CM' },
        },
      });
      expect(res.status()).toBe(200);

      const { data } = await res.json();
      expect(data.country).toMatchObject({
        name: 'Cameroon',
        capital: 'Yaoundé',
        currency: 'XAF',
      });
    },
  );

  test('returns all seven continents', async ({ request }) => {
    const res = await request.post(GRAPHQL, {
      data: { query: '{ continents { code name } }' },
    });
    expect(res.ok()).toBeTruthy();

    const { data } = await res.json();
    expect(data.continents).toHaveLength(7);
  });

  test('returns an error for an invalid query (negative)', async ({
    request,
  }) => {
    const res = await request.post(GRAPHQL, {
      data: { query: '{ country(code: "CM") { nonExistentField } }' },
    });
    const body = await res.json();
    expect(body.errors?.length).toBeGreaterThan(0);
  });
});
