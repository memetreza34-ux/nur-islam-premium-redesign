# Einstieg für neue Arbeitssitzungen

> Vor der ersten Änderung lesen. Gilt für jeden Agenten und jedes Werkzeug.

## Wo der Code liegt

- Arbeitsbranch: **`design/claude-design-system`** — der einzige.
- `main` ist der Veröffentlichungszweig und bleibt unangetastet.
- Kein PR und kein Merge nach `main` ohne ausdrückliche Freigabe des Betreibers.

Alle früheren Branches wurden am 25.08.2026 gelöscht, nachdem ihre brauchbare
Arbeit übernommen war. Wer auf einen alten Branchnamen stößt: er existiert nicht
mehr, und das ist Absicht.

## Was dieses Projekt ist

**Produktentscheidung vom 27.08.2026:** Kein Chat-/KI-Assistent in der App.
Der frühere lokale Nur-Assistent wurde vollständig entfernt. Nicht anhand alter
Masterpläne wieder einbauen. `npm run no-assistant:check` schützt diese Grenze.
Der Fastenplan ist eine feste Kalender-/Erinnerungsfunktion. Statische erzeugte
Illustrationen behalten ihren Herkunftsnachweis; das ist keine rechtliche Freigabe.

Eine Anfänger-taugliche islamische PWA: Quran, Gebetszeiten, Qibla, Dhikr, Duas,
Lernbereich, Kalender. Der Produktumfang ist eingefroren. Es geht nicht mehr um
neue Features, sondern um Stabilität, Belege, Rechte und Release-Härtung.

## Die Regel, die über allem steht

**Nichts behaupten, was nicht belegt ist.**

Das ist kein Stilwunsch, sondern der Kern dieser App. Konkret:

- Keine religiöse Freigabe erfinden. `status: 'approved'` setzt ein Mensch, nie
  ein Agent.
- Keine Quellenangabe aus dem Gedächtnis. Wenn eine Hadith-Nummer oder ein Vers
  genannt wird, muss er **nachgeschlagen** worden sein — es gibt Werkzeuge dafür,
  siehe unten.
- Keine erfundenen Gebetszeiten, keine erfundene Qibla-Richtung, kein geratenes
  Datum. Wo die App etwas nicht weiß, sagt sie das.
- Alle 99 Namen Allahs bleiben sichtbar. Ein offener Prüfstatus ist kein Grund,
  Inhalte zu verstecken.
- Wo Rechtsschulen sich unterscheiden, wird der Unterschied benannt, statt eine
  Position als die einzige darzustellen.

## Werkzeuge, die Behauptungen prüfen

```bash
npm run names:evidence      # sucht die 99 Namen im arabischen Quran-Text
npm run prophets:evidence   # dasselbe für die 25 Propheten
npm run hadith:verify       # prüft zitierte Hadith-Nummern gegen die Sammlung
```

Sie schreiben nach `docs/` und arbeiten gegen den mitgelieferten, verifizierten
Quran-Text. Jede haben eine eingebaute Kontrolle: wenn bekannte Treffer nicht
mehr gefunden werden, brechen sie ab, statt falsche Ergebnisse zu liefern.

## Vor jedem Commit

```bash
npm run check    # vollständige Prüfkette, ~1 Minute
npm run e2e      # Browser-Tests
```

Beide müssen grün sein. Ein Pre-Push-Hook erzwingt `check` zusätzlich.

Die `scripts/check-*.mjs` prüfen das gelieferte Design **wörtlich** — Klassennamen,
Farbwerte, Radien. Eine Designänderung bricht sie deshalb zwangsläufig. Das ist
kein Fehler: die Prüfung wird im selben Commit mitgezogen, damit sie die *neue*
Absicht schützt. Nicht die Prüfung löschen, um grün zu werden.

## Der Quran-Bestand

Der arabische Text liegt vollständig offline vor. Die **deutsche Übersetzung
wird abgerufen, nicht mitgeliefert**; daraus folgt keine automatische Lizenzfreigabe. Details und der
Preis dieser Entscheidung stehen in `docs/QURAN-PROVENANCE.md`.

Nicht rückgängig machen, ohne die Rechtefrage neu zu beantworten.

## Inhaltsentscheidung abgeschlossen

Der Betreiber hat den geprüften Inhaltsstand am 13.10.2026 im Chat für den Release
angenommen: `docs/CONTENT-RELEASE-DECISION-2026-10-13.md`. Ein externer religiöser
Prüfer ist keine Release-Voraussetzung. Keine App-Weitergabe veranlassen und keine
Gelehrtenfreigabe erfinden. Quellenstand und Grenzen bleiben dokumentiert.

## Was noch offen ist

1. Impressumsdaten — `npm run check` mit `NUR_RELEASE=true` verweigert bis dahin.
2. Datenschutzangaben für die tatsächliche Hosting-/Cloud-Konfiguration.
3. Herkunft und Nutzungsrechte des Text-, Audio- und Bildmaterials.
4. Tests auf echten Geräten.
5. Funktionsabnahme der Cloud oder Entscheidung für einen Release ohne Cloud.

## Aktuelle technische Grenzen

Keine erfundenen Gebetszeiten: Fallback zeigt Platzhalter. Erinnerungen prüfen
aktuellen Zeitplan, Zeitzone und gültige Uhrzeiten. Freiwillige Fastenvorschläge
und ihr Scheduler schließen Ramadan, beide Eid-Tage und Tashriq gemeinsam aus.
Veraltete Berichte nicht als Beweis für den aktuellen Code verwenden.
