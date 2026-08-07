import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const styleIndex = await readFile(resolve(root, 'src/styles.css'), 'utf8');
const filters = await readFile(resolve(root, 'src/styles/filter-control-consistency.css'), 'utf8');
const discovery = await readFile(resolve(root, 'src/styles/reference-discovery.css'), 'utf8');
const quran = await readFile(resolve(root, 'src/QuranScreen.tsx'), 'utf8');
const duas = await readFile(resolve(root, 'src/DuasScreen.tsx'), 'utf8');
const names = await readFile(resolve(root, 'src/NamesScreen.tsx'), 'utf8');
const collections = await readFile(resolve(root, 'src/CollectionsScreen.tsx'), 'utf8');
const mosque = await readFile(resolve(root, 'src/MosqueScreen.tsx'), 'utf8');

const filterImport = "@import './styles/filter-control-consistency.css';";
const finalImport = "@import './styles/visual-consistency.css';";
const filterIndex = styleIndex.indexOf(filterImport);
const finalIndex = styleIndex.indexOf(finalImport);
if (filterIndex < 0 || finalIndex < 0 || filterIndex > finalIndex) {
  throw new Error('Filter control consistency must load before the final visual guardrails.');
}

for (const requirement of [
  '.reference-input-search',
  'grid-template-columns: 22px minmax(0, 1fr) 20px',
  'min-height: 48px',
  '.reference-input-search:focus-within',
  '.reference-input-search input',
  'min-height: 44px',
  'font-size: var(--text-body-small, .62rem)',
  '.reference-filter-tabs',
  'overflow-x: auto',
  'overflow-y: hidden',
  'scroll-snap-type: x proximity',
  'overscroll-behavior-inline: contain',
  'touch-action: pan-x',
  '.reference-filter-tabs button',
  'flex: 0 0 auto !important',
  'min-height: 44px',
  'min-width: max-content',
  'border-radius: 999px',
  'font-size: var(--text-caption, .58rem)',
  'white-space: nowrap',
  '.reference-filter-tabs button.is-active',
  'background: linear-gradient(135deg, #efd394, #c9953a)',
  '.reference-filter-tabs button:focus-visible',
  '@media (max-width: 370px)',
  '@media (prefers-reduced-motion: reduce)',
]) {
  if (!filters.includes(requirement)) throw new Error(`Search/filter consistency rule is missing: ${requirement}`);
}

if (!discovery.includes('min-height: 35px')) {
  throw new Error('Expected legacy 35px filter-chip baseline changed; review the centralized 44px override.');
}

const screens = [
  ['QuranScreen.tsx', quran],
  ['DuasScreen.tsx', duas],
  ['NamesScreen.tsx', names],
  ['CollectionsScreen.tsx', collections],
  ['MosqueScreen.tsx', mosque],
];

for (const [name, source] of screens) {
  if (!source.includes('reference-input-search') && name !== 'CollectionsScreen.tsx') {
    throw new Error(`${name} is missing the shared search-field pattern.`);
  }
  if (!source.includes('reference-filter-tabs') && name !== 'MosqueScreen.tsx') {
    throw new Error(`${name} is missing the shared filter-tab pattern.`);
  }
}

console.log('Search and filter controls verified: list screens use a shared focused search field, 44px pill tabs, horizontal scroll snapping, non-stretching labels, visible active states, and narrow-screen behavior.');
