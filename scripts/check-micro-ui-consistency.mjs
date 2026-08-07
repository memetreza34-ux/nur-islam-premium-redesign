import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const styleIndex = await readFile(resolve(root, 'src/styles.css'), 'utf8');
const micro = await readFile(resolve(root, 'src/styles/micro-ui-consistency.css'), 'utf8');
const profile = await readFile(resolve(root, 'src/styles/reference-profile.css'), 'utf8');
const assistant = await readFile(resolve(root, 'src/styles/reference-assistant.css'), 'utf8');
const prayerCalendar = await readFile(resolve(root, 'src/styles/reference-prayer-calendar.css'), 'utf8');

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
  '.reference-mosque-live-status small',
  '.reference-core-access-grid small',
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
  'width: var(--icon-box-medium)',
  'overflow-wrap: anywhere',
  '@media (max-width: 370px)',
  'grid-template-columns: 50px minmax(0, 1fr) 40px',
]) {
  if (!micro.includes(requirement)) throw new Error(`Micro UI rhythm requirement is missing: ${requirement}`);
}

if (!profile.includes('font-size: .51rem') || !assistant.includes('font-size: .49rem') || !prayerCalendar.includes('font-size: .49rem')) {
  throw new Error('Expected legacy micro-copy baselines changed; review the centralized overrides.');
}

console.log('Micro UI consistency verified: readable secondary text, unified compact labels, aligned icon boxes, badge rhythm, and narrow-screen profile spacing are covered by a late cross-screen layer.');
