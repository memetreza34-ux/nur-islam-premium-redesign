import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const content = await readFile(resolve(root, 'src/data/islamicLearningContent.ts'), 'utf8');
const categories = await readFile(resolve(root, 'src/data/learningCategories.ts'), 'utf8');
const course = await readFile(resolve(root, 'src/screens/LearningCourseScreen.tsx'), 'utf8');
const progress = await readFile(resolve(root, 'src/services/learningProgress.ts'), 'utf8');
const learn = await readFile(resolve(root, 'src/screens/LearnScreen.tsx'), 'utf8');
const styles = await readFile(resolve(root, 'src/styles/reference-learning-courses.css'), 'utf8');
const styleIndex = await readFile(resolve(root, 'src/styles.css'), 'utf8');

const categoryLessonCounts = {
  faith: 7,
  pillars: 6,
  terms: 12,
  practice: 5,
  character: 4,
  community: 6,
  prophet: 4,
};
for (const [categoryId, expectedCount] of Object.entries(categoryLessonCounts)) {
  if (!categories.includes(`id: '${categoryId}'`)) throw new Error(`Learning category missing: ${categoryId}`);
  const lessonMatches = content.match(new RegExp(`categoryId: '${categoryId}'`, 'g')) ?? [];
  if (lessonMatches.length !== expectedCount) throw new Error(`${categoryId} must contain exactly ${expectedCount} sourced lessons.`);
}

const lessonIds = [...content.matchAll(/\n    id: '([a-z]+-[a-z-]+)',\n    categoryId:/g)].map((match) => match[1]);
if (lessonIds.length !== 44) throw new Error(`Expected 44 non-duplicated learning lessons, found ${lessonIds.length}.`);
if (new Set(lessonIds).size !== lessonIds.length) throw new Error('Learning lesson IDs must be unique.');

const requiredIntroductions = ['faith-overview', 'pillars-overview', 'terms-overview', 'practice-overview', 'character-overview', 'community-overview', 'prophet-overview'];
for (const lessonId of requiredIntroductions) {
  if (!content.includes(`id: '${lessonId}'`)) throw new Error(`Structured course introduction missing: ${lessonId}`);
}
if (content.includes("id: 'aqidah-iman'") || content.includes("id: 'aqidah-tawhid'")) {
  throw new Error('The old combined faith lessons must not duplicate the new six-part faith course.');
}

const requiredContentFeatures = [
  'paragraphs:',
  'sectionTitles?:',
  'detailItems?:',
  'keyPoints:',
  'sources:',
  'question:',
  'correctIndex:',
  'Sahih al-Bukhari 1',
  "id: 'terms-islam-iman-ihsan'",
  "id: 'terms-niyyah'",
  "id: 'terms-mubah-makruh'",
  "id: 'terms-hadith-fiqh-madhhab'",
  "id: 'fiqh-ghusl-tayammum'",
  "id: 'community-parents'",
  "id: 'community-neighbors'",
  "id: 'community-speech'",
  "id: 'community-money'",
];
for (const feature of requiredContentFeatures) {
  if (!content.includes(feature)) throw new Error(`Learning curriculum is missing: ${feature}`);
}

const requiredCourseFeatures = [
  'courseMapOpen',
  'readLearningPosition',
  'writeLearningPosition',
  'Lektion auswählen',
  'selectedLesson.sources.map',
  'navigator.share',
  'Diese Inhalte sind kompakte Einführungen',
];
for (const feature of requiredCourseFeatures) {
  if (!course.includes(feature)) throw new Error(`Interactive learning course is missing: ${feature}`);
}

if (!learn.includes('LearningCourseScreen') || !learn.includes('openLearningCategory(category.id')) {
  throw new Error('Learning categories are not wired to the real course screen.');
}
if (!learn.includes('learningOverviewScroll') || !learn.includes('closeLearningCategory')) {
  throw new Error('Knowledge categories must restore the learning overview scroll position on back.');
}
if (!learn.includes('99 Namen Allahs') || !learn.includes('onOpenNames')) {
  throw new Error('The complete 99 Names experience is not linked from the foundations grid.');
}
if (learn.includes('ist als nächster Ausbau vorgemerkt')) {
  throw new Error('Old placeholder learning modal is still active.');
}
if (!learn.includes('aria-label="Lernbereiche"') || !learn.includes('reference-foundation-path') || !learn.includes('learn-library-section-heading')) {
  throw new Error('The reading directory must keep direct area navigation and all lesson entries available without completion counts.');
}
for (const obsolete of ['learn-library-intro__path', 'Dein Grundlagenpfad', 'chapter.eyebrow', 'chapter.description']) {
  if (learn.includes(obsolete)) throw new Error(`The compact reading directory must not restore redundant introductory copy: ${obsolete}`);
}
for (const forbidden of ['updateLearningCompletion', 'readLearningProgress', 'reference-learning-completion-backdrop', 'completionOpen', 'is-complete', 'learning-course-v2__quiz', 'Wissen prüfen', 'answerQuestion']) {
  if (course.includes(forbidden)) throw new Error(`Reading lessons must not restore completion or end-of-lesson tests: ${forbidden}`);
}
if (learn.includes('knowledgeState') || learn.includes('reference-knowledge-overview')) throw new Error('Reading overview must not expose completion progress.');

if (!styles.includes('.learning-course-v2__plan-toggle') || !styles.includes('.learning-course-v2__details')) {
  throw new Error('Interactive learning course styles are incomplete.');
}
if (!styleIndex.includes("reference-learning-courses.css")) {
  throw new Error('Interactive learning course stylesheet is not loaded.');
}

console.log('Learning curriculum structure verified: seven categories, 44 non-duplicated lessons with source fields, the 99 Names entry, reading-position restoration without end-of-lesson tests or completion tracking. This check does not verify religious content or successful storage.');
