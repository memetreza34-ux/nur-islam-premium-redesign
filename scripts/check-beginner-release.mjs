import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const read = (path) => readFile(resolve(root, path), 'utf8');

const content = await read('src/data/beginnerLearningContent.ts');
const app = await read('src/app/App.tsx');
const legacy = await read('src/data/legacyFeatures.ts');
const more = await read('src/screens/MoreScreen.tsx');
const journey = await read('src/screens/BeginnerJourneyScreen.tsx');
const starterPlan = await read('src/screens/BeginnerStarterPlanScreen.tsx');
const reference = await read('src/screens/BeginnerReferenceScreen.tsx');
const purity = await read('src/screens/PurityBasicsScreen.tsx');
const onboarding = await read('src/screens/OnboardingScreen.tsx');
const learn = await read('src/screens/LearnScreen.tsx');
const quran = await read('src/screens/QuranScreen.tsx');
const quranGuide = await read('src/screens/QuranBeginnerGuideScreen.tsx');

const requiredLessonIds = [
  'beginner-islam',
  'beginner-allah',
  'beginner-shahada',
  'beginner-prophet',
  'beginner-quran-sunnah',
  'beginner-five-pillars',
  'beginner-six-beliefs',
  'beginner-purity',
  'beginner-prayer',
  'beginner-next-steps',
];

for (const id of requiredLessonIds) {
  if (!content.includes(`id: '${id}'`)) throw new Error(`Beginner P0 lesson missing: ${id}`);
}

const lessonIds = [...content.matchAll(/\n    id: '(beginner-[a-z-]+)',/g)].map((match) => match[1]);
if (lessonIds.length !== requiredLessonIds.length) {
  throw new Error(`Expected ${requiredLessonIds.length} beginner lessons, found ${lessonIds.length}.`);
}
if (new Set(lessonIds).size !== lessonIds.length) throw new Error('Beginner lesson IDs must be unique.');

// The type declaration in the same file ends the line with a semicolon; only
// the lesson records end it with a comma, so the comma keeps this counting
// data and not the type.
const reviewMarkers = content.match(/reviewStatus: 'needs-expert-review',/g) ?? [];
if (reviewMarkers.length !== requiredLessonIds.length) {
  throw new Error(`Every beginner lesson must remain explicitly gated for expert review. Found ${reviewMarkers.length}/${requiredLessonIds.length}.`);
}
if (content.includes("reviewStatus: 'approved'")) {
  throw new Error('Beginner content cannot be marked approved in source data without the external review process.');
}

