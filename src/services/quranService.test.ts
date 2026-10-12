import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import surahs from '../data/quranSurahs.json';

const arabic = JSON.parse(readFileSync('public/data/quran/ar/1.json', 'utf8'));
const meta = surahs[0];
const jsonResponse = (data: unknown) => new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } });
const onlineEdition = (identifier: string) => ({
  code: 200,
  data: {
    ...meta,
    edition: { identifier },
    ayahs: Array.from({ length: 7 }, (_, index) => ({ numberInSurah: index + 1, text: `Test-Lesetext ${index + 1}` })),
  },
});

describe('Quran source and availability integrity', () => {
  beforeEach(() => { vi.resetModules(); });
  afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); });

  function mockFetch(options: {
    index?: unknown;
    local?: unknown;
    online?: (identifier: string) => unknown;
    failOnline?: boolean;
  } = {}) {
    const fetchMock = vi.fn(async (input: RequestInfo | URL, _options?: RequestInit) => {
      const url = String(input);
      if (url.endsWith('/surahs.json')) return jsonResponse(options.index === undefined ? surahs : options.index);
      if (url.endsWith('/ar/1.json')) return jsonResponse(options.local === undefined ? arabic : options.local);
      if (url.startsWith('https://api.alquran.cloud/')) {
        if (options.failOnline) throw new Error('offline');
        return jsonResponse(options.online?.(url.split('/').at(-1)!) ?? onlineEdition(url.split('/').at(-1)!));
      }
      throw new Error(`Unexpected test request: ${url}`);
    });
    vi.stubGlobal('fetch', fetchMock);
    const cache = {
      match: vi.fn<(url: string) => Promise<Response | undefined>>(async () => undefined),
      put: vi.fn(async (_url: string, _response: Response) => undefined),
    };
    vi.stubGlobal('caches', { open: vi.fn(async () => cache) });
    return { fetchMock, cache };
  }

  it('keeps the exact bundled Arabic separate from independently identified reading layers', async () => {
    const { fetchMock, cache } = mockFetch();
    const { fetchSurahBundle } = await import('./quranService');
    const result = await fetchSurahBundle(1);
    expect(result.arabic).toEqual(arabic);
    expect(result).toMatchObject({ source: 'offline', translationSource: 'network', transliterationSource: 'network', translationLabel: 'Bubenheim & Elyas' });
    expect(fetchMock.mock.calls.map(([url]) => String(url)).filter(url => url.startsWith('https://'))).toEqual([
      'https://api.alquran.cloud/v1/surah/1/en.transliteration',
      'https://api.alquran.cloud/v1/surah/1/de.bubenheim',
    ]);
    expect(cache.put).toHaveBeenCalledTimes(2);
  });

  it('keeps Arabic when both online layers fail', async () => {
    mockFetch({ failOnline: true });
    const { fetchSurahBundle } = await import('./quranService');
    const result = await fetchSurahBundle(1);
    expect(result.arabic).toEqual(arabic);
    expect(result).toMatchObject({ german: null, transliteration: null, translationSource: 'unavailable', transliterationSource: 'unavailable' });
  });

  it('does not hide a valid layer when the other edition is wrong', async () => {
    mockFetch({ online: identifier => onlineEdition(identifier === 'de.bubenheim' ? 'de.other' : identifier) });
    const { fetchSurahBundle } = await import('./quranService');
    const result = await fetchSurahBundle(1);
    expect(result.german).toBeNull();
    expect(result.transliteration).not.toBeNull();
    expect(result.translationSource).toBe('unavailable');
  });

  it.each(['count', 'order', 'empty', 'null', 'surah', 'status'])('rejects malformed online %s without losing Arabic', async (kind) => {
    mockFetch({ online: identifier => {
      const payload = onlineEdition(identifier);
      if (kind === 'count') payload.data.numberOfAyahs = 8;
      if (kind === 'order') payload.data.ayahs[0].numberInSurah = 2;
      if (kind === 'empty') payload.data.ayahs[0].text = ' ';
      if (kind === 'null') (payload.data.ayahs as unknown[])[0] = null;
      if (kind === 'surah') payload.data.number = 2;
      if (kind === 'status') payload.code = 500;
      return payload;
    } });
    const { fetchSurahBundle } = await import('./quranService');
    const result = await fetchSurahBundle(1);
    expect(result.arabic).toEqual(arabic);
    expect(result.german).toBeNull();
    expect(result.transliteration).toBeNull();
  });

  it.each(['wrong-surah', 'count', 'order', 'empty', 'missing'])('rejects a malformed local %s before any supporting request', async (kind) => {
    const local = structuredClone(arabic);
    if (kind === 'wrong-surah') local.number = 2;
    if (kind === 'count') local.numberOfAyahs = 8;
    if (kind === 'order') local.ayahs[0].numberInSurah = 2;
    if (kind === 'empty') local.ayahs[0].text = ' ';
    if (kind === 'missing') local.ayahs.pop();
    const { fetchMock } = mockFetch({ local });
    const { fetchSurahBundle } = await import('./quranService');
    await expect(fetchSurahBundle(1)).rejects.toThrow(/Quran/);
    expect(fetchMock.mock.calls.some(([url]) => String(url).startsWith('https://'))).toBe(false);
  });

  it.each([null, [], [...surahs.slice(0, 113), surahs[0]]])('rejects an incomplete or misnumbered local index', async (index) => {
    mockFetch({ index });
    const { fetchSurahs } = await import('./quranService');
    await expect(fetchSurahs()).rejects.toThrow(/Surenliste/);
  });

  it('does not retain rejected local data in memory when the reader retries', async () => {
    const { fetchMock } = mockFetch({ local: { ...arabic, number: 2 } });
    const { fetchSurahBundle } = await import('./quranService');
    await expect(fetchSurahBundle(1)).rejects.toThrow(/Surenverzeichnis/);
    fetchMock.mockImplementation(async input => {
      const url = String(input);
      if (url.endsWith('/ar/1.json')) return jsonResponse(arabic);
      return jsonResponse(onlineEdition(url.split('/').at(-1)!));
    });
    expect((await fetchSurahBundle(1)).arabic).toEqual(arabic);
  });

  it('uses validated cached layers without a supporting network request', async () => {
    const { fetchMock, cache } = mockFetch({ failOnline: true });
    cache.match.mockImplementation(async url => jsonResponse(onlineEdition(url.split('/').at(-1)!)));
    const { fetchSurahBundle } = await import('./quranService');
    const result = await fetchSurahBundle(1);
    expect(result).toMatchObject({ translationSource: 'cache', transliterationSource: 'cache' });
    expect(fetchMock.mock.calls.some(([url]) => String(url).startsWith('https://'))).toBe(false);
  });

  it('ignores a cached wrong edition and fetches the requested one', async () => {
    const { cache } = mockFetch();
    cache.match.mockImplementation(async () => jsonResponse(onlineEdition('wrong')));
    const { fetchSurahBundle } = await import('./quranService');
    expect(await fetchSurahBundle(1)).toMatchObject({ translationSource: 'network', transliterationSource: 'network' });
  });

  it('does not turn a cache-write failure into saved status or lost network text', async () => {
    const { cache } = mockFetch();
    cache.put.mockRejectedValue(new Error('quota'));
    const { fetchSurahBundle } = await import('./quranService');
    expect(await fetchSurahBundle(1)).toMatchObject({ translationSource: 'network', transliterationSource: 'network' });
  });

  it.each(['name', 'revelationType'])('rejects malformed catalog %s metadata', async key => {
    const index = structuredClone(surahs);
    Object.assign(index[0], { [key]: null });
    mockFetch({ index });
    const { fetchSurahs } = await import('./quranService');
    await expect(fetchSurahs()).rejects.toThrow(/Surenliste/);
  });

  it('does not treat a failed HTTP cache response as a saved reading layer', async () => {
    const { cache } = mockFetch({ failOnline: true });
    cache.match.mockImplementation(async url => new Response(JSON.stringify(onlineEdition(url.split('/').at(-1)!)), { status: 500 }));
    const { fetchSurahBundle } = await import('./quranService');
    expect(await fetchSurahBundle(1)).toMatchObject({ translationSource: 'unavailable', transliterationSource: 'unavailable' });
  });

  it('does not require accessible cache storage to show valid network text', async () => {
    mockFetch();
    vi.stubGlobal('caches', { open: vi.fn(async () => { throw new Error('blocked'); }) });
    const { fetchSurahBundle } = await import('./quranService');
    expect(await fetchSurahBundle(1)).toMatchObject({ translationSource: 'network', transliterationSource: 'network' });
  });

  it('ends a stalled supporting fetch after its timeout while keeping local Arabic', async () => {
    vi.useFakeTimers();
    const { fetchMock } = mockFetch();
    const original = fetchMock.getMockImplementation()!;
    fetchMock.mockImplementation((input, options) => {
      if (!String(input).startsWith('https://')) return original(input);
      return new Promise<Response>((_resolve, reject) => {
        options?.signal?.addEventListener('abort', () => reject(new Error('timeout')), { once: true });
      });
    });
    const { fetchSurahBundle } = await import('./quranService');
    const pending = fetchSurahBundle(1);
    await vi.advanceTimersByTimeAsync(12001);
    const result = await pending;
    expect(result.arabic).toEqual(arabic);
    expect(result).toMatchObject({ translationSource: 'unavailable', transliterationSource: 'unavailable' });
  });
});
