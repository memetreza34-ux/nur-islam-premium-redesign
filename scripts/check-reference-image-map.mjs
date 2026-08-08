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

requireFragments(legacy, 'Legacy feature artwork', [
  "id: 'hadith-library'",
  "art: '/premium-assets/high-res-objects/lantern-v2.webp'",
  "id: 'knowledge'",
  "art: '/premium-assets/high-res-objects/quran-open-v2.webp'",
  "id: 'prophets'",
  "art: '/premium-assets/high-res-objects/mihrab-v2.webp'",
  "id: 'quiz'",
  "art: '/premium-assets/high-res-objects/quran-closed-v2.webp'",
  "id: 'hajj'",
  "art: '/premium-assets/high-res-objects/kaaba-v2.webp'",
  "id: 'sunnah'",
  "art: '/premium-assets/high-res-objects/sun-emblem-v2.webp'",
  "id: 'sins'",
  "art: '/premium-assets/high-res-objects/dome-v2.webp'",
  "id: 'fasting'",
  "art: '/premium-assets/high-res-objects/calendar-chip-v2.webp'",
  "id: 'ummah'",
  "id: 'places'",
  "art: '/premium-assets/high-res-objects/mosque-gold-v2.webp'",
  "id: 'jumuah'",
  "art: '/premium-assets/high-res-objects/mihrab-arch-v2.webp'",
  "id: 'zakat'",
  "art: '/premium-assets/high-res-objects/bookmark-v2.webp'",
  "id: 'standby'",
  "art: '/premium-assets/high-res-objects/qibla-compass-v2.webp'",
]);

requireFragments(reading, 'Daily Ayah and worship guides', [
  'mihrab-arch-v2.webp" className="reference-ayah-hero__art"',
  "? '/premium-assets/high-res-objects/mosque-gold-v2.webp'",
  ": '/premium-assets/high-res-objects/qibla-compass-v2.webp';",
]);

requireFragments(devotionalCss, 'Dua hero', [
  'dua-hands-v2.webp?v=20260808-release-hardening',
]);

requireFragments(dailyCss, 'Daily Ayah / Hadith artwork', [
  'mihrab-arch-v2.webp?v=20260808-release-hardening',
  'lantern-v2.webp?v=20260808-release-hardening',
]);

requireFragments(discoveryCss, 'Calendar artwork', [
  'sun-emblem-v2.webp?v=20260808-release-hardening',
  'calendar-chip-v2.webp?v=20260808-release-hardening',
]);

requireFragments(worshipCss, 'Worship artwork', [
  'dome-v2.webp?v=20260808-release-hardening',
  'kaaba-v2.webp?v=20260808-release-hardening',
]);

const forbiddenPairs = [
  [dhikr, 'quran-closed-v2.webp', 'Dhikr must not use a Quran cover as its focal image.'],
  [qibla, 'tasbih-v2.webp', 'Qibla must not use Tasbih as its focal image.'],
  [quran, 'qibla-compass-v2.webp', 'Quran catalog must not use the Qibla compass as its focal image.'],
  [assistant, 'quran-closed-v2.webp', 'Assistant greeting must use the Nur identity mark, not a Quran cover.'],
];
for (const [source, forbidden, message] of forbiddenPairs) {
  if (source.includes(forbidden)) throw new Error(message);
}

console.log('Reference image map verified: all primary screens plus the 13 legacy/additional feature areas use their intended premium artwork.');
