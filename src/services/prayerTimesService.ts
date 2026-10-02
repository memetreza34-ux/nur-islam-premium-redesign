import { getPrayerClock, prayerTimeToMinutes, PRAYER_SCHEDULE, PRAYER_SCHEDULE_META, registerPrayerScheduleContext, setFollowingPrayerDay } from './prayerSchedule';
import type { PrayerScheduleItem, PrayerScheduleMeta } from './prayerSchedule';

export type PrayerCalculationMethod = 3 | 13;
export type AsrSchool = 0 | 1;

export type PrayerLocation = {
  latitude: number;
  longitude: number;
  label: string;
  source: 'default' | 'device';
};

export type PrayerTimesPreferences = {
  method: PrayerCalculationMethod;
  school: AsrSchool;
};

export type PrayerTimesSnapshot = {
  schedule: PrayerScheduleItem[];
  meta: PrayerScheduleMeta;
  location: PrayerLocation;
  preferences: PrayerTimesPreferences;
  dateKey: string;
  fetchedAt: string;
  source: 'live' | 'cache' | 'fallback';
};

export type PrayerTimesCalendarDay = {
  dateKey: string;
  schedule: PrayerScheduleItem[];
};

export type PrayerTimesMonth = {
  monthKey: string;
  days: PrayerTimesCalendarDay[];
  meta: PrayerScheduleMeta;
  location: PrayerLocation;
  preferences: PrayerTimesPreferences;
  fetchedAt: string;
};

export const DEFAULT_PRAYER_LOCATION: PrayerLocation = {
  latitude: 52.52,
  longitude: 13.405,
  label: 'Berlin, Deutschland',
  source: 'default',
};

export const DEFAULT_PRAYER_PREFERENCES: PrayerTimesPreferences = {
  method: 13,
  school: 0,
};

export const PRAYER_METHOD_OPTIONS: Array<{ id: PrayerCalculationMethod; label: string; shortLabel: string }> = [
  { id: 13, label: 'Diyanet İşleri Başkanlığı · API experimentell', shortLabel: 'Diyanet (experimentell)' },
  { id: 3, label: 'Muslim World League', shortLabel: 'MWL' },
];

export const ASR_SCHOOL_OPTIONS: Array<{ id: AsrSchool; label: string; description: string }> = [
  { id: 0, label: 'Standard', description: 'Asr-Faktor 1' },
  { id: 1, label: 'Hanafi', description: 'Asr-Faktor 2' },
];

const LOCATION_STORAGE_KEY = 'nur_prayer_location';
const PREFERENCES_STORAGE_KEY = 'nur_prayer_preferences';
const SNAPSHOT_STORAGE_KEY = 'nur_prayer_times_latest';
const FALLBACK_PRAYER_SCHEDULE = PRAYER_SCHEDULE.map((prayer) => ({ ...prayer }));
const FALLBACK_PRAYER_META = { ...PRAYER_SCHEDULE_META };
let sharedGeneration = 0;

const timingKeys: Record<PrayerScheduleItem['id'], string> = {
  fajr: 'Fajr',
  sunrise: 'Sunrise',
  dhuhr: 'Dhuhr',
  asr: 'Asr',
  maghrib: 'Maghrib',
  isha: 'Isha',
};

type AlAdhanDay = {
  timings?: Record<string, string>;
  date?: {
    readable?: string;
    hijri?: { date?: string };
    gregorian?: { date?: string };
  };
  meta?: {
    timezone?: string;
    method?: { name?: string };
    school?: string;
  };
};

type AlAdhanResponse = {
  code?: number;
  status?: string;
  data?: AlAdhanDay;
};

type AlAdhanCalendarResponse = {
  code?: number;
  status?: string;
  data?: AlAdhanDay[];
};

