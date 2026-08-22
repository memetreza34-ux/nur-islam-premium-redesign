import { defineConfig } from 'vite';
import type { Plugin } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Writes the built JavaScript and CSS filenames next to the bundle.
 *
 * The screens below the five navigation tabs are fetched when they are first
 * opened. That is right for a first load, but the app also promises to work
 * without a connection, and a chunk that has never been fetched has never been
 * cached either — so going offline before opening the Quran once used to leave
 * that screen unreachable. The service worker reads this list on install and
 * caches the chunks up front. The filenames are content-hashed, so the worker
 * cannot know them without it.
 */
function assetManifest(): Plugin {
  return {
    name: 'nur-asset-manifest',
    apply: 'build',
    generateBundle(_options, bundle) {
      const files = Object.keys(bundle)
        .filter((name) => name.endsWith('.js') || name.endsWith('.css'))
        .sort();
      this.emitFile({
        type: 'asset',
        fileName: 'asset-manifest.json',
        source: `${JSON.stringify({ files }, null, 2)}\n`,
      });
    },
  };
}

export default defineConfig(({ command }) => ({
  base: process.env.VITE_BASE_PATH ?? (command === 'build' ? '/nur-islam-premium-redesign/' : '/'),
  plugins: [react(), assetManifest()],
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // The full prayer sequence — every Rakʿah with its Arabic wording,
          // transliteration and meaning — is only read on the prayer course.
          // Left in the entry chunk it delayed the first paint of every screen.
          if (id.includes('/src/data/prayerRakatData')) return 'prayer-rakats';
          if (!id.includes('node_modules')) return undefined;
          if (id.includes('/react/') || id.includes('/react-dom/') || id.includes('/scheduler/')) return 'react-vendor';
          if (id.includes('/motion/')) return 'motion-vendor';
          if (id.includes('/lucide-react/')) return 'icons-vendor';
          return undefined;
        },
      },
    },
  },
}));
