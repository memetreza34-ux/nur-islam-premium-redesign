import { defineConfig } from 'vitest/config';

// Date handling is the app's most timezone-sensitive logic and the primary
// market observes DST, so tests run in Berlin rather than the runner's
// timezone. Set before any Date is constructed.
process.env.TZ = 'Europe/Berlin';

// Kept separate from vite.config.ts so the deployment path checks keep reading
// a build config that only describes the build.
export default defineConfig({
  test: {
    environment: 'happy-dom',
    include: ['src/**/*.test.ts'],
    restoreMocks: true,
    unstubGlobals: true,
  },
});
