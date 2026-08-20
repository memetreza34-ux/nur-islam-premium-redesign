import { describe, expect, it } from 'vitest';
import { LEARNING_LESSONS } from './islamicLearningContent';

const byId = new Map(LEARNING_LESSONS.map((lesson) => [lesson.id, lesson]));

describe('reviewed wording in deeper learning lessons', () => {
  it('keeps all 18 lessons present and sourced', () => {
    expect(LEARNING_LESSONS).toHaveLength(18);
    for (const lesson of LEARNING_LESSONS) {
      expect(lesson.sources.length).toBeGreaterThan(0);
      expect(lesson.paragraphs.length).toBeGreaterThan(0);
    }
  });

  it('does not restore over-universal fiqh or tafsir wording', () => {
    expect(byId.get('fiqh-purity')?.paragraphs.join(' ')).toContain('können besondere Regeln gelten');
    expect(byId.get('tafsir-fatiha')?.paragraphs.join(' ')).toContain('im Fiqh unterschiedlich behandelt');
    expect(byId.get('tafsir-fatiha')?.sources.some((source) => source.reference === 'Sahih al-Bukhari 756')).toBe(true);
    expect(byId.get('tafsir-ikhlas')?.paragraphs.join(' ')).toContain('As-Samad');
  });

  it('keeps source-backed seerah and character wording', () => {
    expect(byId.get('seerah-revelation')?.sources.some((source) => source.reference === 'Sure Al-Balad 90:12–17')).toBe(true);
    expect(byId.get('seerah-hijra')?.paragraphs.join(' ')).toContain('Regeln des Zusammenlebens');
    expect(byId.get('akhlaq-sincerity')?.sources.some((source) => source.reference === 'Sure Al-Baqara 2:271')).toBe(true);
  });

  it('keeps intention and patience wording appropriately qualified', () => {
    expect(byId.get('hadith-intention')?.paragraphs.join(' ')).toContain('nicht automatisch erlaubt');
    expect(byId.get('akhlaq-patience')?.summary).toContain('unter anderem');
  });
});
