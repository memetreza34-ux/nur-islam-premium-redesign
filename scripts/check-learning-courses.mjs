import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const content = await readFile(resolve(root, 'src/data/islamicLearningContent.ts'), 'utf8');
const course = await readFile(resolve(root, 'src/screens/LearningCourseScreen.tsx'), 'utf8');
const learn = await readFile(resolve(root, 'src/screens/LearnScreen.tsx'), 'utf8');
const styles = await readFile(resolve(root, 'src/styles/reference-learning-courses.css'), 'utf8');
const styleIndex = await readFile(resolve(root, 'src/styles.css'), 'utf8');

const categoryIds = ['aqidah', 'fiqh', 'tafsir', 'seerah', 'hadith', 'akhlaq'];
for (const categoryId of categoryIds) {
  if (!content.includes(`id: '${categoryId}'`)) throw new Error(`Learning category missing: ${categoryId}`);
  const lessonMatches = content.match(new RegExp(`categoryId: '${categoryId}'`, 'g')) ?? [];
  if (lessonMatches.length !== 3) throw new Error(`${categoryId} must contain exactly three introductory lessons.`);
}

const lessonIds = [...content.matchAll(/\n    id: '([a-z]+-[a-z-]+)',\n    categoryId:/g)].map((match) => match[1]);
if (lessonIds.length !== 18) throw new Error(`Expected 18 learning lessons, found ${lessonIds.length}.`);
if (new Set(lessonIds).size !== lessonIds.length) throw new Error('Learning lesson IDs must be unique.');

const requiredContentFeatures = [
  'paragraphs:',
  'keyPoints:',
  'sources:',
  'question:',
  'correctIndex:',
  'Sinngemäße',
  'Sahih al-Bukhari 1',
  'Sure Al-Hujurat 49:6',
];
for (const feature of requiredContentFeatures) {
  if (!content.includes(feature)) throw new Error(`Learning curriculum is missing: ${feature}`);
}

const requiredCourseFeatures = [
  'nur_learning_completed',
  'nur_learning_points_',
  'answerQuestion',
  'selectedLesson.sources.map',
  'selectedLesson.question.options.map',
  'reference-learning-completion-backdrop',
  'navigator.vibrate',
  'navigator.share',
  'Diese Inhalte sind kompakte Einführungen',
];
for (const feature of requiredCourseFeatures) {
  if (!course.includes(feature)) throw new Error(`Interactive learning course is missing: ${feature}`);
}

if (!learn.includes('LearningCourseScreen') || !learn.includes('setLearningCategory(category.id)')) {
  throw new Error('Learning categories are not wired to the real course screen.');
}
if (learn.includes('ist als nächster Ausbau vorgemerkt')) {
  throw new Error('Old placeholder learning modal is still active.');
}
if (!learn.includes('Wissen mit Quellen') || !learn.includes('nur_learning_completed')) {
  throw new Error('Learning overview does not expose sourced course progress.');
}

if (!styles.includes('.reference-learning-course-hero') || !styles.includes('.reference-learning-quiz') || !styles.includes('.reference-learning-completion-modal')) {
  throw new Error('Interactive learning course styles are incomplete.');
}
if (!styleIndex.includes("reference-learning-courses.css")) {
  throw new Error('Interactive learning course stylesheet is not loaded.');
}

console.log('Learning curriculum verified: six categories, 18 sourced lessons, quizzes, persisted progress, and completion effects.');
