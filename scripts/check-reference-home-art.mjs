import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const read = (path) => readFile(resolve(root, path), 'utf8');

const [
  app,
  base,
  homeExact,
  artDirection,
  artComposition,
  atmosphere,
  finalLock,
  styleIndex,
] = await Promise.all([
  read('src/App.tsx'),
  read('src/styles/base.css'),
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

requireTokens(app, 'Home artwork map', [
  'mosque-gold-v2.webp" className="welcome-hero__visual"',
  'quran-closed-v2.webp" fallback={<QuranObject />}',
  'tasbih-v2.webp" fallback={<RosetteObject />}',
  'qibla-compass-v2.webp" fallback={<QiblaObject />}',
  'mihrab-arch-v2.webp" className="verse-card__art"',
]);

requireTokens(app, 'Home semantic actions', [
  '<BellRing size={20} />',
  "onNavigate('prayer')",
  '<Menu size={20} />',
  "onNavigate('profile')",
  "label: 'Quran lesen', eyebrow: 'Zuletzt gelesen', icon: BookOpen",
  "label: 'Beten lernen', eyebrow: 'Wudu, Qibla & Salah', icon: HandHeart",
  "label: '99 Namen Allahs', eyebrow: 'Heute entdecken', icon: Sparkles",
  "label: 'Islam Quiz', eyebrow: 'Wissen testen', icon: BrainCircuit",
  "label: 'Duas', eyebrow: 'Für jeden Moment', icon: BookHeart",
  "label: 'Nur Assistent', eyebrow: 'Lokaler Quellenmodus', icon: MessageCircleQuestion",
]);

requireTokens(finalLock, 'Final Home reference lock', [
  '.welcome-hero,',
  'border-radius: 42px !important',
  '.quick-card,',
  '.verse-card,',
  'border-radius: 28px !important',
  '.icon-button,',
  '.gold-button,',
  'border-radius: 18px !important',
  '.premium-home--v2 .welcome-hero__visual > img,',
  'object-fit: contain !important',
  'object-position: right bottom !important',
  '.verse-card__art > img,',
  'object-fit: cover !important',
  'object-position: center 42% !important',
  ':where(svg.lucide)',
  'stroke-width: 1.75 !important',
]);

for (const requiredSelector of [
  '.premium-home--v2',
  '.welcome-hero',
  '.quick-card',
  '.verse-card',
]) {
  const homeSource = `${homeExact}\n${artDirection}\n${artComposition}\n${atmosphere}`;
  if (!homeSource.includes(requiredSelector)) throw new Error(`Home visual layers no longer style ${requiredSelector}.`);
}

const importedLayers = [...styleIndex.matchAll(/@import '\.\/styles\/([^']+)';/g)]
  .map((match) => match[1]);
if (importedLayers.at(-1) !== 'premium-reference-geometry-lock.css') {
  throw new Error('Home reference geometry/crop protection is unsafe because the final lock is not the last stylesheet import.');
}

const homeLayers = `${homeExact}\n${artDirection}\n${artComposition}\n${atmosphere}`;
const highRiskLegacyTokens = [
  '#124c3a',
  '#104334',
  '#09271f',
  '#02140f',
  '#02130f',
  '#eed08b',
  '#e7c77f',
];
const legacyHits = highRiskLegacyTokens.filter((token) => homeLayers.includes(token));
if (legacyHits.length) {
  console.warn(`Home visual audit: earlier Home layers still contain near-match palette tokens (${legacyHits.join(', ')}). The final reference lock must remain last until these source layers are normalized.`);
}

if (homeLayers.includes('content: url(') || homeLayers.includes('content:url(')) {
  throw new Error('Home visual CSS must not swap React image sources via content:url(...).');
}

console.log(`Home reference audit verified: exact v2 artwork mapping, semantic Home icons/actions, final 42/28/18 geometry, 1.75 Lucide strokes, protected mosque and Mihrab crops, and final-lock cascade order.${legacyHits.length ? ` ${legacyHits.length} legacy near-match token(s) remain informationally flagged in earlier layers.` : ''}`);
