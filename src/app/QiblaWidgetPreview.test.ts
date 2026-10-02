import { describe, expect, it } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { getQiblaWidgetReading, QiblaWidgetPreview } from './QiblaWidgetPreview';
import { KAABA } from '../services/qiblaGeometry';

const berlin = { latitude: 52.52, longitude: 13.405, label: 'Berlin, Deutschland', source: 'default' as const };

describe('Qibla widget', () => {
  it('calculates direction and distance from its actual location', () => {
    const reading = getQiblaWidgetReading(berlin);
    expect(reading.bearing).toBeCloseTo(136.68, 1);
    expect(reading.distance).toBeGreaterThan(4100);
    expect(reading.distance).toBeLessThan(4200);
    expect(reading.direction).toBe('Südost');
    expect(reading.source).toBe('Standardstandort');
  });
  it('uses a different saved location without claiming live GPS', () => {
    const reading = getQiblaWidgetReading({ latitude: 40.71, longitude: -74, label: 'New York', source: 'device' });
    expect(reading.bearing).toBeCloseTo(58.48, 1);
    expect(reading.source).toBe('Gespeicherter Standort');
  });
  it('shows a truthful static compass with no decorative image', () => {
    const html = renderToStaticMarkup(createElement(QiblaWidgetPreview, { location: berlin }));
    expect(html).toContain('Nordorientiert · Sensor aus');
    expect(html).toContain('Qibla 137 Grad ab geografisch Nord. Statische Anzeige.');
    expect(html).toContain('Berlin, Deutschland');
    expect(html).toContain('Luftlinie zur Kaaba');
    expect(html).not.toContain('<img');
    expect(html).toContain('data-bearing="136.');
  });
  it('does not display an arbitrary bearing at the Kaaba itself', () => {
    const html = renderToStaticMarkup(createElement(QiblaWidgetPreview, { location: { ...KAABA, label: 'Kaaba', source: 'device' } }));
    expect(html).toContain('In unmittelbarer Nähe');
    expect(html).not.toContain('data-bearing');
  });
});
