import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { readLastLesson } from '../screens/LearningCourseScreen';
import { readNumber } from '../screens/PrayerLearningScreen';
import { LEARNING_LESSONS } from '../data/islamicLearningContent';
import { LEARNING_PROGRESS_KEY, readLearningProgress, readLearningPosition, updateLearningCompletion, writeLearningPosition } from './learningProgress';

// Learning progress points at content by id. When the content changes under a
// stored pointer, the screen must fall back to something real rather than
// resuming into a lesson that no longer exists.

const faithLessons = LEARNING_LESSONS.filter((lesson) => lesson.categoryId === 'faith');

describe('confirmed knowledge progress storage', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); });
  const mockStorage = (overrides: Partial<Pick<Storage, 'getItem' | 'setItem'>>) => {
    const stored = localStorage;
    vi.stubGlobal('localStorage', { getItem: stored.getItem.bind(stored), setItem: stored.setItem.bind(stored), ...overrides });
    return stored;
  };

  it('reads an absent value without creating progress', () => {
    expect(readLearningProgress()).toEqual({ completed: new Set(), valid: true });
    expect(localStorage.getItem(LEARNING_PROGRESS_KEY)).toBeNull();
  });

  it.each(['{broken', '{}', 'null', '"faith-overview"', '[1]', '["faith-overview",null]', '[""]', '[" "]'])('preserves invalid data %s on read and completion', raw => {
    localStorage.setItem(LEARNING_PROGRESS_KEY, raw);
    expect(readLearningProgress().valid).toBe(false);
    expect(updateLearningCompletion('faith-overview', true)).toBeNull();
    expect(localStorage.getItem(LEARNING_PROGRESS_KEY)).toBe(raw);
  });

  it('does not coerce objects into apparently valid lesson IDs', () => {
    localStorage.setItem(LEARNING_PROGRESS_KEY, '[{"id":"faith-overview"}]');
    expect(readLearningProgress().completed.size).toBe(0);
    expect(readLearningProgress().valid).toBe(false);
  });

  it('preserves unknown stored strings while changing one real lesson', () => {
    localStorage.setItem(LEARNING_PROGRESS_KEY, '["removed-lesson","pillars-hajj"]');
    expect(updateLearningCompletion('faith-overview', true)?.completed).toEqual(new Set(['removed-lesson', 'pillars-hajj', 'faith-overview']));
    expect(updateLearningCompletion('faith-overview', false)?.completed).toEqual(new Set(['removed-lesson', 'pillars-hajj']));
    expect(JSON.parse(localStorage.getItem(LEARNING_PROGRESS_KEY)!)).toEqual(['removed-lesson', 'pillars-hajj']);
  });

  it('reads the latest other-tab data before a targeted update', () => {
    readLearningProgress();
    localStorage.setItem(LEARNING_PROGRESS_KEY, '["faith-allah"]');
    expect(updateLearningCompletion('faith-overview', true)?.completed).toEqual(new Set(['faith-allah', 'faith-overview']));
  });

  it.each(['throw', 'discard'])('does not confirm a %s write', mode => {
    localStorage.setItem(LEARNING_PROGRESS_KEY, '["faith-allah"]');
    const stored = mockStorage({ setItem: () => { if (mode === 'throw') throw new DOMException('Full', 'QuotaExceededError'); } });
    expect(updateLearningCompletion('faith-overview', true)).toBeNull();
    expect(stored.getItem(LEARNING_PROGRESS_KEY)).toBe('["faith-allah"]');
  });

  it('does not overwrite data when reading it is denied', () => {
    localStorage.setItem(LEARNING_PROGRESS_KEY, '["faith-allah"]');
    const write = vi.fn(localStorage.setItem.bind(localStorage));
    const stored = mockStorage({ getItem: () => { throw new Error('Denied'); }, setItem: write });
    expect(updateLearningCompletion('faith-overview', true)).toBeNull();
    expect(write).not.toHaveBeenCalled();
    expect(stored.getItem(LEARNING_PROGRESS_KEY)).toBe('["faith-allah"]');
  });

  it('does not confirm a write when its readback is denied', () => {
    const stored = localStorage;
    let written = false;
    mockStorage({ getItem: key => { if (written) throw new Error('Readback denied'); return stored.getItem(key); }, setItem: (key, value) => { stored.setItem(key, value); written = true; } });
    expect(updateLearningCompletion('faith-overview', true)).toBeNull();
    expect(stored.getItem(LEARNING_PROGRESS_KEY)).toBe('["faith-overview"]');
  });

  it('rejects unknown newly requested IDs', () => {
    expect(updateLearningCompletion('invented-lesson', true)).toBeNull();
    expect(localStorage.getItem(LEARNING_PROGRESS_KEY)).toBeNull();
  });

  it('does not rewrite an obsolete resume pointer while reading', () => {
    localStorage.setItem('nur_learning_last_faith', 'old-lesson');
    expect(readLearningPosition('faith', faithLessons)).toEqual({ lessonId: 'faith-overview', valid: false });
    expect(localStorage.getItem('nur_learning_last_faith')).toBe('old-lesson');
  });

  it('writes and reads back a valid explicit navigation', () => {
    expect(writeLearningPosition('faith', 'faith-allah')).toBe(true);
    expect(readLearningPosition('faith', faithLessons)).toEqual({ lessonId: 'faith-allah', valid: true });
    expect(writeLearningPosition('faith', 'pillars-hajj')).toBe(false);
    expect(localStorage.getItem('nur_learning_last_faith')).toBe('faith-allah');
  });

  it.each(['throw', 'discard', 'read-denied', 'readback-denied'])('does not confirm cursor storage with %s', mode => {
    const stored = localStorage;
    let written = false;
    mockStorage({
      getItem: key => { if (mode === 'read-denied' || (mode === 'readback-denied' && written)) throw new Error('Denied'); return stored.getItem(key); },
      setItem: (key, value) => { if (mode === 'throw') throw new Error('Full'); if (mode !== 'discard') stored.setItem(key, value); written = true; },
    });
    expect(writeLearningPosition('faith', 'faith-allah')).toBe(false);
  });
});

