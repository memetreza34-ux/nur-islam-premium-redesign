# Nur Islam · Reference Visual QA Matrix

This matrix is the source-level visual contract for the premium redesign. It complements the automated image/icon/palette checks and the 390×844 render-preview workflow.

> Important: source-level compliance is not a substitute for a real browser/device comparison against the approved reference boards. A rendered 390×844 pass remains required before visual release certification.

## Global visual contract

| Area | Reference contract |
| --- | --- |
| Dark background | `#00120F` → `#001B16` → `#042A21` |
| Emerald surfaces | `#07372B`, `#0D5743` |
| Gold | `#E2BF77`, bright `#F2D79A`, dark `#8D6D39` |
| Cream | `#F6EBD6`, strong `#FFF8EA` |
| Muted green | `#91A89E` |
| Hero radius | `42px` |
| Card / modal radius | `28px` |
| Control / input radius | `18px` |
| Bottom navigation | `26px` |
| Small glyph holder | `13px` |
| Pills / avatars / circular progress | keep `999px` / `50%` |
| Lucide icons | `1.75` stroke, round cap + join |
| Primary mobile QA viewport | `390 × 844` |

## Core image + icon mapping

| Screen / surface | Primary reference artwork | Crop / role | Primary semantic icon contract |
| --- | --- | --- | --- |
| Splash | `nur-logo-emblem-v2.webp` + `mosque-gold-v2.webp` | Nur mark centered; mosque contained at right/bottom | brand mark, no fake action |
| Onboarding 1 | `mosque-gold-v2.webp` | architectural, center/bottom | contextual slide icon |
| Onboarding 2 | `qibla-compass-v2.webp` | centered circular hero | contextual slide icon |
| Onboarding 3 | `quran-closed-v2.webp` + `tasbih-v2.webp` | Quran slightly left/bottom; Tasbih companion | contextual slide icon |
| Home hero | `mosque-gold-v2.webp` | contain, right/bottom | Bell → prayer/reminders; Menu → More |
| Home Quran quick action | `quran-closed-v2.webp` | object card | `BookOpen` |
| Home Dhikr quick action | `tasbih-v2.webp` | object card | semantic Dhikr action |
| Home Qibla quick action | `qibla-compass-v2.webp` | object card | location / direction semantics |
| Home daily Ayah | `mihrab-arch-v2.webp` | cover, center 42% | real daily-Ayah action |
| Prayer / next prayer | `dome-v2.webp` | contained architectural accent | refresh / location / calculation icons remain functional |
| Quran catalogue | `quran-closed-v2.webp` | contain, center/bottom | Heart = favorite Surahs |
| Quran reader | `quran-open-v2.webp` | contain, center/bottom | real reader controls only |
| Dhikr | `tasbih-v2.webp` | contain, centered | `BarChart3` = today's statistics |
| Qibla | `qibla-compass-v2.webp` + `kaaba-v2.webp` | compass centered; Kaaba center marker | Settings / Locate / MapPin semantics |
| Duas | `dua-hands-v2.webp` | devotional hero accent | Heart / Search / Filter |
| 99 Names | typographic / ornamental hero | no unrelated object forced in | semantic favorites/navigation only |
| Mosque finder | `mosque-gold-v2.webp` | contain, right/bottom | Refresh / Locate / Map / MapPin |
| Daily Ayah | `mihrab-arch-v2.webp` | cover, center 42% | copy/share actions must be real |
| Daily Hadith | `lantern-v2.webp` | contained hero accent | source/copy/share semantics |
| Learning hub | `mihrab-arch-v2.webp` | contained learning hero | Settings / GraduationCap / lesson icons |
| Wudu guide | mosque / Mihrab visual language | contain, center/bottom | `Droplets` |
| Salah guide | `qibla-compass-v2.webp` | contain, centered | `Compass` |
| Calendar month | `sun-emblem-v2.webp` | subtle ornament | `CalendarDays`, Plus = real add action |
| Calendar event | `calendar-chip-v2.webp` | subtle ornament | event semantics |
| Collections | `bookmark-v2.webp` | subtle saved-content ornament | content-specific row icons |
| Profile / More | `nur-logo-emblem-v2.webp` | contain, centered | Settings2 = real settings action |
| Account | Nur visual language | brand/utility hero | account/security/cloud semantic icons |
| Notes | no unrelated focal object | utility surfaces | note/edit/delete semantic icons |
| Nur Assistant | `nur-logo-emblem-v2.webp` | contain, centered | ShieldCheck = source-mode information |
| Fatal error | `nur-logo-emblem-v2.webp` | contain, centered | recovery action only |
| Install prompt | `nur-logo-emblem-v2.webp` | contain, centered | install / close only |

