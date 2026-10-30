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
  'learn-hub-book-v1.webp" fallback={<QuranObject />}',
  'home-dhikr-illustrated-v3.webp" fallback={<RosetteObject />}',
  'home-qibla-illustrated-v3.webp" fallback={<QiblaObject />}',
  'data-home-section="continue"',
  "art: '/premium-assets/high-res-objects/home-learn-prayer-v5.webp'",
  "art: '/premium-assets/high-res-objects/home-names-v5.webp'",
  "art: '/premium-assets/high-res-objects/home-quiz-v6.webp'",
  "art: '/premium-assets/high-res-objects/home-duas-v5.webp'",
  '<BellRing size={20} />',
  "onNavigate('prayer')",
]);

requireFragments(onboarding, 'Onboarding', [
  "image: '/premium-assets/high-res-objects/prayer-companion-mosque-v1.webp'",
  "image: '/premium-assets/high-res-objects/home-qibla-illustrated-v3.webp'",
  "image: '/premium-assets/high-res-objects/learn-hub-book-v1.webp'",
  'home-dhikr-illustrated-v3.webp',
  'nur-logo-mosque-3d-v1.webp',
]);

requireFragments(splash, 'Splash logo reveal', [
  'aria-label="Nur Islam wird geladen"',
  'entry-portal', 'entry-door--left', 'entry-door--right', 'entry-wordmark',
  'nur-logo-mosque-3d-v1.webp', 'fallback={<NurMark />}',
  'useReducedMotion', 'role="status"', 'App wird geöffnet',
]);
if (['getNextPrayer', 'getDailyAyah', 'reference-splash__prayer-art', 'Dein App-Name'].some(fragment => splash.includes(fragment))) {
  throw new Error('Opening must reveal the selected mosque behind the doors without the retired prayer/Ayah text or placeholder name.');
}
requireCssFit(brandEntryArt, 'Full-screen opening canvas', '.reference-splash {', [
  'width: 100%', 'height: 100dvh', 'border-radius: 0', 'position: fixed', 'overflow: hidden',
]);
requireFragments(brandEntryArt, 'Door choreography and reduced motion', [
  'entry-open-left', 'entry-open-right', 'entry-wordmark',
  '@media (prefers-reduced-motion:reduce)', '.entry-door { display:none; }',
]);

// Preserve the image-led garden arch and the separate reading action.
requireFragments(quran, 'Quran catalog', [
  'className="gold-button quran-resume"',
  'className="quran-reading-arch"',
  'className="quran-focus"',
  'quran-garden-hero-v2.webp',
  'verse-card verse-card--cream reference-daily-card-button quran-daily-ayah',
]);

requireFragments(reader, 'Quran reader', [
  'learn-hub-book-v1.webp',
]);

requireFragments(dhikr, 'Dhikr', [
  'home-dhikr-illustrated-v3.webp" className="reference-dhikr-counter__tasbih"',
]);

requireFragments(qibla, 'Qibla', [
  '<QiblaCompass direction={direction}',
]);

requireFragments(mosque, 'Mosque discovery', [
  'prayer-companion-mosque-v1.webp" fallback={<MosqueScene />}',
  'Das Moschee-Bild ist eine Illustration.',
  'SourceInfo title="Moscheedaten & Datenschutz"',
]);

requireFragments(learn, 'Learning hub', [
  'home-learn-prayer-v5.webp" fallback={<BookOpen />}',
  'learn-hub-book-v1.webp',
  'aria-label="Lernbereiche"',
  'aria-label="Gebetsablauf Rakʿah mit Wortlaut"',
  'openPrayerLesson(PRAYER_LESSONS[0].id, event.currentTarget)',
]);

requireFragments(collections, 'Collections', [
  'learn-hub-book-v1.webp" fallback={<QuranObject />}',
]);


requireFragments(more, 'Profile / More', [
  'nur-logo-mosque-3d-v1.webp" fallback={<NurMark />}',
]);

