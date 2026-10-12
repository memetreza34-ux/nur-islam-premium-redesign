import { describe, expect, it } from 'vitest';
import { getCategoryLessons, getLearningCategory, LEARNING_LESSONS } from './islamicLearningContent';

const expectedSources = {
  'character-overview': ['https://quran.com/16/90', 'https://quran.com/49/11', 'https://quran.com/49/12', 'https://quran.com/4/148', 'https://quran.com/42/40-43', 'https://islamansiklopedisi.org.tr/muellif/mustafa-cagrici', 'https://sunnah.com/bukhari:1', 'https://sunnah.com/bukhari:6114', 'https://quran.com/4/29'],
  'akhlaq-sincerity': ['https://quran.com/98/5', 'https://sunnah.com/bukhari:1', 'https://quran.com/2/271', 'https://sunnah.com/muslim/45/216'],
  'akhlaq-patience': ['https://quran.com/2/153', 'https://quran.com/3/134', 'https://sunnah.com/bukhari:6114', 'https://quran.com/42/40-43', 'https://islamansiklopedisi.org.tr/sabir'],
  'akhlaq-mercy': ['https://quran.com/16/90', 'https://quran.com/49/11', 'https://quran.com/49/12', 'https://quran.com/4/148', 'https://quran.com/3/134'],
};
const lesson = (id: string) => LEARNING_LESSONS.find(item => item.id === id)!;

describe('character lessons: compared sources and precise boundaries', () => {
  it.each(Object.entries(expectedSources))('%s exposes the compared references', (id, urls) => {
    expect(lesson(id).sources.map(source => source.url)).toEqual(urls);
    expect(lesson(id).sources.every(source => source.note.length > 20)).toBe(true);
  });
  it('retains four lessons, 35 inventory positions and 23 source entries', () => {
    const lessons = getCategoryLessons('character');
    expect(lessons.map(item => item.id)).toEqual(Object.keys(expectedSources));
    expect(getLearningCategory('character').lessonIds).toEqual(Object.keys(expectedSources));
    expect(lessons.reduce((sum, item) => sum + 2 + item.paragraphs.length + (item.detailItems?.length ?? 0) + item.keyPoints.length, 0)).toBe(35);
    expect(lessons.reduce((sum, item) => sum + item.sources.length, 0)).toBe(23);
    expect(LEARNING_LESSONS).toHaveLength(44);
  });
  it('describes the actual three follow-up topics instead of a nonexistent fixed lesson sequence', () => {
    expect(lesson('character-overview').paragraphs[1]).toContain('drei Themenlektionen');
    expect(lesson('character-overview').keyPoints[1]).toContain('Drei Themenlektionen');
    expect(JSON.stringify(lesson('character-overview'))).not.toContain('zuerst die Bedeutung, danach ein Beispiel');
  });
  it('does not claim Quran 49:12 prohibits every suspicion', () => {
    for (const id of ['character-overview', 'akhlaq-mercy']) {
      const source = lesson(id).sources.find(item => item.url === 'https://quran.com/49/12')!;
      expect(source.note).toContain('viel Verdacht');
      expect(source.note).toContain('mancher sündhaft');
      expect(source.note).toContain('Kein pauschales Verbot');
    }
    expect(lesson('akhlaq-mercy').paragraphs[0]).toContain('mancher Verdacht sündhaft');
  });
  it('keeps private charity in its specific context and does not forbid all public deeds', () => {
    const item = lesson('akhlaq-sincerity');
    expect(item.paragraphs[2]).toContain('öffentliche Spenden gut');
    expect(item.paragraphs[2]).toContain('verborgene Hilfe für Arme besser');
    expect(item.sources[2].note).toContain('kein allgemeines Gebot');
    expect(item.keyPoints[2]).toContain('Spenden');
  });
  it('does not treat later praise as automatic proof of insincerity', () => {
    const item = lesson('akhlaq-sincerity');
    expect(item.paragraphs[1]).toContain('nicht automatisch');
    expect(item.sources[3].reference).toContain('2642a');
    expect(item.sources[3].reference).toContain('Buch 45, Hadith 216');
    expect(item.sources[3].note).toContain('keine pauschale Annahmegarantie');
  });
  it('labels the pause as an editorial suggestion, not a narrated rite or medical treatment', () => {
    const item = lesson('akhlaq-patience');
    expect(item.paragraphs[2]).toContain('Redaktioneller Alltagstipp');
    expect(item.paragraphs[2]).toContain('kein überlieferter Ritus');
    expect(item.paragraphs[2]).toContain('keine medizinische Behandlung');
    expect(item.sources[2].note).toContain('keine bestimmte Atemübung');
  });
  it('does not turn patience into compulsory silence or permit unlimited retaliation', () => {
    const item = lesson('akhlaq-patience');
    expect(item.paragraphs[1]).toContain('Hilfe suchen');
    expect(item.paragraphs[1]).toContain('keine pauschale Erlaubnis zu Gewalt oder eigenmächtiger Bestrafung');
    expect(item.sources[3].note).toContain('Vergebung und begrenzte Gegenwehr');
    expect(item.sources[4].reference).toContain('Mustafa Çağrıcı');
  });
  it('protects necessary complaints instead of banning everything potentially embarrassing', () => {
    const item = lesson('akhlaq-mercy');
    expect(item.paragraphs[1]).toContain('Berechtigte Beschwerden und Schutzmeldungen');
    expect(item.paragraphs[2]).toContain('Unsicherheiten benennen');
    expect(item.question.options[0]).toContain('nicht auf Bloßstellung angelegt');
    expect(item.question.explanation).toContain('Schutzmeldungen');
    expect(item.sources[3].note).toContain('keine Erlaubnis für beliebige Anschuldigungen');
  });
  it('identifies practical intention review as an editorial suggestion without an acceptance guarantee', () => {
    const item = lesson('akhlaq-sincerity');
    expect(item.keyPoints[1]).toContain('redaktioneller Alltagstipp');
    expect(item.question.explanation).toContain('redaktioneller Tipp');
    expect(item.question.explanation).toContain('keine Garantie');
    expect(item.sources[1].note).toContain('keine festgelegte Prüfroutine');
  });
  it('marks reading durations as estimates rather than measured completion times', () => {
    for (const item of getCategoryLessons('character')) expect(item.duration).toMatch(/^ca\. \d+ Min\.$/);
  });
});
