import { describe, expect, it } from 'vitest';
import { FOUNDATION_SUPPLEMENTS } from './foundationSupplementData';
import { REPENTANCE_GROUPS, SUNNAH_GROUPS } from './practiceData';

describe('foundation reading guides', () => {
  it('has four distinct guides with complete, unique chapter targets', () => {
    expect(Object.keys(FOUNDATION_SUPPLEMENTS)).toEqual(['hadith-library', 'hajj', 'sunnah', 'sins']);
    const ids: string[] = [];
    for (const guide of Object.values(FOUNDATION_SUPPLEMENTS)) {
      expect(guide.introduction.length).toBeGreaterThan(100);
      expect(guide.chapters.length).toBeGreaterThanOrEqual(3);
      for (const chapter of guide.chapters) {
        expect(chapter.title.length).toBeGreaterThan(10);
        ids.push(chapter.id);
      }
    }
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('gives every revised practice a meaning, explanation, example and direct source', () => {
    const entries = [...SUNNAH_GROUPS.flatMap(group => group.items), ...REPENTANCE_GROUPS.filter(group => group.id === 'repentance').flatMap(group => group.items)];
    expect(entries).toHaveLength(12);
    for (const entry of entries) {
      expect(entry.meaning?.length).toBeGreaterThan(30);
      expect(entry.description.length).toBeGreaterThan(90);
      expect(entry.example?.length).toBeGreaterThan(40);
      expect(entry.proof.length).toBeGreaterThanOrEqual(12);
      expect(new URL(entry.sourceUrl!).protocol).toBe('https:');
    }
  });
});
