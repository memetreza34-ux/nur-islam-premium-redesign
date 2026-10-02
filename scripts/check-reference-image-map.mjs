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
  more,
  legacy,
  reading,
  onboardingArt,
  brandEntryArt,
  devotionalCss,
  dailyCss,
  discoveryCss,
  worshipCss,
  finalLock,
  finderCss,
] = await Promise.all([
  read('src/app/App.tsx'),
  read('src/screens/OnboardingScreen.tsx'),
  read('src/screens/SplashScreen.tsx'),
  read('src/screens/QuranScreen.tsx'),
  read('src/screens/QuranReaderScreen.tsx'),
  read('src/screens/DhikrScreen.tsx'),
  read('src/screens/QiblaScreen.tsx'),
  read('src/screens/MosqueScreen.tsx'),
  read('src/screens/LearnScreen.tsx'),
  read('src/screens/CollectionsScreen.tsx'),
  read('src/screens/MoreScreen.tsx'),
  Promise.all([read('src/screens/LegacyFeatureScreens.tsx'), read('src/data/legacyFeatures.ts')])
    .then((parts) => parts.join('\n')),
  read('src/screens/ReferenceReadingScreens.tsx'),
  read('src/styles/premium-onboarding-art-lock.css'),
  read('src/styles/premium-brand-entry-art-lock.css'),
  read('src/styles/premium-devotional-art-lock.css'),
  read('src/styles/premium-daily-inspiration-art-lock.css'),
  read('src/styles/premium-discovery-collection-art-lock.css'),
  read('src/styles/premium-worship-art-lock.css'),
  read('src/styles/premium-reference-geometry-lock.css'),
  read('src/styles/mosque-finder-hero.css'),
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

function requireCssFit(source, label, selector, declarations) {
  const rule = cssRule(source, selector);
  for (const declaration of declarations) {
    if (!rule.includes(declaration)) {
      throw new Error(`${label} focal artwork must keep ${declaration} on ${selector}.`);
    }
  }
}

requireFragments(app, 'Home', [
  'className="home-prayer-arch"',
  'scene={currentScene}',
  'home-quran-illustrated-v1.webp" fallback={<QuranObject />}',
  'home-dhikr-illustrated-v1.webp" fallback={<RosetteObject />}',
  'home-qibla-illustrated-v1.webp" fallback={<QiblaObject />}',
  'ayah-focus-bg-v1.webp" className="verse-card__art"',
  'data-home-section="continue"',
  "art: '/premium-assets/high-res-objects/home-learn-prayer-v2.webp'",
  "art: '/premium-assets/high-res-objects/home-names-v1.webp'",
  "art: '/premium-assets/high-res-objects/home-quiz-v2.webp'",
  "art: '/premium-assets/high-res-objects/home-duas-v2.webp'",
  '<BellRing size={20} />',
  "onNavigate('prayer')",
]);

requireFragments(onboarding, 'Onboarding', [
  "image: '/premium-assets/high-res-objects/mosque-heritage-v1.webp'",
  "image: '/premium-assets/high-res-objects/qibla-compass-v2.webp'",
  "image: '/premium-assets/high-res-objects/quran-closed-v2.webp'",
  'tasbih-v2.webp',
  'nur-logo-emblem-v3.svg',
]);

requireFragments(splash, 'Splash', [
  'splash-mosque-v1.webp',
  'nur-logo-emblem-v3.svg',
]);

// The closed-book artwork was a bright object sitting behind the entry text,
// which the contrast rule forbids. It still carries Home; here the arch does.
// The reader keeps its own open-book artwork below.
requireFragments(quran, 'Quran catalog', [
  '<MihrabArch',
  'className="quran-focus"',
  'home-prayer-sky-v1.webp',
  'mini-quran-v1.webp',
  'ayah-focus-bg-v1.webp" className="verse-card__art"',
  'verse-card verse-card--cream reference-daily-card-button quran-daily-ayah',
]);

requireFragments(reader, 'Quran reader', [
  'quran-open-v3.webp',
]);

requireFragments(dhikr, 'Dhikr', [
  'tasbih-v2.webp" className="reference-dhikr-counter__tasbih"',
]);

requireFragments(qibla, 'Qibla', [
  '<QiblaCompass direction={direction}',
]);

requireFragments(mosque, 'Mosque discovery', [
  'mosque-finder-arch-v1.webp" fallback={<MosqueScene />}',
  'reference-mosque-hero__caption">Illustrative Ansicht',
]);

requireFragments(learn, 'Learning hub', [
  'home-learn-prayer-v2.webp" fallback={<GraduationCap />}',
  'home-quran-illustrated-v1.webp" fallback={<BookOpen />}',
  'className="learning-intro__art"',
  'className="learning-intro__description"',
]);

requireFragments(collections, 'Collections', [
  'quran-closed-v2.webp" fallback={<QuranObject />}',
]);


requireFragments(more, 'Profile / More', [
  'nur-logo-emblem-v3.svg" fallback={<NurMark />}',
]);

// These mappings are release guardrails, not historical snapshots. Compact UI
// chips must not be enlarged as hero art, and known truncated rasters must not
// be reintroduced into a plain <img> path without same-subject recovery.
const legacyArtMap = {
  'hadith-library': 'learning-hadith-v2.webp',
  madhhabs: 'learning-madhhabs-v2.webp',
  prophets: 'learning-prophets-v2.webp',
  hajj: 'kaaba-v2.webp',
  sunnah: 'learning-sunnah-v2.webp',
  sins: 'learning-repentance-v2.webp',
  fasting: 'lantern-v3.webp',
  ummah: 'dome-v2.webp',
  places: 'mosque-heritage-v1.webp',
  jumuah: 'mihrab-arch-v2.webp',
  zakat: 'zakat-scale-v1.webp',
  standby: 'prayer-standby-v1.webp',
};
for (const [id, filename] of Object.entries(legacyArtMap)) {
  const definition = featureObject(legacy, id);
  const expected = `art: '/premium-assets/high-res-objects/${filename}'`;
  if (!definition.includes(expected)) {
    throw new Error(`Legacy feature ${id} must keep artwork ${filename}.`);
  }
}

const learningDirectory = legacy.split('export const learningLegacyFeatures: LegacyFeatureItem[] = [')[1]?.split('];')[0] ?? '';
for (const id of ['knowledge', 'sahabah', 'women', 'quiz']) {
  if (new RegExp(`\\{\\s*id:\\s*'${id}'`).test(learningDirectory)) {
    throw new Error(`Removed learning feature ${id} must not return to navigation.`);
  }
}

const fastingDefinition = featureObject(legacy, 'fasting');
if (fastingDefinition.includes('calendar-chip-v2.webp')) {
  throw new Error('Fasting hero must not enlarge calendar-chip-v2.webp; it is a compact UI asset.');
}
const placesDefinition = featureObject(legacy, 'places');
if (placesDefinition.includes('mosque-gold-v2.webp') || placesDefinition.includes('mosque-gold-v2.svg')) {
  throw new Error('Islamic Places must use the current mosque artwork rather than the archived versions.');
}

requireFragments(reading, 'Daily Ayah and worship guides', [
  'mihrab-arch-v2.webp" className="reference-ayah-hero__art"',
  "? '/premium-assets/high-res-objects/wudu-washing-v1.webp'",
  'className="worship-guide-intro"',
  ": '/premium-assets/high-res-objects/qibla-compass-v2.webp';",
]);

requireCssFit(onboardingArt, 'Onboarding mosque composition', '.reference-onboarding__visual--1 > .premium-image', [
  'width: 330px !important',
  'height: 258px !important',
  'transform: translateY(14px) !important',
]);
requireCssFit(onboardingArt, 'Onboarding mosque crop', '.reference-onboarding__visual--1 > .premium-image > img', [
  'object-position: center bottom !important',
]);
requireCssFit(onboardingArt, 'Onboarding compass composition', '.reference-onboarding__visual--2 > .premium-image', [
  'width: 246px !important',
  'height: 246px !important',
  'transform: none !important',
]);
requireCssFit(onboardingArt, 'Onboarding compass crop', '.reference-onboarding__visual--2 > .premium-image > img', [
  'object-position: center !important',
]);
requireCssFit(onboardingArt, 'Onboarding Quran composition', '.reference-onboarding__visual--3 > .premium-image', [
  'width: 250px !important',
  'height: 214px !important',
  'transform: translate(-24px, 8px) !important',
]);
requireCssFit(onboardingArt, 'Onboarding Quran crop', '.reference-onboarding__visual--3 > .premium-image > img', [
  'object-position: center bottom !important',
  'transform: rotate(-2deg)',
]);
requireCssFit(onboardingArt, 'Onboarding Tasbih companion', '.reference-onboarding__visual--3 .reference-onboarding__tasbih img', [
  'object-fit: contain !important',
  'object-position: center !important',
]);

requireCssFit(brandEntryArt, 'Splash mosque composition', '.reference-splash__mosque', [
  'inset: auto 0 -42px',
  'width: 100%',
  'height: 57%',
]);
requireCssFit(brandEntryArt, 'Splash mosque crop', '.reference-splash__mosque-image > img {', [
  'object-fit: contain',
  'object-position: center bottom',
]);
requireCssFit(brandEntryArt, 'Splash Nur mark', '.reference-splash__mark > img', [
  'object-fit: contain',
]);
requireCssFit(brandEntryArt, 'System error Nur mark', '.reference-system-error__logo > img', [
  'object-fit: contain !important',
]);

requireCssAsset(devotionalCss, 'Dua hero', '.reference-duas-hero::after', 'dua-hands-v2.webp?v=20260826-original-art');
requireCssAsset(dailyCss, 'Daily Hadith', '.reference-hadith-hero::after', 'lantern-v3.webp');
requireCssAsset(discoveryCss, 'Calendar month', '.reference-calendar-month::after', 'sun-emblem-v2.webp?v=20260826-original-art');
requireCssAsset(discoveryCss, 'Calendar event', '.reference-calendar-event::after', 'calendar-object-v1.webp');
requireCssAsset(discoveryCss, 'Collections ornament', '.reference-collection-section:first-of-type::after', 'bookmark-v3.webp');
requireCssAsset(worshipCss, 'Prayer hero', '.reference-next-prayer::before', 'dome-v2.webp?v=20260826-original-art');
requireCssAsset(worshipCss, 'Qibla center', '.reference-qibla-stage::after', 'kaaba-v2.webp?v=20260826-original-art');

requireCssFit(finalLock, 'Splash mosque final lock', '.reference-splash__mosque-image > img', [
  'object-fit: contain !important',
  'object-position: center bottom !important',
]);
requireCssFit(finalLock, 'Splash mark final lock', '.reference-splash__mark > img', [
  'object-fit: contain !important',
  'object-position: center !important',
]);
requireCssFit(finalLock, 'System error mark final lock', '.reference-system-error__logo > img', [
  'object-fit: contain !important',
  'object-position: center !important',
]);
requireCssFit(finalLock, 'Home hero', '.premium-home--v2 .welcome-hero__visual > img', [
  'object-fit: contain !important',
  'object-position: right bottom !important',
]);
requireCssFit(finderCss, 'Mosque Finder hero', '.reference-mosque-screen--live .reference-mosque-hero > .premium-image > img', [
  'object-fit: cover !important',
  'object-position: 61% center !important',
  'transform: none !important',
]);
requireCssFit(finalLock, 'Quran continue', '.reference-quran-continue__book > img', [
  'object-fit: contain !important',
  'object-position: center bottom !important',
]);
requireCssFit(finalLock, 'Quran reader', '.reference-reader-hero > .premium-image > img', [
  'object-fit: contain !important',
  'object-position: center bottom !important',
]);
requireCssFit(finalLock, 'Dhikr', '.reference-dhikr-counter__tasbih > img', [
  'object-fit: contain !important',
  'object-position: center !important',
]);
requireCssFit(finalLock, 'Qibla', '.reference-qibla-stage__compass > img', [
  'object-fit: contain !important',
  'object-position: center !important',
]);
requireCssFit(finalLock, 'Daily Ayah background', '.reference-ayah-hero__art > img', [
  'object-fit: cover !important',
  'object-position: center 42% !important',
]);

const forbiddenPairs = [
  [dhikr, 'quran-closed-v2.webp', 'Dhikr must not use a Quran cover as its focal image.'],
  [qibla, 'tasbih-v2.webp', 'Qibla must not use Tasbih as its focal image.'],
  [quran, 'qibla-compass-v2.webp', 'Quran catalog must not use the Qibla compass as its focal image.'],
];
for (const [source, forbidden, message] of forbiddenPairs) {
  if (source.includes(forbidden)) throw new Error(message);
}

const visibleTsx = [app, onboarding, splash, quran, reader, dhikr, qibla, mosque, learn, collections, more, legacy, reading].join('\n');
const originalMiniAssets = new Set([
  'mini-quran-v1.webp',
  'mini-prayer-learning-v1.webp',
  'mini-names-v2.webp',
  'mini-names-v3.webp',
  'mini-names-v4.webp',
  'mini-names-v5.webp',
  'mini-quiz-v3.webp',
  'mini-dua-v3.webp',
  'quran-closed-v3.webp',
  'tasbih-v3.webp',
  'qibla-compass-v3.webp',
  'home-quran-illustrated-v1.webp',
  'home-dhikr-illustrated-v1.webp',
  'home-qibla-illustrated-v1.webp',
  'home-learn-prayer-v2.webp',
  'home-names-v1.webp',
  'home-quiz-v1.webp',
  'home-duas-v1.webp',
  'home-quiz-v2.webp',
  'home-duas-v2.webp',
  'quran-open-v3.webp',
  'lantern-v3.webp',
  'zakat-scale-v1.webp',
  'prayer-standby-v1.webp',
  'mosque-heritage-v1.webp',
  'mosque-finder-arch-v1.webp',
  'mini-quiz-v1.webp',
  'mini-dua-v1.webp',
  'ayah-focus-bg-v1.webp',
  'splash-mosque-v1.webp',
  'home-prayer-sky-v1.webp',
  'wudu-washing-v1.webp',
  'learn-salah-v3.webp',
  'learn-faith-v3.webp',
  'learn-pillars-v3.webp',
  'learn-terms-v3.webp',
  'learn-practice-v3.webp',
  'learn-character-v3.webp',
  'learn-community-v3.webp',
  'learn-seerah-v3.webp',
  'learn-prophets-v3.webp',
  'learn-madhhabs-v3.webp',
  'learn-hadith-v3.webp',
  'learn-sunnah-v3.webp',
  'learn-repentance-v3.webp',
  'prayer-${prayer.id}-v1.webp',
]);
for (const prayer of ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha']) {
  await readFile(resolve(root, `public/premium-assets/high-res-objects/prayer-${prayer}-v1.webp`));
}
for (const match of visibleTsx.matchAll(/premium-assets\/high-res-objects\/([^"'`?\s)]+\.webp)/g)) {
  const filename = match[1];
  if (!filename.endsWith('-v2.webp') && !originalMiniAssets.has(filename)) {
    throw new Error(`Visible screen still references a legacy non-v2 WebP asset: ${filename}`);
  }
}

console.log('Reference image map verified: primary screens, corrected legacy hero assets, onboarding compositions and CSS ornaments keep intentional mappings; compact UI art is blocked and Islamic Places uses the current conceptual mosque artwork.');
