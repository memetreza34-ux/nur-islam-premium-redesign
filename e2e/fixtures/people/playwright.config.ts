import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: '.',
  testMatch: 'people.spec.ts',
  reporter: 'line',
  timeout: 30_000,
  outputDir: '../../../output/playwright/people-source-integrity',
  use: {
    baseURL: 'http://127.0.0.1:4198',
    serviceWorkers: 'block',
    reducedMotion: 'reduce',
    locale: 'de-DE',
    timezoneId: 'Europe/Berlin',
    launchOptions: process.env.NUR_E2E_CHROME_PATH
      ? { executablePath: process.env.NUR_E2E_CHROME_PATH }
      : undefined,
  },
  webServer: {
    command: 'npm run dev -- --port=4198 --host=127.0.0.1 --strictPort',
    url: 'http://127.0.0.1:4198/e2e/fixtures/people/index.html',
    reuseExistingServer: false,
    timeout: 60_000,
  },
});
