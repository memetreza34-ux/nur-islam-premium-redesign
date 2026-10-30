import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const app = await readFile(resolve(root, 'src/app/App.tsx'), 'utf8');
const learn = await readFile(resolve(root, 'src/screens/LearnScreen.tsx'), 'utf8');
const course = await readFile(resolve(root, 'src/screens/PrayerLearningScreen.tsx'), 'utf8');
const prayer = await readFile(resolve(root, 'src/screens/PrayerScreen.tsx'), 'utf8');
const styles = await readFile(resolve(root, 'src/styles/reference-prayer-learning-completion.css'), 'utf8');
const styleIndex = await readFile(resolve(root, 'src/styles.css'), 'utf8');
// The five lessons moved out of the screen into their own module so the
// learning hub can list them without pulling the whole prayer sequence into
// the entry bundle. They are still what this check is about.
const lessons = await readFile(resolve(root, 'src/data/prayerLessons.ts'), 'utf8');

const requiredPrayerIds = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
for (const id of requiredPrayerIds) {
  if (!lessons.includes(`id: '${id}'`)) throw new Error(`Prayer learning course is missing ${id}.`);
}

const requiredCourseFeatures = [
  'Beten lernen',
  'Gebetskurs',
  'Vorbereitung',
  'Übung einstellen',
  // Was 'Positionen lernen', the heading over seven generic positions that were
  // identical for all five prayers and carried no wording. The course now walks
  // the actual Rakʿah, so the check follows the sequence instead of a caption.
  'PRAYER_RAKATS_BY_ID',
  'POSTURE_LABEL',
  'reference-rakah-wording__arabic',
  'nur_prayer_learning_preparation',
  'PRAYER_TIME_IMAGE',
  'PRAYER_MINI_IMAGE',
  'PrayerPostureImage',
  'onOpenQibla',
  'onOpenPrayerTimes',
];
for (const feature of requiredCourseFeatures) {
  if (!course.includes(feature)) throw new Error(`Prayer learning course is missing: ${feature}`);
}

const preparation = course.indexOf('className="reference-prayer-preparation"');
const instruction = course.indexOf('className={`reference-rakah-step-detail');
if (preparation < 0 || instruction < 0 || preparation > instruction) {
  throw new Error('Prayer preparation must appear before the chronological instructions.');
}
for (const label of ['So geht’s', 'Das sprichst du', 'Hinweise zum Wortlaut', 'Quelle und Einordnung']) {
  if (!course.includes(label)) throw new Error(`Prayer reading order is missing: ${label}`);
}
if (course.indexOf('currentStep.repetitionNote') < course.indexOf('reference-rakah-wording__translation')) {
  throw new Error('Extended wording notes must follow the meaning, outside the compact repetition controls.');
}

if (!learn.includes('<TopicCardContent title="Gebetsablauf"')) {
  throw new Error('Prayer learning is no longer the primary learning experience.');
}
if (!learn.includes('<TopicCardContent title="Wudu"') || !learn.includes('<TopicCardContent title="Qibla"')) {
  throw new Error('Learning screen is missing a core prayer-learning action.');
}
if (learn.includes('learn-library-prayer-card') || learn.includes('learn-library-prayers')) {
  throw new Error('The learning directory must use one prayer-course entry, without duplicate prayer cards.');
}
if (!course.includes('PRAYER_LESSONS.map')) throw new Error('The course must retain all five prayer choices.');

for (const fragment of [
  "label: 'Beten lernen'",
  "onOpenPrayer={() => navigate('prayer')}",
  "onOpenQibla={() => navigate('qibla')}",
]) {
  if (!app.includes(fragment)) throw new Error(`App navigation is not wired to the prayer learning experience: ${fragment}`);
}

const requiredCompletionFeatures = [
  'previousCompletedCount',
  'completedCount === 5',
  'prayer-completion-backdrop',
  'celebrationParticles',
  'navigator.vibrate',
  'calculatePrayerStreak',
  'shareCompletion',
  'Alle Pflichtgebete abgeschlossen',
];
for (const feature of requiredCompletionFeatures) {
  if (!prayer.includes(feature)) throw new Error(`Prayer completion experience is missing: ${feature}`);
}

const midnightSafeTrackerFeatures = [
  'initialDateKey',
  'currentDateKey',
  'completedDateKey',
  'readSet(`nur_prayers_${initialDateKey}`, [])',
  'readSet(`nur_prayers_${currentDateKey}`, [])',
  'writeSet(`nur_prayers_${completedDateKey}`, completed)',
  'setCompletedDateKey(currentDateKey)',
  'setCelebrationOpen(false)',
];
for (const feature of midnightSafeTrackerFeatures) {
  if (!prayer.includes(feature)) throw new Error(`Prayer tracker day rollover is incomplete: ${feature}`);
}

if (/readSet\(`nur_prayers_[^`]+`, \[['"][^\]]+/.test(prayer)) {
  throw new Error('Prayer tracker must not seed a fake pre-completed prayer.');
}

if (!styles.includes('.prayer-completion-modal')) {
  throw new Error('Prayer learning or completion styles are missing.');
}
if (!styleIndex.includes('reference-prayer-learning-completion.css')) {
  throw new Error('Prayer learning stylesheet is not loaded.');
}

console.log('Prayer learning verified: five prayer lessons, centralized real navigation, persisted midnight-safe daily progress, and respectful 5/5 completion effect.');
