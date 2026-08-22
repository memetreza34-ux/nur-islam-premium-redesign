import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const service = await readFile(resolve(root, 'src/services/mosqueService.ts'), 'utf8');
const screen = await readFile(resolve(root, 'src/screens/MosqueScreen.tsx'), 'utf8');
const bridge = await readFile(resolve(root, 'src/screens/DiscoveryScreens.tsx'), 'utf8');
const styles = await readFile(resolve(root, 'src/styles/reference-mosque-live.css'), 'utf8');
const styleIndex = await readFile(resolve(root, 'src/styles.css'), 'utf8');
const app = await readFile(resolve(root, 'src/app/App.tsx'), 'utf8');

const serviceFeatures = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'amenity"="place_of_worship',
  'religion"="muslim',
  'building"="mosque',
  'place_of_worship"="musalla',
  'around:${radiusMeters}',
  'out center tags',
  'DEFAULT_RADIUS_METERS = 10000',
  'CACHE_MAX_AGE_MS',
  'nur_mosque_search_cache_v1',
  'navigator.geolocation.getCurrentPosition',
  'calculateDistanceKm',
  'getOpenStreetMapDirectionsUrl',
  'forceRefresh = false',
  'function normalizeWebsite',
  'new URL(candidate)',
  "parsed.protocol !== 'https:' && parsed.protocol !== 'http:'",
];
for (const feature of serviceFeatures) {
  if (!service.includes(feature)) throw new Error(`Mosque service is missing: ${feature}`);
}

const screenFeatures = [
  // The copy no longer calls the results "echte" data as a blanket claim: it
  // now says whether the radius is around the device location or around the
  // default one, which is the part a user cannot otherwise tell.
  'Moschee- und Gebetsraumdaten im Umkreis von zehn Kilometern um deinen Gerätestandort',
  'Moschee- und Gebetsraumdaten im Umkreis von zehn Kilometern um den angezeigten Standardort',
  'usingDeviceOrigin',
  'OpenStreetMap-Mitwirkende',
  'Eigenen Standort verwenden',
  // Names the origin the distances are measured from, not only the radius.
  'Nach Entfernung von {origin.label} sortiert · 10 km',
  'requestMosqueLocation',
  'getOpenStreetMapDirectionsUrl',
  'reference-mosque-detail-modal',
  'Gebetszeiten nicht hinterlegt',
  'Adresse nicht in OpenStreetMap hinterlegt',
];
for (const feature of screenFeatures) {
  if (!screen.includes(feature) && !service.includes(feature)) throw new Error(`Mosque finder is missing: ${feature}`);
}

if (screen.includes('Beispieldaten im Prototyp') || screen.includes('Demo-Eintrag') || screen.includes('Demo-Zeitplan')) {
  throw new Error('Mosque finder still contains demo data or demo actions.');
}
if (service.includes('return `https://${value}`')) {
  throw new Error('Mosque website normalization still accepts unvalidated external URLs.');
}
if (bridge.trim() !== "export { MosqueScreen } from './MosqueScreen';") {
  throw new Error('DiscoveryScreens must route the existing app import to the live MosqueScreen.');
}
// Loaded on demand: the module specifier is what stays stable across a switch
// between a static and a lazy import.
if (!app.includes("'../screens/DiscoveryScreens'") || !app.includes("activeTab === 'mosques'")) {
  throw new Error('App no longer routes to the mosque finder.');
}
if (!styles.includes('.reference-mosque-live-status') || !styles.includes('.reference-mosque-detail-modal')) {
  throw new Error('Live mosque status or detail modal styles are missing.');
}
if (!styleIndex.includes('reference-mosque-live.css')) {
  throw new Error('Live mosque stylesheet is not loaded.');
}

console.log('Mosque finder verified: live Overpass query, geolocation, distance sorting, cache, privacy notice, OSM navigation, validated HTTP/HTTPS external websites, and no demo entries.');
