import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const read = (path) => readFile(resolve(root, path), 'utf8');

const [navigation, referenceShell, entrySystem, brandEntryArt, systemSurfaces, modalInput, assistantBase, profileBase, profileBrand, runtimeLock, finalLock, styleIndex] = await Promise.all([
  read('src/styles/navigation.css'),
  read('src/styles/reference-shell.css'),
  read('src/styles/premium-entry-system.css'),
  read('src/styles/premium-brand-entry-art-lock.css'),
  read('src/styles/premium-system-surfaces-lock.css'),
  read('src/styles/premium-mobile-modal-input-lock.css'),
  read('src/styles/reference-assistant.css'),
  read('src/styles/reference-profile.css'),
  read('src/styles/premium-profile-brand-lock.css'),
  read('src/styles/premium-visual-runtime-lock.css'),
  read('src/styles/premium-reference-geometry-lock.css'),
  read('src/styles.css'),
]);

function requireTokens(source, label, tokens) {
  for (const token of tokens) {
    if (!source.includes(token)) throw new Error(`${label} reference token is missing: ${token}`);
  }
}

requireTokens(navigation, 'Bottom navigation source', [
  'background: rgba(0, 27, 22, 0.94)',
  'color: rgba(207, 220, 212, 0.66)',
  'color: #f3d996',
  'stroke-width: 1.75',
  'border-radius: 24px',
  'border-radius: 16px',
  'border-radius: 10px',
  'white-space: nowrap',
  'box-shadow: none',
  '@media (max-height: 720px)',
]);

requireTokens(referenceShell, 'Detail shell base', [
  'border: 1px solid rgba(226, 191, 119, .14)',
  'border-radius: 18px',
  'background: rgba(0, 27, 22, .9)',
]);

requireTokens(entrySystem, 'Entry/system integration layer', [
  '.reference-splash {',
  'border-radius: 42px',
  'linear-gradient(165deg, #042a21 0%, #001b16 59%, #00120f 100%)',
  'color: #fff8ea',
  'background: linear-gradient(90deg, transparent, #f2d79a, transparent)',
  '.reference-onboarding__visual {',
  'linear-gradient(150deg, rgba(13, 87, 67, .98), rgba(0, 18, 15, .995))',
  '.reference-onboarding__visual-icon',
  'border-radius: 13px',
  '.reference-onboarding__permissions > button',
  'border-radius: 18px',
  '.reference-assistant-greeting',
  'border-radius: 28px !important',
  '.reference-assistant-input',
  'background: rgba(0, 27, 22, .92) !important',
  '.reference-install-prompt',
  'border-radius: 28px',
  '.reference-network-status,',
  '.toast {',
  'linear-gradient(145deg, rgba(7, 55, 43, .97), rgba(0, 18, 15, .99)) !important',
  '.reference-system-error {',
  'linear-gradient(165deg, #042a21 0%, #001b16 58%, #00120f 100%)',
]);

