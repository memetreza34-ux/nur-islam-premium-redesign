import { expect, test } from '@playwright/test';
import { openApp } from './appReady';

test.beforeEach(async ({ page }) => {
  await openApp(page);
});

test('opens the guided beginner journey directly from the learning tab', async ({ page }) => {
  await page.evaluate(() => {
    localStorage.setItem('nur_knowledge_level', 'beginner');
    localStorage.removeItem('nur_beginner_learning_completed');
    localStorage.removeItem('nur_beginner_learning_last');
  });
  await page.reload();
  await expect(page.getByRole('navigation')).toBeVisible({ timeout: 20_000 });

  await page.getByRole('navigation').getByText('Islam verstehen', { exact: true }).click();

  await expect(page.getByRole('heading', { name: 'Neu im Islam' })).toBeVisible();
  await expect(page.getByText('Was ist Islam?', { exact: true }).first()).toBeVisible();
  await expect(page.getByText('Quellen & Prüfung', { exact: true })).toBeVisible();
});

test('personalizes Home for a beginner and opens the next unfinished lesson', async ({ page }) => {
  await page.evaluate(() => {
    localStorage.setItem('nur_knowledge_level', 'beginner');
    localStorage.setItem('nur_beginner_learning_completed', JSON.stringify(['beginner-islam']));
    localStorage.removeItem('nur_beginner_learning_last');
  });
  await page.reload();
  await expect(page.getByRole('navigation')).toBeVisible({ timeout: 20_000 });

  await expect(page.getByText('Neu im Islam · Dein nächster Schritt', { exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Wer ist Allah?' })).toBeVisible();
  await expect(page.getByText('1/10 Grundlagen abgeschlossen', { exact: true })).toBeVisible();
  await expect(page.getByText('Islam Quiz', { exact: true })).toHaveCount(0);
  await expect(page.getByText('Nur Assistent', { exact: true })).toHaveCount(0);

  await page.getByRole('button', { name: /Nächste Grundlage öffnen/ }).click();
  await expect(page.getByRole('heading', { name: 'Neu im Islam' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Wer ist Allah?' })).toBeVisible();
});

test('keeps a focused core Home for experienced users', async ({ page }) => {
  await page.evaluate(() => {
    localStorage.setItem('nur_knowledge_level', 'experienced');
    localStorage.removeItem('nur_beginner_learning_completed');
  });
  await page.reload();
  await expect(page.getByRole('navigation')).toBeVisible({ timeout: 20_000 });

  await expect(page.getByText('Neu im Islam · Dein nächster Schritt', { exact: true })).toHaveCount(0);
  await expect(page.getByText('Islam Quiz', { exact: true })).toHaveCount(0);
  await expect(page.getByText('Nur Assistent', { exact: true })).toHaveCount(0);
  await expect(page.getByText('Fasten-Assistent', { exact: true })).toHaveCount(0);
  await expect(page.getByText('Ummah-Übersicht', { exact: true })).toHaveCount(0);
  await expect(page.getByText('Quran lesen', { exact: true })).toBeVisible();
  await expect(page.getByText('Meine Sammlung', { exact: true })).toBeVisible();
});

test('does not expose unreviewed legacy modules in public hubs', async ({ page }) => {
  await page.evaluate(() => {
    localStorage.setItem('nur_knowledge_level', 'experienced');
    localStorage.removeItem('nur_beginner_learning_completed');
  });
  await page.reload();
  await expect(page.getByRole('navigation')).toBeVisible({ timeout: 20_000 });

  await page.getByRole('navigation').getByText('Islam verstehen', { exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Islam lernen' })).toBeVisible();
  for (const label of ['Islam-Quiz', 'Hajj & Umrah', 'Hadith-Sammlung', 'Propheten']) {
    await expect(page.getByText(label, { exact: true })).toHaveCount(0);
  }

  await page.getByRole('navigation').getByText('Mehr', { exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Mehr' })).toBeVisible();
  for (const label of ['Fasten-Assistent', 'Ummah-Übersicht', 'Zakat-Rechner', 'Gebetsanzeige']) {
    await expect(page.getByText(label, { exact: true })).toHaveCount(0);
  }
});

test('stores beginner progress locally', async ({ page }) => {
  await page.evaluate(() => {
    localStorage.setItem('nur_knowledge_level', 'beginner');
    localStorage.removeItem('nur_beginner_learning_completed');
    localStorage.removeItem('nur_beginner_learning_last');
  });
  await page.reload();
  await expect(page.getByRole('navigation')).toBeVisible({ timeout: 20_000 });

  await page.getByRole('navigation').getByText('Islam verstehen', { exact: true }).click();
  await page.getByRole('button', { name: /Als verstanden markieren/ }).click();

  const completed = await page.evaluate(() => JSON.parse(localStorage.getItem('nur_beginner_learning_completed') || '[]') as string[]);
  expect(completed).toContain('beginner-islam');
  await expect(page.getByText('Abgeschlossen', { exact: true })).toBeVisible();
});

test('opens beginner FAQ, glossary and purity basics', async ({ page }) => {
  await page.evaluate(() => {
    localStorage.setItem('nur_knowledge_level', 'beginner');
    localStorage.removeItem('nur_beginner_learning_completed');
  });
  await page.reload();
  await expect(page.getByRole('navigation')).toBeVisible({ timeout: 20_000 });

  await page.getByRole('navigation').getByText('Islam verstehen', { exact: true }).click();

  await page.getByRole('button').filter({ hasText: 'Fragen & Begriffe' }).click();
  await expect(page.getByRole('heading', { name: 'Fragen & Begriffe' })).toBeVisible();
  await expect(page.getByText('Islam A–Z', { exact: true })).toBeVisible();
  await page.getByLabel('Anfängerhilfe durchsuchen').fill('Qibla');
  await expect(page.getByText('Qibla', { exact: true }).first()).toBeVisible();

  await page.getByRole('button', { name: 'Zurück zu Islam lernen' }).click();
  await page.getByRole('button').filter({ hasText: 'Ghusl & Tayammum' }).click();
  await expect(page.getByRole('heading', { name: 'Ghusl & Tayammum' })).toBeVisible();
  // Wudu, Ghusl and Tayammum all rest on the same verse, so the screen cites it
  // more than once; the exact match is the source label itself.
  await expect(page.getByText('Sure Al-Maida 5:6', { exact: true })).toBeVisible();
  expect(await page.getByText('Sure Al-Maida 5:6').count()).toBeGreaterThanOrEqual(3);
});

test('opens the seven day starter plan and routes into the matching lesson', async ({ page }) => {
  await page.evaluate(() => {
    localStorage.setItem('nur_knowledge_level', 'beginner');
    localStorage.removeItem('nur_beginner_learning_completed');
  });
  await page.reload();
  await expect(page.getByRole('navigation')).toBeVisible({ timeout: 20_000 });

  await page.getByRole('navigation').getByText('Islam verstehen', { exact: true }).click();

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
