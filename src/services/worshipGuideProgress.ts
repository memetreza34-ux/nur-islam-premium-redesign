import { WORSHIP_GUIDE_BY_ID } from '../data/worshipGuideData';

export type WorshipGuideProgress = {
  stepIndex: number;
  hasStep: boolean;
  stepValid: boolean;
  completed: boolean;
  completionValid: boolean;
};

function readValue(key: string) {
  try { return { raw: localStorage.getItem(key), readable: true }; }
  catch { return { raw: null, readable: false }; }
}

export function readGuideProgress(guideId: string): WorshipGuideProgress {
  const guide = WORSHIP_GUIDE_BY_ID.get(guideId);
  if (!guide) return { stepIndex: 0, hasStep: false, stepValid: false, completed: false, completionValid: false };
  const step = readValue(`nur_guide_${guideId}_step`);
  const completion = readValue(`nur_guide_${guideId}_complete`);
  const stepValid = step.readable && (step.raw === null || (/^(0|[1-9]\d*)$/.test(step.raw) && Number(step.raw) < guide.steps.length));
  const completionValid = completion.readable && (completion.raw === null || completion.raw === '0' || completion.raw === '1');
  return {
    stepIndex: stepValid && step.raw !== null ? Number(step.raw) : 0,
    hasStep: stepValid && step.raw !== null,
    stepValid,
    completed: completionValid && completion.raw === '1',
    completionValid,
  };
}

function writeConfirmed(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
    return localStorage.getItem(key) === value;
  } catch { return false; }
}

export function saveGuideStep(guideId: string, stepIndex: number) {
  const guide = WORSHIP_GUIDE_BY_ID.get(guideId);
  if (!guide || !Number.isInteger(stepIndex) || stepIndex < 0 || stepIndex >= guide.steps.length) return false;
  if (!readGuideProgress(guideId).stepValid) return false;
  return writeConfirmed(`nur_guide_${guideId}_step`, String(stepIndex));
}

export function saveGuideCompletion(guideId: string) {
  if (!WORSHIP_GUIDE_BY_ID.has(guideId) || !readGuideProgress(guideId).completionValid) return false;
  return writeConfirmed(`nur_guide_${guideId}_complete`, '1');
}
