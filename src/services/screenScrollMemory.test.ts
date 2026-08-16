import { beforeEach, describe, expect, it } from 'vitest';
import {
  clearScreenScrollMemory,
  forgetScreenScroll,
  readScreenScroll,
  rememberScreenScroll,
} from './screenScrollMemory';

describe('screen scroll memory', () => {
  beforeEach(clearScreenScrollMemory);

  it('reports zero for a screen this session has not seen', () => {
    expect(readScreenScroll('home-')).toBe(0);
  });

  it('keeps a separate position per screen', () => {
    rememberScreenScroll('home-', 1800);
    rememberScreenScroll('duas-morning', 240);

    expect(readScreenScroll('home-')).toBe(1800);
    expect(readScreenScroll('duas-morning')).toBe(240);
  });

  it('clamps the rubber-band overscroll iOS reports at the top edge', () => {
    rememberScreenScroll('home-', -60);

    expect(readScreenScroll('home-')).toBe(0);
  });

  it('forgets a single screen without touching the others', () => {
    rememberScreenScroll('home-', 1800);
    rememberScreenScroll('prayer-', 300);

    forgetScreenScroll('home-');

    expect(readScreenScroll('home-')).toBe(0);
    expect(readScreenScroll('prayer-')).toBe(300);
  });
});
