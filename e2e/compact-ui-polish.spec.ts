import { expect, test } from '@playwright/test';
import { openApp } from './appReady';

test('compact portrait keeps Home useful and Notes clear, readable and balanced', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await openApp(page);

  const hero = page.locator('.premium-home--v2 .welcome-hero');
  const heroBox = await hero.boundingBox();
  expect(heroBox).not.toBeNull();
  expect(heroBox!.height, 'compact Home hero should leave room for the next-prayer card').toBeLessThanOrEqual(390);

  await page.getByRole('navigation').getByText('Mehr', { exact: true }).click();
  await page.getByRole('button').filter({ hasText: 'Notizen' }).first().click();
  await expect(page.getByRole('heading', { name: 'Notizen' })).toBeVisible();
  await expect(page.locator('.reference-notes-storage')).toBeVisible();

  const overview = await page.evaluate(() => {
    const header = document.querySelector('.reference-notes-screen > .reference-screen-header')?.getBoundingClientRect();
    const storage = document.querySelector<HTMLElement>('.reference-notes-storage');
    const storageBox = storage?.getBoundingClientRect();
    const title = storage?.querySelector('strong');
    const action = storage?.querySelector('button');
    if (!header || !storage || !storageBox || !title || !action) return null;
    return {
      headerBottom: header.bottom,
      storageTop: storageBox.top,
      titleSize: parseFloat(getComputedStyle(title).fontSize),
      actionSize: parseFloat(getComputedStyle(action).fontSize),
      actionHeight: action.getBoundingClientRect().height,
    };
  });
  expect(overview).not.toBeNull();
  expect(overview!.storageTop - overview!.headerBottom, 'Notes storage card must start clear of the sticky header before editing').toBeGreaterThanOrEqual(6);
  expect(overview!.titleSize, 'Notes storage title should not be tiny').toBeGreaterThanOrEqual(11.5);
  expect(overview!.actionSize, 'Notes cloud action should remain readable').toBeGreaterThanOrEqual(11);
  expect(overview!.actionHeight, 'Notes cloud action needs a real touch target').toBeGreaterThanOrEqual(44);

  await page.getByRole('button', { name: 'Neue Notiz schreiben' }).click();
  const editor = page.locator('.reference-note-editor');
  await expect(editor).toBeVisible();

  const editing = await page.evaluate(() => {
    const header = document.querySelector('.reference-notes-screen > .reference-screen-header')?.getBoundingClientRect();
    const storage = document.querySelector<HTMLElement>('.reference-notes-storage');
    const editor = document.querySelector<HTMLElement>('.reference-note-editor');
    const title = editor?.querySelector<HTMLInputElement>('input');
    const textarea = editor?.querySelector<HTMLTextAreaElement>('textarea');
    const close = editor?.querySelector<HTMLButtonElement>('.reference-note-editor__heading > button');
    const save = editor?.querySelector<HTMLButtonElement>('.gold-button');
    if (!header || !storage || !editor || !title || !textarea || !close || !save) return null;
    const editorBox = editor.getBoundingClientRect();
    const titleBox = title.getBoundingClientRect();
    const textareaBox = textarea.getBoundingClientRect();
    const closeBox = close.getBoundingClientRect();
    return {
      storageDisplay: getComputedStyle(storage).display,
      headerBottom: header.bottom,
      editorTop: editorBox.top,
      editorHeight: editorBox.height,
      titleHeight: titleBox.height,
      titleSize: parseFloat(getComputedStyle(title).fontSize),
      textareaHeight: textareaBox.height,
      textareaSize: parseFloat(getComputedStyle(textarea).fontSize),
      closeWidth: closeBox.width,
      closeHeight: closeBox.height,
      saveHeight: save.getBoundingClientRect().height,
    };
  });
  expect(editing).not.toBeNull();
  expect(editing!.storageDisplay, 'compact editing should not waste space on the cloud status card').toBe('none');
  expect(editing!.editorTop - editing!.headerBottom, 'Notes editor must begin below the sticky header').toBeGreaterThanOrEqual(6);
  expect(editing!.editorHeight).toBeGreaterThanOrEqual(300);
  expect(editing!.editorHeight).toBeLessThanOrEqual(460);
  expect(editing!.titleHeight).toBeGreaterThanOrEqual(44);
  expect(editing!.titleHeight).toBeLessThanOrEqual(56);
  expect(editing!.titleSize).toBeGreaterThanOrEqual(14);
  expect(editing!.titleSize).toBeLessThanOrEqual(18);
  expect(editing!.textareaHeight).toBeGreaterThanOrEqual(160);
  expect(editing!.textareaHeight).toBeLessThanOrEqual(220);
  expect(editing!.textareaSize).toBeGreaterThanOrEqual(14);
  expect(editing!.textareaSize).toBeLessThanOrEqual(18);
  expect(editing!.closeWidth).toBeGreaterThanOrEqual(44);
  expect(editing!.closeHeight).toBeGreaterThanOrEqual(44);
  expect(editing!.saveHeight).toBeGreaterThanOrEqual(44);

  await editor.scrollIntoViewIfNeeded();
  const titleInput = page.getByRole('textbox', { name: 'Titel der Notiz' });
  await titleInput.focus();
  const focusedHeader = await page.evaluate(() => {
    const header = document.querySelector<HTMLElement>('.reference-notes-screen > .reference-screen-header');
    if (!header) return null;
    const backgroundImage = getComputedStyle(header).backgroundImage;
    return {
      backgroundImage,
      translucentLayer: /rgba\([^)]*,\s*0?\.\d+\)/i.test(backgroundImage),
    };
  });
  expect(focusedHeader).not.toBeNull();
  expect(focusedHeader!.translucentLayer, `focused Notes header must fully mask scrolled content: ${focusedHeader!.backgroundImage}`).toBe(false);
});

test('light calendar keeps navigation labels and day numbers comfortably readable', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openApp(page);
  await page.evaluate(() => {
    localStorage.setItem('nur_theme', 'light');
    document.documentElement.setAttribute('data-theme', 'light');
  });

  await page.getByRole('navigation').getByText('Mehr', { exact: true }).click();
  await page.getByRole('button').filter({ hasText: 'Kalender' }).first().click();
  await expect(page.getByRole('heading', { name: 'Kalender' })).toBeVisible();

  const type = await page.evaluate(() => {
    const weekday = document.querySelector('.calendar-weekdays span');
    const day = document.querySelector('.reference-calendar-grid .calendar-day:not(.calendar-day--empty) strong');
    if (!weekday || !day) return null;
    return {
      weekdaySize: parseFloat(getComputedStyle(weekday).fontSize),
      weekdayWeight: Number(getComputedStyle(weekday).fontWeight),
      daySize: parseFloat(getComputedStyle(day).fontSize),
      dayWeight: Number(getComputedStyle(day).fontWeight),
    };
  });

  expect(type).not.toBeNull();
  expect(type!.weekdaySize).toBeGreaterThanOrEqual(11.5);
  expect(type!.weekdayWeight).toBeGreaterThanOrEqual(700);
  expect(type!.daySize).toBeGreaterThanOrEqual(11.3);
  expect(type!.dayWeight).toBeGreaterThanOrEqual(600);
});
