import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();

const primaryScreens = [
  'AssistantScreen.tsx',
  'CalendarScreen.tsx',
  'CollectionsScreen.tsx',
  'DhikrScreen.tsx',
  'DuasScreen.tsx',
  'LearnScreen.tsx',
  'MoreScreen.tsx',
  'MosqueScreen.tsx',
  'NamesScreen.tsx',
  'PrayerScreen.tsx',
  'QiblaScreen.tsx',
  'QuranScreen.tsx',
];

for (const fileName of primaryScreens) {
  const source = await readFile(resolve(root, 'src/screens', fileName), 'utf8');
  if (!source.includes('className="screen')) {
    throw new Error(`${fileName} does not use the shared screen layout class.`);
  }
  if (!source.includes('<header className="reference-screen-header">')) {
    throw new Error(`${fileName} does not use the shared reference screen header.`);
  }
  if (!source.includes('className="icon-button"') || !source.includes('aria-label=')) {
    throw new Error(`${fileName} is missing the shared labeled header control pattern.`);
  }
}

const app = await readFile(resolve(root, 'src/app/App.tsx'), 'utf8');
const guardrails = await readFile(resolve(root, 'src/styles/visual-consistency.css'), 'utf8');

for (const destination of [
  'home',
  'quran',
  'dhikr',
  'qibla',
  'profile',
  'prayer',
  'calendar',
  'learn',
  'duas',
  'names',
  'mosques',
  'collections',
  'assistant',
]) {
  if (!app.includes(`'${destination}'`)) {
    throw new Error(`Bottom-navigation screen contract is missing destination: ${destination}`);
  }
}

for (const detailDestination of ['reader', 'ayah', 'hadith', 'wudu', 'salah']) {
  const navigationSet = app.slice(
    app.indexOf('const screensWithBottomNavigation'),
    app.indexOf('function isLegacyTab'),
  );
  if (navigationSet.includes(`'${detailDestination}'`)) {
    throw new Error(`Detail destination must not keep the bottom navigation: ${detailDestination}`);
  }
}

for (const requirement of [
  'grid-template-columns: var(--tap-target) minmax(0, 1fr) var(--tap-target)',
  'min-height: 58px',
  'font-size: 1.55rem',
  'text-overflow: ellipsis',
  'white-space: nowrap',
]) {
  if (!guardrails.includes(requirement)) {
    throw new Error(`Shared header geometry is incomplete: ${requirement}`);
  }
}

if (!app.includes("'app-shell app-shell--detail'")) {
  throw new Error('Detail screens do not use the dedicated detail shell.');
}

console.log(`Screen layout contract verified: ${primaryScreens.length} primary screens share one header geometry, labeled controls, and consistent bottom-navigation/detail-shell behavior.`);
