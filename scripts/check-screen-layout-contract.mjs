import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();

const primaryScreens = [
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
  const header = source.match(/<header className="reference-screen-header(?: reference-screen-header--banner)?">([\s\S]*?)<\/header>/)?.[1];
  if (!header) {
    throw new Error(`${fileName} does not use the shared reference screen header.`);
  }
  const sourceInfoHeader = fileName === 'QuranScreen.tsx' && source.includes('<SourceInfo title="Lesen & Offline">');
  if (fileName !== 'LearnScreen.tsx' && !sourceInfoHeader && (!source.includes('className="icon-button"') || !source.includes('aria-label='))) {
    throw new Error(`${fileName} is missing the shared labeled header control pattern.`);
  }
  if (['PrayerScreen.tsx', 'QuranScreen.tsx', 'LearnScreen.tsx', 'MoreScreen.tsx'].includes(fileName)) {
    if (fileName === 'LearnScreen.tsx' && (header?.includes('<button') || source.includes('learningPlanOpen'))) throw new Error('Learning must open lessons directly without a plan or header settings.');
    if (!header || /onClick=\{onBack\}|aria-label="Zurück/.test(header)) {
      throw new Error(`${fileName}: primary tabs must use bottom navigation, not a header Back button.`);
    }
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
]) {
  if (!guardrails.includes(requirement)) {
    throw new Error(`Shared header geometry is incomplete: ${requirement}`);
  }
}

for (const selector of ['.reference-screen-header h1', '.reference-screen-header .overline']) {
  const rule = guardrails.split(`${selector} {`)[1]?.split('}')[0] ?? '';
  for (const declaration of ['overflow: visible', 'white-space: normal', 'text-wrap: balance']) {
    if (!rule.includes(declaration)) throw new Error(`Shared header must keep complete wrapping labels: ${selector} ${declaration}`);
  }
}

if (!app.includes("'app-shell app-shell--detail'")) {
  throw new Error('Detail screens do not use the dedicated detail shell.');
}

const shell = await readFile(resolve(root, 'src/styles/reference-shell.css'), 'utf8');
const headerFlow = shell.split('.reference-screen-header {')[1]?.split('}')[0] ?? '';
if (!headerFlow.includes('position: static') || /position:\s*(sticky|fixed)/.test(headerFlow)) {
  throw new Error('Screen headers must scroll with the page.');
}

console.log(`Screen layout contract verified: ${primaryScreens.length} primary screens share one header geometry, labeled controls, and consistent bottom-navigation/detail-shell behavior.`);
