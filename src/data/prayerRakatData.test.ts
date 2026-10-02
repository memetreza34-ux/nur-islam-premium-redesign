import { describe, expect, it } from 'vitest';
import { PRAYER_RAKATS, recitationCredit, recitationUrls } from './prayerRakatData';

const allSteps = PRAYER_RAKATS.flatMap((prayer) => prayer.rakats.flatMap((rakat) => [...rakat.steps]));
const byId = new Map(allSteps.map((step) => [step.id, step]));

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
