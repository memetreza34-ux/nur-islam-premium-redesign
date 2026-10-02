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
const prophetCourses = await readFile(resolve(root, 'src/data/prophetCourseData.ts'), 'utf8');
const prophetOverviews = await readFile(resolve(root, 'src/data/prophetCourseOverviews.ts'), 'utf8');
const companions = await readFile(resolve(root, 'src/data/companionData.ts'), 'utf8');
const screen = await readFile(resolve(root, 'src/screens/LegacyFeatureScreens.tsx'), 'utf8');

const prophetEntries = [...prophets.matchAll(
  /id: '([^']+)', name: '([^']+)', arabic: '([^']+)'[\s\S]*?summary: '([^']+)'[\s\S]*?focus: '([^']+)'[\s\S]*?lesson: '([^']+)'[\s\S]*?quranReferences: \[([^\]]+)\]/g,
)];

const prophetIds = prophetEntries.map((entry) => entry[1]);
if (prophetEntries.length !== prophetIds.length) {
  throw new Error(`Only ${prophetEntries.length} of ${prophetIds.length} prophets have the full shape.`);
}
if (prophetEntries.length !== 25) {
  throw new Error(`Prophets hold ${prophetEntries.length} entries; exactly 25 are expected.`);
}
if (new Set(prophetIds).size !== prophetIds.length) {
  throw new Error('Prophet ids are not unique.');
}

for (const [, id, , arabic, summary, focus, lesson, references] of prophetEntries) {
  if (!arabic.trim() || summary.trim().length < 50) {
    throw new Error(`Prophet ${id} has no Arabic name or usable summary.`);
  }
  if (!focus.trim() || !lesson.trim() || !references.includes("'")) {
    throw new Error(`Prophet ${id} has no focus, lesson or Quran reference.`);
  }
}

const courseEntries = [...prophetCourses.matchAll(
  /^  (?:'([^']+)'|([a-z]+)): \{\n\s+introduction: '([^']+)',\n\s+chapters: \[([\s\S]*?)\n\s+\],\n\s+\},/gm,
)];
const courseIds = courseEntries.map((entry) => entry[1] || entry[2]);
if (courseEntries.length !== 25 || new Set(courseIds).size !== 25) {
  throw new Error(`Prophet courses hold ${courseEntries.length} unique entries; exactly 25 are expected.`);
}
if (courseIds.some((id) => !prophetIds.includes(id)) || prophetIds.some((id) => !courseIds.includes(id))) {
  throw new Error('Prophet course ids and prophet catalogue ids do not match.');
}

let chapterCount = 0;
for (const entry of courseEntries) {
  const id = entry[1] || entry[2];
  const introduction = entry[3];
  const body = entry[4];
  const chapters = [...body.matchAll(/\{ id: '[^']+', title: '[^']+', summary: '[^']+', paragraphs: \[([^\]]+)\], keyPoints: \[([^\]]+)\], quranReferences: \[([^\]]+)\] \}/g)];
  if (introduction.length < 80 || chapters.length < 3) {
    throw new Error(`Prophet ${id} needs a substantial introduction and at least three course chapters.`);
  }
  for (const [, paragraphs, keyPoints, references] of chapters) {
    if ((paragraphs.match(/'/g) ?? []).length < 4 || (keyPoints.match(/'/g) ?? []).length < 4 || !references.includes("'Quran ")) {
      throw new Error(`Prophet ${id} has a thin or unsourced course chapter.`);
    }
  }
  chapterCount += chapters.length;
}

const overviewEntries = [...prophetOverviews.matchAll(
  /^  (?:'([^']+)'|([a-z]+)): \{\n\s+orientation: '([^']+)',\n\s+coursePath: '([^']+)',\n\s+boundary: '([^']+)',\n\s+learningGoals: \[([^\]]+)\],\n\s+\},/gm,
)];
const overviewIds = overviewEntries.map((entry) => entry[1] || entry[2]);
if (overviewEntries.length !== 25 || new Set(overviewIds).size !== 25) {
  throw new Error(`Prophet course overviews hold ${overviewEntries.length} unique entries; exactly 25 are expected.`);
}
if (overviewIds.some((id) => !prophetIds.includes(id)) || prophetIds.some((id) => !overviewIds.includes(id))) {
  throw new Error('Prophet overview ids and prophet catalogue ids do not match.');
}
for (const entry of overviewEntries) {
  const id = entry[1] || entry[2];
  const [, , , orientation, coursePath, boundary, goals] = entry;
  if (orientation.length < 150 || coursePath.length < 140 || boundary.length < 80 || (goals.match(/'/g) ?? []).length < 6) {
    throw new Error(`Prophet ${id} needs a detailed orientation, course path, knowledge boundary and three learning goals.`);
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
  "import { PROPHET_COURSES } from '../data/prophetCourseData';",
  "import { PROPHET_COURSE_OVERVIEWS } from '../data/prophetCourseOverviews';",
  "if (featureId === 'prophets') return <ProphetsFeature",
  "if (featureId === 'sahabah' || featureId === 'women') return <PeopleListFeature",
  // Companions stay a static list; only prophets open a detail view.
  'reference-person-list reference-person-list--static',
  'reference-prophet-plan__list',
  'reference-prophet-lesson__takeaways',
  'reference-prophet-lesson__sources',
  'reference-prophet-overview__facts',
  'reference-prophet-overview__boundary',
  'reference-prophet-lesson__questions',
  'nur_prophet_course_progress_v1',
  'reference-prophet-status',
  'reference-prophet-lesson__complete',
  'reference-prophet-completion',
  'onOpenQuranReference',
]) {
  if (!screen.includes(requirement)) throw new Error(`People screens are missing: ${requirement}`);
}

if (/^\s+prophets: \[/m.test(screen)) {
  throw new Error('The prophets bullet list is back; src/data/prophetData.ts is the source.');
}

console.log(
  `People verified: all ${prophetEntries.length} Quran-named prophets have a detailed course orientation, sourced core-fact overview, knowledge boundary and ${chapterCount} sourced chapters; companions and women remain separate lists.`,
);
