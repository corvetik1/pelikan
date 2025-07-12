import { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  testDir: './tests',
  timeout: 120_000,
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: 'http://localhost:3000',
    headless: true,
    viewport: { width: 1280, height: 720 },
    trace: 'on-first-retry',
  },
  webServer: {
    // Run production build for stability during e2e (avoids dev-webpack memory issues)
    command: 'pnpm build && pnpm start',
    port: 3000,
    reuseExistingServer: !process.env.CI,
    timeout: 600_000,
  },
};

export default config;
