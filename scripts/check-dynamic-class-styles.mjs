/**
 * Class names the app builds at runtime still need their styles.
 *
 * Dead-CSS sweeps here have been proven by grepping `dist/assets/*.js` — what
 * the browser is actually served — and keeping only the names that appear
 * nowhere. That method has one blind spot, and it cost real design: a modifier
 * assembled from a variable never appears in the bundle as a literal.
 *
 *   className={`quick-card quick-card--${accent}`}   // gold | cream | emerald
 *
 * `quick-card--cream` and `quick-card--emerald` were deleted as unused. Both
 * render on Home, on four of the six cards, which lost their tint for two days
 * without a single check going red.
 *
 * This lists every prefix the app composes at runtime and insists each one
 * still has styling. It cannot know which suffixes exist, so it does not try:
 * it fails when a composed prefix has no rule at all, and it prints the whole
 * list, because the list itself is what a future sweep needs to see.
 */
import { readFile, readdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();

async function collect(directory, extension) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await collect(path, extension)));
    else if (entry.name.endsWith(extension)) files.push(path);
  }
  return files;
}

const sourceFiles = await collect(resolve(root, 'src'), '.tsx');
let css = await readFile(resolve(root, 'src/styles.css'), 'utf8');
for (const file of await collect(resolve(root, 'src/styles'), '.css')) {
  css += await readFile(file, 'utf8');
}

// Only className attributes. Template strings elsewhere build file names, keys
// and element ids — `quran-ayah-${surah}-${ayah}` is an anchor, not a class,
// and demanding a stylesheet rule for it is noise that gets a guard switched
// off rather than read.
const CLASS_ATTRIBUTE = /className=\{`([^`]*)`/g;
// `foo--${bar}` and `foo-${bar}`: the part before the interpolation is the
// prefix a stylesheet has to know about.
const COMPOSED = /([a-z][\w-]*?-{1,2})\$\{/g;

const composed = new Map();
for (const file of sourceFiles) {
  const source = await readFile(file, 'utf8');
  for (const attribute of source.matchAll(CLASS_ATTRIBUTE)) {
    for (const match of attribute[1].matchAll(COMPOSED)) {
      const prefix = match[1];
      if (prefix.length < 4 || !prefix.includes('-')) continue;
      if (!composed.has(prefix)) composed.set(prefix, new Set());
      composed.get(prefix).add(file.replace(`${root}/`, ''));
    }
  }
}

// Families whose modifier is a hook with no styling behind it, on purpose. The
// check stays strict — it asks for a rule on the modifier, not on the base
// class, because the base class surviving is exactly what made the quick-card
// loss invisible. Exceptions are listed here so they are read, not inferred.
const MODIFIER_WITHOUT_STYLES = new Map([
  ['prayer-posture-figure--', 'the posture is drawn in the SVG; the modifier only labels which figure it is'],
  ['reference-sprite--', 'the sprite picks its frame from the asset name, not from CSS'],
]);

const unstyled = [];
for (const [prefix, files] of composed) {
  if (MODIFIER_WITHOUT_STYLES.has(prefix)) continue;
  // A rule for the prefix itself counts: `.quick-card` styling the base while
  // `.quick-card--cream` tints it is the normal shape, and removing every
  // variant is what this is looking for.
  const pattern = new RegExp(`\\.${prefix.replace(/[-]/g, '\\-')}[a-z0-9]`, 'i');
  if (!pattern.test(css)) unstyled.push(`${prefix}…  (${[...files].join(', ')})`);
}

if (unstyled.length) {
  throw new Error(
    'Class names the app composes at runtime have no styles at all:\n  ' +
      `${unstyled.join('\n  ')}\n\n` +
      'A literal grep of the built JS cannot see these names, so a dead-CSS sweep will\n' +
      'report them as unused. Check the component before deleting the rule.',
  );
}

console.log(
  `Runtime-composed class names verified: ${composed.size} prefixes built from a variable, every one still styled. ` +
    'A literal grep of dist/ cannot see these — check them by hand before any dead-CSS removal.',
);
