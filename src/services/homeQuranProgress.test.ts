import { beforeEach, describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import surahs from '../data/quranSurahs.json';
import { readHomeQuranProgress } from './homeQuranProgress';

describe('Home Quran progress', () => {
  beforeEach(() => { localStorage.clear(); vi.restoreAllMocks(); });

  it('keeps bundled home metadata equal to the offline Quran index', () => {
    const offlineIndex = JSON.parse(readFileSync('public/data/quran/surahs.json', 'utf8'));
    expect(surahs).toEqual(offlineIndex);
  });

  it('starts at Al-Faatiha without claiming saved progress', () => {
    expect(readHomeQuranProgress()).toMatchObject({ surahNumber: 1, ayahNumber: 1, numberOfAyahs: 7, hasProgress: false });
  });

  it.each(surahs)('preserves metadata for surah $number across repeated refreshes', (surah) => {
    localStorage.setItem('nur_quran_last_read', JSON.stringify({ surahNumber: surah.number, ayahNumber: surah.numberOfAyahs }));
    const expected = { surahNumber: surah.number, ayahNumber: surah.numberOfAyahs, englishName: surah.englishName, numberOfAyahs: surah.numberOfAyahs, hasProgress: true };
    expect(readHomeQuranProgress()).toMatchObject(expected);
    expect(readHomeQuranProgress()).toMatchObject(expected);
  });

  it('clamps an old out-of-range ayah to the actual surah length', () => {
    localStorage.setItem('nur_quran_last_read', JSON.stringify({ surahNumber: 112, ayahNumber: 50 }));
    expect(readHomeQuranProgress()).toMatchObject({ ayahNumber: 4, numberOfAyahs: 4 });
  });

  it.each(['broken', 'null', '[]', '{}', '{"surahNumber":0,"ayahNumber":1}', '{"surahNumber":115,"ayahNumber":1}', '{"surahNumber":2,"ayahNumber":0}', '{"surahNumber":2,"ayahNumber":1.5}', '{"surahNumber":"2","ayahNumber":1}'])('handles invalid stored progress: %s', (raw) => {
    localStorage.setItem('nur_quran_last_read', raw);
    expect(readHomeQuranProgress().hasProgress).toBe(false);
  });

  it('reads changed and removed progress immediately', () => {
    localStorage.setItem('nur_quran_last_read', JSON.stringify({ surahNumber: 2, ayahNumber: 255 }));
    expect(readHomeQuranProgress().ayahNumber).toBe(255);
    localStorage.setItem('nur_quran_last_read', JSON.stringify({ surahNumber: 3, ayahNumber: 10 }));
    expect(readHomeQuranProgress()).toMatchObject({ surahNumber: 3, ayahNumber: 10 });
    localStorage.removeItem('nur_quran_last_read');
    expect(readHomeQuranProgress().hasProgress).toBe(false);
  });

  it('does not fail when browser storage is unavailable', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('blocked'); });
    expect(readHomeQuranProgress().hasProgress).toBe(false);
  });
});
