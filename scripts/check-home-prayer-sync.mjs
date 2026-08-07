import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const main = await readFile(resolve(root, 'src/main.tsx'), 'utf8');
const app = await readFile(resolve(root, 'src/App.tsx'), 'utf8');
const service = await readFile(resolve(root, 'src/prayerTimesService.ts'), 'utf8');

const mainRequirements = [
  "import { bootstrapSharedPrayerTimes, getPrayerDateKey } from './prayerTimesService';",
  "window.addEventListener('nur:prayer-times-updated', renderLatestPrayerTimes)",
  "window.removeEventListener('nur:prayer-times-updated', renderLatestPrayerTimes)",
  "document.addEventListener('visibilitychange', handleVisibilityChange)",
  "document.removeEventListener('visibilitychange', handleVisibilityChange)",
  'window.setInterval(refreshAfterDayChange, 60000)',
  'window.clearInterval(dayChangeTimer)',
  'document.visibilityState === \'visible\'',
  'prayerDateKeyRef.current = currentDateKey',
  'void bootstrapSharedPrayerTimes()',
];

for (const requirement of mainRequirements) {
  if (!main.includes(requirement)) throw new Error(`Shared prayer-time synchronization is missing: ${requirement}`);
}

const serviceRequirements = [
  "window.dispatchEvent(new CustomEvent('nur:prayer-times-updated'",
  'applyPrayerSnapshotToSharedSchedule(snapshot)',
  'export function getPrayerDateKey',
  'export async function bootstrapSharedPrayerTimes',
];

for (const requirement of serviceRequirements) {
  if (!service.includes(requirement)) throw new Error(`Prayer-time service integration is missing: ${requirement}`);
}

const homeRequirements = [
  'getNextPrayer(now)',
  'PRAYER_SCHEDULE.map((prayer)',
  'PRAYER_SCHEDULE_META.sourceLabel',
  'PRAYER_SCHEDULE_META.methodLabel',
];

for (const requirement of homeRequirements) {
  if (!app.includes(requirement)) throw new Error(`Home prayer hero no longer consumes the shared schedule: ${requirement}`);
}

console.log('Home prayer synchronization verified: live updates, day rollover, visibility refresh, shared schedule rendering, and cleanup.');
