/**
 * Wo die vier sunnitischen Rechtsschulen im Gebet auseinandergehen.
 *
 * Der Kurs wies bisher nur pauschal darauf hin, dass „einzelne Details sich je
 * nach Rechtsschule unterscheiden“. Das ist wahr und hilft niemandem: wer neben
 * jemandem betet, der die Hände anders hält oder das Amin laut spricht, bleibt
 * mit der Frage allein, ob einer von beiden etwas falsch macht. Diese Datei
 * benennt die Stellen, an denen der Unterschied auftritt.
 *
 * Bewusst beschreibend, nicht vorschreibend: es steht hier, wie in einer Schule
 * überwiegend praktiziert wird, nicht was jemand tun soll. Der Rest der App
 * hält es genauso — der Hajj-Ablauf etwa beschreibt die Abfolge, ohne Urteile
 * zu fällen.
 *
 * Innerhalb jeder Schule gibt es zu manchen Punkten mehr als eine überlieferte
 * Position; wo das die Praxis sichtbar prägt, steht es dabei. Die Einträge sind
 * eine Übersicht und stehen als solche auf der Prüfliste
 * (`npm run review:write`). Für die eigene Praxis bleibt eine qualifizierte
 * Lehrperson maßgeblich, und der Bildschirm sagt das auch.
 */

export type MadhhabId = 'hanafi' | 'maliki' | 'shafii' | 'hanbali';

export const MADHHABS: readonly { id: MadhhabId; name: string }[] = [
  { id: 'hanafi', name: 'Hanafi' },
  { id: 'maliki', name: 'Maliki' },
  { id: 'shafii', name: 'Shafiʿi' },
  { id: 'hanbali', name: 'Hanbali' },
];

export type MadhhabDifference = {
  /** Der Schritt aus `prayerRakatData`, an dem der Unterschied auftritt. */
  stepId: string;
  /** Die Frage, die die vier Antworten beantworten. */
  question: string;
  positions: Record<MadhhabId, string>;
  source: string;
  sourceUrl: string;
};

