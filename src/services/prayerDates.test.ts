import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getPrayerDateKey, loadCachedPrayerTimes, fetchPrayerTimes } from './prayerTimesService';

// Prayer days are local calendar days, not 24-hour spans. On the two DST
// switch days a local day is 23 or 25 hours long, so anything derived from
// millisecond arithmetic would drift and either repeat or skip a day. These
// tests pin the local-component behaviour that avoids it.
//
// 2026 European DST: forward on 29 March, back on 25 October.

const TIMINGS = {
  Fajr: '04:11', Sunrise: '05:47', Dhuhr: '13:02',
  Asr: '16:55', Maghrib: '20:12', Isha: '21:44',
};

function apiResponse(body: unknown) {
  return { ok: true, status: 200, json: async () => body } as unknown as Response;
}

function stubValidApi() {
  vi.stubGlobal('fetch', vi.fn(async () => apiResponse({
    code: 200,
    data: { timings: TIMINGS, meta: { method: { name: 'Diyanet' }, school: 'Standard', timezone: 'Europe/Berlin' } },
  })));
}

describe('prayer day boundaries', () => {
  beforeEach(() => localStorage.clear());

  it('runs in a timezone that actually observes DST', () => {
    // Guards the assumptions below: in UTC these cases would prove nothing.
    const january = new Date(2026, 0, 15).getTimezoneOffset();
    const july = new Date(2026, 6, 15).getTimezoneOffset();
    expect(january).not.toBe(july);
  });

  it('keys the day by the local calendar date, not by UTC', () => {
    // 23:30 Berlin on 29 June is still 21:30 UTC the same day, but 00:30
    // Berlin on 30 June is 22:30 UTC on the 29th — the UTC date lags.
    expect(getPrayerDateKey(new Date(2026, 5, 29, 23, 30))).toBe('2026-06-29');
    expect(getPrayerDateKey(new Date(2026, 5, 30, 0, 30))).toBe('2026-06-30');
  });

  it('gives the spring-forward day a single key across the skipped hour', () => {
    // 02:00 does not exist on this date; both sides must still be 29 March.
    expect(getPrayerDateKey(new Date(2026, 2, 29, 1, 30))).toBe('2026-03-29');
    expect(getPrayerDateKey(new Date(2026, 2, 29, 3, 30))).toBe('2026-03-29');
    expect(getPrayerDateKey(new Date(2026, 2, 30, 0, 30))).toBe('2026-03-30');
  });

  it('gives the fall-back day a single key across the repeated hour', () => {
    // 02:00–03:00 happens twice on this date; it stays one prayer day.
    expect(getPrayerDateKey(new Date(2026, 9, 25, 1, 30))).toBe('2026-10-25');
    expect(getPrayerDateKey(new Date(2026, 9, 25, 2, 30))).toBe('2026-10-25');
    expect(getPrayerDateKey(new Date(2026, 9, 26, 0, 30))).toBe('2026-10-26');
  });

  it('serves a cached day back to itself', async () => {
    stubValidApi();
    const fetched = await fetchPrayerTimes();
    expect(loadCachedPrayerTimes(new Date())?.dateKey).toBe(fetched.dateKey);
  });

  it('drops the cache once the local day has turned, including over a DST switch', async () => {
    stubValidApi();
    // Cache the switch day itself, then ask on the following day.
    await fetchPrayerTimes(undefined, undefined, new Date(2026, 9, 25, 12, 0));

    expect(loadCachedPrayerTimes(new Date(2026, 9, 25, 23, 0))).not.toBeNull();
    expect(loadCachedPrayerTimes(new Date(2026, 9, 26, 0, 30))).toBeNull();
  });
});
