export type PrayerId = 'fajr' | 'sunrise' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

export type PrayerScheduleItem = {
  id: PrayerId;
  label: string;
  compactLabel: string;
  arabic: string;
  time: string;
  description: string;
  obligatory: boolean;
  /**
   * Where the sun stands, not just whether it is up. Dhuhr and Asr both used
   * to be 'sun' and drew the same high midday glyph, so the afternoon prayer
   * looked like the midday one — and Maghrib, the sunset prayer, was drawn
   * with a sunrise.
   */
  visual: 'moon' | 'sunrise' | 'sun' | 'afternoon' | 'sunset';
};

export type PrayerScheduleMeta = {
  city: string;
  country: string;
  locationLabel: string;
  sourceLabel: string;
  methodLabel: string;
  timezone?: string;
  calculationNotice?: string;
};

export const PRAYER_SCHEDULE_META: PrayerScheduleMeta = {
  city: 'Berlin',
  country: 'Deutschland',
  locationLabel: 'Berlin, Deutschland',
  sourceLabel: 'Offline-Ersatzzeitplan',
  methodLabel: 'Diyanet (experimentell) · Standard-Asr',
  timezone: 'Europe/Berlin',
  calculationNotice: 'Keine aktuellen Gebetszeiten verfügbar. Bitte Live-Daten laden oder mit einer örtlichen Moschee bzw. einem verlässlichen Tageskalender abgleichen.',
};

/**
 * Shape-only fallback used while live/current cached timings are unavailable.
 *
 * IMPORTANT: These rows deliberately contain NO clock values. Older builds
 * bundled one fixed Berlin timetable and could therefore present stale times
 * on the wrong date or at the wrong location. Live/current cached data from
 * prayerTimesService replaces these placeholders before they may be treated as
 * prayer times.
 */
export const PRAYER_SCHEDULE: PrayerScheduleItem[] = [
  { id: 'fajr', label: 'Fajr', compactLabel: 'Fajr', arabic: 'الفجر', time: '—:—', description: 'Morgengebet', obligatory: true, visual: 'moon' },
  { id: 'sunrise', label: 'Sonnenaufgang', compactLabel: 'Sonne', arabic: 'الشروق', time: '—:—', description: 'Shuruq', obligatory: false, visual: 'sunrise' },
  { id: 'dhuhr', label: 'Dhuhr', compactLabel: 'Dhuhr', arabic: 'الظهر', time: '—:—', description: 'Mittagsgebet', obligatory: true, visual: 'sun' },
  { id: 'asr', label: 'Asr', compactLabel: 'Asr', arabic: 'العصر', time: '—:—', description: 'Nachmittagsgebet', obligatory: true, visual: 'afternoon' },
  { id: 'maghrib', label: 'Maghrib', compactLabel: 'Maghrib', arabic: 'المغرب', time: '—:—', description: 'Abendgebet', obligatory: true, visual: 'sunset' },
  { id: 'isha', label: 'Isha', compactLabel: 'Isha', arabic: 'العشاء', time: '—:—', description: 'Nachtgebet', obligatory: true, visual: 'moon' },
];

export const OBLIGATORY_PRAYER_IDS = PRAYER_SCHEDULE
  .filter((item) => item.obligatory)
  .map((item) => item.id);

export type NextPrayer = {
  prayer: PrayerScheduleItem;
  remaining: number;
  progress: number;
  tomorrow: boolean;
};

export function prayerTimeToMinutes(time: string) {
  const match = time.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return Number.NaN;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (!Number.isInteger(hours) || !Number.isInteger(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return Number.NaN;
  return hours * 60 + minutes;
}

export function formatPrayerRemaining(totalMinutes: number) {
  if (!Number.isFinite(totalMinutes)) return 'nicht verfügbar';
  const safe = Math.max(0, Math.round(totalMinutes));
  const hours = Math.floor(safe / 60);
  const minutes = safe % 60;
  if (hours === 0) return `${minutes} Min.`;
  return `${hours} Std. ${minutes} Min.`;
}

export function getNextPrayer(now = new Date(), schedule: PrayerScheduleItem[] = PRAYER_SCHEDULE): NextPrayer {
  const obligatoryPrayers = schedule.filter((item) => item.obligatory);
  if (!obligatoryPrayers.length) throw new Error('Der Gebetszeitplan enthält keine Pflichtgebete.');

  const timedPrayers = obligatoryPrayers.filter((prayer) => Number.isFinite(prayerTimeToMinutes(prayer.time)));
  if (!timedPrayers.length) {
    return {
      prayer: obligatoryPrayers[0],
      remaining: Number.NaN,
      progress: 0,
      tomorrow: false,
    };
  }

  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const nextToday = timedPrayers.find((prayer) => prayerTimeToMinutes(prayer.time) > currentMinutes);

  if (nextToday) {
    const index = timedPrayers.findIndex((prayer) => prayer.id === nextToday.id);
    const previous = index > 0 ? timedPrayers[index - 1] : timedPrayers[timedPrayers.length - 1];
    const nextMinutes = prayerTimeToMinutes(nextToday.time);
    const previousMinutes = index > 0
      ? prayerTimeToMinutes(previous.time)
      : prayerTimeToMinutes(previous.time) - 1440;
    const elapsed = currentMinutes - previousMinutes;
    const interval = Math.max(1, nextMinutes - previousMinutes);

    return {
      prayer: nextToday,
      remaining: nextMinutes - currentMinutes,
      progress: Math.min(100, Math.max(0, (elapsed / interval) * 100)),
      tomorrow: false,
    };
  }

  const fajr = timedPrayers[0];
  const isha = timedPrayers[timedPrayers.length - 1];
  const nextMinutes = prayerTimeToMinutes(fajr.time) + 1440;
  const previousMinutes = prayerTimeToMinutes(isha.time);
  const interval = Math.max(1, nextMinutes - previousMinutes);
  const elapsed = currentMinutes - previousMinutes;

  return {
    prayer: fajr,
    remaining: nextMinutes - currentMinutes,
    progress: Math.min(100, Math.max(0, (elapsed / interval) * 100)),
    tomorrow: true,
  };
}
