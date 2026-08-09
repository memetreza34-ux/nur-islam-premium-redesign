/**
 * Keeps the source attribution that already exists from sliding back.
 *
 * Duas, dhikr routines and learning lessons currently cite a source on every
 * entry. This asserts that a new entry cannot be added without one.
 *
 * The counter steps and the 99 Names carry no per-item source yet. That gap is
 * real and reported by `npm run content:report`, but it is not asserted here:
 * failing the build on it would pressure someone into inventing a citation to
 * get green, which is the one outcome religious content cannot afford. Closing
 * it is a reviewer's job, not a build step's.
 *
 * Presence of a citation is not a review. This check says nothing about whether
 * any content is correct or released.
 */
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const read = (file) => readFile(resolve(root, file), 'utf8');
const count = (source, pattern) => [...source.matchAll(pattern)].length;

const duas = await read('src/data/duaData.ts');
const dhikr = await read('src/data/dhikrData.ts');
const learning = await read('src/data/islamicLearningContent.ts');

const duaEntries = count(duas, /^\s+id:\s*'/gm);
const duaSources = count(duas, /^\s+source:\s*'/gm);
if (duaEntries === 0) throw new Error('No duas found; the parser no longer matches the data.');
if (duaSources < duaEntries) {
  throw new Error(`Every dua must cite a source: ${duaEntries} duas but ${duaSources} sources.`);
}

const dhikrRoutines = count(dhikr, /^\s+title:\s*'/gm);
const dhikrSources = count(dhikr, /^\s+source:\s*'/gm);
if (dhikrRoutines === 0) throw new Error('No dhikr routines found; the parser no longer matches the data.');
if (dhikrSources < dhikrRoutines) {
  throw new Error(`Every dhikr routine must cite a source: ${dhikrRoutines} routines but ${dhikrSources} sources.`);
}

const lessons = count(learning, /^\s+categoryId:\s*'/gm);
const lessonSources = count(learning, /^\s+sources:\s*\[/gm);
if (lessons === 0) throw new Error('No lessons found; the parser no longer matches the data.');
if (lessonSources < lessons) {
  throw new Error(`Every lesson must carry a sources list: ${lessons} lessons but ${lessonSources} lists.`);
}
// An empty list would satisfy the count above while citing nothing.
if (/sources:\s*\[\s*\]/.test(learning)) {
  throw new Error('A lesson carries an empty sources list.');
}

console.log(`Content sources verified: ${duaEntries} duas, ${dhikrRoutines} dhikr routines and ${lessons} lessons each cite a source. Citation presence is not a review; counter steps and the 99 Names remain uncited, see npm run content:report.`);
