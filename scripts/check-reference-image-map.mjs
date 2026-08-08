import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const read = (path) => readFile(resolve(root, path), 'utf8');

const [
  app,
  onboarding,
  splash,
  quran,
  reader,
  dhikr,
  qibla,
  mosque,
  learn,
  collections,
  assistant,
  more,
  legacy,
  reading,
  devotionalCss,
  dailyCss,
  discoveryCss,
  worshipCss,
] = await Promise.all([
  read('src/App.tsx'),
  read('src/OnboardingScreen.tsx'),
  read('src/SplashScreen.tsx'),
  read('src/QuranScreen.tsx'),
  read('src/QuranReaderScreen.tsx'),
  read('src/DhikrScreen.tsx'),
  read('src/QiblaScreen.tsx'),
  read('src/MosqueScreen.tsx'),
  read('src/LearnScreen.tsx'),
  read('src/CollectionsScreen.tsx'),
  read('src/AssistantScreen.tsx'),
  read('src/MoreScreen.tsx'),
  read('src/LegacyFeatureScreens.tsx'),
  read('src/ReferenceReadingScreens.tsx'),
  read('src/styles/premium-devotional-art-lock.css'),
  read('src/styles/premium-daily-inspiration-art-lock.css'),
  read('src/styles/premium-discovery-collection-art-lock.css'),
  read('src/styles/premium-worship-art-lock.css'),
]);

function requireFragments(source, label, fragments) {
  for (const fragment of fragments) {
    if (!source.includes(fragment)) {
      throw new Error(`${label} reference image mapping is missing: ${fragment}`);
    }
  }
}

function featureObject(source, id) {
  const match = source.match(new RegExp(`\\{\\s*id:\\s*'${id}'[\\s\\S]*?\\}`));
  if (!match) throw new Error(`Legacy feature definition is missing: ${id}`);
  return match[0];
}

function cssRule(source, selector) {
  const selectorIndex = source.indexOf(selector);
  if (selectorIndex === -1) throw new Error(`Reference CSS selector is missing: ${selector}`);
  const open = source.indexOf('{', selectorIndex);
  const close = source.indexOf('}', open);
  if (open === -1 || close === -1) throw new Error(`Reference CSS rule is malformed: ${selector}`);
  return source.slice(selectorIndex, close + 1);
}

function requireCssAsset(source, label, selector, filename) {
  const rule = cssRule(source, selector);
  if (!rule.includes(filename)) {
    throw new Error(`${label} must keep ${filename} on ${selector}.`);
  }
}

requireFragments(app, 'Home', [
  'mosque-gold-v2.webp" className="welcome-hero__visual"',
  'quran-closed-v2.webp" fallback={<QuranObject />}',
  'tasbih-v2.webp" fallback={<RosetteObject />}',
  'qibla-compass-v2.webp" fallback={<QiblaObject />}',
  'mihrab-arch-v2.webp" className="verse-card__art"',
  '<BellRing size={20} />',
  "onNavigate('prayer')",
]);

requireFragments(onboarding, 'Onboarding', [
  "image: '/premium-assets/high-res-objects/mosque-gold-v2.webp'",
  "image: '/premium-assets/high-res-objects/qibla-compass-v2.webp'",
  "image: '/premium-assets/high-res-objects/quran-closed-v2.webp'",
  'tasbih-v2.webp',
  'nur-logo-emblem-v2.webp',
]);

requireFragments(splash, 'Splash', [
  'mosque-gold-v2.webp',
  'nur-logo-emblem-v2.webp',
]);

requireFragments(quran, 'Quran catalog', [
  'quran-closed-v2.webp" className="reference-quran-continue__book"',
]);

requireFragments(reader, 'Quran reader', [
  'quran-open-v2.webp',
]);

requireFragments(dhikr, 'Dhikr', [
  'tasbih-v2.webp" className="reference-dhikr-counter__tasbih"',
]);

requireFragments(qibla, 'Qibla', [
  'qibla-compass-v2.webp" className="reference-qibla-stage__compass"',
]);

requireFragments(mosque, 'Mosque discovery', [
  'mosque-gold-v2.webp" fallback={<MosqueScene />}',
]);

requireFragments(learn, 'Learning hub', [
  'mihrab-arch-v2.webp" fallback={<MosqueScene />}',
]);

