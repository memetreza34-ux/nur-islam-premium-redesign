import { describe, expect, it } from 'vitest';
import { SAHABAH, WOMEN_IN_ISLAM } from './companionData';

describe('Women short-entry evidence boundaries', () => {
  it('retains both distinct collections and stable ids', () => {
    expect(SAHABAH).toHaveLength(15);
    expect(WOMEN_IN_ISLAM).toHaveLength(10);
    expect(new Set([...SAHABAH, ...WOMEN_IN_ISLAM].map(entry => entry.id)).size).toBe(25);
    expect(WOMEN_IN_ISLAM.map(entry => entry.id)).toEqual([
      'khadija-bint-khuwaylid', 'aisha-bint-abi-bakr', 'fatima-az-zahra', 'maryam-maria', 'asiya',
      'hajar', 'sarah', 'sumayyah-bint-khayyat', 'zaynab-bint-ali', 'umm-salama',
    ]);
  });

  it.each(WOMEN_IN_ISLAM)('$id has directly openable evidence without claiming human approval', entry => {
    expect(entry.sources.length).toBeGreaterThan(0);
    for (const source of entry.sources) {
      expect(source.label).not.toBe('');
      const url = new URL(source.url);
      expect(url.protocol).toBe('https:');
      expect(['quran.com', 'sunnah.com', 'islamansiklopedisi.org.tr', 'dorar.net']).toContain(url.hostname);
    }
    expect(entry).not.toHaveProperty('approved');
    expect(entry).not.toHaveProperty('status', 'approved');
  });

  it('does not represent Asiya and Sarah as names present in the cited Quran passages', () => {
    for (const id of ['asiya', 'sarah']) {
      const entry = WOMEN_IN_ISLAM.find(item => item.id === id)!;
      expect(entry.sourceNote).toMatch(/nicht .*Namen|nicht den Namen/);
      expect(entry.sources.some(source => source.url.startsWith('https://quran.com/'))).toBe(true);
      expect(entry.sources.some(source => !source.url.startsWith('https://quran.com/'))).toBe(true);
    }
  });

  it('keeps historical transmission limits and grading attribution visible', () => {
    const sumayyah = WOMEN_IN_ISLAM.find(entry => entry.id === 'sumayyah-bint-khayyat')!;
    expect(sumayyah.note).toContain('Geschichtsschreibung');
    expect(sumayyah.sourceNote).toContain('kein wortgleiches Prophetenzitat');
    expect(sumayyah.sourceNote).toContain('mursal von Shuayb al-Arnaut');
    const aisha = WOMEN_IN_ISLAM.find(entry => entry.id === 'aisha-bint-abi-bakr')!;
    expect(aisha.sourceNote).toContain('Hasan nach Darussalam');
    expect(aisha.sourceNote).toContain('at-Tirmidhi');
    expect(WOMEN_IN_ISLAM.find(entry => entry.id === 'zaynab-bint-ali')!.note).toContain('historischen Berichten');
  });
});

describe('Companion short-entry evidence boundaries', () => {
  it.each(SAHABAH)('$id keeps its role and openable evidence without a human approval', entry => {
    expect(entry.name).not.toBe('');
    expect(entry.role).not.toBe('');
    expect(entry.sources.length).toBeGreaterThan(0);
    for (const source of entry.sources) {
      const url = new URL(source.url);
      expect(url.protocol).toBe('https:');
      expect(['sunnah.com', 'islamansiklopedisi.org.tr']).toContain(url.hostname);
      expect(source.label).not.toBe('');
    }
    expect(entry).not.toHaveProperty('status', 'approved');
  });

  it('retains the exact companion ids and chronological caliphate roles without implying unanimous succession theology', () => {
    expect(SAHABAH.map(entry => entry.id)).toEqual([
      'abu-bakr-as-siddiq', 'umar-ibn-al-khattab', 'uthman-ibn-affan', 'ali-ibn-abi-talib',
      'khalid-ibn-al-walid', 'hamza-ibn-abd-al-muttalib', 'bilal-ibn-rabah', 'zayd-ibn-thabit',
      'abu-ubaidah-ibn-al-jarrah', 'talha-ibn-ubaidullah', 'az-zubair-ibn-al-awwam',
      'abdurrahman-ibn-auf', 'sa-d-ibn-abi-waqqas', 'said-ibn-zayd', 'mus-ab-ibn-umair',
    ]);
    expect(SAHABAH.slice(0, 4).map(entry => entry.role)).toEqual(['Erster Kalif', 'Zweiter Kalif', 'Dritter Kalif', 'Vierter Kalif']);
    for (const entry of SAHABAH.slice(0, 4)) {
      expect(entry.sourceNote).toContain('Chronologische Amtsfolge');
      expect(entry.sourceNote).toContain('sunnitischen und schiitischen');
    }
  });

  it('attributes the paradise report to its collection and named grading edition', () => {
    const entries = SAHABAH.filter(entry => entry.sources.some(source => source.url === 'https://sunnah.com/tirmidhi:3747'));
    expect(entries).toHaveLength(6);
    for (const entry of entries) {
      expect(`${entry.honorific} ${entry.role}`).toContain('mit dem Paradies Verheißenen');
      expect(entry.sourceNote).toContain('Sahih nach Darussalam');
      expect(entry.sourceNote).toContain('sunnitischer Hadithüberlieferung');
    }
  });

  it('keeps Saʿd’s own statement and Arab-specific scope instead of an unrestricted first-ever claim', () => {
    const entry = SAHABAH.find(item => item.id === 'sa-d-ibn-abi-waqqas')!;
    expect(entry.honorific).toContain('Nach eigener Überlieferung');
    expect(entry.honorific).toContain('erste Araber');
    expect(entry.sources.some(source => source.url === 'https://sunnah.com/bukhari:3728')).toBe(true);
  });

  it('does not turn historic nicknames or teaching appointments into exact prophet quotations', () => {
    expect(SAHABAH.find(entry => entry.id === 'umar-ibn-al-khattab')!.sourceNote).toContain('unterschiedlich berichtet');
    expect(SAHABAH.find(entry => entry.id === 'ali-ibn-abi-talib')!.sourceNote).toContain('kein wortgleiches Prophetenzitat');
    expect(SAHABAH.find(entry => entry.id === 'hamza-ibn-abd-al-muttalib')!.sourceNote).toContain('kein wörtliches Prophetenzitat');
    const musab = SAHABAH.find(entry => entry.id === 'mus-ab-ibn-umair')!;
    expect(musab.honorific).toBe('Als Lehrer nach Medina gesandt');
    expect(musab.sourceNote).toContain('keine allgemeine diplomatische Rangbehauptung');
  });
});
