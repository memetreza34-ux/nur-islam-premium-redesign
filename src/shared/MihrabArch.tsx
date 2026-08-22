import { useId, type ReactNode } from 'react';

const ARCH_OUTLINE = 'M1.5,210 L1.5,92 C1.5,39 65,26 171.5,1.5 C278,26 341.5,39 341.5,92 L341.5,210';

export type MihrabArchProps = {
  /** Small caps line above the title, e.g. "Nächstes Gebet". */
  overline: string;
  title: string;
  titleArabic?: string;
  /** The one thing this screen is about — a time, a count, or a name. */
  value: string;
  /**
   * How the value is set. `num` is tabular Inter for anything read against a
   * clock or down a column; `display` is Cormorant for a name.
   */
  valueAs?: 'num' | 'display';
  /** Pill under the value, e.g. "in 12 Minuten". */
  meta?: ReactNode;
  /** 0–100. The arch line itself is the progress bar. */
  progress: number;
  height?: number;
  className?: string;
  /** Mosque silhouette closing the arch off at its base. */
  footer?: ReactNode;
  /** Ambient light points behind the arch. Off by default. */
  sky?: boolean;
};

/**
 * The mihrab arch: one shape doing three jobs — it frames the focus content,
 * it measures progress along its own outline, and it recurs across screens.
 * `pathLength="100"` makes the dash offset a literal percentage, so the fill
 * is exact at any width.
 */
export function MihrabArch({
  overline,
  title,
  titleArabic,
  value,
  valueAs = 'num',
  meta,
  progress,
  height = 210,
  className,
  footer,
  sky = false,
}: MihrabArchProps) {
  const id = useId();
  const fillId = `arch-fill-${id}`;
  const strokeId = `arch-stroke-${id}`;
  const clamped = Math.max(0, Math.min(100, progress));

  return (
    <div className={className ? `ds-arch ${className}` : 'ds-arch'} style={{ height }}>
      {sky ? (
        <div className="ds-sky" aria-hidden="true">
          <i /><i /><i /><i /><i />
        </div>
      ) : null}
      <svg className="ds-arch__svg" viewBox="0 0 343 210" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id={fillId} x1="171" y1="0" x2="171" y2="210" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#0d4634" />
            <stop offset="1" stopColor="#04231c" />
          </linearGradient>
          <linearGradient id={strokeId} x1="0" y1="210" x2="343" y2="20" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#8d6d39" />
            <stop offset=".5" stopColor="#e2bf77" />
            <stop offset="1" stopColor="#f2d79a" />
          </linearGradient>
        </defs>
        <path d={`${ARCH_OUTLINE} Z`} fill={`url(#${fillId})`} />
        <path className="ds-arch__track" d={ARCH_OUTLINE} />
        <path
          className="ds-arch__progress"
          d={ARCH_OUTLINE}
          pathLength="100"
          stroke={`url(#${strokeId})`}
          strokeDasharray={`${clamped} 100`}
        />
      </svg>
      {footer ? <div className="ds-arch__footer" aria-hidden="true">{footer}</div> : null}
      <div className="ds-arch__content">
        <span className="ds-arch__overline">{overline}</span>
        <span className="ds-arch__name">
          {title}
          {titleArabic ? <span className="ds-arch__name-arabic"> {titleArabic}</span> : null}
        </span>
        <span className={valueAs === 'display' ? 'ds-arch__value ds-arch__value--display' : 'ds-arch__value ds-num'}>{value}</span>
        {meta ? <span className="ds-arch__meta ds-num">{meta}</span> : null}
      </div>
    </div>
  );
}
