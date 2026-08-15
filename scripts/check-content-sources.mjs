/**
 * Keeps the source attribution that already exists from sliding back.
 *
 * Duas, dhikr routines, learning lessons and the central Hadith summaries
 * currently cite a source on every entry. This asserts that a new entry cannot
 * be added without one. Hadith summaries must additionally keep the explicit
 * "Sinngemäßer Inhalt" label so a short German summary cannot be mistaken for
 * original wording or a verified translation.
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
const hadith = await read('src/data/hadithData.ts');
const rakats = await read('src/data/prayerRakatData.ts');

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

const hadithEntries = count(hadith, /^\s+id:\s*'/gm);
const hadithSources = count(hadith, /^\s+source:\s*'/gm);
const labelledHadithSummaries = count(hadith, /^\s+summary:\s*'Sinngemäßer Inhalt:/gm);
if (hadithEntries === 0) throw new Error('No Hadith entries found; the parser no longer matches the data.');
if (hadithSources < hadithEntries) {
  throw new Error(`Every Hadith summary must cite a source: ${hadithEntries} entries but ${hadithSources} sources.`);
}
if (labelledHadithSummaries < hadithEntries) {
  throw new Error(`Every Hadith summary must remain explicitly labelled as sinngemäß: ${hadithEntries} entries but ${labelledHadithSummaries} labelled summaries.`);
}

// The prayer sequence was the last set carrying Arabic wording with no
// attribution at all. Every step that puts words in someone's mouth now names
// where they come from — Quran by exact place, transmitted formulas by
// collection. Movement-only steps have no wording and need none.
const spokenSteps = count(rakats, /^\s+arabic:\s*'/gm);
const rakatSources = count(rakats, /^\s+source:\s*'/gm);
if (spokenSteps === 0) throw new Error('No prayer steps found; the parser no longer matches the data.');
if (rakatSources < spokenSteps) {
  throw new Error(`Every spoken prayer step must cite a source: ${spokenSteps} steps with wording but ${rakatSources} sources.`);
}

console.log(`Content sources verified: ${duaEntries} duas, ${dhikrRoutines} dhikr routines, ${lessons} lessons, ${hadithEntries} Hadith summaries and ${spokenSteps} spoken prayer steps each carry source attribution; every Hadith summary is explicitly labelled sinngemäß. Citation presence is not a review; counter steps and the 99 Names remain uncited, see npm run content:report.`);
