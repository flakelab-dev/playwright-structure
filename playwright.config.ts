import { defineConfig, devices } from '@playwright/test';
import { getEnvironment } from './config/environments';

const env = getEnvironment();
const isCI = !!process.env.CI;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: 0, // Keep at 0: retries hide flakiness, and measuring flakiness is the point.
  workers: isCI ? 2 : undefined,
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    // Machine-readable results, used to compute pass rates across repeated runs.
    ['json', { outputFile: 'test-results/results.json' }],
  ],
  use: {
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'ui',
      testDir: './tests/ui',
      use: { ...devices['Desktop Chrome'], baseURL: env.uiBaseUrl },
    },
    {
      name: 'api',
      testDir: './tests/api',
      use: {
        baseURL: env.apiBaseUrl,
        extraHTTPHeaders: { Accept: 'application/json' },
      },
    },
  ],
});
