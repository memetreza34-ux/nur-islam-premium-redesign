import type { CSSProperties, ReactNode } from 'react';
import { resolveAppPath } from '../app/appPaths';

export function ScreenBanner({ art, className = '', children }: { art: string; className?: string; children: ReactNode }) {
  return <header className={`reference-screen-header reference-screen-header--banner ${className}`.trim()} style={{ '--screen-banner-art': `url("${resolveAppPath(`/premium-assets/high-res-objects/${art}`)}")` } as CSSProperties}>
    {children}
  </header>;
}
