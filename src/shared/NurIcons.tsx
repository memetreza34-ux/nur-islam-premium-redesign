import type { CSSProperties } from 'react';

/**
 * The app's own icon set for the shortcut tiles.
 *
 * Two icon sources already existed and neither fits a 24px tile. The rendered
 * WebP objects under premium-assets are illustrations: at tile size they turn
 * to mush and read as stock 3D art rather than as part of the interface. The
 * SVG objects in PremiumVisuals are hero-scale drawings with gradients and
 * dozens of nodes, built to fill a card, not a 40px square.
 *
 * These are drawn for the size they are used at: one weight, one geometry,
 * built from the vocabulary the app already uses — the pointed arch, the
 * eight-fold star, the crescent. Stroke is 1.75 to match every Lucide glyph
 * beside them, and colour comes from currentColor so the tiles keep tinting
 * them gold.
 */

type IconProps = {
  size?: number;
  className?: string;
  style?: CSSProperties;
};

function Glyph({ size = 24, className = '', style, children }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      className={`nur-icon ${className}`.trim()}
      style={style}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

/** Closed Quran seen from the front, with a star medallion on the cover. */
export function NurQuranIcon(props: IconProps) {
  return (
    <Glyph {...props}>
      <path d="M4.5 5.5A2 2 0 0 1 6.5 3.5h13v17h-13a2 2 0 0 0-2 2z" />
      <path d="M8 3.5v17" />
      <path d="M13.75 8.25 15 10.75l2.5 1.25-2.5 1.25-1.25 2.5-1.25-2.5L10 12l2.5-1.25z" />
    </Glyph>
  );
}

/** Mihrab: the pointed prayer niche, with its hanging lamp. */
export function NurMihrabIcon(props: IconProps) {
  return (
    <Glyph {...props}>
      <path d="M6 20.5v-8.25C6 8.5 8.5 5.25 12 3.5c3.5 1.75 6 5 6 8.75v8.25" />
      <path d="M12 8.5v2" />
      <circle cx="12" cy="13" r="2.25" />
      <path d="M3.5 20.5h17" />
    </Glyph>
  );
}

/** Tasbih: the bead ring with its tassel. */
export function NurTasbihIcon(props: IconProps) {
  return (
    <Glyph {...props}>
      {/* Beads drawn as round dash caps rather than separate circles: placed
          circles either merged into the ring beneath them or left flower-like
          gaps, and dashes keep even spacing at any size. */}
      <circle cx="12" cy="10" r="6.5" strokeWidth="2.4" strokeDasharray="0.01 3.6" />
      <path d="M12 16.5v1.75" strokeWidth="1.5" />
      <circle cx="12" cy="19.75" r="1.4" fill="currentColor" stroke="none" />
    </Glyph>
  );
}

/** Compass rose pointing to the Kaaba. */
export function NurQiblaIcon(props: IconProps) {
  return (
    <Glyph {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m15.25 8.75-1.5 4.5-4.5 1.5 1.5-4.5z" />
      <path d="M12 3.5v1.75M12 18.75v1.75M3.5 12h1.75M18.75 12h1.75" />
    </Glyph>
  );
}

/** Two palms cupped in dua beneath the crescent. */
export function NurDuaIcon(props: IconProps) {
  return (
    <Glyph {...props}>
      <path d="M4.75 13.25c0 3.6 3.25 6.5 7.25 6.5s7.25-2.9 7.25-6.5" />
      <path d="M4.75 13.25v-2.5a1.6 1.6 0 0 1 3.2 0v1.75" />
      <path d="M19.25 13.25v-2.5a1.6 1.6 0 0 0-3.2 0v1.75" />
      <path d="M12 19.75v-3.25" />
      <path d="M13.6 3.5a2.6 2.6 0 1 0 0 4.9 3.2 3.2 0 0 1 0-4.9z" />
    </Glyph>
  );
}

/** Eight-fold rosette: two squares turned against each other. */
export function NurRosetteIcon(props: IconProps) {
  return (
    <Glyph {...props}>
      <path d="M12 3.25 20.75 12 12 20.75 3.25 12z" />
      <path d="M5.85 5.85h12.3v12.3H5.85z" />
      <circle cx="12" cy="12" r="2.5" />
    </Glyph>
  );
}

/** Mosque: dome between two minarets. */
export function NurMosqueIcon(props: IconProps) {
  return (
    <Glyph {...props}>
      <path d="M7.5 20.5v-5.75a4.5 4.5 0 0 1 9 0v5.75" />
      <path d="M12 10.25V8.5" />
      <path d="M4.5 20.5v-8.75M19.5 20.5v-8.75" />
      <path d="M4.5 11.75 4.5 9.5M19.5 11.75V9.5" />
      <path d="M3 20.5h18" />
      <path d="M10.75 20.5v-3a1.25 1.25 0 0 1 2.5 0v3" />
    </Glyph>
  );
}

/** Hijri calendar: a month sheet carrying a crescent. */
export function NurCalendarIcon(props: IconProps) {
  return (
    <Glyph {...props}>
      <rect x="3.5" y="5.25" width="17" height="15.25" rx="2.5" />
      <path d="M3.5 10h17" />
      <path d="M8 3.5v3.5M16 3.5v3.5" />
      <path d="M14.25 12.5a3.25 3.25 0 1 0 0 6 4 4 0 0 1 0-6z" />
    </Glyph>
  );
}

/** Bookmark holding a saved place. */
export function NurBookmarkIcon(props: IconProps) {
  return (
    <Glyph {...props}>
      <path d="M6 5.5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v15l-6-3.75L6 20.5z" />
      <path d="m12 8 .9 1.85 1.85.9-1.85.9-.9 1.85-.9-1.85-1.85-.9 1.85-.9z" />
    </Glyph>
  );
}

/** Prayer times: the sun crossing the horizon. */
export function NurPrayerTimesIcon(props: IconProps) {
  return (
    <Glyph {...props}>
      <path d="M3.5 17.5h17" />
      <path d="M7.5 17.5a4.5 4.5 0 0 1 9 0" />
      <path d="M12 4.5v2M5.75 7.25l1.4 1.4M18.25 7.25l-1.4 1.4M3.5 13h1.75M18.75 13h1.75" />
      <path d="M6.5 20.5h11" />
    </Glyph>
  );
}

/** Quiz: an open book with a spark over it. */
export function NurQuizIcon(props: IconProps) {
  return (
    <Glyph {...props}>
      <path d="M12 10.5v9.75" />
      <path d="M12 10.5c-1.5-1.4-3.5-2.1-5.75-2.1H3.5v9.6h2.75c2.25 0 4.25.7 5.75 2.15" />
      <path d="M12 10.5c1.5-1.4 3.5-2.1 5.75-2.1h2.75v9.6h-2.75c-2.25 0-4.25.7-5.75 2.15" />
      <path d="m12 2.25 1.05 2.2 2.2 1.05-2.2 1.05L12 8.75l-1.05-2.2-2.2-1.05 2.2-1.05z" />
    </Glyph>
  );
}

/** Assistant: an answer offered under the Nur star. */
export function NurAssistantIcon(props: IconProps) {
  return (
    <Glyph {...props}>
      <path d="M4.5 7a3 3 0 0 1 3-3h9a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3h-4.75L7 20v-4h-.5a2 2 0 0 1-2-2z" />
      <path d="m12 6.75 1.15 2.35 2.35 1.15-2.35 1.15L12 13.75l-1.15-2.35-2.35-1.15 2.35-1.15z" />
    </Glyph>
  );
}

/** Shared shape for the set, so callers can hold one in a data table. */
export type NurIcon = (props: IconProps) => React.JSX.Element;
