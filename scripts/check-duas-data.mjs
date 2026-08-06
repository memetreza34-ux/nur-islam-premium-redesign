import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const dataSource = await readFile(resolve(root, 'src/duaData.ts'), 'utf8');
const screenSource = await readFile(resolve(root, 'src/DuasScreen.tsx'), 'utf8');
const stylesSource = await readFile(resolve(root, 'src/styles.css'), 'utf8');

const entries = [...dataSource.matchAll(/id: '([^']+)', categoryId: '([^']+)'/g)]
  .map((match) => ({ id: match[1], categoryId: match[2] }));

if (entries.length !== 34) {
  throw new Error(`Expected 34 Dua entries, found ${entries.length}.`);
}

if (new Set(entries.map((entry) => entry.id)).size !== 34) {
  throw new Error('Dua IDs must be unique.');
}

const categoryIds = new Set(entries.map((entry) => entry.categoryId));
if (categoryIds.size !== 13) {
  throw new Error(`Expected 13 used Dua categories, found ${categoryIds.size}.`);
}

for (const required of [
  'nur_dua_favorites',
  'nur_dua_viewed',
  'DUA_CATEGORIES',
  'DUA_BY_ID',
  'navigator.share',
]) {
  if (!screenSource.includes(required)) {
    throw new Error(`Complete Dua screen is missing required integration: ${required}`);
  }
}

if (!stylesSource.includes('reference-duas-complete.css')) {
  throw new Error('Complete Dua stylesheet is not loaded.');
}

console.log('Dua migration verified: 34 entries, 13 categories, persistence, sharing and styles.');
