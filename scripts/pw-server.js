#!/usr/bin/env node
/*
 * Helper for Playwright webServer in local/CI runs.
 * 1. Ensures Next.js build does not crash on Windows due to missing `.next/server/pages` dir.
 * 2. Runs `pnpm build` once, then `pnpm start` and inherits stdio so Playwright detects readiness.
 */

const { execSync, spawn } = require('child_process');
const { mkdirSync, existsSync } = require('fs');
const { join } = require('path');

try {
  const pagesDir = join(__dirname, '..', '.next', 'server', 'pages');
  if (!existsSync(pagesDir)) {
    mkdirSync(pagesDir, { recursive: true });
  }
} catch (err) {
  // mkdir may fail on *nix if path already exists concurrently – ignore
}

try {
  execSync('pnpm build', { stdio: 'inherit', env: { ...process.env, NEXT_TELEMETRY_DISABLED: '1' } });
} catch (err) {
  // Bubble up build failure – Playwright will fail fast
  process.exit(typeof err.status === 'number' ? err.status : 1);
}

// spawn start in foreground (inherits stdio) so Playwright webServer can observe output
const pnpmCmd = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm';
const child = spawn(`${pnpmCmd} start`, {
  stdio: 'inherit',
  env: { ...process.env, NEXT_TELEMETRY_DISABLED: '1' },
  shell: true, // Required on Windows for .cmd files
});

child.on('exit', (code) => process.exit(code ?? 0));
