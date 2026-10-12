import { motion, useReducedMotion } from 'motion/react';
import { useEffect, useState } from 'react';
import { getDailyAyah } from '../data/dailyAyah';
import { getNextPrayer, PRAYER_SCHEDULE_META } from '../services/prayerSchedule';
import { PremiumImage } from '../shared/PremiumVisuals';
import { getPrayerBackdrop } from '../shared/prayerBackdrops';

export function SplashScreen() {
  const reduceMotion = useReducedMotion();
  const ease = [0.16, 1, 0.3, 1] as const;
  const [now, setNow] = useState(() => new Date());
  const nextPrayer = getNextPrayer(now);
  const backdrop = nextPrayer && nextPrayer.prayer.id !== 'sunrise' ? getPrayerBackdrop(nextPrayer.prayer.id) : undefined;
  const ayah = getDailyAyah(now, PRAYER_SCHEDULE_META.timezone);

  useEffect(() => {
    const refresh = () => setNow(new Date());
    const timer = window.setInterval(refresh, 30000);
    window.addEventListener('nur:prayer-times-updated', refresh);
    document.addEventListener('visibilitychange', refresh);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener('nur:prayer-times-updated', refresh);
      document.removeEventListener('visibilitychange', refresh);
    };
  }, []);

  return (
    <motion.main
      className="reference-splash"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduceMotion ? 0 : .32, ease }}
      aria-label="Nur Islam wird geladen"
    >
      {backdrop && <PremiumImage key={backdrop} src={backdrop} className="reference-splash__prayer-art" priority fallback={null} />}
      <header className="reference-splash__prayer" data-testid="splash-prayer">
        <span className="reference-splash__eyebrow">Nächstes Gebet{nextPrayer?.tomorrow ? ' · morgen' : ''}</span>
        {nextPrayer ? <>
          <p className="reference-splash__time"><span>{nextPrayer.prayer.label}</span><strong>{nextPrayer.prayer.time}</strong></p>
          <p className="reference-splash__location">{PRAYER_SCHEDULE_META.locationLabel}{PRAYER_SCHEDULE_META.locationSource === 'default' ? ' · Standardstandort' : ''}</p>
          {PRAYER_SCHEDULE_META.source === 'cache' && <small>Gespeicherte Gebetszeiten</small>}
        </> : <p className="reference-splash__location">Gebetszeiten noch nicht verfügbar</p>}
      </header>
      <figure className="reference-splash__ayah" data-testid="splash-ayah">
        <span className="reference-splash__eyebrow">Ayah des Tages</span>
        <p className="reference-splash__arabic" lang="ar" dir="rtl">{ayah.arabic}</p>
        <blockquote>{ayah.meaning}</blockquote>
        <figcaption><span>Sinngemäße Bedeutung</span>{ayah.surahName} · {ayah.source}</figcaption>
      </figure>
    </motion.main>
  );
}
