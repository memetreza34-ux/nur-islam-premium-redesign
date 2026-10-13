import { useCallback, useLayoutEffect, useRef, useState } from 'react';

export function useStepNavigation<T extends HTMLElement>() {
  const stepRef = useRef<T>(null);
  const [navigation, setNavigation] = useState(0);
  const revealStep = useCallback(() => setNavigation(value => value + 1), []);

  useLayoutEffect(() => {
    if (navigation === 0) return;
    const step = stepRef.current;
    if (!step) return;
    const heading = step.querySelector<HTMLElement>('h2');
    (heading ?? step).focus({ preventScroll: true });
    step.scrollIntoView({ block: 'start', behavior: 'instant' });
  }, [navigation]);

  return { stepRef, revealStep };
}
