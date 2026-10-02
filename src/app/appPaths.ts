const PREMIUM_ASSET_PREFIX = 'premium-assets/high-res-objects/';

const PREMIUM_ASSET_ALIASES: Record<string, string> = {
  'nur-logo-emblem.webp': 'nur-logo-emblem-v3.svg',
  'nur-logo-emblem.png': 'nur-logo-emblem-v3.svg',
  'nur-logo-emblem-v2.webp': 'nur-logo-emblem-v3.svg',
  'mosque-gold.webp': 'mosque-heritage-v1.webp',
  'mosque-gold.png': 'mosque-heritage-v1.webp',
  'mosque.webp': 'mosque-heritage-v1.webp',
  // The older raster is truncated; retain its route with the intact replacement.
  'mosque-gold-v2.webp': 'mosque-heritage-v1.webp',
  'quran-closed.webp': 'quran-closed-v2.webp',
  'quran-closed.png': 'quran-closed-v2.webp',
  'quran-open.webp': 'quran-open-v3.webp',
  'tasbih.webp': 'tasbih-v2.webp',
  'qibla-compass.webp': 'qibla-compass-v2.webp',
  'qibla.webp': 'qibla-compass-v2.webp',
  'mihrab.webp': 'mihrab-v2.webp',
  'lantern.webp': 'lantern-v3.webp',
  'kaaba.webp': 'kaaba-v2.webp',
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
