import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const queue = await readFile(resolve(root, 'src/pendingNavigation.ts'), 'utf8');
const pwa = await readFile(resolve(root, 'src/pwa.ts'), 'utf8');
const app = await readFile(resolve(root, 'src/App.tsx'), 'utf8');

for (const requirement of [
  "export type PendingNavigationIntent = 'prayer' | 'calendar'",
  "STORAGE_KEY = 'nur_pending_navigation_v1'",
  'sessionStorage.setItem(STORAGE_KEY, intent)',
  'sessionStorage.getItem(STORAGE_KEY)',
  'sessionStorage.removeItem(STORAGE_KEY)',
  'queuePendingNavigation',
  'consumePendingNavigation',
]) {
  if (!queue.includes(requirement)) throw new Error(`Pending navigation queue is missing: ${requirement}`);
}

for (const requirement of [
  "import { queuePendingNavigation } from './pendingNavigation';",
  "queuePendingNavigation('prayer')",
  "queuePendingNavigation('calendar')",
  "window.dispatchEvent(new Event('nur:open-prayer'))",
  "window.dispatchEvent(new Event('nur:open-calendar'))",
]) {
  if (!pwa.includes(requirement)) throw new Error(`PWA early-navigation bridge is missing: ${requirement}`);
}

for (const requirement of [
  "import { consumePendingNavigation } from './pendingNavigation';",
  "window.addEventListener('nur:open-prayer', openPrayerTracker)",
  "window.addEventListener('nur:open-calendar', openCalendar)",
  'const pending = consumePendingNavigation()',
  'if (pending) applyNavigationIntent(pending)',
  "window.removeEventListener('nur:open-prayer', openPrayerTracker)",
  "window.removeEventListener('nur:open-calendar', openCalendar)",
]) {
  if (!app.includes(requirement)) throw new Error(`App pending-navigation consumption is missing: ${requirement}`);
}

const listenerIndex = app.indexOf("window.addEventListener('nur:open-prayer', openPrayerTracker)");
const consumeIndex = app.indexOf('const pending = consumePendingNavigation()');
if (listenerIndex < 0 || consumeIndex < 0 || consumeIndex < listenerIndex) {
  throw new Error('Pending navigation must be consumed only after live App listeners are registered.');
}

console.log('Pending navigation verified: early PWA prayer/calendar clicks are queued in sessionStorage, live events still dispatch, and App consumes the queued intent after registering listeners.');
