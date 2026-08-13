/**
 * The Hadith library has to stay traceable.
 *
 * Every entry names a collection, and that is the minimum: an unsourced Hadith
 * in a prayer app is worse than no Hadith. Beyond that this tracks how precise
 * the sourcing is. The eight entries written for this app cite a number within
 * the collection; the seventeen carried over from the old repository name the
 * collection only, because that is all the old data held.
 *
 * That gap is reported rather than hidden, and it may only shrink. Numbers are
 * never filled in from memory — they come from the scholarly review.
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
if (entries.length < 25) {
  throw new Error(`Hadith library holds ${entries.length} entries; at least 25 are expected.`);
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

// Pinned at today's count so the gap can close but not widen.
const MISSING_NUMBER_BUDGET = 17;
if (withoutNumber > MISSING_NUMBER_BUDGET) {
  throw new Error(
    `${withoutNumber} Hadith entries cite a collection without a number, above the budget of ${MISSING_NUMBER_BUDGET}.\n` +
      'Add the reference from the scholarly review and lower the budget in the same commit; never write a number from memory.',
  );
}

if (!screen.includes('entry.context ? (')) {
  throw new Error('The daily Hadith screen no longer shows the carried-over explanation.');
}

console.log(
  `Hadith verified: ${entries.length} entries with unique ids, every one naming a known collection and marked as a sinngemäße Inhaltsangabe; ${withoutNumber} still lack a number within the collection (budget ${MISSING_NUMBER_BUDGET}).`,
);
