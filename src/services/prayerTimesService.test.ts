import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  bootstrapSharedPrayerTimes,
  fetchPrayerTimes,
  loadCachedPrayerTimes,
  savePrayerLocation,
} from './prayerTimesService';
import type { PrayerLocation } from './prayerTimesService';
import { PRAYER_SCHEDULE, PRAYER_SCHEDULE_META } from './prayerSchedule';

// The API failure matrix the release gate asks for: a wrong prayer time is
// worse than a missing one, so every bad response must be rejected rather than
// partially trusted, and the app must still end up with a safe schedule.

const TIMINGS = {
  Fajr: '04:11', Sunrise: '05:47', Dhuhr: '13:02',
  Asr: '16:55', Maghrib: '20:12', Isha: '21:44',
};

const DEVICE_LOCATION: PrayerLocation = {
  latitude: 52.52,
  longitude: 13.405,
  label: 'Test-Gerätestandort',
  source: 'device',
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

  it('refuses to calculate personal live times from the generic default location', async () => {
    const mock = stubFetch(async () => apiResponse(validPayload()));

    await expect(fetchPrayerTimes()).rejects.toThrow('Gerätestandort');
    expect(mock).not.toHaveBeenCalled();
  });

  it('accepts a valid response for a device-backed location and normalizes every prayer time', async () => {
    stubFetch(async () => apiResponse(validPayload()));

    const snapshot = await fetchPrayerTimes(DEVICE_LOCATION);

    expect(snapshot.source).toBe('live');
    expect(snapshot.location.source).toBe('device');
    expect(snapshot.schedule.map((prayer) => prayer.time)).toEqual([
      '04:11', '05:47', '13:02', '16:55', '20:12', '21:44',
    ]);
    expect(snapshot.meta.sourceLabel).toBe('Live via AlAdhan');
  });

  for (const status of [400, 404, 429, 500, 503]) {
    it(`rejects an HTTP ${status} response instead of inventing times`, async () => {
      stubFetch(async () => apiResponse({}, status));
      await expect(fetchPrayerTimes(DEVICE_LOCATION)).rejects.toThrow(String(status));
    });
  }

  it('rejects a 200 response whose body reports a non-200 code', async () => {
    stubFetch(async () => apiResponse({ code: 500, data: null }));
    await expect(fetchPrayerTimes(DEVICE_LOCATION)).rejects.toThrow();
  });

  it('rejects a response with an empty body', async () => {
    stubFetch(async () => apiResponse({}));
    await expect(fetchPrayerTimes(DEVICE_LOCATION)).rejects.toThrow();
  });

  it('rejects a response that is missing a prayer', async () => {
    const { Asr, ...withoutAsr } = TIMINGS;
    stubFetch(async () => apiResponse(validPayload(withoutAsr as Record<string, string>)));
    await expect(fetchPrayerTimes(DEVICE_LOCATION)).rejects.toThrow();
  });

  it('rejects an out-of-range time', async () => {
    stubFetch(async () => apiResponse(validPayload({ ...TIMINGS, Dhuhr: '25:00' })));
    await expect(fetchPrayerTimes(DEVICE_LOCATION)).rejects.toThrow();
  });

  it('rejects a garbage time value', async () => {
    stubFetch(async () => apiResponse(validPayload({ ...TIMINGS, Fajr: 'bald' })));
    await expect(fetchPrayerTimes(DEVICE_LOCATION)).rejects.toThrow();
  });

  it('propagates a network failure', async () => {
    stubFetch(async () => { throw new TypeError('Failed to fetch'); });
    await expect(fetchPrayerTimes(DEVICE_LOCATION)).rejects.toThrow();
  });

  it('does not cache anything when the request fails', async () => {
    stubFetch(async () => apiResponse({}, 500));
    await expect(fetchPrayerTimes(DEVICE_LOCATION)).rejects.toThrow();
    expect(loadCachedPrayerTimes()).toBeNull();
  });
});

