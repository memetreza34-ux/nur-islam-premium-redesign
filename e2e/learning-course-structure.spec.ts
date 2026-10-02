import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

test.use({ serviceWorkers: 'block', reducedMotion: 'reduce' });

async function openFaithFoundation(page: Page) {
  await page.goto('/?preview=1');
  await page.getByRole('navigation').getByRole('button', { name: 'Lernen', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Dein Grundlagenpfad' })).toBeVisible();
  await expect(page.locator('.reference-foundation-step')).toHaveCount(14);
  await expect(page.locator('.reference-foundation-path').getByRole('button', { name: /Die vier Rechtsschulen/ })).toHaveCount(1);
  await expect(page.locator('.reference-expanded-learning').getByRole('button', { name: /Die vier Rechtsschulen/ })).toHaveCount(0);
  await expect(page.getByRole('button', { name: /Wissensbibliothek|Frauen im Islam|Die Gefährten|Islam-Quiz/ })).toHaveCount(0);
  await expect(page.locator('.reference-expanded-learning')).toHaveCount(0);
  const remainingFeatures = page.locator('.reference-foundation-path').getByRole('button');
  for (const title of ['Hadith-Sammlung', 'Hajj & Umrah', 'Sunnah im Alltag', 'Fehler & Reue']) {
    await expect(remainingFeatures.filter({ hasText: title })).toHaveCount(1);
  }
  await page.getByRole('button', { name: /Allah & der Glaube/ }).click();
  await expect(page.getByRole('region', { name: 'Was du in diesem Kurs lernst' })).toBeVisible();
}

for (const width of [320, 390, 768]) {
  test(`knowledge course has a readable hierarchy at ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await openFaithFoundation(page);

    const path = page.getByRole('region', { name: 'Kursplan' });
    await expect(path.getByRole('button', { name: /Kursplan/ })).toHaveAttribute('aria-expanded', 'false');
    await path.getByRole('button', { name: /Kursplan/ }).click();
    await expect(path.locator('.learning-course-v2__lessons').getByRole('button')).toHaveCount(7);
    await expect(path.getByText('Einführung: Woran Muslime glauben', { exact: true })).toBeVisible();
    await expect(path.getByText('1. Glaube an Allah', { exact: true })).toBeVisible();
    await expect(path.getByText('6. Glaube an die Bestimmung', { exact: true })).toBeVisible();

    const lesson = page.getByRole('article').first();
    await expect(lesson.getByRole('heading', { name: 'Worum es in diesem Kapitel geht' })).toBeVisible();
    await expect(lesson.getByRole('heading', { name: 'So ist der Glaubenskurs aufgebaut' })).toBeVisible();
    await expect(lesson.getByRole('heading', { name: 'So lernst du verantwortungsvoll' })).toBeVisible();

    const paragraph = lesson.getByText(/Aqidah bezeichnet die Glaubensgrundlage/);
    const type = await paragraph.evaluate(element => ({
      size: parseFloat(getComputedStyle(element).fontSize),
      line: parseFloat(getComputedStyle(element).lineHeight),
    }));
    expect(type.size).toBeGreaterThanOrEqual(16);
    expect(type.line).toBeGreaterThanOrEqual(25);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);

    const titles = await path.locator('strong').evaluateAll(elements => elements.map(element => ({
      overflow: getComputedStyle(element).overflow,
      whiteSpace: getComputedStyle(element).whiteSpace,
      scrollWidth: element.scrollWidth,
      clientWidth: element.clientWidth,
    })));
    for (const title of titles) {
      expect(title.whiteSpace).not.toBe('nowrap');
      expect(title.scrollWidth).toBeLessThanOrEqual(title.clientWidth + 1);
    }

    await page.locator('.learning-course-v2__intro').screenshot({ path: testInfo.outputPath(`learning-intro-${width}.png`) });
  });
}

test('lesson selection returns to the course start and exposes the complete title', async ({ page }) => {
  await openFaithFoundation(page);
  const frame = page.locator('.screen-transition-frame');
  await frame.evaluate(element => { element.scrollTop = 900; });
  await page.getByRole('button', { name: /Kursplan/ }).click();
  const lesson = page.getByRole('button', { name: /6\. Glaube an die Bestimmung 7 Min/ });
  await lesson.click();
  await expect(page.getByRole('button', { name: /Kursplan/ })).toHaveAttribute('aria-expanded', 'false');
  await expect(page.getByRole('article').getByRole('heading', { name: '6. Glaube an die Bestimmung', exact: true })).toBeVisible();
  await expect.poll(() => frame.evaluate(element => element.scrollTop)).toBeLessThan(2);
});

test('every pillar has its own course-plan lesson', async ({ page }) => {
  await page.goto('/?preview=1');
  await page.getByRole('navigation').getByRole('button', { name: 'Lernen', exact: true }).click();
  await page.getByRole('button', { name: /Die fünf Säulen/ }).click();
  await page.getByRole('button', { name: /Kursplan/ }).click();

  const path = page.getByRole('region', { name: 'Kursplan' });
  await expect(path.locator('.learning-course-v2__lessons').getByRole('button')).toHaveCount(6);
  await expect(path.getByText('Shahada: Das Glaubensbekenntnis', { exact: true })).toBeVisible();
  await expect(path.getByText('Salah: Die fünf täglichen Gebete', { exact: true })).toBeVisible();
  await expect(path.getByText('Zakat: Vermögen verantwortlich reinigen', { exact: true })).toBeVisible();
  await expect(path.getByText('Sawm: Fasten im Ramadan', { exact: true })).toBeVisible();
  await expect(path.getByText('Hajj: Die Pilgerfahrt nach Makka', { exact: true })).toBeVisible();
});

test('every important term follows the same definition and example structure', async ({ page }) => {
  await page.goto('/?preview=1');
  await page.getByRole('navigation').getByRole('button', { name: 'Lernen', exact: true }).click();
  await page.getByRole('button', { name: /Wichtige Begriffe/ }).click();
  await page.getByRole('button', { name: /Kursplan/ }).click();

  const path = page.getByRole('region', { name: 'Kursplan' });
  await expect(path.locator('.learning-course-v2__lessons').getByRole('button')).toHaveCount(12);
  await expect(path.getByText('Einführung: Wichtige Begriffe verstehen', { exact: true })).toBeVisible();
  await expect(path.getByText('Islam, Iman und Ihsan', { exact: true })).toBeVisible();
  await expect(path.getByText('Was ist Niyyah?', { exact: true })).toBeVisible();
  await expect(path.getByText('Was ist Fard?', { exact: true })).toBeVisible();
  await expect(path.getByText('Was ist Sunnah?', { exact: true })).toBeVisible();
  await expect(path.getByText('Was bedeuten Mubah und Makruh?', { exact: true })).toBeVisible();
  await expect(path.getByText('Was bedeutet Halal?', { exact: true })).toBeVisible();
  await expect(path.getByText('Was bedeutet Haram?', { exact: true })).toBeVisible();
  await expect(path.getByText('Was ist Dua?', { exact: true })).toBeVisible();
  await expect(path.getByText('Was ist Dhikr?', { exact: true })).toBeVisible();
  await expect(path.getByText('Was ist Tawba?', { exact: true })).toBeVisible();
  await expect(path.getByText('Hadith, Sunnah, Fiqh und Rechtsschule', { exact: true })).toBeVisible();

  await path.getByRole('button', { name: /Was ist Fard\? 5 Min/ }).click();
  const lesson = page.getByRole('article').first();
  await expect(lesson.getByRole('heading', { name: 'Deutsche Bedeutung' })).toBeVisible();
  await expect(lesson.getByRole('heading', { name: 'Definition und Beispiel' })).toBeVisible();
  await expect(lesson.getByRole('heading', { name: 'Wichtige Abgrenzung' })).toBeVisible();
  await expect(lesson.getByText(/Fard \(فرض\) bedeutet auf Deutsch/)).toBeVisible();
});

test('every foundation course starts with a clear introduction and named sections', async ({ page }) => {
  const courses = [
    { button: /Reinheit & Alltag/, title: 'Einführung: Sicher im Alltag handeln', sections: ['Worum es in diesem Kapitel geht', 'So ist der Praxiskurs aufgebaut', 'Grenzen einer kurzen Lektion'] },
    { button: /Charakter & Rechte/, title: 'Einführung: Glaube im Verhalten', sections: ['Worum es in diesem Kapitel geht', 'So ist der Charakterkurs aufgebaut', 'Verhalten und Verantwortung'] },
    { button: /Miteinander & Verantwortung/, title: 'Einführung: Verantwortung im Miteinander', sections: ['Worum es in diesem Kapitel geht', 'So ist der Kurs aufgebaut', 'Schutz geht vor Verschweigen'] },
    { button: /Der Prophet ﷺ/, title: 'Einführung: Das Leben des Propheten ﷺ lernen', sections: ['Worum es in diesem Kapitel geht', 'So ist der Seerah-Kurs aufgebaut', 'Quellen und wichtige Abgrenzung'] },
  ];

  for (const course of courses) {
    await page.goto('/?preview=1');
    await page.getByRole('navigation').getByRole('button', { name: 'Lernen', exact: true }).click();
    await page.getByRole('button', { name: course.button }).click();
    const lesson = page.getByRole('article').first();
    await expect(lesson.getByRole('heading', { name: course.title, exact: true })).toBeVisible();
    for (const section of course.sections) {
      await expect(lesson.getByRole('heading', { name: section, exact: true })).toBeVisible();
    }
  }
});

test('back from a knowledge category restores the exact learning overview position', async ({ page }) => {
  await page.goto('/?preview=1');
  await page.getByRole('navigation').getByRole('button', { name: 'Lernen', exact: true }).click();

  const termsButton = page.getByRole('button', { name: /Wichtige Begriffe/ });
  await termsButton.evaluate(element => {
    const frame = element.closest<HTMLElement>('.screen-transition-frame');
    if (frame) frame.scrollTop = 980;
  });
  const previousOffset = await termsButton.evaluate(element => element.closest<HTMLElement>('.screen-transition-frame')?.scrollTop ?? 0);
  expect(previousOffset).toBeGreaterThan(0);

  await termsButton.evaluate((element: HTMLElement) => element.click());
  const courseHeading = page.getByRole('heading', { name: 'Wichtige Begriffe', exact: true });
  await expect(courseHeading).toBeVisible();
  await expect.poll(() => courseHeading.evaluate(element => element.closest<HTMLElement>('.screen-transition-frame')?.scrollTop ?? -1)).toBeLessThan(2);

  await page.getByRole('button', { name: 'Zurück zu Lernen' }).click();
  const overviewHeading = page.getByRole('heading', { name: 'Dein Grundlagenpfad' });
  await expect(overviewHeading).toBeVisible();
  await expect.poll(() => overviewHeading.evaluate(element => element.closest<HTMLElement>('.screen-transition-frame')?.scrollTop ?? -1)).toBe(previousOffset);
});

test('the foundations grid opens the complete 99 Names experience', async ({ page }) => {
  await page.goto('/?preview=1');
  await page.getByRole('navigation').getByRole('button', { name: 'Lernen', exact: true }).click();
  await page.getByRole('button', { name: /99 Namen Allahs/ }).click();
  await expect(page.getByRole('heading', { name: '99 Namen Allahs', exact: true })).toBeVisible();
  await expect(page.getByText('Alle 99 Namen', { exact: false })).toBeVisible();
});

test('the prophets category contains 25 complete Quran-grounded course plans', async ({ page }) => {
  await page.goto('/?preview=1');
  await page.getByRole('navigation').getByRole('button', { name: 'Lernen', exact: true }).click();
  const prophetsButton = page.getByRole('button', { name: /Die 25 Propheten/ });
  await prophetsButton.evaluate(element => {
    const frame = element.closest<HTMLElement>('.screen-transition-frame');
    if (frame) frame.scrollTop = 1100;
  });
  const previousOffset = await prophetsButton.evaluate(element => element.closest<HTMLElement>('.screen-transition-frame')?.scrollTop ?? 0);
  await prophetsButton.evaluate((element: HTMLElement) => element.click());

  await expect(page.locator('h1').filter({ hasText: 'Die 25 Propheten' })).toBeVisible();
  await expect(page.locator('.reference-person-list button')).toHaveCount(25);
  await expect(page.getByText('25 eigenständige Kurse', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: /Muhammad · محمد/ }).click();
  await expect(page.getByRole('heading', { name: 'Muhammad', exact: true })).toBeVisible();
  await expect(page.getByText('Mu-ham-mad', { exact: false })).toBeVisible();
  await expect(page.getByRole('region', { name: 'Kursstatus' })).toContainText('0/6 abgeschlossen');
  await expect(page.getByRole('region', { name: 'Kursstatus' })).toContainText('Mit Quran-Belegstellen');
  await expect(page.getByRole('region', { name: 'Kursstatus' })).not.toContainText('Fachprüfung offen');
  await expect(page.getByRole('heading', { name: 'Bevor du beginnst', exact: true })).toBeVisible();
  await expect(page.locator('.reference-prophet-overview__goals p')).toHaveCount(3);
  await expect(page.getByRole('heading', { name: 'Sicher im Quran belegt', exact: true })).toBeVisible();
  await expect(page.locator('.reference-prophet-overview__facts li')).toHaveCount(6);
  await expect(page.getByText(/Grenze des sicheren Wissens:/)).toBeVisible();
  const coursePlan = page.getByRole('region', { name: 'Kursplan für Muhammad' });
  await expect(coursePlan.getByRole('button')).toHaveCount(6);
  await expect(page.getByRole('heading', { name: 'Der Offenbarungsauftrag: Lesen', exact: true })).toBeVisible();

  await coursePlan.getByRole('button', { name: /Siegel der Propheten/ }).click();
  await expect(page.getByRole('heading', { name: 'Siegel der Propheten', exact: true })).toBeVisible();
  await expect(page.getByText('Mit Muhammad ﷺ ist die Prophetie abgeschlossen.', { exact: true })).toBeVisible();
  const alAhzabSource = page.getByRole('button', { name: 'Quran 33:40 (Al-Ahzab) im Quran öffnen' });
  await expect(alAhzabSource).toBeVisible();
  await expect(page.getByText('Prüfe dein Verständnis', { exact: true })).toBeVisible();
  await expect(page.locator('.reference-prophet-lesson__questions li')).toHaveCount(4);
  await page.getByRole('button', { name: 'Kapitel als abgeschlossen markieren', exact: true }).click();
  await expect(page.getByRole('region', { name: 'Kursstatus' })).toContainText('1/6 abgeschlossen');

  await alAhzabSource.click();
  await expect(page.getByRole('heading', { name: 'Al-Ahzaab', exact: true, level: 1 })).toBeVisible();
  await page.getByRole('button', { name: 'Zurück zum Quran', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Siegel der Propheten', exact: true })).toBeVisible();
  await expect(page.getByRole('region', { name: 'Kursstatus' })).toContainText('1/6 abgeschlossen');

  await page.evaluate(() => {
    localStorage.setItem('nur_prophet_course_progress_v1', JSON.stringify({
      muhammad: {
        chapterIndex: 5,
        completedChapterIds: ['revelation', 'mission', 'mercy', 'example', 'hijra', 'final'],
      },
    }));
    localStorage.setItem('nur_prophet_course_return_v1', JSON.stringify({ prophetId: 'muhammad', chapterIndex: 5 }));
    window.location.reload();
  });
  await expect(page.getByRole('region', { name: 'Kurs abgeschlossen' })).toBeVisible();
  await expect(page.getByRole('region', { name: 'Kursstatus' })).toContainText('6/6 abgeschlossen');
  await page.getByRole('button', { name: 'Zu allen Propheten', exact: true }).click();

  await page.getByRole('button', { name: /Idris · إدريس/ }).click();
  await expect(page.locator('.reference-prophet-overview__facts li')).toHaveCount(3);
  await expect(page.getByText('Wahrhaftigkeit ist die zentrale genannte Eigenschaft.', { exact: true })).toBeVisible();
  await expect(page.getByText('Quran 19:56 (Maryam)', { exact: true }).first()).toBeVisible();
  await page.getByRole('button', { name: /Zurück/ }).first().click();
  await page.getByRole('button', { name: /Zurück/ }).first().click();
  const overviewHeading = page.getByRole('heading', { name: 'Dein Grundlagenpfad' });
  await expect(overviewHeading).toBeVisible();
  await expect.poll(() => overviewHeading.evaluate(element => element.closest<HTMLElement>('.screen-transition-frame')?.scrollTop ?? -1)).toBe(previousOffset);
});
