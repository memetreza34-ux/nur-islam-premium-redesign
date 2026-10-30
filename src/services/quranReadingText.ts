import type { QuranAyah, SurahDetail } from './quranService';

// Exact provider prefixes; the second occurs in surahs 95 and 97.
const OPENING_PREFIXES = [
  'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ',
  'بِّسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ',
];

export function splitOpeningBasmalah(surah: SurahDetail): {
  openingBasmalah: string | null;
  ayahs: QuranAyah[];
} {
  const first = surah.ayahs[0];
  const prefix = surah.number !== 1 && surah.number !== 9 && first?.numberInSurah === 1
    ? OPENING_PREFIXES.find(value => first.text.startsWith(`${value} `) && first.text.length > value.length + 1)
    : undefined;
  if (!prefix) return { openingBasmalah: null, ayahs: surah.ayahs };
  return {
    openingBasmalah: prefix,
    ayahs: [{ ...first, text: first.text.slice(prefix.length + 1) }, ...surah.ayahs.slice(1)],
  };
}
