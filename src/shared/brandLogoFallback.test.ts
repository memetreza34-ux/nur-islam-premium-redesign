import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { BRAND_LOGO_FALLBACK, BRAND_LOGO_SOURCE_SHA256 } from './brandLogoFallback';
import { NurMark } from './PremiumVisuals';

describe('selected 3D brand fallback', () => {
  it('stays tied to the selected full-size logo', () => {
    const source = readFileSync('public/premium-assets/high-res-objects/nur-logo-mosque-3d-v1.webp');
    expect(createHash('sha256').update(source).digest('hex')).toBe(BRAND_LOGO_SOURCE_SHA256);
  });

  it('renders a valid bundled image without a network request', () => {
    const image = Buffer.from(BRAND_LOGO_FALLBACK.split(',')[1], 'base64');
    expect(image.subarray(0, 4).toString()).toBe('RIFF');
    expect(image.subarray(8, 12).toString()).toBe('WEBP');
    expect(image.length).toBeLessThan(1024);
    const html = renderToStaticMarkup(createElement(NurMark));
    expect(html).toContain(`href="${BRAND_LOGO_FALLBACK}"`);
    expect(html).not.toContain('href="/');
  });
});