requireTokens(brandEntryArt, 'Splash/brand art layer', [
  '.reference-splash__mosque > img',
  'object-fit: contain !important',
  'object-position: right bottom !important',
  'background: radial-gradient(circle, rgba(226, 191, 119, .18), rgba(13, 87, 67, .07) 48%, transparent 73%)',
  '.reference-splash__mark > img',
  'background: radial-gradient(circle, rgba(242, 215, 154, .22), rgba(226, 191, 119, .06) 48%, transparent 72%)',
  'box-shadow: 0 0 10px rgba(242, 215, 154, .3)',
  '.reference-system-error__logo > img',
  'background: radial-gradient(circle, rgba(226, 191, 119, .17), transparent 70%)',
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

requireTokens(assistantBase, 'Assistant base surfaces', [
  'border-radius: 28px',
  'linear-gradient(145deg, rgba(13, 87, 67, .94), rgba(0, 18, 15, .98))',
  'grid-template-columns: minmax(0, 1fr) 44px',
  'background: rgba(0, 27, 22, .95)',
  'border-radius: 18px',
  'border-radius: 13px',
  'linear-gradient(135deg, #f2d79a, #e2bf77)',
  'border-radius: 18px 18px 18px 6px',
  'border-radius: 18px 18px 6px 18px',
]);

requireTokens(profileBase, 'Profile base surfaces', [
  'border-radius: 42px',
  'linear-gradient(145deg, rgba(13, 87, 67, .95), rgba(0, 18, 15, .98))',
  '.reference-profile-list',
  'border-radius: 28px',
  '.reference-profile-row__icon',
  'border-radius: 13px',
  '.reference-profile-logout',
  '.reference-choice',
  '.reference-settings-toggles > button',
  'border-radius: 18px',
  'linear-gradient(145deg, #0d5743, #07372b 64%, #00120f)',
]);

requireTokens(profileBrand, 'Late profile brand layer', [
  'linear-gradient(145deg, #0d5743 0%, #07372b 59%, #00120f 100%) !important',
  'rgba(226, 191, 119, .13)',
  'color: #f2d79a !important',
  '[data-theme=\'light\'] .reference-profile-greeting',
  'color: #fff8ea',
]);

requireTokens(runtimeLock, 'No-blur fallback', [
  'background-color: rgba(0, 27, 22, .97) !important',
]);

requireTokens(finalLock, 'Account/notes/assistant final utility material', [
  "html:not([data-theme='light']) :where(",
  '--utility-surface: linear-gradient(145deg, rgba(13, 87, 67, .94), rgba(0, 18, 15, .99))',
  '--utility-surface-soft: rgba(7, 55, 43, .82)',
  '--utility-border: rgba(226, 191, 119, .15)',
  '--utility-border-strong: rgba(242, 215, 154, .3)',
  '--utility-text: #fff8ea',
  '--utility-muted: rgba(145, 168, 158, .79)',
  '--utility-gold: #e2bf77',
  'linear-gradient(145deg, #0d5743, #07372b 60%, #00120f) !important',
]);

requireTokens(finalLock, 'Final shell/brand/navigation override', [
  '.reference-splash,',
  '.app-shell--detail .reference-screen-header',
  'background: linear-gradient(145deg, rgba(0, 27, 22, .94), rgba(0, 18, 15, .96)) !important',
  '.bottom-nav {',
  'border-radius: 24px !important',
  'background: linear-gradient(150deg, rgba(5, 35, 27, .965), rgba(1, 20, 15, .975)) !important',
  '.bottom-nav__item {',
  'border-radius: 16px !important',
  '.bottom-nav__item > span',
  'border-radius: 10px !important',
  '.bottom-nav__item--active',
  'color: #f3d996 !important',
  'box-shadow: none !important',
  '.reference-onboarding__visual',
  'linear-gradient(150deg, #0d5743, #07372b 64%, #00120f) !important',
  '.reference-onboarding__visual-icon,',
  '.reference-splash__mosque > img,',
  '.reference-splash__mark > img,',
  '.reference-system-error__logo > img,',
  "[data-theme='light'] .app-shell--detail .reference-screen-header",
  "[data-theme='light'] .bottom-nav",
  "[data-theme='light'] .reference-onboarding__visual",
  'background: rgba(255, 252, 243, .965) !important',
  'linear-gradient(150deg, #fffdf7, #eee6d3) !important',
]);

for (const selector of [
  '.reference-splash',
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
  '.reference-mosque-detail-modal',
  '.reference-prayer-course-complete > section',
  '.reference-input-search',
  '.reference-assistant-input',
  '.reference-legacy-search',
  '.reference-fasting-reminder-settings input',
  '.reference-zakat-calculator input',
  '.reference-profile-list',
  '.reference-profile-logout',
  '.reference-profile-modal__icon',
  '.reference-choice',
  '.reference-settings-toggles > button',
  '.reference-profile-row__icon',
  '.reference-account-form',
  '.reference-account-cloud-grid > button',
  '.reference-account-security',
  '.reference-account-header-icon',
  '.reference-account-tabs',
  '.reference-account-tabs > button',
  '.reference-account-status',
  '.reference-account-logout',
  '.reference-notes-storage > button',
  '.reference-notes-list > button',
  '.reference-note-editor__heading > button',
  '.reference-assistant-suggestions button',
  '.reference-assistant-safety',
  '.reference-assistant-info-list > span',
  ".reference-assistant-input > button[type='submit']",
  '.reference-onboarding__topbar > button',
  '.reference-onboarding__permissions > button',
  '.reference-onboarding__back',
  '.reference-onboarding__actions .gold-button',
  '.reference-onboarding__visual-icon',
  '.reference-onboarding__permissions > button > span:first-child',
  '.reference-splash__mosque > img',
  '.reference-splash__mark > img',
  '.reference-system-error__logo > img',
]) {
  if (!finalLock.includes(selector)) throw new Error(`Final reference lock does not protect system/utility/profile/shell/brand surface: ${selector}`);
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

for (const staleEntry of [
  'linear-gradient(165deg, #09271f',
  'linear-gradient(150deg, rgba(16, 62, 48',
  'background: rgba(5, 29, 23',
  'linear-gradient(145deg, #efd394, #c9953a)',
  'border-radius: 27px',
  'border-radius: 15px',
  'border-radius: 12px',
  'border-radius: 14px',
  'background: rgba(3, 27, 21',
]) {
  if (entrySystem.includes(staleEntry)) {
    throw new Error(`Entry/system layer still contains a stale pre-reference value: ${staleEntry}`);
  }
}

for (const staleBrand of [
  'rgba(232, 199, 122',
  'rgba(38, 123, 90',
  'rgba(238, 208, 139',
]) {
  if (brandEntryArt.includes(staleBrand)) {
    throw new Error(`Splash/brand art layer still contains a stale pre-reference color: ${staleBrand}`);
  }
}

for (const staleShell of [
  'border: 1px solid rgba(214, 175, 55, .12)',
  'border-radius: 16px',
  'background: rgba(3, 18, 14, .82)',
]) {
  if (referenceShell.includes(staleShell)) {
    throw new Error(`Detail shell base still contains a stale pre-reference value: ${staleShell}`);
  }
}

for (const staleAssistant of [
  'grid-template-columns: 1fr 38px 42px',
  'border-radius: 15px',
  'border-radius: 12px',
  'background: rgba(5, 29, 23, .95)',
  'linear-gradient(135deg, #efd394, #c9953a)',
]) {
  if (assistantBase.includes(staleAssistant)) {
    throw new Error(`Assistant base layer still contains a stale pre-reference value: ${staleAssistant}`);
  }
}

for (const staleProfile of [
  'border-radius: 19px',
  'border-radius: 17px',
  'border-radius: 15px',
  'border-radius: 14px',
  'border-radius: 23px',
  'linear-gradient(145deg, rgba(16, 59, 46, .95), rgba(4, 25, 20, .98))',
  'linear-gradient(145deg, #103b2e, #061d17 64%, #041510)',
  'linear-gradient(145deg, #124c3a 0%, #062a20 59%, #02140f 100%)',
]) {
  if (profileBase.includes(staleProfile) || profileBrand.includes(staleProfile)) {
    throw new Error(`Profile layer still contains a stale pre-reference value: ${staleProfile}`);
  }
}

console.log('Reference system surfaces verified: Splash/entry brand, compact one-line bottom navigation, shell/onboarding, system banners, modals, inputs, profile, account/notes utility surfaces, assistant base UI and no-blur fallback use the emerald/gold/cream palette, protected icon weight and mobile-safe geometry with explicit light-theme preservation.');