# Nur Islam Premium Redesign

Progressive web app for the Nur Islam project: prayer times, Qibla, the full
Quran offline, Dhikr, Duas, an Islamic calendar and a guided path for people who
are new to Islam.

## Branches

| Branch | Role |
| --- | --- |
| `main` | What GitHub Pages publishes. Nothing else deploys. |
| `feat/v1-beginner-release-plan` | Current working branch for the v1 release. |

Older branches (`premium-home-redesign`, `premium-design-finish`) are historical.
They no longer deploy anything and are not where work happens.

## What "done" means here

The app is functionally far along. What stands between it and a public release
is mostly **not** code — see [docs/V1-RELIGIOUS-RELEASE-GATE.md](docs/V1-RELIGIOUS-RELEASE-GATE.md)
and the status table below.

| Area | State |
| --- | --- |
| Check chain, unit tests, browser tests | green locally (see *Validation*) |
| Religious content review | **42 blocks, all `pending`** — needs a qualified human reviewer |
| Quran text | wording verified, **licence unresolved** — see [docs/QURAN-PROVENANCE.md](docs/QURAN-PROVENANCE.md) |
| Imprint / privacy | operator details still a placeholder; release build refuses to pass without them |
| Real device QA | not done — Qibla, notifications and prayer times need physical devices |

## Content honesty rules

These are enforced by checks, not conventions, because each of them was a real
defect at some point:

1. Religious content that has not passed an independent review stays visibly
   marked and cannot be presented as release-certified.
2. Without a device location the app shows **no** personal prayer times and
   **no** personal Qibla bearing. The bundled fallback schedule deliberately
   contains no clock values, and prayer reminders will not fire on it.
3. The Islamic day turns at Maghrib. When no trusted Maghrib time is available,
   the app says so rather than silently using midnight — see
   `src/services/islamicDay.ts`.
4. Legacy features that have not been reviewed stay out of public navigation,
   however finished their code looks (`src/data/legacyFeatures.ts`).
5. Every visible control performs a real action or is clearly presented as
   informational.
6. The bundled Quran is pinned by sha256 digest; a single altered ayah fails the
   build.

## Validation

```bash
npm run check
```

57 source and data checks, then `vitest run` (228 tests), `tsc --noEmit`, the
Vite production build and the bundle budget. Takes about a minute.

```bash
npm run e2e
```

Playwright against the production build at a phone viewport: 10 spec files
covering the core flows, the beginner path, offline behaviour, empty states,
layout, light-theme contrast and reduced motion. Two capture specs are skipped
unless `SHOT_DIR` or `SNAP` is set.

```bash
npm run quran:verify
```

Compares every bundled ayah against the published edition at Al Quran Cloud.
Network-bound, so deliberately not part of `npm run check`. Run it whenever the
Quran bundle is touched and record the result in `docs/QURAN-PROVENANCE.md`.

### Pre-push hook

`npm install` enables it. It refuses a push to `main` — that branch is what
gets published, and it is reached through a pull request — and it runs
`npm run check`, refusing a failing push. Bypass deliberately with
`git push --no-verify`. To enable by hand:

```bash
git config core.hooksPath .githooks
```

## Deployment

`.github/workflows/deploy-pages.yml` publishes `dist/` to GitHub Pages on push
to `main`. The build targets `/nur-islam-premium-redesign/`, which matches the
default project URL.

Publishing waits on three separate jobs, so there is no path to the public URL
that skips a gate:

1. `religious-release-gate` — every religious content block needs a documented
   approval. This is not part of `npm run check`, because a pending review is
   the normal state of unfinished work and would block every push; publishing is
   where it has to hold.
2. `build` — `NUR_RELEASE=true npm run check`, which fails on legal placeholders
   and every other guarded regression, then uploads the artifact.
3. `end-to-end` — the Playwright suite. Separate from `build` because the
   browser tests build with a root base path, which would overwrite the artifact
   with one that cannot work under the Pages sub-path.

`deploy` depends on `build` and `end-to-end`; `build` depends on the gate.
Uploading an artifact is not publishing.

### Manual repository settings

- **Settings → Pages → Source: GitHub Actions**, once.
- **Protection on `main`** — configured. The ruleset `main safety` requires a
  pull request, requires the `validate` and `smoke` checks to pass, and blocks
  force pushes and deletion. Nobody can bypass it, including repository admins.
  No approving review is required, so a single maintainer can still merge their
  own pull request. See docs/RELEASE-OPERATIONS.md.
- Optional: `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` as Actions
  **variables**. Both are public client config, not secrets — the publishable
  key is meant to be readable in a browser bundle and is scoped by row-level
  security. Unset builds against the same public default the code falls back to.

## Backend

Supabase resources are namespaced `nur_islam_*` so this app cannot overwrite
tables belonging to other projects in a shared Supabase project. Access for the
`authenticated` role is limited to SELECT/INSERT/UPDATE/DELETE and scoped by
row-level security on `auth.uid() = user_id`.

Never put a Supabase service-role key in the frontend. Only the
public/publishable client key belongs in a browser build.
