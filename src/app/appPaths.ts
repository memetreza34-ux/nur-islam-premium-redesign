const PREMIUM_ASSET_PREFIX = 'premium-assets/high-res-objects/';

const PREMIUM_ASSET_ALIASES: Record<string, string> = {
  'nur-logo-emblem.webp': 'nur-logo-emblem-v2.webp',
  'nur-logo-emblem.png': 'nur-logo-emblem-v2.webp',
  'mosque-gold.webp': 'mosque-gold-v2.webp',
  'mosque-gold.png': 'mosque-gold-v2.webp',
  'mosque.webp': 'mosque-gold-v2.webp',
  // This redirect is why Home, the splash and the onboarding show a flat vector
  // sketch where the code asks for the mosque photograph, and why Home looks
  // unlike the rest of the app.
  //
  // Its stated reason — "the archived mosque raster decodes as 0x0 in
  // Chromium" — is only half true, and the half that is true is a dev-server
  // artifact. Measured: the file is a valid VP8X WebP at 387x267; Chromium
  // decodes it at 387x267 when requested without a query string, and fails
  // only with the `?v=` cache-busting parameter, which Vite's dev server
  // treats as a module query. `vite preview` serves the same URL, query and
  // all, as 14751 bytes of image/webp.
  //
  // Removing it therefore looks safe but is not yet proven: the production
  // preview would not boot the app far enough to confirm the image renders
  // there, so this stays until someone checks it on the built site.
  'mosque-gold-v2.webp': 'mosque-gold-v2.svg',
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
