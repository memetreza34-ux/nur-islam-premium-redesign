import { beforeEach, describe, expect, it } from 'vitest';
import { readLastLesson } from '../screens/LearningCourseScreen';
import { readNumber } from '../screens/PrayerLearningScreen';
import { LEARNING_LESSONS } from '../data/islamicLearningContent';

// Learning progress points at content by id. When the content changes under a
// stored pointer, the screen must fall back to something real rather than
// resuming into a lesson that no longer exists.

const aqidahLessons = LEARNING_LESSONS.filter((lesson) => lesson.categoryId === 'aqidah');

describe('resuming a course', () => {
  beforeEach(() => localStorage.clear());

  it('resumes the stored lesson when it still exists', () => {
    const target = aqidahLessons[1] ?? aqidahLessons[0];
    localStorage.setItem('nur_learning_last_aqidah', target.id);
    expect(readLastLesson('aqidah', aqidahLessons)).toBe(target.id);
  });

  it('starts at the first lesson when nothing is stored', () => {
    expect(readLastLesson('aqidah', aqidahLessons)).toBe(aqidahLessons[0].id);
  });

  // The case a content update creates: the pointer survives, the lesson does
  // not. Resuming into it would leave the screen empty.
  it('falls back to the first lesson when the stored one is gone', () => {
    localStorage.setItem('nur_learning_last_aqidah', 'lesson-removed-in-a-content-update');
    expect(readLastLesson('aqidah', aqidahLessons)).toBe(aqidahLessons[0].id);
  });

  it('does not resume a lesson from a different category', () => {
    const foreign = LEARNING_LESSONS.find((lesson) => lesson.categoryId !== 'aqidah');
    localStorage.setItem('nur_learning_last_aqidah', foreign?.id ?? 'x');
    expect(readLastLesson('aqidah', aqidahLessons)).toBe(aqidahLessons[0].id);
  });

  it('copes with an empty course without throwing', () => {
    localStorage.setItem('nur_learning_last_aqidah', 'anything');
    expect(readLastLesson('aqidah', [])).toBe('');
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
