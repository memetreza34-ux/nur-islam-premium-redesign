import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const dataRoot = resolve(root, 'public/data/quran');
const surahs = JSON.parse(await readFile(resolve(dataRoot, 'surahs.json'), 'utf8'));

if (!Array.isArray(surahs) || surahs.length !== 114) {
  throw new Error(`Expected 114 surahs, found ${Array.isArray(surahs) ? surahs.length : 'invalid data'}.`);
}

const numbers = surahs.map((surah) => surah.number);
if (new Set(numbers).size !== 114 || Math.min(...numbers) !== 1 || Math.max(...numbers) !== 114) {
  throw new Error('Surah metadata must contain every unique number from 1 through 114.');
}

for (let index = 0; index < surahs.length; index += 1) {
  const surah = surahs[index];
  if (surah.number !== index + 1) throw new Error(`Surah order is invalid at index ${index}.`);
  if (!surah.name || !surah.englishName || !Number.isInteger(surah.numberOfAyahs) || surah.numberOfAyahs < 1) {
    throw new Error(`Surah metadata is incomplete for number ${surah.number}.`);
  }
  if (!['Meccan', 'Medinan'].includes(surah.revelationType)) {
    throw new Error(`Invalid revelation type for surah ${surah.number}.`);
  }
}

const serviceSource = await readFile(resolve(root, 'src/quranService.ts'), 'utf8');
const offlineMatch = serviceSource.match(/OFFLINE_QURAN_SURAHS = \[([^\]]+)\]/);
if (!offlineMatch) throw new Error('Could not read OFFLINE_QURAN_SURAHS from quranService.ts.');

const offlineNumbers = offlineMatch[1]
  .split(',')
  .map((value) => Number(value.trim()))
  .filter(Number.isFinite);

if (!offlineNumbers.length || new Set(offlineNumbers).size !== offlineNumbers.length) {
  throw new Error('Offline Quran surah list is empty or contains duplicates.');
}

for (const number of offlineNumbers) {
  const meta = surahs.find((surah) => surah.number === number);
  if (!meta) throw new Error(`Offline surah ${number} is missing from metadata.`);

  const [arabic, german] = await Promise.all([
    readFile(resolve(dataRoot, 'ar', `${number}.json`), 'utf8').then(JSON.parse),
    readFile(resolve(dataRoot, 'de', `${number}.json`), 'utf8').then(JSON.parse),
  ]);

  for (const [language, detail] of [['ar', arabic], ['de', german]]) {
    if (detail.number !== number || detail.numberOfAyahs !== meta.numberOfAyahs) {
      throw new Error(`${language}/${number}.json metadata does not match surahs.json.`);
    }
    if (!Array.isArray(detail.ayahs) || detail.ayahs.length !== meta.numberOfAyahs) {
      throw new Error(`${language}/${number}.json has an invalid ayah count.`);
    }
    detail.ayahs.forEach((ayah, index) => {
      if (ayah.numberInSurah !== index + 1 || typeof ayah.text !== 'string' || !ayah.text.trim()) {
        throw new Error(`${language}/${number}.json has invalid ayah ${index + 1}.`);
      }
    });
  }
}

const appSource = await readFile(resolve(root, 'src/App.tsx'), 'utf8');
const catalogSource = await readFile(resolve(root, 'src/QuranScreen.tsx'), 'utf8');
const readerSource = await readFile(resolve(root, 'src/QuranReaderScreen.tsx'), 'utf8');
const stylesSource = await readFile(resolve(root, 'src/styles.css'), 'utf8');

for (const required of [
  "import { QuranReaderScreen } from './QuranReaderScreen';",
  'selectedSurahNumber',
  'onOpenReader={openReader}',
]) {
  if (!appSource.includes(required)) throw new Error(`Quran app routing is missing: ${required}`);
}

for (const required of ['fetchSurahs', 'OFFLINE_QURAN_SURAH_SET', 'nur_quran_surah_favorites']) {
  if (!catalogSource.includes(required)) throw new Error(`Quran catalog integration is missing: ${required}`);
}

for (const required of ['fetchSurahBundle', 'nur_quran_last_read', 'nur_quran_bookmarks_']) {
  if (!readerSource.includes(required)) throw new Error(`Quran reader integration is missing: ${required}`);
}

if (!stylesSource.includes('reference-quran-complete.css')) {
  throw new Error('Complete Quran stylesheet is not loaded.');
}

console.log(`Quran migration verified: 114-surah catalog and ${offlineNumbers.length} fully paired offline surahs.`);
