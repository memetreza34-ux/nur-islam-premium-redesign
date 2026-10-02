import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getNextPrayer, getPrayerClock, PRAYER_SCHEDULE, PRAYER_SCHEDULE_META, registerPrayerScheduleContext, setFollowingPrayerDay, type PrayerScheduleMeta } from './prayerSchedule';
import { applyPrayerSnapshotToSharedSchedule, createFallbackPrayerSnapshot, DEFAULT_PRAYER_LOCATION, DEFAULT_PRAYER_PREFERENCES, fetchPrayerTimes, loadCachedPrayerTimes } from './prayerTimesService';

// Synthetic fixtures, never presented as real prayer times.
const times = ['05:00', '06:30', '12:00', '15:00', '18:00', '20:00'];
const originalSchedule = PRAYER_SCHEDULE.map(item => ({ ...item }));
const originalMeta = { ...PRAYER_SCHEDULE_META };
function fixture(dateKey = '2026-09-16', timezone = 'Europe/Berlin') {
  const schedule = originalSchedule.map((item, i) => ({ ...item, time: times[i] }));
  const meta: PrayerScheduleMeta = { ...originalMeta, dateKey, timezone, source: 'live' };
  registerPrayerScheduleContext(schedule, meta);
  return { schedule, meta, dateKey, source: 'live' as const, fetchedAt: `${dateKey}T10:00:00Z`, location: DEFAULT_PRAYER_LOCATION, preferences: DEFAULT_PRAYER_PREFERENCES };
}

beforeEach(() => { localStorage.clear(); setFollowingPrayerDay(null); });
afterEach(() => {
  PRAYER_SCHEDULE.splice(0, PRAYER_SCHEDULE.length, ...originalSchedule.map(item => ({ ...item })));
  Object.assign(PRAYER_SCHEDULE_META, originalMeta);
  setFollowingPrayerDay(null);
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe('truthful Start prayer display', () => {
  it('does not name a prayer from placeholder or stale data', () => {
    applyPrayerSnapshotToSharedSchedule(createFallbackPrayerSnapshot());
    expect(getNextPrayer(new Date('2026-09-16T10:00:00Z'))).toBeNull();
    const stale = fixture('2026-09-15');
    expect(getNextPrayer(new Date('2026-09-16T10:00:00Z'), stale.schedule)).toBeNull();
  });
  it('uses the saved location timezone, not the device clock', () => {
    const { schedule } = fixture('2026-09-16', 'Asia/Tokyo');
    const result = getNextPrayer(new Date('2026-09-16T02:30:00Z'), schedule);
    expect(result?.prayer.id).toBe('dhuhr');
    expect(result?.remaining).toBe(30);
  });
  it('skips sunrise as a next obligatory prayer', () => {
    const { schedule } = fixture();
    expect(getNextPrayer(new Date('2026-09-16T03:30:00Z'), schedule)?.prayer.id).toBe('dhuhr');
  });
  it('does not reuse today’s Fajr after Isha', () => {
    applyPrayerSnapshotToSharedSchedule(fixture());
    expect(getNextPrayer(new Date('2026-09-16T20:00:00Z'))).toBeNull();
  });
  it('uses tomorrow’s actual time and marks the day explicitly', () => {
    applyPrayerSnapshotToSharedSchedule(fixture());
    const tomorrow = fixture('2026-09-17');
    tomorrow.schedule[0].time = '05:07';
    setFollowingPrayerDay(tomorrow);
    const result = getNextPrayer(new Date('2026-09-16T20:00:00Z'));
    expect(result?.prayer.time).toBe('05:07');
    expect(result?.tomorrow).toBe(true);
    expect(result?.remaining).toBe(427);
    expect(result?.progress).toBeGreaterThan(0);
    expect(result?.progress).toBeLessThan(100);
  });
  it.each(['2026-09-16', '2026-09-18'])('rejects a following plan for the wrong date %s', date => {
    applyPrayerSnapshotToSharedSchedule(fixture());
    setFollowingPrayerDay(fixture(date));
    expect(getNextPrayer(new Date('2026-09-16T20:00:00Z'))).toBeNull();
  });
  it.each([
    ['2026-03-29', '2026-03-29T00:30:00Z', 150],
    ['2026-10-25', '2026-10-24T23:30:00Z', 270],
  ])('counts elapsed time across the clock change on %s', (date, instant, remaining) => {
    expect(getNextPrayer(new Date(instant), fixture(date).schedule)?.remaining).toBe(remaining);
  });
  it('identifies after-midnight Isha as tomorrow, without guessing yesterday’s Isha', () => {
    const { schedule } = fixture();
    schedule[5].time = '00:30';
    const result = getNextPrayer(new Date('2026-09-16T21:00:00Z'), schedule);
    expect(result?.prayer.id).toBe('isha');
    expect(result?.remaining).toBe(90);
    expect(result?.tomorrow).toBe(true);
    expect(getNextPrayer(new Date('2026-09-15T22:10:00Z'), schedule)).toBeNull();
  });
  it('fails safely for invalid clocks', () => {
    expect(getPrayerClock(new Date('invalid'))).toBeNull();
    expect(getPrayerClock(new Date(), 'Not/AZone')).toBeNull();
  });
});

describe('Start cache isolation', () => {
  const now = new Date('2026-09-16T10:00:00Z');
  it('accepts matching data while restoring canonical labels', () => {
    const value = fixture();
    value.schedule[0].label = 'Wrong label';
    localStorage.setItem('nur_prayer_times_latest', JSON.stringify(value));
    const cached = loadCachedPrayerTimes(now);
    expect(cached?.source).toBe('cache');
    expect(cached?.schedule[0].label).toBe('Fajr');
  });
  it.each(['location', 'method', 'school', 'date', 'fallback', 'time', 'timezone'])('rejects mismatched or invalid %s', reason => {
    const value = structuredClone(fixture());
    if (reason === 'location') value.location.latitude += 1;
    if (reason === 'method') value.preferences.method = 3;
    if (reason === 'school') value.preferences.school = 1;
    if (reason === 'date') value.dateKey = '2026-09-15';
    if (reason === 'fallback') value.source = 'fallback' as typeof value.source;
    if (reason === 'time') value.schedule[2].time = '25:00';
    if (reason === 'timezone') value.meta.timezone = 'Unknown/Zone';
    localStorage.setItem('nur_prayer_times_latest', JSON.stringify(value));
    expect(loadCachedPrayerTimes(now)).toBeNull();
  });
  it('rejects an API response for a different date', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => ({ ok: true, json: async () => ({ code: 200, data: {
      timings: Object.fromEntries(['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map((key, i) => [key, times[i]])),
      meta: { timezone: 'Europe/Berlin' }, date: { gregorian: { date: '15-09-2026' } },
    } }) })));
    await expect(fetchPrayerTimes(undefined, undefined, now)).rejects.toThrow('anderen Datum');
    expect(loadCachedPrayerTimes(now)).toBeNull();
  });
});
