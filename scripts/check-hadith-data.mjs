/**
 * The Hadith library has to stay traceable.
 *
 * Every entry names a collection *and* a number within it. An unsourced Hadith
 * in a prayer app is worse than no Hadith, and a collection name without a
 * number cannot be checked by the reader.
 *
 * The seventeen entries carried over from the old repository held the
 * collection only. Their numbers were looked up against the collections
 * themselves and each narration was read back against its summary before the
 * number was written down. Five of those seventeen turned out to be a second
 * copy of an already numbered entry and were merged, which is why the floor
 * below is 20 and not 25.
 *
 * The budget stays at zero: a new entry arrives with its number or not at all.
 * Numbers are never written from memory.
 */
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const source = await readFile(resolve(root, 'src/data/hadithData.ts'), 'utf8');
const screen = await readFile(resolve(root, 'src/screens/DailyHadithScreen.tsx'), 'utf8');

const library = source.slice(
  source.indexOf('export const HADITH_LIBRARY'),
  source.indexOf('\n] as const;', source.indexOf('export const HADITH_LIBRARY')),
);

const entries = [...library.matchAll(
  /id: '([^']+)',\n\s+title: '((?:[^'\\]|\\.)*)',\n\s+summary: '((?:[^'\\]|\\.)*)',\n\s+source: '((?:[^'\\]|\\.)*)',/g,
)];

const ids = [...library.matchAll(/^ {4}id: '([^']+)',$/gm)].map((match) => match[1]);

if (entries.length !== ids.length) {
  throw new Error(`Only ${entries.length} of ${ids.length} Hadith entries have the full id/title/summary/source shape.`);
}
if (entries.length < 20) {
  throw new Error(`Hadith library holds ${entries.length} entries; at least 20 are expected.`);
}
if (new Set(ids).size !== ids.length) {
  const seen = new Set();
  const duplicate = ids.find((id) => seen.size === seen.add(id).size);
  throw new Error(`Hadith ids are not unique: ${duplicate}`);
}

const COLLECTIONS = ['Sahih al-Bukhari', 'Sahih Muslim', 'Sunan at-Tirmidhi', 'Jami at-Tirmidhi', 'Sunan Abu Dawud', 'Sunan an-Nasai', 'Sunan Ibn Majah', 'Muwatta Malik', 'Musnad Ahmad'];

let withoutNumber = 0;
for (const [, id, , summary, entrySource] of entries) {
  if (!COLLECTIONS.some((collection) => entrySource.includes(collection))) {
    throw new Error(`Hadith ${id} cites "${entrySource}", which names no known collection.`);
  }
  // The app states the meaning; it does not present a translation as wording.
  if (!summary.startsWith('Sinngemäßer Inhalt: ')) {
    throw new Error(`Hadith ${id} does not mark its summary as a sinngemäße Inhaltsangabe.`);
  }
  if (/[„“"»«]/.test(summary)) {
    throw new Error(`Hadith ${id} presents quoted wording; this library states the meaning instead.`);
  }
  if (!/\d/.test(entrySource)) withoutNumber++;
}

// The gap is closed. It may not reopen: an entry without a number is a claim
// the reader cannot check.
const MISSING_NUMBER_BUDGET = 0;
if (withoutNumber > MISSING_NUMBER_BUDGET) {
  throw new Error(
    `${withoutNumber} Hadith entries cite a collection without a number, above the budget of ${MISSING_NUMBER_BUDGET}.\n` +
      'Look the reference up in the collection and read the narration back against the summary; never write a number from memory.',
  );
}

// Two entries citing the same reference are the same narration written twice.
// That is how five duplicates survived in here: each pair reached the library
// from a different import, one numbered and one not, so nothing matched on
// text. The daily rotation then showed the same Hadith twice per cycle.
const byReference = new Map();
for (const [, id, , , entrySource] of entries) {
  const existing = byReference.get(entrySource);
  if (existing) {
    throw new Error(
      `Hadith ${id} and ${existing} both cite "${entrySource}" — the same narration twice.\n` +
        'Merge them into one entry rather than letting the daily rotation repeat it.',
    );
  }
  byReference.set(entrySource, id);
}

if (!screen.includes('entry.context ? (')) {
  throw new Error('The daily Hadith screen no longer shows the carried-over explanation.');
}

console.log(
  `Hadith verified: ${entries.length} entries with unique ids and distinct references, every one naming a known collection with a number and marked as a sinngemäße Inhaltsangabe.`,
);
