// Bundles the artifact build into one self-contained HTML file:
// script and stylesheet inlined, public assets rewritten to data: URIs, and
// the Quran JSON served from an in-page map through a fetch shim — the page
// is published as a single file, so nothing can be requested from disk.
import { readFileSync, writeFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

const BUILD = 'dist-artifact';
const PUBLIC = 'public';
const OUT = process.argv[2] || 'nur-islam-preview.html';

const MIME = {
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
};

const dataUri = (file) => {
  const mime = MIME[extname(file)] || 'application/octet-stream';
  return `data:${mime};base64,${readFileSync(file).toString('base64')}`;
};

const walk = (dir, out = []) => {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) walk(path, out);
    else out.push(path);
  }
  return out;
};

let js = readFileSync(join(BUILD, 'app.js'), 'utf8');
let css = readFileSync(join(BUILD, 'app.css'), 'utf8');

// @fontsource embeds every face as base64, which alone is 2.2 MB. The same
// three families come from Google Fonts, which the artifact CSP allows, so the
// @font-face blocks are dropped and the families linked instead.
const fontBytesBefore = css.length;
css = css.replace(/@font-face\s*\{[^}]*\}/g, '');
const fontsSaved = ((fontBytesBefore - css.length) / 1024 / 1024).toFixed(1);

// 1. Rewrite every public image path in the bundle to its data: URI.
let images = 0;
for (const file of walk(join(PUBLIC, 'premium-assets'))) {
  const webPath = file.replace(/\\/g, '/').replace(/^public\//, '');
  if (!js.includes(webPath)) continue;
  js = js.split(`"${webPath}"`).join(JSON.stringify(dataUri(file)));
  js = js.split(`"/${webPath}"`).join(JSON.stringify(dataUri(file)));
  js = js.split(`"./${webPath}"`).join(JSON.stringify(dataUri(file)));
  images++;
}
for (const icon of ['nur-app-icon.svg', 'nur-app-icon-192.png', 'nur-app-icon-512.png']) {
  const file = join(PUBLIC, icon);
  if (!existsSync(file)) continue;
  const uri = JSON.stringify(dataUri(file));
  js = js.split(`"${icon}"`).join(uri).split(`"/${icon}"`).join(uri).split(`"./${icon}"`).join(uri);
}

// 2. Embed the surah index so the Quran list is populated. The 114 full texts
// are 1.8 MB and only needed inside the reader, so they stay out; the reader
// then shows its own offline notice, which is honest about what this preview
// carries.
const quran = {};
const surahIndex = join(PUBLIC, 'data', 'quran', 'surahs.json');
if (existsSync(surahIndex)) {
  quran['data/quran/surahs.json'] = JSON.parse(readFileSync(surahIndex, 'utf8'));
}

const shim = `
<script>
// The page is one file, so requests for bundled JSON are answered from here
// rather than from the network. Anything else falls through untouched.
window.__NUR_DATA__ = ${JSON.stringify(quran)};
(function () {
  var real = window.fetch.bind(window);
  window.fetch = function (input, init) {
    var url = typeof input === 'string' ? input : (input && input.url) || '';
    var key = String(url).replace(/^.*?(data\\/quran\\/)/, '$1').split('?')[0];
    var hit = window.__NUR_DATA__[key];
    if (hit !== undefined) {
      return Promise.resolve(new Response(JSON.stringify(hit), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }));
    }
    return real(input, init);
  };
  // A service worker cannot register from a single-file page, and the install
  // prompt has nothing to install here.
  if ('serviceWorker' in navigator) {
    try { navigator.serviceWorker.register = function () { return Promise.reject(new Error('preview')); }; } catch (e) {}
  }
  try { localStorage.setItem('nur_install_prompt_dismissed', 'true'); } catch (e) {}
})();
</script>`;

const html = `<title>Nur Islam</title>
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Cormorant+Garamond:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap">
<style>
html, body { margin: 0; padding: 0; background: #00120f; }
#root { min-height: 100vh; }
</style>
<style>${css}</style>
${shim}
<div id="root"></div>
<script type="module">${js}</script>
`;

writeFileSync(OUT, html);
const mb = (Buffer.byteLength(html) / 1024 / 1024).toFixed(1);
console.log(`${OUT}: ${mb} MB — ${images} images inlined, ${fontsSaved} MB of fonts moved to Google Fonts`);
