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
  testIgnore: '**/fixtures/**',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'list' : 'line',
  timeout: 30_000,
  use: {
    baseURL: 'http://127.0.0.1:4174',
    trace: 'on-first-retry',
    launchOptions: process.env.NUR_E2E_CHROME_PATH
      ? { executablePath: process.env.NUR_E2E_CHROME_PATH }
      : undefined,
    // A prayer app is used in Germany by default; the shipped fallback
    // schedule is Berlin, so the locale and timezone match what users see.
    locale: 'de-DE',
    timezoneId: 'Europe/Berlin',
  },
  projects: [
    { name: 'phone', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    // Preview serves the production build, so these exercise what ships
    // rather than the dev server.
    command: 'VITE_BASE_PATH=/ npm run build && npm run preview -- --host=127.0.0.1 --port=4174 --strictPort',
    url: 'http://127.0.0.1:4174',
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
