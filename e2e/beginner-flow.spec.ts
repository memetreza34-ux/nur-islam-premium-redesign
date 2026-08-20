import { expect, test } from '@playwright/test';
import { openApp } from './appReady';

test.beforeEach(async ({ page }) => {
  await openApp(page);
});

test('opens the guided beginner journey from the learning tab', async ({ page }) => {
  await page.getByRole('navigation').getByText('Islam verstehen', { exact: true }).click();

  await expect(page.getByRole('heading', { name: 'Islam lernen' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Neu im Islam' })).toBeVisible();

  await page.getByRole('button').filter({ hasText: /Grundlagen starten|weiterlernen/ }).first().click();

  await expect(page.getByRole('heading', { name: 'Neu im Islam' })).toBeVisible();
  await expect(page.getByText('Was ist Islam?', { exact: true }).first()).toBeVisible();
  await expect(page.getByText('Quellen & Prüfung', { exact: true })).toBeVisible();
});

test('stores beginner progress locally', async ({ page }) => {
  await page.getByRole('navigation').getByText('Islam verstehen', { exact: true }).click();
  await page.getByRole('button').filter({ hasText: /Grundlagen starten|weiterlernen/ }).first().click();

  await page.getByRole('button', { name: /Als verstanden markieren/ }).click();

  const completed = await page.evaluate(() => JSON.parse(localStorage.getItem('nur_beginner_learning_completed') || '[]') as string[]);
  expect(completed).toContain('beginner-islam');
  await expect(page.getByText('Abgeschlossen', { exact: true })).toBeVisible();
});

test('opens beginner FAQ, glossary and purity basics', async ({ page }) => {
  await page.getByRole('navigation').getByText('Islam verstehen', { exact: true }).click();
  await page.getByRole('button').filter({ hasText: /Grundlagen starten|weiterlernen/ }).first().click();

  await page.getByRole('button').filter({ hasText: 'Fragen & Begriffe' }).click();
  await expect(page.getByRole('heading', { name: 'Fragen & Begriffe' })).toBeVisible();
  await expect(page.getByText('Islam A–Z', { exact: true })).toBeVisible();
  await page.getByLabel('Anfängerhilfe durchsuchen').fill('Qibla');
  await expect(page.getByText('Qibla', { exact: true }).first()).toBeVisible();

  await page.getByRole('button', { name: 'Zurück zu Islam lernen' }).click();
  await page.getByRole('button').filter({ hasText: 'Ghusl & Tayammum' }).click();
  await expect(page.getByRole('heading', { name: 'Ghusl & Tayammum' })).toBeVisible();
  await expect(page.getByText('Sure Al-Maida 5:6')).toBeVisible();
});

test('opens the seven day starter plan and routes into the matching lesson', async ({ page }) => {
  await page.getByRole('navigation').getByText('Islam verstehen', { exact: true }).click();
  await page.getByRole('button').filter({ hasText: /Grundlagen starten|weiterlernen/ }).first().click();

  await page.getByRole('button').filter({ hasText: 'Deine ersten 7 Tage' }).click();
  await expect(page.getByRole('heading', { name: 'Deine ersten 7 Tage' })).toBeVisible();
  await expect(page.getByText('Tag für Tag', { exact: true })).toBeVisible();
  await expect(page.getByText('Kein Zeitdruck', { exact: true })).toBeVisible();

  await page.getByRole('button').filter({ hasText: 'Islam und Allah kennenlernen' }).click();
  await expect(page.getByRole('heading', { name: 'Neu im Islam' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Was ist Islam?' })).toBeVisible();
});

test('offers a Quran orientation before the full 114-surah catalogue', async ({ page }) => {
  await page.getByRole('navigation').getByText('Mehr', { exact: true }).click();
  await page.getByText('Quran', { exact: true }).first().click();

  await expect(page.getByText('Quran für Anfänger', { exact: true })).toBeVisible();
  await expect(page.getByText('Kurze Startauswahl', { exact: true })).toBeVisible();

  await page.getByRole('button').filter({ hasText: 'Quran für Anfänger' }).click();
  await expect(page.getByRole('heading', { name: 'Quran für Anfänger' })).toBeVisible();
  await expect(page.getByText('Quran-Lexikon', { exact: true })).toBeVisible();
  await expect(page.getByText('Sure', { exact: true }).first()).toBeVisible();
  await expect(page.getByText('Ayah', { exact: true }).first()).toBeVisible();
  await expect(page.getByText('Juz', { exact: true }).first()).toBeVisible();

  await page.getByRole('button', { name: /Mit Al-Faatiha beginnen/ }).click();
  await expect(page.locator('[dir="rtl"]').first()).toBeVisible({ timeout: 15_000 });
});
