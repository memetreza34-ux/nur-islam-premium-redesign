import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  HADITH_LIBRARY,
  DAILY_HADITH_IDS,
  DAILY_HADITH_POOL,
  getDailyHadith,
  getHadithById,
  getHadithShareText,
  readSavedHadithIds,
  writeSavedHadithIds,
} from './hadithData';

const CURRENT_KEY = 'nur_daily_hadith_saved_ids';
const LEGACY_DAILY_KEY = 'nur_daily_hadith_saved';
const LEGACY_LIBRARY_KEY = 'nur_hadith_library_favorites';
afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); });

function replaceStorageWrite(write: (key: string, value: string) => void) {
  const storage = localStorage;
  vi.stubGlobal('localStorage', {
    getItem: storage.getItem.bind(storage),
    removeItem: storage.removeItem.bind(storage),
    setItem: write,
  });
}

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

  it('rotates to the next curated entry on the following local day', () => {
    const today = getDailyHadith(new Date(2026, 7, 10, 12));
    const tomorrow = getDailyHadith(new Date(2026, 7, 11, 12));
    const currentIndex = DAILY_HADITH_POOL.findIndex((entry) => entry.id === today.id);
    expect(tomorrow.id).toBe(DAILY_HADITH_POOL[(currentIndex + 1) % DAILY_HADITH_POOL.length].id);
  });

  it('only rotates the documented seven Bukhari/Muslim entries', () => {
    expect(DAILY_HADITH_IDS).toEqual(['intentions', 'mercy', 'good-word', 'anger', 'brother', 'ease', 'cleanliness']);
    expect(DAILY_HADITH_POOL.map(entry => entry.id)).toEqual(DAILY_HADITH_IDS);
    for (const entry of DAILY_HADITH_POOL) expect(entry.source).toMatch(/Sahih (al-Bukhari|Muslim) \d/);
    const rotated = new Set(Array.from({ length: 140 }, (_, day) => getDailyHadith(new Date(2026, 0, day + 1)).id));
    expect([...rotated].sort()).toEqual([...DAILY_HADITH_IDS].sort());
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

  it('preserves edition attribution and grading differences when sharing Tirmidhi entries', () => {
    for (const entry of HADITH_LIBRARY.filter(item => item.source.startsWith('Jami at-Tirmidhi'))) {
      expect(entry.grading?.sourceUrl).toMatch(/^https:\/\/sunnah\.com\/tirmidhi:\d+$/);
      expect(entry.grading?.text).toContain('Darussalam');
      expect(entry.grading?.text).toContain('At-Tirmidhi');
      expect(entry.grading?.text).toMatch(/keine eigene|kein eigenes/);
      const shared = getHadithShareText(entry);
      expect(shared).toContain(entry.summary);
      expect(shared).toContain(entry.source);
      expect(shared).toContain(entry.grading!.text);
      expect(shared).toContain(entry.grading!.sourceUrl);
    }
  });

  it('uses the verified Muslim variants rather than an ambiguous shared number', () => {
    expect(getHadithById('die-allah-liebsten-taten')?.source).toContain('783b');
    expect(getHadithById('der-islam-ist-auf')?.source).toContain('16c');
    expect(getHadithById('die-religion-ist-aufrichtiger')?.source).toContain('55a');
    expect(getHadithById('wer-einen-weg-beschreitet')?.source).toContain('2699a');
  });

  it('retains the previous bookmark id and both sources for differing assessments', () => {
    const entry = getHadithById('es-gehort-zum-guten')!;
    expect(entry.grading?.text).toContain('daif für Tirmidhi 2317');
    expect(entry.grading?.text).toContain('An-Nawawi');
    expect(entry.grading?.text).toContain('hasan');
    expect(getHadithShareText(entry)).toContain('https://sunnah.com/nawawi40:12');
    store(CURRENT_KEY, [entry.id]);
    expect(readSavedHadithIds().has(entry.id)).toBe(true);
    expect(DAILY_HADITH_POOL.some(item => item.id === entry.id)).toBe(false);
  });

  it('does not fabricate an individual grading for a Bukhari or Muslim excerpt', () => {
    const entry = getHadithById('intentions')!;
    expect(entry.grading).toBeUndefined();
    expect(getHadithShareText(entry)).toBe(`${entry.summary}\n\nEinordnung: ${entry.context}\n\nQuelle: ${entry.source}`);
    expect(getHadithShareText(getHadithById('ease')!)).toContain('Muslim 1734 nennt an derselben Stelle Beruhigen');
  });
});

describe('Hadith favorites migration', () => {
  beforeEach(() => localStorage.clear());

  it('only reports success after both current and legacy storage agree', () => {
    expect(writeSavedHadithIds(new Set(['mercy']))).toBe(true);
    expect(stored(CURRENT_KEY)).toEqual(['mercy']);
    expect(stored(LEGACY_LIBRARY_KEY)).toEqual(['mercy']);
  });

  it('does not report success for blocked storage or a no-op write', () => {
    replaceStorageWrite(() => { throw new DOMException('Full', 'QuotaExceededError'); });
    expect(writeSavedHadithIds(new Set(['mercy']))).toBe(false);
    vi.unstubAllGlobals();
    replaceStorageWrite(() => undefined);
    expect(writeSavedHadithIds(new Set(['mercy']))).toBe(false);
  });

  it('reports a partial mirror failure rather than pretending the change was fully saved', () => {
    const storage = localStorage;
    replaceStorageWrite((key, value) => {
      if (key === LEGACY_LIBRARY_KEY) throw new DOMException('Full', 'QuotaExceededError');
      storage.setItem(key, value);
    });
    expect(writeSavedHadithIds(new Set(['mercy']))).toBe(false);
    expect(readSavedHadithIds().has('mercy')).toBe(true);
  });

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
