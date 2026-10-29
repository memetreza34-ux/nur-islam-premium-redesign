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

    const heading = calendar.locator('.prayer-calendar-section__heading');
    const headingBox = (await heading.locator('div').boundingBox())!;
    const calendarBox = (await calendar.boundingBox())!;
    expect(headingBox.x + headingBox.width / 2).toBeCloseTo(calendarBox.x + calendarBox.width / 2, 0);
    expect(await heading.locator('h2').evaluate(node => getComputedStyle(node).textAlign)).toBe('center');
    await heading.scrollIntoViewIfNeeded();
    await page.screenshot({ path: testInfo.outputPath(`calendar-heading-${width}.png`) });

    const firstDay = page.locator('.prayer-calendar-day:not(.prayer-calendar-day--empty)').first();
    await firstDay.click();
    await expect(firstDay).toHaveClass(/is-selected/);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);

    const ledgerBox = (await page.locator('.prayer-calendar-ledger').boundingBox())!;
    const gridBox = (await page.locator('.prayer-calendar-grid').boundingBox())!;
    await expect(calendar.locator('.prayer-calendar-section__heading button')).toHaveCount(0);
    const openButton = calendar.getByRole('button', { name: 'Kalender öffnen', exact: true });
    const openBox = (await openButton.boundingBox())!;
    const sectionBox = (await calendar.boundingBox())!;
    expect(openBox.y).toBeGreaterThanOrEqual(ledgerBox.y + ledgerBox.height);
    expect(openBox.y - ledgerBox.y - ledgerBox.height).toBeLessThanOrEqual(18);
    expect(openBox.width).toBeCloseTo(sectionBox.width, 0);
    expect(openBox.height).toBeGreaterThanOrEqual(44);
    expect(gridBox.x).toBeGreaterThanOrEqual(ledgerBox.x);
    expect(gridBox.x + gridBox.width).toBeLessThanOrEqual(ledgerBox.x + ledgerBox.width + 1);
    const notes = calendar.locator('.calendar-day-notes--compact');
    await expect(notes.locator('.calendar-day-notes__empty')).toHaveCount(0);
    const noteHeading = (await notes.locator('.calendar-day-notes__heading').boundingBox())!;
    expect(noteHeading.height).toBeLessThanOrEqual(48);
    await notes.screenshot({ path: testInfo.outputPath(`empty-notes-${width}.png`) });
    const addNote = notes.getByRole('button', { name: 'Notiz hinzufügen', exact: true });
    await addNote.click();
    const editor = page.getByRole('dialog', { name: 'Notiz hinzufügen', exact: true });
    await editor.getByLabel('Deine Notiz').fill('Eine Notiz für den ausgewählten Tag.');
    await editor.getByRole('button', { name: 'Notiz speichern', exact: true }).click();
    await expect(notes.getByRole('button', { name: /Notiz bearbeiten:/ })).toContainText('Eine Notiz für den ausgewählten Tag.');
    const upcoming = calendar.getByRole('region', { name: 'Nächste Termine', exact: true });
    await expect(upcoming.getByRole('listitem')).toHaveCount(3);
    await expect(upcoming.locator('header .source-info')).toHaveCount(1);
    for (const item of await upcoming.getByRole('listitem').all()) {
      const geometry = await item.evaluate(element => {
        const date = element.querySelector('time')!.getBoundingClientRect();
        const copy = element.querySelector(':scope > span')!;
        const title = copy.querySelector('strong')!;
        const box = element.getBoundingClientRect();
        const text = copy.getBoundingClientRect();
        return { dateRight: date.right, textLeft: text.left, textRight: text.right, rowRight: box.right, overflow: copy.scrollWidth > copy.clientWidth, titleSize: getComputedStyle(title).fontSize, titleWhiteSpace: getComputedStyle(title).whiteSpace };
      });
      expect(geometry.dateRight).toBeLessThanOrEqual(geometry.textLeft);
      expect(geometry.textRight).toBeLessThanOrEqual(geometry.rowRight);
      expect(geometry.overflow).toBe(false);
      expect(geometry.titleSize).toBe('14px');
      expect(geometry.titleWhiteSpace).toBe('normal');
    }
    await upcoming.getByRole('button', { name: 'Quellen anzeigen: Islamisches Datum', exact: true }).click();
    const info = page.getByRole('dialog', { name: 'Islamisches Datum', exact: true });
    await expect(info).toContainText('Mondsichtung');
    await info.getByRole('button', { name: 'Quellen schließen', exact: true }).click();
    await upcoming.screenshot({ path: testInfo.outputPath(`upcoming-${width}.png`) });
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
