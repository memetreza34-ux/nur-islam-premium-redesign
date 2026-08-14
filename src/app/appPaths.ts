const PREMIUM_ASSET_PREFIX = 'premium-assets/high-res-objects/';

const PREMIUM_ASSET_ALIASES: Record<string, string> = {
  'nur-logo-emblem.webp': 'nur-logo-emblem-v2.webp',
  'nur-logo-emblem.png': 'nur-logo-emblem-v2.webp',
  'mosque-gold.webp': 'mosque-gold-v2.webp',
  'mosque-gold.png': 'mosque-gold-v2.webp',
  'mosque.webp': 'mosque-gold-v2.webp',
  // All four mosque rasters are the same truncated file: the RIFF header
  // announces 24090 bytes, 14743 are present, and the VP8 chunk carrying the
  // actual picture is missing — only the alpha channel survived. Chromium
  // decodes it as 0x0, which is what the earlier note here observed.
  //
  // It used to point at mosque-gold-v2.svg, a flat vector sketch that looked
  // nothing like the photography everywhere else in the app. The dome is a
  // real photograph of the same subject — dome, minarets, crescent — and it is
  // intact, so Home, the splash and the onboarding now match the rest.
  //
  // Repairing the original is not possible: the image data is not in the file
  // and no earlier commit has it either.
  'mosque-gold-v2.webp': 'dome-v2.webp',
  'quran-closed.webp': 'quran-closed-v2.webp',
  'quran-closed.png': 'quran-closed-v2.webp',
  'quran-open.webp': 'quran-open-v2.webp',
  'tasbih.webp': 'tasbih-v2.webp',
  'qibla-compass.webp': 'qibla-compass-v2.webp',
  'qibla.webp': 'qibla-compass-v2.webp',
  'mihrab.webp': 'mihrab-v2.webp',
  'lantern.webp': 'lantern-v2.webp',
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
