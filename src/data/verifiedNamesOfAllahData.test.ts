import { describe, expect, it } from 'vitest';
import { NAMES_OF_ALLAH } from './namesOfAllahData';
import { VERIFIED_NAMES_OF_ALLAH } from './verifiedNamesOfAllahData';

describe('verified Names of Allah public set', () => {
  it('exposes only the individually Quran-sourced v1 subset', () => {
    expect(VERIFIED_NAMES_OF_ALLAH).toHaveLength(32);
    expect(new Set(VERIFIED_NAMES_OF_ALLAH.map((name) => name.key)).size).toBe(32);
    expect(new Set(VERIFIED_NAMES_OF_ALLAH.map((name) => name.latin.toLowerCase())).size).toBe(32);

    for (const name of VERIFIED_NAMES_OF_ALLAH) {
      expect(name.source).toContain('Quran ');
      expect(name.sourceNote.trim()).not.toBe('');
      expect(name.arabic.trim()).not.toBe('');
      expect(name.meaning.trim()).not.toBe('');
    }
  });

  it('keeps legacy ids traceable without treating the old 99-list as public truth', () => {
    expect(NAMES_OF_ALLAH).toHaveLength(99);
    const legacyIds = new Set(NAMES_OF_ALLAH.map((name) => name.id));

    for (const name of VERIFIED_NAMES_OF_ALLAH) {
      if (name.legacyId !== null) expect(legacyIds.has(name.legacyId)).toBe(true);
    }

    expect(VERIFIED_NAMES_OF_ALLAH.some((name) => name.key === 'allah' && name.legacyId === null)).toBe(true);
  });
});
