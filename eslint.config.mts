import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import playwright from 'eslint-plugin-playwright';
import prettier from 'eslint-config-prettier';
export default tseslint.config(
  { ignores: ['node_modules', '.features-gen', 'playwright-report', 'test-results'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['features//*.ts', 'src//.ts'],
    plugins: { playwright },
    rules: { ...playwright.configs['flat/recommended'].rules },
  },
  {
    files: ['features/steps/**/.ts'],
    rules: { 'playwright/no-standalone-expect': 'off' },
  },
  prettier,
);