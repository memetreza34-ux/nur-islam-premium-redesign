# Final Design Pass

**Stand:** 16. August 2026

## Regel

Dieser Pass dient ausschließlich der Fertigstellung des bestehenden Produkts.

**Keine neuen Features. Kein Redesign-Neustart. Keine zusätzliche Produktbreite.**

## Design-Sprache

- Bedien-, Navigations- und Kategorieicons verwenden konsistente echte Vektoricons aus `lucide-react`.
- Große Quran-, Kaaba-, Moschee-, Qibla- oder andere thematische Grafiken dürfen als Illustrationen bestehen bleiben, wenn sie bewusst als Illustration eingesetzt werden.
- Kleine 3D-/Raster-/Objektgrafiken dürfen nicht als Ersatz für UI-Icons verwendet werden.
- Ein kaputtes Bild darf nicht still durch ein thematisch anderes Motiv ersetzt werden.
- Kleine UI-Assets dürfen nicht als großformatige Hero-Grafik hochskaliert werden.
- Dark und Light müssen beide als eigenständige lesbare Zustände funktionieren.

## In diesem Pass korrigiert

- handgezeichnete `NurIcons`-Sonderglyphen auf Lucide-basierte Symbole umgestellt;
- letzte Home-Empfehlung „Fasten-Assistent“ auf `MoonStar` vereinheitlicht;
- bekannte beschädigte Moschee-WebP-Zuordnung auf das intakte gleichartige `mosque-gold-v2.svg` umgestellt;
- falsche versteckte Moschee→Dome-Substitution entfernt;
- „Islamische Orte“ auf intaktes Moschee-Artwork umgestellt;
- Fasten-Assistent verwendet keinen kleinen Kalender-Chip mehr als vergrößertes Hero-Artwork;
- Light-Mode-Kontrast auf Legacy-/Wissensscreens verbessert;
- Icon-, Bild-, Asset- und Deployment-Guardrails an die korrigierten Regeln angepasst;
- Stylesheet-Debt beim Kontrastfix nicht vergrößert, sondern Gesamtbudget leicht reduziert.

## Verifiziert

Automatisierte Prüfung umfasst je nach Workflow:

- `npm run check`;
- TypeScript und Production Build;
- Playwright E2E;
- Dark und Light;
- 390 × 844;
- 340 × 740;
- iPhone/WebKit 390 × 844;
- Compact WebKit 375 × 667;
- Kern- und Legacy-Screens.

Die jeweils aktuellste technische Evidenz liegt in GitHub Actions.

## Noch nicht durch Browser-Screenshots bewiesen

Der Design-Pass ist nicht dasselbe wie eine physische Gerätefreigabe. Vor dem öffentlichen Release bleiben reale Tests erforderlich für:

- PWA-Installation und Betriebssystem-Chrome;
- Qibla/Device Orientation;
- Standortberechtigungen;
- Benachrichtigungen;
- Tastatur-/Modal-Verhalten auf echten Geräten;
- Offline-/Update-/Recovery-Verhalten.

Der Gesamtstatus und alle Release-Blocker stehen in [`../CURRENT-STATUS.md`](../CURRENT-STATUS.md).
