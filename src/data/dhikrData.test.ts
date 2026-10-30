import { expect, it } from 'vitest';
import { DHIKR_ROUTINES } from './dhikrData';

it('retains all seven routines and eighteen distinct items with an exact source URL', () => {
  expect(DHIKR_ROUTINES).toHaveLength(7);
  const items = DHIKR_ROUTINES.flatMap(routine => routine.items);
  expect(items).toHaveLength(18);
  expect(new Set(items.map(item => item.id)).size).toBe(18);
  for (const routine of DHIKR_ROUTINES) for (const item of routine.items) {
    expect(item.itemSourceUrl ?? routine.sourceUrl).toMatch(/^https:\/\/(sunnah\.com|quran\.com)\//);
    expect(item.arabic).toMatch(/[\u0600-\u06ff]/);
    expect(item.meaning.length).toBeGreaterThan(10);
    expect(item.transliteration ?? item.latin).not.toMatch(/…|\.\.\./);
  }
});

it('keeps source-backed counts separate from personal counter targets', () => {
  const byId = (id: string) => DHIKR_ROUTINES.find(routine => routine.id === id)!;
  expect(byId('after-prayer').items.map(item => item.target)).toEqual([33, 33, 33, 1]);
  expect(byId('morning-weighted').items.map(item => item.target)).toEqual([3]);
  expect(byId('before-sleep').items.map(item => item.target)).toEqual([33, 33, 33]);
  expect(byId('before-sleep').note).toContain('34 Tasbih');
  expect(byId('evening').items.map(item => item.target)).toEqual([1, 3, 100, 10]);
  expect(byId('evening').note).toContain('nicht speziell an den Abend gebunden');
  expect(byId('istighfar').note).toContain('persönliche Merkhilfen');
  expect(byId('salawat').note).toContain('frei gewählte Zählerwerte');
  expect(byId('free-counter').note).toContain('keine religiöse Vorgabe');
});

it('includes the end of each formerly abbreviated long reading aid', () => {
  const byId = (id: string) => DHIKR_ROUTINES.flatMap(routine => routine.items).find(item => item.id === id)!;
  expect(byId('tahlil-completion').transliteration).toContain('kulli shay’in qadir');
  expect(byId('tahlil-completion').meaning).toContain('keinen Partner');
  expect(byId('creation-praise').transliteration).toContain('midada kalimatihi');
  expect(byId('evening-amsayna').transliteration).toContain('‘adhabin fil-qabr');
  expect(byId('evening-protection').transliteration).toContain('sami‘ul-‘alim');
  expect(byId('rabbighfir').transliteration).toContain('tawwabur-rahim');
});
