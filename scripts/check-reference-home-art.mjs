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

requireTokens(homeContent, 'Home content source', [
  'background: linear-gradient(145deg, rgba(13, 87, 67, 0.78), rgba(0, 27, 22, 0.88))',
  '.quick-card__icon {',
  '.continue-card {',
  'background: linear-gradient(135deg, rgba(226, 191, 119, 0.13), transparent), #07372b',
  '.hadith-card { padding: 22px; border-radius: 28px; }',
  'linear-gradient(145deg, #fff8ea, #f6ebd6)',
  '.recommendation-card {',
  'background: rgba(7, 55, 43, 0.65)',
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
  'quran-closed-v2.webp" fallback={<QuranObject />}',
  'tasbih-v2.webp" fallback={<RosetteObject />}',
  'qibla-compass-v2.webp" fallback={<QiblaObject />}',
  'mihrab-arch-v2.webp" className="verse-card__art"',
]);

requireTokens(app, 'Home semantic actions and honest progress', [
  '<BellRing size={20} />',
  "onNavigate('prayer')",
  '<Menu size={20} />',
  "onNavigate('profile')",
  "label: 'Quran lesen', eyebrow: 'Lesen & weiterlesen', icon: BookOpen",
  "label: 'Beten lernen', eyebrow: 'Wudu, Qibla & Salah', icon: HandHeart",
  "label: '99 Namen Allahs', eyebrow: 'Heute entdecken', icon: Sparkles",
  "label: 'Islam Quiz', eyebrow: 'Wissen testen', icon: BrainCircuit",
  "label: 'Duas', eyebrow: 'Für jeden Moment', icon: BookHeart",
  "label: 'Nur Assistent', eyebrow: 'Lokaler Quellenmodus', icon: MessageCircleQuestion",
  'hasProgress: boolean',
  'surahNumber: 1',
  "englishName: 'Al-Faatiha'",
  'hasProgress: false',
  'quranProgress.hasProgress && quranProgress.numberOfAyahs',
  ": 0;",
  "'Quran beginnen'",
  "'Noch kein Lesestand'",
  "'Noch kein gespeicherter Lesestand'",
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

console.log('Home reference audit verified: Home uses honest Quran progress with an explicit zero-progress start state, Home hero/content/header/atmosphere sources use the approved palette and 42/28/18/26 geometry, v2 artwork and semantic actions remain mapped correctly, mosque/Mihrab crops are protected, Lucide strokes stay 1.75, and the final geometry lock remains the last stylesheet import.');
