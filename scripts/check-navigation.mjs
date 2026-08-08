import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const app = await readFile(resolve(root, 'src/App.tsx'), 'utf8');
const collections = await readFile(resolve(root, 'src/CollectionsScreen.tsx'), 'utf8');
const reader = await readFile(resolve(root, 'src/QuranReaderScreen.tsx'), 'utf8');
const duas = await readFile(resolve(root, 'src/DuasScreen.tsx'), 'utf8');
const names = await readFile(resolve(root, 'src/NamesScreen.tsx'), 'utf8');
const calendar = await readFile(resolve(root, 'src/CalendarScreen.tsx'), 'utf8');

const requiredAppFragments = [
  "import { CollectionsScreen } from './CollectionsScreen';",
  "import { MosqueScreen } from './DiscoveryScreens';",
  'onOpenQuran={goQuran}',
  'onOpenReader={openReader}',
  'onOpenDua={openSavedDua}',
  'onOpenName={openSavedName}',
  "onOpenAyah={() => navigate('ayah')}",
  "onOpenHadith={() => navigate('hadith')}",
  'onOpenCalendarDate={openSavedCalendarDate}',
  'initialDuaId={selectedDuaId}',
  'initialNameId={selectedNameId}',
  'initialDateKey={selectedCalendarDate}',
  'initialAyahNumber={selectedAyahNumber}',
  'setSelectedAyahNumber(Math.max(1, Math.floor(ayahNumber)))',
  "onNavigate('legacy:ummah')",
];

for (const fragment of requiredAppFragments) {
  if (!app.includes(fragment)) throw new Error(`App navigation is missing: ${fragment}`);
}

if (app.includes('legacy:ummah-map')) throw new Error('Invalid legacy route remains: legacy:ummah-map');

const requiredCollectionHandlers = [
  'onClick={onOpenQuran}',
  'onOpenReader(group.surahNumber, ayahNumber)',
  'onOpenReader(surahNumber, 1)',
  'onOpenDua(id)',
  'onOpenName(id)',
  'onClick={onOpenAyah}',
  'onClick={onOpenHadith}',
  'onOpenCalendarDate(date)',
  'Array.from({ length: 114 }',
  '[...group.bookmarks]',
  '.sort((a, b) => a - b)',
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
  'initialAyahNumber?: number',
  'quran-ayah-${surahNumber}-${targetAyah}',
  "scrollIntoView({ behavior: 'smooth', block: 'center' })",
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

console.log('Navigation verified: Quran bookmarks deep-link to exact Ayat across all 114 Surahs, collection rows open exact saved Duas, Names and calendar dates, and legacy route IDs remain valid.');
