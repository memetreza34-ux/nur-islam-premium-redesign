/**
 * Repository-wide secret scan.
 *
 * The repository is public, so anything committed here is readable by anyone
 * and stays in the history even after a later deletion. A leaked service-role
 * key would bypass row-level security entirely and expose every account's data.
 *
 * Scans tracked files only: untracked scratch files are not published, and
 * node_modules would swamp the signal.
 *
 * The Supabase publishable/anon key is deliberately not flagged. It is designed
 * to sit in a browser bundle and is scoped by row-level security; treating it
 * as a secret would train people to ignore this check.
 */
import { execFile } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { promisify } from 'node:util';
import { resolve } from 'node:path';

const run = promisify(execFile);
const root = process.cwd();

const patterns = [
  { name: 'Supabase service-role key', re: /service_role/i },
  { name: 'JWT with service_role claim', re: /eyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\./ },
  { name: 'Supabase secret key', re: /\bsb_secret_[A-Za-z0-9_-]{10,}/ },
  { name: 'private key block', re: /-----BEGIN (RSA |EC |OPENSSH |PGP )?PRIVATE KEY-----/ },
  { name: 'AWS access key id', re: /\bAKIA[0-9A-Z]{16}\b/ },
  { name: 'GitHub token', re: /\bgh[pousr]_[A-Za-z0-9]{20,}\b/ },
  { name: 'Slack token', re: /\bxox[abprs]-[A-Za-z0-9-]{10,}\b/ },
  { name: 'OpenAI key', re: /\bsk-[A-Za-z0-9]{32,}\b/ },
  { name: 'Postgres connection string with password', re: /postgres(ql)?:\/\/[^\s:@]+:[^\s@]+@/ },
];

// Files that legitimately describe these patterns rather than contain a secret.
const selfReferential = new Set(['scripts/check-secrets.mjs', 'scripts/check-release-hardening.mjs']);

const { stdout } = await run('git', ['ls-files'], { cwd: root });
const files = stdout.split('\n').filter(Boolean);

const findings = [];
let scanned = 0;

for (const file of files) {
  if (selfReferential.has(file)) continue;
  if (/\.(png|jpe?g|webp|gif|ico|woff2?|ttf|otf|mp3|mp4|pdf)$/i.test(file)) continue;

  if (/(^|\/)\.env($|\.)/.test(file) && !file.endsWith('.env.example')) {
    findings.push(`${file}: an environment file is tracked; it belongs in .gitignore`);
    continue;
  }

  let content;
  try {
    content = await readFile(resolve(root, file), 'utf8');
  } catch {
    continue;
  }
  scanned += 1;

  for (const { name, re } of patterns) {
    const match = content.match(re);
    if (match) {
      const line = content.slice(0, match.index).split('\n').length;
      findings.push(`${file}:${line}: possible ${name}`);
    }
  }
}

if (findings.length) {
  throw new Error(
    `Secrets must not be committed to a public repository:\n  ${findings.join('\n  ')}\n`
    + '  Rotate anything real that appears here: history keeps it even after deletion.',
  );
}

console.log(`Secret scan verified: ${scanned} tracked files carry no service-role key, private key or provider token.`);
