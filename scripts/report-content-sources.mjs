/**
 * Reports how much of the religious content carries a source attribution.
 *
 * This is a measurement, not a judgement. It cannot tell whether a citation is
 * correct, only whether one is present, so a full report here does not mean the
 * content is reviewed or released. That stays a human step.
 *
 * Deliberately not part of `npm run check`: the gaps it shows need a qualified
 * reviewer, not a code change, and blocking the build on them would only invite
 * someone to invent citations to get green. The companion check guards the
 * coverage that already exists against sliding back.
 *
 *   npm run content:report
 */
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const read = (file) => readFile(resolve(root, file), 'utf8');

function countMatches(source, pattern) {
  return [...source.matchAll(pattern)].length;
}

const duas = await read('src/data/duaData.ts');
const dhikr = await read('src/data/dhikrData.ts');
const names = await read('src/data/namesOfAllahData.ts');
const learning = await read('src/data/islamicLearningContent.ts');
const hadith = await read('src/data/hadithData.ts');

// Entries are counted from their id lines so the numbers follow the data rather
// than a hand-maintained constant.
const duaEntries = countMatches(duas, /^\s{2}\{\s*$/gm) || countMatches(duas, /^\s+id:\s*'/gm);
const duaSources = countMatches(duas, /^\s+source:\s*'/gm);

const dhikrRoutines = countMatches(dhikr, /^\s+title:\s*'/gm);
const dhikrRoutineSources = countMatches(dhikr, /^\s+source:\s*'/gm);
const dhikrItems = countMatches(dhikr, /^\s+latin:\s*'/gm);
const dhikrItemSources = countMatches(dhikr, /^\s+itemSource:\s*'/gm);

// Names are single-line records, so the id is not at the start of its line.
const nameEntries = countMatches(names, /\{\s*id:\s*\d+/g);
const nameSources = countMatches(names, /\bsource:\s*'/g);

const lessons = countMatches(learning, /^\s+categoryId:\s*'/gm);
const lessonsWithSources = countMatches(learning, /^\s+sources:\s*\[/gm);

const hadithEntries = countMatches(hadith, /^\s+id:\s*'/gm);
const hadithSources = countMatches(hadith, /^\s+source:\s*'/gm);
const hadithSummaryLabels = countMatches(hadith, /^\s+summary:\s*'Sinngemäßer Inhalt:/gm);

const rows = [
  { area: 'Duas', items: duaEntries, withSource: duaSources },
  { area: 'Dhikr routines', items: dhikrRoutines, withSource: dhikrRoutineSources },
  { area: 'Dhikr counter steps', items: dhikrItems, withSource: dhikrItemSources },
  { area: '99 Names', items: nameEntries, withSource: nameSources },
  { area: 'Learning lessons', items: lessons, withSource: lessonsWithSources },
  { area: 'Hadith summaries', items: hadithEntries, withSource: hadithSources },
];

const pad = (value, width) => String(value).padEnd(width);
console.log('\nSource attribution coverage\n');
console.log(`${pad('Area', 22)}${pad('items', 8)}${pad('with source', 13)}coverage`);
console.log('-'.repeat(55));

let complete = 0;
for (const row of rows) {
  const percent = row.items === 0 ? 0 : Math.round((row.withSource / row.items) * 100);
  if (percent === 100) complete += 1;
  console.log(`${pad(row.area, 22)}${pad(row.items, 8)}${pad(row.withSource, 13)}${percent}%`);
}

console.log('-'.repeat(55));
console.log(`${complete} of ${rows.length} areas carry a source on every item.`);
console.log(`Hadith wording labels: ${hadithSummaryLabels}/${hadithEntries} explicitly marked as sinngemäße Inhaltsangaben.\n`);
console.log('Presence of a citation is not a review. Nothing here is released');
console.log('content until a qualified reviewer has signed it off.\n');
