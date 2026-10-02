import surahsJson from '../../public/data/quran/surahs.json?raw';
import { OFFLINE_QURAN_SURAH_SET } from './quranService';
import type { Surah } from './quranService';

type HomeQuranProgress = {
  surahNumber: number;
  ayahNumber: number;
  englishName: string;
  numberOfAyahs: number;
  offline: boolean;
  hasProgress: boolean;
};

const surahs = JSON.parse(surahsJson) as Surah[];
const surahsByNumber = new Map(surahs.map((surah) => [surah.number, surah]));

function progressFor(surah: Surah, ayahNumber = 1, hasProgress = false): HomeQuranProgress {
  return {
    surahNumber: surah.number,
    ayahNumber: Math.min(ayahNumber, surah.numberOfAyahs),
    englishName: surah.englishName,
    numberOfAyahs: surah.numberOfAyahs,
    offline: OFFLINE_QURAN_SURAH_SET.has(surah.number),
    hasProgress,
  };
}

export function readHomeQuranProgress(): HomeQuranProgress {
  const emptyProgress = progressFor(surahs[0]);
  try {
    const raw = localStorage.getItem('nur_quran_last_read');
    if (!raw) return emptyProgress;
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return emptyProgress;
    const { surahNumber, ayahNumber } = parsed as Record<string, unknown>;
    if (
      typeof surahNumber !== 'number'
      || !Number.isInteger(surahNumber)
      || typeof ayahNumber !== 'number'
      || !Number.isSafeInteger(ayahNumber)
      || ayahNumber < 1
    ) return emptyProgress;
    const surah = surahsByNumber.get(surahNumber);
    return surah ? progressFor(surah, ayahNumber, true) : emptyProgress;
  } catch {
    return emptyProgress;
  }
}
