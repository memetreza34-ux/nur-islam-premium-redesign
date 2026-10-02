import type { PremiumSettings } from './premiumLocalService';

export function applyHomePreferences(home: HTMLElement, settings: PremiumSettings, host: HTMLElement | null) {
  home.classList.add('premium-home--personalized');
  const fixed = ['.brand-bar', '.home-standfirst', '.home-prayer-focus, .prayer-hero', '.home-prayer-note'];
  fixed.forEach((selector, index) => {
    home.querySelectorAll<HTMLElement>(selector).forEach(node => { node.style.order = String(index); });
  });
  if (host) host.style.order = '100';
  settings.homeOrder.forEach((section, index) => {
    const node = home.querySelector<HTMLElement>(`:scope > [data-home-section="${section}"]`);
    if (!node) return;
    node.style.order = String(index + fixed.length);
    node.hidden = settings.hiddenHomeSections.includes(section);
  });
}