export function getPrayerDateKey(date = new Date(), timezone?: string) {
  if (timezone) return getPrayerClock(date, timezone)?.dateKey ?? '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getPrayerMonthKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

function normalizeTime(value: unknown) {
  if (typeof value !== 'string') throw new Error('Gebetszeit fehlt in der API-Antwort.');
  const match = value.trim().match(/^(\d{1,2}):(\d{2})/);
  if (!match) throw new Error(`Ungültige Gebetszeit: ${value}`);
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) throw new Error(`Ungültige Gebetszeit: ${value}`);
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

function methodLabel(preferences: PrayerTimesPreferences) {
  const method = PRAYER_METHOD_OPTIONS.find((option) => option.id === preferences.method)?.shortLabel ?? `Methode ${preferences.method}`;
  const school = ASR_SCHOOL_OPTIONS.find((option) => option.id === preferences.school)?.label ?? 'Asr';
  return `${method} · ${school}-Asr`;
}

function fallbackSchedule() {
  return FALLBACK_PRAYER_SCHEDULE.map((prayer) => ({ ...prayer, time: '—:—' }));
}

function fallbackMeta(location = DEFAULT_PRAYER_LOCATION, preferences = DEFAULT_PRAYER_PREFERENCES): PrayerScheduleMeta {
  return {
    ...FALLBACK_PRAYER_META,
    city: location.label,
    locationLabel: location.label,
    sourceLabel: 'Keine bestätigten Gebetszeiten',
    methodLabel: methodLabel(preferences),
    timezone: undefined,
    dateKey: undefined,
    source: 'fallback',
    locationSource: location.source,
    calculationNotice: 'Keine aktuellen Zeiten gespeichert. Bitte verbinde dich mit dem Internet und lade die Gebetszeiten für deinen Standort.',
  };
}

function readJson<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) as T : null;
  } catch {
    return null;
  }
}

function writeJson(key: string, value: unknown) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* optional cache */ }
}

function isPrayerLocation(value: unknown): value is PrayerLocation {
  if (!value || typeof value !== 'object') return false;
  const location = value as Partial<PrayerLocation>;
  return Number.isFinite(location.latitude)
    && Number.isFinite(location.longitude)
    && Math.abs(location.latitude!) <= 90
    && Math.abs(location.longitude!) <= 180
    && typeof location.label === 'string'
    && (location.source === 'default' || location.source === 'device');
}

function isPreferences(value: unknown): value is PrayerTimesPreferences {
  if (!value || typeof value !== 'object') return false;
  const preferences = value as Partial<PrayerTimesPreferences>;
  return (preferences.method === 3 || preferences.method === 13)
    && (preferences.school === 0 || preferences.school === 1);
}

export function loadPrayerLocation() {
  const location = readJson<PrayerLocation>(LOCATION_STORAGE_KEY);
  return isPrayerLocation(location) ? location : DEFAULT_PRAYER_LOCATION;
}

export function savePrayerLocation(location: PrayerLocation) {
  writeJson(LOCATION_STORAGE_KEY, location);
}

export function loadPrayerPreferences() {
  const preferences = readJson<PrayerTimesPreferences>(PREFERENCES_STORAGE_KEY);
  return isPreferences(preferences) ? preferences : DEFAULT_PRAYER_PREFERENCES;
}

export function savePrayerPreferences(preferences: PrayerTimesPreferences) {
  writeJson(PREFERENCES_STORAGE_KEY, preferences);
}

export function loadCachedPrayerTimes(date = new Date(), location = loadPrayerLocation(), preferences = loadPrayerPreferences()) {
  const cached = readJson<PrayerTimesSnapshot>(SNAPSHOT_STORAGE_KEY);
  if (!cached || !cached.meta?.timezone || !['live', 'cache'].includes(cached.source)
    || !isPrayerLocation(cached.location) || !isPreferences(cached.preferences)
    || cached.location.latitude !== location.latitude || cached.location.longitude !== location.longitude
    || cached.preferences.method !== preferences.method || cached.preferences.school !== preferences.school
    || cached.dateKey !== getPrayerDateKey(date, cached.meta.timezone)
    || !Array.isArray(cached.schedule) || cached.schedule.length !== FALLBACK_PRAYER_SCHEDULE.length
    || !FALLBACK_PRAYER_SCHEDULE.every((template, index) => cached.schedule[index]?.id === template.id && Number.isFinite(prayerTimeToMinutes(cached.schedule[index]?.time ?? '')))) return null;
  // The times are today's and came from AlAdhan, but nothing was requested just
  // now. Returning them still labelled "live" told an offline user the app had
  // just reached the server. The mosque cache already marks itself this way.
  const restored = {
    ...cached,
    schedule: FALLBACK_PRAYER_SCHEDULE.map((template, index) => ({ ...template, time: cached.schedule[index].time })),
    source: 'cache' as const,
    meta: { ...cached.meta, dateKey: cached.dateKey, source: 'cache' as const, locationSource: location.source, sourceLabel: 'AlAdhan · gespeicherter Tagesstand' },
  };
  registerPrayerScheduleContext(restored.schedule, restored.meta);
  return restored;
}

function createFallbackSnapshot(location = loadPrayerLocation(), preferences = loadPrayerPreferences(), date = new Date()): PrayerTimesSnapshot {
  return {
    schedule: fallbackSchedule(),
    meta: fallbackMeta(location, preferences),
    location,
    preferences,
    dateKey: getPrayerDateKey(date),
    fetchedAt: new Date().toISOString(),
    source: 'fallback',
  };
}

