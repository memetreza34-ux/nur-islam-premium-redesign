import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ChevronLeft,
  CircleCheck,
  Compass,
  LocateFixed,
  MapPin,
  Navigation,
  Settings,
  Smartphone,
  TriangleAlert,
} from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { bootstrapSharedPrayerTimes, loadPrayerLocation, savePrayerLocation } from '../services/prayerTimesService';
import { KAABA, calculateBearing, calculateDistance, getDirectionLabel, normalizeDegrees, shortestAngleDelta } from '../services/qiblaGeometry';
import type { Coordinates } from '../services/qiblaGeometry';
import type { CompassVisualState } from '../shared/QiblaCompass';
export { KAABA, calculateBearing, calculateDistance, shortestAngleDelta } from '../services/qiblaGeometry';
const QiblaCompass = lazy(() => import('../shared/QiblaCompass').then(module => ({ default: module.QiblaCompass })));

type SensorStatus = 'idle' | 'requesting' | 'active' | 'denied' | 'unsupported';

type DeviceTilt = {
  beta: number;
  gamma: number;
};

type CompassOrientationEvent = DeviceOrientationEvent & {
  webkitCompassHeading?: number;
  webkitCompassAccuracy?: number;
};

type DeviceOrientationEventConstructorWithPermission = typeof DeviceOrientationEvent & {
  requestPermission?: () => Promise<'granted' | 'denied'>;
};

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
  const [tilt, setTilt] = useState<DeviceTilt | null>(null);
  const [sensorStatus, setSensorStatus] = useState<SensorStatus>('idle');
  const [sensorAccuracy, setSensorAccuracy] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [pulse, setPulse] = useState(false);
  const sensorTimeoutRef = useRef<number | null>(null);
  const toastTimeoutRef = useRef<number | null>(null);
  const pulseTimeoutRef = useRef<number | null>(null);
  const previousNeedleRotationRef = useRef<number | null>(null);
  const unwrappedNeedleRotationRef = useRef(0);
  const wasAlignedRef = useRef(false);
  const reduceMotion = useReducedMotion();
  const direction = useMemo(() => calculateBearing(coordinates, KAABA), [coordinates]);
  const distance = useMemo(() => calculateDistance(coordinates, KAABA), [coordinates]);
  const roundedDirection = Math.round(direction);
  const needleRotation = heading === null ? direction : normalizeDegrees(direction - heading);

  if (previousNeedleRotationRef.current === null) {
    previousNeedleRotationRef.current = needleRotation;
    unwrappedNeedleRotationRef.current = needleRotation;
  } else {
    unwrappedNeedleRotationRef.current += shortestAngleDelta(previousNeedleRotationRef.current, needleRotation);
    previousNeedleRotationRef.current = needleRotation;
  }
  const displayedNeedleRotation = unwrappedNeedleRotationRef.current;
  const remainingTurn = heading === null ? null : shortestAngleDelta(heading, direction);
  const uncertain = sensorAccuracy !== null && (sensorAccuracy < 0 || sensorAccuracy > 15);
  const deviceIsFlat = tilt !== null && Math.hypot(tilt.beta, tilt.gamma) <= 10;
  const tiltWarning = tilt !== null && !deviceIsFlat;
  const error = sensorStatus === 'denied' || sensorStatus === 'unsupported';
  const turnDegrees = remainingTurn === null ? null : Math.round(Math.abs(remainingTurn));
  const turnSide = remainingTurn !== null && remainingTurn > 0 ? 'rechts' : 'links';
  const aligned = remainingTurn !== null && Math.abs(remainingTurn) <= 2 && !uncertain && !tiltWarning;
  const near = remainingTurn !== null && Math.abs(remainingTurn) > 2 && Math.abs(remainingTurn) <= 5 && !uncertain && !tiltWarning;
  const compassState: CompassVisualState = error ? 'error' : uncertain || tiltWarning ? 'uncertain' : aligned ? 'aligned' : near ? 'near' : heading === null ? 'ready' : 'turn';
  const guidanceTitle = error
    ? 'Kompass nicht verfügbar'
    : uncertain
      ? 'Sensor ungenau'
      : tiltWarning
        ? 'Handy flach halten'
        : aligned
          ? 'Qibla gefunden'
          : near
            ? 'Fast richtig'
            : heading === null
              ? 'Vor dem Start'
              : 'Richtung anpassen';
  const guidance = sensorStatus === 'denied'
    ? 'Bitte Sensorzugriff erlauben'
    : sensorStatus === 'unsupported'
      ? 'Gerät bewegen oder Browserberechtigung prüfen'
      : uncertain
        ? 'Sensor ungenau – bitte neu ausrichten'
        : tiltWarning
          ? 'Lege das Handy möglichst waagerecht in die Hand'
          : aligned
            ? sensorAccuracy === null ? 'Richtung erreicht – Sensorpräzision nicht gemeldet' : 'Du bist korrekt ausgerichtet.'
            : near
              ? `Noch ${turnDegrees}° nach ${turnSide}`
              : remainingTurn === null
                ? 'Starte den Live-Kompass für eine aktuelle Ausrichtung'
                : `${turnDegrees}° nach ${turnSide} drehen`;
  const accuracyValue = heading === null
    ? 'Nicht aktiv'
    : uncertain
      ? 'Ungenau'
      : sensorAccuracy === null
        ? 'Nicht gemeldet'
        : `±${Math.round(sensorAccuracy)}°`;

  const flash = (message: string) => {
    if (toastTimeoutRef.current !== null) window.clearTimeout(toastTimeoutRef.current);
    setToast(message);
    toastTimeoutRef.current = window.setTimeout(() => {
      setToast(null);
      toastTimeoutRef.current = null;
    }, 2100);
  };

  const clearSensorTimeout = useCallback(() => {
    if (sensorTimeoutRef.current === null) return;
    window.clearTimeout(sensorTimeoutRef.current);
    sensorTimeoutRef.current = null;
  }, []);

  const handleOrientation = useCallback((rawEvent: Event) => {
    const event = rawEvent as CompassOrientationEvent;
    let nextHeading: number | null = null;

    if (typeof event.webkitCompassHeading === 'number' && Number.isFinite(event.webkitCompassHeading)) {
      nextHeading = event.webkitCompassHeading;
      setSensorAccuracy(typeof event.webkitCompassAccuracy === 'number' && Number.isFinite(event.webkitCompassAccuracy) ? event.webkitCompassAccuracy : null);
    } else if ((event.absolute === true || event.type === 'deviceorientationabsolute') && typeof event.alpha === 'number' && Number.isFinite(event.alpha)) {
      nextHeading = 360 - event.alpha;
      setSensorAccuracy(null);
    }

    if (nextHeading === null) return;
    clearSensorTimeout();
    setHeading(normalizeDegrees(nextHeading + getScreenOrientationAngle()));
    setTilt(
      typeof event.beta === 'number' && Number.isFinite(event.beta) && typeof event.gamma === 'number' && Number.isFinite(event.gamma)
        ? { beta: event.beta, gamma: event.gamma }
        : null,
    );
    setSensorStatus('active');
  }, [clearSensorTimeout]);

  const stopCompass = useCallback(() => {
    clearSensorTimeout();
    window.removeEventListener('deviceorientationabsolute', handleOrientation as EventListener, true);
    window.removeEventListener('deviceorientation', handleOrientation as EventListener, true);
    setHeading(null);
    setTilt(null);
    setSensorAccuracy(null);
    setSensorStatus('idle');
  }, [clearSensorTimeout, handleOrientation]);

  useEffect(() => () => {
    clearSensorTimeout();
    window.removeEventListener('deviceorientationabsolute', handleOrientation as EventListener, true);
    window.removeEventListener('deviceorientation', handleOrientation as EventListener, true);
    if (toastTimeoutRef.current !== null) window.clearTimeout(toastTimeoutRef.current);
    if (pulseTimeoutRef.current !== null) window.clearTimeout(pulseTimeoutRef.current);
  }, [clearSensorTimeout, handleOrientation]);

  useEffect(() => {
    if (aligned && !wasAlignedRef.current) {
      wasAlignedRef.current = true;
      if ('vibrate' in navigator) navigator.vibrate(35);
      if (!reduceMotion) {
        if (pulseTimeoutRef.current !== null) window.clearTimeout(pulseTimeoutRef.current);
        setPulse(true);
        pulseTimeoutRef.current = window.setTimeout(() => {
          setPulse(false);
          pulseTimeoutRef.current = null;
        }, 700);
      }
    } else if (remainingTurn === null || Math.abs(remainingTurn) > 5 || uncertain || tiltWarning) {
      wasAlignedRef.current = false;
    }
  }, [aligned, remainingTurn, uncertain, tiltWarning, reduceMotion]);

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

    clearSensorTimeout();
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

      sensorTimeoutRef.current = window.setTimeout(() => {
        sensorTimeoutRef.current = null;
        window.removeEventListener('deviceorientationabsolute', handleOrientation as EventListener, true);
        window.removeEventListener('deviceorientation', handleOrientation as EventListener, true);
        setHeading(null);
        setTilt(null);
        setSensorAccuracy(null);
        setSensorStatus((current) => {
          if (current === 'active') return current;
          flash('Kein Kompasssignal empfangen – Gerät bewegen oder Browserberechtigung prüfen');
          return 'unsupported';
        });
      }, 2500);
    } catch {
      clearSensorTimeout();
      window.removeEventListener('deviceorientationabsolute', handleOrientation as EventListener, true);
      window.removeEventListener('deviceorientation', handleOrientation as EventListener, true);
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
    controls.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
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
    <motion.main className="screen reference-qibla-screen" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduceMotion ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}>
      <header className="reference-screen-header">
        <button className="icon-button" onClick={onBack} aria-label="Zurück"><ChevronLeft size={20} /></button>
        <div><span className="overline">Nur Islam</span><h1>Qibla</h1></div>
        <button className="icon-button" onClick={openCompassControls} aria-label="Kompass-Einstellungen öffnen"><Settings size={20} /></button>
      </header>

      <section className="qibla-guide" aria-label="Richtung zur Kaaba" data-state={compassState}>
        <div className="qibla-guide__topline">
          <span className="overline">Dein Weg zur Kaaba</span>
          <div className="qibla-guide__mode"><span data-live={heading !== null} />{heading === null ? 'Vorschau nach Norden' : 'Live-Kompass'}</div>
        </div>

        <div className="reference-qibla-location" aria-label="Standort und Entfernung zur Kaaba">
          <span className="reference-qibla-location__icon"><MapPin size={20} /></span>
          <span>
            <small>{usingLiveLocation ? 'Gespeicherter Gerätestandort' : 'Standardstandort'} · Kaaba {Math.round(distance).toLocaleString('de-DE')} km</small>
            <strong>{locationLabel}</strong>
          </span>
          <button className={locating ? 'is-loading' : ''} onClick={requestLocation} aria-label={locating ? 'Standort wird aktualisiert' : 'Standort aktualisieren'} disabled={locating}><LocateFixed size={18} /></button>
        </div>

        <div className="qibla-guide__stage">
          <Suspense fallback={<div className="qibla-dial" role="status">Kompass wird geladen …</div>}>
            <QiblaCompass direction={direction} heading={heading} rotation={displayedNeedleRotation} state={compassState} pulse={pulse} />
          </Suspense>
        </div>

        <div className="qibla-guide__reading">
          <span className="overline">Qibla-Richtung</span>
          <h2>{roundedDirection}° <span>{getDirectionLabel(direction)}</span></h2>
          <p>Von Norden aus gemessen</p>
        </div>

        <div className="qibla-guide__guidance" data-state={compassState} role="status" aria-live="polite">
          <span>{aligned ? <CircleCheck size={20} /> : error ? <TriangleAlert size={20} /> : <Navigation size={20} />}</span>
          <div><strong>{guidanceTitle}</strong><small>{guidance}</small></div>
        </div>

        <div className="qibla-guide__facts" aria-label="Kompassdaten">
          <div><small>Ausrichtung</small><strong>{heading === null ? '—' : `${Math.round(heading)}°`}</strong></div>
          <div><small>Drehung</small><strong>{remainingTurn === null || uncertain || tiltWarning ? '—' : aligned ? 'Gefunden' : `${turnDegrees}° ${turnSide}`}</strong></div>
          <div><small>Genauigkeit</small><strong>{accuracyValue}</strong></div>
        </div>

        <div className="qibla-guide__tip"><Smartphone size={19} /><span><strong>Handy flach halten</strong><small>{deviceIsFlat ? 'Handy liegt flach' : 'Für eine verlässliche Richtung'}</small></span></div>

        <div className="reference-qibla-calibration" tabIndex={-1}>
          <button
            className={sensorStatus === 'active' ? 'reference-calibration-button is-done' : 'reference-calibration-button'}
            onClick={startCompass}
            disabled={sensorStatus === 'requesting'}
          >
            {sensorStatus === 'active' ? <CircleCheck size={17} /> : sensorStatus === 'denied' || sensorStatus === 'unsupported' ? <TriangleAlert size={17} /> : <Compass size={17} />}
            {sensorStatus === 'active' ? `Kompass beenden · ${Math.round(heading ?? 0)}°` : sensorStatus === 'requesting' ? 'Startet …' : 'Live-Kompass starten'}
          </button>
        </div>
      </section>

      <section className="reference-qibla-tip qibla-help">
        <details>
          <summary><span><Compass size={20} /><span><strong>{sensorLabel}</strong><small>Tipps für ein genaueres Ergebnis</small></span></span><span>Öffnen</span></summary>
          <ol>
            <li><strong>Gerät flach halten</strong><span>Lege das Smartphone waagerecht in deine Hand.</span></li>
            <li><strong>Störquellen entfernen</strong><span>Abstand zu Magneten, Metallhüllen und Lautsprechern halten.</span></li>
            <li><strong>Neu kalibrieren</strong><span>Das Gerät langsam in einer liegenden Acht bewegen.</span></li>
          </ol>
          <p>Die Qibla-Berechnung selbst bleibt lokal. Der gespeicherte Gerätestandort wird auch für gemeinsame Gebetszeiten verwendet und nur von den ausdrücklich ausgewiesenen Live-Diensten übertragen.</p>
        </details>
      </section>

      <AnimatePresence>{toast ? <motion.div className="toast" initial={{ opacity: 0, y: 12, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.985 }} transition={{ duration: reduceMotion ? 0 : 0.2, ease: [0.22, 1, 0.36, 1] }}><CircleCheck size={18} /> {toast}</motion.div> : null}</AnimatePresence>
    </motion.main>
  );
}
