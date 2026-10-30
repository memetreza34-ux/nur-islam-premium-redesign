import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import { prayerDayFixture, prayerRequestFixture } from './fixtures/prayer-api';

const timings = { Fajr: '04:10', Sunrise: '06:00', Dhuhr: '13:10', Asr: '17:00', Maghrib: '20:10', Isha: '22:10' };
const ids = ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'];
const labels = ['Fajr', 'Sonnenaufgang', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
test.use({ serviceWorkers: 'block', reducedMotion: 'reduce' });

async function openPrayerList(page: Page) {
  await page.clock.setFixedTime(new Date('2026-10-18T11:13:00+02:00'));
  await page.route('https://api.aladhan.com/**', route => route.fulfill({
    json: prayerRequestFixture(route.request().url(), timings),
  }));
  await page.goto('/?preview=1');
  await page.getByRole('navigation').getByRole('button', { name: 'Gebet', exact: true }).click();
  await expect(page.locator('.prayer-schedule-section')).toBeVisible();
  await expect(page.locator('.prayer-time-row')).toHaveCount(6);
  await page.evaluate(() => document.fonts.ready);
}

for (const width of [320, 360, 390, 430, 768]) {
  test(`each prayer row keeps its own landscape and icon at ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await openPrayerList(page);
    const rows = page.locator('.prayer-time-row');
    await expect(rows).toHaveCount(6);
    await expect(rows.locator('.prayer-time-row__backdrop')).toHaveCount(6);
    for (const [index, id] of ids.entries()) {
      const row = rows.nth(index);
      await expect(row.locator('.prayer-time-row__name')).toHaveText(labels[index]);
      const picture = row.locator('.prayer-time-row__art img');
      await expect(picture).toHaveAttribute('src', new RegExp(`prayer-mini-${id}-${id === 'sunrise' ? 'v1' : 'v2'}.webp`));
      await expect(picture).toHaveAttribute('alt', '');
      await expect(picture).toBeVisible();
      await expect.poll(() => picture.evaluate((el: HTMLImageElement) => el.complete ? el.naturalWidth : 0)).toBe(192);
      await picture.evaluate((el: HTMLImageElement) => el.decode());
      await expect(picture).toHaveCSS('object-fit', 'contain');
      const art = await picture.boundingBox();
      const frame = await row.locator('.prayer-time-row__art').boundingBox();
      expect(art!.height).toBeLessThanOrEqual(frame!.height + 0.01);
      const name = await row.locator('.prayer-time-row__name').boundingBox();
      const time = await row.locator('.prayer-time-row__time').boundingBox();
      expect(art!.width).toBeCloseTo(40, 1);
      expect(art!.height).toBeCloseTo(40, 1);
      const backdrop = row.locator('.prayer-time-row__backdrop');
      await expect(backdrop).toHaveCount(1);
      if (id === 'fajr') await expect(row).not.toContainText('Sonnenaufgang');
      {
        await expect(backdrop).toHaveAttribute('src', new RegExp(`prayer-oasis-${id}-${id === 'sunrise' ? 'v1' : 'v2'}.webp`));
        await expect(backdrop).toHaveAttribute('alt', '');
        await backdrop.evaluate((el: HTMLImageElement) => el.decode());
        await expect(backdrop).toHaveCSS('object-fit', 'cover');
        await expect(backdrop).toHaveCSS('opacity', '1');
        const background = await backdrop.boundingBox();
        const bounds = await row.boundingBox();
        expect(background!.width).toBeCloseTo(bounds!.width - 2, 0);
        expect(background!.height).toBeGreaterThanOrEqual(bounds!.height - 2.1);
      }
      expect(art!.x + art!.width).toBeLessThanOrEqual(name!.x + 0.1);
      expect(time!.x).toBeCloseTo(name!.x, 1);
      expect(time!.y).toBeGreaterThanOrEqual(name!.y + name!.height - 0.1);
      const textOverflow = await row.locator('.prayer-time-row__name').evaluate(element => [...element.children].flatMap(child => {
        const range = document.createRange();
        range.selectNodeContents(child);
        const bounds = child.getBoundingClientRect();
        return [...range.getClientRects()].filter(rect => rect.left < bounds.left - 1 || rect.right > bounds.right + 1).map(() => child.textContent);
      }));
      expect(textOverflow).toEqual([]);
      const controls = row.getByRole('button');
      await expect(controls).toHaveCount(id === 'sunrise' ? 0 : 2);
      for (const control of await controls.all()) {
        const bounds = await control.boundingBox();
        expect(bounds!.width).toBeGreaterThanOrEqual(48 - 0.01);
        expect(bounds!.height).toBeGreaterThanOrEqual(48 - 0.01);
        expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width);
        expect(bounds!.x).toBeGreaterThanOrEqual(name!.x + name!.width - 0.1);
        const rowBounds = await row.boundingBox();
        expect(bounds!.y).toBeGreaterThanOrEqual(rowBounds!.y);
        expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(rowBounds!.y + rowBounds!.height);
        expect(await control.evaluate(el => getComputedStyle(el).borderTopWidth)).toBe('0px');
      }
      if (id === 'sunrise') await expect(row.locator('.prayer-alert, .prayer-complete')).toHaveCount(0);
    }
    const timeEdges = await rows.locator('.prayer-time-row__time').evaluateAll(elements => elements.map(el => el.getBoundingClientRect().left));
    expect(Math.max(...timeEdges) - Math.min(...timeEdges)).toBeLessThanOrEqual(1);
    const heading = page.locator('.reference-prayer-screen > .reference-screen-header .overline');
    expect(await heading.evaluate(el => el.scrollWidth > el.clientWidth + 1)).toBe(false);
    const overlaps = await rows.evaluateAll(elements => elements.flatMap(row => {
      const text = row.querySelector('.prayer-time-row__name')!;
      const labels = [...text.children, row.querySelector('.prayer-time-row__time')!];
      const targets = [...row.querySelectorAll('button')];
      const boxes = labels.flatMap(el => {
        const range = document.createRange(); range.selectNodeContents(el);
        return [...range.getClientRects()].map(rect => ({ rect, text: el.textContent }));
      }).concat(targets.map(el => ({ rect: el.getBoundingClientRect(), text: el.getAttribute('aria-label') })));
      return boxes.flatMap((a, i) => boxes.slice(i + 1).filter(b => Math.min(a.rect.right, b.rect.right) - Math.max(a.rect.left, b.rect.left) > 1 && Math.min(a.rect.bottom, b.rect.bottom) - Math.max(a.rect.top, b.rect.top) > 1).map(b => `${a.text} / ${b.text}`));
    }));
    expect(overlaps).toEqual([]);
    await page.locator('.prayer-schedule-section').scrollIntoViewIfNeeded();
    await page.screenshot({ path: testInfo.outputPath(`miniatures-${width}.png`) });
    await page.getByRole('button', { name: 'Asr als gebetet markieren', exact: true }).click();
    await expect(page.getByRole('button', { name: 'Asr als gebetet markieren', exact: true })).toHaveAttribute('aria-pressed', 'true');
  });
}

test('failed miniature falls back without losing the prayer or controls', async ({ page }) => {
  await page.route('**/prayer-mini-dhuhr-v2.webp*', route => route.abort());
  await page.route('**/prayer-oasis-dhuhr-v2.webp*', route => route.abort());
  await openPrayerList(page);
  const row = page.locator('.prayer-time-row').filter({ has: page.getByRole('button', { name: 'Dhuhr als gebetet markieren', exact: true }) });
  await expect(row.locator('.prayer-time-row__art img')).toHaveCount(0);
  await expect(row.locator('.prayer-time-row__art svg')).toBeVisible();
  await expect(row.locator('.prayer-time-row__backdrop')).toHaveCount(0);
  await expect(row).toContainText('13:10');
  await row.getByRole('button', { name: 'Dhuhr als gebetet markieren', exact: true }).click();
  await expect(row.getByRole('button', { name: 'Dhuhr als gebetet markieren', exact: true })).toHaveAttribute('aria-pressed', 'true');
});

for (const [width, height] of [[320, 568], [390, 844], [768, 1024], [667, 375]]) {
  test(`prayer completion fits without scrolling at ${width}x${height}`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height });
    await openPrayerList(page);
    for (const label of ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']) {
      await page.getByRole('button', { name: `${label} als gebetet markieren`, exact: true }).click();
    }
    const dialog = page.getByRole('dialog', { name: 'Alle Pflichtgebete abgeschlossen', exact: true });
    await expect(dialog).toBeVisible();
    await expect.poll(() => dialog.evaluate(el => new DOMMatrixReadOnly(getComputedStyle(el).transform).a)).toBe(1);
    await dialog.locator('img').evaluate((el: HTMLImageElement) => el.decode());
    const sizes = await dialog.evaluate(el => ({ height: el.clientHeight, scrollHeight: el.scrollHeight, width: el.clientWidth, scrollWidth: el.scrollWidth }));
    expect(sizes.scrollHeight).toBeLessThanOrEqual(sizes.height + 1);
    expect(sizes.scrollWidth).toBeLessThanOrEqual(sizes.width + 1);
    const bounds = (await dialog.boundingBox())!;
    const navigation = (await page.getByRole('navigation').boundingBox())!;
    expect(bounds.y).toBeGreaterThanOrEqual(0);
    expect(bounds.y + bounds.height).toBeLessThanOrEqual(navigation.y);
    for (const button of await dialog.getByRole('button').all()) {
      const target = (await button.boundingBox())!;
      expect(target.y + target.height).toBeLessThanOrEqual(bounds.y + bounds.height);
      expect(target.width).toBeGreaterThanOrEqual(43.99);
      expect(target.height).toBeGreaterThanOrEqual(43.99);
    }
    const actions = await dialog.locator('.prayer-completion-actions > button').evaluateAll(elements => elements.map(el => ({ y: el.getBoundingClientRect().y, height: el.getBoundingClientRect().height })));
    expect(Math.abs(actions[0].y - actions[1].y)).toBeLessThan(1);
    expect(Math.abs(actions[0].height - actions[1].height)).toBeLessThan(1);
    await page.screenshot({ path: testInfo.outputPath(`completion-${width}-${height}.png`) });
    await dialog.getByRole('button', { name: 'Alhamdulillah', exact: true }).click();
    await expect(dialog).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Isha als gebetet markieren', exact: true })).toHaveAttribute('aria-pressed', 'true');
  });
}

for (const width of [320, 390, 768]) {
  test(`prayer companion groups stay clear and readable at ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await openPrayerList(page);
    const companions = page.locator('.prayer-companions');
    const groups = companions.locator('.prayer-companions__group');
    await expect(groups).toHaveCount(3);
    await expect(companions.getByRole('heading', { level: 2 })).toHaveText(['Gebetspraxis', 'Duas & Dhikr', 'Moscheen & Fasten']);
    await expect(companions.getByRole('button')).toHaveCount(6);
    const geometry = await groups.evaluateAll(elements => elements.map(group => {
      const buttons = [...group.querySelectorAll('button')];
      return {
        title: group.querySelector('h2')!.getBoundingClientRect().bottom,
        first: buttons[0].getBoundingClientRect().top,
        last: buttons.at(-1)!.getBoundingClientRect().bottom,
        overflow: buttons.some(button => {
          const copy = button.querySelector('.topic-card__copy')!;
          const arrow = button.querySelector('.topic-card__arrow')!.getBoundingClientRect();
          const range = document.createRange();
          range.selectNodeContents(copy);
          return [...range.getClientRects()].some(rect => rect.right > arrow.left + 1);
        }),
      };
    }));
    for (const [index, group] of geometry.entries()) {
      expect(group.first).toBeGreaterThanOrEqual(group.title);
      expect(group.overflow).toBe(false);
      if (index) expect(group.title).toBeGreaterThan(geometry[index - 1].last + 16);
    }
    await companions.scrollIntoViewIfNeeded();
    await expect(page.locator('.reference-prayer-screen')).toHaveCSS('opacity', '1');
    await expect(companions).toBeInViewport();
    await page.screenshot({ path: testInfo.outputPath(`prayer-companions-${width}.png`) });
  });
}

