# Nur Islam Premium

Mobile-first PWA für Quran, Gebetszeiten, Qibla, Dhikr, Duas, Lernen und weitere islamische Alltagsbereiche.

## Aktueller Projektmodus

**Keine neuen Features im aktuellen Finish-Pass.**

Der aktive Release-Candidate-Code liegt auf `premium-design-finish`. Ziel ist jetzt ausschließlich, die vorhandene App kontrolliert fertigzustellen: Stabilität, Designqualität, reale Geräteprüfung, religiöser Fachreview, Rechte/Datenschutz und Release-Härtung.

Die verbindliche Aussage zum aktuellen Stand steht in:

- [`CURRENT-STATUS.md`](./CURRENT-STATUS.md) – Single Source of Truth für den heutigen Implementierungs- und Release-Status.
- [`docs/nur-islam-premium-masterplan/`](./docs/nur-islam-premium-masterplan/) – langfristige Anleitung, Prüfpfade und Zielbild; nicht automatisch der heutige Ist-Stand.
- [`docs/DESIGN-FINAL-PASS.md`](./docs/DESIGN-FINAL-PASS.md) – Regeln und Ergebnis des aktuellen Design-Finish-Passes.

## Technischer Stand in Kurzform

Der aktuelle RC enthält unter anderem:

- React/TypeScript/Vite-PWA;
- Dark- und Light-Theme;
- alle 114 Suren mit arabischem Uthmani-Text offline;
- surenweise geladene und gecachte deutsche Quran-Übersetzung;
- Gebetszeiten mit Live/Cache/Fallback-Pfad;
- Qibla-/Device-Orientation-Pfad;
- Dhikr, Duas, Namen, Kalender, Lern- und Wissensbereiche;
- optionalen Supabase-Account mit RLS, Backup/Restore und Cloud-Notizen;
- lokalen quellengebundenen Nur-Assistenten ohne frei generierende religiöse Antworten;
- automatisierte Unit-/Integration-, E2E-, Release-, Asset-, Icon- und Browser-Render-Prüfungen.

Der RC ist **noch kein freigegebener öffentlicher Produktionsrelease**. Die verbleibenden P0-Blocker stehen in [`CURRENT-STATUS.md`](./CURRENT-STATUS.md).

## Lokale Entwicklung

Voraussetzung: aktuelle Node-22-Umgebung.

```bash
npm ci
npm run dev
```

Für einen Produktionsbuild:

```bash
npm run build
```

## Zentrales Quality Gate

Vor jedem Release-relevanten Merge:

```bash
npm run check
```

Der Check umfasst unter anderem Content-/Datenregeln, Navigation, Assets, Bild-/Icon-Mappings, Security-/Legal-/Release-Guardrails, Tests, TypeScript, Production Build, Bundle-Budget und Stylesheet-Debt.

Browser-E2E:

```bash
npm run e2e
```

GitHub Actions ist aktiv; die Workflows auf `premium-design-finish` liefern die jeweils aktuellste CI-Evidenz.

### Pre-push hook

`npm install`/Projektsetup aktiviert den Repository-Hook. Falls er manuell gesetzt werden muss:

```bash
git config core.hooksPath .githooks
```

Der Hook führt das lokale Quality Gate aus und soll rote Commits vor dem Push stoppen. Ein absichtliches `--no-verify` ist kein Release-Nachweis.

## Deployment

Der produktionsnahe GitHub-Pages-Workflow liegt in `.github/workflows/deploy-pages.yml`.

Er läuft automatisch **nur auf `main`** oder manuell über `workflow_dispatch`.

Vor dem Pages-Upload wird ausgeführt:

```bash
NUR_RELEASE=true npm run check
```

Damit sollen releasekritische Zustände – insbesondere noch nicht ausgefüllte Legal-/Betreiberangaben – den öffentlichen Release stoppen.

`premium-design-finish` ist deshalb bewusst ein Release-Candidate-Branch und wird nicht durch jeden Push automatisch als Produktion veröffentlicht.

Optional können `VITE_SUPABASE_URL` und `VITE_SUPABASE_PUBLISHABLE_KEY` als GitHub-Actions-Variablen gesetzt werden. Das sind öffentliche Browser-Client-Konfigurationswerte; ein Supabase-Service-Role-Key darf niemals in Frontend, Repository oder öffentlichen Build gelangen.

## Backend-Sicherheitsregel

Supabase-Ressourcen der App sind mit `nur_islam_*` namespaced. Zugriff auf die Nutzerbereiche ist über RLS und authentifizierte CRUD-Rechte begrenzt.

**Nie** einen Service-Role-Key im Browser verwenden. Nur die öffentliche/publishable Client-Konfiguration gehört in einen Frontend-Build.

## Release-Reihenfolge

1. `premium-design-finish` ohne neue Features stabilisieren.
2. automatisierte QA grün halten.
3. reale iPhone-/Android-Prüfung abschließen.
4. religiösen P0-Fachreview abschließen.
5. Audio-/Nutzungsrechte und Betreiber-/Datenschutzangaben klären.
6. finale Release-Checkliste abzeichnen.
7. erst danach RC kontrolliert nach `main` übernehmen.
8. GitHub-Pages-Release beobachten und Smoke-Test durchführen.

Details und offene Punkte: [`CURRENT-STATUS.md`](./CURRENT-STATUS.md).
