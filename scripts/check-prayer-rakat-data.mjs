/**
 * The prayer sequence has to stay complete, and it has to stay a *sequence*.
 *
 * What this guards against is the state it replaced: seven generic positions,
 * the same for all five prayers, with no wording. A silent edit back to that —
 * dropping the Arabic, or collapsing the Rakʿah into one list — would leave a
 * screen that still looks like a course but can no longer teach the prayer.
 */
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const source = await readFile(resolve(root, 'src/data/prayerRakatData.ts'), 'utf8');
const screen = await readFile(resolve(root, 'src/screens/PrayerLearningScreen.tsx'), 'utf8');

// Rakʿah counts are fixed for the obligatory prayers. The builders take extra
// arguments (recitation), so match the call rather than an exact string.
const expectedRakats = { fajr: 2, dhuhr: 4, asr: 4, maghrib: 3, isha: 4 };
for (const [id, count] of Object.entries(expectedRakats)) {
  const builder = count === 2 ? 'twoRakatPrayer' : count === 3 ? 'threeRakatPrayer' : 'fourRakatPrayer';
  if (!new RegExp(`${builder}\\('${id}'[,)]`).test(source)) {
    throw new Error(`${id} is not built as a ${count}-Rakʿah prayer.`);
  }
}

// Recitation is aloud in Fajr and in the opening units of Maghrib and Isha,
// silent in Dhuhr and Asr — the first thing anyone notices when praying, and
// wrong values here teach the wrong habit.
for (const [id, expected] of [['dhuhr', 'silent'], ['asr', 'silent'], ['isha', 'aloud']]) {
  if (!new RegExp(`RakatPrayer\\('${id}', '${expected}'\\)`).test(source)) {
    throw new Error(`${id} no longer opens with "${expected}" recitation.`);
  }
}
if (!/rakatOne\('aloud'\)/.test(source)) {
  throw new Error('Fajr must recite aloud in its first Rakʿah.');
}
if (!/recitation: 'silent'/.test(source)) {
  throw new Error('The third and fourth Rakʿah must be marked as recited silently.');
}

// Every step a worshipper speaks must carry all three: the Arabic, how to say
// it, and what it means. Two of the three is how you get a screen that shows
// Arabic nobody can read, or a translation nobody can recite.
const steps = [...source.matchAll(/const ([A-Z_0-9]+): RakatStep = \{([\s\S]*?)\n\};/g)];
if (steps.length < 12) throw new Error(`Expected at least 12 prayer steps, found ${steps.length}.`);

const byName = new Map(steps.map(([, name, body]) => [name, body]));

/** A step written as `{ ...SUJUD, ... }` inherits everything it does not restate. */
const resolved = (name) => {
  const body = byName.get(name) ?? '';
  const spread = /\.\.\.([A-Z_0-9]+),/.exec(body);
  return spread ? `${resolved(spread[1])}\n${body}` : body;
};

for (const [, name] of steps) {
  const body = resolved(name);
  if (!/title: '/.test(body)) throw new Error(`Prayer step ${name} has no title.`);
  if (!/description: '/.test(body)) throw new Error(`Prayer step ${name} has no description.`);
  if (!/posture: '/.test(body)) throw new Error(`Prayer step ${name} has no posture.`);
  if (!/arabic: '/.test(body)) continue;
  if (!/transliteration: '/.test(body)) throw new Error(`Prayer step ${name} has Arabic but no transliteration.`);
  if (!/translation: '/.test(body)) throw new Error(`Prayer step ${name} has Arabic but no German meaning.`);
  // How often it is spoken belongs to the step, not to a sentence inside the
  // description. Written only as prose („Sage dreimal“) it disappeared from the
  // step list — the view people actually practise from.
  if (!/repetitions: \d/.test(body)) throw new Error(`Prayer step ${name} has wording but does not say how often it is spoken.`);
}

// The steps that make a Rakʿah a Rakʿah, and the ones that only close a prayer.
for (const required of ['TAKBIR', 'FATIHA', 'RUKU', 'SUJUD', 'SITTING_SUJUD', 'TASHAHHUD', 'SALAWAT', 'TASLIM']) {
  if (!source.includes(`const ${required}: RakatStep`)) {
    throw new Error(`The prayer sequence is missing a required step: ${required}`);
  }
}

// Only the first Rakʿah opens the prayer; only the last one closes it.
if (!/rakatOne[\s\S]*?steps: \[TAKBIR, SANA/.test(source)) {
  throw new Error('The opening Takbir and Sana must belong to the first Rakʿah only.');
}
if (!/closingSteps = \[TASHAHHUD, SALAWAT, DUA_BEFORE_SALAM, TASLIM\]/.test(source)) {
  throw new Error('The closing sequence must end with Tashahhud, Salawat, Dua and Taslim.');
}

// What is spoken three times is shown three times. A single paragraph under a
// "3×" badge states the number but leaves the person practising to count in
// their head; the runs are what they read along with.
if (!/reference-rakah-runs/.test(screen) || !/repetitionRuns/.test(screen)) {
  throw new Error('The step detail no longer repeats the wording once per spoken run.');
}
// Each run carries the transliteration too. Someone learning the prayer reads
// from the transliteration, so printing it once under three Arabic lines would
// withhold the repetition from the very line being read.
if (!/reference-rakah-runs[\s\S]{0,700}reference-rakah-wording__transliteration/.test(screen)) {
  throw new Error('The repeated runs must show the transliteration, not only the Arabic.');
}
if (!/repetitionLabels: \['nach rechts', 'nach links'\]/.test(source)) {
  throw new Error('The two Taslim runs must stay labelled by direction, not just counted.');
}

// Der Durchlauf ist der Grund, warum der Kurs beim Üben freie Hände lässt.
// Er muss dabei denselben Weg nehmen wie das Weitertippen — sonst läuft er an
// der Rakʿah-Grenze anders als der Ablauf, den er vorführen soll.
if (!/reference-rakah-run/.test(screen) || !/runMode/.test(screen)) {
  throw new Error('The prayer course no longer offers a guided run.');
}
if (!/onFinished=\{runMode \? goToNextStep : undefined\}/.test(screen)) {
  throw new Error('The guided run must advance through goToNextStep, like tapping does.');
}
// Was dreimal gesprochen wird, klingt im Durchlauf dreimal — sonst widerspricht
// der Ton den drei Zeilen, die daneben stehen.
if (!/recitationUrlsForRun/.test(source) || !/recitationUrlsForRun/.test(screen)) {
  throw new Error('The guided run no longer repeats a recitation as often as the step is spoken.');
}

// The screen has to render the wording, not just hold the data.
for (const fragment of [
  'reference-rakah-wording__arabic',
  'reference-rakah-wording__transliteration',
  'reference-rakah-wording__translation',
  'POSTURE_LABEL',
]) {
  if (!screen.includes(fragment)) {
    throw new Error(`The prayer course no longer renders the wording: ${fragment}`);
  }
}

const postures = new Set([...source.matchAll(/posture: '([a-z]+)'/g)].map((match) => match[1]));
const labelled = new Set([...screen.matchAll(/^\s{2}([a-z]+): '/gm)].map((match) => match[1]));
for (const posture of postures) {
  if (!labelled.has(posture)) throw new Error(`Posture "${posture}" has no readable label on the screen.`);
}

console.log(`Prayer sequence verified: ${steps.length} steps, all spoken ones carry Arabic, transliteration and German meaning; Fajr 2, Maghrib 3, Dhuhr/Asr/Isha 4 Rakʿah, opening and closing in their own units, and the screen renders all three forms.`);
