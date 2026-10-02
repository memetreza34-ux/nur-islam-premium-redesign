import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const styleIndex = await readFile(resolve(root, 'src/styles.css'), 'utf8');
const overlay = await readFile(resolve(root, 'src/styles/overlay-safety.css'), 'utf8');
const navigationClearance = await readFile(resolve(root, 'src/styles/overlay-navigation-clearance.css'), 'utf8');
const profile = await readFile(resolve(root, 'src/styles/reference-profile.css'), 'utf8');
const learning = await readFile(resolve(root, 'src/styles/reference-learning-courses.css'), 'utf8');
const prayer = await readFile(resolve(root, 'src/styles/reference-prayer-learning-completion.css'), 'utf8');
const prayerTimes = await readFile(resolve(root, 'src/styles/reference-live-prayer-times.css'), 'utf8');
const mosque = await readFile(resolve(root, 'src/styles/reference-mosque-live.css'), 'utf8');

if (!styleIndex.includes("@import './styles/overlay-safety.css';")) {
  throw new Error('Overlay safety stylesheet is not loaded.');
}
if (styleIndex.indexOf("@import './styles/overlay-safety.css';") > styleIndex.indexOf("@import './styles/visual-consistency.css';")) {
  throw new Error('Overlay safety must load before the final visual consistency layer.');
}
if (!styleIndex.includes("@import './styles/overlay-navigation-clearance.css';")) {
  throw new Error('Overlay navigation clearance stylesheet is not loaded.');
}
if (styleIndex.indexOf("@import './styles/overlay-navigation-clearance.css';") < styleIndex.indexOf("@import './styles/nur-design-system.css';")) {
  throw new Error('Overlay navigation clearance must load after the final navigation geometry.');
}

const expectedExistingOverlays = [
  [profile, '.reference-profile-modal'],
  [learning, '.reference-learning-completion-backdrop'],
  [prayer, '.prayer-completion-backdrop'],
  [prayerTimes, '.reference-prayer-settings-backdrop'],
];
for (const [source, selector] of expectedExistingOverlays) {
  if (!source.includes(selector)) throw new Error(`Expected overlay implementation is missing: ${selector}`);
}

const requiredBackdropSelectors = [
  '.reference-modal-backdrop',
  '.reference-prayer-settings-backdrop',
  '.reference-learning-completion-backdrop',
  '.reference-prayer-course-complete',
  '.prayer-completion-backdrop',
  '.calendar-modal-backdrop',
];
for (const selector of requiredBackdropSelectors) {
  if (!overlay.includes(selector)) throw new Error(`Overlay safety does not cover backdrop: ${selector}`);
  if (!navigationClearance.includes(selector)) throw new Error(`Bottom navigation clearance does not cover backdrop: ${selector}`);
}

for (const requirement of [
  '--overlay-navigation-clearance',
  'var(--ds-nav-height, 68px)',
  'padding-bottom: var(--overlay-navigation-clearance) !important',
  'max-height: calc(100dvh',
  'scroll-padding-bottom: 24px',
  'scrollbar-width: none !important',
  "::-webkit-scrollbar",
  'display: none',
  'position: absolute !important',
  'right: 18px !important',
  '@media (max-height: 680px)',
]) {
  if (!navigationClearance.includes(requirement)) throw new Error(`Bottom navigation guardrail is missing: ${requirement}`);
}

const requiredModalSelectors = [
  "> [role='dialog']",
  '.reference-prayer-course-complete > section',
];
for (const selector of requiredModalSelectors) {
  if (!overlay.includes(selector)) throw new Error(`Overlay safety does not cover modal: ${selector}`);
}

for (const requirement of [
  'z-index: 160 !important',
  'isolation: isolate',
  'overflow-y: auto',
  'overscroll-behavior: contain',
  'env(safe-area-inset-top)',
  'env(safe-area-inset-bottom)',
  'max-height: calc(100dvh',
  'width: 44px !important',
  'height: 44px !important',
  'position: absolute !important',
  'scrollbar-width: none',
  '@media (max-width: 350px)',
  'grid-template-columns: 1fr !important',
  '@media (max-height: 680px)',
  'align-items: center !important',
  '@media (prefers-reduced-motion: reduce)',
]) {
  if (!overlay.includes(requirement)) throw new Error(`Overlay viewport guardrail is missing: ${requirement}`);
}

const closeSelectors = [
  '.reference-modal-close',
  '.reference-prayer-settings-modal__close',
  '.reference-mosque-detail-modal__close',
  '.reference-learning-completion-modal__close',
  '.prayer-completion-modal__close',
];
for (const selector of closeSelectors) {
  if (!overlay.includes(selector)) throw new Error(`44px close control is not covered: ${selector}`);
}

console.log('Overlay safety verified: all dialog families stay centered above the app shell, scrollable, safe-area aware, and reachable on short/narrow screens.');
