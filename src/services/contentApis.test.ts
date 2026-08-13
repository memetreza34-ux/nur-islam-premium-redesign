import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchNearbyMosques, readMosqueCache } from './mosqueService';
import { fetchSurahBundle } from './quranService';

// Continues the API failure matrix for the two remaining providers. The rule
// they share with prayer times: a failed request must never turn into
// plausible-looking content.

function jsonResponse(body: unknown, status = 200) {
  return { ok: status >= 200 && status < 300, status, json: async () => body } as unknown as Response;
}

function stubFetch(handler: (input: RequestInfo | URL) => Promise<Response>) {
  const mock = vi.fn(handler);
  vi.stubGlobal('fetch', mock);
  return mock;
}

const ORIGIN = { latitude: 52.52, longitude: 13.405, label: 'Berlin', source: 'device' } as const;

function overpassPayload(elements: unknown[]) {
  return { elements };
}

describe('mosque search', () => {
  beforeEach(() => localStorage.clear());

  it('returns the mosques an Overpass instance reports', async () => {
    stubFetch(async () => jsonResponse(overpassPayload([
      { type: 'node', id: 1, lat: 52.521, lon: 13.406, tags: { name: 'Test-Moschee' } },
    ])));

    const snapshot = await fetchNearbyMosques(ORIGIN);

    expect(snapshot.results).toHaveLength(1);
    expect(snapshot.results[0].name).toBe('Test-Moschee');
  });

  it('reports an empty area as empty instead of inventing entries', async () => {
    stubFetch(async () => jsonResponse(overpassPayload([])));

    const snapshot = await fetchNearbyMosques(ORIGIN);

    // An area with no mapped mosque is a real answer. Filling it with
    // placeholder mosques would send someone to a building that is not there.
    expect(snapshot.results).toEqual([]);
  });

  it('gives up rather than inventing mosques when every endpoint fails', async () => {
    stubFetch(async () => { throw new TypeError('offline'); });

    await expect(fetchNearbyMosques(ORIGIN)).rejects.toThrow();
    expect(readMosqueCache(ORIGIN)).toBeNull();
  });

  it('tries the next Overpass instance when the first one is rate limited', async () => {
    let calls = 0;
    const mock = stubFetch(async () => {
      calls += 1;
      if (calls === 1) return jsonResponse({}, 429);
      return jsonResponse(overpassPayload([
        { type: 'node', id: 2, lat: 52.522, lon: 13.407, tags: { name: 'Zweite Moschee' } },
      ]));
    });

    const snapshot = await fetchNearbyMosques(ORIGIN);

    expect(mock.mock.calls.length).toBeGreaterThan(1);
    expect(snapshot.results[0].name).toBe('Zweite Moschee');
  });
});

describe('Quran reader', () => {
  beforeEach(() => localStorage.clear());

  it('refuses a surah whose ayah count does not match the catalog', async () => {
    // Al-Ikhlas has four ayat. Three would silently drop a verse.
    stubFetch(async () => jsonResponse({
      code: 200,
      data: { ayahs: [{ numberInSurah: 1, text: 'a' }, { numberInSurah: 2, text: 'b' }, { numberInSurah: 3, text: 'c' }] },
    }));

    await expect(fetchSurahBundle(112)).rejects.toThrow();
  });

  it('rejects an out-of-range surah number', async () => {
    stubFetch(async () => jsonResponse({ code: 200, data: { ayahs: [] } }));
    await expect(fetchSurahBundle(115)).rejects.toThrow();
    await expect(fetchSurahBundle(0)).rejects.toThrow();
  });

  it('propagates a failing online surah instead of returning a partial one', async () => {
    // Surah 2 is not bundled offline, so this must go to the network.
    stubFetch(async () => jsonResponse({}, 500));
    await expect(fetchSurahBundle(2)).rejects.toThrow();
  });
});