// These mappings are release guardrails, not historical snapshots. Compact UI
// chips must not be enlarged as hero art, and known truncated rasters must not
// be reintroduced into a plain <img> path without same-subject recovery.
const legacyArtMap = {
  'hadith-library': 'learn-hub-hadith-v1.webp',
  madhhabs: 'learn-hub-madhhabs-v1.webp',
  prophets: 'learn-hub-prophets-v2.webp',
  hajj: 'learn-hub-hajj-v1.webp',
  sunnah: 'learn-hub-sunnah-v1.webp',
  sins: 'home-duas-v5.webp',
  fasting: 'prayer-companion-fasting-v1.webp',
  ummah: 'home-extra-ummah-v2.webp',
  places: 'prayer-companion-mosque-v1.webp',
  jumuah: 'home-learn-prayer-v5.webp',
  zakat: 'zakat-calculator-v1.webp',
  standby: 'home-learn-prayer-v5.webp',
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
if (fastingDefinition.includes('learn-hub-sunnah-v1.webp')) {
  throw new Error('Fasting hero must not enlarge learn-hub-sunnah-v1.webp; it is a compact UI asset.');
}
const placesDefinition = featureObject(legacy, 'places');
if (placesDefinition.includes('mosque-gold-v2.webp') || placesDefinition.includes('mosque-gold-v2.svg')) {
  throw new Error('Islamic Places must use the current mosque artwork rather than the archived versions.');
}

requireFragments(reading, 'Daily Ayah and worship guides', [
  "? '/premium-assets/high-res-objects/learn-hub-wudu-v1.webp'",
  'className="worship-guide-intro"',
  ": '/premium-assets/high-res-objects/home-qibla-illustrated-v3.webp';",
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

requireCssFit(brandEntryArt, 'Splash logo backdrop', '.reference-splash {', [
  'background: #001B16 !important',
]);
requireCssFit(brandEntryArt, 'System error Nur mark', '.reference-system-error__logo > img', [
  'object-fit: contain !important',
]);

requireCssAsset(devotionalCss, 'Dua hero', '.reference-duas-hero::after', 'home-duas-v5.webp?v=20260826-original-art');
requireCssAsset(dailyCss, 'Daily Hadith', '.reference-hadith-hero::after', 'home-duas-v5.webp');
requireCssAsset(discoveryCss, 'Calendar month', '.reference-calendar-month::after', 'home-names-v5.webp?v=20260826-original-art');
requireCssAsset(discoveryCss, 'Calendar event', '.reference-calendar-event::after', 'learn-hub-sunnah-v1.webp');
requireCssAsset(discoveryCss, 'Collections ornament', '.reference-collection-section:first-of-type::after', 'learn-hub-terms-v1.webp');
requireCssAsset(worshipCss, 'Prayer hero', '.reference-next-prayer::before', 'learn-hub-community-v1.webp?v=20260826-original-art');
const compass = await read('src/shared/QiblaCompass.tsx');
const designSystem = await read('src/styles/nur-design-system.css');
requireFragments(qibla, 'Shared Qibla dial', ['<QiblaCompass']);
requireFragments(compass, 'Vector Qibla artwork', ['viewBox="0 0 360 360"', 'className="qibla-dial__qibla-shaft"']);

requireCssFit(finalLock, 'Full-screen opening radius lock', '.reference-splash {', [
  'border-radius: 0 !important',
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
  'object-fit: contain !important',
  'object-position: right center !important',
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
requireCssFit(designSystem, 'Qibla dial proportions', '.qibla-dial {', [
  'width: min(100%, 310px)',
  'aspect-ratio: 1',
]);
requireCssFit(designSystem, 'Qibla vector fit', '.qibla-dial > svg', [
  'width: 100%',
  'height: auto',
]);
if ([app, quran].some(source => source.includes('verse-card__art')) || reading.includes('className="reference-ayah-hero__art"')) {
  throw new Error('Legacy doorway artwork must stay removed from daily Ayah cards and the Ayah detail.');
}
for (const source of [app, quran]) requireFragments(source, 'Quiet daily Ayah backdrop', ['ayah-oasis-card-v1.webp', 'className="daily-ayah__backdrop"']);

const forbiddenPairs = [
  [dhikr, 'learn-hub-book-v1.webp', 'Dhikr must not use a Quran cover as its focal image.'],
  [qibla, 'home-dhikr-illustrated-v3.webp', 'Qibla must not use Tasbih as its focal image.'],
  [quran, 'home-qibla-illustrated-v3.webp', 'Quran catalog must not use the Qibla compass as its focal image.'],
];
for (const [source, forbidden, message] of forbiddenPairs) {
  if (source.includes(forbidden)) throw new Error(message);
}

const visibleTsx = [app, onboarding, splash, quran, reader, dhikr, qibla, mosque, learn, collections, more, legacy, reading].join('\n');
const originalMiniAssets = new Set([
  'home-extra-ummah-v2.webp',
  'home-extra-collection-v2.webp',
  'quran-garden-hero-v2.webp',
  'learn-hub-book-v1.webp',
  'learn-hub-pillars-v1.webp',
  'learn-hub-terms-v1.webp',
  'learn-hub-wudu-v1.webp',
  'learn-hub-character-v1.webp',
  'learn-hub-community-v1.webp',
  'learn-hub-prophets-v2.webp',
  'learn-hub-madhhabs-v1.webp',
  'learn-hub-hadith-v1.webp',
  'learn-hub-sunnah-v1.webp',
  'learn-hub-hajj-v1.webp',
  'prayer-companion-mosque-v1.webp',
  'prayer-companion-fasting-v1.webp',
  'home-dhikr-illustrated-v3.webp',
  'home-qibla-illustrated-v3.webp',
  'home-learn-prayer-v5.webp',
  'home-names-v5.webp',
  'home-quiz-v6.webp',
  'home-duas-v5.webp',
  'learn-hub-book-v1.webp',
  'home-learn-prayer-v5.webp',
  'home-names-v5.webp',
  'home-names-v5.webp',
  'home-names-v5.webp',
  'home-names-v5.webp',
  'home-quiz-v6.webp',
  'home-duas-v5.webp',
  'learn-hub-book-v1.webp',
  'home-dhikr-illustrated-v3.webp',
  'home-qibla-illustrated-v3.webp',
  'learn-hub-book-v1.webp',
  'home-dhikr-illustrated-v3.webp',
  'home-qibla-illustrated-v3.webp',
  'home-learn-prayer-v5.webp',
  'home-names-v5.webp',
  'home-quiz-v1.webp',
  'home-duas-v1.webp',
  'home-quiz-v2.webp',
  'home-duas-v2.webp',
  'home-learn-prayer-v3.webp',
  'home-quiz-v3.webp',
  'home-duas-v3.webp',
  'home-learn-prayer-v4.webp',
  'home-names-v3.webp',
  'home-quiz-v4.webp',
  'home-duas-v4.webp',
  'learn-hub-book-v1.webp',
  'home-duas-v5.webp',
  'learn-hub-character-v1.webp',
  'home-learn-prayer-v5.webp',
  'prayer-companion-mosque-v1.webp',
  'prayer-companion-mosque-v1.webp',
  'home-quiz-v6.webp',
  'home-duas-v5.webp',
  'ayah-oasis-card-v1.webp',
  'nur-logo-mosque-3d-v1.webp',
  'ayah-focus-bg-v1.webp',
  'zakat-calculator-v1.webp',
  'splash-mosque-v1.webp',
  'learn-hub-wudu-v1.webp',
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

]);
for (const prayer of ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha']) {
  await readFile(resolve(root, `public/premium-assets/high-res-objects/prayer-oasis-${prayer}-v2.webp`));
}
for (const match of visibleTsx.matchAll(/premium-assets\/high-res-objects\/([^"'`?\s)]+\.webp)/g)) {
  const filename = match[1];
  if (!filename.endsWith('-v2.webp') && !originalMiniAssets.has(filename)) {
    throw new Error(`Visible screen still references a legacy non-v2 WebP asset: ${filename}`);
  }
}

console.log('Reference image map verified: primary screens, corrected legacy hero assets, onboarding compositions and CSS ornaments keep intentional mappings; compact UI art is blocked and Islamic Places uses the current conceptual mosque artwork.');
