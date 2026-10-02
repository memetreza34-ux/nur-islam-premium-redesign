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
  dateKey?: string;
  source?: 'live' | 'cache' | 'fallback';
  locationSource?: 'default' | 'device';
};

export const PRAYER_SCHEDULE_META: PrayerScheduleMeta = {
  city: 'Berlin',
  country: 'Deutschland',
  locationLabel: 'Berlin, Deutschland',
  sourceLabel: 'Gebetszeiten noch nicht geladen',
  methodLabel: 'Diyanet (experimentell) · Standard-Asr',
  timezone: 'Europe/Berlin',
  source: 'fallback',
  locationSource: 'default',
  calculationNotice: 'Es liegen keine bestätigten Gebetszeiten vor. Bitte lade die Zeiten für deinen Standort.',
};

export const PRAYER_SCHEDULE: PrayerScheduleItem[] = [
  { id: 'fajr', label: 'Fajr', compactLabel: 'Fajr', arabic: 'الفجر', time: '—:—', description: 'Morgengebet', obligatory: true, visual: 'moon' },
  { id: 'sunrise', label: 'Sonnenaufgang', compactLabel: 'Sonne', arabic: 'الشروق', time: '—:—', description: 'Shuruq', obligatory: false, visual: 'sunrise' },
  { id: 'dhuhr', label: 'Dhuhr', compactLabel: 'Dhuhr', arabic: 'الظهر', time: '—:—', description: 'Mittagsgebet', obligatory: true, visual: 'sun' },
  { id: 'asr', label: 'Asr', compactLabel: 'Asr', arabic: 'العصر', time: '—:—', description: 'Nachmittagsgebet', obligatory: true, visual: 'afternoon' },
  { id: 'maghrib', label: 'Maghrib', compactLabel: 'Maghrib', arabic: 'المغرب', time: '—:—', description: 'Abendgebet', obligatory: true, visual: 'sunset' },
  { id: 'isha', label: 'Isha', compactLabel: 'Isha', arabic: 'العشاء', time: '—:—', description: 'Nachtgebet', obligatory: true, visual: 'moon' },
];

const scheduleContexts = new WeakMap<PrayerScheduleItem[], PrayerScheduleMeta>();
let followingDay: { schedule: PrayerScheduleItem[]; meta: PrayerScheduleMeta } | null = null;

export function registerPrayerScheduleContext(schedule: PrayerScheduleItem[], meta: PrayerScheduleMeta) {
  scheduleContexts.set(schedule, meta);
}

export function setFollowingPrayerDay(value: typeof followingDay) { followingDay = value; }

export function getPrayerClock(now: Date, timezone?: string) {
  if (!Number.isFinite(now.getTime())) return null;
  try {
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: timezone, year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
    }).formatToParts(now);
    const part = (type: string) => parts.find(item => item.type === type)?.value;
    return { dateKey: `${part('year')}-${part('month')}-${part('day')}`, minutes: Number(part('hour')) * 60 + Number(part('minute')) };
  } catch { return null; }
}

export function isSharedPrayerScheduleCurrent(now = new Date()) {
  return PRAYER_SCHEDULE_META.source !== 'fallback'
    && !!PRAYER_SCHEDULE_META.dateKey
    && getPrayerClock(now, PRAYER_SCHEDULE_META.timezone)?.dateKey === PRAYER_SCHEDULE_META.dateKey;
}

function prayerInstant(dateKey: string, minutes: number, timezone?: string) {
  const [year, month, day] = dateKey.split('-').map(Number);
  if (!timezone) return new Date(year, month - 1, day, 0, minutes).getTime();
  const wallTime = Date.UTC(year, month - 1, day, 0, minutes);
  let instant = wallTime;
  for (let pass = 0; pass < 3; pass += 1) {
    const clock = getPrayerClock(new Date(instant), timezone);
    if (!clock) return Number.NaN;
    const represented = Date.parse(`${clock.dateKey}T00:00:00Z`) + clock.minutes * 60000;
    if (represented === wallTime) return instant;
    instant += wallTime - represented;
  }
  return Number.NaN;
}

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
  // Validated rather than parsed loosely: the placeholder "—:—" and a nonsense
  // value like "25:00" both used to come back as a number, so a caller asking
  // "is this a real time?" got yes for both. Everything downstream — the next
  // prayer, the Maghrib day boundary — then computed on a time that does not
  // exist. NaN is the honest answer and every caller already checks for it.
  const match = time.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return Number.NaN;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return Number.NaN;
  return hours * 60 + minutes;
}

