import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Build variant for a single-file preview: one JS chunk, one stylesheet, and
// every bundled asset inlined, so the whole app can be served as one HTML file.
// The app's own vite.config.ts is untouched.
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    outDir: 'dist-artifact',
    assetsInlineLimit: Number.MAX_SAFE_INTEGER,
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
        entryFileNames: 'app.js',
        assetFileNames: 'app.[ext]',
      },
    },
  },
});