describe('bootstrapSharedPrayerTimes', () => {
  beforeEach(() => localStorage.clear());

  it('does not call AlAdhan or publish Berlin live times before a device location exists', async () => {
    const mock = stubFetch(async () => apiResponse(validPayload()));

    const snapshot = await bootstrapSharedPrayerTimes();

    expect(mock).not.toHaveBeenCalled();
    expect(snapshot.source).toBe('fallback');
    expect(snapshot.schedule.every((prayer) => prayer.time === '—:—')).toBe(true);
    expect(PRAYER_SCHEDULE_META.sourceLabel).toBe('Offline-Ersatzzeitplan');
    expect(PRAYER_SCHEDULE_META.locationLabel).toBe('Standort nicht festgelegt');
  });

  it('publishes live times to the shared schedule after a device location is saved', async () => {
    savePrayerLocation(DEVICE_LOCATION);
    stubFetch(async () => apiResponse(validPayload()));

    await bootstrapSharedPrayerTimes();

    expect(PRAYER_SCHEDULE.find((prayer) => prayer.id === 'dhuhr')?.time).toBe('13:02');
    expect(PRAYER_SCHEDULE_META.sourceLabel).toBe('Live via AlAdhan');
  });

  it('serves the cached day when the network is unavailable', async () => {
    savePrayerLocation(DEVICE_LOCATION);
    stubFetch(async () => apiResponse(validPayload()));
    await bootstrapSharedPrayerTimes();

    stubFetch(async () => { throw new TypeError('offline'); });
    const snapshot = await bootstrapSharedPrayerTimes();

    expect(snapshot.schedule.find((prayer) => prayer.id === 'dhuhr')?.time).toBe('13:02');
    expect(PRAYER_SCHEDULE.find((prayer) => prayer.id === 'dhuhr')?.time).toBe('13:02');
  });

  it('falls back to the clock-free offline schedule when a device-backed live request fails and there is no cache', async () => {
    savePrayerLocation(DEVICE_LOCATION);
    stubFetch(async () => { throw new TypeError('offline'); });

    const snapshot = await bootstrapSharedPrayerTimes();

    expect(snapshot.schedule).toHaveLength(6);
    expect(snapshot.schedule.every((prayer) => prayer.time === '—:—')).toBe(true);
    expect(snapshot.source).not.toBe('live');
    expect(PRAYER_SCHEDULE_META.sourceLabel).not.toBe('Live via AlAdhan');
  });

  it('falls back rather than surfacing a rejected device-backed bootstrap to the caller', async () => {
    savePrayerLocation(DEVICE_LOCATION);
    stubFetch(async () => apiResponse({}, 429));
    await expect(bootstrapSharedPrayerTimes()).resolves.toBeTruthy();
  });
});

describe('cached prayer times', () => {
  beforeEach(() => localStorage.clear());

  it('marks a stored device-backed snapshot as cached rather than live', async () => {
    stubFetch(async () => apiResponse(validPayload()));
    const fresh = await fetchPrayerTimes(DEVICE_LOCATION);
    expect(fresh.source).toBe('live');
    expect(fresh.meta.sourceLabel).toBe('Live via AlAdhan');

    const restored = loadCachedPrayerTimes();

    expect(restored?.source).toBe('cache');
    expect(restored?.meta.sourceLabel).not.toBe('Live via AlAdhan');
    expect(restored?.schedule.map((prayer) => prayer.time))
      .toEqual(fresh.schedule.map((prayer) => prayer.time));
  });

  it('rejects an old current-day cache that was calculated from a generic default location', () => {
    localStorage.setItem('nur_prayer_times_latest', JSON.stringify({
      schedule: PRAYER_SCHEDULE.map((prayer) => ({ ...prayer, time: '12:00' })),
      meta: { ...PRAYER_SCHEDULE_META, sourceLabel: 'Live via AlAdhan' },
      location: { latitude: 52.52, longitude: 13.405, label: 'Berlin, Deutschland', source: 'default' },
      preferences: { method: 13, school: 0 },
      dateKey: `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`,
      fetchedAt: new Date().toISOString(),
      source: 'live',
    }));

    expect(loadCachedPrayerTimes()).toBeNull();
  });
});