export const MADHHAB_DIFFERENCES: readonly MadhhabDifference[] = [
  {
    stepId: 'takbir',
    question: 'Wie hoch werden die Hände beim Takbir gehoben?',
    positions: { hanafi: 'Männer bis Ohrhöhe, Frauen bis Schulterhöhe.', maliki: 'Für Männer wird Schulterhöhe beschrieben.', shafii: 'Für Männer wird Schulterhöhe beschrieben.', hanbali: 'Für Männer Schulter- oder Ohrhöhe; beide Ausführungen werden genannt.' },
    source: 'TDV İslâm Ansiklopedisi · NAMAZ',
    sourceUrl: 'https://islamansiklopedisi.org.tr/namaz',
  },
  {
    stepId: 'takbir',
    question: 'Wo liegen die Hände danach im Stehen?',
    positions: { hanafi: 'Männer unter dem Nabel; Frauen auf der Brust, rechte Hand über der linken.', maliki: 'Sadl, also seitlich gelassene Arme, ist verbreitet. Handfalten wird je nach Gebetsart und Überlieferung eingeordnet.', shafii: 'Zwischen Brust und Nabel.', hanbali: 'Unter dem Nabel; auch eine Lage oberhalb wird überliefert.' },
    source: 'TDV İslâm Ansiklopedisi · KIYAM',
    sourceUrl: 'https://islamansiklopedisi.org.tr/kiyam',
  },
  {
    stepId: 'sana',
    question: 'Wird nach dem Takbir ein Eröffnungsbittgebet gesprochen?',
    positions: { hanafi: 'Sübhâneke ist in der beschriebenen Lernfolge üblich.', maliki: 'In der beschriebenen Pflichtgebetsfolge folgt die Rezitation ohne Eröffnungsbittgebet.', shafii: 'Ein Eröffnungsbittgebet wird empfohlen; diese Übersicht legt keine einzige Fassung fest.', hanbali: 'Ein Eröffnungsbittgebet wird empfohlen; die überlieferte Fassung ist nicht auf eine einzige Variante begrenzt.' },
    source: 'TDV İslâm Ansiklopedisi · NAMAZ',
    sourceUrl: 'https://islamansiklopedisi.org.tr/namaz',
  },
  {
    stepId: 'basmalah',
    question: 'Wird die Basmala vor Al-Fatihah gesprochen?',
    positions: { hanafi: 'Leise vor Al-Fatihah.', maliki: 'Nach der vorherrschenden Position im Pflichtgebet unterlassen; andere Überlieferungen und freiwillige Gebete unterscheiden sich.', shafii: 'Als Teil der Fatihah; in laut rezitierten Gebeten hörbar, in leisen leise.', hanbali: 'Nach der maßgeblichen Position leise vor der Rezitation.' },
    source: 'TDV İslâm Ansiklopedisi · BESMELE',
    sourceUrl: 'https://islamansiklopedisi.org.tr/besmele',
  },
  {
    stepId: 'fatiha',
    question: 'Wird „Amin“ am Ende laut oder leise gesprochen?',
    positions: {
      hanafi: 'Leise.',
      maliki: 'Der Betende spricht es leise; zur Praxis des Imams gibt es mehr als eine Überlieferung.',
      shafii: 'Laut in den laut gebeteten Gebeten.',
      hanbali: 'Laut in den laut gebeteten Gebeten.',
    },
    source: 'TDV İslâm Ansiklopedisi · AMIN',
    sourceUrl: 'https://islamansiklopedisi.org.tr/amin',
  },
  {
    stepId: 'ruku',
    question: 'Werden die Hände vor der Verbeugung noch einmal gehoben?',
    positions: {
      hanafi: 'Nein; die Hände werden nur beim Eröffnungstakbir gehoben.',
      maliki: 'Überwiegend nein; das Heben ist auf den Eröffnungstakbir beschränkt.',
      shafii: 'Ja, vor dem Ruku und beim Aufrichten daraus.',
      hanbali: 'Ja, vor dem Ruku und beim Aufrichten daraus.',
    },
    source: 'TDV İslâm Ansiklopedisi · TEKBIR',
    sourceUrl: 'https://islamansiklopedisi.org.tr/tekbir',
  },
  {
    stepId: 'rising-ruku',
    question: 'Gehört ein Qunut-Bittgebet zum Fajr-Gebet?',
    positions: { hanafi: 'Kein regelmäßiges Fajr-Qunut; Qunut bei Notlagen wird gesondert behandelt. Witr hat eigene Regeln.', maliki: 'Empfohlen im Pflicht-Fajr, normalerweise vor dem Ruku der zweiten Einheit; bei Vergessen ist auch danach möglich.', shafii: 'Regelmäßig im Fajr nach dem Aufrichten aus dem Ruku der zweiten Einheit.', hanbali: 'Kein regelmäßiges Fajr-Qunut; Notlagen und Witr sind gesonderte Fälle.' },
    source: 'Dar al-Ifta Ägypten · Fatwa 6532, Qunut im Fajr; malikitische Einordnung bei SeekersGuidance',
    sourceUrl: 'https://www.dar-alifta.org/en/fatwa/details/6532/what-is-the-ruling-for-making-qunūt-in-dawn-prayers',
  },
  {
    stepId: 'tashahhud',
    question: 'Wie wird im letzten Sitzen gesessen?',
    positions: { hanafi: 'Männer Iftirash in beiden Sitzen; Frauen Tawarruk.', maliki: 'Tawarruk in beiden Sitzen.', shafii: 'Im ersten Sitzen Iftirash, im abschließenden Tawarruk.', hanbali: 'Iftirash und Tawarruk werden je nach Gebetsart unterschieden. Für Frauen werden auch andere Sitzweisen beschrieben; hier keine pauschale Regel für jedes letzte Sitzen.' },
    source: 'TDV İslâm Ansiklopedisi · KADE',
    sourceUrl: 'https://islamansiklopedisi.org.tr/kade',
  },
];

/** Schritt-ID → die Fragen, die an dieser Stelle auseinandergehen. */
export const MADHHAB_DIFFERENCES_BY_STEP = MADHHAB_DIFFERENCES.reduce((map, difference) => {
  const existing = map.get(difference.stepId);
  if (existing) existing.push(difference); else map.set(difference.stepId, [difference]);
  return map;
}, new Map<string, MadhhabDifference[]>());

/**
 * Was der Bildschirm über diesen Abschnitt sagt. Steht hier, damit die
 * Einordnung nicht von der Sache getrennt gepflegt wird.
 */
export const MADHHAB_DISCLAIMER =
  'Übersicht der überwiegenden Praxis in den vier sunnitischen Rechtsschulen, nicht abschließend und keine Rechtsauskunft. Die Schulen können Handlungen unterschiedlich einordnen; daraus folgt keine pauschale Gültigkeitszusage für jede Ausführung. Für die eigene Praxis sind die Regeln der zugrunde gelegten Rechtsschule maßgeblich.';
