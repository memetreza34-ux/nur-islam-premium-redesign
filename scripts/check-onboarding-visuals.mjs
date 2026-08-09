import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const screen = await readFile(resolve(root, 'src/screens/OnboardingScreen.tsx'), 'utf8');
const styles = await readFile(resolve(root, 'src/styles/reference-onboarding.css'), 'utf8');
const art = await readFile(resolve(root, 'src/styles/premium-onboarding-art-lock.css'), 'utf8');
const finalLock = await readFile(resolve(root, 'src/styles/premium-reference-geometry-lock.css'), 'utf8');

const v2Assets = [
  'mosque-gold-v2.webp',
  'qibla-compass-v2.webp',
  'quran-closed-v2.webp',
  'nur-logo-emblem-v2.webp',
  'tasbih-v2.webp',
];

for (const asset of v2Assets) {
  if (!screen.includes(asset)) throw new Error(`Onboarding is missing current premium artwork: ${asset}`);
}

for (const legacyAsset of [
  'mosque-gold.webp',
  'qibla-compass.webp',
  'quran-closed.webp',
  'nur-logo-emblem.webp',
  'tasbih.webp',
]) {
  if (screen.includes(`/high-res-objects/${legacyAsset}`)) {
    throw new Error(`Onboarding still references legacy artwork: ${legacyAsset}`);
  }
}

const structureRequirements = [
  "eyebrow: 'Willkommen bei Nur'",
  "eyebrow: 'Gebet & Richtung'",
  "eyebrow: 'Wissen & Alltag'",
  'navigator.geolocation.getCurrentPosition',
  'Notification.requestPermission()',
  "localStorage.setItem('nur_onboarding_complete', 'true')",
  'aria-label={`Seite ${dotIndex + 1}`}',
];
for (const requirement of structureRequirements) {
  if (!screen.includes(requirement)) throw new Error(`Onboarding flow is incomplete: ${requirement}`);
}

const styleRequirements = [
  '.app-shell--onboarding',
  'height: 100svh',
  'overflow-y: auto',
  '-webkit-overflow-scrolling: touch',
  '.reference-onboarding {',
  'overflow: visible',
  'radial-gradient(circle at 50% 35%, rgba(13, 87, 67, .28), transparent 64%)',
  '.reference-onboarding__topbar > button',
  'min-height: 44px',
  'border-radius: 18px',
  'background: rgba(0, 27, 22, .58)',
  '.reference-onboarding__visual {',
  'border-radius: 42px',
  'linear-gradient(150deg, rgba(13, 87, 67, .98), rgba(0, 18, 15, .99))',
  '.reference-onboarding__visual-icon',
  'border-radius: 13px',
  '.reference-onboarding__permissions > button',
  'background: rgba(0, 27, 22, .78)',
  '.reference-onboarding__permissions > button > span:first-child',
  '.reference-onboarding__dots button {',
  'width: 32px',
  'height: 32px',
  '.reference-onboarding__dots button::after',
  'linear-gradient(90deg, #f2d79a, #e2bf77)',
  '.reference-onboarding__back',
  'color: var(--gold)',
  '@media (max-height: 740px)',
  'min-height: 238px',
  '@media (prefers-reduced-motion: reduce)',
];
for (const requirement of styleRequirements) {
  if (!styles.includes(requirement)) throw new Error(`Onboarding reference/mobile guardrail is missing: ${requirement}`);
}

const artRequirements = [
  'background: radial-gradient(circle, rgba(226, 191, 119, .14), transparent 70%)',
  '.reference-onboarding__visual--1 > .premium-image > img',
  'object-position: center bottom !important',
  '.reference-onboarding__visual--2 > .premium-image > img',
  'object-position: center !important',
  'background: radial-gradient(circle, rgba(226, 191, 119, .14), rgba(13, 87, 67, .05) 46%, transparent 70%) !important',
  '.reference-onboarding__visual--3 .reference-onboarding__tasbih img',
  'object-fit: contain !important',
];
for (const requirement of artRequirements) {
  if (!art.includes(requirement)) throw new Error(`Onboarding art reference is missing: ${requirement}`);
}

for (const requirement of [
  '.reference-onboarding__visual',
  'border-radius: 42px !important',
  '.reference-onboarding__topbar > button',
  '.reference-onboarding__permissions > button',
  '.reference-onboarding__back',
  '.reference-onboarding__actions .gold-button',
  'border-radius: 18px !important',
  '.reference-onboarding__permissions > button > span:first-child',
  'border-radius: 13px !important',
  "[data-theme='light'] .reference-onboarding__visual",
  'linear-gradient(150deg, #fffdf7, #eee6d3) !important',
]) {
  if (!finalLock.includes(requirement)) throw new Error(`Final onboarding reference lock is incomplete: ${requirement}`);
}

for (const stale of [
  'border-radius: 27px',
  'border-radius: 15px',
  'border-radius: 12px',
  'border-radius: 14px',
  'border-radius: 13px;\n  color: var(--gold-soft)',
  'linear-gradient(150deg, rgba(16, 62, 48, .98), rgba(4, 23, 18, .99))',
  'linear-gradient(90deg, #e7c77f, #bd8b35)',
]) {
  if (styles.includes(stale)) throw new Error(`Onboarding base still contains a stale pre-reference value: ${stale}`);
}

if (/\.reference-onboarding\s*\{[^}]*overflow\s*:\s*hidden/si.test(styles)) {
  throw new Error('Onboarding must not clip the permission step or footer on short displays.');
}

console.log('Onboarding verified: current v2 artwork, exact slide composition, reference emerald/gold palette, 42/18/13 geometry, explicit light-theme preservation, optional permissions, scroll-safe short screens and reduced-motion handling.');
