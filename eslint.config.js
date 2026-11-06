import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import playwright from 'eslint-plugin-playwright';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

export default tseslint.config(
  {
    ignores: [
      'node_modules',
      'playwright-report',
      'test-results',
      'allure-results',
      'allure-report',
      '**/*-snapshots/**',
    ],
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  // Node.js globals (process, console, ...) for every file.
  { languageOptions: { globals: { ...globals.node } } },

  // Type-aware rule: catches a missing `await` on Playwright's async API.
  {
    files: ['**/*.ts'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-floating-promises': 'error',
    },
  },

  // Playwright best-practice rules, applied to the test files only.
  {
    ...playwright.configs['flat/recommended'],
    files: ['tests/**/*.ts'],
    rules: {
      ...playwright.configs['flat/recommended'].rules,
      // Assertions live inside Page Object `expect*` helpers, which this rule
      // cannot see statically, so it would flag valid POM-style tests.
      'playwright/expect-expect': 'off',
    },
  },

  // Formatting is Prettier's job - switch off any conflicting ESLint rules.
  prettier,
);
