import { expect, test, type Locator } from '@playwright/test';
import { prayerRequestFixture } from './fixtures/prayer-api';

test.use({ serviceWorkers: 'block', reducedMotion: 'reduce' });
for (const [width, height] of [[320, 568], [390, 844], [768, 1024]]) {
  test(`settings and choices share their layout at ${width}px`, async ({ page }, testInfo) => {
    test.setTimeout(90000);
    await page.setViewportSize({ width, height });
    await page.route('https://api.aladhan.com/**', route => route.fulfill({ json: prayerRequestFixture(route.request().url()) }));
    await page.route('https://api.alquran.cloud/**', route => route.abort());
    await page.goto('/?preview=1');
    const nav = page.getByRole('navigation');
    const titleStyles: string[] = [];
    const activeStyles: string[] = [];
    const inspectChoice = async (choice: Locator) => { activeStyles.push(await choice.evaluate(node => { const style = getComputedStyle(node); return [style.backgroundColor, style.borderColor, style.borderRadius, style.fontSize, style.fontWeight].join('|'); })); };
    const inspect = async (dialog: Locator, name: string, fits = true) => {
      await expect(dialog).toBeVisible();
      await expect(dialog).toHaveCSS('transform', 'none');
      const header = dialog.locator(':scope > .dialog-header');
      const title = header.locator('.dialog-header__title');
      const close = header.locator('.dialog-header__close');
      await expect(title).toHaveCSS('font-size', '26px');
      await expect(title).toHaveCSS('font-weight', '600');
      titleStyles.push(await title.evaluate(node => { const style = getComputedStyle(node); return [style.fontFamily, style.fontSize, style.fontWeight, style.color].join('|'); }));
      await expect(close).toHaveCSS('width', '44px');
      await expect(close).toHaveCSS('height', '44px');
      const titleBox = (await title.boundingBox())!;
      const closeBox = (await close.boundingBox())!;
      expect(titleBox.x + titleBox.width).toBeLessThanOrEqual(closeBox.x);
      expect(await dialog.evaluate(node => node.scrollWidth <= node.clientWidth)).toBe(true);
      if (fits) { const metrics = await dialog.evaluate(node => ({ scroll: node.scrollHeight, client: node.clientHeight })); expect(metrics.scroll, `${name}: ${JSON.stringify(metrics)}`).toBeLessThanOrEqual(metrics.client); }
      if (await dialog.evaluate(node => node.classList.contains('dialog-form'))) {
        for (const primary of await dialog.locator(':scope > .gold-button, :scope > .dialog-actions > .gold-button, :scope > .prayer-settings-actions > .gold-button').all()) {
          const sizes = await primary.evaluate(button => {
            const parent = button.parentElement!;
            const style = getComputedStyle(parent);
            const inner = parent.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
            const siblings = [...parent.children].filter(node => node !== button);
            const expected = parent.classList.contains('dialog-panel') ? inner : inner - siblings.reduce((sum, node) => sum + node.getBoundingClientRect().width, 0) - parseFloat(style.columnGap || '0');
            return { actual: button.getBoundingClientRect().width, expected };
          });
          expect(Math.abs(sizes.actual - sizes.expected), `${name} primary width: ${JSON.stringify(sizes)}`).toBeLessThanOrEqual(1);
        }
      }
      await page.screenshot({ path: testInfo.outputPath(`${name}-${width}.png`) });
    };
    const close = async (dialog: Locator) => { await dialog.locator(':scope > .dialog-header .dialog-header__close').click(); await expect(dialog).toBeHidden(); };

    await nav.getByRole('button', { name: 'Gebet', exact: true }).click();
    await page.getByRole('button', { name: 'Berechnung', exact: true }).click();
    const prayer = page.getByRole('dialog', { name: 'Gebetszeiten-Einstellungen', exact: true });
    await inspect(prayer, 'prayer');
    await inspectChoice(prayer.locator('.reference-prayer-settings-group button.is-active').first());
    await prayer.getByRole('button', { name: 'Quellen anzeigen: Hinweise zur Berechnung' }).click();
    const source = page.getByRole('dialog', { name: 'Hinweise zur Berechnung', exact: true });
    await inspect(source, 'info', false);
    await close(source);
    await close(prayer);

    await page.getByRole('button', { name: 'Notiz hinzufügen', exact: true }).click();
    const note = page.getByRole('dialog', { name: 'Notiz hinzufügen', exact: true });
    await inspect(note, 'note');
    await close(note);
    await page.getByRole('button', { name: 'Kalender öffnen', exact: true }).click();
    await page.getByRole('button', { name: /Hinzufügen/ }).first().click();
    const calendar = page.getByRole('dialog', { name: 'Termin hinzufügen', exact: true });
    await inspect(calendar, 'calendar');
    await close(calendar);

    await nav.getByRole('button', { name: 'Mehr', exact: true }).click();
    await page.getByRole('button', { name: 'Einstellungen', exact: true }).click();
    const settings = page.getByRole('dialog', { name: 'Einstellungen', exact: true });
    await inspect(settings, 'settings');
    await close(settings);
    await page.getByRole('button', { name: 'Sprache Aktuell vollständig: Deutsch', exact: true }).click();
    const language = page.getByRole('dialog', { name: 'App-Sprache', exact: true });
    await inspect(language, 'language');
    await inspectChoice(language.locator('.reference-choice--active'));
    await close(language);

    await nav.getByRole('button', { name: 'Quran', exact: true }).click();
    await page.getByRole('button', { name: 'Lesen beginnen', exact: true }).click();
    await page.getByRole('button', { name: 'Leseeinstellungen öffnen', exact: true }).click();
    const reader = page.getByRole('dialog', { name: 'Leseeinstellungen', exact: true });
    await inspect(reader, 'reader');
    await inspectChoice(reader.locator('.reference-choice-row>button.is-active'));
    await close(reader);
    await page.getByRole('button', { name: 'Zurück zum Quran', exact: true }).click();
    await nav.getByRole('button', { name: 'Lernen', exact: true }).click();
    await expect(page.getByRole('button', { name: 'Lernplan öffnen', exact: true })).toHaveCount(0);
    await expect(page.locator('.reference-learn-screen > header button')).toHaveCount(0);
    await expect(page.locator('.reference-foundation-step')).toHaveCount(14);
    await page.locator('.screen-transition-frame').evaluate(node => { node.scrollTop = 0; });
    await page.screenshot({ path: testInfo.outputPath(`learning-no-plan-${width}.png`) });
    await page.locator('.reference-foundation-step').first().click();
    await expect(page.locator('.learning-course-v2')).toBeVisible();
    await page.getByRole('button', { name: /^Zurück/ }).click();
    await expect(page.getByRole('heading', { name: 'Lernen', exact: true })).toBeVisible();
    await nav.getByRole('button', { name: 'Mehr', exact: true }).click();
    await page.getByText('Duas', { exact: true }).first().click();
    await page.locator('.reference-dua-card__content').first().click();
    const dua = page.locator('.reference-dua-modal');
    await inspect(dua, 'dua', false);
    await close(dua);
    await nav.getByRole('button', { name: 'Mehr', exact: true }).click();
    await page.getByText('99 Namen Allahs', { exact: true }).first().click();
    await page.locator('.reference-name-list__main').first().click();
    const name = page.locator('.reference-name-modal');
    await inspect(name, 'name', false);
    await close(name);
    await nav.getByRole('button', { name: 'Start', exact: true }).click();
    await page.locator('.home-companion-card').filter({ hasText: 'Dhikr' }).click();
    await page.getByRole('button', { name: 'Heutige Statistik öffnen', exact: true }).click();
    const stats = page.getByRole('dialog', { name: 'Dhikr-Statistik', exact: true });
    await inspect(stats, 'dhikr', false);
    await close(stats);
    expect(new Set(titleStyles).size).toBe(1);
    expect(activeStyles).toEqual([activeStyles[0], activeStyles[0], activeStyles[0]]);
  });
}
