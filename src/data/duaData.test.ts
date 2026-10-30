import { expect, it } from 'vitest';
import { DUAS, DUA_BY_ID, DUA_CATEGORIES, getDuaShareText } from './duaData';

const dua = (id: string) => DUA_BY_ID.get(id)!;

it('keeps all 34 existing IDs, categories and individually linked sources', () => {
  expect(DUAS).toHaveLength(34);
  expect(DUA_BY_ID.size).toBe(34);
  expect(DUA_CATEGORIES).toHaveLength(13);
  for (const entry of DUAS) {
    expect(DUA_CATEGORIES.some(category => category.id === entry.categoryId)).toBe(true);
    expect(entry.sourceUrl).toMatch(/^https:\/\/(sunnah\.com|quran\.com)\//);
    expect(entry.arabic).toMatch(/[\u0600-\u06ff]/);
  }
});

it('keeps the selected sleep wording and links the variant that actually contains Allahumma', () => {
  expect(dua('dua_sleep_1').arabic).toContain('اللَّهُمَّ');
  expect(dua('dua_sleep_1').sourceUrl).toBe('https://sunnah.com/bukhari:6324');
  expect(dua('dua_wake_1').sourceUrl).toBe('https://sunnah.com/bukhari:6312');
});

it('does not replace Al-Azim with Almighty or omit the patient from heal him', () => {
  expect(dua('dua_distress_2').translation).toContain('Gewaltigen');
  expect(dua('dua_distress_2').translation).not.toContain('Allmächtigen');
  expect(dua('dua_healing_1').translation).toContain('Heile ihn');
  expect(dua('dua_healing_1').sourceNote).toContain('nicht wortgleiche');
});

it.each([
  ['dua_guidance_1', 'muslim:2721a'],
  ['dua_provision_1', 'muslim:2697b'],
  ['dua_mosque_enter', 'muslim:713a'],
  ['dua_mosque_leave', 'muslim:713a'],
  ['dua_hardship_1', 'muslim:918b'],
])('preserves the researched exact reference for %s', (id, reference) => {
  expect(dua(id).sourceUrl).toBe(`https://sunnah.com/${reference}`);
});

it.each([
  'dua_morning_3', 'dua_forgiveness_1', 'dua_success_1',
  'dua_parents_1', 'dua_family_1', 'dua_travel', 'dua_patience_1',
])('labels the shortened source text of %s as an excerpt', id => {
  expect(dua(id).sourceNote).toContain('Auszug');
});

it('keeps three and seven repetitions outside the text that is recited or copied', () => {
  const entry = dua('dua_pain_1');
  expect(entry.arabic).not.toMatch(/\(|\)|\.\.\.|ثلاث|سبع/);
  expect(entry.sourceNote).toContain('dreimal');
  expect(entry.sourceNote).toContain('siebenmal');
  expect(entry.transliteration).not.toMatch(/dreimal|siebenmal/);
});

it('does not silently turn a descriptive Hadith into an exact standalone quotation', () => {
  expect(dua('dua_forgiveness_3').sourceNote).toContain('kein vollständiges wörtliches Hadithzitat');
});

it('keeps different attributed grading and comparative sources visible', () => {
  expect(dua('dua_morning_2').sourceNote).toContain('Sahih nach al-Albani');
  expect(dua('dua_morning_2').sourceNote).toContain('Hasan nach Darussalam');
  expect(dua('dua_mercy_5').sourceNote).toContain('https://binwahaf.com/ar/audio-book-lesson/1128/');
});

it.each(DUAS)('sharing retains meaning, precise source and contextual limits of $id', entry => {
  const text = getDuaShareText(entry);
  expect(text).toContain(entry.arabic);
  expect(text).toContain(`Sinngemäße Bedeutung: ${entry.translation}`);
  expect(text).toContain(entry.source);
  expect(text).toContain(entry.sourceUrl);
  if (entry.sourceNote) expect(text).toContain(`Einordnung: ${entry.sourceNote}`);
});
