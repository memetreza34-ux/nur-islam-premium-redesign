import { expect, test } from '@playwright/test';
import { prayerRequestFixture } from './fixtures/prayer-api';

test.use({ serviceWorkers: 'allow', reducedMotion: 'reduce' });
test('source details work on their first opening after going offline', async ({ page, context }) => {
  test.setTimeout(60000);
  await page.route('https://api.aladhan.com/**', route => route.fulfill({ json: prayerRequestFixture(route.request().url()) }));
  await page.goto('/?preview=1');
  await expect(page.getByRole('navigation')).toBeVisible();
  await page.waitForFunction(() => navigator.serviceWorker.controller !== null);
  await page.reload();
  await page.getByRole('navigation').getByRole('button', { name: 'Gebet', exact: true }).click();
  await expect.poll(() => page.evaluate(async () => {
    for (const name of await caches.keys()) {
      const cache = await caches.open(name);
      if ((await cache.keys()).some(request => /SourceInfoDialog.*\.js/.test(request.url))) return true;
    }
    return false;
  }), { timeout: 20000 }).toBe(true);
  await expect(page.getByRole('region', { name: 'Berechnung der Gebetszeiten' })).toBeVisible();
  await expect(page.locator('.prayer-calendar-grid')).toBeVisible();
  await context.setOffline(true);
  const trigger = page.getByRole('region', { name: 'Berechnung der Gebetszeiten' }).getByRole('button', { name: 'Quellen anzeigen: Berechnung & Quelle' });
  await trigger.click();
  const dialog = page.getByRole('dialog', { name: 'Berechnung & Quelle', exact: true });
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText('Berechnete Gebetszeiten');
  await dialog.getByRole('button', { name: 'Quellen schließen' }).click();
  await expect(trigger).toBeFocused();
});
