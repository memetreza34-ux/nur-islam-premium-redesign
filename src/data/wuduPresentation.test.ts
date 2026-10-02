import { describe, expect, it } from 'vitest';
import { WORSHIP_GUIDE_BY_ID } from './worshipGuideData';
import { WUDU_PRESENTATION } from './wuduPresentation';

describe('Wudu presentation', () => {
  const guide = WORSHIP_GUIDE_BY_ID.get('wudu')!;
  it('keeps the ten source steps and eight washing illustrations aligned', () => {
    expect(WUDU_PRESENTATION).toHaveLength(guide.steps.length);
    const images = WUDU_PRESENTATION.flatMap(step => step.image ? [step.image] : []);
    expect(images).toHaveLength(8);
    expect(new Set(images).size).toBe(8);
    for (const step of WUDU_PRESENTATION.filter(step => step.image)) expect(step.imageDescription).toBeTruthy();
  });
  it('gives every Arabic passage pronunciation and distinguishes labels from spoken words', () => {
    guide.steps.forEach((step, index) => {
      if (step.arabic) {
        expect(WUDU_PRESENTATION[index].pronunciation?.length).toBeGreaterThan(0);
        expect(WUDU_PRESENTATION[index].arabicRole).toBe([0, 9].includes(index) ? 'spoken' : 'term');
      }
    });
  });
});
