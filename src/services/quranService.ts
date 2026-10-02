export type RevelationType = 'Meccan' | 'Medinan';
export type QuranBundleSource = 'offline' | 'network' | 'cache';

export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: RevelationType;
}

export interface QuranAyah {
  numberInSurah: number;
  text: string;
}

export interface SurahDetail extends Surah {
  ayahs: QuranAyah[];
}

/** Where an optional online Quran reading layer came from, or why it is missing. */
export type QuranReadingLayerSource = 'network' | 'cache' | 'unavailable';

export interface QuranSurahBundle {
  meta: Surah;
  arabic: SurahDetail;
  /** Both reading layers are optional so the bundled Arabic stays usable offline. */
  transliteration: SurahDetail | null;
  german: SurahDetail | null;
  source: QuranBundleSource;
  sourceLabel: string;
  transliterationSource: QuranReadingLayerSource;
  translationSource: QuranReadingLayerSource;
  transliterationLabel: string;
  translationLabel: string;
}

const DATA_BASE = `${import.meta.env.BASE_URL}data/quran`;
const ONLINE_API_BASE = 'https://api.alquran.cloud/v1';
const ONLINE_ARABIC_EDITION = 'quran-uthmani';
const ONLINE_TRANSLITERATION_EDITION = 'en.transliteration';
const ONLINE_GERMAN_EDITION = 'de.bubenheim';
const ONLINE_CACHE_NAME = 'nur-quran-online-v3';
const ONLINE_TIMEOUT_MS = 12000;
const memoryCache = new Map<string, unknown>();

/**
 * Alle 114 Suren liegen im arabischen Uthmani-Text offline vor. Aussprachehilfe
 * und deutsche Übersetzung werden pro Sure geladen und im Browser gespeichert.
 */
export const OFFLINE_QURAN_SURAHS = Array.from({ length: 114 }, (_, index) => index + 1);
export const OFFLINE_QURAN_SURAH_SET = new Set<number>(OFFLINE_QURAN_SURAHS);

interface QuranApiEdition {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: RevelationType;
  edition?: {
    identifier?: string;
    language?: string;
    name?: string;
    englishName?: string;
    type?: string;
  };
  ayahs: Array<{
    numberInSurah: number;
    text: string;
  }>;
}

interface QuranApiResponse {
  code?: number;
  status?: string;
  data?: QuranApiEdition[] | QuranApiEdition;
}

function assertSurahNumber(number: number) {
  if (!Number.isInteger(number) || number < 1 || number > 114) {
    throw new Error('Ungültige Surennummer.');
  }
}

async function loadJson<T>(url: string): Promise<T> {
  if (memoryCache.has(url)) return memoryCache.get(url) as T;

  const response = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!response.ok) throw new Error(`Quran-Daten konnten nicht geladen werden (${response.status}).`);

  const data = await response.json() as T;
  memoryCache.set(url, data);
  return data;
}

export async function fetchSurahs(): Promise<Surah[]> {
  const surahs = await loadJson<Surah[]>(`${DATA_BASE}/surahs.json`);
  if (surahs.length !== 114) throw new Error('Die lokale Surenliste ist unvollständig.');
  return surahs;
}

async function fetchOfflineSurahDetail(number: number, language: 'ar'): Promise<SurahDetail> {
  return loadJson<SurahDetail>(`${DATA_BASE}/${language}/${number}.json`);
}

function getOnlineRequestUrl(number: number, edition: string) {
  return `${ONLINE_API_BASE}/surah/${number}/${edition}`;
}

