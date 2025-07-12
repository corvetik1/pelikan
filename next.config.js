/**
 * Next.js configuration
 * Disables webpack filesystem cache in development to avoid OOM errors during E2E tests (Playwright)
 * Caching remains enabled for production (`next build`).
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  webpack(config, { dev }) {
    if (dev) {
      // Disable webpack persistent cache (both client & server) to prevent RangeError: Array buffer allocation failed during Playwright tests
      config.cache = false;
    }
    return config;
  },
};

module.exports = nextConfig;
