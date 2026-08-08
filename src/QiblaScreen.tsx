import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ChevronLeft,
  CircleCheck,
  Compass,
  LocateFixed,
  MapPin,
  Navigation,
  Settings,
  TriangleAlert,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { bootstrapSharedPrayerTimes, loadPrayerLocation, savePrayerLocation } from './prayerTimesService';
import { PremiumImage, QiblaObject } from './PremiumVisuals';

type Coordinates = {
  latitude: number;
  longitude: number;
};

type SensorStatus = 'idle' | 'requesting' | 'active' | 'denied' | 'unsupported';

type CompassOrientationEvent = DeviceOrientationEvent & {
  webkitCompassHeading?: number;
  webkitCompassAccuracy?: number;
};

type DeviceOrientationEventConstructorWithPermission = typeof DeviceOrientationEvent & {
  requestPermission?: () => Promise<'granted' | 'denied'>;
};

const KAABA: Coordinates = { latitude: 21.4225, longitude: 39.8262 };

function toRadians(value: number) {
  return value * Math.PI / 180;
}

function toDegrees(value: number) {
  return value * 180 / Math.PI;
}

function normalizeDegrees(value: number) {
  return (value % 360 + 360) % 360;
}

function calculateBearing(from: Coordinates, to: Coordinates) {
  const latitudeOne = toRadians(from.latitude);
  const latitudeTwo = toRadians(to.latitude);
  const longitudeDifference = toRadians(to.longitude - from.longitude);
  const y = Math.sin(longitudeDifference) * Math.cos(latitudeTwo);
  const x = Math.cos(latitudeOne) * Math.sin(latitudeTwo) - Math.sin(latitudeOne) * Math.cos(latitudeTwo) * Math.cos(longitudeDifference);
  return normalizeDegrees(toDegrees(Math.atan2(y, x)));
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

function getScreenOrientationAngle() {
  const modernAngle = window.screen.orientation?.angle;
  if (typeof modernAngle === 'number') return modernAngle;
  const legacyAngle = (window as Window & { orientation?: number }).orientation;
  return typeof legacyAngle === 'number' ? legacyAngle : 0;
}

export function QiblaScreen({ onBack }: { onBack: () => void }) {
  const initialLocation = useMemo(loadPrayerLocation, []);
  const [coordinates, setCoordinates] = useState<Coordinates>({ latitude: initialLocation.latitude, longitude: initialLocation.longitude });
  const [usingLiveLocation, setUsingLiveLocation] = useState(initialLocation.source === 'device');
  const [locationLabel, setLocationLabel] = useState(initialLocation.label);
  const [locating, setLocating] = useState(false);
  const [heading, setHeading] = useState<number | null>(null);
  const [sensorStatus, setSensorStatus] = useState<SensorStatus>('idle');
  const [sensorAccuracy, setSensorAccuracy] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const direction = useMemo(() => calculateBearing(coordinates, KAABA), [coordinates]);
  const distance = useMemo(() => calculateDistance(coordinates, KAABA), [coordinates]);
  const roundedDirection = Math.round(direction);
  const needleRotation = heading === null ? direction : normalizeDegrees(direction - heading);

  const flash = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2100);
  };

  const handleOrientation = useCallback((rawEvent: Event) => {
    const event = rawEvent as CompassOrientationEvent;
    let nextHeading: number | null = null;

    if (typeof event.webkitCompassHeading === 'number' && Number.isFinite(event.webkitCompassHeading)) {
      nextHeading = event.webkitCompassHeading;
      if (typeof event.webkitCompassAccuracy === 'number' && Number.isFinite(event.webkitCompassAccuracy)) {
        setSensorAccuracy(Math.max(0, event.webkitCompassAccuracy));
      }
    } else if (typeof event.alpha === 'number' && Number.isFinite(event.alpha)) {
      nextHeading = 360 - event.alpha;
      setSensorAccuracy(null);
    }

    if (nextHeading === null) return;
    setHeading(normalizeDegrees(nextHeading + getScreenOrientationAngle()));
    setSensorStatus('active');
  }, []);

  const stopCompass = useCallback(() => {
    window.removeEventListener('deviceorientationabsolute', handleOrientation as EventListener, true);
    window.removeEventListener('deviceorientation', handleOrientation as EventListener, true);
    setHeading(null);
    setSensorAccuracy(null);
    setSensorStatus('idle');
  }, [handleOrientation]);

  useEffect(() => () => {
    window.removeEventListener('deviceorientationabsolute', handleOrientation as EventListener, true);
    window.removeEventListener('deviceorientation', handleOrientation as EventListener, true);
  }, [handleOrientation]);

  const startCompass = async () => {
    if (sensorStatus === 'active') {
      stopCompass();
      flash('Gerätekompass gestoppt');
      return;
    }

    const OrientationEvent = window.DeviceOrientationEvent as DeviceOrientationEventConstructorWithPermission | undefined;
    if (!OrientationEvent) {
      setSensorStatus('unsupported');
      flash('Dieses Gerät stellt keinen Kompasssensor bereit');
      return;
    }

    setSensorStatus('requesting');
    try {
      if (typeof OrientationEvent.requestPermission === 'function') {
        const permission = await OrientationEvent.requestPermission();
        if (permission !== 'granted') {
          setSensorStatus('denied');
          flash('Kompasszugriff wurde nicht freigegeben');
          return;
        }
      }

      window.removeEventListener('deviceorientationabsolute', handleOrientation as EventListener, true);
      window.removeEventListener('deviceorientation', handleOrientation as EventListener, true);
      window.addEventListener('deviceorientationabsolute', handleOrientation as EventListener, true);
      window.addEventListener('deviceorientation', handleOrientation as EventListener, true);

      window.setTimeout(() => {
        setSensorStatus((current) => {
          if (current === 'active') return current;
          flash('Kein Kompasssignal empfangen – Gerät bewegen oder Browserberechtigung prüfen');
          return 'unsupported';
        });
      }, 2500);
    } catch {
      setSensorStatus('denied');
      flash('Kompasszugriff konnte nicht gestartet werden');
    }
  };

  const requestLocation = () => {
    if (!navigator.geolocation) {
      flash('Standort wird auf diesem Gerät nicht unterstützt');
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const label = 'Aktueller Gerätestandort';
        setCoordinates({ latitude, longitude });
        setUsingLiveLocation(true);
        setLocationLabel(label);
        setLocating(false);
        savePrayerLocation({ latitude, longitude, label, source: 'device' });
        void bootstrapSharedPrayerTimes();
        flash('Qibla-Richtung und gemeinsamer Gebetsstandort wurden aktualisiert');
      },
      () => {
        setLocating(false);
        flash('Standort nicht freigegeben – der gespeicherte Standort bleibt aktiv');
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 300000 },
    );
  };

  const openCompassControls = () => {
    const controls = document.querySelector<HTMLElement>('.reference-qibla-calibration');
    if (!controls) {
      flash('Kompass-Einstellungen konnten nicht geöffnet werden');
      return;
    }
    controls.scrollIntoView({ behavior: 'smooth', block: 'center' });
    window.setTimeout(() => controls.querySelector<HTMLButtonElement>('.reference-calibration-button')?.focus({ preventScroll: true }), 280);
  };

  const sensorLabel = sensorStatus === 'active'
    ? 'Live-Kompass aktiv'
    : sensorStatus === 'requesting'
      ? 'Kompass wird gestartet …'
      : sensorStatus === 'denied'
        ? 'Kompasszugriff verweigert'
        : sensorStatus === 'unsupported'
          ? 'Kein Sensorsignal'
          : 'Kompass noch nicht gestartet';

  return (
    <motion.main className="screen reference-qibla-screen" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <header className="reference-screen-header">
        <button className="icon-button" onClick={onBack} aria-label="Zurück"><ChevronLeft size={20} /></button>
        <div><span className="overline">Nur Islam</span><h1>Qibla</h1></div>
        <button className="icon-button" onClick={openCompassControls} aria-label="Kompass-Einstellungen öffnen"><Settings size={20} /></button>
      </header>

      <section className="reference-qibla-stage">
        <div className="reference-qibla-stage__halo" />
        <PremiumImage src="/premium-assets/high-res-objects/qibla-compass-v2.webp" className="reference-qibla-stage__compass" fallback={<QiblaObject />} />
        <span className="reference-qibla-stage__needle" style={{ transform: `translateX(-50%) rotate(${needleRotation}deg)` }}><Navigation size={29} fill="currentColor" /></span>
        <div className="reference-qibla-stage__copy">
          <span className="overline">Richtung zur Kaaba</span>
          <h2>{roundedDirection}° {getDirectionLabel(direction)}</h2>
          <p>{heading === null ? `Entfernung ungefähr ${Math.round(distance).toLocaleString('de-DE')} km.` : `Geräteausrichtung ${Math.round(heading)}° · Entfernung ${Math.round(distance).toLocaleString('de-DE')} km.`}</p>
        </div>
      </section>

      <section className="reference-qibla-location">
        <span className="reference-qibla-location__icon"><MapPin size={20} /></span>
        <span><small>{usingLiveLocation ? 'Gespeicherter Gerätestandort' : 'Standardstandort'}</small><strong>{locationLabel}</strong><em>{usingLiveLocation ? 'Wird auch für gemeinsame Gebetszeiten verwendet' : 'Standort noch nicht freigegeben'}</em></span>
        <button className={locating ? 'is-loading' : ''} onClick={requestLocation} aria-label="Standort aktualisieren" disabled={locating}><LocateFixed size={18} /></button>
      </section>

      <section className="reference-qibla-calibration" tabIndex={-1}>
        <div>
          <span className="overline">Gerätekompass</span>
          <h3>{sensorLabel}</h3>
          <p>{sensorStatus === 'active' ? `Die Nadel reagiert live auf die Gerätebewegung${sensorAccuracy === null ? '.' : ` · gemeldete Genauigkeit etwa ${Math.round(sensorAccuracy)}°.`}` : 'Halte das Gerät flach und bewege es vor dem Start kurz in einer liegenden Acht.'}</p>
        </div>
        <button
          className={sensorStatus === 'active' ? 'reference-calibration-button is-done' : 'reference-calibration-button'}
          onClick={startCompass}
          disabled={sensorStatus === 'requesting'}
        >
          {sensorStatus === 'active' ? <CircleCheck size={17} /> : sensorStatus === 'denied' || sensorStatus === 'unsupported' ? <TriangleAlert size={17} /> : <Compass size={17} />}
          {sensorStatus === 'active' ? 'Stoppen' : sensorStatus === 'requesting' ? 'Startet …' : 'Kompass starten'}
        </button>
      </section>

      <section className="reference-qibla-tip">
        <Compass size={20} />
        <span><strong>Für ein genaues Ergebnis</strong><small>Halte das Gerät flach und fern von Magneten, Metallhüllen und Lautsprechern. Die Qibla-Berechnung selbst bleibt lokal; der gespeicherte Standort wird nur von den ausdrücklich ausgewiesenen Live-Diensten verwendet.</small></span>
      </section>

      <AnimatePresence>{toast ? <motion.div className="toast" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}><CircleCheck size={18} /> {toast}</motion.div> : null}</AnimatePresence>
    </motion.main>
  );
}
