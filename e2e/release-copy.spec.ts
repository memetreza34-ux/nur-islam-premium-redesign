import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import { hasUnfilledOperatorDetails } from '../src/data/legalContent';

test.use({ serviceWorkers: 'block', reducedMotion: 'reduce' });

const editorialCopy = /Fachprüfung offen|fachliche Freigabe|Endprüfung|vor (?:der )?Veröffentlichung|Altbestand|migriert/;

async function openHub(page: Page) {
  await page.goto('/?preview=1');
  await page.getByRole('navigation').getByRole('button', { name: 'Mehr', exact: true }).click();
}

test('Duas keep Arabic, pronunciation, meaning and source without migration notices', async ({ page }) => {
  await openHub(page);
  await page.getByText('Duas', { exact: true }).first().click();
  await expect(page.getByRole('heading', { name: 'Duas', exact: true })).toBeVisible();
  await expect(page.locator('main')).not.toContainText(editorialCopy);
  await page.locator('.reference-dua-card__content').first().click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog.locator('[dir="rtl"]')).toBeVisible();
  for (const label of ['Transliteration', 'Sinngemäße Bedeutung', 'Quelle']) {
    await expect(dialog.getByText(label, { exact: true })).toBeVisible();
  }
  await expect(dialog.locator('.reference-dua-modal__source strong')).not.toBeEmpty();
  await expect(dialog).not.toContainText(editorialCopy);
});

test('all 99 Names remain available and explain the limits of the German meaning', async ({ page }) => {
  await openHub(page);
  await page.getByText('99 Namen', { exact: false }).first().click();
  await expect(page.locator('.reference-name-list__main')).toHaveCount(99);
  await expect(page.locator('main')).not.toContainText(editorialCopy);
  await page.locator('.reference-name-list__main').filter({ hasText: 'Ar-Rahman' }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog.locator('[dir="rtl"]')).toBeVisible();
  await expect(dialog).toContainText('nicht alle Bedeutungsnuancen');
  await expect(dialog).not.toContainText(editorialCopy);
});

test('learning grid stays complete without the editorial footer', async ({ page }, testInfo) => {
  await page.goto('/?preview=1');
  await page.getByRole('navigation').getByRole('button', { name: 'Lernen', exact: true }).click();
  const grid = page.locator('.reference-foundation-path');
  await expect(grid.getByRole('button')).toHaveCount(14);
  await expect(page.locator('main')).not.toContainText(editorialCopy);
  await grid.getByRole('button', { name: /Fehler & Reue/ }).scrollIntoViewIfNeeded();
  await page.screenshot({ path: testInfo.outputPath('learning-clean-footer.png') });
});

test('imprint and license limitations remain visible instead of implying approval', async ({ page }) => {
  await openHub(page);
  await page.getByText('Impressum & Datenschutz', { exact: true }).click();
  await page.getByRole('tab', { name: 'Impressum', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Anbieter', exact: true })).toBeVisible();
  if (hasUnfilledOperatorDetails()) {
    await expect(page.getByRole('status')).toContainText('Noch nicht veröffentlichungsfertig');
  } else {
    await expect(page.getByText('Noch nicht veröffentlichungsfertig', { exact: true })).toHaveCount(0);
  }
  await page.getByRole('tab', { name: 'Lizenzen', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Aufnahmen', exact: true })).toBeVisible();
  await expect(page.locator('main')).toContainText('das Copyright verbleibt beim Rezitator');
  await expect(page.locator('main')).not.toContainText('Hisn al-Muslim');
});
