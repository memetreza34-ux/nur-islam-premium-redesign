import { prayerTimeToMinutes, type PrayerId, type PrayerScheduleItem } from '../services/prayerSchedule';

export type PrayerBackdropId = Exclude<PrayerId, 'sunrise'>;

export const PRAYER_BACKDROPS: Record<PrayerBackdropId, string> = {
  fajr: '/premium-assets/high-res-objects/prayer-fajr-v1.webp',
  dhuhr: '/premium-assets/high-res-objects/prayer-dhuhr-v1.webp',
  asr: '/premium-assets/high-res-objects/prayer-asr-v1.webp',
  maghrib: '/premium-assets/high-res-objects/prayer-maghrib-v1.webp',
  isha: '/premium-assets/high-res-objects/prayer-isha-v1.webp',
};

export function getPrayerBackdrop(scene?: PrayerBackdropId) {
  return scene ? PRAYER_BACKDROPS[scene] : undefined;
}

// Prayer times are local wall-clock values in the timetable's timezone.
// This only chooses decorative artwork; it never changes a prayer or countdown.
export function getCurrentPrayerScene(
  now: Date,
  schedule: PrayerScheduleItem[],
  timezone?: string,
): PrayerBackdropId | undefined {
  if (!timezone || !Number.isFinite(now.getTime())) return undefined;
  let minutes: number;
  try {
    const parts = new Intl.DateTimeFormat('en-GB', {
      timeZone: timezone, hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
    }).formatToParts(now);
    minutes = Number(parts.find((part) => part.type === 'hour')?.value) * 60
      + Number(parts.find((part) => part.type === 'minute')?.value);
  } catch {
    return undefined;
  }
  const boundary = (id: PrayerId) => prayerTimeToMinutes(schedule.find((item) => item.id === id)?.time ?? '');
  const [fajr, sunrise, asr, maghrib, isha] = ['fajr', 'sunrise', 'asr', 'maghrib', 'isha'].map((id) => boundary(id as PrayerId));
  if (![minutes, fajr, sunrise, asr, maghrib, isha].every(Number.isFinite)) return undefined;
  if (!(fajr < sunrise && sunrise < asr && asr < maghrib)) return undefined;
  // Isha may fall after midnight, but must still precede the next dawn.
  if (!(isha > maghrib || isha < fajr)) return undefined;

  if (minutes >= fajr && minutes < sunrise) return 'fajr';
  if (minutes >= sunrise && minutes < asr) return 'dhuhr';
  if (minutes >= asr && minutes < maghrib) return 'asr';
  const evening = isha > maghrib
    ? minutes >= maghrib && minutes < isha
    : minutes >= maghrib || minutes < isha;
  return evening ? 'maghrib' : 'isha';
}
