import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';
import 'dotenv/config';
import environmentBaseUrl, { type EnvName } from './src/utils/environmentBaseUrl';

const stepGlobs = ['src/fixtures//*.ts', 'features/steps//*.ts'];
const guestDir = defineBddConfig({
  outputDir: '.features-gen/guest',
  features: 'features//*.feature',
  steps: stepGlobs,
  tags: '@login',
});

const authedDir = defineBddConfig({
  outputDir: '.features-gen/authed',
  features: 'features//*.feature',
  steps: stepGlobs,
  tags: 'not @login',
});

const ENV: EnvName =
  (process.env.ENV as EnvName) in environmentBaseUrl
    ? (process.env.ENV as EnvName)
    : 'qa4';

const baseURL = process.env.BASE_URL ?? environmentBaseUrl[ENV].home;
const isCI = !!process.env.CI;

export default defineConfig({
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 1 : undefined,
  timeout: 30000,
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'playwright-report' }]],
  
  use: {
    baseURL,
    testIdAttribute: 'data-test',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'setup', testDir: 'src/setup', testMatch: /.*.setup.ts/ },
    { name: 'guest', testDir: guestDir, use: { ...devices['Desktop Chrome'] } },
    {
      name: 'authed',
      testDir: authedDir,
      use: { ...devices['Desktop Chrome'], storageState: '.auth/standard.json' },
      dependencies: ['setup'],
    },
  ],
});