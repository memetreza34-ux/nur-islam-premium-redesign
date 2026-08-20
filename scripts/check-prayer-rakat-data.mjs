/**
 * The prayer sequence has to stay complete, sourced, and a real sequence.
 *
 * A screen that shows Arabic wording without traceable evidence can look
 * authoritative while hiding an editorial error. Spoken core steps therefore
 * need Arabic, transliteration, German meaning AND a visible source reference.
 */
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const source = await readFile(resolve(root, 'src/data/prayerRakatData.ts'), 'utf8');
const screen = await readFile(resolve(root, 'src/screens/PrayerLearningScreen.tsx'), 'utf8');

const expectedRakats = { fajr: 2, dhuhr: 4, asr: 4, maghrib: 3, isha: 4 };
for (const [id, count] of Object.entries(expectedRakats)) {
  const builder = count === 2 ? 'twoRakatPrayer' : count === 3 ? 'threeRakatPrayer' : 'fourRakatPrayer';
  if (!source.includes(`${builder}('${id}')`)) {
    throw new Error(`${id} is not built as a ${count}-Rakʿah prayer.`);
  }
}

const steps = [...source.matchAll(/const ([A-Z_0-9]+): RakatStep = \{([\s\S]*?)\n\};/g)];
if (steps.length < 12) throw new Error(`Expected at least 12 prayer steps, found ${steps.length}.`);

const byName = new Map(steps.map(([, name, body]) => [name, body]));

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
  if (!/source: '/.test(body)) throw new Error(`Prayer step ${name} has Arabic wording but no source reference.`);
}

for (const required of ['TAKBIR', 'FATIHA', 'RUKU', 'SUJUD', 'SITTING_SUJUD', 'TASHAHHUD', 'SALAWAT', 'TASLIM']) {
  if (!source.includes(`const ${required}: RakatStep`)) {
    throw new Error(`The prayer sequence is missing a required step: ${required}`);
  }
}

if (!/rakatOne[\s\S]*?steps: \[TAKBIR, SANA/.test(source)) {
  throw new Error('The opening Takbir and Sana must belong to the first Rakʿah only.');
}
if (!/closingSteps = \[TASHAHHUD, SALAWAT, DUA_BEFORE_SALAM, TASLIM\]/.test(source)) {
  throw new Error('The closing sequence must end with Tashahhud, Salawat, Dua and Taslim.');
}

for (const fragment of [
  'reference-rakah-wording__arabic',
  'reference-rakah-wording__transliteration',
  'reference-rakah-wording__translation',
  'reference-rakah-wording__source',
  'currentStep.source',
  'POSTURE_LABEL',
]) {
  if (!screen.includes(fragment)) {
    throw new Error(`The prayer course no longer renders release-critical wording/source UI: ${fragment}`);
  }
}

for (const evidence of [
  'Sahih al-Bukhari 738',
  'Jami at-Tirmidhi 243',
  'Sahih al-Bukhari 756',
  'Sahih al-Bukhari 776',
  'Jami at-Tirmidhi 262',
  'Sunan Ibn Majah 897',
  'Sunan an-Nasa’i 1170',
  'Sahih al-Bukhari 6357',
  'Sahih Muslim 588',
  'Sunan an-Nasa’i 1320',
]) {
  if (!source.includes(evidence)) throw new Error(`Prayer source evidence missing: ${evidence}`);
}

const postures = new Set([...source.matchAll(/posture: '([a-z]+)'/g)].map((match) => match[1]));
const labelled = new Set([...screen.matchAll(/^\s{2}([a-z]+): '/gm)].map((match) => match[1]));
for (const posture of postures) {
  if (!labelled.has(posture)) throw new Error(`Posture "${posture}" has no readable label on the screen.`);
}

console.log(`Prayer sequence verified: ${steps.length} steps, every spoken core step carries Arabic, transliteration, German meaning and source evidence; Fajr 2, Maghrib 3, Dhuhr/Asr/Isha 4 Rakʿah.`);
