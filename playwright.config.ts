import type { Project } from '@playwright/test';

import { defineConfig, devices } from '@playwright/test';

import {
  hasE2eUser,
  USER_STORAGE_STATE,
} from './e2e/fixtures/user-credentials.ts';

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:3000';
const signedIn = hasE2eUser();
const tracesOff = Boolean(
  process.env.E2E_USER_EMAIL ||
  process.env.E2E_USER_PASSWORD ||
  process.env.VERCEL_AUTOMATION_BYPASS_SECRET
);

const chromium: Project = {
  name: 'chromium',
  testIgnore: signedIn ? /\.user\.spec\.ts$/u : undefined,
  use: { ...devices['Desktop Chrome'] },
};

const projects: Project[] = signedIn
  ? [
      {
        name: 'setup',
        testMatch: /auth\.setup\.ts/u,
        use: { ...devices['Desktop Chrome'] },
      },
      chromium,
      {
        dependencies: ['setup'],
        name: 'chromium-user',
        testMatch: /\.user\.spec\.ts$/u,
        use: {
          ...devices['Desktop Chrome'],
          storageState: USER_STORAGE_STATE,
        },
      },
    ]
  : [chromium];

export default defineConfig({
  forbidOnly: Boolean(process.env.CI),
  fullyParallel: true,
  projects,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  retries: process.env.CI ? 2 : 0,
  testDir: './e2e',
  use: {
    baseURL,
    trace: tracesOff ? 'off' : 'on-first-retry',
  },
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : {
        command: 'pnpm build && pnpm start',
        reuseExistingServer: !process.env.CI,
        url: baseURL,
      },
  workers: process.env.CI ? 1 : undefined,
});
