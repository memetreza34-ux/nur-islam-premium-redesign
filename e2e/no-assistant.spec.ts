import { expect, test } from '@playwright/test';
import { openApp } from './appReady';

test('Home and More offer no assistant; the fasting calendar still works', async ({ page }) => {
  await openApp(page);
  await expect(page.getByRole('button', { name: /Assistent|Quellenmodus/i })).toHaveCount(0);
  await expect(page.getByRole('textbox', { name: /Frage/i })).toHaveCount(0);
  await page.getByRole('button', { name: /Fastenplan.*Fastentage/ }).click();
  await expect(page.getByRole('heading', { name: 'Fastenplan', exact: true, level: 1 })).toBeVisible();
  await page.goBack();
  await page.getByRole('navigation').getByText('Mehr', { exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Mehr', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: /Assistent|Quellenmodus/i })).toHaveCount(0);
});

test('an old assistant history entry returns safely to Home after reload', async ({ page }) => {
  await openApp(page);
  await page.evaluate(() => {
    const current = window.history.state;
    const entry = current.__nurIslamNavigation;
    window.history.replaceState({
      ...current,
      __nurIslamNavigation: { ...entry, snapshot: { ...entry.snapshot, activeTab: 'assistant' } },
    }, '');
  });
  await page.reload();
  await expect(page.getByRole('navigation').getByRole('button', { name: 'Start', exact: true })).toHaveAttribute('aria-current', 'page');
  await expect(page.locator('[data-home-section="continue"]')).toBeVisible();
  await expect(page.locator('[data-home-section="continue"]')).toHaveAttribute('aria-label', /^(Quran beginnen|Weiterlesen):/);
  await expect(page.getByRole('button', { name: /Assistent|Quellenmodus/i })).toHaveCount(0);
});

test('a legacy assistant URL cannot open a chat', async ({ page }) => {
  await openApp(page);
  await page.goto('/?preview=1&open=assistant');
  await expect(page.getByRole('navigation').getByRole('button', { name: 'Start', exact: true })).toHaveAttribute('aria-current', 'page');
  await expect(page.getByRole('textbox', { name: /Frage/i })).toHaveCount(0);
});
