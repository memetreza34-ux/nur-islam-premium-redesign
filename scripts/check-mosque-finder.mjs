import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const service = await readFile(resolve(root, 'src/mosqueService.ts'), 'utf8');
const screen = await readFile(resolve(root, 'src/MosqueScreen.tsx'), 'utf8');
const bridge = await readFile(resolve(root, 'src/DiscoveryScreens.tsx'), 'utf8');
const styles = await readFile(resolve(root, 'src/styles/reference-mosque-live.css'), 'utf8');
const styleIndex = await readFile(resolve(root, 'src/styles.css'), 'utf8');
const app = await readFile(resolve(root, 'src/App.tsx'), 'utf8');

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
];
for (const feature of serviceFeatures) {
  if (!service.includes(feature)) throw new Error(`Mosque service is missing: ${feature}`);
}

const screenFeatures = [
  'Echte Moschee- und Gebetsraumdaten',
  'OpenStreetMap-Mitwirkende',
  'Eigenen Standort verwenden',
  'Nach Entfernung sortiert · 10 km',
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
if (bridge.trim() !== "export { MosqueScreen } from './MosqueScreen';") {
  throw new Error('DiscoveryScreens must route the existing app import to the live MosqueScreen.');
}
if (!app.includes("import { MosqueScreen } from './DiscoveryScreens';") || !app.includes("activeTab === 'mosques'")) {
  throw new Error('App no longer routes to the mosque finder.');
}
if (!styles.includes('.reference-mosque-live-status') || !styles.includes('.reference-mosque-detail-modal')) {
  throw new Error('Live mosque status or detail modal styles are missing.');
}
if (!styleIndex.includes('reference-mosque-live.css')) {
  throw new Error('Live mosque stylesheet is not loaded.');
}

console.log('Mosque finder verified: live Overpass query, geolocation, distance sorting, cache, privacy notice, OSM navigation, and no demo entries.');
