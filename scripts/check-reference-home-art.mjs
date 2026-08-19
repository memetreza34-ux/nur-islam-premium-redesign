import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const read = (path) => readFile(resolve(root, path), 'utf8');

const [
  app,
  base,
  homeHero,
  homeContent,
  homeExact,
  artDirection,
  artComposition,
  atmosphere,
  finalLock,
  styleIndex,
] = await Promise.all([
  read('src/app/App.tsx'),
  read('src/styles/base.css'),
  read('src/styles/home-hero.css'),
  read('src/styles/home-content.css'),
  read('src/styles/reference-home-exact.css'),
  read('src/styles/premium-art-direction-lock.css'),
  read('src/styles/premium-art-composition-lock.css'),
  read('src/styles/premium-atmosphere-details-lock.css'),
  read('src/styles/premium-reference-geometry-lock.css'),
  read('src/styles.css'),
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
  '--radius-xl: 42px',
  '--radius-lg: 28px',
]);

requireTokens(homeHero, 'Home hero source', [
  'linear-gradient(145deg, #0d5743 0%, #07372b 46%, #00120f 100%)',
  'rgba(242, 215, 154, 0.2)',
  'linear-gradient(90deg, #8d6d39, var(--gold-bright))',
  'background: linear-gradient(135deg, var(--gold-bright), #e2bf77)',
  '.prayer-check {',
  'border-radius: 18px;',
]);

requireTokens(homeContent, 'Hero-only Home contract', [
  '.premium-home.premium-home--v2 > :not(.brand-bar):not(.welcome-hero)',
  'display: none;',
  '.premium-home.premium-home--v2 .welcome-hero__date',
  'body:has(.premium-home.premium-home--v2) .bottom-nav',
  'min-height: calc(100dvh - 96px)',
]);

requireTokens(homeExact, 'Home exact header source', [
  'border: 1px solid rgba(226, 191, 119, .25)',
  'border-color: rgba(226, 191, 119, .25)',
  'background: rgba(0, 27, 22, .72)',
]);

requireTokens(atmosphere, 'Atmosphere and navigation source', [
  'linear-gradient(180deg, #001b16 0%, #00120f 55%, #000b09 100%)',
  'rgba(0, 27, 22, .92)',
  'background: linear-gradient(90deg, transparent, #e2bf77, transparent)',
  'caret-color: #e2bf77',
  'border-radius: 26px !important',
]);

requireTokens(app, 'Home artwork map', [
  'mosque-gold-v2.webp" className="welcome-hero__visual"',
]);

requireTokens(app, 'Home header actions', [
  '<BellRing size={20} />',
  "onNavigate('prayer')",
  '<Menu size={20} />',
  "onNavigate('profile')",
]);

for (const forbidden of [
  'surahNumber: 112,\n    ayahNumber: 1,\n    englishName: \'Al-Ikhlaas\'',
  "label: 'Quran lesen', eyebrow: 'Zuletzt gelesen', icon: BookOpen",
]) {
  if (app.includes(forbidden)) throw new Error(`Home still contains synthetic Quran resume state: ${forbidden}`);
}

requireTokens(finalLock, 'Final Home reference lock', [
  '.welcome-hero,',
  'border-radius: 42px !important',
  '.icon-button,',
  'border-radius: 18px !important',
  '.premium-home--v2 .welcome-hero__visual > img,',
  'object-fit: contain !important',
  'object-position: right bottom !important',
  ':where(svg.lucide)',
  'stroke-width: 1.75 !important',
]);

for (const requiredSelector of [
  '.premium-home--v2',
  '.welcome-hero',
]) {
  const homeSource = `${homeHero}\n${homeContent}\n${homeExact}\n${artDirection}\n${artComposition}\n${atmosphere}`;
  if (!homeSource.includes(requiredSelector)) throw new Error(`Home visual layers no longer style ${requiredSelector}.`);
}

const forbiddenHomeSourceTokens = [
  ['home-hero.css', homeHero, ['#0a513c', '#073b2d', '#031f18', '#b78946', '#d4aa5c', 'border-radius: 14px']],
  ['home-content.css', homeContent, ['border-radius: 24px', 'border-radius: 25px', 'border-radius: 27px', 'border-radius: 21px', 'border-radius: 17px', 'border-radius: 15px', '#063c2e']],
  ['reference-home-exact.css', homeExact, ['rgba(232, 199, 122', 'rgba(5, 32, 25']],
  ['premium-atmosphere-details-lock.css', atmosphere, ['#e8c77a', 'rgba(232, 199, 122', 'rgba(2, 24, 18', 'border-radius: 23px']],
];

for (const [file, source, forbidden] of forbiddenHomeSourceTokens) {
  for (const token of forbidden) {
    if (source.includes(token)) throw new Error(`${file} still contains a pre-reference Home token: ${token}`);
  }
}

const importedLayers = [...styleIndex.matchAll(/@import '\.\/styles\/([^']+)';/g)]
  .map((match) => match[1]);
if (importedLayers.at(-1) !== 'premium-reference-geometry-lock.css') {
  throw new Error('Home reference geometry/crop protection is unsafe because the final lock is not the last stylesheet import.');
}

const homeLayers = `${homeHero}\n${homeContent}\n${homeExact}\n${artDirection}\n${artComposition}\n${atmosphere}`;
if (homeLayers.includes('content: url(') || homeLayers.includes('content:url(')) {
  throw new Error('Home visual CSS must not swap React image sources via content:url(...).');
}

console.log('Home reference audit verified: Start is intentionally hero-only, the approved mosque artwork and header actions remain mapped, the date/lower Home content/bottom navigation stay hidden on Start, the emerald/gold reference palette and 42/18 geometry remain protected, and the final geometry lock is still last.');
