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
};

export const MADHHAB_DIFFERENCES: readonly MadhhabDifference[] = [
  {
    stepId: 'takbir',
    question: 'Wie hoch werden die Hände beim Takbir gehoben?',
    positions: {
      hanafi: 'Bis auf Ohrhöhe, die Daumen etwa an den Ohrläppchen.',
      maliki: 'Bis auf Schulterhöhe.',
      shafii: 'Bis auf Schulterhöhe.',
      hanbali: 'Bis auf Schulter- oder Ohrhöhe; beides ist überliefert.',
    },
  },
  {
    stepId: 'takbir',
    question: 'Wo liegen die Hände danach im Stehen?',
    positions: {
      hanafi: 'Unterhalb des Nabels, die rechte Hand auf der linken.',
      maliki: 'Verbreitet hängen die Arme locker an der Seite (Sadl); das Falten der Hände ist ebenfalls überliefert.',
      shafii: 'Zwischen Brust und Nabel.',
      hanbali: 'Unterhalb des Nabels.',
    },
  },
  {
    stepId: 'sana',
    question: 'Wird nach dem Takbir ein Eröffnungsbittgebet gesprochen?',
    positions: {
      hanafi: 'Ja, „Subhanaka Allahumma …“.',
      maliki: 'Nein; auf den Takbir folgt unmittelbar die Rezitation.',
      shafii: 'Ja, überwiegend „Wajjahtu wajhiya …“.',
      hanbali: 'Ja, „Subhanaka Allahumma …“.',
    },
  },
  {
    stepId: 'basmalah',
    question: 'Wird die Basmalah vor Al-Fatihah gesprochen?',
    positions: {
      hanafi: 'Ja, leise, in jeder Rakʿah.',
      maliki: 'Im Pflichtgebet wird sie nicht gesprochen.',
      shafii: 'Ja; sie gilt als erster Vers der Fatihah und wird in den laut gebeteten Gebeten laut gesprochen.',
      hanbali: 'Ja, leise.',
    },
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
  },
  {
    stepId: 'rising-ruku',
    question: 'Gehört ein Qunut-Bittgebet zum Fajr-Gebet?',
    positions: {
      hanafi: 'Nein; das Qunut gehört zum Witr-Gebet.',
      maliki: 'Ja, im Fajr — vor der Verbeugung der zweiten Rakʿah.',
      shafii: 'Ja, im Fajr — nach dem Aufrichten aus der Verbeugung der zweiten Rakʿah.',
      hanbali: 'Nicht regelmäßig; das Qunut ist Notlagen und dem Witr vorbehalten.',
    },
  },
  {
    stepId: 'tashahhud',
    question: 'Wie wird im letzten Sitzen gesessen?',
    positions: {
      hanafi: 'Iftirash: auf dem linken Fuß sitzend, in beiden Sitzen gleich.',
      maliki: 'Tawarruk: das Gesäß am Boden, der linke Fuß unter dem rechten Bein — in beiden Sitzen.',
      shafii: 'Iftirash im ersten Sitzen, Tawarruk im letzten.',
      hanbali: 'Iftirash im ersten Sitzen, Tawarruk im letzten.',
    },
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
  'Übersicht der überwiegenden Praxis in den vier sunnitischen Rechtsschulen, nicht abschließend und keine Rechtsauskunft. Alle vier stehen auf demselben Boden; die Unterschiede betreffen die Ausführung, nicht die Gültigkeit. Was für dich gilt, klärst du am besten mit einer qualifizierten Lehrperson.';
