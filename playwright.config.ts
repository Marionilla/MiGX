import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';
import 'dotenv/config';
import environmentBaseUrl, { type EnvName } from './src/utils/environmentBaseUrl';

// bddgen compiles .feature files into specs the Playwright runner executes.
const testDir = defineBddConfig({
  features: 'features/**/*.feature',
  steps: ['src/fixtures/**/*.ts', 'features/steps/**/*.ts'],
});

// Env selection (reference pattern, cleaned: correct ENV case + dotenv load).
const ENV: EnvName =
  (process.env.ENV as EnvName) in environmentBaseUrl
    ? (process.env.ENV as EnvName)
    : 'qa4';
const baseURL = process.env.BASE_URL ?? environmentBaseUrl[ENV].home;

const isCI = !!process.env.CI;

export default defineConfig({
  testDir,
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: isCI,
  /* Retry on CI only */
  retries: isCI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: isCI ? 1 : undefined,
  timeout: 30000,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }]
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    baseURL,
    testIdAttribute: 'data-test',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    }
  ],
});
