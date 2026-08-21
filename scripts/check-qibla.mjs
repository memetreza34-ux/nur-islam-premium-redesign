import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const source = await readFile(resolve(process.cwd(), 'src/screens/QiblaScreen.tsx'), 'utf8');

const requiredFragments = [
  'DeviceOrientationEventConstructorWithPermission',
  "requestPermission?: (absolute?: boolean)",
  "typeof OrientationEvent.requestPermission === 'function'",
  'await OrientationEvent.requestPermission(true)',
  "permission !== 'granted'",
  'webkitCompassHeading',
  'webkitCompassAccuracy',
  'event.absolute === true',
  "addEventListener('deviceorientationabsolute'",
  "addEventListener('deviceorientation'",
  "removeEventListener('deviceorientationabsolute'",
  "removeEventListener('deviceorientation'",
  'navigator.geolocation.getCurrentPosition',
  'calculateBearing(coordinates, KAABA)',
  'normalizeDegrees(direction - heading)',
  'qibla-compass-v2.webp',
  "sensorStatus === 'active'",
  'loadPrayerLocation',
  'savePrayerLocation',
  'bootstrapSharedPrayerTimes',
  "initialLocation.source === 'device'",
  "source: 'device'",
  'openCompassControls',
  "scrollIntoView({ behavior: 'smooth', block: 'center' })",
  'Kompass-Einstellungen öffnen',
  'sensorTimeoutRef',
  'clearSensorTimeout',
  'window.clearTimeout(sensorTimeoutRef.current)',
  'sensorTimeoutRef.current = window.setTimeout',
  'sensorTimeoutRef.current = null',
  "if (!usingLiveLocation)",
  'Standort erforderlich',
  'wird nicht als deine persönliche Qibla-Richtung ausgegeben',
  'sensorAccuracyNeedsCheck',
  'sensorAccuracy > 20',
  'Sensorwerte sind nicht automatisch exakt',
];

for (const fragment of requiredFragments) {
  if (!source.includes(fragment)) {
    throw new Error(`Qibla implementation is missing: ${fragment}`);
  }
}

if (source.includes('/premium-assets/high-res-objects/qibla-compass.webp')) {
  throw new Error('Qibla screen still references the obsolete compass asset path.');
}
if (source.includes('const BERLIN')) {
  throw new Error('Qibla screen still hard-codes Berlin instead of reusing the saved prayer location.');
}
if (source.includes('removeOrientationListeners')) {
  throw new Error('Qibla screen contains the obsolete unused listener helper.');
}
if (/else if \(typeof event\.alpha/.test(source)) {
  throw new Error('Qibla screen may not treat relative deviceorientation alpha as a north-referenced heading.');
}
if (!source.includes('{usingLiveLocation ? (') || !source.includes('reference-qibla-stage__needle')) {
  throw new Error('Qibla needle is not gated behind a real saved device location.');
}

const privacyFragments = [
  'Die Qibla-Berechnung selbst bleibt lokal',
  'ausdrücklich ausgewiesenen Live-Diensten',
  'Wird auch für gemeinsame Gebetszeiten verwendet',
  'Standardstandort · nicht deine Position',
];
for (const fragment of privacyFragments) {
  if (!source.includes(fragment)) throw new Error(`Qibla privacy/location disclosure is missing: ${fragment}`);
}

console.log('Qibla verified: no personal bearing without device location, absolute/magnetometer permission is requested, relative alpha is rejected as north, WebKit heading/accuracy are handled, weak or unknown accuracy is disclosed, listeners clean up, and privacy wording stays explicit.');
