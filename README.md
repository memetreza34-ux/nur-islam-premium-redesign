# Nur Islam Premium Redesign

Premium redesign and functional hardening branch for the Nur Islam app.

## Active development branch

The complete application lives on `premium-home-redesign`. The current design + functionality stabilization work is developed on `premium-design-finish` and reviewed through PR #2 before it is merged back.

## Current priorities

1. Premium, consistent mobile-first design across all core screens.
2. Every visible control should either perform a real action or clearly be presented as informational.
3. Persisted user progress must be reflected consistently on Home, Quran, Dhikr, collections and learning screens.
4. Prayer times, reminders and direct PWA navigation must share the same current schedule.
5. Account, cloud backup and cloud notes use the isolated `nur_islam_*` Supabase tables with RLS and least-privilege CRUD grants.
6. Religious content that has not completed an independent scholarly/editorial review remains visibly marked and must not be presented as release-certified.

## Functional hardening completed on `premium-design-finish`

- Home resumes the real last-read Quran Surah and Ayah and shows actual Dhikr totals.
- Quran bookmarks are detected across all 114 Surahs and deep-link to the exact saved Ayah.
- Saved Duas, Names and calendar dates open their exact saved content.
- Quran reader controls shown to users are functional; the old fake audio placeholder was removed.
- Daily Ayah/Hadith copy and share actions use browser APIs instead of toast-only demo actions.
- The Nur Assistant answers only supported local source-backed topics and refuses to invent unsupported religious answers.
- Fasting reminders are connected to the shared calendar reminder scheduler.
- Standby mode displays live next-prayer data and uses the browser Fullscreen API.
- The Zakat screen provides a transparent 2.5% planning calculation without pretending to decide religious obligation.
- Prayer reminders start only after the initial shared prayer-time bootstrap, avoiding a fallback/live timing race.
- Wudu/Salah guide completion is persisted.
- Supabase `authenticated` access to Nur Islam tables is limited to SELECT/INSERT/UPDATE/DELETE and scoped by RLS.
- Static regression checks were updated to match the current centralized navigation and reminder architecture.

## Validation

Run:

```bash
npm run check
```

This runs content/data checks, navigation and interaction checks, release and functional-hardening checks, TypeScript (`tsc --noEmit`) and the Vite production build.

GitHub Actions is configured for `premium-design-finish`, but at the time of this branch update GitHub is refusing to start runner steps because of an account billing/spending-limit issue. That CI infrastructure failure is not evidence of a successful or failed app build. A real browser/device QA pass is still required before release.

## Backend

Supabase resources are intentionally namespaced with `nur_islam_*` so this app does not overwrite tables belonging to other projects in the shared Supabase project.

Never place a Supabase service-role key in the frontend. Only the public/publishable client key belongs in a browser build.
