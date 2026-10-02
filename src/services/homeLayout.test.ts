import { describe, expect, it } from 'vitest';
import { applyHomePreferences } from './homeLayout';
import { PREMIUM_HOME_SECTIONS, type PremiumSettings } from './premiumLocalService';

function fixture() {
  const home = document.createElement('main');
  home.innerHTML = '<header class="brand-bar"></header><section class="home-standfirst"></section><section class="home-prayer-focus"></section><button class="home-prayer-note"></button>';
  for (const id of PREMIUM_HOME_SECTIONS) {
    const section = document.createElement('section');
    section.dataset.homeSection = id;
    home.append(section);
  }
  const host = document.createElement('aside');
  home.append(host);
  const settings: PremiumSettings = { accent: 'classic', widgets: [], homeOrder: [...PREMIUM_HOME_SECTIONS], hiddenHomeSections: [] };
  return { home, host, settings };
}

describe('Start section customization', () => {
  it('orders the source note after the timetable and before custom sections', () => {
    const { home, host, settings } = fixture();
    applyHomePreferences(home, settings, host);
    expect([...home.children].map(node => (node as HTMLElement).style.order)).toEqual(['0', '1', '2', '3', '4', '5', '6', '7', '8', '100']);
  });
  it.each(PREMIUM_HOME_SECTIONS)('can hide and restore %s independently', section => {
    const { home, host, settings } = fixture();
    applyHomePreferences(home, { ...settings, hiddenHomeSections: [section] }, host);
    expect([...home.querySelectorAll<HTMLElement>('[hidden]')].map(node => node.dataset.homeSection)).toEqual([section]);
    applyHomePreferences(home, settings, host);
    expect(home.querySelector('[hidden]')).toBeNull();
  });
  it('honors saved ordering including the standalone Quran resume card', () => {
    const { home, host, settings } = fixture();
    settings.homeOrder.reverse();
    applyHomePreferences(home, settings, host);
    settings.homeOrder.forEach((section, index) => {
      expect(home.querySelector<HTMLElement>(`[data-home-section="${section}"]`)?.style.order).toBe(String(index + 4));
    });
  });
  it('keeps the unavailable timetable in the same fixed position', () => {
    const { home, settings } = fixture();
    home.querySelector('.home-prayer-focus')!.className = 'prayer-hero';
    applyHomePreferences(home, settings, null);
    expect(home.querySelector<HTMLElement>('.prayer-hero')?.style.order).toBe('2');
  });
});
