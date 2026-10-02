import { motion, useReducedMotion } from 'motion/react';
import { MosqueScene, NurMark, PremiumImage } from '../shared/PremiumVisuals';

export function SplashScreen() {
  const reduceMotion = useReducedMotion();
  const ease = [0.16, 1, 0.3, 1] as const;
  const exitTransition = { duration: reduceMotion ? 0 : .32, ease };

  return (
    <motion.main
      className="reference-splash"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: reduceMotion ? 1 : 1.008 }}
      transition={exitTransition}
      aria-label="Nur Islam wird geladen"
    >
      <motion.div
        className="reference-splash__halo"
        initial={{ opacity: reduceMotion ? 1 : 0, scale: reduceMotion ? 1 : .72 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: reduceMotion ? 0 : 1.1, ease }}
        aria-hidden="true"
      />
      <motion.div
        className="reference-splash__dawn"
        initial={{ opacity: reduceMotion ? 1 : 0, scaleX: reduceMotion ? 1 : .55 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ duration: reduceMotion ? 0 : .9, delay: reduceMotion ? 0 : .2, ease }}
        aria-hidden="true"
      />
      <motion.div
        className="reference-splash__mosque"
        initial={{ opacity: reduceMotion ? 1 : 0, y: reduceMotion ? 0 : 54, scale: reduceMotion ? 1 : .94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: reduceMotion ? 0 : 1.05, delay: reduceMotion ? 0 : .12, ease }}
        aria-hidden="true"
      >
        <PremiumImage
          src="/premium-assets/high-res-objects/splash-mosque-v1.webp"
          className="reference-splash__mosque-image"
          fallback={<MosqueScene />}
          priority
        />
      </motion.div>
      <motion.div
        className="reference-splash__brand"
        initial={{ opacity: reduceMotion ? 1 : 0, y: reduceMotion ? 0 : -14 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: reduceMotion ? 0 : .72, delay: reduceMotion ? 0 : .18, ease }}
      >
        <motion.div
          className="reference-splash__mark-stage"
          initial={{ scale: reduceMotion ? 1 : .82, rotate: reduceMotion ? 0 : -6 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: reduceMotion ? 0 : .82, delay: reduceMotion ? 0 : .22, ease }}
        >
          <PremiumImage
            src="/premium-assets/high-res-objects/nur-logo-emblem-v3.svg"
            className="reference-splash__mark"
            fallback={<NurMark />}
            priority
          />
        </motion.div>
        <motion.div
          className="reference-splash__copy"
          initial={{ opacity: reduceMotion ? 1 : 0, y: reduceMotion ? 0 : 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : .65, delay: reduceMotion ? 0 : .42, ease }}
        >
          <span className="overline">Dein spiritueller Begleiter</span>
          <h1>Nur</h1>
          <p>Islam bewusst leben.</p>
        </motion.div>
      </motion.div>
      <motion.div
        className="reference-splash__loader"
        initial={{ opacity: reduceMotion ? 1 : 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: reduceMotion ? 0 : .3, delay: reduceMotion ? 0 : .55 }}
        aria-hidden="true"
      >
        <motion.span
          initial={{ scaleX: reduceMotion ? 1 : 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: reduceMotion ? 0 : .82, delay: reduceMotion ? 0 : .58, ease }}
        />
      </motion.div>
    </motion.main>
  );
}
