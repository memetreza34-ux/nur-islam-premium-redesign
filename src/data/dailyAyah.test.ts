import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { DAILY_AYAHS, getDailyAyah } from './dailyAyah';

describe('daily Ayah', () => {
  it('matches the bundled Arabic verses and citations', () => {
    for (const ayah of DAILY_AYAHS) {
      const surah = JSON.parse(readFileSync(`public/data/quran/ar/${ayah.surahNumber}.json`, 'utf8'));
      const text = surah.ayahs.find((item: { numberInSurah: number }) => item.numberInSurah === ayah.ayahNumber).text;
      const verse = ayah.surahNumber === 112 && ayah.ayahNumber === 1
        ? text.replace(/^بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ /u, '')
        : text;
      expect(verse).toBe(ayah.arabic);
      expect(ayah.source).toBe(`Quran ${ayah.surahNumber}:${ayah.ayahNumber}`);
    }
  });
  it('cycles through exactly five distinct verses across a leap-day boundary', () => {
    const verses = Array.from({ length: 5 }, (_, day) => getDailyAyah(new Date(Date.UTC(2028, 1, 27 + day, 12)), 'Europe/Berlin'));
    expect(new Set(verses)).toEqual(new Set(DAILY_AYAHS));
    expect(getDailyAyah(new Date('2028-03-03T12:00:00Z'), 'Europe/Berlin')).toBe(verses[0]);
  });
  it('stays the same all day and changes on the next local day', () => {
    const morning = getDailyAyah(new Date('2026-10-10T00:00:00+02:00'), 'Europe/Berlin');
    expect(getDailyAyah(new Date('2026-10-10T23:59:00+02:00'), 'Europe/Berlin')).toBe(morning);
    expect(getDailyAyah(new Date('2026-10-11T00:00:00+02:00'), 'Europe/Berlin')).not.toBe(morning);
  });
  it('uses the prayer location timezone, including DST', () => {
    expect(getDailyAyah(new Date('2026-10-10T22:30:00Z'), 'Europe/Berlin')).toBe(getDailyAyah(new Date('2026-10-11T12:00:00Z'), 'Europe/Berlin'));
    expect(getDailyAyah(new Date('2026-10-25T00:30:00Z'), 'Europe/Berlin')).toBe(getDailyAyah(new Date('2026-10-25T01:30:00Z'), 'Europe/Berlin'));
  });
  it('handles invalid clocks without blocking startup', () => {
    expect(getDailyAyah(new Date(NaN))).toBe(DAILY_AYAHS[0]);
    expect(getDailyAyah(new Date(), 'Invalid/timezone')).toBe(DAILY_AYAHS[0]);
  });
});
