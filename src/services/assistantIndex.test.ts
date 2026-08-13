import { describe, expect, it } from 'vitest';
import { answerFromApp, isRulingQuestion, searchContent } from './assistantIndex';

describe('ruling questions', () => {
  it.each([
    'Darf ich während des Fastens Zähne putzen?',
    'Ist das erlaubt im Islam?',
    'Muss ich das Gebet nachholen?',
    'Ist mein Gebet gültig, wenn ich mich verspreche?',
    'Ist das haram?',
    'Was soll ich tun, mein Problem ist kompliziert',
  ])('turns away: %s', (question) => {
    expect(isRulingQuestion(question)).toBe(true);
    expect(answerFromApp(question).kind).toBe('declined');
  });

  it.each([
    'Was bedeutet Tawhid?',
    'Erkläre die Bedeutung von Sure Al-Ikhlas',
    'Wie läuft das Gebet ab?',
    'Wer war Ibrahim?',
  ])('still answers: %s', (question) => {
    expect(isRulingQuestion(question)).toBe(false);
  });

  it('declines before searching, so a ruling question never gets a topical answer', () => {
    // Without the ordering this matches Ramadan content and reads as an answer
    // to a question about what is permitted.
    const reply = answerFromApp('Darf ich im Ramadan Wasser trinken?');
    expect(reply.kind).toBe('declined');
    expect(reply.text).toContain('antworte ich bewusst nicht');
  });
});

describe('answering from the app', () => {
  it('finds an entry that exists and names where it lives', () => {
    const hits = searchContent('Was bedeutet Tawhid?');
    expect(hits.length).toBeGreaterThan(0);
    expect(hits[0].area).toContain('Islam verstehen');
  });

  it('returns nothing rather than a weak match', () => {
    expect(searchContent('Bundesliga Tabelle Spieltag')).toEqual([]);
    expect(answerFromApp('Bundesliga Tabelle Spieltag').kind).toBe('none');
  });

  it('refuses to answer from an empty question', () => {
    expect(searchContent('   ')).toEqual([]);
  });

  it('carries the source through when the entry has one', () => {
    const hits = searchContent('Absicht der Taten');
    const withSource = hits.find((hit) => hit.source);
    expect(withSource?.source).toBeTruthy();
  });
});
