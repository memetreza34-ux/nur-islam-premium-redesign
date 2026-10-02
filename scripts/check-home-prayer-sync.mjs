import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const main = await readFile(resolve(root, 'src/app/main.tsx'), 'utf8');
const app = await readFile(resolve(root, 'src/app/App.tsx'), 'utf8');
const service = await readFile(resolve(root, 'src/services/prayerTimesService.ts'), 'utf8');

const mainRequirements = [
  "import { bootstrapSharedPrayerTimes, getPrayerDateKey } from '../services/prayerTimesService';",
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
  'export function applyPrayerSnapshotToSharedSchedule',
  'export function getPrayerDateKey',
  'export async function bootstrapSharedPrayerTimes',
];

for (const requirement of serviceRequirements) {
  if (!service.includes(requirement)) throw new Error(`Prayer-time service integration is missing: ${requirement}`);
}

// The shared schedule has to be refreshed on every bootstrap outcome, otherwise
// one path silently leaves the home hero on stale times.
const bootstrapBody = service.slice(service.indexOf('export async function bootstrapSharedPrayerTimes'));
const appliedSnapshots = [...bootstrapBody.matchAll(/applyPrayerSnapshotToSharedSchedule\((\w+)\)/g)].map((match) => match[1]);
if (!bootstrapBody.includes('applyPrayerSnapshotToSharedSchedule(cached ?? getFallbackPrayerTimesSnapshot())')) {
  throw new Error('Bootstrap must immediately publish matching cached times or explicit unavailable placeholders.');
}
if (!bootstrapBody.includes('generation !== sharedGeneration')) {
  throw new Error('Obsolete bootstrap responses must not overwrite newer settings.');
}
for (const path of ['live', 'fallback']) {
  if (!appliedSnapshots.includes(path)) {
    throw new Error(`Shared prayer schedule is not updated on the ${path} bootstrap path.`);
  }
}

const homeRequirements = [
  'getNextPrayer(now)',
  'PRAYER_SCHEDULE.map((prayer)',
  'PRAYER_SCHEDULE_META.locationLabel',
  'PRAYER_SCHEDULE_META.timezone',
];

for (const requirement of homeRequirements) {
  if (!app.includes(requirement)) throw new Error(`Home prayer hero no longer consumes the shared schedule: ${requirement}`);
}

const prayer = await readFile(resolve(root, 'src/screens/PrayerScreen.tsx'), 'utf8');
const backdrops = await readFile(resolve(root, 'src/shared/prayerBackdrops.ts'), 'utf8');
const arch = await readFile(resolve(root, 'src/shared/MihrabArch.tsx'), 'utf8');
const worker = await readFile(resolve(root, 'public/sw.js'), 'utf8');
for (const screen of [app, prayer]) {
  if (!screen.includes('scene={currentScene}')) throw new Error('Both prayer cards must illustrate the current local daylight phase.');
}
if (!app.includes('getCurrentPrayerScene(now, PRAYER_SCHEDULE, PRAYER_SCHEDULE_META.timezone)')
  || !prayer.includes('getCurrentPrayerScene(now, prayerTimes, meta.timezone)')) {
  throw new Error('Landscape selection must use each own timetable and location timezone, separately from the next prayer.');
}
for (const id of ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha']) {
  const filename = `prayer-${id}-v1.webp`;
  if (!backdrops.includes(filename) || !worker.includes(filename)) throw new Error(`Missing prayer landscape or offline cache entry: ${id}`);
}
for (const token of ['getPrayerBackdrop(scene)', '<AnimatePresence', 'useReducedMotion', 'ds-arch__veil', 'strokeDasharray={`${clamped} 100`}']) {
  if (!arch.includes(token)) throw new Error(`Prayer landscape must retain text protection, progress and accessible transitions: ${token}`);
}
console.log('Home prayer synchronization verified: shared timetable, matching five prayer landscapes, offline entries, day rollover, visibility refresh, protected text and reduced-motion transitions.');
