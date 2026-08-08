import { defineConfig } from 'vitest/config';

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
