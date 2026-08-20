import { beforeEach, describe, expect, it } from 'vitest';
import {
  DAILY_HADITH_IDS,
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
    expect(HADITH_LIBRARY.length).toBeGreaterThanOrEqual(25);
    expect(new Set(HADITH_LIBRARY.map((entry) => entry.id)).size).toBe(HADITH_LIBRARY.length);
    for (const entry of HADITH_LIBRARY) {
      expect(entry.title.trim()).not.toBe('');
      expect(entry.source.trim()).not.toBe('');
      expect(entry.summary.startsWith('Sinngemäßer Inhalt:')).toBe(true);
    }
  });

  it('uses a small explicit daily pool with concrete references', () => {
    expect(DAILY_HADITH_IDS.length).toBeGreaterThanOrEqual(5);
    expect(new Set(DAILY_HADITH_IDS).size).toBe(DAILY_HADITH_IDS.length);
    for (const id of DAILY_HADITH_IDS) {
      const entry = getHadithById(id);
      expect(entry).not.toBeNull();
      expect(entry?.source).toMatch(/\d/);
    }
  });

  it('returns the same daily Hadith throughout one local calendar day', () => {
    const morning = getDailyHadith(new Date(2026, 7, 10, 1, 5));
    const evening = getDailyHadith(new Date(2026, 7, 10, 23, 55));
    expect(evening.id).toBe(morning.id);
  });

  it('rotates through the curated daily pool on following local days', () => {
    const today = getDailyHadith(new Date(2026, 7, 10, 12));
    const tomorrow = getDailyHadith(new Date(2026, 7, 11, 12));
    const currentIndex = DAILY_HADITH_IDS.indexOf(today.id as (typeof DAILY_HADITH_IDS)[number]);
    expect(currentIndex).toBeGreaterThanOrEqual(0);
    expect(tomorrow.id).toBe(DAILY_HADITH_IDS[(currentIndex + 1) % DAILY_HADITH_IDS.length]);
  });

  it('keeps pre-epoch dates inside the curated daily pool', () => {
    const entry = getDailyHadith(new Date(1960, 0, 1, 12));
    expect(DAILY_HADITH_IDS).toContain(entry.id);
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

  it('keeps an intentionally empty favorites set empty', () => {
    writeSavedHadithIds(new Set());
    expect([...readSavedHadithIds()]).toEqual([]);
    expect(stored(CURRENT_KEY)).toEqual([]);
    expect(stored(LEGACY_LIBRARY_KEY)).toEqual([]);
  });
});
