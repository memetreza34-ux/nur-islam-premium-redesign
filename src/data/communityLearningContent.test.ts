import { describe, expect, it } from 'vitest';
import { getCategoryLessons, getLearningCategory, LEARNING_LESSONS } from './islamicLearningContent';

const expectedSources = {
  'community-overview': ['https://quran.com/4/36', 'https://quran.com/16/90', 'https://quran.com/49/11', 'https://quran.com/49/12', 'https://quran.com/4/148', 'https://quran.com/4/29', 'https://quran.com/4/58', 'https://quran.com/17/34'],
  'community-parents': ['https://quran.com/17/23-24', 'https://quran.com/31/14-15', 'https://sunnah.com/bukhari:7257', 'https://quran.com/42/40-43', 'https://quran.com/9/113'],
  'community-neighbors': ['https://quran.com/4/36', 'https://sunnah.com/bukhari:6018', 'https://sunnah.com/tirmidhi:1943', 'https://quran.com/an-nisa/36/tafsirs/en-tafisr-ibn-kathir', 'https://quran.com/4/148'],
  'community-speech': ['https://quran.com/49/11', 'https://quran.com/49/12', 'https://sunnah.com/bukhari:6018', 'https://sunnah.com/muslim:2589', 'https://quran.com/49/6', 'https://quran.com/4/148', 'https://sunnah.com/bukhari:5364', 'https://sunnah.com/muslim:1480a'],
  'akhlaq-rights': ['https://quran.com/49/12', 'https://quran.com/4/29', 'https://quran.com/4/58', 'https://quran.com/4/148', 'https://sunnah.com/bukhari:5364'],
  'community-money': ['https://quran.com/4/29', 'https://quran.com/2/282', 'https://quran.com/2/283', 'https://sunnah.com/bukhari:2079', 'https://quran.com/17/34'],
};
const lesson = (id: string) => LEARNING_LESSONS.find(item => item.id === id)!;

