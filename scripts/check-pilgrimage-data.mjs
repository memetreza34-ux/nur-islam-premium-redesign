/**
 * Hajj, Umrah and the three mosques — the only content written for this app.
 *
 * Every other area was carried over from the old repository. These two had
 * nothing to carry: six and three bullet points. That makes them the one place
 * where the app asserts something nobody else wrote, so the limits it set for
 * itself are enforced here rather than left to memory.
 *
 * Two rules. The text describes the sequence, never the ruling — what is
 * obligatory, what invalidates the pilgrimage, what to do when something is
 * missed. Those differ between schools of law and belong to a qualified source.
 * And the screen has to keep saying that the text was written here and still
 * needs review, because that caveat is exactly what gets dropped in a redesign.
 */
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const data = await readFile(resolve(root, 'src/data/pilgrimageData.ts'), 'utf8');
const screen = await readFile(resolve(root, 'src/screens/LegacyFeatureScreens.tsx'), 'utf8');

const entries = [...data.matchAll(
  /id: '([^']+)',\n\s+(?:when|name): '((?:[^'\\]|\\.)*)',\n\s+(?:title|city): '((?:[^'\\]|\\.)*)',\n\s+description: '((?:[^'\\]|\\.)*)',/g,
)];
const ids = [...data.matchAll(/^ {4}id: '([^']+)',$/gm)].map((match) => match[1]);

if (entries.length !== ids.length) {
  throw new Error(`Only ${entries.length} of ${ids.length} pilgrimage entries have the full shape.`);
}
if (entries.length < 15) {
  throw new Error(`Pilgrimage data holds ${entries.length} entries; at least 15 are expected.`);
}
if (new Set(ids).size !== ids.length) {
  throw new Error('Pilgrimage ids are not unique.');
}

// Vocabulary that turns a description into a ruling.
const RULING_WORDS = ['Pflicht', 'verpflichtend', 'ungültig', 'verboten', 'erlaubt', 'haram', 'zwingend', 'muss man', 'darf nicht'];
for (const [, id, , , description] of entries) {
  if (description.trim().length < 40) {
    throw new Error(`Pilgrimage entry ${id} has no usable description.`);
  }
  const found = RULING_WORDS.find((word) => description.includes(word));
  if (found) {
    throw new Error(
      `Pilgrimage entry ${id} states a ruling ("${found}"). This area describes the sequence only;\n`
        + '  what is obligatory and what is not differs between schools of law and belongs to a qualified source.',
    );
  }
}

// A reference is optional, but a stated one has to look like a Quran citation
// rather than a vague gesture at scripture.
for (const [, reference] of data.matchAll(/reference: '((?:[^'\\]|\\.)*)',/g)) {
  if (!/^Quran \d+:\d+$/.test(reference)) {
    throw new Error(`Pilgrimage reference "${reference}" is not a precise Quran citation.`);
  }
}

for (const requirement of [
  "import { HAJJ_STATIONS, HOLY_PLACES, UMRAH_STATIONS } from '../data/pilgrimageData';",
  "if (featureId === 'hajj') return <PilgrimageFeature",
  "if (featureId === 'places') return <HolyPlacesFeature",
  // The caveat that this text was written here and is not yet reviewed.
  'beschreibt den Ablauf, nicht die Urteile',
  'für diese App verfasst',
]) {
  if (!screen.includes(requirement)) throw new Error(`Pilgrimage screens are missing: ${requirement}`);
}

if (screen.includes('const featureContent')) {
  throw new Error('The bullet-list map is back; all fifteen areas have their own screen now.');
}

const withReference = (data.match(/reference: '/g) ?? []).length;
console.log(
  `Pilgrimage verified: ${entries.length} entries describing the sequence without stating rulings, ${withReference} carrying an exact Quran citation, and the screens still name the text as written here and unreviewed.`,
);
