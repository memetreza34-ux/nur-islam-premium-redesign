import { motion } from 'motion/react';
import { MosqueScene, NurMark, PremiumImage } from './PremiumVisuals';

export function SplashScreen() {
  return (
    <motion.main
      className="reference-splash"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.015 }}
      transition={{ duration: .38, ease: [0.22, 1, 0.36, 1] }}
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
        initial={{ opacity: 0, y: 12, scale: .96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: .08, duration: .55, ease: [0.22, 1, 0.36, 1] }}
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
