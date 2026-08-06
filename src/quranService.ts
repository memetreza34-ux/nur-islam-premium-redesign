export type RevelationType = 'Meccan' | 'Medinan';

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
}

const DATA_BASE = `${import.meta.env.BASE_URL}data/quran`;
const memoryCache = new Map<string, unknown>();

/**
 * Suren, deren arabischer Text und deutscher Altbestand im Premium-Repository
 * bereits vollständig offline vorhanden sind. Die Liste wird bewusst manuell
 * gepflegt, damit die Oberfläche nie nicht vorhandene Inhalte als verfügbar
 * ausgibt.
 */
export const OFFLINE_QURAN_SURAHS = [1, 112, 113, 114] as const;
export const OFFLINE_QURAN_SURAH_SET = new Set<number>(OFFLINE_QURAN_SURAHS);

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

export async function fetchSurahDetail(number: number, language: 'ar' | 'de'): Promise<SurahDetail> {
  if (!OFFLINE_QURAN_SURAH_SET.has(number)) {
    throw new Error('Diese Sure wird noch in den vollständigen Offline-Bestand migriert.');
  }
  return loadJson<SurahDetail>(`${DATA_BASE}/${language}/${number}.json`);
}

export async function fetchSurahBundle(number: number): Promise<QuranSurahBundle> {
  const [surahs, arabic, german] = await Promise.all([
    fetchSurahs(),
    fetchSurahDetail(number, 'ar'),
    fetchSurahDetail(number, 'de'),
  ]);
  const meta = surahs.find((surah) => surah.number === number);
  if (!meta) throw new Error('Sure wurde in der lokalen Liste nicht gefunden.');
  if (arabic.ayahs.length !== meta.numberOfAyahs || german.ayahs.length !== meta.numberOfAyahs) {
    throw new Error('Die lokalen Quran-Dateien dieser Sure sind unvollständig.');
  }
  return { meta, arabic, german };
}

export function getGermanRevelationLabel(type: RevelationType) {
  return type === 'Meccan' ? 'Mekkanisch' : 'Medinensisch';
}
