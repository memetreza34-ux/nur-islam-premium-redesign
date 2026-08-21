import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const legacySource = await readFile(resolve(root, 'src/data/namesOfAllahData.ts'), 'utf8');
const verifiedSource = await readFile(resolve(root, 'src/data/verifiedNamesOfAllahData.ts'), 'utf8');
const screenSource = await readFile(resolve(root, 'src/screens/NamesScreen.tsx'), 'utf8');
const appSource = await readFile(resolve(root, 'src/app/App.tsx'), 'utf8');
const stylesSource = await readFile(resolve(root, 'src/styles.css'), 'utf8');

// Keep the old 99-item data only as a migration/reference artifact. It must not
// silently lose IDs while existing local favorites still refer to them.
const legacyIds = [...legacySource.matchAll(/\{ id: (\d+), latin: '([^']+)'|\{ id: (\d+), latin: "([^"]+)"/g)]
  .map((match) => ({ id: Number(match[1] ?? match[3]), latin: match[2] ?? match[4] }));
if (legacyIds.length !== 99) throw new Error(`Expected 99 legacy migration entries, found ${legacyIds.length}.`);
const uniqueLegacyIds = new Set(legacyIds.map((entry) => entry.id));
if (uniqueLegacyIds.size !== 99 || Math.min(...uniqueLegacyIds) !== 1 || Math.max(...uniqueLegacyIds) !== 99) {
  throw new Error('Legacy Names data must retain every unique migration ID from 1 through 99.');
}

// Public v1 content is a smaller, individually Quran-sourced set.
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

if (verifiedEntries.length !== 32) throw new Error(`Expected 32 individually Quran-sourced public Names, found ${verifiedEntries.length}.`);
if (new Set(verifiedEntries.map((entry) => entry.key)).size !== verifiedEntries.length) {
  throw new Error('Verified Names keys must be unique.');
}
if (new Set(verifiedEntries.map((entry) => entry.latin.toLowerCase())).size !== verifiedEntries.length) {
  throw new Error('Verified Names transliterations must be unique.');
}
for (const entry of verifiedEntries) {
  if (!entry.source.includes('Quran ')) throw new Error(`Verified Name ${entry.key} has no Quran source.`);
  if (!entry.arabic.trim() || !entry.meaning.trim() || !entry.sourceNote.trim()) {
    throw new Error(`Verified Name ${entry.key} is missing Arabic, meaning or source note.`);
  }
  if (entry.legacyId !== null && !uniqueLegacyIds.has(entry.legacyId)) {
    throw new Error(`Verified Name ${entry.key} references unknown legacy ID ${entry.legacyId}.`);
  }
}

for (const required of [
  'nur_name_favorites',
  'nur_name_learned',
  'VERIFIED_NAMES_OF_ALLAH',
  "useState(() => migrateNameSet('nur_name_favorites'))",
  "useState(() => migrateNameSet('nur_name_learned'))",
  'toastTimerRef',
  'Einzeln belegt',
  'nur einzeln belegte Namen',
  'Sahih al-Bukhari 7392',
  'Sahih Muslim 2677a',
  'selected.source',
  'selected.sourceNote',
]) {
  if (!screenSource.includes(required)) throw new Error(`Names screen is missing required integration/safety wording: ${required}`);
}

for (const forbidden of [
  "from '../data/namesOfAllahData'",
  'Alle 99 Namen<br />an einem Ort.',
  '<h1>99 Namen Allahs</h1>',
  'Lernliste · 99',
  'von 99 Einträgen gelernt',
]) {
  if (screenSource.includes(forbidden)) throw new Error(`Public Names screen returned to legacy/canonical-list behavior: ${forbidden}`);
}

if (screenSource.includes("migrateNameSet('nur_name_favorites', ['1'])")) {
  throw new Error('An empty Name favorite set must not be seeded with a legacy Name ID.');
}
if (!appSource.includes("import { NamesScreen } from '../screens/NamesScreen';")) throw new Error('App does not route to the Names learning screen.');
if (!stylesSource.includes('reference-names-complete.css')) throw new Error('Complete Names stylesheet is not loaded.');

console.log(`Names verified: ${legacyIds.length} legacy migration entries remain quarantined; public UI exposes ${verifiedEntries.length} individually Quran-sourced Names with per-entry evidence.`);
