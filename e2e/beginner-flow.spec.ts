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
