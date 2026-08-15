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

/** Where the German rendering came from, or why it is missing. */
export type TranslationSource = 'network' | 'cache' | 'unavailable';

export interface QuranSurahBundle {
  meta: Surah;
  arabic: SurahDetail;
  /** Null when the translation could not be fetched — offline, most likely. */
  german: SurahDetail | null;
  source: QuranBundleSource;
  sourceLabel: string;
  translationSource: TranslationSource;
  translationLabel: string;
}

const DATA_BASE = `${import.meta.env.BASE_URL}data/quran`;
const ONLINE_API_BASE = 'https://api.alquran.cloud/v1';
const ONLINE_ARABIC_EDITION = 'quran-uthmani';
// The German rendering is fetched, never shipped.
//
// Bubenheim & Elyas is a protected work. Bundling all 114 Surahs meant the app
// itself distributed it, which needs permission from the rights holder and
// would have to be answered before any app store submission. Requesting it per
// Surah moves that: Al Quran Cloud serves the text, the reader's own browser
// caches its copy, and this app ships none of it. The same shape the recitation
// recordings already use.
//
// The Arabic Uthmani text stays bundled. It is not a protected work, and it is
// what makes the reader usable with no connection at all.
const ONLINE_GERMAN_EDITION = 'de.bubenheim';
const ONLINE_CACHE_NAME = 'nur-quran-online-v1';
const ONLINE_TIMEOUT_MS = 12000;
const memoryCache = new Map<string, unknown>();

/**
 * Alle 114 Suren liegen im arabischen Uthmani-Text offline vor. Die deutsche
 * Wiedergabe wird beim Öffnen einer Sure geladen und im Browser des Nutzers
 * zwischengespeichert — sie ist nicht Teil der App.
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

async function fetchOfflineSurahDetail(number: number, language: 'ar' | 'de'): Promise<SurahDetail> {
  return loadJson<SurahDetail>(`${DATA_BASE}/${language}/${number}.json`);
}

function getOnlineRequestUrl(number: number) {
  // Only the translation. The Arabic side is on the device, so asking for both
  // would download the half we already have on every Surah.
  return `${ONLINE_API_BASE}/surah/${number}/${ONLINE_GERMAN_EDITION}`;
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

function parseOnlineBundle(payload: QuranApiResponse, meta: Surah): SurahDetail {
  if (payload.code !== 200 || !payload.data || Array.isArray(payload.data)) {
    throw new Error('Die Quran-Quelle lieferte keine gültige Antwort.');
  }

  const germanEdition = validateEdition(payload.data, meta, ONLINE_GERMAN_EDITION);

  return {
    ...meta,
    ayahs: germanEdition.ayahs.map((ayah) => ({ numberInSurah: ayah.numberInSurah, text: ayah.text.trim() })),
  };
}

async function readOnlineCache(url: string, meta: Surah) {
  if (!('caches' in window)) return null;
  try {
    const cache = await caches.open(ONLINE_CACHE_NAME);
    const response = await cache.match(url);
    if (!response) return null;
    const payload = await response.json() as QuranApiResponse;
    return parseOnlineBundle(payload, meta);
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

/**
 * The German rendering for one Surah, from the browser cache if it is already
 * there. Returns null instead of throwing: a missing translation must not take
 * the Arabic text down with it, which is the whole point of keeping the two
 * apart.
 */
async function fetchTranslation(meta: Surah): Promise<{ detail: SurahDetail; source: TranslationSource } | null> {
  const url = getOnlineRequestUrl(meta.number);
  const cached = await readOnlineCache(url, meta);
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
    const detail = parseOnlineBundle(payload, meta);
    await writeOnlineCache(url, cacheCopy);
    return { detail, source: 'network' };
  } catch {
    // Offline, blocked, timed out or malformed — all the same to the reader,
    // which shows the Arabic and says the meaning needs a connection once.
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

  // Arabic first and on its own. It is bundled, so it renders with no
  // connection; the translation is then asked for separately and is allowed to
  // fail without taking the Surah with it.
  const arabic = await fetchOfflineSurahDetail(number, 'ar');
  if (arabic.ayahs.length !== meta.numberOfAyahs) {
    throw new Error('Die lokale Quran-Datei dieser Sure ist unvollständig.');
  }

  const translation = await fetchTranslation(meta);

  return {
    meta,
    arabic,
    german: translation?.detail ?? null,
    source: 'offline',
    // Describes the Arabic, which is the part this app ships. The translation
    // reports itself separately through translationSource.
    sourceLabel: 'Arabisch auf dem Gerät',
    translationSource: translation?.source ?? 'unavailable',
    // Named, not described: an anonymous "Altbestand" hid whose translation the
    // app was showing.
    translationLabel: 'Bubenheim & Elyas',
  };
}

export function getGermanRevelationLabel(type: RevelationType) {
  return type === 'Meccan' ? 'Mekkanisch' : 'Medinensisch';
}
