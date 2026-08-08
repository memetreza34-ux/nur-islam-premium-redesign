import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const app = await readFile(resolve(root, 'src/App.tsx'), 'utf8');
const more = await readFile(resolve(root, 'src/MoreScreen.tsx'), 'utf8');
const assistant = await readFile(resolve(root, 'src/AssistantScreen.tsx'), 'utf8');
const collections = await readFile(resolve(root, 'src/CollectionsScreen.tsx'), 'utf8');
const styles = await readFile(resolve(root, 'src/styles.css'), 'utf8');

for (const requirement of [
  '<div className="brand-lockup" aria-label="Nur Islam">',
  'reference-choice--static',
  'Deutsch ist ausgewählt',
  'setInfoOpen(true)',
  'Was dieser Assistent wirklich kann',
  '.reference-choice--static',
  'cursor: default',
]) {
  const source = requirement.includes('brand-lockup') ? app
    : requirement === 'setInfoOpen(true)' || requirement.includes('Assistent') ? assistant
      : requirement.startsWith('.') || requirement === 'cursor: default' ? styles
        : more;
  if (!source.includes(requirement)) throw new Error(`Static-control contract is missing: ${requirement}`);
}

for (const requirement of [
  '<RotateCcw size={20} />',
  'aria-label="Sammlungsfilter zurücksetzen"',
  "disabled={filter === 'Alle'}",
  "onClick={() => setFilter('Alle')}",
]) {
  if (!collections.includes(requirement)) throw new Error(`Collection filter reset contract is missing: ${requirement}`);
}

for (const forbidden of [
  '<button className="brand-lockup"',
  "showToast('Nur Islam')",
]) {
  if (app.includes(forbidden)) throw new Error(`Home branding regressed to a fake action: ${forbidden}`);
}

if (more.includes('<button className="reference-choice reference-choice--active"><Languages')) {
  throw new Error('The single available language is rendered as a no-op button again.');
}

if (collections.includes('aria-label="Alle gespeicherten Inhalte anzeigen"><Search')) {
  throw new Error('Collections regressed to a search icon that only resets the filter.');
}

console.log('Static controls verified: branding and one-choice statuses are non-interactive, the Assistant info icon opens a real modal, and Collections uses an honest disabled-aware filter reset instead of a fake search action.');
