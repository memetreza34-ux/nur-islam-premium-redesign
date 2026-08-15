/**
 * Hält die Zuordnung von Aufnahme zu Wortlaut fest.
 *
 * Die Aufnahmen der überlieferten Formeln heißen bei der Quelle nur `33.mp3`
 * und `41.mp3`. Welche welche ist, wurde nicht nach Gehör entschieden, sondern
 * über den arabischen Text, den dieselbe Quelle zu jeder Datei ausliefert
 * (`hisnmuslim.com/api/ar/<Kapitel>.json`, Feld `ARABIC_TEXT`).
 *
 * Dieser Test schreibt das Ergebnis dieses Abgleichs fest: Nummer, erwarteter
 * Textkern und die im Datensatz gefundene Wiederholungszahl. Eine vertauschte
 * URL fällt damit auf, ohne dass jemand die Datei anhören muss — beim Tasbih im
 * Sujud die Aufnahme des Ruku zu verlinken wäre sonst nicht zu bemerken.
 *
 * Bewusst ohne Netzzugriff: der Test prüft die Zuordnung im Datensatz, nicht die
 * Erreichbarkeit fremder Server. Für den Abgleich mit der Quelle gibt es
 * `npm run recitation:verify`.
 */
import { describe, expect, it } from 'vitest';
import { PRAYER_RAKATS, recitationCredit, recitationUrls } from './prayerRakatData';

/** Datei-Nummer bei der Quelle → Kern des Wortlauts, den sie enthält. */
const EXPECTED_RECITATIONS: Record<string, { file: string; contains: string }> = {
  sana: { file: '28', contains: 'سُبْحَانَكَ اللَّهُمَّ' },
  ruku: { file: '33', contains: 'سُبْحَانَ رَبِّيَ الْعَظِيمِ' },
  sujud: { file: '41', contains: 'سُبْحَانَ رَبِّيَ الْأَعْلَى' },
  'sujud-second': { file: '41', contains: 'سُبْحَانَ رَبِّيَ الْأَعْلَى' },
  'sitting-sujud': { file: '48', contains: 'رَبِّ اغْفِرْ لِي' },
  tashahhud: { file: '52', contains: 'التَّحِيَّاتُ لِلَّهِ' },
  salawat: { file: '53', contains: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ' },
};

/** Schritte, die absichtlich stumm bleiben, mit dem Grund. */
const DELIBERATELY_SILENT = new Set([
  'takbir',
  'rising-ruku',
  'rise-to-next-rakah',
  'rise-after-tashahhud',
  'ta-awwudh-basmalah',
  'dua-before-salam',
  'taslim',
]);

const allSteps = PRAYER_RAKATS.flatMap((prayer) => prayer.rakats.flatMap((rakat) => [...rakat.steps]));
const byId = new Map(allSteps.map((step) => [step.id, step]));

describe('Rezitation der Gebetsschritte', () => {
  it('verlinkt jede Aufnahme mit dem Wortlaut, den sie enthält', () => {
    for (const [id, expected] of Object.entries(EXPECTED_RECITATIONS)) {
      const step = byId.get(id);
      expect(step, `Schritt ${id} fehlt`).toBeDefined();
      expect(step?.audioUrl, `Schritt ${id} hat keine Aufnahme`).toBe(
        `https://www.hisnmuslim.com/audio/ar/${expected.file}.mp3`,
      );
      // Der Wortlaut im Datensatz muss das enthalten, was in der Aufnahme
      // gesprochen wird — sonst hört man etwas anderes, als man liest.
      expect(step?.arabic, `Wortlaut von ${id} passt nicht zur Aufnahme ${expected.file}.mp3`)
        .toContain(expected.contains);
    }
  });

  it('lässt genau die Schritte stumm, für die es keine passende Aufnahme gibt', () => {
    const spoken = allSteps.filter((step) => step.arabic);
    const silent = spoken.filter((step) => recitationUrls(step).length === 0);
    expect(new Set(silent.map((step) => step.id))).toEqual(DELIBERATELY_SILENT);
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
