import { expect, test } from '@playwright/test';

/**
 * The CSP lives in a meta tag because GitHub Pages cannot send headers, and
 * `frame-ancestors` is ignored there — so the app has to refuse foreign frames
 * itself. This proves it does, and that a same-origin frame still renders, which
 * local preview tooling depends on.
 *
 * The foreign host is 127.0.0.1 on another port rather than a public-looking
 * domain: it is a different origin, which is what the guard reacts to, while
 * staying on the local network so Chrome's private-network rules do not kill
 * the frame before the app gets a say.
 */
// The foreign host page is fulfilled by the test rather than served, so Chrome
// treats it as public address space and its local-network checks kill the frame
// before any of this is exercised. The checks are what is being bypassed here,
// not the guard.
test.use({
  launchOptions: {
    args: ['--disable-features=LocalNetworkAccessChecks,BlockInsecurePrivateNetworkRequests'],
  },
});

const hostPage = '<!doctype html><meta charset="utf-8"><iframe src="http://localhost:4173/?preview=1" style="width:390px;height:800px;border:0"></iframe>';

test('refuses to render inside a frame owned by another site', async ({ page }) => {
  await page.route('http://127.0.0.1:9999/**', (route) => route.fulfill({ contentType: 'text/html', body: hostPage }));

  await page.goto('http://127.0.0.1:9999/trap');
  const framed = page.frameLocator('iframe');

  await expect(framed.locator('.frame-guard')).toBeVisible({ timeout: 20_000 });
  await expect(framed.getByRole('navigation')).toHaveCount(0);
});

test('still renders inside a same-origin frame', async ({ page }) => {
  await page.route('http://localhost:4173/frame-host', (route) => route.fulfill({ contentType: 'text/html', body: hostPage }));

  await page.goto('/frame-host');
  const framed = page.frameLocator('iframe');

  await expect(framed.getByRole('navigation')).toBeVisible({ timeout: 20_000 });
  await expect(framed.locator('.frame-guard')).toHaveCount(0);
});