const sourceBlocks = content.match(/\n    sources: \[/g) ?? [];
if (sourceBlocks.length !== requiredLessonIds.length) {
  throw new Error(`Every beginner lesson needs a source block. Found ${sourceBlocks.length}/${requiredLessonIds.length}.`);
}
const sourceReferences = [...content.matchAll(/reference: '([^']+)'/g)].map((match) => match[1].trim());
if (sourceReferences.some((referenceValue) => !referenceValue || referenceValue === '—')) {
  throw new Error('Beginner curriculum contains an empty source reference.');
}

for (const required of [
  'readKnowledgeLevel',
  'nur_knowledge_level',
  'readBeginnerCompleted',
  'beginner-home-path',
  'Neu im Islam · Dein nächster Schritt',
  'Nächste Grundlage öffnen',
  'Als Nächstes sinnvoll',
  'isReleaseBlockedTab',
  'ReleaseLockedScreen',
  'Noch in Prüfung',
  'isLegacyFeatureReleaseReady',
]) {
  if (!app.includes(required)) throw new Error(`Personalized or release-gated Home is missing: ${required}`);
}
if (!app.includes("knowledgeLevel === 'beginner'")) {
  throw new Error('Home does not branch on the stored beginner knowledge level.');
}
if (!app.includes("localStorage.setItem('nur_beginner_learning_last', nextBeginnerLesson.id)")) {
  throw new Error('Home does not persist the next beginner lesson before opening learning.');
}

for (const forbidden of [
  "label: 'Islam Quiz'",
  "label: 'Nur Assistent'",
  "onNavigate('legacy:fasting')",
  "onNavigate('legacy:ummah')",
  'className="ai-preview"',
]) {
  if (app.includes(forbidden)) throw new Error(`Unreleased module is still promoted on public Home: ${forbidden}`);
}
if (!app.includes('قُلْ هُوَ ٱللَّهُ أَحَدٌ')) {
  throw new Error('Home Quran focus text is missing the complete Al-Ikhlas 112:1 Arabic wording.');
}

for (const required of [
  "export type LegacyReleaseStatus = 'ready' | 'review-required' | 'later'",
  'releaseReadyLearningLegacyFeatures',
  'releaseReadyServiceLegacyFeatures',
  'isLegacyFeatureReleaseReady',
]) {
  if (!legacy.includes(required)) throw new Error(`Legacy release classification is missing: ${required}`);
}
for (const featureId of ['quiz', 'hajj', 'hadith-library', 'knowledge', 'prophets', 'fasting', 'ummah', 'zakat', 'standby']) {
  const featureMatch = new RegExp(`id: '${featureId}'[^\n]+releaseStatus: '(review-required|later)'`).test(legacy);
  if (!featureMatch) throw new Error(`Legacy feature must remain gated until reviewed: ${featureId}`);
}
if (!learn.includes('releaseReadyLearningLegacyFeatures')) {
  throw new Error('Learning hub is not filtered to release-ready legacy modules.');
}
if (!more.includes('releaseReadyServiceLegacyFeatures')) {
  throw new Error('More hub is not filtered to release-ready legacy services.');
}

for (const required of [
  'nur_beginner_learning_completed',
  'fachlicher Endreview',
  'Quellen & Prüfung',
  'Einfach erklärt',
  'Deine ersten 7 Tage',
  'BeginnerStarterPlanScreen',
]) {
  if (!journey.includes(required)) throw new Error(`Beginner journey is missing release-critical UI: ${required}`);
}

for (const required of [
  'STARTER_DAYS',
  'day: 1',
  'day: 7',
  'Kein Zeitdruck',
  '7 Tage',
  'onOpenLesson',
]) {
  if (!starterPlan.includes(required)) throw new Error(`Seven-day beginner starter plan is missing: ${required}`);
}
for (const id of requiredLessonIds) {
  if (!starterPlan.includes(`'${id}'`)) throw new Error(`Seven-day starter plan does not reference beginner lesson: ${id}`);
}

for (const level of ['beginner', 'familiar', 'experienced']) {
  if (!onboarding.includes(`id: '${level}'`)) throw new Error(`Onboarding knowledge level missing: ${level}`);
}
if (!onboarding.includes('nur_knowledge_level')) throw new Error('Onboarding does not persist the knowledge level.');
if (!learn.includes('readKnowledgeLevel') || !learn.includes('Neu im Islam')) {
  throw new Error('Learning hub does not consume the beginner knowledge level.');
}
if (!learn.includes("useState(() => readKnowledgeLevel() === 'beginner'")) {
  throw new Error('Incomplete beginners are not routed directly into the guided journey.');
}
if (!learn.includes("readStringSet('nur_beginner_learning_completed').size < BEGINNER_LESSONS.length")) {
  throw new Error('Direct beginner routing does not stop after all ten foundations are complete.');
}

for (const required of ['Fragen & Begriffe', 'Islam A–Z', 'Anfängerhilfe durchsuchen']) {
  if (!reference.includes(required)) throw new Error(`Beginner reference UI missing: ${required}`);
}

for (const required of ['Ghusl', 'Tayammum', 'Sure Al-Maida 5:6', 'Sonderfälle']) {
  if (!purity.includes(required)) throw new Error(`Purity basics missing release-critical content: ${required}`);
}

if (!quran.includes('QuranBeginnerGuideScreen') || !quran.includes('Quran für Anfänger')) {
  throw new Error('Quran library does not expose the beginner guide.');
}
for (const surahNumber of [1, 112, 113, 114]) {
  if (!quran.includes(`number: ${surahNumber},`)) throw new Error(`Quran beginner start selection missing surah ${surahNumber}.`);
}
for (const required of ['Quran-Lexikon', 'Sure', 'Ayah', 'Juz', 'Al-Baqara 2:185', 'fachlichen Endreview']) {
  if (!quranGuide.includes(required)) throw new Error(`Quran beginner guide missing: ${required}`);
}

console.log('Beginner release guard verified: personalized Home, direct beginner routing, public legacy/AI release boundary, 10 sourced lessons, seven-day starter plan, review gate, FAQ/glossary, purity basics, and Quran orientation.');
