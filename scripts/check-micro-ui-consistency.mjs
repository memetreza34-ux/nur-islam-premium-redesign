import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const styleIndex = await readFile(resolve(root, 'src/styles.css'), 'utf8');
const micro = await readFile(resolve(root, 'src/styles/micro-ui-consistency.css'), 'utf8');
const profile = await readFile(resolve(root, 'src/styles/reference-profile.css'), 'utf8');
const assistant = await readFile(resolve(root, 'src/styles/reference-assistant.css'), 'utf8');
const prayerCalendar = await readFile(resolve(root, 'src/styles/reference-prayer-calendar.css'), 'utf8');
const quran = await readFile(resolve(root, 'src/styles/reference-quran-complete.css'), 'utf8');
const duas = await readFile(resolve(root, 'src/styles/reference-duas-complete.css'), 'utf8');
const names = await readFile(resolve(root, 'src/styles/reference-names-complete.css'), 'utf8');
const installPrompt = await readFile(resolve(root, 'src/styles/reference-install-prompt.css'), 'utf8');
const systemLayer = await readFile(resolve(root, 'src/styles/reference-system-layer.css'), 'utf8');
const prayerReminders = await readFile(resolve(root, 'src/styles/reference-prayer-reminders.css'), 'utf8');

const microImport = "@import './styles/micro-ui-consistency.css';";
const finalImport = "@import './styles/visual-consistency.css';";
const microIndex = styleIndex.indexOf(microImport);
const finalIndex = styleIndex.indexOf(finalImport);
if (microIndex < 0 || finalIndex < 0 || microIndex > finalIndex) {
  throw new Error('Micro UI consistency must load before the final visual guardrails.');
}

for (const token of [
  '--text-micro: .54rem',
  '--text-caption: .58rem',
  '--text-body-small: .62rem',
  '--compact-line-height: 1.42',
  '--icon-box-small: 36px',
  '--icon-box-medium: 40px',
]) {
  if (!micro.includes(token)) throw new Error(`Micro UI token is missing: ${token}`);
}

for (const selector of [
  '.reference-profile-greeting p',
  '.reference-profile-row__copy small',
  '.reference-assistant-safety small',
  '.prayer-location-card small',
  '.calendar-weekdays span',
  '.reference-prayer-live-status small',
  '.reference-prayer-reminder-banner__copy small',
  '.reference-prayer-reminder-banner__copy em',
  '.reference-mosque-live-status small',
  '.reference-core-access-grid small',
  '.reference-network-status small',
  '.reference-install-prompt__copy .overline',
  '.reference-install-prompt__copy small',
  '.reference-install-prompt__ios span',
  '.reference-quran-library-status small',
  '.reference-quran-results small',
  '.reference-quran-list__copy small',
  '.reference-quran-availability',
  '.reference-reader-screen--dynamic .reference-reader-verse blockquote small',
  '.reference-name-progress small',
  '.reference-name-list__copy small',
  '.reference-name-modal__notice',
  '.reference-dua-progress small',
  '.reference-dua-results-label small',
  '.reference-dua-card__content blockquote small',
  '.reference-dua-modal__source em',
  '.reference-learning-sources__notice',
  '.reference-prayer-lesson-steps em',
]) {
  if (!micro.includes(selector)) throw new Error(`Readable micro-copy coverage is missing: ${selector}`);
}

for (const requirement of [
  '.hero-pill',
  'min-height: 24px',
  'border-radius: 999px',
  'white-space: normal',
  '.reference-profile-row__icon',
  '.reference-name-progress__icon',
  '.reference-dua-progress > span:first-child',
  '.reference-install-prompt__action',
  '.reference-prayer-reminder-banner__open',
  'width: var(--icon-box-medium)',
  'overflow-wrap: anywhere',
  '@media (max-width: 370px)',
  'grid-template-columns: 50px minmax(0, 1fr) 40px',
]) {
  if (!micro.includes(requirement)) throw new Error(`Micro UI rhythm requirement is missing: ${requirement}`);
}

if (!profile.includes('font-size: .51rem') || !assistant.includes('font-size: .49rem') || !prayerCalendar.includes('font-size: .49rem')) {
  throw new Error('Expected profile/assistant/prayer legacy micro-copy baselines changed; review the centralized overrides.');
}
if (!quran.includes('font-size: .4rem') || !duas.includes('font-size: .47rem') || !names.includes('font-size: .48rem')) {
  throw new Error('Expected Quran/Dua/Names legacy micro-copy baselines changed; review the centralized overrides.');
}
if (!installPrompt.includes('font-size: .46rem') || !installPrompt.includes('font-size: .47rem') || !systemLayer.includes('font-size: .46rem') || !prayerReminders.includes('font-size:.49rem')) {
  throw new Error('Expected global install/network/reminder micro-copy baselines changed; review the centralized overrides.');
}

console.log('Micro UI consistency verified: secondary text across profile, assistant, prayer, reminder banner, calendar, mosque, Quran, Duas, Names, install/network UI, and learning uses one readable scale with aligned compact icon and badge geometry.');
