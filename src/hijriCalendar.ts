/**
 * Shared Hijri date handling.
 *
 * The bare `islamic` calendar identifier is implementation-defined: ICU builds
 * map it to Umm al-Qura or to a tabular civil calendar, and those disagree by
 * up to two days. The app shows the Hijri date on the home screen and derives
 * the white fasting days from it, so that variance cannot be left to the
 * device. The calendar is pinned to Umm al-Qura, which is what the previously
 * used identifier already resolved to on the current platform.
 *
 * This only makes the *calculated* calendar deterministic. Local moon sighting
 * can still differ by a day, which the calendar screen states explicitly.
 */

const PREFERRED_CALENDAR = 'islamic-umalqura';
const FALLBACK_CALENDAR = 'islamic';
const localeCache = new Map<string, string>();

function calendarLocale(base: string) {
  const cached = localeCache.get(base);
  if (cached) return cached;

  const pinned = `${base}-u-ca-${PREFERRED_CALENDAR}`;
  let resolved = `${base}-u-ca-${FALLBACK_CALENDAR}`;
  try {
    // An unsupported calendar extension is ignored rather than rejected, which
    // would render Gregorian dates labelled as Hijri. Confirm before trusting.
    if (new Intl.DateTimeFormat(pinned).resolvedOptions().calendar === PREFERRED_CALENDAR) {
      resolved = pinned;
    }
  } catch {
    // Keep the fallback locale.
  }

  localeCache.set(base, resolved);
  return resolved;
}

/** Day of the Hijri month, or 0 when the platform cannot provide one. */
export function getHijriDay(date: Date) {
  try {
    const parts = new Intl.DateTimeFormat(calendarLocale('en'), { day: 'numeric' }).formatToParts(date);
    const day = Number(parts.find((part) => part.type === 'day')?.value ?? 0);
    return Number.isInteger(day) && day >= 1 && day <= 30 ? day : 0;
  } catch {
    return 0;
  }
}

/** German Hijri date, e.g. "25. Safar 1448 AH". */
export function getHijriLabel(date: Date, fallback = 'Islamisches Datum') {
  try {
    return new Intl.DateTimeFormat(calendarLocale('de-DE'), {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  } catch {
    return fallback;
  }
}
