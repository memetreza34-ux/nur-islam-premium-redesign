import { beforeEach, describe, expect, it } from 'vitest';
import { readPremiumCollectionCount, readPremiumFavoriteRefs } from './premiumLocalService';

describe('Start widget collection count', () => {
  beforeEach(() => localStorage.clear());

  it('includes saved Ayah, Hadith and calendar days without duplicates', () => {
    localStorage.setItem('nur_daily_ayah_saved', '1');
    localStorage.setItem('nur_daily_hadith_saved_ids', JSON.stringify(['intentions']));
    localStorage.setItem('nur_calendar_favorites', JSON.stringify(['2026-09-23', '2026-09-23', '2026-02-30']));

    expect(readPremiumFavoriteRefs().map(({ ref }) => ref)).toEqual([
      'focus-ayah:112:1',
      'hadith:intentions',
      'calendar:2026-09-23',
    ]);
    expect(readPremiumCollectionCount()).toBe(3);
  });
});
