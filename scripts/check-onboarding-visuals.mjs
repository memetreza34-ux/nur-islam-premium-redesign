import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const screen = await readFile(resolve(root, 'src/OnboardingScreen.tsx'), 'utf8');
const styles = await readFile(resolve(root, 'src/styles/reference-onboarding.css'), 'utf8');

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
  '.reference-onboarding__topbar > button',
  'min-height: 44px',
  '.reference-onboarding__dots button {',
  'width: 32px',
  'height: 32px',
  '.reference-onboarding__dots button::after',
  '@media (max-height: 740px)',
  'min-height: 238px',
  '@media (prefers-reduced-motion: reduce)',
];
for (const requirement of styleRequirements) {
  if (!styles.includes(requirement)) throw new Error(`Onboarding mobile guardrail is missing: ${requirement}`);
}

if (/\.reference-onboarding\s*\{[^}]*overflow\s*:\s*hidden/si.test(styles)) {
  throw new Error('Onboarding must not clip the permission step or footer on short displays.');
}

console.log('Onboarding verified: current v2 artwork, optional permissions, scroll-safe short screens, 44px skip action, larger page-dot hit areas, and reduced-motion handling.');
