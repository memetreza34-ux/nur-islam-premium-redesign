import { useMemo, useState } from 'react';
import {
  ChevronLeft,
  CircleCheck,
  Compass,
  LocateFixed,
  MapPin,
  Navigation,
  Settings,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { PremiumImage, QiblaObject } from './PremiumVisuals';

export function QiblaScreen({ onBack }: { onBack: () => void }) {
  const [calibrated, setCalibrated] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const direction = useMemo(() => 136, []);

  const flash = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2100);
  };

  return (
    <motion.main className="screen reference-qibla-screen" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <header className="reference-screen-header">
        <button className="icon-button" onClick={onBack} aria-label="Zurück"><ChevronLeft size={20} /></button>
        <div><span className="overline">Nur Islam</span><h1>Qibla</h1></div>
        <button className="icon-button" onClick={() => flash('Qibla-Einstellungen geöffnet')}><Settings size={20} /></button>
      </header>

      <section className="reference-qibla-stage">
        <div className="reference-qibla-stage__halo" />
        <PremiumImage src="/premium-assets/high-res-objects/qibla-compass.png" className="reference-qibla-stage__compass" fallback={<QiblaObject />} />
        <span className="reference-qibla-stage__needle" style={{ transform: `translateX(-50%) rotate(${direction}deg)` }}><Navigation size={29} fill="currentColor" /></span>
        <div className="reference-qibla-stage__copy">
          <span className="overline">Richtung zur Kaaba</span>
          <h2>{direction}° Südost</h2>
          <p>Die Kaaba liegt etwa 3.900 km von Berlin entfernt.</p>
        </div>
      </section>

      <section className="reference-qibla-location">
        <span className="reference-qibla-location__icon"><MapPin size={20} /></span>
        <span><small>Aktueller Standort</small><strong>Berlin, Deutschland</strong><em>Standortgenauigkeit: hoch</em></span>
        <button onClick={() => flash('Standort aktualisiert')}><LocateFixed size={18} /></button>
      </section>

      <section className="reference-qibla-calibration">
        <div><span className="overline">Kompass</span><h3>{calibrated ? 'Kompass kalibriert' : 'Kalibrierung empfohlen'}</h3><p>{calibrated ? 'Die Qibla-Richtung ist bereit.' : 'Bewege dein Gerät in einer liegenden Acht, damit die Richtung genauer wird.'}</p></div>
        <button className={calibrated ? 'reference-calibration-button is-done' : 'reference-calibration-button'} onClick={() => { setCalibrated(true); flash('Kompass kalibriert'); }}>{calibrated ? <CircleCheck size={17} /> : <Compass size={17} />}{calibrated ? 'Kalibriert' : 'Kalibrieren'}</button>
      </section>

      <section className="reference-qibla-tip">
        <Compass size={20} />
        <span><strong>Für ein genaues Ergebnis</strong><small>Halte das Gerät flach und fern von magnetischen Gegenständen.</small></span>
      </section>

      <AnimatePresence>{toast ? <motion.div className="toast" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}><CircleCheck size={18} /> {toast}</motion.div> : null}</AnimatePresence>
    </motion.main>
  );
}
