export type MosqueSearchSource = 'live' | 'cache' | 'fallback';

export type MosqueSearchOrigin = {
  latitude: number;
  longitude: number;
  label: string;
  source: 'default' | 'device';
};

export type MosqueResult = {
  id: string;
  osmType: 'node' | 'way' | 'relation';
  osmId: number;
  name: string;
  latitude: number;
  longitude: number;
  distanceKm: number;
  address: string;
  denomination?: string;
  openingHours?: string;
  serviceTimes?: string;
  website?: string;
  phone?: string;
  wheelchair?: string;
};

export type MosqueSearchSnapshot = {
  origin: MosqueSearchOrigin;
  radiusMeters: number;
  results: MosqueResult[];
  fetchedAt: string;
  source: MosqueSearchSource;
  endpoint?: string;
};

const DEFAULT_RADIUS_METERS = 10000;
const SEARCH_TIMEOUT_MS = 16000;
const CACHE_MAX_AGE_MS = 24 * 60 * 60 * 1000;
const CACHE_KEY = 'nur_mosque_search_cache_v1';
const LOCATION_KEY = 'nur_mosque_location_v1';
const OVERPASS_ENDPOINTS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
] as const;

export const DEFAULT_MOSQUE_ORIGIN: MosqueSearchOrigin = {
  latitude: 52.52,
  longitude: 13.405,
  label: 'Berlin, Deutschland',
  source: 'default',
};

type OverpassElement = {
  type?: 'node' | 'way' | 'relation';
  id?: number;
  lat?: number;
  lon?: number;
  center?: { lat?: number; lon?: number };
  tags?: Record<string, string>;
};

type OverpassResponse = {
  elements?: OverpassElement[];
};

function isFiniteCoordinate(value: unknown, minimum: number, maximum: number): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= minimum && value <= maximum;
}

function isValidOrigin(value: unknown): value is MosqueSearchOrigin {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<MosqueSearchOrigin>;
  return isFiniteCoordinate(candidate.latitude, -90, 90)
    && isFiniteCoordinate(candidate.longitude, -180, 180)
    && typeof candidate.label === 'string'
    && (candidate.source === 'default' || candidate.source === 'device');
}

function isValidResult(value: unknown): value is MosqueResult {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<MosqueResult>;
  return typeof candidate.id === 'string'
    && (candidate.osmType === 'node' || candidate.osmType === 'way' || candidate.osmType === 'relation')
    && typeof candidate.osmId === 'number'
    && typeof candidate.name === 'string'
    && isFiniteCoordinate(candidate.latitude, -90, 90)
    && isFiniteCoordinate(candidate.longitude, -180, 180)
    && typeof candidate.distanceKm === 'number'
    && Number.isFinite(candidate.distanceKm)
    && typeof candidate.address === 'string';
}

function coordinatesClose(first: MosqueSearchOrigin, second: MosqueSearchOrigin) {
  return Math.abs(first.latitude - second.latitude) < 0.01
    && Math.abs(first.longitude - second.longitude) < 0.01;
}

function toRadians(value: number) {
  return value * Math.PI / 180;
}

export function calculateDistanceKm(
  first: Pick<MosqueSearchOrigin, 'latitude' | 'longitude'>,
  second: Pick<MosqueSearchOrigin, 'latitude' | 'longitude'>,
) {
  const earthRadiusKm = 6371;
  const latitudeDistance = toRadians(second.latitude - first.latitude);
  const longitudeDistance = toRadians(second.longitude - first.longitude);
  const startLatitude = toRadians(first.latitude);
  const endLatitude = toRadians(second.latitude);
  const haversine = Math.sin(latitudeDistance / 2) ** 2
    + Math.cos(startLatitude) * Math.cos(endLatitude) * Math.sin(longitudeDistance / 2) ** 2;
  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
}

