import { expect, test, type Page } from '@playwright/test';
import { openApp } from './appReady';
import { writeFile } from 'node:fs/promises';

const reportOnly = process.env.NUR_RESPONSIVE_REPORT_ONLY === '1';
const sizes = reportOnly
  ? [{ width: 320, height: 740 }, { width: 1024, height: 768 }]
  : [{ width: 320, height: 740 }, { width: 390, height: 844 }, { width: 844, height: 390 }, { width: 768, height: 1024 }, { width: 1024, height: 768 }];

async function inspect(page: Page, label: string) {
  await expect.poll(() => page.evaluate(() => {
    const root = document.querySelector('[role="dialog"]') ?? document.querySelector('main:not(.reference-splash)');
    if (!root) return false;
    for (let el: Element | null = root; el; el = el.parentElement) {
      if (Number(getComputedStyle(el).opacity) < .999) return false;
    }
    return true;
  })).toBe(true);
  await expect(page.locator('.qibla-dial[role="status"]')).toHaveCount(0);
  await expect(page.getByText('Schritte werden geladen …', { exact: true })).toHaveCount(0);
  await page.evaluate(() => document.fonts.ready);
  return page.evaluate((label) => {
    const small: Array<{ selector: string; text: string; size: number }> = [];
    const targets: Array<{ selector: string; text: string; width: number; height: number; tag: string }> = [];
    const clips: string[] = [];
    const lateral: string[] = [];
    const root = document.querySelector('[role="dialog"]') ?? document.querySelector('main:not(.reference-splash)') ?? document.body;
    const visible = (el: Element) => {
      const rect = el.getBoundingClientRect();
      const css = getComputedStyle(el);
      return rect.width > 0 && rect.height > 0 && css.visibility !== 'hidden' && css.display !== 'none' && !el.closest('[hidden],.sr-only,[aria-hidden="true"],svg');
    };
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const node = walker.currentNode;
      const el = node.parentElement;
      const text = node.textContent?.trim();
      if (!el || !text || !visible(el)) continue;
      const range = document.createRange();
      range.selectNodeContents(node);
      const textBox = range.getBoundingClientRect();
      let scrollable = false;
      for (let parent: Element | null = el; parent && parent !== root; parent = parent.parentElement) {
        if (/auto|scroll/.test(getComputedStyle(parent).overflowX) || getComputedStyle(parent).textOverflow === 'ellipsis') scrollable = true;
      }
      if (!scrollable && (textBox.left < -1 || textBox.right > innerWidth + 1)) lateral.push(`${el.className || el.tagName}: ${text.slice(0, 35)}`);
      const size = parseFloat(getComputedStyle(el).fontSize);
      if (size < 11.9) small.push({ selector: el.className || `${el.parentElement?.className || el.parentElement?.tagName} > ${el.tagName}`, text: text.slice(0, 45), size });
      const css = getComputedStyle(el);
      if (el.children.length === 0 && css.overflowY === 'hidden' && el.scrollHeight > el.clientHeight + 3 && !css.webkitLineClamp.match(/^[1-9]/)) clips.push(`${el.className}: ${text.slice(0, 35)}`);
    }
    for (const el of root.querySelectorAll('button,a[href],input:not([type="hidden"]),select,textarea,summary')) {
      if (!visible(el) || (el as HTMLButtonElement).disabled) continue;
      const label = el.matches('input') ? el.closest('label') : null;
      const rect = (label ?? el).getBoundingClientRect();
      if (rect.height < 43.5 || rect.width < 43.5) targets.push({ selector: el.className || `${el.parentElement?.className || el.parentElement?.tagName} > ${el.tagName}`, text: (el.getAttribute('aria-label') || el.textContent || '').trim().slice(0, 45), width: rect.width, height: rect.height, tag: el.tagName });
    }
    const shell = document.querySelector('.app-shell')?.getBoundingClientRect();
    const navBottom = document.querySelector('.bottom-nav')?.getBoundingClientRect().bottom;
    const undersizedInputs = [...root.querySelectorAll('input:not([type=checkbox]):not([type=radio]):not([type=range]),select,textarea')].filter(el => visible(el) && parseFloat(getComputedStyle(el).fontSize) < 16).map(el => el.className || el.tagName);
    return { label, viewport: innerWidth, documentWidth: document.documentElement.scrollWidth, shellWidth: shell?.width, navBottom, undersizedInputs, small, targets, clips, lateral };
  }, label);
}

