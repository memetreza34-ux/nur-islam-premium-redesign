import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  bootstrapSharedPrayerTimes,
  fetchPrayerTimes,
  fetchPrayerTimesMonth,
  getPrayerDateKey,
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

function validPayload(timings: Record<string, string> = TIMINGS, dateKey = getPrayerDateKey(new Date(), 'Europe/Berlin')) {
  return {
    code: 200,
    data: { timings, date: { gregorian: { date: dateKey.split('-').reverse().join('-') } }, meta: { latitude: 52.52, longitude: 13.41, method: { id: 13, name: 'Diyanet' }, school: 'STANDARD', timezone: 'Europe/Berlin' } },
  };
}

function stubFetch(handler: (input: RequestInfo | URL) => Promise<Response>) {
  const mock = vi.fn(handler);
  vi.stubGlobal('fetch', mock);
  return mock;
}

function validMonth(year: number, month: number, timings = TIMINGS) {
  return Array.from({ length: new Date(year, month, 0).getDate() }, (_, index) =>
    validPayload(timings, `${year}-${String(month).padStart(2, '0')}-${String(index + 1).padStart(2, '0')}`).data);
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

  it.each(['05:00123', '05:00garbage', '05:00:99', '05:00 (CEST) trailing'])('rejects a partially valid timing %s', async value => {
    stubFetch(async () => apiResponse(validPayload({ ...TIMINGS, Fajr: value })));
    await expect(fetchPrayerTimes()).rejects.toThrow('Ungültige Gebetszeit');
  });

  it('accepts the calendar API timezone suffix without treating it as an instant', async () => {
    stubFetch(async () => apiResponse(validPayload({ ...TIMINGS, Fajr: '05:00 (CEST)' })));
    expect((await fetchPrayerTimes()).schedule[0].time).toBe('05:00');
  });

  it.each([undefined, '', '2026-10-11', '31-02-2026'])('rejects an unverifiable API date %s', async value => {
    const payload = validPayload();
    Object.assign(payload.data.date.gregorian, { date: value });
    stubFetch(async () => apiResponse(payload));
    await expect(fetchPrayerTimes()).rejects.toThrow('Datum');
    expect(localStorage.getItem('nur_prayer_times_latest')).toBeNull();
  });

  it.each(['2026-02-31', '2026-13-01', '2026-1-1', 'invalid'])('rejects an invalid requested date %s before contacting the API', async dateKey => {
    const fetchMock = stubFetch(async () => apiResponse(validPayload()));
    await expect(fetchPrayerTimes(undefined, undefined, undefined, { dateKey })).rejects.toThrow('Datum');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('does not duplicate the provider’s experimental qualifier', async () => {
    const payload = validPayload();
    payload.data.meta.method.name = 'Diyanet İşleri Başkanlığı, Turkey (experimental)';
    stubFetch(async () => apiResponse(payload));
    const label = (await fetchPrayerTimes()).meta.methodLabel;
    expect(label.match(/experimentell/g)).toHaveLength(1);
    expect(label).not.toContain('experimental');
  });

  it.each(['latitude', 'longitude', 'method', 'school', 'missing-method'])('rejects inconsistent or missing response metadata: %s', async reason => {
    const payload = validPayload();
    if (reason === 'latitude') payload.data.meta.latitude = 51.52;
    if (reason === 'longitude') payload.data.meta.longitude = 12.41;
    if (reason === 'method') payload.data.meta.method.id = 3;
    if (reason === 'school') payload.data.meta.school = 'HANAFI';
    if (reason === 'missing-method') Object.assign(payload.data.meta.method, { id: undefined });
    stubFetch(async () => apiResponse(payload));
    await expect(fetchPrayerTimes()).rejects.toThrow('Abfrage');
    expect(localStorage.getItem('nur_prayer_times_latest')).toBeNull();
  });

  it('passes the selected MWL and Hanafi parameters and preserves returned provenance', async () => {
    const payload = validPayload();
    payload.data.meta.method = { id: 3, name: 'Muslim World League' };
    payload.data.meta.school = 'HANAFI';
    const fetchMock = stubFetch(async () => apiResponse(payload));
    const snapshot = await fetchPrayerTimes(undefined, { method: 3, school: 1 });
    const url = new URL(String(fetchMock.mock.calls[0][0]));
    expect(url.searchParams.get('method')).toBe('3');
    expect(url.searchParams.get('school')).toBe('1');
    expect(snapshot.meta.methodLabel).toBe('Muslim World League · HANAFI');
    expect(snapshot.meta.locationSource).toBe('default');
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

describe('fetchPrayerTimesMonth', () => {
  beforeEach(() => localStorage.clear());

  it('loads every day with one calendar request and normalizes the five prayer columns', async () => {
    const month = validMonth(2026, 9);
    const fetchMock = stubFetch(async () => apiResponse({ code: 200, data: month }));

    const plan = await fetchPrayerTimesMonth(undefined, undefined, new Date(2026, 8, 1, 12));

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(String(fetchMock.mock.calls[0][0])).toContain('/v1/calendar/2026/9');
    expect(plan.monthKey).toBe('2026-09');
    expect(plan.days).toHaveLength(30);
    expect(plan.days[0].dateKey).toBe('2026-09-01');
    expect(plan.days[29].dateKey).toBe('2026-09-30');
    expect(plan.days[0].schedule.find((prayer) => prayer.id === 'maghrib')?.time).toBe('20:12');
  });

  it('rejects an incomplete month instead of filling missing days with guessed times', async () => {
    const incomplete = validMonth(2026, 9).slice(0, 29);
    stubFetch(async () => apiResponse({ code: 200, data: incomplete }));

    await expect(fetchPrayerTimesMonth(undefined, undefined, new Date(2026, 8, 1, 12))).rejects.toThrow('vollständigen Monatsplan');
  });

  it('does not replace the cached current day when a future month is opened', async () => {
    stubFetch(async () => apiResponse(validPayload()));
    const today = await fetchPrayerTimes();
    const month = validMonth(2026, 10, { ...TIMINGS, Fajr: '06:33' });
    stubFetch(async () => apiResponse({ code: 200, data: month }));

    await fetchPrayerTimesMonth(undefined, undefined, new Date(2026, 9, 1, 12));

    expect(loadCachedPrayerTimes()?.dateKey).toBe(today.dateKey);
    expect(loadCachedPrayerTimes()?.schedule.find((prayer) => prayer.id === 'fajr')?.time).toBe('04:11');
  });

  it.each(['wrong-month', 'reordered', 'duplicate', 'missing-date', 'extra-day', 'timezone', 'method', 'school', 'location'])('rejects a month with %s instead of relabelling its times', async reason => {
    const month = validMonth(2026, 9);
    if (reason === 'wrong-month') month[12].date.gregorian.date = '13-10-2026';
    if (reason === 'reordered') [month[0], month[1]] = [month[1], month[0]];
    if (reason === 'duplicate') month[1] = structuredClone(month[0]);
    if (reason === 'missing-date') month[12].date.gregorian.date = '';
    if (reason === 'extra-day') month.push(month[29]);
    if (reason === 'timezone') month[12].meta.timezone = 'Asia/Tokyo';
    if (reason === 'method') month[12].meta.method.id = 3;
    if (reason === 'school') month[12].meta.school = 'HANAFI';
    if (reason === 'location') month[12].meta.latitude = 51.52;
    stubFetch(async () => apiResponse({ code: 200, data: month }));
    await expect(fetchPrayerTimesMonth(undefined, undefined, new Date(2026, 8, 1, 12))).rejects.toThrow();
  });

  it('accepts a complete leap February', async () => {
    stubFetch(async () => apiResponse({ code: 200, data: validMonth(2028, 2) }));
    const plan = await fetchPrayerTimesMonth(undefined, undefined, new Date(2028, 1, 1, 12));
    expect(plan.days).toHaveLength(29);
    expect(plan.days.at(-1)?.dateKey).toBe('2028-02-29');
  });

  it('rejects invalid monthly inputs before fetching', async () => {
    const fetchMock = stubFetch(async () => apiResponse({}));
    await expect(fetchPrayerTimesMonth(undefined, undefined, new Date('invalid'))).rejects.toThrow('Datum');
    await expect(fetchPrayerTimesMonth({ latitude: 91, longitude: 0, label: 'Invalid', source: 'device' })).rejects.toThrow('Standort');
    expect(fetchMock).not.toHaveBeenCalled();
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

    expect(snapshot.schedule).toHaveLength(6);
    expect(snapshot.schedule.every(prayer => prayer.time === '—:—')).toBe(true);
    expect(snapshot.source).not.toBe('live');
    expect(PRAYER_SCHEDULE_META.sourceLabel).not.toBe('Live via AlAdhan');
  });

  it('falls back rather than surfacing a rejected bootstrap to the caller', async () => {
    stubFetch(async () => apiResponse({}, 429));
    await expect(bootstrapSharedPrayerTimes()).resolves.toBeTruthy();
  });
});

describe('cached prayer times', () => {
  beforeEach(() => localStorage.clear());

  // The mosque cache already marks itself as cached. Prayer times returned the
  // stored snapshot untouched, so a reader could not tell a fresh request from
  // a stored one — the times are right either way, but the label claimed a
  // request that had not happened.
  it('marks a stored snapshot as cached rather than live', async () => {
    stubFetch(async () => apiResponse(validPayload()));
    const fresh = await fetchPrayerTimes();
    expect(fresh.source).toBe('live');
    expect(fresh.meta.sourceLabel).toBe('Live via AlAdhan');

    const restored = loadCachedPrayerTimes();

    expect(restored?.source).toBe('cache');
    expect(restored?.meta.sourceLabel).not.toBe('Live via AlAdhan');
    // The times themselves are unchanged; only the provenance differs.
    expect(restored?.schedule.map((prayer) => prayer.time))
      .toEqual(fresh.schedule.map((prayer) => prayer.time));
  });
});
