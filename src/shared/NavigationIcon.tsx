import type { ReactNode } from 'react';

export type NavigationIconName = 'home' | 'prayer' | 'quran' | 'learn' | 'profile';

const artwork: Record<NavigationIconName, ReactNode> = {
  home: <>
    <path className="nur-navigation-icon__surface" d="M4 10 12 3l8 7v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z" fill="currentColor" fillOpacity=".22" stroke="none" />
    <path d="m2.5 10 8-6.7a2.35 2.35 0 0 1 3 0l8 6.7M4 9v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9" />
    <path d="M9 21v-5c0-1.6 1.8-2.4 3-3.5 1.2 1.1 3 1.9 3 3.5v5" />
  </>,
  prayer: <>
    <circle className="nur-navigation-icon__surface" cx="12" cy="12" r="9" fill="currentColor" fillOpacity=".22" />
    <path d="M12 5v.7M19 12h-.7M12 19v-.7M5 12h.7" opacity=".6" />
    <path d="M12 8v4l3 2" />
    <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
  </>,
  quran: <>
    <path className="nur-navigation-icon__surface" d="M6 3h13v15H6a2 2 0 0 0-2 2V5a2 2 0 0 1 2-2Z" fill="currentColor" fillOpacity=".22" />
    <path d="M19 18v3H6a2 2 0 0 1 0-4M7 3v14" />
    <path d="m13 6 3 4-3 4-3-4Z" />
    <path d="M9 21v1.5l1.5-1 1.5 1V21" strokeWidth="1.3" />
  </>,
  learn: <>
    <path className="nur-navigation-icon__surface" d="m2 8 10-5 10 5-10 5Z" fill="currentColor" fillOpacity=".22" />
    <path d="M6 10v6c3.7 2.7 8.3 2.7 12 0v-6M22 8v8" />
    <path d="M21 18h2" />
  </>,
  profile: <>
    <rect className="nur-navigation-icon__surface" x="3" y="3" width="7" height="7" rx="2" fill="currentColor" fillOpacity=".22" />
    <path d="m17.5 2 4.5 4.5-4.5 4.5L13 6.5Z" />
    <rect x="3" y="14" width="7" height="7" rx="2" />
    <rect className="nur-navigation-icon__surface" x="14" y="14" width="7" height="7" rx="2" fill="currentColor" fillOpacity=".22" />
  </>,
};

export function NavigationIcon({ name }: { name: NavigationIconName }) {
  return <svg className="nur-navigation-icon" data-navigation-icon={name} viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">{artwork[name]}</svg>;
}