describe('resuming a course', () => {
  beforeEach(() => localStorage.clear());

  it('resumes the stored lesson when it still exists', () => {
    const target = faithLessons[1] ?? faithLessons[0];
    localStorage.setItem('nur_learning_last_faith', target.id);
    expect(readLastLesson('faith', faithLessons)).toBe(target.id);
  });

  it('starts at the first lesson when nothing is stored', () => {
    expect(readLastLesson('faith', faithLessons)).toBe(faithLessons[0].id);
  });

  // The case a content update creates: the pointer survives, the lesson does
  // not. Resuming into it would leave the screen empty.
  it('falls back to the first lesson when the stored one is gone', () => {
    localStorage.setItem('nur_learning_last_faith', 'lesson-removed-in-a-content-update');
    expect(readLastLesson('faith', faithLessons)).toBe(faithLessons[0].id);
  });

  it('does not resume a lesson from a different category', () => {
    const foreign = LEARNING_LESSONS.find((lesson) => lesson.categoryId !== 'faith');
    localStorage.setItem('nur_learning_last_faith', foreign?.id ?? 'x');
    expect(readLastLesson('faith', faithLessons)).toBe(faithLessons[0].id);
  });

  it('copes with an empty course without throwing', () => {
    localStorage.setItem('nur_learning_last_faith', 'anything');
    expect(readLastLesson('faith', [])).toBe('');
  });
});

describe('numeric progress values', () => {
  beforeEach(() => localStorage.clear());

  it('returns the fallback when nothing is stored', () => {
    // Number(null) is 0 and finite, so the guard has to check the raw value.
    expect(readNumber('nur_prayer_lesson_fajr_rakah', 2)).toBe(2);
  });

  it('returns the fallback for an empty or blank value', () => {
    localStorage.setItem('nur_prayer_lesson_fajr_rakah', '');
    expect(readNumber('nur_prayer_lesson_fajr_rakah', 2)).toBe(2);
    localStorage.setItem('nur_prayer_lesson_fajr_rakah', '   ');
    expect(readNumber('nur_prayer_lesson_fajr_rakah', 2)).toBe(2);
  });

  it('returns the fallback for something that is not a number', () => {
    localStorage.setItem('nur_prayer_lesson_fajr_step', 'zwei');
    expect(readNumber('nur_prayer_lesson_fajr_step', 4)).toBe(4);
  });

  it('reads a stored number back', () => {
    localStorage.setItem('nur_prayer_lesson_fajr_step', '3');
    expect(readNumber('nur_prayer_lesson_fajr_step', 0)).toBe(3);
  });

  it('keeps a stored zero rather than treating it as absent', () => {
    localStorage.setItem('nur_prayer_lesson_fajr_step', '0');
    expect(readNumber('nur_prayer_lesson_fajr_step', 7)).toBe(0);
  });
});
