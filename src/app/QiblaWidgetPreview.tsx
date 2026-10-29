import { QiblaCompass } from '../shared/QiblaCompass';
import { loadPrayerLocation } from '../services/prayerTimesService';
import type { PrayerLocation } from '../services/prayerTimesService';
import { KAABA, calculateBearing, calculateDistance, getDirectionLabel } from '../services/qiblaGeometry';

export function getQiblaWidgetReading(location: PrayerLocation) {
  const bearing = calculateBearing(location, KAABA);
  const distance = calculateDistance(location, KAABA);
  return { bearing, distance, direction: getDirectionLabel(bearing), source: location.source === 'device' ? 'Gespeicherter Standort' : 'Standardstandort' };
}

export function QiblaWidgetPreview({ location = loadPrayerLocation() }: { location?: PrayerLocation }) {
  const reading = getQiblaWidgetReading(location);
  const nearby = reading.distance < 1;
  return <div className="qibla-widget">
    <header className="qibla-widget__location"><span>{reading.source}</span><strong>{location.label}</strong></header>
    <div className="qibla-widget__instrument" data-bearing={nearby ? undefined : reading.bearing}>
      <QiblaCompass direction={reading.bearing} heading={null} rotation={reading.bearing} state="ready" pulse={false} showDirection={!nearby} label={nearby ? 'Nahe der Kaaba, keine zuverlässige Richtung' : `Qibla ${Math.round(reading.bearing)} Grad ab geografisch Nord. Statische Anzeige.`} />
    </div>
    <div className="qibla-widget__metrics">
      <div className="qibla-widget__reading"><strong>{nearby ? '—' : Math.round(reading.bearing)}<small>{nearby ? '' : '°'}</small></strong><span>{nearby ? 'In unmittelbarer Nähe' : reading.direction}</span></div>
      <div className="qibla-widget__distance"><strong>{Math.round(reading.distance).toLocaleString('de-DE')} <small>km</small></strong><span>Luftlinie zur Kaaba</span></div>
    </div>
    <footer className="qibla-widget__footer">Nordorientiert · Sensor aus</footer>
  </div>;
}