## Additional feature ID → artwork → icon contract

| Feature ID | Artwork | Semantic icon |
| --- | --- | --- |
| `hadith-library` | `lantern-v2.webp` | `Library` |
| `knowledge` | `quran-open-v2.webp` | `BookOpenCheck` |
| `prophets` | `mihrab-v2.webp` | `Milestone` |
| `quiz` | `quran-closed-v2.webp` | `BrainCircuit` |
| `hajj` | `kaaba-v2.webp` | `Mountain` |
| `sunnah` | `sun-emblem-v2.webp` | `Sparkles` |
| `sins` | `dome-v2.webp` | `ShieldCheck` |
| `fasting` | `calendar-chip-v2.webp` | `MoonStar` |
| `ummah` | `dome-v2.webp` | `Globe2` |
| `places` | `mosque-gold-v2.webp` | `MapPinned` |
| `jumuah` | `mihrab-arch-v2.webp` | `CalendarHeart` |
| `zakat` | `bookmark-v2.webp` | `BadgeDollarSign` |
| `standby` | `qibla-compass-v2.webp` | `Radio` |

## Bottom navigation contract

| Destination | Label | Icon |
| --- | --- | --- |
| Home | `Start` | `Home` |
| Prayer | `Gebete` | `SunMedium` |
| Calendar | `Kalender` | `CalendarDays` |
| Learning | `Islam verstehen` | `BookOpen` |
| More | `Mehr` | `Menu` |

Inactive navigation stays cream/muted. Active navigation is bright gold with a restrained glow. Navigation icons remain functional route controls, never decorative placeholders.

## Home semantic quick-action icons

| Action | Icon |
| --- | --- |
| Quran lesen | `BookOpen` |
| Beten lernen | `HandHeart` |
| 99 Namen Allahs | `Sparkles` |
| Islam Quiz | `BrainCircuit` |
| Duas | `BookHeart` |
| Nur Assistent | `MessageCircleQuestion` |

## Render QA checklist

For each capture verify:

1. No wrong focal artwork or fallback SVG appears when the real WebP loads.
2. No CSS `content:url(...)` swaps a React-owned premium image.
3. Hero/card/control geometry reads as 42/28/18 across the screen.
4. Lucide icons have a consistent 1.75 rounded stroke.
5. Image crop matches the role in this matrix; correct source with wrong crop still fails QA.
6. Dark focal heroes use the approved emerald/gold/cream family.
7. Quran reader intentionally keeps its cream paper system; do not force it into dark emerald.
8. Optional light theme remains warm ivory where intended; selected identity/focal heroes may intentionally stay dark emerald.
9. No decorative art blocks taps, focus, scrolling, keyboard input or modal dismissal.
10. Check both the 390×844 viewport capture and a real narrow device around 320–350px.

## Automated guardrails

- `scripts/check-reference-image-map.mjs` — exact image and crop mappings.
- `scripts/check-reference-icon-map.mjs` — semantic icon mappings.
- `scripts/check-reference-art-palette.mjs` — late content-domain palette drift.
- `scripts/check-reference-system-surfaces.mjs` — shell, navigation, modals, system surfaces, profile/account/assistant.
- `scripts/check-onboarding-visuals.mjs` — onboarding composition and geometry.
- `scripts/check-reference-home-art.mjs` — dedicated Home source audit.
- `.github/workflows/reference-render-preview.yml` — real 390×844 screenshots when GitHub runners are available.

## Release status rule

A source-level check may say the mapping/geometry contract is protected. The phrase **pixel-perfect / 1:1 certified** is reserved for a successful real render comparison against the approved reference images on the target viewport/device.
