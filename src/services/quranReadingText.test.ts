import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import type { SurahDetail } from './quranService';
import { splitOpeningBasmalah } from './quranReadingText';

const surahs: SurahDetail[] = Array.from({ length: 114 }, (_, index) =>
  JSON.parse(readFileSync(`public/data/quran/ar/${index + 1}.json`, 'utf8')));

describe('Quran verse presentation', () => {
  it.each(surahs)('preserves every original character and verse number in surah $number', surah => {
    const before = JSON.stringify(surah);
    const result = splitOpeningBasmalah(surah);
    expect(result.ayahs).toHaveLength(surah.numberOfAyahs);
    expect(result.ayahs.map(ayah => ayah.numberInSurah)).toEqual(surah.ayahs.map(ayah => ayah.numberInSurah));
    expect(result.ayahs.slice(1)).toEqual(surah.ayahs.slice(1));
    expect(result.openingBasmalah ? `${result.openingBasmalah} ${result.ayahs[0].text}` : result.ayahs[0].text).toBe(surah.ayahs[0].text);
    expect(result.openingBasmalah !== null).toBe(surah.number !== 1 && surah.number !== 9);
    expect(JSON.stringify(surah)).toBe(before);
  });

  it('does not label the opening as part of Al-Baqarah 2:1 or Al-Ikhlas 112:1', () => {
    expect(splitOpeningBasmalah(surahs[1]).ayahs[0].text).toBe('الٓمٓ');
    expect(splitOpeningBasmalah(surahs[111]).ayahs[0].text).toBe('قُلْ هُوَ ٱللَّهُ أَحَدٌ');
  });

  it('keeps the Basmalah of Al-Fatihah 1:1 and An-Naml 27:30 inside their verses', () => {
    expect(splitOpeningBasmalah(surahs[0]).ayahs).toBe(surahs[0].ayahs);
    expect(splitOpeningBasmalah(surahs[26]).ayahs[29]).toBe(surahs[26].ayahs[29]);
  });

  it('does not invent an opening for At-Tawbah', () => {
    expect(splitOpeningBasmalah(surahs[8])).toEqual({ openingBasmalah: null, ayahs: surahs[8].ayahs });
  });

  it.each(['Unknown text', 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ', 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ '])('does not silently change unrecognized or empty prefixes: %s', text => {
    const modified = { ...surahs[111], ayahs: [{ numberInSurah: 1, text }] };
    expect(splitOpeningBasmalah(modified)).toEqual({ openingBasmalah: null, ayahs: modified.ayahs });
  });
});
