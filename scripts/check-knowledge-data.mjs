/**
 * Knowledge library, Sunnah, repentance and the Ummah overview.
 *
 * All four were bullet lists in `featureContent` — four to six lines of text
 * that were the whole area. This holds the carried-over content in place and,
 * more importantly, holds two honesty rules that are easy to lose:
 *
 * Every Sunnah and repentance entry keeps the proof it came with. An
 * instruction about practice without its basis is exactly what this app avoids
 * everywhere else.
 *
 * The Ummah figures carry no source and no reference year in the old data, so
 * the screen has to say so. Presenting an undated population number as fact is
 * the same fault as an unsourced Hadith, and it is the kind of caveat that gets
 * quietly dropped in a redesign.
 */
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const knowledge = await readFile(resolve(root, 'src/data/knowledgeData.ts'), 'utf8');
const practice = await readFile(resolve(root, 'src/data/practiceData.ts'), 'utf8');
const ummah = await readFile(resolve(root, 'src/data/ummahData.ts'), 'utf8');
const screen = await readFile(resolve(root, 'src/screens/LegacyFeatureScreens.tsx'), 'utf8');

const topics = [...knowledge.matchAll(/^ {4}id: '([^']+)',\n\s+title: '((?:[^'\\]|\\.)*)',\n\s+intro: '((?:[^'\\]|\\.)*)',/gm)];
if (topics.length < 12) throw new Error(`Knowledge library holds ${topics.length} topics; at least 12 are expected.`);
if (new Set(topics.map(([, id]) => id)).size !== topics.length) {
  throw new Error('Knowledge topic ids are not unique.');
}
for (const [, id, , intro] of topics) {
  if (intro.trim().length < 20) throw new Error(`Knowledge topic ${id} has no usable intro.`);
  const body = knowledge.slice(knowledge.indexOf(`id: '${id}'`));
  const sections = body.slice(0, body.indexOf('\n  },')).match(/subtitle: '/g) ?? [];
  if (sections.length < 2) throw new Error(`Knowledge topic ${id} has fewer than two sections; the detail view would open near-empty.`);
}
if ((knowledge.match(/term: '/g) ?? []).length < 6) {
  throw new Error('The glossary lost entries.');
}

// Practice entries must never lose the proof they arrived with.
const practiceItems = [...practice.matchAll(
  /title: '((?:[^'\\]|\\.)*)',\n\s+description: '((?:[^'\\]|\\.)*)',\n\s+proof: '((?:[^'\\]|\\.)*)',/g,
)];
const titleCount = (practice.match(/^\s+title: '/gm) ?? []).length;
if (practiceItems.length !== titleCount) {
  throw new Error(`Only ${practiceItems.length} of ${titleCount} Sunnah/repentance entries carry a description and a proof.`);
}
if (practiceItems.length < 10) {
  throw new Error(`Sunnah and repentance hold ${practiceItems.length} entries; at least 10 are expected.`);
}
for (const [, title, , proof] of practiceItems) {
  if (proof.trim().length < 12) throw new Error(`Entry "${title}" has no usable proof.`);
}

const countries = [...ummah.matchAll(/^ {4}id: '([^']+)',$/gm)];
if (countries.length < 15) throw new Error(`Ummah overview holds ${countries.length} countries; at least 15 are expected.`);

for (const requirement of [
  "import { GLOSSARY_TERMS, KNOWLEDGE_TOPICS } from '../data/knowledgeData';",
  "import { REPENTANCE_GROUPS, SUNNAH_GROUPS } from '../data/practiceData';",
  "import { UMMAH_COUNTRIES, UMMAH_REGIONS } from '../data/ummahData';",
  "if (featureId === 'knowledge') return <KnowledgeFeature",
  "if (featureId === 'sunnah' || featureId === 'sins') return <PracticeFeature",
  "if (featureId === 'ummah') return <UmmahFeature",
  '{item.proof}',
  // The figures may not be presented as a reliable statistic.
  'weder Quelle noch Stichjahr',
]) {
  if (!screen.includes(requirement)) throw new Error(`Knowledge screens are missing: ${requirement}`);
}

for (const gone of ['knowledge:', 'sunnah:', 'sins:', 'ummah:']) {
  if (new RegExp(`^\\s+${gone} \\[`, 'm').test(screen)) {
    throw new Error(`The ${gone.slice(0, -1)} bullet list is back; src/data holds the content now.`);
  }
}

console.log(
  `Knowledge verified: ${topics.length} topics with sections behind a detail view, ${practiceItems.length} Sunnah/repentance entries each carrying its proof, ${countries.length} countries with the missing source and reference year stated on screen.`,
);
