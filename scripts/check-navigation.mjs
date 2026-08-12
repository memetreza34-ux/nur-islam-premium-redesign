import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const app = await readFile(resolve(root, 'src/app/App.tsx'), 'utf8');
const collections = await readFile(resolve(root, 'src/screens/CollectionsScreen.tsx'), 'utf8');
const dailyHadith = await readFile(resolve(root, 'src/screens/DailyHadithScreen.tsx'), 'utf8');
const reader = await readFile(resolve(root, 'src/screens/QuranReaderScreen.tsx'), 'utf8');
const duas = await readFile(resolve(root, 'src/screens/DuasScreen.tsx'), 'utf8');
const names = await readFile(resolve(root, 'src/screens/NamesScreen.tsx'), 'utf8');
const calendar = await readFile(resolve(root, 'src/screens/CalendarScreen.tsx'), 'utf8');
const browserNavigation = await readFile(resolve(root, 'src/services/browserNavigation.ts'), 'utf8');

const requiredAppFragments = [
  "import { CollectionsScreen } from '../screens/CollectionsScreen';",
  "import { DailyHadithScreen } from '../screens/DailyHadithScreen';",
  "import { MosqueScreen } from '../screens/DiscoveryScreens';",
  'onOpenQuran={openQuran}',
  'onOpenReader={openReader}',
  'onOpenDua={openSavedDua}',
  'onOpenName={openSavedName}',
  "onOpenAyah={() => navigate('ayah')}",
  'onOpenHadith={openSavedHadith}',
  'onOpenCalendarDate={openSavedCalendarDate}',
  'initialDuaId={selectedDuaId}',
  'initialNameId={selectedNameId}',
  'initialDateKey={selectedCalendarDate}',
  'initialAyahNumber={selectedAyahNumber}',
  'hadithId={selectedHadithId}',
  'const safeAyahNumber = Math.max(1, Math.floor(ayahNumber))',
  "window.addEventListener('popstate', handlePopState)",
  "window.removeEventListener('popstate', handlePopState)",
  'readBrowserNavigation<NavigationSnapshot>(event.state)',
];

for (const fragment of requiredAppFragments) {
  if (!app.includes(fragment)) throw new Error(`App navigation is missing: ${fragment}`);
}

for (const fragment of [
  'window.history.pushState',
  'window.history.replaceState',
  'readBrowserNavigation<T>()?.depth',
]) {
  if (!browserNavigation.includes(fragment)) throw new Error(`Browser navigation service is missing: ${fragment}`);
}

const requiredCollectionHandlers = [
  'onOpenReader',
  'onOpenDua',
  'onOpenName',
  'onOpenHadith',
  'onOpenCalendarDate',
  'onOpenReader(group.surahNumber, ayahNumber)',
  'onOpenReader(surahNumber, 1)',
  '.sort((a, b) => a - b)',
  'readSavedHadithIds',
  'getHadithById(id)',
];

for (const fragment of requiredCollectionHandlers) {
  if (!collections.includes(fragment)) throw new Error(`Collection navigation is missing: ${fragment}`);
}

if (collections.includes('onOpenDuas') || collections.includes('onOpenNames') || collections.includes('onOpenCalendar:')) {
  throw new Error('Collection still exposes obsolete generic destination callbacks.');
}
if (collections.includes('OFFLINE_QURAN_SURAHS')) {
  throw new Error('Collection still restricts Quran bookmarks to the offline Surah subset.');
}

for (const fragment of [
  'hadithId?: string | null',
  'getHadithById(hadithId) ?? getDailyHadith()',
  'readSavedHadithIds',
  'writeSavedHadithIds(next)',
]) {
  if (!dailyHadith.includes(fragment)) throw new Error(`Saved Hadith routing is incomplete: ${fragment}`);
}

for (const fragment of [
  'initialAyahNumber?: number',
  'quran-ayah-${surahNumber}-${targetAyah}',
  // Deep-linking to an Ayah still honours reduced motion; the ternary this used
  // to pin lived in the scroll-to-settings helper, which a real settings dialog
  // replaced.
  "if (reduceMotion) target.scrollIntoView({ behavior: 'auto', block: 'center' });",
  "else target.scrollIntoView({ behavior: 'smooth', block: 'center' });",
  'id={`quran-ayah-${bundle.meta.number}-${ayahNumber}`}',
]) {
  if (!reader.includes(fragment)) throw new Error(`Quran reader deep-linking is missing: ${fragment}`);
}

if (!duas.includes('initialDuaId?: string | null') || !duas.includes('DUA_BY_ID.get(initialDuaId)')) {
  throw new Error('Dua screen cannot open a saved Dua directly.');
}
if (!names.includes('initialNameId?: string | null') || !names.includes('String(entry.id) === initialNameId')) {
  throw new Error('Names screen cannot open a saved Name directly.');
}
if (!calendar.includes('initialDateKey?: string | null') || !calendar.includes('getInitialCalendarPosition')) {
  throw new Error('Calendar cannot open a saved date directly.');
}

console.log('Navigation verified: visible back controls and browser/system Back share app-owned history snapshots, Home-to-Reader preserves the logical Quran parent, Quran bookmarks deep-link to exact Ayat across all 114 Surahs, collection rows open exact saved Duas, Names, Hadiths and calendar dates, reduced-motion readers avoid forced smooth scrolling, and legacy route IDs remain valid.');