for (const size of sizes) {
  test(`complete app adapts to ${size.width}x${size.height}`, async ({ page }, testInfo) => {
    test.setTimeout(120_000);
    page.setDefaultTimeout(12_000);
    await page.setViewportSize(size);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await openApp(page);
    const results: Awaited<ReturnType<typeof inspect>>[] = [];
    const record = async (entry: Awaited<ReturnType<typeof inspect>>) => {
      results.push(entry);
      await writeFile(testInfo.outputPath('measurements.json'), JSON.stringify(results, null, 2));
      if (process.env.NUR_VISUAL_CAPTURE !== '1' || ![390, 768].includes(size.width)) return;
      await page.evaluate(() => document.fonts.ready);
      const savedScroll = await page.evaluate(() => [...document.querySelectorAll<HTMLElement>('*')]
        .filter(el => el.scrollHeight > el.clientHeight + 4 && /auto|scroll/.test(getComputedStyle(el).overflowY))
        .map(el => { const original = el.scrollTop; el.scrollTop = 0; return { selector: el.className, original }; }));
      const prefix = `${String(results.length).padStart(2, '0')}-${entry.label.replace(/[^a-zA-Z0-9äöüÄÖÜß-]+/g, '-').slice(0, 65)}`;
      const decodeVisibleImages = () => page.locator('img').evaluateAll(async images => {
        await Promise.all(images.filter(image => {
          const bounds = image.getBoundingClientRect();
          return bounds.bottom > 0 && bounds.top < innerHeight && bounds.width > 0;
        }).map(image => Promise.race([image.decode().catch(() => undefined), new Promise(resolve => setTimeout(resolve, 300))])));
      });
      await decodeVisibleImages();
      await page.screenshot({ path: testInfo.outputPath(`${prefix}-top.png`) });
      if (savedScroll.length) {
        await page.evaluate(() => [...document.querySelectorAll<HTMLElement>('*')]
          .filter(el => el.scrollHeight > el.clientHeight + 4 && /auto|scroll/.test(getComputedStyle(el).overflowY))
          .forEach(el => { el.scrollTop = el.scrollHeight; }));
        await decodeVisibleImages();
        await page.screenshot({ path: testInfo.outputPath(`${prefix}-bottom.png`) });
        await page.evaluate(saved => [...document.querySelectorAll<HTMLElement>('*')]
          .filter(el => el.scrollHeight > el.clientHeight + 4 && /auto|scroll/.test(getComputedStyle(el).overflowY))
          .forEach((el, i) => { el.scrollTop = saved[i]?.original ?? 0; }), savedScroll);
      }
    };
    for (const name of ['Start', 'Gebet', 'Quran', 'Lernen', 'Mehr']) {
      await page.locator('.bottom-nav').getByText(name, { exact: true }).click();
      await expect(page.getByRole('heading', { name: name === 'Start' ? 'Start – Nur Islam' : name === 'Gebet' ? 'Gebetszeiten' : name, exact: true, level: 1 })).toBeVisible();
      await record(await inspect(page, name));
      await page.screenshot({ path: testInfo.outputPath(`${name}.png`) });
    }
    for (const group of ['.reference-core-access', '.reference-services-grid']) {
      const count = await page.locator(`${group} button`).count();
      expect(count).toBeGreaterThan(group === '.reference-core-access' ? 20 : 0);
      for (let i = 0; i < count; i++) {
        const button = page.locator(`${group} button`).nth(i);
        const label = (await button.innerText()).trim().split('\n')[0];
        await button.click();
        await expect(page.getByRole('heading', { name: 'Mehr', exact: true, level: 1 })).toBeHidden();
        await expect(page.locator('main').first()).toBeVisible();
        await page.waitForTimeout(80);
        await record(await inspect(page, label));
        if (await page.locator('.bottom-nav').count()) {
          await page.locator('.bottom-nav').getByText('Mehr', { exact: true }).click();
        } else {
          await page.goBack();
        }
        await expect(page.getByRole('heading', { name: 'Mehr', exact: true, level: 1 })).toBeVisible();
      }
    }
    for (const name of ['Konto & Cloud', 'Notizen', 'Impressum & Datenschutz']) {
      await page.getByRole('button').filter({ hasText: name }).first().click();
      await expect(page.getByRole('heading', { name: 'Mehr', exact: true, level: 1 })).toBeHidden();
      await expect(page.locator('main').first()).toBeVisible();
      await record(await inspect(page, name));
      await page.goBack();
      await expect(page.getByRole('heading', { name: 'Mehr', exact: true, level: 1 })).toBeVisible();
    }
    for (const name of ['Einstellungen Reminder, Konto und Cloud', 'Sprache Aktuell vollständig: Deutsch', 'Hilfe & Datenquellen Woher die Inhalte kommen und was lokal bleibt', 'Über Nur Version und Produktprinzipien']) {
      await expect(page.getByRole('heading', { name: 'Mehr', exact: true, level: 1 })).toBeVisible();
      await page.getByRole('button', { name, exact: true }).click();
      const dialog = page.getByRole('dialog');
      await expect(dialog).toBeVisible();
      await record(await inspect(page, name));
      await page.keyboard.press('Escape');
      await expect(dialog).toBeHidden();
    }
    await page.locator('.bottom-nav').getByText('Quran', { exact: true }).click();
    await page.getByRole('button', { name: 'Lesen beginnen', exact: true }).click();
    await expect(page.locator('#quran-ayah-1-1')).toBeVisible();
    await record(await inspect(page, 'Quran-Leser'));
    for (const mode of ['Deutsch Buchseiten', 'Arabisch Buchseiten']) {
      await page.getByRole('button', { name: mode, exact: true }).click();
      await record(await inspect(page, mode));
    }
    await page.getByRole('button', { name: 'Zurück zum Quran', exact: true }).click();
    await page.locator('.bottom-nav').getByText('Lernen', { exact: true }).click();
    await page.getByRole('button', { name: 'Wudu Schritt für Schritt', exact: true }).click();
    await expect(page.locator('.wudu-lesson__card')).toBeVisible();
    await expect(page.locator('.reference-guide-progress')).toHaveCount(0);
    await record(await inspect(page, 'Wudu Schritt für Schritt'));
    await page.getByRole('button', { name: 'Zurück', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Lernen', exact: true, level: 1 })).toBeVisible();
    await page.getByRole('button', { name: 'Gebetsablauf Rakʿah mit Wortlaut', exact: true }).click();
    await expect(page.locator('.reference-prayer-step-chooser')).toBeVisible();
    await record(await inspect(page, 'Gebetsablauf'));
    await testInfo.attach('responsive-measurements', { body: JSON.stringify(results, null, 2), contentType: 'application/json' });
    if (reportOnly) return;
    expect(results.flatMap(r => r.documentWidth > size.width + 1 ? [`${r.label}: horizontal overflow`] : [])).toEqual([]);
    expect(results.flatMap(r => r.undersizedInputs.map(c => `${r.label}: ${c}`))).toEqual([]);
    expect(results.flatMap(r => r.navBottom && Math.abs(r.navBottom - size.height) > 2 ? [`${r.label}: navigation ends at ${r.navBottom}`] : [])).toEqual([]);
    expect(results.flatMap(r => r.clips.map(c => `${r.label}: ${c}`))).toEqual([]);
    expect(results.flatMap(r => r.lateral.map(c => `${r.label}: ${c}`))).toEqual([]);
    expect(results.flatMap(r => r.small.map(t => `${r.label}: ${t.selector} ${t.size}px ${t.text}`))).toEqual([]);
    expect(results.flatMap(r => r.targets.filter(t => t.tag !== 'A' && (t.height < 43.5 || (!/^(?:prayer-)?calendar-day\b/.test(t.selector) && t.width < 43.5))).map(t => `${r.label}: ${t.selector} ${t.width}x${t.height}`))).toEqual([]);
    if (size.width >= 600) expect(Math.min(...results.map(r => r.shellWidth ?? 0))).toBeGreaterThanOrEqual(Math.min(size.width, 900) - 1);
  });
}


test.describe('first launch', () => {
  test.use({ serviceWorkers: 'block', reducedMotion: 'reduce' });
  for (const size of [{ width: 320, height: 740 }, { width: 844, height: 390 }, { width: 768, height: 1024 }]) {
    test(`onboarding fits ${size.width}x${size.height}`, async ({ page }, testInfo) => {
      await page.setViewportSize(size);
      await page.goto('/');
      await expect(page.locator('.reference-onboarding')).toBeVisible();
      for (let i = 0; i < 3; i++) {
        const result = await inspect(page, `Einführung ${i + 1}`);
        await testInfo.attach(`intro-${i}`, { body: JSON.stringify(result), contentType: 'application/json' });
        expect(result.targets.filter(t => t.tag !== 'A')).toEqual([]);
        expect(result.documentWidth).toBeLessThanOrEqual(size.width);
        expect(result.small).toEqual([]);
        expect(result.clips).toEqual([]);
        expect(result.lateral).toEqual([]);
        await page.screenshot({ path: testInfo.outputPath(`onboarding-${i}.png`) });
        await page.getByRole('button', { name: i === 2 ? 'Nur öffnen' : 'Weiter', exact: true }).click();
      }
      await expect(page.locator('.bottom-nav')).toBeVisible();
    });
  }
});
