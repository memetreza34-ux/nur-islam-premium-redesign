import { expect, test } from '@playwright/test';

test.use({ serviceWorkers: 'block', reducedMotion: 'reduce' });

for (const width of [320, 390, 768]) {
  test(`prayer calendar stays readable at ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await page.route('**/api.aladhan.com/**', route => route.abort());
    await page.goto('/?preview=1');
    await page.getByRole('button', { name: 'Gebet', exact: true }).click();

    const calendar = page.locator('.prayer-calendar-section');
    await calendar.scrollIntoViewIfNeeded();
    await expect(page.getByRole('heading', { name: 'Islamische Tage & Termine', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Kalender öffnen', exact: true })).toBeVisible();
    expect(await page.locator('.prayer-calendar-day:not(.prayer-calendar-day--empty)').count()).toBeGreaterThanOrEqual(28);
    await expect(page.locator('.prayer-calendar-grid > :last-child')).not.toHaveClass(/prayer-calendar-day--empty/);

    const firstDay = page.locator('.prayer-calendar-day:not(.prayer-calendar-day--empty)').first();
    await firstDay.click();
    await expect(firstDay).toHaveClass(/is-selected/);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);

    const ledgerBox = (await page.locator('.prayer-calendar-ledger').boundingBox())!;
    const gridBox = (await page.locator('.prayer-calendar-grid').boundingBox())!;
    expect(gridBox.x).toBeGreaterThanOrEqual(ledgerBox.x);
    expect(gridBox.x + gridBox.width).toBeLessThanOrEqual(ledgerBox.x + ledgerBox.width + 1);
    await calendar.screenshot({ path: testInfo.outputPath(`prayer-calendar-${width}.png`) });
  });
}

test('a selected prayer-calendar day keeps its note through reload, editing and deletion', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2026-10-01T12:00:00+02:00'));
  await page.route('**/api.aladhan.com/**', route => route.abort());
  await page.goto('/?preview=1');

  const openSelectedDay = async () => {
    await page.getByRole('button', { name: 'Gebet', exact: true }).click();
    const prayerCalendar = page.getByRole('region', { name: 'Islamische Tage & Termine' });
    await expect(prayerCalendar).toBeVisible();
    const selectedDay = prayerCalendar.getByRole('button', { name: /^2\. Oktober 2026(?:,|$)/ });
    await selectedDay.click();
    await expect(selectedDay).toHaveAttribute('aria-pressed', 'true');
    await prayerCalendar.getByRole('button', { name: 'Kalender öffnen', exact: true }).click();
    await expect(page.getByText('Freitag, 2. Oktober', { exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: /^2\. Oktober 2026(?:,|$)/, pressed: true })).toBeVisible();
  };

  await openSelectedDay();
  const notes = page.getByRole('region', { name: 'Notizen für 2. Oktober 2026' });
  const originalText = 'E2E-Notiz: Dua am 2. Oktober';
  const editedText = 'E2E-Notiz: Dua und Moscheebesuch';
  await notes.getByRole('button', { name: 'Notiz hinzufügen' }).click();
  const addDialog = page.getByRole('dialog', { name: 'Notiz hinzufügen' });
  await addDialog.getByLabel('Deine Notiz').fill(originalText);
  await addDialog.getByRole('button', { name: 'Notiz speichern' }).click();

  await expect(notes.getByRole('button', { name: `Notiz bearbeiten: ${originalText}` })).toBeVisible();
  await expect(page.getByRole('button', { name: /^2\. Oktober 2026(?:, .*?)?, 1 persönliche Notiz$/, pressed: true })).toBeVisible();

  await page.reload();
  await openSelectedDay();
  await expect(notes.getByRole('button', { name: `Notiz bearbeiten: ${originalText}` })).toBeVisible();

  await notes.getByRole('button', { name: `Notiz bearbeiten: ${originalText}` }).click();
  const editDialog = page.getByRole('dialog', { name: 'Notiz bearbeiten' });
  await editDialog.getByLabel('Deine Notiz').fill(editedText);
  await editDialog.getByRole('button', { name: 'Notiz speichern' }).click();
  const createdNote = notes.getByRole('button', { name: `Notiz bearbeiten: ${editedText}` });
  await expect(createdNote).toBeVisible();
  await expect(notes.getByRole('button', { name: `Notiz bearbeiten: ${originalText}` })).toHaveCount(0);

  await createdNote.click();
  await editDialog.getByRole('button', { name: 'Notiz löschen' }).click();
  await editDialog.getByRole('button', { name: 'Ja, löschen' }).click();
  await expect(createdNote).toHaveCount(0);
});
