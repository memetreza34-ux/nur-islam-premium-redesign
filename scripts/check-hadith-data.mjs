/**
 * The Hadith library has to stay traceable, while the public daily rotation is
 * intentionally stricter than the retained library.
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
  if (!/\d/.test(entrySource)) {
    throw new Error(`Hadith ${id} still cites a collection without a concrete reference number.`);
  }
}

// These were the retained legacy entries whose collection-only labels were
// audited source by source. Lock the verified references so the library cannot
// silently fall back to vague labels again.
const auditedLegacySources = new Map([
  ['die-taten-sind-entsprechend', ['Sahih al-Bukhari 1', 'Sahih Muslim 1907a']],
  ['der-beste-unter-euch', ['Sahih al-Bukhari 5027']],
  ['ein-muslim-ist-derjenige', ['Sahih al-Bukhari 10']],
  ['wer-an-allah-und', ['Sahih al-Bukhari 6018', 'Sahih Muslim 47b']],
  ['allah-ist-barmherzig-gegenuber', ['Jami at-Tirmidhi 1924']],
  ['der-islam-ist-auf', ['Sahih al-Bukhari 8', 'Sahih Muslim 16c']],
  ['keiner-von-euch-glaubt', ['Sahih al-Bukhari 13', 'Sahih Muslim 45a']],
  ['die-religion-ist-aufrichtiger', ['Sahih Muslim 55a']],
  ['es-gehort-zum-guten', ['Jami at-Tirmidhi 2317', 'Da’if']],
  ['die-reinheit-ist-die', ['Sahih Muslim 223']],
  ['erleichtert-und-erschwert-nicht', ['Sahih al-Bukhari 69', 'Sahih Muslim 1734']],
  ['der-starke-glaubige-ist', ['Sahih Muslim 2664']],
  ['furchte-allah-wo-immer', ['Jami at-Tirmidhi 1987', 'Hasan']],
  ['die-allah-liebsten-taten', ['Sahih al-Bukhari 6465', 'Sahih Muslim 783b']],
  ['wer-einen-weg-beschreitet', ['Sahih Muslim 2699a']],
  ['dein-lacheln-deinem-bruder', ['Jami at-Tirmidhi 1956', 'Hasan']],
  ['der-beste-von-euch', ['Jami at-Tirmidhi 3895', 'Sahih']],
]);

for (const [id, requiredParts] of auditedLegacySources) {
  const entrySource = sourceById.get(id);
  if (!entrySource) throw new Error(`Audited legacy Hadith disappeared from the library: ${id}`);
  for (const required of requiredParts) {
    if (!entrySource.includes(required)) {
      throw new Error(`Audited legacy Hadith ${id} lost required source detail: ${required}`);
    }
  }
}

// Tirmidhi 2317 is intentionally not promoted to the same status as the sahih
// references. Its displayed Darussalam grading remains explicit and its human
// scholarly review remains open.
if (!source.includes("Jami at-Tirmidhi 2317 · auf Sunnah.com/Darussalam als Da’if eingestuft")) {
  throw new Error('Tirmidhi 2317 must retain its explicit Da’if grading notice.');
}
if (!source.includes('die fachliche Hadith-Einordnung bleibt deshalb vor Veröffentlichung ausdrücklich offen')) {
  throw new Error('Tirmidhi 2317 must retain the explicit open-review warning.');
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
if (!screen.includes("isDaily ? 'Die Tagesauswahl wechselt automatisch. ' : 'Dies ist ein fest gespeicherter Eintrag aus deiner Sammlung. '")) {
  throw new Error('Saved Hadith detail no longer distinguishes a fixed saved entry from the daily rotation.');
}

console.log(`Hadith verified: ${entries.length} retained entries all carry concrete collection numbers; ${dailyIds.length} form the curated daily pool; the audited Tirmidhi 2317 entry remains explicitly Da’if/open-review rather than being silently promoted.`);
