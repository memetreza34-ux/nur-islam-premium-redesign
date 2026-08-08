import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  bootstrapSharedPrayerTimes,
  fetchPrayerTimes,
  loadCachedPrayerTimes,
} from './prayerTimesService';
import { PRAYER_SCHEDULE, PRAYER_SCHEDULE_META } from './prayerSchedule';

// The API failure matrix the release gate asks for: a wrong prayer time is
// worse than a missing one, so every bad response must be rejected rather than
// partially trusted, and the app must still end up with a usable schedule.

const TIMINGS = {
  Fajr: '04:11', Sunrise: '05:47', Dhuhr: '13:02',
  Asr: '16:55', Maghrib: '20:12', Isha: '21:44',
};

function apiResponse(body: unknown, status = 200) {
  return { ok: status >= 200 && status < 300, status, json: async () => body } as unknown as Response;
}

function validPayload(timings: Record<string, string> = TIMINGS) {
  return {
    code: 200,
    data: { timings, meta: { method: { name: 'Diyanet' }, school: 'Standard', timezone: 'Europe/Berlin' } },
  };
}

function stubFetch(handler: () => Promise<Response>) {
  const mock = vi.fn(handler);
  vi.stubGlobal('fetch', mock);
  return mock;
}

describe('fetchPrayerTimes', () => {
  beforeEach(() => localStorage.clear());

  it('accepts a valid response and normalizes every prayer time', async () => {
    stubFetch(async () => apiResponse(validPayload()));

    const snapshot = await fetchPrayerTimes();

    expect(snapshot.source).toBe('live');
    expect(snapshot.schedule.map((prayer) => prayer.time)).toEqual([
      '04:11', '05:47', '13:02', '16:55', '20:12', '21:44',
    ]);
    expect(snapshot.meta.sourceLabel).toBe('Live via AlAdhan');
  });

  for (const status of [400, 404, 429, 500, 503]) {
    it(`rejects an HTTP ${status} response instead of inventing times`, async () => {
      stubFetch(async () => apiResponse({}, status));
      await expect(fetchPrayerTimes()).rejects.toThrow(String(status));
    });
  }

  it('rejects a 200 response whose body reports a non-200 code', async () => {
    stubFetch(async () => apiResponse({ code: 500, data: null }));
    await expect(fetchPrayerTimes()).rejects.toThrow();
  });

  it('rejects a response with an empty body', async () => {
    stubFetch(async () => apiResponse({}));
    await expect(fetchPrayerTimes()).rejects.toThrow();
  });

  it('rejects a response that is missing a prayer', async () => {
    const { Asr, ...withoutAsr } = TIMINGS;
    stubFetch(async () => apiResponse(validPayload(withoutAsr as Record<string, string>)));
    await expect(fetchPrayerTimes()).rejects.toThrow();
  });

  it('rejects an out-of-range time', async () => {
    stubFetch(async () => apiResponse(validPayload({ ...TIMINGS, Dhuhr: '25:00' })));
    await expect(fetchPrayerTimes()).rejects.toThrow();
  });

  it('rejects a garbage time value', async () => {
    stubFetch(async () => apiResponse(validPayload({ ...TIMINGS, Fajr: 'bald' })));
    await expect(fetchPrayerTimes()).rejects.toThrow();
  });

  it('propagates a network failure', async () => {
    stubFetch(async () => { throw new TypeError('Failed to fetch'); });
    await expect(fetchPrayerTimes()).rejects.toThrow();
  });

  it('does not cache anything when the request fails', async () => {
    stubFetch(async () => apiResponse({}, 500));
    await expect(fetchPrayerTimes()).rejects.toThrow();
    expect(loadCachedPrayerTimes()).toBeNull();
  });
});

describe('bootstrapSharedPrayerTimes', () => {
  beforeEach(() => localStorage.clear());

  it('publishes live times to the shared schedule', async () => {
    stubFetch(async () => apiResponse(validPayload()));

    await bootstrapSharedPrayerTimes();

    expect(PRAYER_SCHEDULE.find((prayer) => prayer.id === 'dhuhr')?.time).toBe('13:02');
    expect(PRAYER_SCHEDULE_META.sourceLabel).toBe('Live via AlAdhan');
  });

  it('serves the cached day when the network is unavailable', async () => {
    stubFetch(async () => apiResponse(validPayload()));
    await bootstrapSharedPrayerTimes();

    stubFetch(async () => { throw new TypeError('offline'); });
    const snapshot = await bootstrapSharedPrayerTimes();

    expect(snapshot.schedule.find((prayer) => prayer.id === 'dhuhr')?.time).toBe('13:02');
    expect(PRAYER_SCHEDULE.find((prayer) => prayer.id === 'dhuhr')?.time).toBe('13:02');
  });

  it('falls back to the offline schedule when there is no cache either', async () => {
    stubFetch(async () => { throw new TypeError('offline'); });

    const snapshot = await bootstrapSharedPrayerTimes();

    // Never empty: an offline user still needs times on screen, clearly labelled.
    expect(snapshot.schedule).toHaveLength(6);
    expect(snapshot.source).not.toBe('live');
    expect(PRAYER_SCHEDULE_META.sourceLabel).not.toBe('Live via AlAdhan');
  });

  it('falls back rather than surfacing a rejected bootstrap to the caller', async () => {
    stubFetch(async () => apiResponse({}, 429));
    await expect(bootstrapSharedPrayerTimes()).resolves.toBeTruthy();
  });
});
