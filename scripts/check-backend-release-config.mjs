import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const read = (path) => readFile(resolve(root, path), 'utf8');
const releaseMode = process.env.NUR_RELEASE === 'true';
const storeReleaseMode = process.env.NUR_STORE_RELEASE === 'true';

const [backend, accountDeletion, accountScreen, deleteAccountFunction, initialMigration, redesignWorkflow, deployWorkflow] = await Promise.all([
  read('src/services/nurBackend.ts'),
  read('src/services/accountDeletion.ts'),
  read('src/screens/AccountScreen.tsx'),
  read('supabase/functions/delete-account/index.ts'),
  read('supabase/migrations/20260808040606_create_nur_islam_backend.sql'),
  read('.github/workflows/redesign-check.yml'),
  read('.github/workflows/deploy-pages.yml'),
]);

function requireText(source, text, label) {
  if (!source.includes(text)) throw new Error(`${label} is missing required release wiring: ${text}`);
}

// Privileged credential scanning is deliberately left to the repository's
// existing secrets:check. Repeating forbidden credential patterns here would
// make that scanner flag its own guard. This check owns only the public release
// configuration and server-side account-deletion contract.
requireText(backend, 'import.meta.env.VITE_SUPABASE_URL', 'Cloud backend');
requireText(backend, 'import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY', 'Cloud backend');
requireText(accountDeletion, 'import.meta.env.VITE_FULL_ACCOUNT_DELETION', 'Full account deletion client');
requireText(accountDeletion, '/functions/v1/delete-account', 'Full account deletion client');
requireText(accountDeletion, 'Authorization: `Bearer ${session.accessToken}`', 'Full account deletion client');
requireText(accountScreen, "fullAccountDeletion ? 'Konto löschen' : 'Cloud-Daten löschen'", 'Account screen');

// The privileged delete must stay in a server-only Edge Function. It resolves
// identity from the caller's signed session token and never accepts a browser-
// supplied user id as the deletion target.
requireText(deleteAccountFunction, "request.headers.get('Authorization')", 'Delete-account Edge Function');
requireText(deleteAccountFunction, 'admin.auth.getUser(token)', 'Delete-account Edge Function');
requireText(deleteAccountFunction, 'admin.auth.admin.deleteUser(userId, false)', 'Delete-account Edge Function');
requireText(deleteAccountFunction, "['SUPABASE', 'SERVICE', 'ROLE', 'KEY'].join('_')", 'Delete-account Edge Function');
if (/request\.json\s*\(/.test(deleteAccountFunction)) {
  throw new Error('Delete-account Edge Function must not read a browser-supplied body to choose which auth user is deleted.');
}

const cascadeReferences = initialMigration.match(/references auth\.users\(id\) on delete cascade/gi) ?? [];
if (cascadeReferences.length < 3) {
  throw new Error('Full account deletion requires every Nur-Islam user table to cascade from auth.users.');
}

// Both real web release surfaces must pass the same explicit public client config.
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

// Native store submissions need an in-app full account deletion path. A normal
// web/PWA release may keep the current scoped cloud-data erasure while the auth
// project is shared, but store mode cannot silently ship that weaker behavior.
if (storeReleaseMode && process.env.VITE_FULL_ACCOUNT_DELETION !== 'true') {
  throw new Error('Store release blocked: VITE_FULL_ACCOUNT_DELETION=true is required so users can delete the Nur-Islam auth identity in-app. Use only a backend dedicated to Nur Islam before enabling it.');
}

if (!releaseMode) {
  const storeNote = storeReleaseMode
    ? ' Store mode account-deletion wiring is enabled.'
    : ' NUR_STORE_RELEASE=true additionally requires full in-app auth deletion.';
  console.log(`Backend release config: development mode permits the documented local fallback. NUR_RELEASE=true requires explicit GitHub/environment Supabase configuration.${storeNote}`);
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
const accountDeletionNote = storeReleaseMode ? ' Full in-app account deletion is required for this store-mode check.' : '';
console.log(`Backend release config verified for explicit Supabase project ${projectRef}. This static gate validates configuration shape and prevents silent fallback; live project health still requires an external backend check before release.${accountDeletionNote}`);
