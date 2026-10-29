import { expect, test } from '@playwright/test';

test.use({ serviceWorkers: 'block', reducedMotion: 'reduce' });

for (const width of [320, 390, 768]) {
  test(`Wudu sources stay behind an info button with keyboard and touch access at ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto('/?preview=1');
    await page.getByRole('navigation').getByRole('button', { name: 'Lernen', exact: true }).click();
    await page.getByRole('button', { name: 'Wudu Schritt für Schritt', exact: true }).click();
    await page.getByText('Schritt auswählen', { exact: true }).click();
    await page.getByRole('button', { name: 'Schritt 6: Arme waschen', exact: true }).click();
    const trigger = page.getByRole('button', { name: 'Quellen anzeigen: Quelle zu „Arme waschen“', exact: true });
    await expect(page.locator('dialog.source-info-dialog')).toHaveCount(0);
    await expect(page.getByRole('link', { name: /Sahih al-Bukhari 164/ })).toHaveCount(0);
    const target = (await trigger.boundingBox())!;
    expect(target.width).toBeGreaterThanOrEqual(44);
    expect(target.height).toBeGreaterThanOrEqual(44);
    await trigger.focus();
    await page.keyboard.press('Enter');
    const dialog = page.getByRole('dialog', { name: 'Quelle zu „Arme waschen“', exact: true });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole('link')).toHaveAttribute('href', 'https://sunnah.com/bukhari:164');
    await expect(dialog).toContainText('Muslim 235a beschreibt zweimal');
    const bounds = (await dialog.boundingBox())!;
    expect(bounds.x).toBeGreaterThanOrEqual(0);
    expect(bounds.x + bounds.width).toBeLessThanOrEqual(width);
    expect(bounds.y + bounds.height).toBeLessThanOrEqual(844);
    for (let i = 0; i < 6; i++) {
      await page.keyboard.press('Tab');
      expect(await dialog.evaluate(node => node.contains(document.activeElement) || document.activeElement === document.body)).toBe(true);
    }
    await page.screenshot({ path: testInfo.outputPath(`source-info-open-${width}.png`) });
    await page.keyboard.press('Escape');
    await expect(dialog).toHaveCount(0);
    await expect(trigger).toBeFocused();
    await page.screenshot({ path: testInfo.outputPath(`source-info-closed-${width}.png`) });
    await page.getByRole('button', { name: 'Quellen anzeigen: Hinweise zur Anleitung', exact: true }).click();
    const guidance = page.getByRole('dialog', { name: 'Hinweise zur Anleitung', exact: true });
    await expect(guidance.getByRole('heading', { name: 'Einordnung', exact: true })).toBeVisible();
    const reading = await guidance.evaluate(dialog => {
      const rgb = (value: string) => value.match(/[\d.]+/g)!.slice(0, 3).map(Number).map(v => v / 255).map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4);
      const luminance = (value: string) => { const c = rgb(value); return c[0] * .2126 + c[1] * .7152 + c[2] * .0722; };
      const background = luminance(getComputedStyle(dialog).backgroundColor);
      return [...dialog.querySelectorAll('p')].map(paragraph => {
        const style = getComputedStyle(paragraph);
        const foreground = luminance(style.color);
        const rect = paragraph.getBoundingClientRect();
        const bounds = dialog.getBoundingClientRect();
        return { contrast: (Math.max(background, foreground) + .05) / (Math.min(background, foreground) + .05), size: parseFloat(style.fontSize), opacity: Number(style.opacity), fits: rect.left >= bounds.left && rect.right <= bounds.right };
      });
    });
    expect(reading.length).toBeGreaterThanOrEqual(2);
    for (const paragraph of reading) {
      expect(paragraph.contrast).toBeGreaterThanOrEqual(4.5);
      expect(paragraph.size).toBeGreaterThanOrEqual(16);
      expect(paragraph.opacity).toBe(1);
      expect(paragraph.fits).toBe(true);
    }
    const panel = (await guidance.boundingBox())!;
    const navigation = (await page.getByRole('navigation').boundingBox())!;
    expect(panel.y + panel.height).toBeLessThanOrEqual(navigation.y);
    await page.screenshot({ path: testInfo.outputPath(`guide-guidance-${width}.png`) });
    await guidance.getByRole('button', { name: 'Quellen schließen', exact: true }).click();

  });
}

test('closing nested Dua sources keeps the Dua open and returns focus', async ({ page }) => {
  await page.goto('/?preview=1');
  await page.getByRole('navigation').getByRole('button', { name: 'Mehr', exact: true }).click();
  await page.getByText('Duas', { exact: true }).first().click();
  await page.locator('.reference-dua-card__content').first().click();
  const dua = page.locator('.reference-dua-modal');
  const trigger = dua.getByRole('button', { name: /^Quellen anzeigen:/ });
  await trigger.click();
  const source = page.locator('dialog.source-info-dialog');
  await expect(source).toBeVisible();
  await expect(source.getByRole('link', { name: 'Fundstelle öffnen', exact: true })).toHaveAttribute('target', '_blank');
  await page.keyboard.press('Escape');
  await expect(source).toHaveCount(0);
  await expect(dua).toBeVisible();
  await expect(trigger).toBeFocused();
  await trigger.click();
  await source.getByRole('button', { name: 'Quellen schließen', exact: true }).click();
  await expect(dua).toBeVisible();
  await dua.getByRole('button', { name: 'Schließen', exact: true }).click();
  await expect(dua).toHaveCount(0);
});
