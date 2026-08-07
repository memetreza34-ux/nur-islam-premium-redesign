function normalizedBaseUrl() {
  const base = import.meta.env.BASE_URL || '/';
  return base.endsWith('/') ? base : `${base}/`;
}

export function resolveAppPath(path: string) {
  if (!path) return normalizedBaseUrl();
  if (/^(?:[a-z]+:)?\/\//i.test(path) || path.startsWith('data:') || path.startsWith('blob:') || path.startsWith('#')) {
    return path;
  }

  const base = normalizedBaseUrl();
  if (path.startsWith(base)) return path;
  const normalizedPath = path.replace(/^\.\//, '').replace(/^\/+/, '');
  return `${base}${normalizedPath}`;
}

export function versionAppPath(path: string, version: string) {
  const resolved = resolveAppPath(path);
  const separator = resolved.includes('?') ? '&' : '?';
  return `${resolved}${separator}v=${encodeURIComponent(version)}`;
}
