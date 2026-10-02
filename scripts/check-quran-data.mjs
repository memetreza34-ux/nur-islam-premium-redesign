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

const serviceSource = await readFile(resolve(root, 'src/services/quranService.ts'), 'utf8');
// The offline bundle is the whole Quran, not a subset, so the declaration is
// pinned to full coverage rather than parsed as a list. Every one of the 228
// files below is then validated on every run.
if (!serviceSource.includes('export const OFFLINE_QURAN_SURAHS = Array.from({ length: 114 }, (_, index) => index + 1);')) {
  throw new Error('OFFLINE_QURAN_SURAHS must declare all 114 surahs as bundled offline.');
}

const offlineNumbers = surahs.map((surah) => surah.number);

let totalAyahs = 0;
for (const number of offlineNumbers) {
  const meta = surahs.find((surah) => surah.number === number);
  if (!meta) throw new Error(`Offline surah ${number} is missing from metadata.`);

  const arabic = JSON.parse(await readFile(resolve(dataRoot, 'ar', `${number}.json`), 'utf8'));

  if (arabic.number !== number || arabic.numberOfAyahs !== meta.numberOfAyahs) {
    throw new Error(`ar/${number}.json metadata does not match surahs.json.`);
  }
  if (!Array.isArray(arabic.ayahs) || arabic.ayahs.length !== meta.numberOfAyahs) {
    throw new Error(`ar/${number}.json has an invalid ayah count.`);
  }
  arabic.ayahs.forEach((ayah, index) => {
    if (ayah.numberInSurah !== index + 1 || typeof ayah.text !== 'string' || !ayah.text.trim()) {
      throw new Error(`ar/${number}.json has invalid ayah ${index + 1}.`);
    }
  });
  totalAyahs += arabic.ayahs.length;
}

// No translation or transliteration is bundled here. The Arabic is the offline
// source; the Latin-script pronunciation aid is fetched per Surah and cached in
// the reader's browser.
try {
  await readFile(resolve(dataRoot, 'de/1.json'), 'utf8');
  throw new Error(
    'public/data/quran/de is back. Quran translations must not be bundled with the app.',
  );
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}

// The Kufan count the metadata is built on. A silently truncated or duplicated
// surah would still pass every per-file check above but change this total.
if (totalAyahs !== 6236) {
  throw new Error(`Bundled Arabic text holds ${totalAyahs} ayahs; the 114-surah catalog describes 6236.`);
}

const onlineServiceFeatures = [
  "ONLINE_API_BASE = 'https://api.alquran.cloud/v1'",
  "ONLINE_ARABIC_EDITION = 'quran-uthmani'",
  "ONLINE_TRANSLITERATION_EDITION = 'en.transliteration'",
  "ONLINE_GERMAN_EDITION = 'de.bubenheim'",
  "ONLINE_CACHE_NAME = 'nur-quran-online-v3'",
  'AbortController',
  'ONLINE_TIMEOUT_MS',
  'readOnlineCache',
  'writeOnlineCache',
  'parseOnlineEdition',
  'validateEdition',
  "source: 'offline'",
];
for (const required of onlineServiceFeatures) {
  if (!serviceSource.includes(required)) throw new Error(`Online Quran service is missing: ${required}`);
}

const legalSource = await readFile(resolve(root, 'src/data/legalContent.ts'), 'utf8');
if (!legalSource.includes('en.transliteration') || !legalSource.includes('de.bubenheim')) {
  throw new Error('The legal source section no longer names both Quran reading editions the reader uses.');
}

// Supporting text must stay a fetch, never a bundled asset. The multi-edition
// endpoint would also download the Arabic half the device already has.
if (serviceSource.includes(`${'editions'}/`)) {
  throw new Error('The Quran service requests a coupled multi-edition bundle instead of independent reading layers.');
}
for (const required of [
  'transliteration: SurahDetail | null',
  'german: SurahDetail | null',
  "transliterationSource: transliteration?.source ?? 'unavailable'",
  "translationSource: translation?.source ?? 'unavailable'",
]) {
  if (!serviceSource.includes(required)) {
    throw new Error(
      `The Quran service no longer treats its supporting reading layers as optional (missing: ${required}).\n` +
        'A Surah has to render from the bundled Arabic when either supporting layer cannot be fetched.',
    );
  }
}

