import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command }) => ({
  base: process.env.VITE_BASE_PATH ?? (command === 'build' ? '/nur-islam-premium-redesign/' : '/'),
  plugins: [react()],
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
}));
