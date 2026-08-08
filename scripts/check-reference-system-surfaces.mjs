import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const read = (path) => readFile(resolve(root, path), 'utf8');

const [navigation, systemSurfaces, modalInput, runtimeLock, finalLock, styleIndex] = await Promise.all([
  read('src/styles/navigation.css'),
  read('src/styles/premium-system-surfaces-lock.css'),
  read('src/styles/premium-mobile-modal-input-lock.css'),
  read('src/styles/premium-visual-runtime-lock.css'),
  read('src/styles/premium-reference-geometry-lock.css'),
  read('src/styles.css'),
]);

function requireTokens(source, label, tokens) {
  for (const token of tokens) {
    if (!source.includes(token)) throw new Error(`${label} reference token is missing: ${token}`);
  }
}

requireTokens(navigation, 'Bottom navigation', [
  'background: rgba(0, 27, 22, 0.92)',
  'color: rgba(246, 235, 214, 0.64)',
  'color: #f2d79a',
  'stroke-width: 1.75',
  'border-radius: 26px',
  'border-radius: 18px',
  'border-radius: 13px',
]);

requireTokens(systemSurfaces, 'System surfaces', [
  'border-color: rgba(226, 191, 119, .2) !important',
  'linear-gradient(145deg, rgba(7, 55, 43, .975), rgba(0, 18, 15, .995)) !important',
  '.reference-network-status',
  'border-radius: 18px !important',
  '.reference-prayer-reminder-banner',
  '.reference-calendar-reminder-banner',
  'border-radius: 28px !important',
  '.reference-install-prompt',
  'background: #001b16 !important',
  'color: #f6ebd6',
  'color: #e2bf77',
  'linear-gradient(165deg, #042a21 0%, #001b16 58%, #00120f 100%) !important',
  'color: rgba(145, 168, 158, .8) !important',
]);

requireTokens(modalInput, 'Modal/input surfaces', [
  'border: 1px solid rgba(226, 191, 119, .27) !important',
  'linear-gradient(150deg, #0d5743, #07372b 64%, #00120f) !important',
  'border-radius: 28px !important',
  'background: rgba(0, 27, 22, .88) !important',
  'rgba(0, 18, 15, .79) !important',
  'border-radius: 18px !important',
  'border-color: rgba(226, 191, 119, .4) !important',
  'rgba(0, 18, 15, .94) !important',
]);

requireTokens(runtimeLock, 'No-blur fallback', [
  'background-color: rgba(0, 27, 22, .97) !important',
]);

for (const selector of [
  '.reference-prayer-reminder-banner',
  '.reference-calendar-reminder-banner',
  '.reference-install-prompt',
  '.reference-network-status',
  '.reference-prayer-reminder-banner__open',
  '.reference-prayer-reminder-banner__close',
  '.reference-install-prompt__close',
  '.reference-install-prompt__action',
  '.toast',
  '.reference-profile-modal',
  '.reference-dua-modal',
  '.reference-name-modal',
  '.reference-dhikr-stats-modal',
  '.reference-prayer-settings-modal',
  '.prayer-completion-modal',
  '.reference-learning-completion-modal',
  '.reference-learning-plan-modal',
  '.calendar-modal',
  '.learn-modal',
  '.reference-mosque-detail-modal',
  '.reference-prayer-course-complete > section',
  '.reference-input-search',
  '.reference-assistant-input',
  '.reference-legacy-search',
  '.reference-fasting-reminder-settings input',
  '.reference-zakat-calculator input',
]) {
  if (!finalLock.includes(selector)) throw new Error(`Final reference geometry does not protect system/modal surface: ${selector}`);
}

const importedLayers = [...styleIndex.matchAll(/@import '\.\/styles\/([^']+)';/g)]
  .map((match) => match[1]);
if (importedLayers.at(-1) !== 'premium-reference-geometry-lock.css') {
  throw new Error('System-surface geometry is unsafe because the final reference lock is no longer the last stylesheet import.');
}

for (const stale of [
  'background: rgba(2, 25, 19, 0.9)',
  'stroke-width: 1.8',
  'background-color: rgba(3, 27, 21, .97)',
  'linear-gradient(165deg, #09271f 0%, #03140f 58%, #010806 100%)',
  'linear-gradient(150deg, #104334, #04231b 64%, #02130f)',
  'background: rgba(3, 27, 21, .88)',
  'border-radius: 20px !important',
]) {
  if (navigation.includes(stale) || systemSurfaces.includes(stale) || modalInput.includes(stale) || runtimeLock.includes(stale)) {
    throw new Error(`Visible system/modal surface still contains a stale pre-reference value: ${stale}`);
  }
}

console.log('Reference system surfaces verified: navigation, network/reminder/install/toast/error, modals, inputs and no-blur fallback use the emerald/gold/cream palette, 1.75 icon weight and protected 18/28 geometry.');
