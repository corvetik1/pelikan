import { PlaywrightTestConfig } from '@playwright/test';

const isCI = !!process.env.CI;

const config: PlaywrightTestConfig = {
  testDir: './tests',
  timeout: 180_000,
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: 'http://localhost:3000',
    headless: true,
    viewport: { width: 1280, height: 720 },
    trace: 'on-first-retry',
  },
  webServer: isCI ? {
    // Run production build for stability during e2e (avoids dev-webpack memory issues)
    command: 'node scripts/pw-server.js',
    port: 3000,
    reuseExistingServer: !process.env.CI,
    env: {
      NEXT_TELEMETRY_DISABLED: '1',
      NODE_ENV: 'production',
    },
    timeout: 600_000,
  } : {
    // Use dev server for local e2e testing
    command: 'pnpm dev',
    port: 3000,
    reuseExistingServer: true,
    env: {
      NEXT_TELEMETRY_DISABLED: '1',
      NODE_ENV: 'development',
    },
    timeout: 300_000,
  },
};

export default config;
