import { motion, useReducedMotion } from 'motion/react';
import { useId } from 'react';
import { NurMark, PremiumImage } from '../shared/PremiumVisuals';

export function SplashScreen() {
  const reduceMotion = useReducedMotion();
  const id = useId().replace(/:/g, '');
  const cut = `entry-cut-${id}`;
  const metal = `entry-metal-${id}`;

  return (
    <motion.main
      className="reference-splash"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduceMotion ? 0 : .3 }}
      aria-label="Nur Islam wird geladen"
    >
      <div className="entry-scene" aria-hidden="true">
        <svg width="0" height="0"><defs><clipPath id={cut} clipPathUnits="objectBoundingBox"><path d="M0 1V.32C0 .16 .23 .06 .5 0C.77 .06 1 .16 1 .32V1Z" /></clipPath></defs></svg>
        <div className="entry-canopy" />
        <div className="entry-portal">
          <div className="entry-window" style={{ clipPath: `url(#${cut})` }}>
            <div className="entry-inner-light" />
            <div className="entry-brand">
              <PremiumImage src="/premium-assets/high-res-objects/nur-logo-mosque-3d-v1.webp" className="entry-emblem" priority fallback={<NurMark />} />
              <span className="entry-wordmark">Nur Islam</span>
            </div>
            <div className="entry-door entry-door--left" /><div className="entry-door entry-door--right" />
            <div className="entry-seam" />
          </div>
          <svg className="entry-arch" viewBox="0 0 300 620" preserveAspectRatio="none">
            <defs><linearGradient id={metal} x1="0" y1="0" x2="1" y2=".2"><stop stopColor="#695631" /><stop offset=".2" stopColor="#bd9b58" /><stop offset=".48" stopColor="#fae4ac" /><stop offset=".65" stopColor="#bd9b58" /><stop offset="1" stopColor="#59492c" /></linearGradient></defs>
            <path className="entry-arch__outer" d="M-7 620V198C-7 94 68 29 150-7C232 29 307 94 307 198V620" />
            <path className="entry-arch__body" stroke={`url(#${metal})`} d="M0 620V198C0 99 69 37 150 0C231 37 300 99 300 198V620" />
            <path className="entry-arch__bevel" d="M5 620V198C5 101 73 42 150 5C227 42 295 101 295 198V620" />
            <path className="entry-arch__trace" pathLength="1" d="M0 620V198C0 99 69 37 150 0C231 37 300 99 300 198V620" />
          </svg>
        </div>
        <div className="entry-threshold" /><div className="entry-floor-light" />
      </div>
      <span className="sr-only" role="status">App wird geöffnet</span>
    </motion.main>
  );
}
