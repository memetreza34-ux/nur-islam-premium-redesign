import { expect, test } from '@playwright/test';
import { openApp } from './appReady';

test('primary tabs have no redundant Back control and retain their header actions', async ({ page }) => {
  await openApp(page);
  const nav = page.getByRole('navigation');
  for (const [tab, title, action] of [
    ['Gebet', 'Gebetszeiten', 'Gebetszeiten aktualisieren'],
    ['Quran', 'Quran', 'Lieblingssuren'],
    ['Lernen', 'Lernen', 'Lernplan öffnen'],
    ['Mehr', 'Mehr', 'Einstellungen'],
  ]) {
    await nav.getByRole('button', { name: tab, exact: true }).click();
    await expect(page.getByRole('heading', { level: 1, name: title, exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: /^Zurück/ })).toHaveCount(0);
    await expect(page.getByRole('button', { name: action, exact: true })).toBeVisible();
  }
});

test('reader and prayer course retain their Back navigation', async ({ page }) => {
  await openApp(page);
  const nav = page.getByRole('navigation');
  await nav.getByRole('button', { name: 'Quran', exact: true }).click();
  await page.getByRole('button', { name: /Lesen beginnen/ }).click();
  await page.getByRole('button', { name: 'Zurück zum Quran', exact: true }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Quran', exact: true })).toBeVisible();
  await nav.getByRole('button', { name: 'Lernen', exact: true }).click();
  await page.getByRole('button', { name: /Gebetskurs starten/ }).click();
  await page.getByRole('button', { name: 'Zurück zu Lernen', exact: true }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Lernen', exact: true })).toBeVisible();
});
