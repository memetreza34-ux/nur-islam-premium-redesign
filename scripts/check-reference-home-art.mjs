import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const read = (path) => readFile(resolve(root, path), 'utf8');

const [app, base, homeContent, finalLock, styleIndex, heroAsset] = await Promise.all([
  read('src/app/App.tsx'),
  read('src/styles/base.css'),
  read('src/styles/home-content.css'),
  read('src/styles/premium-reference-geometry-lock.css'),
  read('src/styles.css'),
  readFile(resolve(root, 'public/premium-assets/home-hero-reference.webp')),
]);

function requireTokens(source, label, tokens) {
  for (const token of tokens) {
    if (!source.includes(token)) throw new Error(`${label} is missing reference token: ${token}`);
  }
}

requireTokens(base, 'Base palette', [
  '--bg-deep: #00120f',
  '--bg: #001b16',
  '--gold: #e2bf77',
  '--gold-bright: #f2d79a',
  '--cream: #f6ebd6',
  '--cream-strong: #fff8ea',
  '--muted-green: #91a89e',
]);

if (heroAsset.byteLength < 20000) {
  throw new Error(`Approved Home hero asset looks incomplete: ${heroAsset.byteLength} bytes.`);
}

requireTokens(homeContent, 'Hero-only Home source', [
  "url('/premium-assets/home-hero-reference.webp')",
  '.premium-home.premium-home--v2::before',
  'aspect-ratio: 537 / 476',
  '.premium-home.premium-home--v2 > .welcome-hero,',
  '.premium-home.premium-home--v2 > .prayer-hero,',
  '.premium-home.premium-home--v2 > .content-section,',
  '.premium-home.premium-home--v2 > .continue-card,',
  '.premium-home.premium-home--v2 > .inspiration-grid,',
  '.premium-home.premium-home--v2 > .ai-preview',
  'display: none;',
  '.app-shell:has(.premium-home.premium-home--v2) > .bottom-nav',
  'width: clamp(44px, 11vw, 54px)',
  '.icon-button:focus-visible',
]);

requireTokens(app, 'Home semantic actions', [
  '<BellRing size={20} />',
  "onNavigate('prayer')",
  '<Menu size={20} />',
  "onNavigate('profile')",
]);

for (const forbidden of [
  "url('/premium-assets/high-res-objects/mosque-gold-v2.webp')",
  'content: url(',
  'content:url(',
]) {
  if (homeContent.includes(forbidden)) {
    throw new Error(`Hero-only Home CSS still exposes an obsolete visual source: ${forbidden}`);
  }
}

if (homeContent.includes('!important')) {
  throw new Error('Hero-only Home must not add new !important override debt.');
}

requireTokens(finalLock, 'Shared final geometry lock', [
  ':where(svg.lucide)',
  'stroke-width: 1.75 !important',
]);

const importedLayers = [...styleIndex.matchAll(/@import '\.\/styles\/([^']+)';/g)]
  .map((match) => match[1]);
if (importedLayers.at(-1) !== 'premium-reference-geometry-lock.css') {
  throw new Error('The final shared geometry lock is no longer the last stylesheet import.');
}

console.log(`Home hero-only audit verified: approved ${heroAsset.byteLength}-byte reference asset, no visible dashboard sections or bottom nav on Start, real prayer/menu actions remain reachable, and the new Home layer adds no !important debt.`);
