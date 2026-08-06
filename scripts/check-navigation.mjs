import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const app = await readFile(resolve(root, 'src/App.tsx'), 'utf8');
const collections = await readFile(resolve(root, 'src/CollectionsScreen.tsx'), 'utf8');

const requiredAppFragments = [
  "import { CollectionsScreen } from './CollectionsScreen';",
  "import { MosqueScreen } from './DiscoveryScreens';",
  "onOpenQuran={goQuran}",
  "onOpenReader={openReader}",
  "onOpenDuas={() => setActiveTab('duas')}",
  "onOpenNames={() => setActiveTab('names')}",
  "onOpenAyah={() => setActiveTab('ayah')}",
  "onOpenHadith={() => setActiveTab('hadith')}",
  "onOpenCalendar={() => setActiveTab('calendar')}",
  "onNavigate('legacy:ummah')",
];

for (const fragment of requiredAppFragments) {
  if (!app.includes(fragment)) {
    throw new Error(`App navigation is missing: ${fragment}`);
  }
}

if (app.includes("legacy:ummah-map")) {
  throw new Error('Invalid legacy route remains: legacy:ummah-map');
}

const requiredCollectionHandlers = [
  'onClick={onOpenQuran}',
  'onOpenReader(group.surahNumber)',
  'onOpenReader(surahNumber)',
  'onClick={onOpenDuas}',
  'onClick={onOpenNames}',
  'onClick={onOpenAyah}',
  'onClick={onOpenHadith}',
  'onClick={onOpenCalendar}',
];

for (const fragment of requiredCollectionHandlers) {
  if (!collections.includes(fragment)) {
    throw new Error(`Collection navigation is missing: ${fragment}`);
  }
}

if (collections.includes("flash(`${dua.title} geöffnet`)")) {
  throw new Error('Dua collection rows still use the obsolete toast-only interaction.');
}

console.log('Navigation verified: collections open real screens and all legacy route IDs are valid.');