export function getInitialPrayerTimesSnapshot(date = new Date()): PrayerTimesSnapshot {
  return loadCachedPrayerTimes(date) ?? createFallbackSnapshot(loadPrayerLocation(), loadPrayerPreferences(), date);
}

/**
 * Prayer times only change by seconds within a city, so the request does not
 * need the device's exact position. Two decimals is roughly a kilometre: enough
 * for a correct schedule, not enough to point at a home address.
 */
function coarseCoordinate(value: number) {
  return Math.round(value * 100) / 100;
}

function appendPrayerQuery(url: URL, location: PrayerLocation, preferences: PrayerTimesPreferences) {
  url.searchParams.set('latitude', String(coarseCoordinate(location.latitude)));
  url.searchParams.set('longitude', String(coarseCoordinate(location.longitude)));
  url.searchParams.set('method', String(preferences.method));
  url.searchParams.set('school', String(preferences.school));
}

function scheduleFromTimings(timings: Record<string, string> | undefined) {
  if (!timings) throw new Error('Die Gebetszeiten-API hat keine gültigen Daten geliefert.');
  return FALLBACK_PRAYER_SCHEDULE.map((prayer) => ({
    ...prayer,
    time: normalizeTime(timings[timingKeys[prayer.id]]),
  }));
}

function metaFromApi(data: AlAdhanDay, location: PrayerLocation, preferences: PrayerTimesPreferences): PrayerScheduleMeta {
  const apiMethodName = data.meta?.method?.name?.trim();
  const apiSchool = data.meta?.school?.trim();
  const apiTimezone = data.meta?.timezone?.trim();
  if (!apiTimezone || !getPrayerClock(new Date(), apiTimezone)) throw new Error('Zeitzone fehlt in der Gebetszeiten-Antwort.');
  const selectedMethodLabel = methodLabel(preferences);
  const selectedSchoolLabel = selectedMethodLabel.split(' · ')[1] ?? 'Asr';
  const liveMethodLabel = apiMethodName
    ? `${apiMethodName}${preferences.method === 13 ? ' (experimentell)' : ''}`
    : selectedMethodLabel.split(' · ')[0];
  return {
    ...FALLBACK_PRAYER_META,
    city: location.label,
    locationLabel: location.label,
    sourceLabel: 'Live via AlAdhan',
    methodLabel: `${liveMethodLabel} · ${apiSchool || selectedSchoolLabel}`,
    timezone: apiTimezone,
    source: 'live',
    locationSource: location.source,
    calculationNotice: 'Berechnete Gebetszeiten können je nach örtlicher Moschee, Methode und lokalen Korrekturen abweichen. Bitte bei Unsicherheit vor Ort prüfen.',
  };
}

