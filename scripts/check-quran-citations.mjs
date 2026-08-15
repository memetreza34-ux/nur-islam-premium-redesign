/**
 * Every Quran citation in the content has to point at an Ayah that exists.
 *
 * The app carries all 114 Surahs offline, so a citation can be checked against
 * the app's own text instead of a website: if `src/data` claims Quran 2:201,
 * that Ayah must exist in `public/data/quran`. A citation pointing past the end
 * of a Surah is the failure worth catching automatically — it survives every
 * proofread, because the number looks plausible and nobody counts Ayat.
 *
 * What this cannot check is whether the cited Ayah *says* what the entry claims
 * it says. That is the scholarly review. Run with --report to print each
 * citation next to the Ayah it points at, which is the form that review needs.
 */
import { readFile, readdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const REPORT = process.argv.includes('--report');

const CITATION = /(?:Quran|Koran)\s*\(?(\d{1,3}):(\d{1,3})(?:[–-](\d{1,3}))?\)?/g;

const dataDir = resolve(root, 'src/data');
const files = (await readdir(dataDir)).filter((name) => name.endsWith('.ts') && !name.endsWith('.test.ts'));

// Ayah counts come from the catalogue, not from a text file: the German
// rendering is fetched per Surah rather than shipped, so it is not on disk to
// count. The Arabic is, and --report reads it for the wording.
const catalogue = JSON.parse(await readFile(resolve(root, 'public/data/quran/surahs.json'), 'utf8'));

const surahCache = new Map();
async function loadArabic(number) {
  if (!surahCache.has(number)) {
    const path = resolve(root, `public/data/quran/ar/${number}.json`);
    surahCache.set(number, JSON.parse(await readFile(path, 'utf8')));
  }
  return surahCache.get(number);
}

const problems = [];
let checked = 0;

for (const file of files) {
  const source = await readFile(resolve(dataDir, file), 'utf8');
  for (const match of source.matchAll(CITATION)) {
    const [cited, rawSurah, rawFirst, rawLast] = match;
    const surahNumber = Number(rawSurah);
    const first = Number(rawFirst);
    const last = rawLast ? Number(rawLast) : first;
    checked++;

    if (surahNumber < 1 || surahNumber > 114) {
      problems.push(`${file}: ${cited} names Surah ${surahNumber}; the Quran has 114.`);
      continue;
    }
    if (last < first) {
      problems.push(`${file}: ${cited} runs backwards.`);
      continue;
    }

    const surah = catalogue.find((entry) => entry.number === surahNumber);
    if (!surah) {
      problems.push(`${file}: ${cited} names Surah ${surahNumber}, which is not in the catalogue.`);
      continue;
    }
    if (last > surah.numberOfAyahs) {
      problems.push(
        `${file}: ${cited} points at Ayah ${last}, but Surah ${surahNumber} (${surah.englishName}) has ${surah.numberOfAyahs}.`,
      );
      continue;
    }

    if (REPORT) {
      const arabic = await loadArabic(surahNumber);
      const verses = arabic.ayahs
        .filter((ayah) => ayah.numberInSurah >= first && ayah.numberInSurah <= last)
        .map((ayah) => `${ayah.numberInSurah}: ${ayah.text}`)
        .join('\n     ');
      console.log(`\n${file} — ${cited} (${surah.englishName})\n     ${verses}`);
    }
  }
}

if (problems.length) {
  throw new Error(`Quran citations pointing nowhere:\n  ${problems.join('\n  ')}`);
}

console.log(
  `Quran citations verified: ${checked} references across ${files.length} data files, every one inside the Surah it names.`,
);
