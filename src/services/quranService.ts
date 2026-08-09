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

export interface QuranSurahBundle {
  meta: Surah;
  arabic: SurahDetail;
  german: SurahDetail;
  source: QuranBundleSource;
  sourceLabel: string;
  translationLabel: string;
}

const DATA_BASE = `${import.meta.env.BASE_URL}data/quran`;
const ONLINE_API_BASE = 'https://api.alquran.cloud/v1';
const ONLINE_ARABIC_EDITION = 'quran-uthmani';
const ONLINE_GERMAN_EDITION = 'de.bubenheim';
const ONLINE_CACHE_NAME = 'nur-quran-online-v1';
const ONLINE_TIMEOUT_MS = 12000;
const memoryCache = new Map<string, unknown>();

/**
 * Suren, deren arabischer Text und deutscher Altbestand im Premium-Repository
 * bereits vollständig offline vorhanden sind. Diese Dateien bleiben der
 * bevorzugte und netzunabhängige Bestand.
 */
export const OFFLINE_QURAN_SURAHS = [1, 112, 113, 114] as const;
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

async function fetchOfflineSurahDetail(number: number, language: 'ar' | 'de'): Promise<SurahDetail> {
  return loadJson<SurahDetail>(`${DATA_BASE}/${language}/${number}.json`);
}

function getOnlineRequestUrl(number: number) {
  return `${ONLINE_API_BASE}/surah/${number}/editions/${ONLINE_ARABIC_EDITION},${ONLINE_GERMAN_EDITION}`;
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

function parseOnlineBundle(payload: QuranApiResponse, meta: Surah, source: Exclude<QuranBundleSource, 'offline'>): QuranSurahBundle {
  if (payload.code !== 200 || !Array.isArray(payload.data)) {
    throw new Error('Die Quran-Quelle lieferte keine gültige Antwort.');
  }

  const arabicEdition = validateEdition(
    payload.data.find((edition) => edition.edition?.identifier === ONLINE_ARABIC_EDITION),
    meta,
    ONLINE_ARABIC_EDITION,
  );
  const germanEdition = validateEdition(
    payload.data.find((edition) => edition.edition?.identifier === ONLINE_GERMAN_EDITION),
    meta,
    ONLINE_GERMAN_EDITION,
  );

  const toDetail = (edition: QuranApiEdition): SurahDetail => ({
    ...meta,
    ayahs: edition.ayahs.map((ayah) => ({ numberInSurah: ayah.numberInSurah, text: ayah.text.trim() })),
  });

  return {
    meta,
    arabic: toDetail(arabicEdition),
    german: toDetail(germanEdition),
    source,
    sourceLabel: source === 'cache' ? 'Al Quran Cloud · Browser-Cache' : 'Al Quran Cloud · Online',
    translationLabel: 'Bubenheim & Elyas',
  };
}

async function readOnlineCache(url: string, meta: Surah) {
  if (!('caches' in window)) return null;
  try {
    const cache = await caches.open(ONLINE_CACHE_NAME);
    const response = await cache.match(url);
    if (!response) return null;
    const payload = await response.json() as QuranApiResponse;
    return parseOnlineBundle(payload, meta, 'cache');
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

async function fetchOnlineSurahBundle(meta: Surah): Promise<QuranSurahBundle> {
  const url = getOnlineRequestUrl(meta.number);
  const cached = await readOnlineCache(url, meta);
  if (cached) return cached;

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
    const bundle = parseOnlineBundle(payload, meta, 'network');
    await writeOnlineCache(url, cacheCopy);
    return bundle;
  } catch (reason) {
    if ((reason as DOMException)?.name === 'AbortError') {
      throw new Error('Die Quran-Quelle hat zu lange nicht geantwortet.');
    }
    throw reason;
  } finally {
    window.clearTimeout(timeout);
  }
}

export async function fetchSurahBundle(number: number): Promise<QuranSurahBundle> {
  assertSurahNumber(number);
  const surahs = await fetchSurahs();
  const meta = surahs.find((surah) => surah.number === number);
  if (!meta) throw new Error('Sure wurde in der lokalen Liste nicht gefunden.');

  if (!OFFLINE_QURAN_SURAH_SET.has(number)) {
    return fetchOnlineSurahBundle(meta);
  }

  const [arabic, german] = await Promise.all([
    fetchOfflineSurahDetail(number, 'ar'),
    fetchOfflineSurahDetail(number, 'de'),
  ]);
  if (arabic.ayahs.length !== meta.numberOfAyahs || german.ayahs.length !== meta.numberOfAyahs) {
    throw new Error('Die lokalen Quran-Dateien dieser Sure sind unvollständig.');
  }
  return {
    meta,
    arabic,
    german,
    source: 'offline',
    sourceLabel: 'Lokaler Offline-Bestand',
    translationLabel: 'übernommener deutscher Altbestand',
  };
}

export function getGermanRevelationLabel(type: RevelationType) {
  return type === 'Meccan' ? 'Mekkanisch' : 'Medinensisch';
}