test('all landscapes remain while the next prayer changes and the date is previewed', async ({ page }) => {
  await openPrayerList(page);
  for (const [time, label] of [['03:00', 'Fajr'], ['11:13', 'Dhuhr'], ['13:11', 'Asr'], ['17:01', 'Maghrib'], ['20:11', 'Isha'], ['22:11', 'Fajr']]) {
    await page.clock.setFixedTime(new Date(`2026-10-18T${time}:00+02:00`));
    await page.evaluate(() => window.dispatchEvent(new Event('focus')));
    const next = page.locator('.prayer-time-row--next');
    await expect(next).toHaveCount(1);
    await expect(next.locator('.prayer-time-row__name')).toHaveText(label);
    await expect(page.locator('.prayer-time-row__backdrop')).toHaveCount(6);
    const id = ids[labels.indexOf(label)];
    await expect(next.locator('.prayer-time-row__backdrop')).toHaveAttribute('src', new RegExp(`prayer-oasis-${id}-v2.webp`));
    await expect(page.locator('.prayer-time-row__art img')).toHaveCount(6);
    await expect(page.locator('.prayer-time-row:not(.prayer-time-row--next) .prayer-time-row__backdrop')).toHaveCount(5);
  }
  await page.route(/https:\/\/api\.aladhan\.com\/v1\/calendar\/2026\/10\?/, route => route.fulfill({ json: {
    code: 200,
    data: Array.from({ length: 31 }, (_, index) => prayerDayFixture(`${String(index + 1).padStart(2, '0')}-10-2026`, timings)),
  } }));
  await page.getByRole('button', { name: 'Nächsten Tag anzeigen', exact: true }).click();
  await expect(page.locator('.prayer-time-row--preview')).toHaveCount(6);
  await expect(page.locator('.prayer-time-row__backdrop')).toHaveCount(6);
});
