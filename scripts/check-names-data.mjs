import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const dataSource = await readFile(resolve(root, 'src/data/namesOfAllahData.ts'), 'utf8');
const screenSource = await readFile(resolve(root, 'src/screens/NamesScreen.tsx'), 'utf8');
const appSource = await readFile(resolve(root, 'src/app/App.tsx'), 'utf8');
const stylesSource = await readFile(resolve(root, 'src/styles.css'), 'utf8');

const ids = [...dataSource.matchAll(/\{ id: (\d+), latin: '([^']+)'|\{ id: (\d+), latin: "([^"]+)"/g)]
  .map((match) => ({
    id: Number(match[1] ?? match[3]),
    latin: match[2] ?? match[4],
  }));

if (ids.length !== 99) {
  throw new Error(`Expected 99 Names entries, found ${ids.length}.`);
}

const uniqueIds = new Set(ids.map((entry) => entry.id));
if (uniqueIds.size !== 99 || Math.min(...uniqueIds) !== 1 || Math.max(...uniqueIds) !== 99) {
  throw new Error('Names data must contain every unique ID from 1 through 99.');
}

const normalizedNames = ids.map((entry) => entry.latin.toLowerCase());
if (new Set(normalizedNames).size < 98) {
  throw new Error('Names data contains unexpected duplicate transliterations.');
}

// Two Names carrying the same German meaning are indistinguishable in the list
// and in search, and the distinction between them is simply lost. Al-Jabbar and
// Al-Qahhar both read "Der Bezwinger" until the app's own Quran text settled
// it: Bubenheim renders al-Qahhar "der Allbezwinger" (12:39, 40:16) and
// al-Jabbar "der Gewalthaber" (59:23).
const meanings = [...dataSource.matchAll(/meaning: '([^']+)'|meaning: "([^"]+)"/g)]
  .map((match) => (match[1] ?? match[2]).toLowerCase().trim());
if (meanings.length !== 99) {
  throw new Error(`Expected 99 Names meanings, found ${meanings.length}.`);
}
const seenMeanings = new Map();
meanings.forEach((meaning, index) => {
  const other = seenMeanings.get(meaning);
  if (other !== undefined) {
    throw new Error(
      `Names ${ids[other].latin} and ${ids[index].latin} share the meaning "${meaning}" — ` +
        'the two are indistinguishable in the list. Give each the wording that tells them apart.',
    );
  }
  seenMeanings.set(meaning, index);
});

for (const required of [
  'nur_name_favorites',
  'nur_name_learned',
  'NAMES_OF_ALLAH',
  "useState(() => migrateNameSet('nur_name_favorites'))",
  "useState(() => migrateNameSet('nur_name_learned'))",
  'toastTimerRef',
]) {
  if (!screenSource.includes(required)) {
    throw new Error(`Complete Names screen is missing required integration: ${required}`);
  }
}

if (screenSource.includes("migrateNameSet('nur_name_favorites', ['1'])")) {
  throw new Error('An empty Name favorite set must not be seeded with Name 1.');
}

if (!appSource.includes("import { NamesScreen } from '../screens/NamesScreen';")) {
  throw new Error('App does not route to the complete Names screen.');
}

if (!stylesSource.includes("reference-names-complete.css")) {
  throw new Error('Complete Names stylesheet is not loaded.');
}

console.log('99 Names migration verified: 99 entries, unique IDs, persistence, route and styles; empty favorite sets stay empty without a seeded first-run Name.');