describe('community lessons: source scope and protection exceptions', () => {
  it.each(Object.entries(expectedSources))('%s exposes the actual compared sources', (id, urls) => {
    expect(lesson(id).sources.map(source => source.url)).toEqual(urls);
    expect(lesson(id).sources.every(source => source.note.length > 20)).toBe(true);
  });
  it('retains all six lessons, 66 inventory positions and 36 source entries', () => {
    const lessons = getCategoryLessons('community');
    expect(lessons.map(item => item.id)).toEqual(Object.keys(expectedSources));
    expect(getLearningCategory('community').lessonIds).toEqual(Object.keys(expectedSources));
    expect(lessons.reduce((sum, item) => sum + 2 + item.paragraphs.length + (item.detailItems?.length ?? 0) + item.keyPoints.length, 0)).toBe(66);
    expect(lessons.reduce((sum, item) => sum + item.sources.length, 0)).toBe(36);
    expect(LEARNING_LESSONS).toHaveLength(44);
  });
  it('describes five follow-up themes rather than a separate lesson per word', () => {
    const item = lesson('community-overview');
    expect(item.paragraphs[1]).toContain('fünf Themenlektionen');
    expect(item.paragraphs[1]).toContain('Privatsphäre, Eigentum und Sicherheit gemeinsam');
    expect(item.keyPoints[1]).toContain('Fünf Themenlektionen');
  });
  it('does not prohibit every private disclosure in the overview', () => {
    expect(lesson('community-overview').detailItems![1].text).toContain('notwendige Schutzmeldungen');
    expect(lesson('community-overview').sources[4].note).toContain('keine pauschale Schweigepflicht');
  });
  it('keeps kindness, the specific Shirk context and the general obedience limit separate', () => {
    const item = lesson('community-parents');
    expect(item.sources[1].note).toContain('Druck zur Beigesellung');
    expect(item.sources[1].note).toContain('guten Umgang');
    expect(item.sources[2].reference).toContain('Buch 95, Hadith 12');
    expect(item.sources[2].note).toContain('Befehl, ins Feuer');
    expect(item.paragraphs[2]).toContain('keine individuelle Entscheidung');
  });
  it('does not generalize the parental supplication into every form of intercession', () => {
    const item = lesson('community-parents');
    expect(item.paragraphs[1]).toContain('keine pauschale Erlaubnis für jede Fürbitte');
    expect(item.sources[4].note).toContain('kein Urteil über einzelne Menschen');
  });
  it('does not infer a fixed neighbor radius or identical obligations at every distance', () => {
    const item = lesson('community-neighbors');
    expect(item.summary).not.toContain('unabhängig von Herkunft oder Nähe');
    expect(item.paragraphs[0]).toContain('verwandte und nicht verwandte Nachbarn');
    expect(item.sources[0].note).toContain('keine feste Entfernung');
    expect(item.sources[3].note).toContain('kein vollständiger Tafsir- oder Isnad-Abgleich');
  });
  it('attributes both printed Tirmidhi assessments instead of inventing a single universal grade', () => {
    const source = lesson('community-neighbors').sources[2];
    expect(source.reference).toContain('Buch 27, Hadith 49');
    expect(source.note).toContain('jüdischen Nachbarn');
    expect(source.note).toContain('Sahih (Darussalam)');
    expect(source.note).toContain('hasan gharib');
    expect(source.note).toContain('at-Tirmidhi');
  });
  it('uses the actual backbiting definition without declaring every truthful complaint forbidden', () => {
    const item = lesson('community-speech');
    expect(item.sources[3].reference).toContain('Buch 45, Hadith 91');
    expect(item.sources[3].note).toContain('Ghiba');
    expect(item.sources[7].note).toContain('Beratung zur Heirat');
    expect(item.detailItems![0].text).toContain('Berechtigte Beratung');
  });
  it('lets people seek protection before proving every uncertainty themselves', () => {
    const item = lesson('community-speech');
    expect(item.paragraphs[2]).toContain('Beobachtungen und Vermutungen');
    expect(item.paragraphs[2]).toContain('nicht erst selbst vollständig beweisen');
    expect(item.sources[4].note).toContain('keine pauschale Verdächtigung Hilfesuchender');
    expect(item.question.explanation).toContain('Unsicherheiten');
    expect(item.keyPoints[2]).toContain('Unsicherheiten');
  });
  it('makes privacy text and its correct quiz answer compatible with protection reports', () => {
    const item = lesson('akhlaq-rights');
    expect(item.paragraphs[1]).toContain('Ausnahmen für notwendige Schutzmeldungen');
    expect(item.detailItems![0].text).toContain('Schutzmeldungen');
    expect(item.question.options[0]).toContain('notwendige Schutzmeldungen');
    expect(item.question.options[0]).not.toContain('nur mit Erlaubnis');
    expect(item.question.explanation).toContain('nicht pauschal von einer Erlaubnis');
  });
  it('does not turn Hind’s maintenance consultation into unlimited property appropriation', () => {
    const item = lesson('akhlaq-rights');
    expect(item.detailItems![1].text).toContain('nicht unrechtmäßig');
    expect(item.sources[4].note).toContain('keine allgemeine Erlaubnis');
    expect(item.sources[4].note).toContain('fremdes Geld');
  });
  it('specifies the agreed sale price and known defects rather than all internal prices', () => {
    const item = lesson('community-money');
    expect(item.paragraphs[1]).toContain('vereinbarten Verkaufspreis');
    expect(item.paragraphs[1]).toContain('bekannte Mängel');
    expect(item.sources[3].reference).toContain('Buch 34, Hadith 32');
    expect(item.sources[3].note).toContain('keine pauschale Umsatz- oder Gewinnzusage');
  });
  it('quotes the debt-writing call with its context, not a blanket legal ruling', () => {
    const item = lesson('community-money');
    expect(item.sources[1].note).toContain('befristeter Schulden');
    expect(item.sources[1].note).toContain('sofortigen Handel');
    expect(item.sources[2].note).toContain('Vertrauen');
    expect(item.sources[1].note).toContain('keine eigene Fard-/Sunnah-Einstufung');
    expect(item.paragraphs[2]).toContain('keine persönliche Fatwa');
  });
  it('labels durations and digital examples as editorial, not measured or narrated', () => {
    for (const item of getCategoryLessons('community')) expect(item.duration).toMatch(/^ca\. \d+ Min\.$/);
    expect(lesson('community-neighbors').paragraphs[1]).toContain('Redaktionelle Alltagsbeispiele');
    expect(lesson('community-speech').paragraphs[1]).toContain('Redaktionelle Anwendung');
  });
});