export function formatPrayerRemaining(totalMinutes: number) {
  const safe = Math.max(0, Math.round(totalMinutes));
  const hours = Math.floor(safe / 60);
  const minutes = safe % 60;
  if (hours === 0) return `${minutes} Min.`;
  return `${hours} Std. ${minutes} Min.`;
}

/**
 * The next obligatory prayer, or `null` when there is no usable timetable.
 *
 * Null rather than a placeholder on purpose. With no parseable clock values the
 * old code still answered with the first obligatory prayer, which reads as
 * "Fajr is next" to every caller that renders `prayer` without also inspecting
 * `remaining`. A screen can forget a check; it cannot render null by accident.
 */
export function getNextPrayer(now = new Date(), schedule: PrayerScheduleItem[] = PRAYER_SCHEDULE): NextPrayer | null {
  const meta = schedule === PRAYER_SCHEDULE ? PRAYER_SCHEDULE_META : scheduleContexts.get(schedule);
  const clock = getPrayerClock(now, meta?.timezone);
  if (!clock || (meta && (meta.source === 'fallback' || meta.dateKey !== clock.dateKey))) return null;
  const allObligatory = schedule.filter((item) => item.obligatory);
  if (!allObligatory.length) throw new Error('Der Gebetszeitplan enthält keine Pflichtgebete.');

  const obligatoryPrayers = allObligatory.filter((prayer) => Number.isFinite(prayerTimeToMinutes(prayer.time)));
  if (!obligatoryPrayers.length) return null;

  const currentMinutes = clock.minutes;
  const maghribMinutes = prayerTimeToMinutes(schedule.find(item => item.id === 'maghrib')?.time ?? '');
  const timetableMinutes = (prayer: PrayerScheduleItem) => {
    const minutes = prayerTimeToMinutes(prayer.time);
    return prayer.id === 'isha' && minutes < maghribMinutes ? minutes + 1440 : minutes;
  };
  const ishaMinutes = timetableMinutes(obligatoryPrayers[obligatoryPrayers.length - 1]);
  // Yesterday's after-midnight Isha needs yesterday's actual timetable.
  if (ishaMinutes >= 1440 && currentMinutes < ishaMinutes - 1440) return null;
  const nextToday = obligatoryPrayers.find((prayer) => timetableMinutes(prayer) > currentMinutes);

  if (nextToday) {
    const index = obligatoryPrayers.findIndex((prayer) => prayer.id === nextToday.id);
    const previous = index > 0 ? obligatoryPrayers[index - 1] : null;
    const nextMinutes = timetableMinutes(nextToday);
    const previousMinutes = previous ? timetableMinutes(previous) : 0;
    const nextInstant = prayerInstant(clock.dateKey, nextMinutes, meta?.timezone);
    const previousInstant = prayerInstant(clock.dateKey, previousMinutes, meta?.timezone);
    if (!Number.isFinite(nextInstant) || !Number.isFinite(previousInstant)) return null;
    const elapsed = now.getTime() - previousInstant;
    const interval = Math.max(1, nextInstant - previousInstant);

    return {
      prayer: nextToday,
      remaining: Math.ceil((nextInstant - now.getTime()) / 60000),
      progress: Math.min(100, Math.max(0, (elapsed / interval) * 100)),
      tomorrow: nextMinutes >= 1440,
    };
  }

  if (schedule !== PRAYER_SCHEDULE || !followingDay || followingDay.meta.source === 'fallback') return null;
  const day = new Date(`${clock.dateKey}T12:00:00Z`);
  day.setUTCDate(day.getUTCDate() + 1);
  if (followingDay.meta.dateKey !== day.toISOString().slice(0, 10) || followingDay.meta.timezone !== meta?.timezone) return null;
  const fajr = followingDay.schedule.find(prayer => prayer.id === 'fajr');
  if (!fajr || !Number.isFinite(prayerTimeToMinutes(fajr.time))) return null;
  const isha = obligatoryPrayers[obligatoryPrayers.length - 1];
  const nextInstant = prayerInstant(followingDay.meta.dateKey!, prayerTimeToMinutes(fajr.time), meta?.timezone);
  const previousInstant = prayerInstant(clock.dateKey, prayerTimeToMinutes(isha.time), meta?.timezone);
  if (!Number.isFinite(nextInstant) || !Number.isFinite(previousInstant)) return null;
  const interval = Math.max(1, nextInstant - previousInstant);
  const elapsed = now.getTime() - previousInstant;

  return {
    prayer: fajr,
    remaining: Math.ceil((nextInstant - now.getTime()) / 60000),
    progress: Math.min(100, Math.max(0, (elapsed / interval) * 100)),
    tomorrow: true,
  };
}
