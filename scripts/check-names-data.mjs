import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const legacySource = await readFile(resolve(root, 'src/data/namesOfAllahData.ts'), 'utf8');
const verifiedSource = await readFile(resolve(root, 'src/data/verifiedNamesOfAllahData.ts'), 'utf8');
const screenSource = await readFile(resolve(root, 'src/screens/NamesScreen.tsx'), 'utf8');
const collectionsSource = await readFile(resolve(root, 'src/screens/CollectionsScreen.tsx'), 'utf8');
const appSource = await readFile(resolve(root, 'src/app/App.tsx'), 'utf8');
const stylesSource = await readFile(resolve(root, 'src/styles.css'), 'utf8');

// The full 99-item learning list is a deliberate product feature and must not
// be silently removed. Its exact enumeration, wording and individual evidence
// remain subject to the documented religious-content review.
const legacyIds = [...legacySource.matchAll(/\{ id: (\d+), latin: '([^']+)'|\{ id: (\d+), latin: "([^"]+)"/g)]
  .map((match) => ({ id: Number(match[1] ?? match[3]), latin: match[2] ?? match[4] }));
if (legacyIds.length !== 99) throw new Error(`Expected all 99 Names learning entries, found ${legacyIds.length}.`);
const uniqueLegacyIds = new Set(legacyIds.map((entry) => entry.id));
if (uniqueLegacyIds.size !== 99 || Math.min(...uniqueLegacyIds) !== 1 || Math.max(...uniqueLegacyIds) !== 99) {
  throw new Error('Names learning data must retain every unique ID from 1 through 99.');
}

// Keep the individually Quran-sourced subset as an audit aid. It enriches the
// full 99-name UI with direct evidence where already checked; it does not
// replace or delete the rest of the user-facing learning list.
const verifiedEntries = [...verifiedSource.matchAll(/\{ key: '([^']+)', legacyId: (null|\d+), latin: (?:'([^']+)'|"([^"]+)"), arabic: '([^']+)', meaning: '([^']+)', source: '([^']+)', sourceNote: (?:'([^']+)'|"([^"]+)") \}/g)]
  .map((match) => ({
    key: match[1],
    legacyId: match[2] === 'null' ? null : Number(match[2]),
    latin: match[3] ?? match[4],
    arabic: match[5],
    meaning: match[6],
    source: match[7],
    sourceNote: match[8] ?? match[9],
  }));

if (verifiedEntries.length < 30) throw new Error(`Expected the existing individually sourced audit subset, found only ${verifiedEntries.length}.`);
if (new Set(verifiedEntries.map((entry) => entry.key)).size !== verifiedEntries.length) throw new Error('Verified Names audit keys must be unique.');
for (const entry of verifiedEntries) {
  if (!entry.source.includes('Quran ')) throw new Error(`Verified Name ${entry.key} has no Quran source.`);
  if (!entry.arabic.trim() || !entry.meaning.trim() || !entry.sourceNote.trim()) throw new Error(`Verified Name ${entry.key} is missing Arabic, meaning or source note.`);
  if (entry.legacyId !== null && !uniqueLegacyIds.has(entry.legacyId)) throw new Error(`Verified Name ${entry.key} references unknown 99-list ID ${entry.legacyId}.`);
}

for (const required of [
  "from '../data/namesOfAllahData'",
  'VERIFIED_NAMES_OF_ALLAH',
  "useState(() => migrateNameSet('nur_name_favorites'))",
  "useState(() => migrateNameSet('nur_name_learned'))",
  '<h1>99 Namen Allahs</h1>',
  'Alle 99 Namen',
  'von 99 gelernt',
  'Sahih al-Bukhari 7392',
  'Sahih Muslim 2677a',
  'Einzelbeleg',
]) {
  if (!screenSource.includes(required)) throw new Error(`99 Names screen is missing required feature/review wording: ${required}`);
}

if (!collectionsSource.includes("from '../data/namesOfAllahData'")) {
  throw new Error('Collections no longer preserves favorites across the full 99-name learning list.');
}
if (!collectionsSource.includes('NAMES_OF_ALLAH.find')) {
  throw new Error('Collections no longer resolves saved favorites against the full 99-name learning list.');
}
if (screenSource.includes("migrateNameSet('nur_name_favorites', ['1'])")) {
  throw new Error('An empty Name favorite set must not be silently pre-seeded.');
}
// The screen is loaded on demand, so match the module specifier rather than a
// static import statement: either form proves the route is wired.
if (!appSource.includes("'../screens/NamesScreen'") || !appSource.includes("activeTab === 'names'")) {
  throw new Error('App does not route to the Names learning screen.');
}
if (!stylesSource.includes('reference-names-complete.css')) throw new Error('Complete Names stylesheet is not loaded.');

console.log(`Names verified: all ${legacyIds.length} learning entries remain visible-capable, while ${verifiedEntries.length} currently have direct Quran-source audit metadata and the full list stays under expert review.`);
