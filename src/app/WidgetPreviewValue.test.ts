import { describe, expect, it } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { splitWidgetValue, WidgetPreviewValue } from './WidgetPreviewValue';

describe('widget value hierarchy', () => {
  it('separates the Hijri day without altering month or year', () => {
    expect(splitWidgetValue('islamic-date', '2. Rabiʻ II 1448 AH')).toEqual({ number: '2', label: 'Rabiʻ II 1448 AH' });
  });
  it('keeps zero counts visible', () => {
    expect(splitWidgetValue('dhikr', '0 Dhikr')).toEqual({ number: '0', label: 'Dhikr' });
  });
  it('preserves progress and its denominator', () => {
    expect(splitWidgetValue('routine', '3/5 erledigt')).toEqual({ number: '3/5', label: 'erledigt' });
    expect(splitWidgetValue('weekly-prayers', '12 von 35 Gebeten')).toEqual({ number: '12', label: 'von 35 Gebeten' });
  });
  it('preserves empty states and Quran references', () => {
    expect(splitWidgetValue('routine', 'Noch keine Routine')).toBeNull();
    expect(splitWidgetValue('quran', 'Sure 1 · Ayah 1')).toBeNull();
    expect(splitWidgetValue('islamic-date', 'Heute im Hijri-Kalender')).toBeNull();
  });
  it('retains the complete accessible label for separated values', () => {
    const html = renderToStaticMarkup(createElement(WidgetPreviewValue, { id: 'favorites', value: '4 gespeicherte Inhalte' }));
    expect(html).toContain('aria-label="4 gespeicherte Inhalte"');
    expect(html).toContain('<b aria-hidden="true">4</b>');
  });
  it('renders empty-state text without inventing a count', () => {
    expect(renderToStaticMarkup(createElement(WidgetPreviewValue, { id: 'routine', value: 'Noch keine Routine' }))).toBe('<strong>Noch keine Routine</strong>');
  });
});
