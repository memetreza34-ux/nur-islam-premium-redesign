const PREMIUM_ASSET_PREFIX = 'premium-assets/high-res-objects/';

const PREMIUM_ASSET_ALIASES: Record<string, string> = {
  'qibla-compass.png': 'home-qibla-illustrated-v3.webp',
  'nur-logo-emblem-v3.svg': 'nur-logo-mosque-3d-v1.webp',
  'nur-logo-emblem.webp': 'nur-logo-mosque-3d-v1.webp',
  'nur-logo-emblem.png': 'nur-logo-mosque-3d-v1.webp',
  'nur-logo-emblem-v2.webp': 'nur-logo-mosque-3d-v1.webp',
  'mosque-gold.webp': 'prayer-companion-mosque-v1.webp',
  'mosque-gold.png': 'prayer-companion-mosque-v1.webp',
  'mosque.webp': 'prayer-companion-mosque-v1.webp',
  // The older raster is truncated; retain its route with the intact replacement.
  'mosque-gold-v2.webp': 'prayer-companion-mosque-v1.webp',
  'quran-closed.webp': 'learn-hub-book-v1.webp',
  'quran-closed.png': 'learn-hub-book-v1.webp',
  'quran-open.webp': 'learn-hub-book-v1.webp',
  'tasbih.webp': 'home-dhikr-illustrated-v3.webp',
  'qibla-compass.webp': 'home-qibla-illustrated-v3.webp',
  'qibla.webp': 'home-qibla-illustrated-v3.webp',
  'mihrab.webp': 'home-learn-prayer-v5.webp',
  'lantern.webp': 'home-duas-v5.webp',
  'kaaba.webp': 'learn-hub-hajj-v1.webp',
};

function normalizedBaseUrl() {
  const base = import.meta.env.BASE_URL || '/';
  return base.endsWith('/') ? base : `${base}/`;
}

function normalizeBundledPath(path: string) {
  const normalized = path.replace(/^\.\//, '').replace(/^\/+/, '');
  if (!normalized.startsWith(PREMIUM_ASSET_PREFIX)) return normalized;

  let fileName = normalized.slice(PREMIUM_ASSET_PREFIX.length);
  const visited = new Set<string>();
  while (PREMIUM_ASSET_ALIASES[fileName] && !visited.has(fileName)) {
    visited.add(fileName);
    fileName = PREMIUM_ASSET_ALIASES[fileName];
  }
  return `${PREMIUM_ASSET_PREFIX}${fileName}`;
}

export function resolveAppPath(path: string) {
  if (!path) return normalizedBaseUrl();
  if (/^(?:[a-z]+:)?\/\//i.test(path) || path.startsWith('data:') || path.startsWith('blob:') || path.startsWith('#')) {
    return path;
  }

  const base = normalizedBaseUrl();
  if (path.startsWith(base)) {
    const relativePath = path.slice(base.length);
    return `${base}${normalizeBundledPath(relativePath)}`;
  }

  return `${base}${normalizeBundledPath(path)}`;
}

export function versionAppPath(path: string, version: string) {
  const resolved = resolveAppPath(path);
  const separator = resolved.includes('?') ? '&' : '?';
  return `${resolved}${separator}v=${encodeURIComponent(version)}`;
}
