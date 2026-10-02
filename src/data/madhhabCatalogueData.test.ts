import { describe, expect, it } from 'vitest';
import { MADHHABS, MADHHAB_DIFFERENCES_BY_STEP } from './madhhabData';
import { MADHHAB_CATALOGUE } from './madhhabCatalogueData';

describe('four-school catalogue', () => {
  it('contains each existing Sunni school once without changing prayer comparisons', () => {
    expect(MADHHAB_CATALOGUE.map((school) => school.id)).toEqual(MADHHABS.map((school) => school.id));
    expect(new Set(MADHHAB_CATALOGUE.map((school) => school.id)).size).toBe(4);
    expect(MADHHAB_DIFFERENCES_BY_STEP.size).toBeGreaterThan(0);
  });

  for (const school of MADHHAB_CATALOGUE) {
    it(`${school.id} has a complete reading structure and institutional homepage links`, () => {
      expect(school.history.length).toBeGreaterThanOrEqual(2);
      expect(school.method).toHaveLength(3);
      for (const value of [school.arabic, school.pronunciation, school.eponym, school.dates, school.origin, school.short, school.spread, school.practice]) {
        expect(value.trim().length).toBeGreaterThan(0);
      }
      expect(school.sources).toHaveLength(3);
      expect(school.sources.some((source) => source.homepage)).toBe(true);
      for (const source of school.sources) {
        expect(new URL(source.href).protocol).toBe('https:');
        if (source.homepage) expect(new URL(source.homepage).protocol).toBe('https:');
      }
    });
  }
});
