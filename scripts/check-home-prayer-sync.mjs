import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const main = await readFile(resolve(root, 'src/app/main.tsx'), 'utf8');
const app = await readFile(resolve(root, 'src/app/App.tsx'), 'utf8');
const service = await readFile(resolve(root, 'src/services/prayerTimesService.ts'), 'utf8');
const hook = await readFile(resolve(root, 'src/shared/usePrayerTimes.ts'), 'utf8');

const mainRequirements = [
  "import { bootstrapSharedPrayerTimes, getPrayerDateKey } from '../services/prayerTimesService';",
  "window.addEventListener('nur:prayer-times-updated', renderLatestPrayerTimes)",
  "window.removeEventListener('nur:prayer-times-updated', renderLatestPrayerTimes)",
  "document.addEventListener('visibilitychange', handleVisibilityChange)",
  "document.removeEventListener('visibilitychange', handleVisibilityChange)",
  'window.setInterval(refreshAfterDayChange, 60000)',
  'window.clearInterval(dayChangeTimer)',
  "document.visibilityState === 'visible'",
  'prayerDateKeyRef.current = currentDateKey',
  'void bootstrapSharedPrayerTimes()',
];

for (const requirement of mainRequirements) {
  if (!main.includes(requirement)) throw new Error(`Shared prayer-time synchronization is missing: ${requirement}`);
}

const serviceRequirements = [
  "window.dispatchEvent(new CustomEvent('nur:prayer-times-updated'",
  'export function applyPrayerSnapshotToSharedSchedule',
  'export function getPrayerDateKey',
  'export async function bootstrapSharedPrayerTimes',
];

for (const requirement of serviceRequirements) {
  if (!service.includes(requirement)) throw new Error(`Prayer-time service integration is missing: ${requirement}`);
}

// Shared state still receives every bootstrap outcome so all surfaces agree on
// whether times are available. The fallback itself is clock-free and must be
// rendered as unavailable, never as a current timetable.
const bootstrapBody = service.slice(service.indexOf('export async function bootstrapSharedPrayerTimes'));
const appliedSnapshots = [...bootstrapBody.matchAll(/applyPrayerSnapshotToSharedSchedule\((\w+)\)/g)].map((match) => match[1]);
for (const path of ['cached', 'live', 'fallback']) {
  if (!appliedSnapshots.includes(path)) {
    throw new Error(`Shared prayer schedule is not updated on the ${path} bootstrap path.`);
  }
}

// PrayerScreen uses this hook after location or calculation-setting changes.
// Those updates must be mirrored to the shared schedule immediately; otherwise
// PrayerScreen can show one timetable while Home and the reminder scheduler
// still operate on an older fallback/cache snapshot.
if (!hook.includes('applyPrayerSnapshotToSharedSchedule')) {
  throw new Error('usePrayerTimes no longer imports shared prayer-time synchronization.');
}
for (const snapshot of ['live', 'stored', 'nextFallback']) {
  if (!hook.includes(`applyPrayerSnapshotToSharedSchedule(${snapshot})`)) {
    throw new Error(`usePrayerTimes does not mirror its ${snapshot} result into the shared prayer schedule.`);
  }
}

const homeRequirements = [
  'getNextPrayer(now)',
  'PRAYER_SCHEDULE.map((prayer)',
  'PRAYER_SCHEDULE_META.sourceLabel',
  'PRAYER_SCHEDULE_META.methodLabel',
  "const prayerTimesUnavailable = PRAYER_SCHEDULE_META.sourceLabel === 'Offline-Ersatzzeitplan'",
  'Gebetszeiten nicht aktuell',
  'Keine Ersatzzeit als Gebetsentscheidung verwenden',
  '<strong>—:—</strong>',
  'Live-Daten oder ein heutiger gespeicherter Tagesstand fehlen',
];

for (const requirement of homeRequirements) {
  if (!app.includes(requirement)) throw new Error(`Home prayer safety/sync is missing: ${requirement}`);
}

console.log('Home prayer synchronization verified: bootstrap and PrayerScreen hook updates share live/cache/fallback state, day rollover is handled, and clock-free fallback is shown as unavailable.');
