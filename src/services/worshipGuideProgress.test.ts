import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { WORSHIP_GUIDES } from '../data/worshipGuideData';
import { readGuideProgress, saveGuideCompletion, saveGuideStep } from './worshipGuideProgress';

beforeEach(() => localStorage.clear());
afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); });

describe('validated scalar progress for all existing worship guides', () => {
  it.each(WORSHIP_GUIDES.map(guide => [guide.id, guide.steps.length] as const))('%s stores only requested known fields', (id, count) => {
    localStorage.setItem('unrelated-personal-note', 'preserve');
    expect(readGuideProgress(id)).toEqual({ stepIndex: 0, hasStep: false, stepValid: true, completed: false, completionValid: true });
    expect(localStorage.getItem(`nur_guide_${id}_step`)).toBeNull();
    expect(saveGuideStep(id, count - 1)).toBe(true);
    expect(readGuideProgress(id).completed).toBe(false);
    expect(saveGuideCompletion(id)).toBe(true);
    expect(readGuideProgress(id)).toEqual({ stepIndex: count - 1, hasStep: true, stepValid: true, completed: true, completionValid: true });
    expect(localStorage.getItem(`nur_guide_${id}_step`)).toBe(String(count - 1));
    expect(localStorage.getItem(`nur_guide_${id}_complete`)).toBe('1');
    expect(localStorage.getItem('unrelated-personal-note')).toBe('preserve');
  });
  it.each(['', ' ', '5.5', '-1', 'Infinity', 'NaN', '10', '999', '05', 'future-step'])('preserves invalid or unknown position %j', raw => {
    localStorage.setItem('nur_guide_wudu_step', raw);
    const state = readGuideProgress('wudu');
    expect(state.stepValid).toBe(false);
    expect(state.hasStep).toBe(false);
    expect(state.stepIndex).toBe(0);
    expect(saveGuideStep('wudu', 1)).toBe(false);
    expect(localStorage.getItem('nur_guide_wudu_step')).toBe(raw);
  });
  it.each(['', 'true', '01', '{broken', 'future'])('preserves invalid or unknown completion %j', raw => {
    localStorage.setItem('nur_guide_wudu_complete', raw);
    expect(readGuideProgress('wudu').completionValid).toBe(false);
    expect(readGuideProgress('wudu').completed).toBe(false);
    expect(saveGuideCompletion('wudu')).toBe(false);
    expect(localStorage.getItem('nur_guide_wudu_complete')).toBe(raw);
  });
  it('accepts an explicit stored zero as incomplete and does not infer completion from position', () => {
    localStorage.setItem('nur_guide_wudu_step', '9');
    localStorage.setItem('nur_guide_wudu_complete', '0');
    expect(readGuideProgress('wudu')).toMatchObject({ completed: false, completionValid: true, stepIndex: 9 });
    expect(saveGuideCompletion('wudu')).toBe(true);
  });
  it('does not mutate unrecognized guide data', () => {
    localStorage.setItem('nur_guide_future_complete', 'custom');
    expect(readGuideProgress('future')).toMatchObject({ stepValid: false, completionValid: false });
    expect(saveGuideStep('future', 0)).toBe(false);
    expect(saveGuideCompletion('future')).toBe(false);
    expect(localStorage.getItem('nur_guide_future_complete')).toBe('custom');
    expect(localStorage.getItem('nur_guide_future_step')).toBeNull();
  });
  it.each([-1, .5, 10, Infinity])('rejects invalid requested Wudu position %s', index => {
    expect(saveGuideStep('wudu', index)).toBe(false);
    expect(localStorage.getItem('nur_guide_wudu_step')).toBeNull();
  });
  it('reads the current value before writing rather than replacing a newly malformed value', () => {
    expect(readGuideProgress('wudu').stepValid).toBe(true);
    localStorage.setItem('nur_guide_wudu_step', 'newer-unknown-value');
    expect(saveGuideStep('wudu', 2)).toBe(false);
    expect(localStorage.getItem('nur_guide_wudu_step')).toBe('newer-unknown-value');
  });
  for (const [name, write] of [['step', () => saveGuideStep('wudu', 1)], ['completion', () => saveGuideCompletion('wudu')]] as const) {
    it(`${name} rejects inaccessible reads without attempting writes`, () => {
      const setItem = vi.fn();
      vi.stubGlobal('localStorage', { getItem: () => { throw new Error('Denied'); }, setItem });
      expect(write()).toBe(false);
      expect(setItem).not.toHaveBeenCalled();
    });
    it(`${name} does not acknowledge rejected writes`, () => {
      const stored = localStorage;
      vi.stubGlobal('localStorage', { getItem: stored.getItem.bind(stored), setItem: () => { throw new Error('Quota'); } });
      expect(write()).toBe(false);
      expect(stored.length).toBe(0);
    });
    it(`${name} does not acknowledge silently dropped writes`, () => {
      const stored = localStorage;
      vi.stubGlobal('localStorage', { getItem: stored.getItem.bind(stored), setItem() {} });
      expect(write()).toBe(false);
      expect(stored.length).toBe(0);
    });
    it(`${name} does not acknowledge an altered readback`, () => {
      const stored = localStorage;
      vi.stubGlobal('localStorage', { getItem: stored.getItem.bind(stored), setItem: (key: string) => stored.setItem(key, 'different') });
      expect(write()).toBe(false);
    });
    it(`${name} does not acknowledge a readback exception`, () => {
      const stored = localStorage;
      let written = false;
      vi.stubGlobal('localStorage', {
        getItem: (key: string) => { if (written) throw new Error('Readback denied'); return stored.getItem(key); },
        setItem: (key: string, value: string) => { stored.setItem(key, value); written = true; },
      });
      expect(write()).toBe(false);
    });
  }
  it('keeps corrupt fields independent and does not repair the other field on explicit action', () => {
    localStorage.setItem('nur_guide_wudu_complete', '{unknown');
    expect(saveGuideStep('wudu', 1)).toBe(true);
    expect(localStorage.getItem('nur_guide_wudu_complete')).toBe('{unknown');
    localStorage.setItem('nur_guide_salah_step', 'future');
    expect(saveGuideCompletion('salah')).toBe(true);
    expect(localStorage.getItem('nur_guide_salah_step')).toBe('future');
  });
});
