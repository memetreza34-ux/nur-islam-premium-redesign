import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const styleIndex = await readFile(resolve(root, 'src/styles.css'), 'utf8');
const touch = await readFile(resolve(root, 'src/styles/touch-target-consistency.css'), 'utf8');
const quran = await readFile(resolve(root, 'src/styles/reference-quran-complete.css'), 'utf8');
const names = await readFile(resolve(root, 'src/styles/reference-names-complete.css'), 'utf8');
const calendar = await readFile(resolve(root, 'src/styles/calendar.css'), 'utf8');
const prayerCalendar = await readFile(resolve(root, 'src/styles/reference-prayer-calendar.css'), 'utf8');
const core = await readFile(resolve(root, 'src/styles/reference-core-screens.css'), 'utf8');
const assistant = await readFile(resolve(root, 'src/styles/reference-assistant.css'), 'utf8');
const installPrompt = await readFile(resolve(root, 'src/styles/reference-install-prompt.css'), 'utf8');
const prayerReminders = await readFile(resolve(root, 'src/styles/reference-prayer-reminders.css'), 'utf8');

const touchImport = "@import './styles/touch-target-consistency.css';";
const finalImport = "@import './styles/visual-consistency.css';";
const touchIndex = styleIndex.indexOf(touchImport);
const finalIndex = styleIndex.indexOf(finalImport);
if (touchIndex < 0 || finalIndex < 0 || touchIndex > finalIndex) {
  throw new Error('Touch target consistency must load before the final visual guardrails.');
}

for (const requirement of [
  '--compact-touch-target: 44px',
  'width: var(--compact-touch-target) !important',
  'min-width: var(--compact-touch-target)',
  'height: var(--compact-touch-target) !important',
  'min-height: var(--compact-touch-target)',
  'width: 18px',
  'height: 18px',
  '@media (hover: hover)',
  '@media (hover: none)',
  '@media (max-width: 370px)',
  '@media (prefers-reduced-motion: reduce)',
]) {
  if (!touch.includes(requirement)) throw new Error(`Touch target rule is missing: ${requirement}`);
}

for (const selector of [
  '.reference-quran-favorite',
  '.reference-name-state',
  '.reference-name-list--complete .reference-name-heart',
  '.calendar-month-nav > button',
  '.calendar-entry-row > button',
  '.favorite-button',
  '.reference-dhikr-remembrance button',
  '.reference-qibla-location button',
  '.reference-assistant-input button',
  '.reference-install-prompt__close',
  '.reference-install-prompt__action',
  '.reference-prayer-reminder-banner__close',
  '.reference-prayer-reminder-banner__open',
  '.reference-dua-card__top button',
  '.reference-dua-card footer button',
  '.selected-date-card button',
  '.reference-nearby-label button',
  '.reference-prayer-complete-replay',
  '.reference-modal-close',
  '.reference-learning-completion-modal__close',
  '.prayer-completion-modal__close',
  '.reference-prayer-settings-modal__close',
  '.reference-mosque-detail-modal__close',
  '.reference-profile-modal__close',
  '.learn-modal__close',
]) {
  if (!touch.includes(selector)) throw new Error(`Compact touch target coverage is missing: ${selector}`);
}

for (const gridRule of [
  '.reference-quran-list--catalog > article',
  'grid-template-columns: minmax(0, 1fr) var(--compact-touch-target) !important',
  '.reference-name-list--complete > article',
  'grid-template-columns: minmax(0, 1fr) var(--compact-touch-target) var(--compact-touch-target) !important',
  '.calendar-month-nav',
  '.calendar-entry-row',
  '.reference-assistant-input',
  'grid-template-columns: minmax(0, 1fr) var(--compact-touch-target) var(--compact-touch-target) !important',
  '.reference-prayer-reminder-banner',
  'grid-template-columns: 44px minmax(0, 1fr) auto var(--compact-touch-target) !important',
]) {
  if (!touch.includes(gridRule)) throw new Error(`Parent grid is not aligned to 44px compact controls: ${gridRule}`);
}

if (!quran.includes('width: 36px') || !names.includes('width: 34px') || !prayerCalendar.includes('width: 36px') || !calendar.includes('width:38px') || !core.includes('width: 39px') || !assistant.includes('width: 38px') || !installPrompt.includes('width: 28px') || !installPrompt.includes('min-height: 37px') || !prayerReminders.includes('width:29px') || !prayerReminders.includes('min-height:34px')) {
  throw new Error('Expected legacy compact control baselines changed; review the centralized 44px overrides.');
}

console.log('Touch target consistency verified: compact Quran, Names, calendar, Dua, Dhikr, Qibla, assistant, install prompt, prayer reminder, prayer and modal controls use 44px hit areas, and their parent grids reserve matching columns.');
