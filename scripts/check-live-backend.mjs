const rawUrl = String(process.env.VITE_SUPABASE_URL ?? '').trim().replace(/\/$/, '');
const publishableKey = String(process.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? '').trim();

if (!rawUrl || !publishableKey) {
  console.error('Live backend check requires VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.');
  process.exit(2);
}

let projectUrl;
try {
  projectUrl = new URL(rawUrl);
} catch {
  console.error('Live backend check: VITE_SUPABASE_URL is not a valid URL.');
  process.exit(2);
}

if (projectUrl.protocol !== 'https:' || !/^[a-z0-9]{20}\.supabase\.co$/i.test(projectUrl.hostname)) {
  console.error('Live backend check: expected an HTTPS Supabase project root URL.');
  process.exit(2);
}
if (!publishableKey.startsWith('sb_publishable_')) {
  console.error('Live backend check: expected a modern sb_publishable_ client key.');
  process.exit(2);
}

const failures = [];
const passes = [];
const tables = ['nur_islam_profiles', 'nur_islam_user_state', 'nur_islam_notes'];

function record(ok, label, detail = '') {
  if (ok) {
    passes.push(label);
    console.log(`  PASS  ${label}`);
  } else {
    failures.push(`${label}${detail ? ` — ${detail}` : ''}`);
    console.log(`  FAIL  ${label}${detail ? `\n        ${detail}` : ''}`);
  }
}

async function request(path, init = {}, attempts = 3) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(`${rawUrl}${path}`, {
        ...init,
        headers: {
          apikey: publishableKey,
          ...init.headers,
        },
        signal: AbortSignal.timeout(10_000),
      });
      if (response.status < 500 || attempt === attempts) return response;
      lastError = new Error(`HTTP ${response.status}`);
    } catch (error) {
      lastError = error;
      if (attempt === attempts) throw error;
    }
    await new Promise((resolve) => setTimeout(resolve, 1_000));
  }
  throw lastError ?? new Error('request failed');
}

console.log(`\nLive backend release smoke: ${projectUrl.hostname}\n`);

try {
  const authHealth = await request('/auth/v1/health');
  record(authHealth.ok, 'Supabase Auth is reachable', `status ${authHealth.status}`);
} catch (error) {
  record(false, 'Supabase Auth is reachable', error instanceof Error ? error.message : String(error));
}

try {
  const authSettings = await request('/auth/v1/settings');
  record(authSettings.ok, 'publishable key reaches Auth API', `status ${authSettings.status}`);
} catch (error) {
  record(false, 'publishable key reaches Auth API', error instanceof Error ? error.message : String(error));
}

try {
  const restRoot = await request('/rest/v1/');
  record(restRoot.ok, 'publishable key reaches REST API', `status ${restRoot.status}`);
} catch (error) {
  record(false, 'publishable key reaches REST API', error instanceof Error ? error.message : String(error));
}

for (const table of tables) {
  try {
    const response = await request(`/rest/v1/${table}?select=user_id&limit=1`);
    const body = response.ok ? await response.json().catch(() => null) : null;
    const safe = response.ok && Array.isArray(body) && body.length === 0;
    record(
      safe,
      `anonymous read returns zero rows from ${table}`,
      response.ok
        ? `expected [], received ${Array.isArray(body) ? `${body.length} row(s)` : 'a non-array response'}`
        : `REST status ${response.status}`,
    );
  } catch (error) {
    record(false, `anonymous read returns zero rows from ${table}`, error instanceof Error ? error.message : String(error));
  }
}

try {
  const erasureRpc = await request('/rest/v1/rpc/delete_nur_islam_data', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '{}',
  });
  record(
    !erasureRpc.ok,
    'anonymous caller cannot execute delete_nur_islam_data',
    erasureRpc.ok ? `dangerous success status ${erasureRpc.status}` : `blocked with status ${erasureRpc.status}`,
  );
} catch (error) {
  // A transport failure is not accepted here because the preceding REST probes
  // already established that the project should be reachable. Keep it visible.
  record(false, 'anonymous caller cannot execute delete_nur_islam_data', error instanceof Error ? error.message : String(error));
}

console.log(`\n${passes.length} passed, ${failures.length} failed`);
if (failures.length) {
  console.error('\nLive backend release smoke FAILED:');
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}

console.log('Live backend release smoke passed: Auth/REST are reachable and anonymous access remains constrained by the expected release boundary.');
