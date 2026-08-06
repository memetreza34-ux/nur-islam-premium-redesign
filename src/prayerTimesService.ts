import { PRAYER_SCHEDULE, PRAYER_SCHEDULE_META } from './prayerSchedule';
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
  { id: 13, label: 'Diyanet İşleri Başkanlığı', shortLabel: 'Diyanet' },
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

const timingKeys: Record<PrayerScheduleItem['id'], string> = {
  fajr: 'Fajr',
  sunrise: 'Sunrise',
  dhuhr: 'Dhuhr',
  asr: 'Asr',
  maghrib: 'Maghrib',
  isha: 'Isha',
};

type AlAdhanResponse = {
  code?: number;
  status?: string;
  data?: {
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
};

export function getPrayerDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getApiDate(date: Date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${day}-${month}-${date.getFullYear()}`;
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

function safeCoordinates(value: unknown): value is PrayerLocation {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<PrayerLocation>;
  return typeof candidate.latitude === 'number'
    && Number.isFinite(candidate.latitude)
    && candidate.latitude >= -90
    && candidate.latitude <= 90
    && typeof candidate.longitude === 'number'
    && Number.isFinite(candidate.longitude)
    && candidate.longitude >= -180
    && candidate.longitude <= 180
    && typeof candidate.label === 'string'
    && (candidate.source === 'default' || candidate.source === 'device');
}

function safePreferences(value: unknown): value is PrayerTimesPreferences {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<PrayerTimesPreferences>;
  return (candidate.method === 3 || candidate.method === 13) && (candidate.school === 0 || candidate.school === 1);
}

function safeSchedule(value: unknown): value is PrayerScheduleItem[] {
  if (!Array.isArray(value) || value.length !== FALLBACK_PRAYER_SCHEDULE.length) return false;
  return FALLBACK_PRAYER_SCHEDULE.every((base, index) => {
    const candidate = value[index] as Partial<PrayerScheduleItem> | undefined;
    return candidate?.id === base.id && typeof candidate.time === 'string' && /^\d{2}:\d{2}$/.test(candidate.time);
  });
}

export function applyPrayerSnapshotToSharedSchedule(snapshot: PrayerTimesSnapshot) {
  PRAYER_SCHEDULE.splice(0, PRAYER_SCHEDULE.length, ...snapshot.schedule.map((prayer) => ({ ...prayer })));
  Object.assign(PRAYER_SCHEDULE_META, snapshot.meta);
  window.dispatchEvent(new CustomEvent('nur:prayer-times-updated', { detail: snapshot.source }));
}

export function readPrayerLocation() {
  try {
    const parsed = JSON.parse(localStorage.getItem(LOCATION_STORAGE_KEY) ?? 'null') as unknown;
    return safeCoordinates(parsed) ? parsed : DEFAULT_PRAYER_LOCATION;
  } catch {
    return DEFAULT_PRAYER_LOCATION;
  }
}

export function savePrayerLocation(location: PrayerLocation) {
  try { localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(location)); } catch { /* optional */ }
}

export function readPrayerPreferences() {
  try {
    const parsed = JSON.parse(localStorage.getItem(PREFERENCES_STORAGE_KEY) ?? 'null') as unknown;
    return safePreferences(parsed) ? parsed : DEFAULT_PRAYER_PREFERENCES;
  } catch {
    return DEFAULT_PRAYER_PREFERENCES;
  }
}

export function savePrayerPreferences(preferences: PrayerTimesPreferences) {
  try { localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(preferences)); } catch { /* optional */ }
}

export function createFallbackPrayerSnapshot(
  location = readPrayerLocation(),
  preferences = readPrayerPreferences(),
  date = new Date(),
): PrayerTimesSnapshot {
  return {
    schedule: FALLBACK_PRAYER_SCHEDULE.map((prayer) => ({ ...prayer })),
    meta: {
      ...FALLBACK_PRAYER_META,
      city: location.source === 'device' ? 'Gerätestandort' : 'Berlin',
      locationLabel: location.label,
      sourceLabel: 'Offline-Fallback',
      methodLabel: methodLabel(preferences),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      calculationNotice: 'Lokaler Ersatzzeitplan – vor dem Gebet mit einer örtlichen Moschee oder einem verlässlichen Kalender abgleichen.',
    },
    location,
    preferences,
    dateKey: getPrayerDateKey(date),
    fetchedAt: new Date(0).toISOString(),
    source: 'fallback',
  };
}

export function readCachedPrayerSnapshot(date = new Date()) {
  try {
    const parsed = JSON.parse(localStorage.getItem(SNAPSHOT_STORAGE_KEY) ?? 'null') as Partial<PrayerTimesSnapshot> | null;
    if (!parsed || parsed.dateKey !== getPrayerDateKey(date) || !safeSchedule(parsed.schedule) || !safeCoordinates(parsed.location) || !safePreferences(parsed.preferences)) return null;
    return {
      ...parsed,
      source: 'cache',
    } as PrayerTimesSnapshot;
  } catch {
    return null;
  }
}

function savePrayerSnapshot(snapshot: PrayerTimesSnapshot) {
  try { localStorage.setItem(SNAPSHOT_STORAGE_KEY, JSON.stringify(snapshot)); } catch { /* optional */ }
}

export async function fetchPrayerTimes(
  location: PrayerLocation,
  preferences: PrayerTimesPreferences,
  date = new Date(),
): Promise<PrayerTimesSnapshot> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 9000);
  const apiDate = getApiDate(date);
  const parameters = new URLSearchParams({
    latitude: String(location.latitude),
    longitude: String(location.longitude),
    method: String(preferences.method),
    school: String(preferences.school),
  });

  try {
    const response = await fetch(`https://api.aladhan.com/v1/timings/${apiDate}?${parameters.toString()}`, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    if (!response.ok) throw new Error(`Gebetszeiten-Quelle antwortet mit ${response.status}.`);
    const payload = await response.json() as AlAdhanResponse;
    if (payload.code !== 200 || !payload.data?.timings) throw new Error('Gebetszeiten-Quelle lieferte keine gültigen Daten.');

    const schedule = FALLBACK_PRAYER_SCHEDULE.map((prayer) => ({
      ...prayer,
      time: normalizeTime(payload.data?.timings?.[timingKeys[prayer.id]]),
    }));
    const timezone = payload.data.meta?.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone;
    const snapshot: PrayerTimesSnapshot = {
      schedule,
      meta: {
        city: location.source === 'device' ? 'Gerätestandort' : 'Berlin',
        country: location.source === 'device' ? '' : 'Deutschland',
        locationLabel: location.label,
        sourceLabel: 'AlAdhan · Live-Berechnung',
        methodLabel: methodLabel(preferences),
        timezone,
        calculationNotice: 'Berechnete Zeiten können von lokalen Moscheezeiten abweichen. Bitte bei Unsicherheit vor Ort abgleichen.',
      },
      location,
      preferences,
      dateKey: getPrayerDateKey(date),
      fetchedAt: new Date().toISOString(),
      source: 'live',
    };
    savePrayerLocation(location);
    savePrayerPreferences(preferences);
    savePrayerSnapshot(snapshot);
    applyPrayerSnapshotToSharedSchedule(snapshot);
    return snapshot;
  } finally {
    window.clearTimeout(timeout);
  }
}

export async function bootstrapSharedPrayerTimes() {
  const location = readPrayerLocation();
  const preferences = readPrayerPreferences();
  const cached = readCachedPrayerSnapshot();
  if (cached) applyPrayerSnapshotToSharedSchedule(cached);

  try {
    return await fetchPrayerTimes(location, preferences);
  } catch {
    if (cached) return cached;
    const fallback = createFallbackPrayerSnapshot(location, preferences);
    applyPrayerSnapshotToSharedSchedule(fallback);
    return fallback;
  }
}
