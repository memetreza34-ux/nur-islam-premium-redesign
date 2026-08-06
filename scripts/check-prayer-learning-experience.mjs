import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const app = await readFile(resolve(root, 'src/App.tsx'), 'utf8');
const learn = await readFile(resolve(root, 'src/LearnScreen.tsx'), 'utf8');
const course = await readFile(resolve(root, 'src/PrayerLearningScreen.tsx'), 'utf8');
const prayer = await readFile(resolve(root, 'src/PrayerScreen.tsx'), 'utf8');
const styles = await readFile(resolve(root, 'src/styles/reference-prayer-learning-completion.css'), 'utf8');
const styleIndex = await readFile(resolve(root, 'src/styles.css'), 'utf8');

const requiredPrayerIds = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
for (const id of requiredPrayerIds) {
  if (!course.includes(`id: '${id}'`)) throw new Error(`Prayer learning course is missing ${id}.`);
}

const requiredCourseFeatures = [
  'Beten lernen',
  'Gebetskurs',
  'Vorbereitung',
  'Übungsmodus',
  'Positionen lernen',
  'nur_prayer_learning_complete',
  'nur_prayer_learning_preparation',
  'mihrab-arch-v2.webp',
  'onOpenQibla',
  'onOpenPrayerTimes',
];
for (const feature of requiredCourseFeatures) {
  if (!course.includes(feature)) throw new Error(`Prayer learning course is missing: ${feature}`);
}

if (!learn.includes('reference-prayer-learning-hub') || !learn.includes('Die fünf Pflichtgebete')) {
  throw new Error('Prayer learning is no longer the primary learning experience.');
}
if (!learn.includes('PRAYER_LESSONS.map') || !learn.includes('Wudu lernen') || !learn.includes('Qibla finden')) {
  throw new Error('Learning screen is missing a core prayer-learning action.');
}
if (!app.includes("label: 'Beten lernen'") || !app.includes('onOpenPrayer={() => setActiveTab(\'prayer\')}') || !app.includes('onOpenQibla={() => setActiveTab(\'qibla\')}')) {
  throw new Error('App navigation is not wired to the prayer learning experience.');
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
if (!prayer.includes("readSet(`nur_prayers_${dateKey}`, [])")) {
  throw new Error('Prayer tracker must start without a fake pre-completed prayer.');
}

if (!styles.includes('.reference-prayer-learning-hub') || !styles.includes('.prayer-completion-modal')) {
  throw new Error('Prayer learning or completion styles are missing.');
}
if (!styleIndex.includes("reference-prayer-learning-completion.css")) {
  throw new Error('Prayer learning stylesheet is not loaded.');
}

console.log('Prayer learning verified: five prayer lessons, real navigation, persisted progress, and respectful 5/5 completion effect.');
