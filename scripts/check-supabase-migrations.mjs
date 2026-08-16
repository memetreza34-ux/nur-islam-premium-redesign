/**
 * Guards the migration folder and the contract between it and the client.
 *
 * Every rule here exists because the thing it forbids was actually in the tree:
 * file names the Supabase CLI cannot parse, policies that cannot be replayed,
 * columns the app had stopped reading, and timestamps the client set itself
 * while the database was supposed to own them.
 */
import { readdir, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const migrationDir = resolve(root, 'supabase/migrations');
const files = (await readdir(migrationDir)).filter((name) => name.endsWith('.sql')).sort();

if (files.length === 0) throw new Error('No Supabase migrations found.');

// The CLI reads the digits before the first underscore as the version and
// compares them with what the project has applied. Anything but a full
// YYYYMMDDHHMMSS stamp silently becomes a migration it believes is pending.
const seen = new Map();
for (const file of files) {
  const match = /^(\d+)_([a-z0-9_]+)\.sql$/.exec(file);
  if (!match) {
    throw new Error(`Migration file name must be <14-digit version>_<snake_case_name>.sql: ${file}`);
  }
  const [, version] = match;
  if (version.length !== 14) {
    throw new Error(`Migration version must be a 14-digit YYYYMMDDHHMMSS stamp, got ${version.length} digits: ${file}`);
  }
  if (seen.has(version)) {
    throw new Error(`Duplicate migration version ${version}: ${seen.get(version)} and ${file}`);
  }
  seen.set(version, file);
}

const sources = new Map();
for (const file of files) {
  sources.set(file, await readFile(resolve(migrationDir, file), 'utf8'));
}
const combined = [...sources.values()].join('\n');

// `create policy` has no `if not exists` form, so replaying a file that creates
// one against a database that already has it aborts the whole push.
for (const [file, sql] of sources) {
  const lines = sql.split('\n');
  lines.forEach((line, index) => {
    const created = /^create policy "([^"]+)" on (\S+)/.exec(line.trim());
    if (!created) return;
    const [, name, table] = created;
    const guard = `drop policy if exists "${name}" on ${table};`;
    if (!lines.slice(0, index).some((earlier) => earlier.trim() === guard)) {
      throw new Error(`${file}: policy "${name}" is created without a preceding "${guard}", so the file cannot be replayed.`);
    }
  });
}

for (const [file, sql] of sources) {
  for (const forbidden of ['disable row level security', 'grant all', 'to anon', 'security definer']) {
    if (sql.toLowerCase().includes(forbidden)) {
      throw new Error(`${file} contains a forbidden statement: ${forbidden}`);
    }
  }
}

const backend = await readFile(resolve(root, 'src/services/nurBackend.ts'), 'utf8');

// A column the migrations dropped must not survive as a field the client still
// believes in.
for (const match of combined.matchAll(/drop column if exists (\w+)/g)) {
  const column = match[1];
  if (new RegExp(`\\b${column}\\s*:`).test(backend)) {
    throw new Error(`Column ${column} was dropped by a migration but nurBackend.ts still carries it as a field.`);
  }
}

// updated_at belongs to the database. If the trigger is ever removed, the
// client would have to send it again, and this pairing is what says so.
for (const table of ['nur_islam_profiles', 'nur_islam_user_state', 'nur_islam_notes']) {
  const trigger = new RegExp(`create trigger \\w+\\s+before insert or update on public\\.${table}`, 'i');
  if (!trigger.test(combined)) {
    throw new Error(`No before-insert-or-update trigger stamps updated_at on ${table}.`);
  }
}
if (/\bupdated_at:\s*(new Date\(\)|now\b)/.test(backend)) {
  throw new Error('nurBackend.ts sends updated_at; a database trigger owns that column.');
}

// The backup records a schema version so a newer payload cannot be poured into
// an older build. Reading it without acting on it would leave that unkept.
if (!backend.includes('cloud.schema_version > STORAGE_SCHEMA_VERSION')) {
  throw new Error('restoreCloudState does not refuse a backup newer than STORAGE_SCHEMA_VERSION.');
}

console.log(`Supabase migrations verified: ${files.length} files carry parseable versions, every policy is replayable, no dropped column survives in the client, updated_at is trigger-owned on all three tables, and restore refuses a newer schema version.`);
