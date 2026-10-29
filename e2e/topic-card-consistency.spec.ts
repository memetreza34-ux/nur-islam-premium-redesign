import { expect, test } from '@playwright/test';
import { prayerRequestFixture } from './fixtures/prayer-api';

test.use({ serviceWorkers: 'block', reducedMotion: 'reduce' });

for (const width of [320, 390, 768]) {
  for (const theme of ['dark', 'light']) {
    test(`topic cards share readable type and layout at ${width}px in ${theme}`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width, height: 900 });
      await page.addInitScript(value => localStorage.setItem('nur_theme', value), theme);
      await page.clock.setFixedTime(new Date('2026-10-23T12:00:00+02:00'));
      await page.route('https://api.aladhan.com/**', route => route.fulfill({ json: prayerRequestFixture(route.request().url()) }));
      await page.goto('/?preview=1');
      const nav = page.getByRole('navigation');
      await expect(nav).toBeVisible();
      await page.evaluate(value => { document.documentElement.dataset.theme = value; }, theme);
      await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
      await page.evaluate(() => document.fonts.ready);
      let palette: string[] | undefined;
      for (const tab of ['Start', 'Gebet', 'Lernen', 'Mehr']) {
        await nav.getByRole('button', { name: tab, exact: true }).click();
        const screen = page.locator(tab === 'Start' ? '.premium-home--v2' : tab === 'Gebet' ? '.reference-prayer-screen' : tab === 'Lernen' ? '.reference-learn-screen' : '.reference-profile-screen');
        await expect(screen).toBeVisible();
        if (tab === 'Start') {
          const resume = screen.locator('.journey-card--quran');
          const image = (await resume.locator('> .premium-image').boundingBox())!;
          const copy = (await resume.locator('> span:last-child').boundingBox())!;
          expect(image.x + image.width).toBeLessThanOrEqual(copy.x);
        }
        const cards = screen.locator('.topic-card');
        await expect(cards.first()).toBeVisible();
        const metrics = await cards.evaluateAll(elements => elements.map(element => {
          const title = element.querySelector<HTMLElement>('.topic-card__title')!;
          const description = element.querySelector<HTMLElement>('.topic-card__description')!;
          const copy = element.querySelector<HTMLElement>('.topic-card__copy')!;
          const art = element.querySelector<HTMLElement>('.topic-card__art')!;
          const arrow = element.querySelector<HTMLElement>('.topic-card__arrow')!;
          const box = element.getBoundingClientRect();
          const t = getComputedStyle(title), d = getComputedStyle(description);
          return {
            title: title.textContent,
            titleSize: t.fontSize, titleWeight: t.fontWeight,
            descriptionSize: d.fontSize, descriptionWeight: d.fontWeight,
            colors: [t.color, d.color],
            descriptionLength: description.textContent!.length,
            height: box.height, left: box.left, right: box.right,
            artWidth: art.getBoundingClientRect().width,
            artLeft: art.getBoundingClientRect().left,
            artRight: art.getBoundingClientRect().right,
            copyLeft: copy.getBoundingClientRect().left,
            copyRight: copy.getBoundingClientRect().right,
            arrowLeft: arrow.getBoundingClientRect().left,
            overflow: Math.max(title.scrollWidth - title.clientWidth, description.scrollWidth - description.clientWidth),
            descriptionTop: description.getBoundingClientRect().top,
            titleBottom: title.getBoundingClientRect().bottom,
          };
        }));
        for (const card of metrics) {
          expect(card.titleSize, card.title!).toBe('22px');
          expect(card.titleWeight).toBe('600');
          expect(card.descriptionSize).toBe('14px');
          expect(card.descriptionWeight).toBe('400');
          palette ??= card.colors;
          expect(card.colors).toEqual(palette);
          expect(card.artWidth).toBe(width < 360 ? 48 : 56);
          expect(card.artRight).toBeLessThanOrEqual(card.copyLeft);
          expect(card.copyRight).toBeLessThanOrEqual(card.arrowLeft);
          expect(card.descriptionTop).toBeGreaterThanOrEqual(card.titleBottom);
          expect(card.overflow).toBeLessThanOrEqual(1);
          expect(card.height, card.title!).toBeLessThanOrEqual(164);
          expect(card.left).toBeGreaterThanOrEqual(0);
          expect(card.right).toBeLessThanOrEqual(width);
          expect(card.descriptionLength, card.title!).toBeLessThanOrEqual(64);
        }
        if (width === 390) {
          const group = screen.locator('.topic-list').last();
          await group.scrollIntoViewIfNeeded();
          await group.screenshot({ path: testInfo.outputPath(`${tab}-${theme}.png`) });
        }
      }
    });
  }
}
