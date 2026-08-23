import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const read = (path) => readFile(resolve(root, path), 'utf8');
const releaseMode = process.env.NUR_RELEASE === 'true';

const [backend, redesignWorkflow, deployWorkflow] = await Promise.all([
  read('src/services/nurBackend.ts'),
  read('.github/workflows/redesign-check.yml'),
  read('.github/workflows/deploy-pages.yml'),
]);

function requireText(source, text, label) {
  if (!source.includes(text)) throw new Error(`${label} is missing required release wiring: ${text}`);
}

// Privileged credential scanning is deliberately left to the repository's
// existing secrets:check. Repeating those forbidden token patterns literally
// here would make that scanner flag its own guard. This check owns only the
// public release configuration contract.
requireText(backend, 'import.meta.env.VITE_SUPABASE_URL', 'Cloud backend');
requireText(backend, 'import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY', 'Cloud backend');

// Both real release surfaces must pass the same explicit public client config.
// A configured GitHub variable is useless if the workflow forgets to expose it
// to the process that runs the release gate/build.
for (const [workflow, label] of [
  [redesignWorkflow, 'Main PR release-readiness workflow'],
  [deployWorkflow, 'GitHub Pages deployment workflow'],
]) {
  requireText(workflow, "NUR_RELEASE: 'true'", label);
  requireText(workflow, 'VITE_SUPABASE_URL: ${{ vars.VITE_SUPABASE_URL }}', label);
  requireText(workflow, 'VITE_SUPABASE_PUBLISHABLE_KEY: ${{ vars.VITE_SUPABASE_PUBLISHABLE_KEY }}', label);
}

if (!releaseMode) {
  console.log('Backend release config: development mode permits the documented local fallback. NUR_RELEASE=true requires explicit GitHub/environment Supabase configuration.');
  process.exit(0);
}

const rawUrl = String(process.env.VITE_SUPABASE_URL ?? '').trim();
const publishableKey = String(process.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? '').trim();

if (!rawUrl) {
  throw new Error('Release blocked: VITE_SUPABASE_URL is missing. Configure an explicit active production Supabase project; release builds may not silently use the source fallback.');
}
if (!publishableKey) {
  throw new Error('Release blocked: VITE_SUPABASE_PUBLISHABLE_KEY is missing. Configure the production project publishable key as a GitHub/environment variable.');
}
if (!publishableKey.startsWith('sb_publishable_') || publishableKey.length < 30) {
  throw new Error('Release blocked: VITE_SUPABASE_PUBLISHABLE_KEY is not a modern Supabase publishable key (expected sb_publishable_...). Never place a privileged server credential in the browser build.');
}
if (/\s/.test(publishableKey)) {
  throw new Error('Release blocked: VITE_SUPABASE_PUBLISHABLE_KEY contains whitespace.');
}

let url;
try {
  url = new URL(rawUrl);
} catch {
  throw new Error('Release blocked: VITE_SUPABASE_URL is not a valid URL.');
}

if (url.protocol !== 'https:') {
  throw new Error('Release blocked: VITE_SUPABASE_URL must use HTTPS.');
}
if (!/^[a-z0-9]{20}\.supabase\.co$/i.test(url.hostname)) {
  throw new Error(`Release blocked: VITE_SUPABASE_URL must point to a Supabase project host, received ${url.hostname}.`);
}
if ((url.pathname && url.pathname !== '/') || url.search || url.hash || url.username || url.password) {
  throw new Error('Release blocked: VITE_SUPABASE_URL must be the project root only (https://<project-ref>.supabase.co).');
}

const projectRef = url.hostname.split('.')[0];
console.log(`Backend release config verified for explicit Supabase project ${projectRef}. This static gate validates configuration shape and prevents silent fallback; live project health still requires an external backend check before release.`);
