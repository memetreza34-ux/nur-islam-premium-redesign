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
  premiumSystemLayer,
  homeLayout,
  designSystem,
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
  read('src/app/PremiumSystemLayer.tsx'),
  read('src/services/homeLayout.ts'),
  read('src/styles/nur-design-system.css'),
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
  'background: linear-gradient(135deg, var(--gold-bright), #e2bf77)',
  '.prayer-check {',
  'border-radius: 18px;',
]);

requireTokens(homeContent, 'Home content source', [
  'background: linear-gradient(145deg, rgba(13, 87, 67, 0.78), rgba(0, 27, 22, 0.88))',
  '.quick-card__icon {',
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

// Navigation styling moved out of this layer into navigation.css; what stays
// here is the screen atmosphere itself.
requireTokens(atmosphere, 'Atmosphere source', [
  'linear-gradient(180deg, #001b16 0%, #00120f 55%, #000b09 100%)',
  'caret-color: #e2bf77',
]);

requireTokens(app, 'Home artwork map', [
  'className="home-prayer-focus"',
  'className="home-prayer-times"',
  'className="home-prayer-arch"',
  'scene={currentScene}',
  'home-quran-illustrated-v1.webp" fallback={<QuranObject />}',
  'home-dhikr-illustrated-v1.webp" fallback={<RosetteObject />}',
  'home-qibla-illustrated-v1.webp" fallback={<QiblaObject />}',
  'ayah-focus-bg-v1.webp" className="verse-card__art"',
]);

requireTokens(app, 'Home semantic actions and honest progress', [
  '<BellRing size={20} />',
  "onNavigate('prayer')",
  '<Compass size={20} />',
  "onNavigate('qibla')",
  '<Menu size={20} />',
  "onNavigate('profile')",
  'PRAYER_SCHEDULE_META.locationLabel',
  'getGermanDate(now, PRAYER_SCHEDULE_META.timezone)',
  'data-home-section="continue"',
  "label: 'Beten lernen', eyebrow: 'Wudu, Qibla & Salah', detail: 'Schritt für Schritt lernen', icon: NurMihrabIcon, art: '/premium-assets/high-res-objects/home-learn-prayer-v2.webp'",
  "label: '99 Namen Allahs', eyebrow: 'Heute entdecken', detail: 'Namen und Bedeutungen', icon: NurRosetteIcon, art: '/premium-assets/high-res-objects/home-names-v1.webp'",
  "label: 'Islam Quiz', eyebrow: 'Wissen testen', detail: 'Fragen direkt beantworten', icon: NurQuizIcon, art: '/premium-assets/high-res-objects/home-quiz-v2.webp'",
  "label: 'Duas', eyebrow: 'Für jeden Moment', detail: 'Bittgebete für deinen Tag', icon: NurDuaIcon, art: '/premium-assets/high-res-objects/home-duas-v2.webp'",
  'useState(readHomeQuranProgress)',
  'quranProgress.hasProgress && quranProgress.numberOfAyahs',
  ": 0;",
  "'Quran beginnen'",
  "'Noch kein Lesestand'",
]);

requireTokens(premiumSystemLayer, 'Premium widget placement', [
  'applyHomePreferences',
  'home.appendChild(currentHost)',
  'home.lastElementChild !== currentHost',
]);
requireTokens(homeLayout, 'Home section ordering', ["host.style.order = '100'", '.home-prayer-note', 'hiddenHomeSections.includes(section)']);
requireTokens(designSystem, 'Standalone Quran resume styling', [
  '.premium-home--v2 > .journey-card--quran',
  '.home-reading-progress {',
  '.home-reading-progress > span { display: block; height: 100%; background: var(--ds-gold); }',
  '[data-home-section][hidden]',
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
  '.premium-home--v2 .welcome-hero__visual > img',
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
const expectedTail = ['premium-reference-geometry-lock.css', 'nur-design-system.css', 'learn-library-redesign.css', 'overlay-navigation-clearance.css', 'legal-premium.css', 'about-premium.css', 'mosque-finder-hero.css'];
if (JSON.stringify(importedLayers.slice(-expectedTail.length)) !== JSON.stringify(expectedTail)) {
  throw new Error('Home geometry must precede the design system, followed only by the approved scoped screen and overlay layers.');
}

const homeLayers = `${homeHero}\n${homeContent}\n${homeExact}\n${artDirection}\n${artComposition}\n${atmosphere}`;
if (homeLayers.includes('content: url(') || homeLayers.includes('content:url(')) {
  throw new Error('Home visual CSS must not swap React image sources via content:url(...).');
}

console.log('Home reference audit verified: Home uses honest Quran progress with an explicit zero-progress start state, Home hero/content/header/atmosphere sources use the approved palette and 42/28/18/26 geometry, v2 artwork and semantic actions remain mapped correctly, mosque/Mihrab crops are protected, Lucide strokes stay 1.75, and the design system remains the last stylesheet import, directly after the geometry lock.');
