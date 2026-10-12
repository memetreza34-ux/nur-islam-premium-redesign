import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { PRAYER_RAKATS, RECITATION_HINT, recitationCredit, recitationUrls } from './prayerRakatData';
import { MADHHAB_DISCLAIMER } from './madhhabData';

const allSteps = PRAYER_RAKATS.flatMap((prayer) => prayer.rakats.flatMap((rakat) => [...rakat.steps]));
const byId = new Map(allSteps.map((step) => [step.id, step]));

describe('Quellen und Grenzen der erneut abgeglichenen Gebetsschritte', () => {
  it('führt jede Laufzeit-Schrittvariante mit tatsächlichen Texten und Quellen in der Prüfmappe', () => {
    const map = readFileSync(resolve(process.cwd(), 'docs/INHALTE-PRUEFUNG.md'), 'utf8');
    const section = map.split('## Gebetsablauf (Rakʿah)')[1]?.split('\n## ')[0];
    expect(section).toBeTruthy();
    expect(byId.size).toBe(17);
    for (const step of byId.values()) {
      expect(section).toContain(`${step.id} — ${step.title}`);
      expect(section).toContain(step.description);
      expect(section).toContain(step.source);
    }
    expect(section).toContain('Stehe nach dem Tashahhud wieder auf und sage dabei:');
    expect(section).not.toContain('Wortlaut ohne Belegstelle');
  });

  it('nennt konkrete Fundstellen und trennt Bewertungsbezüge', () => {
    expect(byId.get('takbir')?.source).toContain('Sahih al-Bukhari 738');
    expect(byId.get('sana')?.source).toContain('Jami at-Tirmidhi 243');
    expect(byId.get('sana')?.source).toContain('Hasan (Darussalam)');
    expect(byId.get('sana')?.source).toContain('At-Tirmidhi erwähnt Kritik');
    for (const id of ['rising-ruku', 'rise-to-next-rakah', 'rise-after-tashahhud']) expect(byId.get(id)?.source).toContain('789');
    expect(byId.get('sitting-sujud')?.source).toContain('Sunan Ibn Majah 897');
    expect(byId.get('sitting-sujud')?.source).toContain('Sahih (Darussalam)');
  });

  it('behält die Dreier-Lernfolge ohne universelle Pflicht-/Mindestzahlbehauptung', () => {
    for (const id of ['ruku', 'sujud', 'sujud-second']) {
      const step = byId.get(id)!;
      expect(step.repetitions).toBe(3);
      expect(step.source).toContain('Jami at-Tirmidhi 262');
      expect(step.repetitionNote).toContain('keine feste Anzahl');
      expect(step.repetitionNote).not.toContain('einmal genügt');
    }
    expect(byId.get('ruku')?.translation).toBe('Preis sei meinem Herrn, dem Gewaltigen.');
  });

  it('belegt die Schlussformeln und macht das Zufluchtsgebet nicht pauschal optional', () => {
    expect(byId.get('tashahhud')?.source).toContain('1170');
    expect(byId.get('salawat')?.source).toContain('3370');
    expect(byId.get('taslim')?.source).toContain('1320');
    const dua = byId.get('dua-before-salam')!;
    expect(dua.source).toContain('588a');
    expect(dua.title).not.toContain('optional');
    expect(dua.repetitionNote).not.toContain('Freiwillig');
    expect(dua.description).toContain('vier Dingen');
    expect(dua.arabic).toContain('مِنْ شَرِّ');
  });

  it('trennt Quran-Wortlaut von Amin und universellen Schulregeln', () => {
    const fatiha = byId.get('fatiha')!;
    expect(fatiha.source).toContain('1:2–7');
    expect(fatiha.source).toContain('780');
    expect(fatiha.description).toContain('nach Rechtsschule');
    expect(fatiha.description).not.toContain('muss in jeder');
    expect(fatiha.repetitionNote).toContain('kein Vers der Sure');
    expect(fatiha.arabic).not.toContain('آمين');
    expect(byId.get('ta-awwudh-basmalah')?.source).toContain('kein wörtliches Verszitat');
    expect(byId.get('ta-awwudh-basmalah')?.repetitionNote).toContain('andere Auffassungen');
    expect(byId.get('short-surah')?.translation).toContain('der niemanden benötigt');
    for (const hint of Object.values(RECITATION_HINT)) expect(hint).toContain('nach Rechtsschule');
    expect(MADHHAB_DISCLAIMER).not.toContain('nicht die Gültigkeit');
    expect(MADHHAB_DISCLAIMER).toContain('keine pauschale Gültigkeitszusage');
  });

  it('gleicht die Quran-Schritte mit dem lokalen Bestand ab, ohne Schriftvarianten als Textfehler zu zählen', () => {
    const consonants = (text: string) => text.normalize('NFC').replace(/[\u0671\u0622]/gu, 'ا').replace(/\u0670/gu, 'ا')
      .replace(/[\u0610-\u061a\u064b-\u065f\u06d6-\u06ed\u0640\ufeff]/gu, '').replace(/\s+/gu, ' ').trim();
    const surah = (number: number): { ayahs: { numberInSurah: number; text: string }[] } =>
      JSON.parse(readFileSync(resolve(process.cwd(), `public/data/quran/ar/${number}.json`), 'utf8'));
    const first = surah(1).ayahs;
    expect(consonants(byId.get('basmalah')!.arabic!)).toBe(consonants(first[0].text));
    expect(consonants(byId.get('fatiha')!.arabic!)).toBe(consonants(first.slice(1).map(ayah => ayah.text).join(' ')));
    const ikhlas = surah(112).ayahs.map(ayah => ayah.text);
    ikhlas[0] = ikhlas[0].replace(/^بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ /u, '');
    expect(consonants(byId.get('short-surah')!.arabic!)).toBe(consonants(ikhlas.join(' ')));
  });
});

describe('Rezitation der Gebetsschritte', () => {
  it('bietet Audio ausschließlich für Quran-Verse an', () => {
    for (const step of allSteps) {
      if (step.audioAyahs) expect(recitationUrls(step)).not.toHaveLength(0);
      else expect(recitationUrls(step)).toEqual([]);
    }
  });

  it('nennt zu jeder Aufnahme, wer sie spricht', () => {
    for (const step of allSteps) {
      if (recitationUrls(step).length === 0) {
        expect(recitationCredit(step)).toBeNull();
      } else {
        expect(recitationCredit(step)).toBeTruthy();
      }
    }
  });

  it('spielt die Koran-Schritte Vers für Vers in Reihenfolge', () => {
    const fatiha = byId.get('fatiha');
    expect(recitationUrls(fatiha!)).toEqual([
      'https://cdn.islamic.network/quran/audio/128/ar.alafasy/2.mp3',
      'https://cdn.islamic.network/quran/audio/128/ar.alafasy/3.mp3',
      'https://cdn.islamic.network/quran/audio/128/ar.alafasy/4.mp3',
      'https://cdn.islamic.network/quran/audio/128/ar.alafasy/5.mp3',
      'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6.mp3',
      'https://cdn.islamic.network/quran/audio/128/ar.alafasy/7.mp3',
    ]);
  });
});
