import { beforeEach, describe, expect, it } from 'vitest';
import { readDuaFavoriteSet, readNameFavoriteSet } from '../screens/CollectionsScreen';

// Favourites are the only content a user actively curates, and both readers
// rewrite storage as a side effect. A migration bug therefore does not just
// display the wrong thing once, it destroys the saved list permanently.

function store(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

function stored(key: string) {
  return JSON.parse(localStorage.getItem(key) ?? 'null');
}

describe('dua favourites', () => {
  beforeEach(() => localStorage.clear());

  it('migrates the legacy numeric ids to stable ids', () => {
    store('nur_dua_favorites', ['1', '4']);
    expect([...readDuaFavoriteSet()]).toEqual(['dua_guidance_1', 'dua_morning_1']);
  });

  it('migrates numbers as well as their string form', () => {
    store('nur_dua_favorites', [1, 4]);
    expect([...readDuaFavoriteSet()]).toEqual(['dua_guidance_1', 'dua_morning_1']);
  });

  it('runs without the Dua screen having been opened first', () => {
    // The reader owns the migration, so Collections alone must be enough.
    store('nur_dua_favorites', ['2']);
    expect([...readDuaFavoriteSet()]).toEqual(['dua_protection_1']);
    expect(stored('nur_dua_favorites')).toEqual(['dua_protection_1']);
  });

  it('keeps already migrated ids untouched', () => {
    store('nur_dua_favorites', ['dua_protection_1', 'dua_morning_2']);
    expect([...readDuaFavoriteSet()]).toEqual(['dua_protection_1', 'dua_morning_2']);
  });

  it('is idempotent, so repeated reads cannot erode the list', () => {
    store('nur_dua_favorites', ['1', 'dua_morning_2']);
    const first = [...readDuaFavoriteSet()];
    const second = [...readDuaFavoriteSet()];
    const third = [...readDuaFavoriteSet()];
    expect(second).toEqual(first);
    expect(third).toEqual(first);
  });

  it('does not duplicate an entry stored in both forms', () => {
    store('nur_dua_favorites', ['1', 'dua_guidance_1']);
    expect([...readDuaFavoriteSet()]).toEqual(['dua_guidance_1']);
  });

  it('keeps an intentionally empty list empty', () => {
    store('nur_dua_favorites', []);
    expect([...readDuaFavoriteSet()]).toEqual([]);
  });

  it('survives corrupted storage without throwing', () => {
    localStorage.setItem('nur_dua_favorites', '{not json');
    expect([...readDuaFavoriteSet()]).toEqual([]);
    store('nur_dua_favorites', 'not an array');
    expect([...readDuaFavoriteSet()]).toEqual([]);
    store('nur_dua_favorites', [null, undefined, {}, [], 999, '']);
    expect([...readDuaFavoriteSet()]).toEqual([]);
  });
});

describe('name favourites', () => {
  beforeEach(() => localStorage.clear());

  it('migrates transliterated names to their numeric id', () => {
    store('nur_name_favorites', ['Ar-Rahman', 'Al-Malik']);
    expect([...readNameFavoriteSet()]).toEqual(['1', '3']);
  });

  it('keeps ids that are already stable', () => {
    store('nur_name_favorites', ['1', '48']);
    expect([...readNameFavoriteSet()]).toEqual(['1', '48']);
  });

  it('does not duplicate a name stored under both forms', () => {
    // The exact collision the move to numeric ids was meant to remove.
    store('nur_name_favorites', ['Ar-Rahman', '1']);
    expect([...readNameFavoriteSet()]).toEqual(['1']);
  });

  it('is idempotent', () => {
    store('nur_name_favorites', ['Ar-Rahim', '3']);
    const first = [...readNameFavoriteSet()];
    expect([...readNameFavoriteSet()]).toEqual(first);
  });

  it('keeps an intentionally empty list empty', () => {
    store('nur_name_favorites', []);
    expect([...readNameFavoriteSet()]).toEqual([]);
  });

  it('drops entries that match no name instead of throwing', () => {
    store('nur_name_favorites', ['Al-Erfunden', 0, 100, null]);
    expect([...readNameFavoriteSet()]).toEqual([]);
  });
});
