/**
 * Caps the stylesheet layering so it can only shrink.
 *
 * The styles grew by adding a new override file for each visual fix instead of
 * changing the rule that caused the problem: 98 files, ~700 KB and over 2200
 * `!important`, of which 33 files carry `lock` or `parallel-pass` in the name.
 * Each layer overrides an earlier one, so the file that decides what you see is
 * no longer the file that describes the component — which is exactly why small
 * visual fixes keep needing another layer.
 *
 * This does not clean any of that up. It stops it from growing, so cleanup work
 * is not silently undone by the next fix. Every budget below is the measured
 * value at the time of writing.
 *
 * When you remove debt, lower the matching budget in the same commit. Raising a
 * budget is a deliberate decision and should be argued for in the commit
 * message, not done to make the check pass.
 */
import { readFile, readdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const styleDir = resolve(root, 'src/styles');

// Measured when this guard landed. The first thing it caught was work merged
// while it was being written: one more stylesheet and twenty more `!important`
// in a single afternoon. That growth rate is the reason for the cap, so these
// numbers start where reality was, not where it should be.
const BUDGET = {
  // Reductions, not raises. Twenty class names were styled here while the built
  // JS renders none of them — checked by grepping `dist/assets/*.js`, which is
  // what the browser actually gets, rather than trusting the source. Several
  // were held in place by these very guards, so guard and rule were removed
  // together; that pairing is the reason the debt could not shrink before.
  //
  // Premium adds one deliberately isolated stylesheet for a genuinely new
  // product surface (plans, routines, widgets, statistics and local settings),
  // rather than another lock/parallel override layer. It adds no `!important`.
  // The design system adds the 99th file, and it is the one file here that
  // exists to make the others unnecessary: a single scale per decision
  // (colour, type, space, radius, shadow) plus the mihrab arch that carries
  // the focus on every screen. It is not a 34th override layer — it is the
  // layer the overrides were standing in for.
  //
  // `!important` drops rather than grows, because the navigation moved back
  // into navigation.css and the 36 rules that were fighting it across ten
  // other stylesheets went with it — 27 of them `!important`. The bar is now
  // 68px in the document flow instead of a 96px fixed strip over the content,
  // and the active tab is marked by an arch cap rather than a pill that
  // clipped its own label.
  // Legal/about, the redesigned learning library and the mosque finder are
  // distinct new surfaces. The current tree has 103 sheets after obsolete
  // assistant styles were removed; this remains a no-growth ratchet.
  files: 103,
  overrideFiles: 33,
  // Raised for the design system's 248 `!important`, which is what it costs to
  // settle 98 stylesheets that already declare the same properties that way —
  // and only for properties an earlier layer actually pins. It buys: the arch
  // on four screens, one type scale, six times on a row, and every number in
  // tabular Inter.
  //
  // Paid for by deleting what the redesign made dead rather than leaving it:
  // 196 rules across sixteen files, 71 of them `!important` and 26 KB, for
  // elements no screen renders any more — the whole welcome hero, the prayer
  // tracker card, the hero orb and the four next-prayer-panel parts the arch
  // replaced. Without that sweep this number would be ~2483.
  // The mosque-finder hero and restored responsive surfaces account for the
  // measured increase. Their override debt is recorded, not treated as solved.
  importantRules: 2349,
  // Raised three times now, each for surface that did not exist: the prayer
  // sequence (Arabic wording, transliteration and German meaning for every
  // spoken step), the calendar's occasions, which now explain what a day is and
  // what is done on it rather than only marking it, and the prayer course's
  // posture drawings — one figure per step, plus the repetition count („3×“)
  // and the aloud/silent note, none of which the screen had a place for.
  // All of them live in the file that owns the component, not in a 34th layer
  // correcting an older one — the distinction this budget exists to make
  // visible. None needed `!important`: the calendar won on specificity
  // (`.calendar-event-card p.x` outranks `.calendar-event-card p`) and the
  // figures are new class names nothing else styles, which is the cheaper way
  // to win.
  //
  // The raise is smaller than the block that caused it, because restructuring
  // the course took rules out with it — eight of them `!important`, which is
  // why that budget drops in the same commit. What went: the summary card that
  // repeated the Rakʿah count a third time, the header's headline and lead
  // paragraph with the rules that coloured them, the course's own Rakʿah
  // back/forward buttons (a second route through the same sequence), and the
  // three responsive stages that existed only to place an oversized picture in
  // that header. One removal also settled a live conflict:
  // `.reference-rakah-practice p` would have re-coloured the new aloud/silent
  // note, which is a `<p>` in the same section.
  //
  // Raised once more for the recitation button, the source line under each
  // step's wording, and the run list that prints that wording once per spoken
  // repetition — the prayer steps were the last content in the app showing
  // Arabic with no attribution at all, and a "3×" badge over a single paragraph
  // left the person practising to count in their head. Same rule as above: new
  // class names in the file that owns the component, no `!important`, no new
  // layer.
  //
  // And once for the per-step comparison of the four Sunni schools of law. The
  // course used to say only that „details differ between the schools“, which is
  // true and helps nobody; the block that says how is collapsed by default, so
  // it costs rules but no attention.
  //
  // Zuletzt für den Kommentar an der Kopfzeile, die jetzt auf jedem Bildschirm
  // klebt statt nur auf Detailseiten — auf den langen Seiten musste man zum
  // Zurückgehen sonst erst wieder ganz nach oben scrollen. Die Regel gab es
  // schon; sie war nur zu eng adressiert.
  //
  // Und für den Durchlauf: ein Knopf über dem Schritt, plus die Kennzeichnung,
  // welcher Schritt gerade läuft. Er ist der Grund, warum der Kurs beim Üben
  // die Hände frei lässt — man betet mit, statt zwischen den Positionen zum
  // Weitertippen zu greifen.
  // Raised by ~1 KB to put back four rules that were removed as dead and were
  // not: `.quick-card--cream` and `.quick-card--emerald`, plain and scoped by
  // `.quick-grid--v2`. App.tsx renders them as `quick-card--${accent}`, which
  // never spells the name out in the built JS, so the grep that proved the
  // sweep could not see them and four of the six cards on Home went untinted
  // for two days. Growth that restores shipped design is the one raise this
  // budget is meant to allow; dynamic-classes:check now fails before such a
  // removal can land again.
  // Premium's new isolated surface adds exactly 21,161 bytes and no lock layer.
  // The design system, isolated splash choreography and the responsive Home
  // mihrab with edge-only ambient light stay in the existing final layer.
  // Removing the chat surface also removes its selectors from shared layers.
  // The open Quran composition removes the obsolete boxed-hero overrides.
  // Isolated Wudu step card, image area and pronunciation: no override file or !important.
  // Frameless Wudu chooser: explicit native-button reset, current-step marker, aligned actions.
  // Functional SVG Qibla dial replaces the image stage: ticks, sensor rotation,
  // alignment feedback and reduced motion in the owner file. Nine old !important
  // removed; three scoped type fixes replace unreadable 8px control instructions.
  // Sculpted Qibla bezel and reduced-motion-aware light replace bitmap hub styles (+70 B).
  // The rebuilt five-prayer course adds one compact step chooser, seven
  // posture-image states and visibly separated Arabic, pronunciation and
  // meaning. It stays in the existing design-system owner file; deleting the
  // obsolete hero-art lock rules lowers the !important budget at the same time.
  // The course header now uses its existing time landscape as a full-width
  // prayer window instead of squeezing it into the obsolete 148px object slot.
  // Its responsive type and progress composition add no override layer or
  // !important declaration.
  // The Quran reader now has two genuinely new per-Ayah text regions:
  // pronunciation in Latin script and a separately labelled German meaning.
  // Their hierarchy lives in the existing Quran geometry owner; the former
  // cream-card override was replaced, no stylesheet or override layer added.
  // The prayer page now owns a real dual-date calendar instead of linking to a
  // hidden utility screen. Its month grid, selected-day ledger, date legend,
  // upcoming-event list, narrow-phone layout and light theme live in the
  // existing prayer/calendar owner file and add no override layer or !important.
  // The learning course now owns its guided, collapsible course plan and
  // readable topic-detail cards instead of stacking persistent selectors.
  // The Prophets area adds a real 25-course catalogue, numbered chapter rail,
  // long-form lesson hierarchy, course orientations, explicit knowledge
  // boundaries, learning goals, comprehension questions, Quran-source chips
  // and chapter navigation. It stays in the existing design-system owner file,
  // adds no override layer and removes every new `!important` before raising.
  // Each of the 25 course introductions now also exposes one sourced core fact
  // per chapter. The added list hierarchy is a new component state in the same
  // owner file, not an override layer; `!important` and file counts stay fixed.
  // The V1 learning state adds one compact status rail, interactive source
  // links and a completion state inside that same owner. No duplicate selector
  // layer, extra stylesheet or `!important` rule was introduced.
  // The four-school catalogue is a genuinely new reading surface: equal 2×2
  // overview, one guided detail page, source links and compact mobile states.
  // It lives in the existing design-system owner and adds no override file.
  // Shared reading chapters for the four user-requested foundation entries.
  // One component in the existing learning stylesheet; no new override file
  // or !important. Replaces the repeated illustrated legacy hero visually.
  // The rebuilt Qibla guide adds a compact SVG instrument, live turn guidance,
  // integrated level, alignment state and calibration help in this same owner
  // stylesheet. It adds no override file and no !important declaration.
  // The Quran reader now has two continuous-book layouts alongside its existing
  // verse cards. The styles stay in the Quran owner file and replace the obsolete
  // three-label legend without adding an override file or !important declaration.
  // Long surahs now use real reading pages with previous/next navigation,
  // automatic position memory and one explicit reading marker. Those new,
  // owner-scoped controls add no stylesheet or !important declaration.
  // The Learn overview is now a distinct guided-library surface with chapter
  // navigation, three art-directed headers and compact prayer practice. Its
  // owner stylesheet adds no lock layer and no !important declaration.
  // Illustrated preparation shortcuts and five daypart prayer cards use their
  // own scoped layout instead of legacy icon rules; no new file or !important.
  // Light-theme contrast for those new prayer cards and the calendar ledger is
  // defined in their existing owner files, with no new layer or !important.
  // Seven distinct learning-card illustrations now have one shared, scoped art
  // slot in the same owner file; it replaces unrelated repeated imagery without
  // adding another stylesheet or any !important declaration.
  // The prayer screen now adds its first long-term timetable: adjacent-day
  // navigation, a compact five-prayer month ledger and its light theme. All
  // 5,123 bytes stay in
  // the existing live-prayer owner, without another file or `!important` rule.
  // Six prayer companion links now share one art-directed card system with
  // subject-specific imagery, two editorial feature cards and one narrow-phone
  // layout in the existing prayer owner; no override file or `!important` rule.
  // The 114-Surah catalogue now replaces its compressed data rows with one
  // owned folio-card system: Quran seals, Arabic typography, truthful Ayah
  // extent and narrow-phone/light-theme states. The 18 pinned declarations
  // replace equally pinned legacy row geometry without adding a lock layer.
  // The bookmark's existing hit area now also owns its centering, so its icon
  // cannot be clipped at the card edge; German digits remain inside the seal.
  // Home's date control now reads as quiet metadata instead of a second card;
  // its narrow-phone wrapping lives in the same design-system owner.
  // The complete More directory adds four semantic group headers for 33
  // existing destinations. The 1,126 bytes include the narrow service-card
  // wrap fix, live in this same owner file and add neither an override layer
  // nor an `!important` declaration.
  // The Islamic places screen is now a six-stop editorial atlas with an image
  // mosaic, region route, sourced place profiles and narrow-phone composition.
  // Its 7,766 bytes remain in this existing owner file and add no override file
  // or `!important` declaration.
    // Shared handset previews use consistent typography and data-driven details.
    // Replaced obsolete decorative detail styles with the shared content layout.
    // Keyboard focus for interactive previews and a secondary customize action.
    // Current source snapshot includes the new learning, legal/about and
    // mosque-finder surfaces. Keep this exact cap until consolidation reduces
    // it; the compiled transfer size is guarded separately by bundle:check.
    totalBytes: 911_682,
};

const names = (await readdir(styleDir)).filter((name) => name.endsWith('.css'));
const sources = await Promise.all(names.map((name) => readFile(resolve(styleDir, name), 'utf8')));

const measured = {
  files: names.length,
  overrideFiles: names.filter((name) => /lock|parallel-pass/.test(name)).length,
  importantRules: sources.reduce((total, css) => total + (css.match(/!important/g)?.length ?? 0), 0),
  totalBytes: sources.reduce((total, css) => total + Buffer.byteLength(css), 0),
};

const labels = {
  files: 'Stylesheets',
  overrideFiles: 'lock/parallel-pass override files',
  importantRules: '!important declarations',
  totalBytes: 'total stylesheet bytes',
};

const over = Object.keys(BUDGET).filter((key) => measured[key] > BUDGET[key]);
if (over.length) {
  const detail = over
    .map((key) => `${labels[key]}: ${measured[key]} exceeds the budget of ${BUDGET[key]}`)
    .join('\n  ');
  throw new Error(
    `Stylesheet debt grew instead of shrinking.\n  ${detail}\n` +
      '\nFix the rule in the file that defines it rather than adding another override layer.' +
      '\nIf the growth is genuinely warranted, raise the budget in scripts/check-stylesheet-debt.mjs and say why in the commit message.',
  );
}

const slack = Object.keys(BUDGET)
  .filter((key) => measured[key] < BUDGET[key])
  .map((key) => `${labels[key]} ${measured[key]} (budget ${BUDGET[key]})`);

if (slack.length) {
  console.log(
    `Stylesheet debt verified and now under budget — lower the budgets in the same commit: ${slack.join(', ')}.`,
  );
} else {
  console.log(
    `Stylesheet debt verified: ${measured.files} stylesheets, ${measured.overrideFiles} override layers, ${measured.importantRules} !important, ${Math.round(measured.totalBytes / 1024)} KB, none above budget.`,
  );
}
