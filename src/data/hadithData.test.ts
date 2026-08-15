import { beforeEach, describe, expect, it } from 'vitest';
import {
  HADITH_LIBRARY,
  getDailyHadith,
  getHadithById,
  readSavedHadithIds,
  writeSavedHadithIds,
} from './hadithData';

const CURRENT_KEY = 'nur_daily_hadith_saved_ids';
const LEGACY_DAILY_KEY = 'nur_daily_hadith_saved';
const LEGACY_LIBRARY_KEY = 'nur_hadith_library_favorites';

function store(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

function stored(key: string) {
  return JSON.parse(localStorage.getItem(key) ?? 'null');
}

describe('Hadith library', () => {
  beforeEach(() => localStorage.clear());

  it('keeps every entry unique and source-labelled', () => {
    // No exact count: the library grows as entries are carried over, and a
    // pinned number turns each addition into a failing test for no reason.
    // check-hadith-data.mjs holds the floor and the sourcing rules. The floor
    // dropped from 25 to 20 when five duplicated narrations were merged.
    expect(HADITH_LIBRARY.length).toBeGreaterThanOrEqual(20);
    expect(new Set(HADITH_LIBRARY.map((entry) => entry.id)).size).toBe(HADITH_LIBRARY.length);
    for (const entry of HADITH_LIBRARY) {
      expect(entry.title.trim()).not.toBe('');
      expect(entry.source.trim()).not.toBe('');
      expect(entry.summary.startsWith('Sinngemäßer Inhalt:')).toBe(true);
    }
  });

  it('returns the same daily Hadith throughout one local calendar day', () => {
    const morning = getDailyHadith(new Date(2026, 7, 10, 1, 5));
    const evening = getDailyHadith(new Date(2026, 7, 10, 23, 55));
    expect(evening.id).toBe(morning.id);
  });

  it('rotates to the next library entry on the following local day', () => {
    const today = getDailyHadith(new Date(2026, 7, 10, 12));
    const tomorrow = getDailyHadith(new Date(2026, 7, 11, 12));
    const currentIndex = HADITH_LIBRARY.findIndex((entry) => entry.id === today.id);
    expect(tomorrow.id).toBe(HADITH_LIBRARY[(currentIndex + 1) % HADITH_LIBRARY.length].id);
  });

  it('keeps pre-epoch dates inside the valid library range', () => {
    const entry = getDailyHadith(new Date(1960, 0, 1, 12));
    expect(HADITH_LIBRARY.some((candidate) => candidate.id === entry.id)).toBe(true);
  });

  it('resolves valid ids and rejects missing ids', () => {
    expect(getHadithById('intentions')?.source).toContain('Sahih al-Bukhari');
    expect(getHadithById('does-not-exist')).toBeNull();
    expect(getHadithById(null)).toBeNull();
  });
});

describe('Hadith favorites migration', () => {
  beforeEach(() => localStorage.clear());

  it('merges current and legacy library favorites, filters unknown ids and mirrors the result', () => {
    store(CURRENT_KEY, ['mercy', 'unknown']);
    store(LEGACY_LIBRARY_KEY, ['smile', 'mercy', 42]);
    expect([...readSavedHadithIds()]).toEqual(['mercy', 'smile']);
    expect(stored(CURRENT_KEY)).toEqual(['mercy', 'smile']);
    expect(stored(LEGACY_LIBRARY_KEY)).toEqual(['mercy', 'smile']);
  });

  it('migrates the old fixed daily bookmark exactly once', () => {
    localStorage.setItem(LEGACY_DAILY_KEY, '1');
    expect([...readSavedHadithIds()]).toEqual(['intentions']);
    expect(localStorage.getItem(LEGACY_DAILY_KEY)).toBeNull();
    expect([...readSavedHadithIds()]).toEqual(['intentions']);
  });

  it('recovers valid legacy favorites even when another key contains damaged JSON', () => {
    localStorage.setItem(CURRENT_KEY, '{broken json');
    store(LEGACY_LIBRARY_KEY, ['ease']);
    expect([...readSavedHadithIds()]).toEqual(['ease']);
    expect(stored(CURRENT_KEY)).toEqual(['ease']);
    expect(stored(LEGACY_LIBRARY_KEY)).toEqual(['ease']);
  });

  it('writes only known ids and mirrors both storage contracts', () => {
    writeSavedHadithIds(new Set(['anger', 'invalid', 'anger', 'cleanliness']));
    expect(stored(CURRENT_KEY)).toEqual(['anger', 'cleanliness']);
    expect(stored(LEGACY_LIBRARY_KEY)).toEqual(['anger', 'cleanliness']);
  });

  it('keeps a bookmark that was saved on the merged half of a duplicated Hadith', () => {
    // 'die-taten-sind-entsprechend' was the unnumbered second copy of the
    // intentions Hadith. Anyone who bookmarked that copy keeps the bookmark.
    store(CURRENT_KEY, ['die-taten-sind-entsprechend', 'die-reinheit-ist-die']);
    expect([...readSavedHadithIds()]).toEqual(['intentions', 'cleanliness']);
    expect(stored(CURRENT_KEY)).toEqual(['intentions', 'cleanliness']);
  });

  it('does not save the merged and surviving id as two separate favorites', () => {
    writeSavedHadithIds(new Set(['smile', 'dein-lacheln-deinem-bruder']));
    expect(stored(CURRENT_KEY)).toEqual(['smile']);
  });

  it('resolves a merged id to the surviving entry', () => {
    expect(getHadithById('keiner-von-euch-glaubt')?.id).toBe('brother');
  });

  it('keeps an intentionally empty favorites set empty', () => {
    writeSavedHadithIds(new Set());
    expect([...readSavedHadithIds()]).toEqual([]);
    expect(stored(CURRENT_KEY)).toEqual([]);
    expect(stored(LEGACY_LIBRARY_KEY)).toEqual([]);
  });
});
