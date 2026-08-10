import { motion, useReducedMotion } from 'motion/react';
import { MosqueScene, NurMark, PremiumImage } from '../shared/PremiumVisuals';

export function SplashScreen() {
  const reduceMotion = useReducedMotion();
  const transition = { duration: reduceMotion ? 0 : .28, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <motion.main
      className="reference-splash"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: reduceMotion ? 1 : 1.008 }}
      transition={transition}
      aria-label="Nur Islam wird geladen"
    >
      <div className="reference-splash__halo" />
      <PremiumImage
        src="/premium-assets/high-res-objects/mosque-gold-v2.webp"
        className="reference-splash__mosque"
        fallback={<MosqueScene />}
        priority
      />
      <motion.div
        className="reference-splash__brand"
        initial={{ opacity: 1, y: reduceMotion ? 0 : 6, scale: reduceMotion ? 1 : .99 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={transition}
      >
        <PremiumImage
          src="/premium-assets/high-res-objects/nur-logo-emblem-v2.webp"
          className="reference-splash__mark"
          fallback={<NurMark />}
          priority
        />
        <span className="overline">Dein spiritueller Begleiter</span>
        <h1>Nur</h1>
        <p>Islam bewusst leben.</p>
      </motion.div>
      <div className="reference-splash__loader" aria-hidden="true"><span /></div>
    </motion.main>
  );
}
