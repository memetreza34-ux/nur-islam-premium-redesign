import { expect, test } from '@playwright/test';
import { openApp } from './appReady';

/**
 * Reduced motion has to actually reach the animations.
 *
 * Verified here because it is the one accessibility setting whose failure is
 * invisible: the app looks correct either way, and only someone who needs it
 * notices that nothing settled.
 */
test('animations stop when the system asks for reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await openApp(page);

  expect(await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches)).toBe(true);

  const running = await page.evaluate(() => {
    const out: string[] = [];
    for (const el of document.querySelectorAll('*')) {
      const style = getComputedStyle(el);
      if (style.animationName && style.animationName !== 'none' && style.animationIterationCount === 'infinite') {
        out.push(`${el.tagName}.${typeof el.className === 'string' ? el.className : ''}: ${style.animationName}`);
      }
    }
    return [...new Set(out)];
  });

  expect(running, 'endless animations still running under reduced motion').toEqual([]);
});