function formatAddress(tags: Record<string, string>) {
  const street = [tags['addr:street'], tags['addr:housenumber']].filter(Boolean).join(' ');
  const locality = [tags['addr:postcode'], tags['addr:city'] ?? tags['addr:suburb']].filter(Boolean).join(' ');
  const complete = [street, locality].filter(Boolean).join(', ');
  return complete || tags['addr:full'] || tags['contact:address'] || 'Adresse nicht in OpenStreetMap hinterlegt';
}

function getElementCoordinates(element: OverpassElement) {
  const latitude = element.lat ?? element.center?.lat;
  const longitude = element.lon ?? element.center?.lon;
  if (!isFiniteCoordinate(latitude, -90, 90) || !isFiniteCoordinate(longitude, -180, 180)) return null;
  return { latitude, longitude };
}

function normalizeWebsite(value: string | undefined) {
  if (!value) return undefined;
  if (/^https?:\/\//i.test(value)) return value;
  return `https://${value}`;
}

function normalizeElement(element: OverpassElement, origin: MosqueSearchOrigin): MosqueResult | null {
  if (!element.type || typeof element.id !== 'number') return null;
  const coordinates = getElementCoordinates(element);
  if (!coordinates) return null;
  const tags = element.tags ?? {};
  const name = tags['name:de'] || tags.name || tags.official_name || tags.short_name || 'Moschee / Gebetsraum';
  const distanceKm = calculateDistanceKm(origin, coordinates);

  return {
    id: `${element.type}-${element.id}`,
    osmType: element.type,
    osmId: element.id,
    name,
    ...coordinates,
    distanceKm,
    address: formatAddress(tags),
    denomination: tags.denomination,
    openingHours: tags.opening_hours,
    serviceTimes: tags.service_times,
    website: normalizeWebsite(tags.website || tags['contact:website']),
    phone: tags.phone || tags['contact:phone'],
    wheelchair: tags.wheelchair,
  };
}

function buildOverpassQuery(origin: MosqueSearchOrigin, radiusMeters: number) {
  const latitude = origin.latitude.toFixed(6);
  const longitude = origin.longitude.toFixed(6);
  return `[out:json][timeout:20];\n(\n  nwr["amenity"="place_of_worship"]["religion"="muslim"](around:${radiusMeters},${latitude},${longitude});\n  nwr["building"="mosque"](around:${radiusMeters},${latitude},${longitude});\n  nwr["place_of_worship"="musalla"]["religion"="muslim"](around:${radiusMeters},${latitude},${longitude});\n);\nout center tags;`;
}

function parseResponse(payload: OverpassResponse, origin: MosqueSearchOrigin) {
  if (!Array.isArray(payload.elements)) throw new Error('OpenStreetMap lieferte keine gültige Ergebnisliste.');
  const unique = new Map<string, MosqueResult>();
  payload.elements.forEach((element) => {
    const result = normalizeElement(element, origin);
    if (!result) return;
    const duplicate = [...unique.values()].find((candidate) => (
      candidate.name.toLocaleLowerCase('de-DE') === result.name.toLocaleLowerCase('de-DE')
      && calculateDistanceKm(candidate, result) < 0.08
    ));
    if (!duplicate) unique.set(result.id, result);
  });
  return [...unique.values()]
    .sort((first, second) => first.distanceKm - second.distanceKm)
    .slice(0, 60);
}

export function readMosqueOrigin() {
  try {
    const parsed = JSON.parse(localStorage.getItem(LOCATION_KEY) ?? 'null') as unknown;
    return isValidOrigin(parsed) ? parsed : DEFAULT_MOSQUE_ORIGIN;
  } catch {
    return DEFAULT_MOSQUE_ORIGIN;
  }
}

export function saveMosqueOrigin(origin: MosqueSearchOrigin) {
  try { localStorage.setItem(LOCATION_KEY, JSON.stringify(origin)); } catch { /* optional */ }
}

export function readMosqueCache(origin = readMosqueOrigin(), radiusMeters = DEFAULT_RADIUS_METERS) {
  try {
    const parsed = JSON.parse(localStorage.getItem(CACHE_KEY) ?? 'null') as Partial<MosqueSearchSnapshot> | null;
    if (!parsed || !isValidOrigin(parsed.origin) || parsed.radiusMeters !== radiusMeters || !Array.isArray(parsed.results)) return null;
    if (!coordinatesClose(parsed.origin, origin) || !parsed.results.every(isValidResult)) return null;
    const fetchedAt = Date.parse(parsed.fetchedAt ?? '');
    if (!Number.isFinite(fetchedAt) || Date.now() - fetchedAt > CACHE_MAX_AGE_MS) return null;
    return { ...parsed, origin, results: parsed.results, source: 'cache' } as MosqueSearchSnapshot;
  } catch {
    return null;
  }
}

function saveMosqueCache(snapshot: MosqueSearchSnapshot) {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(snapshot)); } catch { /* optional */ }
}

