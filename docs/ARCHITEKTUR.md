# Quellstruktur

Verbindliche Ablage für `src/`. Wer eine neue Datei anlegt, ordnet sie hier ein — die flache Ablage kommt nicht zurück.

```
src/
  app/        Einstiegspunkt und Schale: main.tsx, App.tsx, AppSystemLayer.tsx,
              appPaths.ts, pwa.ts
  screens/    Ein Screen pro Datei, jeweils ein Tab oder eine Detailansicht
  services/   Zustand, Persistenz, Netzwerk, Zeitrechnung — kein JSX;
              die zugehörigen *.test.ts liegen daneben
  data/       Statische Inhalte: Duas, Dhikr, 99 Namen, Lerninhalte, Rechtstexte
  shared/     Wiederverwendbares über Screens hinweg: PremiumVisuals,
              ReferenceSprite, InstallAppPrompt, Hooks
  assets/     Base64-Sprite-Chunks
  embedded/   Eingebettete Datensätze (Moscheen)
  styles/     Stylesheets, eingebunden über src/styles.css
  styles.css  Einzige Import-Kette für alle Stylesheets
```

## Regeln

- **Kein JSX in `services/` und `data/`.** Wer dort eine Komponente braucht, hat die Grenze falsch gezogen.
- **`screens/` importiert aus `services/`, `data/`, `shared/` — nie umgekehrt.** Ein Service, der einen Screen importiert, ist ein Zirkelbezug.
- **Tests liegen neben ihrem Prüfling**, nicht in einem eigenen Testordner. `vitest` sammelt über `src/**/*.test.ts`.
- **`app/` bleibt klein.** Es beherbergt Bootstrap und Routing, keine Fachlogik.

## Prüfskripte

Die Skripte in `scripts/` lesen Quelldateien über feste Pfade und prüfen teils exakte Import-Zeilen. Wird eine Datei verschoben, müssen beide mitgezogen werden — der Pfad im `readFile` und die geprüfte Import-Zeile. `npm run check` deckt das auf.

## Offene Baustelle: Stylesheets

`src/styles/` enthält aktuell 98 Dateien mit rund 2200 `!important`, davon 26 Dateien mit `lock` oder `parallel-pass` im Namen. Diese Dateien überschreiben jeweils frühere Ebenen, statt eine gemeinsame Quelle zu ändern. Das ist der nächste Umbau: erst Design-Tokens als einzige Quelle für Farben, Radien, Abstände und Schatten, dann die Override-Ebenen schrittweise auflösen.

Bis dahin gilt: **keine neue Lock-Datei anlegen.** Änderungen gehören in die Datei, die die Regel ursprünglich definiert.
