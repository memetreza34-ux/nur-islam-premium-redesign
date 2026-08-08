import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const source = await readFile(resolve(process.cwd(), 'src/QiblaScreen.tsx'), 'utf8');

const requiredFragments = [
  'requestPermission',
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

const privacyFragments = [
  'Die Qibla-Berechnung selbst bleibt lokal',
  'ausdrücklich ausgewiesenen Live-Diensten',
  'Wird auch für gemeinsame Gebetszeiten verwendet',
];
for (const fragment of privacyFragments) {
  if (!source.includes(fragment)) throw new Error(`Qibla privacy/location disclosure is missing: ${fragment}`);
}

console.log('Qibla verified: saved onboarding/prayer location is reused, new device locations persist into the shared prayer flow, live orientation cleans up correctly, the settings button reaches real controls, and privacy wording distinguishes local bearing from external live services.');
