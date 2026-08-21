import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const service = await readFile(resolve(root, 'src/services/prayerTimesService.ts'), 'utf8');
const hook = await readFile(resolve(root, 'src/shared/usePrayerTimes.ts'), 'utf8');
const schedule = await readFile(resolve(root, 'src/services/prayerSchedule.ts'), 'utf8');
const screen = await readFile(resolve(root, 'src/screens/PrayerScreen.tsx'), 'utf8');
const main = await readFile(resolve(root, 'src/app/main.tsx'), 'utf8');
const styles = await readFile(resolve(root, 'src/styles/reference-live-prayer-times.css'), 'utf8');
const styleIndex = await readFile(resolve(root, 'src/styles.css'), 'utf8');

const serviceRequirements = [
  'https://api.aladhan.com/v1/timings/',
  'AbortController',
  'normalizeTime',
  'nur_prayer_times_latest',
  'createFallbackSnapshot',
  'loadCachedPrayerTimes',
  'getFallbackPrayerTimesSnapshot',
  'bootstrapSharedPrayerTimes',
  'applyPrayerSnapshotToSharedSchedule',
  "sourceLabel: 'Live via AlAdhan'",
  'Berechnete Gebetszeiten können je nach örtlicher Moschee',
  "label: 'Diyanet İşleri Başkanlığı · API experimentell'",
  "shortLabel: 'Diyanet (experimentell)'",
  "if (cached.location?.source !== 'device') return null;",
  "if (location.source !== 'device') {",
  'Für persönliche Gebetszeiten muss zuerst ein Gerätestandort freigegeben werden.',
  "city: hasDeviceLocation ? location.label : 'Standort erforderlich'",
  "locationLabel: hasDeviceLocation ? location.label : 'Standort nicht festgelegt'",
];
for (const requirement of serviceRequirements) {
  if (!service.includes(requirement)) throw new Error(`Live prayer times service is missing: ${requirement}`);
}

const bootstrapDeviceGate = service.indexOf("if (location.source !== 'device') {");
const bootstrapLiveFetch = service.lastIndexOf('const live = await fetchPrayerTimes(location, loadPrayerPreferences());');
if (bootstrapDeviceGate < 0 || bootstrapLiveFetch < 0 || bootstrapDeviceGate > bootstrapLiveFetch) {
  throw new Error('Shared prayer bootstrap must reject the generic default location before attempting a live request.');
}

for (const method of ['id: 13', 'id: 3']) {
  if (!service.includes(method)) throw new Error(`Prayer calculation method is missing: ${method}`);
}
for (const school of ['id: 0', 'id: 1']) {
  if (!service.includes(school)) throw new Error(`Asr school option is missing: ${school}`);
}

const hookRequirements = [
  'navigator.geolocation.getCurrentPosition',
  "source: 'device'",
  "PrayerTimesStatus = 'loading' | 'live' | 'cache' | 'fallback' | 'location-denied'",
  'requestLocation',
  'updatePreferences',
  'loadCachedPrayerTimes',
  'loadPrayerLocation',
  'loadPrayerPreferences',
  'savePrayerLocation(location)',
  'getFallbackPrayerTimesSnapshot',
];
for (const requirement of hookRequirements) {
  if (!hook.includes(requirement)) throw new Error(`Live prayer times hook is missing: ${requirement}`);
}

for (const obsoleteImport of [
  'readCachedPrayerSnapshot',
  'readPrayerLocation',
  'readPrayerPreferences',
  'createFallbackPrayerSnapshot',
]) {
  if (hook.includes(obsoleteImport)) throw new Error(`Prayer hook still references obsolete service API: ${obsoleteImport}`);
}

if (!schedule.includes('schedule: PrayerScheduleItem[] = PRAYER_SCHEDULE')) {
  throw new Error('getNextPrayer does not accept a dynamic schedule.');
}

// The bundled fallback is a shape-only placeholder. Fixed clock values can be
// wrong tomorrow or at another location and must never re-enter the app.
for (const forbidden of ['04:18', '05:54', '12:45', '16:42', '19:36', '21:07']) {
  if (schedule.includes(forbidden)) throw new Error(`Static prayer fallback clock value must not be bundled: ${forbidden}`);
}
const placeholderCount = [...schedule.matchAll(/time: '—:—'/g)].length;
if (placeholderCount !== 6) throw new Error(`Expected six clock-free fallback rows, found ${placeholderCount}.`);
for (const required of [
  "sourceLabel: 'Offline-Ersatzzeitplan'",
  'Keine aktuellen Gebetszeiten verfügbar',
  "if (!Number.isFinite(totalMinutes)) return 'nicht verfügbar'",
  'const timedPrayers = obligatoryPrayers.filter',
]) {
  if (!schedule.includes(required)) throw new Error(`Prayer fallback safety is missing: ${required}`);
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
  'currentDateKey',
  'completedDateKey',
  'document.visibilityState',
  "window.addEventListener('focus', syncClock)",
  'setCompletedDateKey(currentDateKey)',
  'reference-prayer-location-privacy',
  'an AlAdhan übermittelt',
];
for (const requirement of screenRequirements) {
  if (!screen.includes(requirement)) throw new Error(`Prayer screen live feature is missing: ${requirement}`);
}

for (const rolloverRequirement of [
  'getPrayerDateKey',
  'prayerDateKeyRef',
  'refreshAfterDayChange',
  'bootstrapSharedPrayerTimes()',
  'setPrayerTimesVersion',
]) {
  if (!main.includes(rolloverRequirement)) {
    throw new Error(`Shared home prayer schedule rollover is missing: ${rolloverRequirement}`);
  }
}

if (!styles.includes('.reference-prayer-live-status') || !styles.includes('.reference-prayer-settings-modal') || !styles.includes('.reference-prayer-location-privacy')) {
  throw new Error('Live prayer time styles are incomplete.');
}
if (!styleIndex.includes('reference-live-prayer-times.css')) {
  throw new Error('Live prayer time stylesheet is not loaded.');
}

console.log('Live prayer times verified: AlAdhan is used only with a device-backed location, generic Berlin/default caches are rejected, method and Asr controls remain available, and the clock-free fallback cannot masquerade as a personal timetable.');
