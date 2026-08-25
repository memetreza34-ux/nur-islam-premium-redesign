import { defineConfig, devices } from '@playwright/test';

/**
 * End-to-end smoke tests.
 *
 * Deliberately separate from the unit suite and from `npm run check`: these
 * need a browser and a running server, which would make every local push
 * noticeably slower for a check that CI is better placed to run.
 *
 * The app is a phone-first PWA, so the tests run at a phone viewport.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'list' : 'line',
  timeout: 30_000,
  use: {
    baseURL: 'http://localhost:4173',
    trace: 'on-first-retry',
    // A prayer app is used in Germany by default; the shipped fallback
    // schedule is Berlin, so the locale and timezone match what users see.
    locale: 'de-DE',
    timezoneId: 'Europe/Berlin',
  },
  projects: [
    { name: 'phone', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    // Build exactly once with the root base used by the local test server.
    // Calling `npm run preview` here would trigger the local prepreview hook
    // and rebuild a second time; CI must serve the artifact it just validated.
    command: 'VITE_BASE_PATH=/ npm run build && npx vite preview --port=4173 --strictPort',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
