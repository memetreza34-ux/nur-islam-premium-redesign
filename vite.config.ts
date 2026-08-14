import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command }) => ({
  base: process.env.VITE_BASE_PATH ?? (command === 'build' ? '/nur-islam-premium-redesign/' : '/'),
  plugins: [react()],
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
