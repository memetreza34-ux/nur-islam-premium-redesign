import { expect, test, type Page } from '@playwright/test';

test.use({ serviceWorkers: 'block' });

async function openMore(page: Page) {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.route('https://api.aladhan.com/**', route => route.abort());
  await page.goto('/?preview=1');
  await expect(page.getByRole('navigation')).toBeVisible();
  await expect(page.getByRole('main', { name: 'Nur Islam wird geladen' })).toBeHidden();
  await page.getByRole('navigation').getByRole('button', { name: 'Mehr', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Mehr', exact: true })).toBeVisible();
}

for (const [name, width, height] of [
  ['small-phone', 320, 568], ['browser-panel', 648, 768], ['tablet', 1024, 900],
] as const) {
  test(`About X receives pointer clicks, including after scrolling on ${name}`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await openMore(page);
    const opener = page.getByRole('button', { name: 'Über Nur Version und Produktprinzipien', exact: true });
    const dialog = page.getByRole('dialog', { name: 'Über Nur', exact: true });

    for (const scrolled of [false, true]) {
      await opener.click();
      await expect(dialog).toBeVisible();
      if (scrolled) {
        await dialog.locator('.reference-about').hover();
        await page.mouse.wheel(0, 1200);
      }
      const close = dialog.getByRole('button', { name: 'Schließen', exact: true });
      await expect(close).toBeVisible();
      expect(await close.evaluate(button => {
        const box = button.getBoundingClientRect();
        const target = document.elementFromPoint(box.x + box.width / 2, box.y + box.height / 2);
        return target === button || button.contains(target);
      }), 'the X must be above the About content, not just visually present').toBe(true);
      await close.click();
      await expect(dialog).toBeHidden();
      await expect(opener).toBeFocused();
    }
    await page.screenshot({ path: `output/playwright/about-closed-${name}.png` });
  });
}

test('profile dialogs retain X, Enter, Escape and Done closing', async ({ page }) => {
  await openMore(page);
  for (const [openerName, dialogName] of [
    ['Sprache Aktuell vollständig: Deutsch', 'App-Sprache'],
    ['Einstellungen', 'Einstellungen'],
    ['Hilfe & Datenquellen Woher die Inhalte kommen und was lokal bleibt', 'Hilfe und Datenschutz'],
    ['Über Nur Version und Produktprinzipien', 'Über Nur'],
  ]) {
    const opener = page.getByRole('button', { name: openerName, exact: true });
    const dialog = page.getByRole('dialog', { name: dialogName, exact: true });
    await opener.click();
    await dialog.getByRole('button', { name: 'Schließen', exact: true }).click();
    await expect(dialog).toBeHidden();
    await expect(opener).toBeFocused();
  }

  const opener = page.getByRole('button', { name: 'Über Nur Version und Produktprinzipien', exact: true });
  const dialog = page.getByRole('dialog', { name: 'Über Nur', exact: true });
  await opener.click();
  await expect(dialog.getByRole('button', { name: 'Schließen', exact: true })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(dialog).toBeHidden();
  await opener.click();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await opener.click();
  await dialog.getByRole('button', { name: 'Fertig', exact: false }).click();
  await expect(dialog).toBeHidden();
  await expect(opener).toBeFocused();
});
