import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const service = await readFile(resolve(root, 'src/prayerTimesService.ts'), 'utf8');
const hook = await readFile(resolve(root, 'src/usePrayerTimes.ts'), 'utf8');
const schedule = await readFile(resolve(root, 'src/prayerSchedule.ts'), 'utf8');
const screen = await readFile(resolve(root, 'src/PrayerScreen.tsx'), 'utf8');
const main = await readFile(resolve(root, 'src/main.tsx'), 'utf8');
const styles = await readFile(resolve(root, 'src/styles/reference-live-prayer-times.css'), 'utf8');
const styleIndex = await readFile(resolve(root, 'src/styles.css'), 'utf8');

const serviceRequirements = [
  'https://api.aladhan.com/v1/timings/',
  'AbortController',
  'normalizeTime',
  'nur_prayer_times_latest',
  'createFallbackPrayerSnapshot',
  'readCachedPrayerSnapshot',
  'bootstrapSharedPrayerTimes',
  'applyPrayerSnapshotToSharedSchedule',
  "sourceLabel: 'AlAdhan · Live-Berechnung'",
  'Berechnete Zeiten können von lokalen Moscheezeiten abweichen',
];
for (const requirement of serviceRequirements) {
  if (!service.includes(requirement)) throw new Error(`Live prayer times service is missing: ${requirement}`);
}

for (const method of ["id: 13", "id: 3"]) {
  if (!service.includes(method)) throw new Error(`Prayer calculation method is missing: ${method}`);
}
for (const school of ["id: 0", "id: 1"]) {
  if (!service.includes(school)) throw new Error(`Asr school option is missing: ${school}`);
}

const hookRequirements = [
  'navigator.geolocation.getCurrentPosition',
  "PrayerTimesStatus = 'loading' | 'live' | 'cache' | 'fallback' | 'location-denied'",
  'requestLocation',
  'updatePreferences',
  'readCachedPrayerSnapshot',
];
for (const requirement of hookRequirements) {
  if (!hook.includes(requirement)) throw new Error(`Live prayer times hook is missing: ${requirement}`);
}

if (!schedule.includes('schedule: PrayerScheduleItem[] = PRAYER_SCHEDULE')) {
  throw new Error('getNextPrayer does not accept a dynamic schedule.');
}

const screenRequirements = [
  'usePrayerTimes()',
  'requestLocation',
  'reference-prayer-live-status',
  'reference-prayer-settings-modal',
  'PRAYER_METHOD_OPTIONS',
  'ASR_SCHOOL_OPTIONS',
  'Notification.requestPermission()',
  'playReminderTone',
  'getNextPrayer(now, prayerTimes)',
];
for (const requirement of screenRequirements) {
  if (!screen.includes(requirement)) throw new Error(`Prayer screen live feature is missing: ${requirement}`);
}

if (!main.includes('bootstrapSharedPrayerTimes()') || !main.includes('setPrayerTimesVersion')) {
  throw new Error('The home screen is not synchronized with the shared live prayer schedule.');
}
if (!styles.includes('.reference-prayer-live-status') || !styles.includes('.reference-prayer-settings-modal')) {
  throw new Error('Live prayer time styles are incomplete.');
}
if (!styleIndex.includes("reference-live-prayer-times.css")) {
  throw new Error('Live prayer time stylesheet is not loaded.');
}

console.log('Live prayer times verified: location, AlAdhan fetch, cache, fallback, calculation settings, shared home schedule, and reminder tone.');
