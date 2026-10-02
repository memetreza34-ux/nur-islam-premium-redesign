export type Coordinates = { latitude: number; longitude: number };
export const KAABA: Coordinates = { latitude: 21.4225, longitude: 39.8262 };
const toRadians = (value: number) => value * Math.PI / 180;
export const normalizeDegrees = (value: number) => (value % 360 + 360) % 360;
export const shortestAngleDelta = (from: number, to: number) => ((to - from + 540) % 360) - 180;

export function calculateBearing(from: Coordinates, to: Coordinates) {
  const latitudeOne = toRadians(from.latitude);
  const latitudeTwo = toRadians(to.latitude);
  const longitudeDifference = toRadians(to.longitude - from.longitude);
  const y = Math.sin(longitudeDifference) * Math.cos(latitudeTwo);
  const x = Math.cos(latitudeOne) * Math.sin(latitudeTwo) - Math.sin(latitudeOne) * Math.cos(latitudeTwo) * Math.cos(longitudeDifference);
  return normalizeDegrees(Math.atan2(y, x) * 180 / Math.PI);
}

export function calculateDistance(from: Coordinates, to: Coordinates) {
  const latitudeDifference = toRadians(to.latitude - from.latitude);
  const longitudeDifference = toRadians(to.longitude - from.longitude);
  const a = Math.sin(latitudeDifference / 2) ** 2 + Math.cos(toRadians(from.latitude)) * Math.cos(toRadians(to.latitude)) * Math.sin(longitudeDifference / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(Math.max(0, 1 - a)));
}

export function getDirectionLabel(bearing: number) {
  const labels = ['Norden', 'Nordost', 'Osten', 'Südost', 'Süden', 'Südwest', 'Westen', 'Nordwest'];
  return labels[Math.round(normalizeDegrees(bearing) / 45) % labels.length];
}
