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
];

for (const fragment of requiredFragments) {
  if (!source.includes(fragment)) {
    throw new Error(`Qibla implementation is missing: ${fragment}`);
  }
}

if (source.includes('/premium-assets/high-res-objects/qibla-compass.webp')) {
  throw new Error('Qibla screen still references the obsolete compass asset path.');
}

if (!source.includes('Standort und Sensordaten verlassen den Browser nicht')) {
  throw new Error('Qibla screen is missing the local-processing privacy notice.');
}

console.log('Qibla verified: live device orientation, location bearing, cleanup and valid premium asset path are wired.');
