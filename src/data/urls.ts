/** Every external system under test, defined in one place. */
export const URLS = {
  saucedemo: 'https://www.saucedemo.com',
  playwrightDev: 'https://playwright.dev',
  todoMvcBase: 'https://demo.playwright.dev',
  restfulBooker: 'https://restful-booker.herokuapp.com',
  countriesGraphql: 'https://countries.trevorblades.com/',
} as const;

/** Where the logged-in browser session is stored (see auth.setup.ts). */
export const AUTH_FILE = '.auth/user.json';