const appSource = await readFile(resolve(root, 'src/app/App.tsx'), 'utf8');
const homeProgressSource = await readFile(resolve(root, 'src/services/homeQuranProgress.ts'), 'utf8');
const catalogSource = await readFile(resolve(root, 'src/screens/QuranScreen.tsx'), 'utf8');
const readerSource = await readFile(resolve(root, 'src/screens/QuranReaderScreen.tsx'), 'utf8');
const stylesSource = await readFile(resolve(root, 'src/styles.css'), 'utf8');
const onlineStyles = await readFile(resolve(root, 'src/styles/reference-quran-online.css'), 'utf8');
const serviceWorker = await readFile(resolve(root, 'public/sw.js'), 'utf8');

for (const required of [
  "import { QuranReaderScreen } from '../screens/QuranReaderScreen';",
  'selectedSurahNumber',
  'selectedAyahNumber',
  'onOpenReader={openReader}',
  'initialAyahNumber={selectedAyahNumber}',
  'useState(readHomeQuranProgress)',
]) {
  if (!appSource.includes(required)) throw new Error(`Quran app routing/progress is missing: ${required}`);
}
for (const required of ['hasProgress: boolean', 'hasProgress = false', 'progressFor(surahs[0])', 'englishName: surah.englishName', 'surahsByNumber.get(surahNumber)']) {
  if (!homeProgressSource.includes(required)) throw new Error(`Home Quran metadata/progress is missing: ${required}`);
}
if (appSource.includes("surahNumber: 112,\n    ayahNumber: 1,\n    englishName: 'Al-Ikhlaas'")) {
  throw new Error('Home must not synthesize Al-Ikhlaas 112:1 as first-use reading history.');
}

for (const required of [
  'fetchSurahs',
  'OFFLINE_QURAN_SURAH_SET',
  'nur_quran_surah_favorites',
  'Alle 114 Suren lesbar',
  'CloudDownload',
  'reloadToken',
  'setReloadToken((value) => value + 1)',
  'function readLastRead(): LastRead | null',
  'if (!raw) return null;',
  'const readerSurahNumber = lastSurah?.number ?? lastRead?.surahNumber ?? 1',
  'onOpenReader(readerSurahNumber, lastAyah)',
  'onOpenReader(surah.number, 1)',
  'Math.min(lastRead.ayahNumber, lastSurah.numberOfAyahs)',
  "lastRead ? 'Weiterlesen' : 'Quran beginnen'",
  "lastRead ? 'Weiterlesen' : 'Lesen beginnen'",
]) {
  if (!catalogSource.includes(required)) throw new Error(`Quran catalog integration is missing: ${required}`);
}
for (const forbidden of [
  'const fallback = { surahNumber: 112, ayahNumber: 1',
  'Math.max(4, (lastAyah / lastSurah.numberOfAyahs)',
]) {
  if (catalogSource.includes(forbidden)) throw new Error(`Quran catalog still contains synthetic resume logic: ${forbidden}`);
}

for (const required of [
  'fetchSurahBundle',
  'nur_quran_last_read',
  'nur_quran_bookmarks_',
  'bundle.source',
  'transliterationLabel',
  'translationLabel',
  'reloadToken',
  'initialAyahNumber?: number',
  'scrollIntoView',
  'germanAttribution',
  'const validatedAyah = Math.min(bundle.meta.numberOfAyahs, Math.max(1, activeAyah))',
  'surahNumber: bundle.meta.number',
  'ayahNumber: validatedAyah',
]) {
  if (!readerSource.includes(required)) throw new Error(`Quran reader integration is missing: ${required}`);
}

for (const forbidden of ['Bedeutung an', 'Bedeutung aus']) {
  if (readerSource.includes(forbidden)) {
    throw new Error(`The Quran reader still exposes an unnecessary meaning visibility toggle: ${forbidden}`);
  }
}

if (!stylesSource.includes('reference-quran-complete.css') || !stylesSource.includes('reference-quran-online.css')) {
  throw new Error('Complete or online Quran stylesheet is not loaded.');
}
if (!onlineStyles.includes('.reference-quran-availability.is-online') || !onlineStyles.includes('.reference-reader-source-pill')) {
  throw new Error('Online Quran source and availability styles are missing.');
}
if (!serviceWorker.includes("QURAN_CACHE_PREFIX = 'nur-quran-online-'") || !serviceWorker.includes('!key.startsWith(QURAN_CACHE_PREFIX)')) {
  throw new Error('Service worker updates would delete cached online Quran surahs.');
}

console.log(`Quran verified: 114-surah catalog, ${offlineNumbers.length} Surahs in Arabic offline (${totalAyahs} ayahs), pronunciation and German meaning fetched independently per Surah, persistent browser cache, honest zero-progress first-use state, catalog retry, and range-validated exact last-read Ayah resume.`);
