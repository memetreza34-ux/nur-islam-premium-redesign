/**
 * Two-user RLS negative test against a live Supabase project.
 *
 * This is deliberately NOT part of `npm run check`: it needs network access and
 * two real throwaway accounts, so it stays a manual release gate.
 *
 * Run it against a staging project if you have one. Against production it only
 * writes and removes a single note owned by user B.
 *
 *   NUR_SUPABASE_URL=https://<project>.supabase.co \
 *   NUR_SUPABASE_KEY=<publishable/anon key> \
 *   NUR_TEST_A_EMAIL=a@example.com NUR_TEST_A_PASSWORD=... \
 *   NUR_TEST_B_EMAIL=b@example.com NUR_TEST_B_PASSWORD=... \
 *   npm run rls:verify
 *
 * Both accounts must already exist and be confirmed.
 */

const url = (process.env.NUR_SUPABASE_URL || '').replace(/\/$/, '');
const key = process.env.NUR_SUPABASE_KEY || '';
const accounts = {
  A: { email: process.env.NUR_TEST_A_EMAIL, password: process.env.NUR_TEST_A_PASSWORD },
  B: { email: process.env.NUR_TEST_B_EMAIL, password: process.env.NUR_TEST_B_PASSWORD },
};

const missing = [
  ['NUR_SUPABASE_URL', url],
  ['NUR_SUPABASE_KEY', key],
  ['NUR_TEST_A_EMAIL', accounts.A.email],
  ['NUR_TEST_A_PASSWORD', accounts.A.password],
  ['NUR_TEST_B_EMAIL', accounts.B.email],
  ['NUR_TEST_B_PASSWORD', accounts.B.password],
].filter(([, value]) => !value).map(([name]) => name);

if (missing.length) {
  console.error(`Missing environment variables: ${missing.join(', ')}`);
  console.error('See the header of scripts/verify-rls.mjs for the expected setup.');
  process.exit(2);
}

const TABLES = ['nur_islam_profiles', 'nur_islam_user_state', 'nur_islam_notes'];
const failures = [];
const passes = [];

function record(ok, label, detail) {
  if (ok) {
    passes.push(label);
    console.log(`  PASS  ${label}`);
  } else {
    failures.push(`${label} — ${detail}`);
    console.log(`  FAIL  ${label}\n        ${detail}`);
  }
}

async function signIn(label) {
  const account = accounts[label];
  const response = await fetch(`${url}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: { apikey: key, 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: account.email, password: account.password }),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || !payload.access_token || !payload.user?.id) {
    throw new Error(`Sign-in for user ${label} failed: ${payload.error_description || payload.msg || response.status}`);
  }
  return { token: payload.access_token, id: payload.user.id };
}

function rest(path, { token, ...init } = {}) {
  return fetch(`${url}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: key,
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
  });
}

async function rows(response) {
  if (!response.ok) return null;
  const body = await response.json().catch(() => null);
  return Array.isArray(body) ? body : null;
}

console.log(`\nRLS negative test against ${url}\n`);

const a = await signIn('A');
const b = await signIn('B');

if (a.id === b.id) {
  console.error('User A and user B resolved to the same account. Use two distinct test accounts.');
  process.exit(2);
}

console.log('Anonymous access');
for (const table of TABLES) {
  const response = await rest(`${table}?select=user_id`);
  const body = await rows(response);
  record(
    !response.ok || (body && body.length === 0),
    `anon cannot read ${table}`,
    `expected an error or zero rows, got status ${response.status} with ${body ? body.length : '?'} rows`,
  );
}

console.log('\nCross-user reads');
for (const table of TABLES) {
  const response = await rest(`${table}?user_id=eq.${b.id}&select=user_id`, { token: a.token });
  const body = await rows(response);
  record(
    !response.ok || (body && body.length === 0),
    `A cannot read B rows in ${table}`,
    `expected zero rows, got status ${response.status} with ${body ? body.length : '?'} rows`,
  );
}

console.log('\nCross-user writes');
const forgedInsert = await rest('nur_islam_notes', {
  token: a.token,
  method: 'POST',
  headers: { Prefer: 'return=representation' },
  body: JSON.stringify({ user_id: b.id, title: 'rls-probe', body: 'should never be stored' }),
});
record(
  !forgedInsert.ok,
  'A cannot insert a note owned by B',
  `expected the insert to be rejected, got status ${forgedInsert.status}`,
);
if (forgedInsert.ok) {
  const created = await rows(forgedInsert);
  for (const row of created ?? []) {
    await rest(`nur_islam_notes?id=eq.${row.id}`, { token: b.token, method: 'DELETE' });
  }
}

const seed = await rest('nur_islam_notes', {
  token: b.token,
  method: 'POST',
  headers: { Prefer: 'return=representation' },
  body: JSON.stringify({ user_id: b.id, title: 'rls-probe', body: 'owned by B' }),
});
const seededRows = await rows(seed);
const target = seededRows?.[0];

if (!target) {
  record(false, 'seed a note as B for the update/delete probes', `could not create the note, status ${seed.status}`);
} else {
  const update = await rest(`nur_islam_notes?id=eq.${target.id}`, {
    token: a.token,
    method: 'PATCH',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify({ title: 'hijacked' }),
  });
  const updated = await rows(update);
  record(
    !update.ok || (updated && updated.length === 0),
    'A cannot update a note owned by B',
    `expected zero affected rows, got status ${update.status} with ${updated ? updated.length : '?'} rows`,
  );

  const remove = await rest(`nur_islam_notes?id=eq.${target.id}`, {
    token: a.token,
    method: 'DELETE',
    headers: { Prefer: 'return=representation' },
  });
  const removed = await rows(remove);
  record(
    !remove.ok || (removed && removed.length === 0),
    'A cannot delete a note owned by B',
    `expected zero affected rows, got status ${remove.status} with ${removed ? removed.length : '?'} rows`,
  );

  const stillThere = await rows(await rest(`nur_islam_notes?id=eq.${target.id}&select=id,title`, { token: b.token }));
  record(
    stillThere?.length === 1 && stillThere[0].title === 'rls-probe',
    'B still owns an untouched note after A probed it',
    `expected the original note to survive unchanged, got ${JSON.stringify(stillThere)}`,
  );

  await rest(`nur_islam_notes?id=eq.${target.id}`, { token: b.token, method: 'DELETE' });
}

console.log('\nOwn-data sanity');
const ownProfile = await rest(`nur_islam_profiles?user_id=eq.${a.id}&select=user_id`, { token: a.token });
record(ownProfile.ok, 'A can still reach its own profile row', `expected a readable response, got status ${ownProfile.status}`);

console.log(`\n${passes.length} passed, ${failures.length} failed`);
if (failures.length) {
  console.error('\nRLS negative test FAILED:');
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}
console.log('RLS negative test passed: cross-user reads and writes are blocked and anonymous access is denied.');
