import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const queue = await readFile(resolve(root, 'src/services/pendingNavigation.ts'), 'utf8');
const pwa = await readFile(resolve(root, 'src/app/pwa.ts'), 'utf8');
const main = await readFile(resolve(root, 'src/app/main.tsx'), 'utf8');
const app = await readFile(resolve(root, 'src/app/App.tsx'), 'utf8');

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
  "import { queuePendingNavigation } from '../services/pendingNavigation';",
  "queuePendingNavigation('prayer')",
  "queuePendingNavigation('calendar')",
  "window.dispatchEvent(new Event('nur:open-prayer'))",
  "window.dispatchEvent(new Event('nur:open-calendar'))",
]) {
  if (!pwa.includes(requirement)) throw new Error(`PWA early-navigation bridge is missing: ${requirement}`);
}

for (const requirement of [
  "import { queuePendingNavigation } from '../services/pendingNavigation';",
  "const requested = url.searchParams.get('open')",
  "requested === 'prayer' ? 'prayer' : requested === 'calendar' ? 'calendar' : null",
  "localStorage.setItem('nur_onboarding_complete', 'true')",
  'queuePendingNavigation(intent)',
  'url.searchParams.delete(\'open\')',
  'consumeInitialNavigationIntent();',
]) {
  if (!main.includes(requirement)) throw new Error(`Startup URL-navigation queue is missing: ${requirement}`);
}
for (const forbidden of [
  'const initialNavigationIntent = consumeInitialNavigationIntent()',
  "window.dispatchEvent(new Event(initialNavigationIntent === 'prayer' ? 'nur:open-prayer' : 'nur:open-calendar'))",
  '}, 80);',
]) {
  if (main.includes(forbidden)) throw new Error(`Startup navigation still depends on a timing race: ${forbidden}`);
}

for (const requirement of [
  "import { consumePendingNavigation } from '../services/pendingNavigation';",
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

const startupQueueIndex = main.indexOf('queuePendingNavigation(intent)');
const reactMountIndex = main.indexOf("ReactDOM.createRoot(document.getElementById('root')!).render(");
if (startupQueueIndex < 0 || reactMountIndex < 0 || startupQueueIndex > reactMountIndex) {
  throw new Error('Startup URL navigation must be queued before React mounts.');
}

console.log('Pending navigation verified: PWA clicks and startup URL deep links are queued in sessionStorage before they can be lost, live events remain supported, and App consumes queued intents only after registering its prayer/calendar listeners.');