async function queryEndpoint(endpoint: string, query: string) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), SEARCH_TIMEOUT_MS);
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
      body: new URLSearchParams({ data: query }),
    });
    if (!response.ok) throw new Error(`Overpass antwortet mit ${response.status}.`);
    return await response.json() as OverpassResponse;
  } finally {
    window.clearTimeout(timeout);
  }
}

export async function fetchNearbyMosques(
  origin: MosqueSearchOrigin,
  radiusMeters = DEFAULT_RADIUS_METERS,
  forceRefresh = false,
): Promise<MosqueSearchSnapshot> {
  const cached = forceRefresh ? null : readMosqueCache(origin, radiusMeters);
  if (cached) return cached;
  const query = buildOverpassQuery(origin, radiusMeters);
  let lastError: unknown;

  for (const endpoint of OVERPASS_ENDPOINTS) {
    try {
      const payload = await queryEndpoint(endpoint, query);
      const snapshot: MosqueSearchSnapshot = {
        origin,
        radiusMeters,
        results: parseResponse(payload, origin),
        fetchedAt: new Date().toISOString(),
        source: 'live',
        endpoint,
      };
      saveMosqueOrigin(origin);
      saveMosqueCache(snapshot);
      return snapshot;
    } catch (error) {
      lastError = error;
    }
  }

  const staleCache = (() => {
    try {
      const parsed = JSON.parse(localStorage.getItem(CACHE_KEY) ?? 'null') as Partial<MosqueSearchSnapshot> | null;
      if (!parsed || !isValidOrigin(parsed.origin) || !Array.isArray(parsed.results) || !parsed.results.every(isValidResult)) return null;
      if (!coordinatesClose(parsed.origin, origin)) return null;
      return { ...parsed, origin, source: 'fallback' } as MosqueSearchSnapshot;
    } catch {
      return null;
    }
  })();
  if (staleCache) return staleCache;

  const reason = lastError instanceof Error ? lastError.message : 'Die Moschee-Suche ist derzeit nicht erreichbar.';
  throw new Error(reason);
}

export function requestMosqueLocation(): Promise<MosqueSearchOrigin> {
  if (!('geolocation' in navigator)) return Promise.reject(new Error('Standort wird von diesem Browser nicht unterstützt.'));
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => resolve({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        label: 'Dein Gerätestandort',
        source: 'device',
      }),
      (error) => reject(new Error(error.code === error.PERMISSION_DENIED ? 'Standort wurde nicht freigegeben.' : 'Standort konnte nicht ermittelt werden.')),
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 5 * 60 * 1000 },
    );
  });
}

export function getOpenStreetMapUrl(mosque: MosqueResult) {
  return `https://www.openstreetmap.org/${mosque.osmType}/${mosque.osmId}`;
}

export function getOpenStreetMapDirectionsUrl(origin: MosqueSearchOrigin, mosque: MosqueResult) {
  const route = `${origin.latitude},${origin.longitude};${mosque.latitude},${mosque.longitude}`;
  return `https://www.openstreetmap.org/directions?engine=fossgis_osrm_foot&route=${encodeURIComponent(route)}`;
}
