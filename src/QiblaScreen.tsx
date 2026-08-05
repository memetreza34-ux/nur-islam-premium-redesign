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

type Coordinates = {
  latitude: number;
  longitude: number;
};

const KAABA: Coordinates = { latitude: 21.4225, longitude: 39.8262 };
const BERLIN: Coordinates = { latitude: 52.52, longitude: 13.405 };

function toRadians(value: number) {
  return value * Math.PI / 180;
}

function toDegrees(value: number) {
  return value * 180 / Math.PI;
}

function calculateBearing(from: Coordinates, to: Coordinates) {
  const latitudeOne = toRadians(from.latitude);
  const latitudeTwo = toRadians(to.latitude);
  const longitudeDifference = toRadians(to.longitude - from.longitude);
  const y = Math.sin(longitudeDifference) * Math.cos(latitudeTwo);
  const x = Math.cos(latitudeOne) * Math.sin(latitudeTwo) - Math.sin(latitudeOne) * Math.cos(latitudeTwo) * Math.cos(longitudeDifference);
  return (toDegrees(Math.atan2(y, x)) + 360) % 360;
}

function calculateDistance(from: Coordinates, to: Coordinates) {
  const earthRadius = 6371;
  const latitudeDifference = toRadians(to.latitude - from.latitude);
  const longitudeDifference = toRadians(to.longitude - from.longitude);
  const latitudeOne = toRadians(from.latitude);
  const latitudeTwo = toRadians(to.latitude);
  const a = Math.sin(latitudeDifference / 2) ** 2 + Math.cos(latitudeOne) * Math.cos(latitudeTwo) * Math.sin(longitudeDifference / 2) ** 2;
  return earthRadius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function getDirectionLabel(bearing: number) {
  const labels = ['Norden', 'Nordost', 'Osten', 'Südost', 'Süden', 'Südwest', 'Westen', 'Nordwest'];
  return labels[Math.round(bearing / 45) % labels.length];
}

export function QiblaScreen({ onBack }: { onBack: () => void }) {
  const [calibrated, setCalibrated] = useState(false);
  const [coordinates, setCoordinates] = useState<Coordinates>(BERLIN);
  const [usingLiveLocation, setUsingLiveLocation] = useState(false);
  const [locating, setLocating] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const direction = useMemo(() => calculateBearing(coordinates, KAABA), [coordinates]);
  const distance = useMemo(() => calculateDistance(coordinates, KAABA), [coordinates]);
  const roundedDirection = Math.round(direction);

  const flash = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2100);
  };

  const requestLocation = () => {
    if (!navigator.geolocation) {
      flash('Standort wird auf diesem Gerät nicht unterstützt');
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoordinates({ latitude: position.coords.latitude, longitude: position.coords.longitude });
        setUsingLiveLocation(true);
        setLocating(false);
        flash('Qibla-Richtung wurde neu berechnet');
      },
      () => {
        setLocating(false);
        flash('Standort nicht freigegeben – Berlin bleibt als Standard');
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 300000 },
    );
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
        <PremiumImage src="/premium-assets/high-res-objects/qibla-compass.webp" className="reference-qibla-stage__compass" fallback={<QiblaObject />} />
        <span className="reference-qibla-stage__needle" style={{ transform: `translateX(-50%) rotate(${direction}deg)` }}><Navigation size={29} fill="currentColor" /></span>
        <div className="reference-qibla-stage__copy">
          <span className="overline">Richtung zur Kaaba</span>
          <h2>{roundedDirection}° {getDirectionLabel(direction)}</h2>
          <p>Entfernung ungefähr {Math.round(distance).toLocaleString('de-DE')} km.</p>
        </div>
      </section>

      <section className="reference-qibla-location">
        <span className="reference-qibla-location__icon"><MapPin size={20} /></span>
        <span><small>{usingLiveLocation ? 'Aktueller Standort' : 'Standardstandort'}</small><strong>{usingLiveLocation ? 'Gerätestandort' : 'Berlin, Deutschland'}</strong><em>{usingLiveLocation ? 'Koordinaten lokal berechnet' : 'Standort noch nicht freigegeben'}</em></span>
        <button className={locating ? 'is-loading' : ''} onClick={requestLocation} aria-label="Standort aktualisieren"><LocateFixed size={18} /></button>
      </section>

      <section className="reference-qibla-calibration">
        <div><span className="overline">Kompass</span><h3>{calibrated ? 'Kompass vorbereitet' : 'Kalibrierung empfohlen'}</h3><p>{calibrated ? 'Halte das Gerät flach und richte den oberen Rand nach Norden aus.' : 'Bewege dein Gerät in einer liegenden Acht, damit der Gerätesensor genauer arbeiten kann.'}</p></div>
        <button className={calibrated ? 'reference-calibration-button is-done' : 'reference-calibration-button'} onClick={() => { setCalibrated(true); flash('Kalibrierungshinweis bestätigt'); }}>{calibrated ? <CircleCheck size={17} /> : <Compass size={17} />}{calibrated ? 'Bereit' : 'Kalibrieren'}</button>
      </section>

      <section className="reference-qibla-tip">
        <Compass size={20} />
        <span><strong>Für ein genaues Ergebnis</strong><small>Halte das Gerät flach und fern von magnetischen Gegenständen. Die Nadel zeigt den berechneten Winkel; eine echte Sensorrotation benötigt Gerätezugriff.</small></span>
      </section>

      <AnimatePresence>{toast ? <motion.div className="toast" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}><CircleCheck size={18} /> {toast}</motion.div> : null}</AnimatePresence>
    </motion.main>
  );
}
