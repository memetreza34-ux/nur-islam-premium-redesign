import { PRAYER_SCHEDULE, PRAYER_SCHEDULE_META, prayerTimeToMinutes } from './prayerSchedule';

/**
 * When the Islamic day actually turns.
 *
 * The Islamic day begins at Maghrib, not at midnight. Everything derived from
 * `new Date()` therefore names the wrong day for the hours between sunset and
 * midnight — which is exactly when the nights that matter religiously are
 * observed. Laylat al-Qadr on the 27th is the night that *starts* on the 26th
 * Gregorian evening; an app that waits for 00:00 tells people about it after it
 * has begun.
 *
 * This is the one place that decides it, so the calendar, the Home chip and
 * anything else asking "what is today" cannot drift apart.
 *
 * The boundary needs a Maghrib time that is true for this location today. The
 * offline fallback schedule is a placeholder, not a timetable for today's
 * sunset, so it is deliberately not trusted here — see `readTrustedMaghribTime`.
 */
export type IslamicDayResolution = 'maghrib' | 'unknown-maghrib';

export type EffectiveIslamicDay = {
  /**
   * The Gregorian date whose Hijri conversion is the current Islamic day.
   * Fixed at local noon, so converting it cannot be pushed across a boundary by
   * a daylight-saving shift.
   */
  date: Date;
  /** True once Maghrib has passed and the Islamic day is the following one. */
  afterMaghrib: boolean;
  /** 'unknown-maghrib' means the calendar day was used because nothing better was known. */
  resolution: IslamicDayResolution;
  /** The Maghrib time the decision used, when there was one. */
  maghrib: string | null;
};

function atLocalNoon(date: Date) {
  const value = new Date(date);
  value.setHours(12, 0, 0, 0);
  return value;
}

function nextLocalDay(date: Date) {
  const value = atLocalNoon(date);
  value.setDate(value.getDate() + 1);
  return value;
}

/**
 * Resolves the effective Islamic day from a moment and a Maghrib time.
 *
 * Pure on purpose: the Maghrib time is passed in rather than read, so the
 * boundary can be tested at the minute without a location, a network or a
 * clock. Pass `null` when no trusted time is available for that day.
 */
export function resolveIslamicDay(now: Date, maghrib: string | null): EffectiveIslamicDay {
  const maghribMinutes = maghrib ? prayerTimeToMinutes(maghrib) : Number.NaN;
  if (!Number.isFinite(maghribMinutes)) {
    return { date: atLocalNoon(now), afterMaghrib: false, resolution: 'unknown-maghrib', maghrib: null };
  }

  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  // At Maghrib exactly, the new day has begun.
  const afterMaghrib = nowMinutes >= maghribMinutes;
  return {
    date: afterMaghrib ? nextLocalDay(now) : atLocalNoon(now),
    afterMaghrib,
    resolution: 'maghrib',
    maghrib,
  };
}

/**
 * Today's Maghrib from the shared schedule, or null when it cannot be trusted.
 *
 * The fallback schedule's `sourceLabel` is the same signal the rest of the app
 * uses to tell a live/cached timetable from the offline placeholder; a
 * religious date must not move on the strength of a placeholder.
 */
export function readTrustedMaghribTime(): string | null {
  if (PRAYER_SCHEDULE_META.sourceLabel === 'Offline-Ersatzzeitplan') return null;
  const maghrib = PRAYER_SCHEDULE.find((prayer) => prayer.id === 'maghrib');
  if (!maghrib || !Number.isFinite(prayerTimeToMinutes(maghrib.time))) return null;
  return maghrib.time;
}

/** The effective Islamic day right now, from whatever the app reliably knows. */
export function getEffectiveIslamicDay(now = new Date()): EffectiveIslamicDay {
  return resolveIslamicDay(now, readTrustedMaghribTime());
}
