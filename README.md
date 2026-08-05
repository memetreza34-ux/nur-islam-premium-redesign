# Nur Islam · Premium Redesign

Eigenständiges Redesign der Nur-Islam-App als mobiler React-/Vite-Prototyp im Smaragd-, Gold- und Creme-Stil.

> Das ursprüngliche Repository `memetreza34-ux/nur-islam` wird durch dieses Projekt nicht verändert. Die Redesign-Arbeit liegt im separaten Repository und im Branch `premium-home-redesign`.

## Enthaltene Bereiche

- Premium-Startseite mit Moschee-Hero, islamischem Datum und Gebetsübersicht
- Quran-Übersicht und Quran-Reader
- Ayah- und Hadith-Detailseiten mit Quellenkennzeichnung
- Dhikr-Zähler mit lokal gespeichertem Fortschritt
- Qibla-Berechnung aus dem Gerätestandort
- Gebetszeiten, Erinnerungen und Gebets-Tracker
- islamischer Kalender mit Hijri-Tagesnummern und eigenen Terminen
- Duas, 99 Namen Allahs, Moschee-Finder und Sammlungen
- Lernbereich mit Wudu- und Salah-Anleitungen
- Profil, Sprache, Erscheinungsbild und Einstellungen
- Premium-Onboarding, Splashscreen und installierbare PWA
- Offline-Grundlage, Netzwerkstatus und Fehler-Wiederherstellung

## Lokal starten

```bash
npm install
npm run dev
```

Die Entwicklungsansicht läuft standardmäßig auf Port `3000`.

## Prüfen und bauen

```bash
npm run check
```

Der Befehl führt zuerst die TypeScript-Prüfung und danach den Produktions-Build aus.

Einzeln:

```bash
npm run lint
npm run build
npm run preview
```

## PWA

Die App enthält:

- `manifest.webmanifest`
- eigenes Nur-Islam-App-Symbol
- Service Worker mit App-Shell-Cache
- Offline-Fallback
- Android-/Chrome-Installationsdialog
- iPhone-Anleitung für „Zum Home-Bildschirm“
- Safe-Area-Anpassungen für Geräte mit Notch und Home-Indikator

Der Service Worker wird nur im Produktions-Build registriert.

## Lokale Speicherung

Folgende Zustände werden aktuell im Browser gespeichert:

- Onboarding-Abschluss
- Gebets-Tracker und Erinnerungen
- Dhikr-Zähler
- Quran-Lesezeichen und Reader-Einstellungen
- Dua- und Namensfavoriten
- Kalendertermine und Kalenderfavoriten
- Wudu-/Salah-Lernfortschritt
- Sprache und Darstellungsoptionen

## Vor einer Veröffentlichung noch erforderlich

Dieses Repository ist ein hochwertiger, funktionsfähiger Frontend-Prototyp. Vor einer öffentlichen Veröffentlichung müssen unter anderem noch produktive Datenquellen und Prüfprozesse ergänzt werden:

- verlässliche API für standortabhängige Gebetszeiten
- geprüfte Quran-Übersetzung und Quran-Audiodaten
- geprüfte Hadith- und Dua-Datenbank
- echte Moschee-Datenquelle statt lokaler Beispieldaten
- produktive Authentifizierung und Cloud-Synchronisierung
- quellenbasierte KI-Anbindung mit klaren Sicherheitsgrenzen
- rechtliche Texte, Datenschutz und Impressum
- Tests auf echten iOS- und Android-Geräten

Deutsche Quran-Bedeutungen und Hadith-Texte werden im Prototyp bewusst als sinngemäß gekennzeichnet, wenn kein freigegebener Originalwortlaut hinterlegt ist.

## GitHub Actions

Der Workflow `.github/workflows/redesign-check.yml` führt Installation, TypeScript-Prüfung und Produktions-Build aus. Falls kein Statuscheck erscheint, muss der bekannte GitHub-Actions-Billing-/Spending-Blocker im Konto behoben werden.
