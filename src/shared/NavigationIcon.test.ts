import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { NavigationIcon, type NavigationIconName } from './NavigationIcon';

describe('Navigation icon family', () => {
  const names: NavigationIconName[] = ['home', 'prayer', 'quran', 'learn', 'profile'];
  it.each(names)('%s has consistent geometry and leaves the button label accessible', (name) => {
    const html = renderToStaticMarkup(createElement(NavigationIcon, { name }));
    expect(html).toContain('viewBox="0 0 24 24"');
    expect(html).toContain('aria-hidden="true"');
    expect(html).toContain('focusable="false"');
    expect(html).toContain('fill-opacity=');
    expect(html).toContain(`data-navigation-icon="${name}"`);
    expect(html).toContain('nur-navigation-icon__surface');
    expect(html).toContain('stroke-width="1.75"');
    expect(html).toContain('width="28" height="28"');
    expect(html).not.toContain('<image');
  });
  it('gives each destination a distinct symbol', () => {
    expect(new Set(names.map(name => renderToStaticMarkup(createElement(NavigationIcon, { name })))).size).toBe(5);
  });
});
