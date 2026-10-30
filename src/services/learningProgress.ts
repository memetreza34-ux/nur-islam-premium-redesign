import { LEARNING_CATEGORIES, type LearningCategoryId } from '../data/learningCategories';

export const LEARNING_PROGRESS_KEY = 'nur_learning_completed';
const knownLessonIds = new Set(LEARNING_CATEGORIES.flatMap(category => category.lessonIds));

export function readLearningProgress(): { completed: Set<string>; valid: boolean } {
  try {
    const raw = localStorage.getItem(LEARNING_PROGRESS_KEY);
    if (raw === null) return { completed: new Set(), valid: true };
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed) || !parsed.every(id => typeof id === 'string' && id.trim().length > 0)) {
      return { completed: new Set(), valid: false };
    }
    return { completed: new Set(parsed as string[]), valid: true };
  } catch {
    return { completed: new Set(), valid: false };
  }
}

export function updateLearningCompletion(lessonId: string, complete: boolean) {
  if (!knownLessonIds.has(lessonId)) return null;
  const current = readLearningProgress();
  if (!current.valid) return null;
  const completed = new Set(current.completed);
  if (complete) completed.add(lessonId);
  else completed.delete(lessonId);
  const value = JSON.stringify([...completed]);
  try {
    localStorage.setItem(LEARNING_PROGRESS_KEY, value);
    return localStorage.getItem(LEARNING_PROGRESS_KEY) === value ? { completed, valid: true } : null;
  } catch {
    return null;
  }
}

export function readLearningPosition(categoryId: LearningCategoryId, lessons: ReadonlyArray<{ id: string }>) {
  const fallback = lessons[0]?.id ?? '';
  try {
    const stored = localStorage.getItem(`nur_learning_last_${categoryId}`);
    if (stored === null) return { lessonId: fallback, valid: true };
    return lessons.some(lesson => lesson.id === stored)
      ? { lessonId: stored, valid: true }
      : { lessonId: fallback, valid: false };
  } catch {
    return { lessonId: fallback, valid: false };
  }
}

export function writeLearningPosition(categoryId: LearningCategoryId, lessonId: string) {
  if (!LEARNING_CATEGORIES.find(category => category.id === categoryId)?.lessonIds.includes(lessonId)) return false;
  const key = `nur_learning_last_${categoryId}`;
  try {
    localStorage.getItem(key);
    localStorage.setItem(key, lessonId);
    return localStorage.getItem(key) === lessonId;
  } catch {
    return false;
  }
}
