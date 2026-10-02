import { describe, expect, it } from 'vitest';
import { FREE_WIDGETS, SUBSCRIPTION_WIDGETS } from './premiumLocalService';
import { isWidgetId, WIDGET_ACTIONS } from './widgetActions';

describe('widget actions', () => {
  it.each([...FREE_WIDGETS, ...SUBSCRIPTION_WIDGETS])('%s has a named action and destination', (id) => {
    expect(isWidgetId(id)).toBe(true);
    expect(WIDGET_ACTIONS[id].label.length).toBeGreaterThan(8);
    expect(WIDGET_ACTIONS[id].destination).toBeTruthy();
  });
  it.each([null, undefined, {}, 'unknown', 'constructor', '__proto__'])('rejects invalid widget ids: %s', (id) => {
    expect(isWidgetId(id)).toBe(false);
  });
  it('keeps functional destinations distinct from purchase and personalization', () => {
    expect(WIDGET_ACTIONS.prayer.destination).toBe('prayer');
    expect(WIDGET_ACTIONS.quran.destination).toBe('reader');
    expect(WIDGET_ACTIONS['daily-inspiration'].destination).toBe('reader');
    expect(WIDGET_ACTIONS.friday.destination).toBe('legacy:jumuah');
    expect(WIDGET_ACTIONS.reminders.destination).toBe('design');
    expect(WIDGET_ACTIONS.favorites.destination).toBe('collections');
  });
});
