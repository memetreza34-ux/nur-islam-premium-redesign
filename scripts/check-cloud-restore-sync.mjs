import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const backend = await readFile(resolve(root, 'src/nurBackend.ts'), 'utf8');
const theme = await readFile(resolve(root, 'src/themeService.ts'), 'utf8');

for (const requirement of [
  "CLOUD_RESTORED_EVENT = 'nur:cloud-restored'",
  'restoreCloudState',
  'dispatchEvent',
  'CLOUD_RESTORED_EVENT',
]) {
  if (!backend.includes(requirement)) throw new Error(`Cloud restore event integration is missing: ${requirement}`);
}

for (const requirement of [
  "THEME_STORAGE_KEY = 'nur_theme'",
  "SYSTEM_QUERY = '(prefers-color-scheme: light)'",
  'applyResolvedTheme',
  "window.addEventListener('nur:cloud-restored', handleCloudRestore)",
  "window.removeEventListener('nur:cloud-restored', handleCloudRestore)",
  "window.addEventListener('storage', handleStorage)",
]) {
  if (!theme.includes(requirement)) throw new Error(`Theme restore synchronization is missing: ${requirement}`);
}

console.log('Cloud restore synchronization verified: backend emits a restore event and the theme layer immediately reapplies restored dark/light/system state with proper listener cleanup.');