requireFragments(collections, 'Collections', [
  'quran-closed-v2.webp" fallback={<QuranObject />}',
]);

requireFragments(assistant, 'Assistant', [
  'nur-logo-emblem-v2.webp" fallback={<NurMark />}',
]);

requireFragments(more, 'Profile / More', [
  'nur-logo-emblem-v2.webp" fallback={<NurMark />}',
]);

const legacyArtMap = {
  'hadith-library': 'lantern-v2.webp',
  knowledge: 'quran-open-v2.webp',
  prophets: 'mihrab-v2.webp',
  quiz: 'quran-closed-v2.webp',
  hajj: 'kaaba-v2.webp',
  sunnah: 'sun-emblem-v2.webp',
  sins: 'dome-v2.webp',
  fasting: 'calendar-chip-v2.webp',
  ummah: 'dome-v2.webp',
  places: 'mosque-gold-v2.webp',
  jumuah: 'mihrab-arch-v2.webp',
  zakat: 'bookmark-v2.webp',
  standby: 'qibla-compass-v2.webp',
};
for (const [id, filename] of Object.entries(legacyArtMap)) {
  const definition = featureObject(legacy, id);
  const expected = `art: '/premium-assets/high-res-objects/${filename}'`;
  if (!definition.includes(expected)) {
    throw new Error(`Legacy feature ${id} must keep artwork ${filename}.`);
  }
}

requireFragments(reading, 'Daily Ayah and worship guides', [
  'mihrab-arch-v2.webp" className="reference-ayah-hero__art"',
  "? '/premium-assets/high-res-objects/mosque-gold-v2.webp'",
  ": '/premium-assets/high-res-objects/qibla-compass-v2.webp';",
]);

requireCssAsset(devotionalCss, 'Dua hero', '.reference-duas-hero::after', 'dua-hands-v2.webp?v=20260808-release-hardening');
requireCssAsset(dailyCss, 'Daily Ayah', '.reference-ayah-hero::before', 'mihrab-arch-v2.webp?v=20260808-release-hardening');
requireCssAsset(dailyCss, 'Daily Hadith', '.reference-hadith-hero::after', 'lantern-v2.webp?v=20260808-release-hardening');
requireCssAsset(discoveryCss, 'Calendar month', '.reference-calendar-month::after', 'sun-emblem-v2.webp?v=20260808-release-hardening');
requireCssAsset(discoveryCss, 'Calendar event', '.reference-calendar-event::after', 'calendar-chip-v2.webp?v=20260808-release-hardening');
requireCssAsset(discoveryCss, 'Collections ornament', '.reference-collection-section:first-of-type::after', 'bookmark-v2.webp?v=20260808-release-hardening');
requireCssAsset(worshipCss, 'Prayer hero', '.reference-next-prayer::before', 'dome-v2.webp?v=20260808-release-hardening');
requireCssAsset(worshipCss, 'Qibla center', '.reference-qibla-stage::after', 'kaaba-v2.webp?v=20260808-release-hardening');

const forbiddenPairs = [
  [dhikr, 'quran-closed-v2.webp', 'Dhikr must not use a Quran cover as its focal image.'],
  [qibla, 'tasbih-v2.webp', 'Qibla must not use Tasbih as its focal image.'],
  [quran, 'qibla-compass-v2.webp', 'Quran catalog must not use the Qibla compass as its focal image.'],
  [assistant, 'quran-closed-v2.webp', 'Assistant greeting must use the Nur identity mark, not a Quran cover.'],
];
for (const [source, forbidden, message] of forbiddenPairs) {
  if (source.includes(forbidden)) throw new Error(message);
}

const visibleTsx = [app, onboarding, splash, quran, reader, dhikr, qibla, mosque, learn, collections, assistant, more, legacy, reading].join('\n');
for (const match of visibleTsx.matchAll(/premium-assets\/high-res-objects\/([^"'`?\s)]+\.webp)/g)) {
  const filename = match[1];
  if (!filename.endsWith('-v2.webp')) {
    throw new Error(`Visible screen still references a legacy non-v2 WebP asset: ${filename}`);
  }
}

console.log('Reference image map verified: primary screens, all 13 additional features and CSS-driven Prayer/Qibla/Ayah/Hadith/Dua/Calendar artwork keep exact selector-or-ID to asset pairs; visible TSX uses final -v2 WebPs.');
