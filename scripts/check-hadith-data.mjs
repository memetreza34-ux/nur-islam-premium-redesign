/**
 * The Hadith library has to stay traceable, while the public daily rotation is
 * intentionally stricter than the retained legacy library.
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
if (new Set(ids).size !== ids.length) throw new Error('Hadith ids are not unique.');

const COLLECTIONS = ['Sahih al-Bukhari', 'Sahih Muslim', 'Sunan at-Tirmidhi', 'Jami at-Tirmidhi', 'Sunan Abu Dawud', 'Sunan an-Nasai', 'Sunan Ibn Majah', 'Muwatta Malik', 'Musnad Ahmad'];

let withoutNumber = 0;
const sourceById = new Map();
for (const [, id, , summary, entrySource] of entries) {
  sourceById.set(id, entrySource);
  if (!COLLECTIONS.some((collection) => entrySource.includes(collection))) {
    throw new Error(`Hadith ${id} cites "${entrySource}", which names no known collection.`);
  }
  if (!summary.startsWith('Sinngemäßer Inhalt: ')) {
    throw new Error(`Hadith ${id} does not mark its summary as a sinngemäße Inhaltsangabe.`);
  }
  if (/[„“"»«]/.test(summary)) {
    throw new Error(`Hadith ${id} presents quoted wording; this library states the meaning instead.`);
  }
  if (!/\d/.test(entrySource)) withoutNumber++;
}

const MISSING_NUMBER_BUDGET = 17;
if (withoutNumber > MISSING_NUMBER_BUDGET) {
  throw new Error(`${withoutNumber} Hadith entries cite a collection without a number, above the budget of ${MISSING_NUMBER_BUDGET}.`);
}

const dailyBlockMatch = source.match(/export const DAILY_HADITH_IDS = \[([\s\S]*?)\] as const;/);
if (!dailyBlockMatch) throw new Error('DAILY_HADITH_IDS curated pool is missing.');
const dailyIds = [...dailyBlockMatch[1].matchAll(/'([^']+)'/g)].map((match) => match[1]);
if (dailyIds.length < 5 || new Set(dailyIds).size !== dailyIds.length) {
  throw new Error('Daily Hadith pool must contain at least five unique reviewed candidates.');
}
for (const id of dailyIds) {
  const entrySource = sourceById.get(id);
  if (!entrySource) throw new Error(`Daily Hadith id is absent from library: ${id}`);
  if (!/\d/.test(entrySource)) throw new Error(`Daily Hadith ${id} lacks a concrete collection number.`);
}
if (!source.includes('const pool = DAILY_HADITH_POOL.length ? DAILY_HADITH_POOL')) {
  throw new Error('getDailyHadith no longer uses the curated DAILY_HADITH_POOL.');
}

if (!screen.includes('entry.context ? (')) {
  throw new Error('The daily Hadith screen no longer shows the carried-over explanation where one exists.');
}

console.log(`Hadith verified: ${entries.length} retained entries; ${dailyIds.length} concrete-reference entries form the public daily pool; ${withoutNumber} legacy entries still lack a number and remain outside automatic rotation.`);
