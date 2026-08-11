/**
 * Prophets, companions and women in Islam must stay real entries.
 *
 * All three areas used to be `featureContent`, a `Record<id, string[]>` whose
 * array was their entire content — Propheten was six lines of text with no
 * detail behind them. The risk now is the reverse: a screen that promises depth
 * it does not have. So this checks both directions.
 *
 * Prophets carry an intro, a description, key points and lessons, and open into
 * a detail view. Companions and women carry a name and one line, and are
 * deliberately not tappable — a detail view would open on three lines and imply
 * a biography that does not exist. That distinction is enforced here so it does
 * not quietly drift.
 */
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const prophets = await readFile(resolve(root, 'src/data/prophetData.ts'), 'utf8');
const companions = await readFile(resolve(root, 'src/data/companionData.ts'), 'utf8');
const screen = await readFile(resolve(root, 'src/screens/LegacyFeatureScreens.tsx'), 'utf8');

const prophetEntries = [...prophets.matchAll(
  /id: '([^']+)',\n\s+name: '((?:[^'\\]|\\.)*)',\n(?:\s+commonName: '(?:[^'\\]|\\.)*',\n)?\s+role: '((?:[^'\\]|\\.)*)',\n\s+intro: '((?:[^'\\]|\\.)*)',\n\s+description: '((?:[^'\\]|\\.)*)',\n\s+keyPoints: \[([^\]]*)\],\n\s+lessons: \[([^\]]*)\],/g,
)];

const prophetIds = [...prophets.matchAll(/^ {4}id: '([^']+)',$/gm)].map((match) => match[1]);
if (prophetEntries.length !== prophetIds.length) {
  throw new Error(`Only ${prophetEntries.length} of ${prophetIds.length} prophets have the full shape.`);
}
if (prophetEntries.length < 11) {
  throw new Error(`Prophets hold ${prophetEntries.length} entries; at least 11 are expected.`);
}
if (new Set(prophetIds).size !== prophetIds.length) {
  throw new Error('Prophet ids are not unique.');
}

for (const [, id, , , intro, description, keyPoints, lessons] of prophetEntries) {
  if (intro.trim().length < 15 || description.trim().length < 25) {
    throw new Error(`Prophet ${id} has no usable intro or description.`);
  }
  if (!keyPoints.trim() || !lessons.trim()) {
    throw new Error(`Prophet ${id} has no key points or lessons; the detail view would open empty.`);
  }
}

for (const [name, section] of [['SAHABAH', 'SAHABAH'], ['WOMEN_IN_ISLAM', 'WOMEN_IN_ISLAM']]) {
  const start = companions.indexOf(`export const ${section}`);
  if (start < 0) throw new Error(`${name} is missing from companionData.ts.`);
  const body = companions.slice(start, companions.indexOf('\n];', start));
  const ids = [...body.matchAll(/id: '([^']+)',/g)].map((match) => match[1]);
  if (ids.length < 10) throw new Error(`${name} holds ${ids.length} entries; at least 10 are expected.`);
  if (new Set(ids).size !== ids.length) throw new Error(`${name} ids are not unique.`);
}

for (const requirement of [
  "import { SAHABAH, WOMEN_IN_ISLAM } from '../data/companionData';",
  "import { PROPHETS } from '../data/prophetData';",
  "if (featureId === 'prophets') return <ProphetsFeature",
  "if (featureId === 'sahabah' || featureId === 'women') return <PeopleListFeature",
  // Companions stay a static list; only prophets open a detail view.
  'reference-person-list reference-person-list--static',
]) {
  if (!screen.includes(requirement)) throw new Error(`People screens are missing: ${requirement}`);
}

if (/^\s+prophets: \[/m.test(screen)) {
  throw new Error('The prophets bullet list is back; src/data/prophetData.ts is the source.');
}

console.log(
  `People verified: ${prophetEntries.length} prophets with intro, description, key points and lessons behind a detail view; companions and women listed without a detail view they have no content for.`,
);