function validateEdition(edition: QuranApiEdition | undefined, meta: Surah, identifier: string) {
  if (!edition || edition.edition?.identifier !== identifier || !Array.isArray(edition.ayahs)) {
    throw new Error(`Die Quran-Quelle lieferte die Edition ${identifier} nicht vollständig.`);
  }
  if (edition.number !== meta.number || edition.ayahs.length !== meta.numberOfAyahs) {
    throw new Error('Die online geladenen Quran-Daten stimmen nicht mit dem Surenverzeichnis überein.');
  }
  edition.ayahs.forEach((ayah, index) => {
    if (ayah.numberInSurah !== index + 1 || typeof ayah.text !== 'string' || !ayah.text.trim()) {
      throw new Error(`Ayah ${index + 1} ist in der Quran-Quelle unvollständig.`);
    }
  });
  return edition;
}

function parseOnlineEdition(payload: QuranApiResponse, meta: Surah, identifier: string): SurahDetail {
  if (payload.code !== 200 || !payload.data || Array.isArray(payload.data)) {
    throw new Error('Die Quran-Quelle lieferte keine gültige Antwort.');
  }

  const edition = validateEdition(payload.data, meta, identifier);

  return {
    ...meta,
    ayahs: edition.ayahs.map((ayah) => ({ numberInSurah: ayah.numberInSurah, text: ayah.text.trim() })),
  };
}

async function readOnlineCache(url: string, meta: Surah, edition: string) {
  if (!('caches' in window)) return null;
  try {
    const cache = await caches.open(ONLINE_CACHE_NAME);
    const response = await cache.match(url);
    if (!response) return null;
    const payload = await response.json() as QuranApiResponse;
    return parseOnlineEdition(payload, meta, edition);
  } catch {
    return null;
  }
}

async function writeOnlineCache(url: string, response: Response) {
  if (!('caches' in window)) return;
  try {
    const cache = await caches.open(ONLINE_CACHE_NAME);
    await cache.put(url, response.clone());
  } catch {
    // Browser cache is an optional enhancement.
  }
}

async function fetchReadingLayer(meta: Surah, edition: string): Promise<{ detail: SurahDetail; source: QuranReadingLayerSource } | null> {
  const url = getOnlineRequestUrl(meta.number, edition);
  const cached = await readOnlineCache(url, meta, edition);
  if (cached) return { detail: cached, source: 'cache' };

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), ONLINE_TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    if (!response.ok) throw new Error(`Quran-Quelle antwortet mit ${response.status}.`);
    const cacheCopy = response.clone();
    const payload = await response.json() as QuranApiResponse;
    const detail = parseOnlineEdition(payload, meta, edition);
    await writeOnlineCache(url, cacheCopy);
    return { detail, source: 'network' };
  } catch {
    // An unavailable supporting layer must never take the offline Arabic down.
    return null;
  } finally {
    window.clearTimeout(timeout);
  }
}

export async function fetchSurahBundle(number: number): Promise<QuranSurahBundle> {
  assertSurahNumber(number);
  const surahs = await fetchSurahs();
  const meta = surahs.find((surah) => surah.number === number);
  if (!meta) throw new Error('Sure wurde in der lokalen Liste nicht gefunden.');

  // Arabic renders first from the bundle. The two supporting reading layers are
  // independent so one failed endpoint does not hide the other.
  const arabic = await fetchOfflineSurahDetail(number, 'ar');
  if (arabic.ayahs.length !== meta.numberOfAyahs) {
    throw new Error('Die lokale Quran-Datei dieser Sure ist unvollständig.');
  }

  const [transliteration, translation] = await Promise.all([
    fetchReadingLayer(meta, ONLINE_TRANSLITERATION_EDITION),
    fetchReadingLayer(meta, ONLINE_GERMAN_EDITION),
  ]);

  return {
    meta,
    arabic,
    transliteration: transliteration?.detail ?? null,
    german: translation?.detail ?? null,
    source: 'offline',
    sourceLabel: 'Arabisch auf dem Gerät',
    transliterationSource: transliteration?.source ?? 'unavailable',
    translationSource: translation?.source ?? 'unavailable',
    transliterationLabel: 'Lateinschrift',
    translationLabel: 'Bubenheim & Elyas',
  };
}