export async function fetchPrayerTimes(
  location = loadPrayerLocation(),
  preferences = loadPrayerPreferences(),
  date?: Date,
  options: { cache?: boolean; dateKey?: string } = {},
): Promise<PrayerTimesSnapshot> {
  if (!isPrayerLocation(location) || !isPreferences(preferences)) throw new Error('Ungültiger Standort oder Berechnungsmethode.');
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 9000);
  const requestedKey = options.dateKey ?? getPrayerDateKey(date ?? new Date());
  const apiDate = requestedKey.split('-').reverse().join('-');
  const url = new URL(`https://api.aladhan.com/v1/timings/${apiDate}`);
  appendPrayerQuery(url, location, preferences);

  try {
    const response = await fetch(url, { signal: controller.signal, headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error(`Gebetszeiten konnten nicht geladen werden (${response.status}).`);
    const payload = await response.json() as AlAdhanResponse;
    if (payload.code !== 200 || !payload.data?.timings) throw new Error('Die Gebetszeiten-API hat keine gültigen Daten geliefert.');

    const schedule = scheduleFromTimings(payload.data.timings);
    const meta = metaFromApi(payload.data, location, preferences);
    const localDayKey = getPrayerDateKey(new Date(), meta.timezone);
    if (!date && !options.dateKey && requestedKey !== localDayKey) {
      return await fetchPrayerTimes(location, preferences, undefined, { ...options, dateKey: localDayKey });
    }
    const responseDate = payload.data.date?.gregorian?.date?.split('-').reverse().join('-');
    if (responseDate && responseDate !== requestedKey) throw new Error('Die Gebetszeiten gehören zu einem anderen Datum.');
    meta.dateKey = requestedKey;
    const snapshot: PrayerTimesSnapshot = {
      schedule,
      meta,
      location,
      preferences,
      dateKey: requestedKey,
      fetchedAt: new Date().toISOString(),
      source: 'live',
    };
    registerPrayerScheduleContext(schedule, meta);
    if (options.cache !== false) writeJson(SNAPSHOT_STORAGE_KEY, snapshot);
    return snapshot;
  } finally {
    window.clearTimeout(timeout);
  }
}

export async function fetchPrayerTimesMonth(
  location = loadPrayerLocation(),
  preferences = loadPrayerPreferences(),
  date = new Date(),
): Promise<PrayerTimesMonth> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 12000);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const daysInMonth = new Date(year, month, 0).getDate();
  const url = new URL(`https://api.aladhan.com/v1/calendar/${year}/${month}`);
  appendPrayerQuery(url, location, preferences);

  try {
    const response = await fetch(url, { signal: controller.signal, headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error(`Monatsplan konnte nicht geladen werden (${response.status}).`);
    const payload = await response.json() as AlAdhanCalendarResponse;
    if (payload.code !== 200 || !Array.isArray(payload.data) || payload.data.length < daysInMonth) {
      throw new Error('Die Gebetszeiten-API hat keinen vollständigen Monatsplan geliefert.');
    }

    const days = payload.data.slice(0, daysInMonth).map((entry, index) => ({
      dateKey: getPrayerDateKey(new Date(year, month - 1, index + 1, 12)),
      schedule: scheduleFromTimings(entry.timings),
    }));

    return {
      monthKey: getPrayerMonthKey(date),
      days,
      meta: metaFromApi(payload.data[0], location, preferences),
      location,
      preferences,
      fetchedAt: new Date().toISOString(),
    };
  } finally {
    window.clearTimeout(timeout);
  }
}

export function getFallbackPrayerTimesSnapshot(date = new Date()) {
  return createFallbackSnapshot(loadPrayerLocation(), loadPrayerPreferences(), date);
}

/* Compatibility aliases for older feature modules while the app migrates to the load/get naming. */
export const readPrayerLocation = loadPrayerLocation;
export const readPrayerPreferences = loadPrayerPreferences;
export const readCachedPrayerSnapshot = loadCachedPrayerTimes;
export function createFallbackPrayerSnapshot(
  location = loadPrayerLocation(),
  preferences = loadPrayerPreferences(),
  date = new Date(),
) {
  return createFallbackSnapshot(location, preferences, date);
}

export function applyPrayerSnapshotToSharedSchedule(snapshot: PrayerTimesSnapshot) {
  sharedGeneration += 1;
  PRAYER_SCHEDULE.splice(0, PRAYER_SCHEDULE.length, ...snapshot.schedule.map((prayer) => ({ ...prayer })));
  Object.assign(PRAYER_SCHEDULE_META, snapshot.meta, { dateKey: snapshot.dateKey, source: snapshot.source, locationSource: snapshot.location.source });
  setFollowingPrayerDay(null);
  window.dispatchEvent(new CustomEvent('nur:prayer-times-updated', { detail: snapshot }));
}

export async function bootstrapSharedPrayerTimes() {
  const cached = loadCachedPrayerTimes();
  applyPrayerSnapshotToSharedSchedule(cached ?? getFallbackPrayerTimesSnapshot());
  const generation = sharedGeneration;
  try {
    const live = await fetchPrayerTimes(loadPrayerLocation(), loadPrayerPreferences());
    if (generation !== sharedGeneration) return live;
    applyPrayerSnapshotToSharedSchedule(live);
    void loadFollowingPrayerDay(live);
    return live;
  } catch {
    if (generation !== sharedGeneration) return getInitialPrayerTimesSnapshot();
    if (cached) return cached;
    const fallback = getFallbackPrayerTimesSnapshot();
    applyPrayerSnapshotToSharedSchedule(fallback);
    return fallback;
  }
}

export async function loadFollowingPrayerDay(snapshot: PrayerTimesSnapshot) {
  if (snapshot.source === 'fallback') return;
  const generation = sharedGeneration;
  const day = new Date(`${snapshot.dateKey}T12:00:00Z`);
  day.setUTCDate(day.getUTCDate() + 1);
  try {
    const next = await fetchPrayerTimes(snapshot.location, snapshot.preferences, undefined, { cache: false, dateKey: day.toISOString().slice(0, 10) });
    if (generation !== sharedGeneration) return;
    setFollowingPrayerDay({ schedule: next.schedule, meta: next.meta });
    window.dispatchEvent(new CustomEvent('nur:prayer-times-updated'));
  } catch { /* Tomorrow stays unknown; today's real timetable remains usable. */ }
}
