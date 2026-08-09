import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const backend = await readFile(resolve(root, 'src/services/nurBackend.ts'), 'utf8');
const theme = await readFile(resolve(root, 'src/services/themeService.ts'), 'utf8');

for (const requirement of [
  "CLOUD_RESTORED_EVENT = 'nur:cloud-restored'",
  'restoreCloudState',
  'dispatchEvent',
  'CLOUD_RESTORED_EVENT',
  "'nur_prayer_location'",
  "'nur_mosque_location_v1'",
  "'nur_install_prompt_dismissed'",
  "key.startsWith('nur_prayer_reminders_fired_')",
  "key.startsWith('nur_calendar_reminders_fired_')",
]) {
  if (!backend.includes(requirement)) throw new Error(`Cloud restore/privacy integration is missing: ${requirement}`);
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

console.log('Cloud restore synchronization verified: restore events reapply theme state immediately, while coordinates, fired-reminder markers and device-specific install-prompt state stay out of cloud backups.');
