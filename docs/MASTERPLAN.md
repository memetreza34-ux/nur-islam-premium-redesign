# Masterplan: Nur Islam bis zum Launch

Stand: 10. August 2026 · Branch `premium-design-finish` · Bearbeiter: Claude Code allein

Dieser Plan deckt **alles außer dem Impressum** ab: Funktion, Inhalt, Design, Release-Technik. Das Impressum trägt Arman selbst ein.

---

## 1. Bestandsaufnahme — gemessen, nicht geschätzt

### Was wirklich fertig ist

| Bereich | Stand |
|---|---|
| Quran | 114 Suren offline, arabisch + deutsche Bedeutung, 6236 Ayat geprüft |
| Gebetszeiten | live über AlAdhan, Standort und Methode wählbar |
| Moschee-Suche | live über Overpass/OpenStreetMap, mit Cache |
| Duas | 47 Einträge mit Quellen |
| 99 Namen | 99 Einträge, Suche, Fortschritt |
| Dhikr | belegte Routinen, Tagesgrenze, Quellenanzeige |
| Kalender | Hijri-Umrechnung, Ereignisse, Erinnerungen |
| Konto & Cloud | Supabase mit RLS, Export, Löschung |
| Sicherheit | strenge CSP, Frame-Schutz, kein XSS-Vektor, 0 Schwachstellen |

### Die größte Lücke: 7 Bereiche sind nur Stichpunktlisten

In `LegacyFeatureScreens.tsx` steht `featureContent: Record<GenericFeatureId, string[]>`. Das ist der gesamte Inhalt dieser sieben Bereiche:

| Bereich | Inhalt heute | Im Altbestand verfügbar |
|---|---|---|
| Propheten | **6 Stichpunkte** | 11 vollständige Einträge (`prophetService.ts`, 604 Zeilen) + 15 weitere Namen |
| Wissensbibliothek | **4 Stichpunkte** | 12 Einträge (`knowledgeService.ts`, 530 Zeilen) |
| Hajj & Umrah | **6 Stichpunkte** | — muss neu geschrieben werden |
| Sunnah im Alltag | **6 Stichpunkte** | 207 Zeilen (`sunnahSinsService.ts`) |
| Fehler & Reue | **6 Stichpunkte** | im selben Service |
| Ummah-Übersicht | **4 Stichpunkte** | 268 Zeilen (`ummahService.ts`) |
| Islamische Orte | **3 Stichpunkte** | — muss neu geschrieben werden |

### Weitere gemessene Lücken

| Bereich | Heute | Im Altbestand |
|---|---|---|
| Quiz | **5 Fragen** | **60 Fragen** im Klartext in `add_quiz_data*.ts`, je mit Erklärung |
| Hadithe | 8 | 17 (`hadithService.ts`) |
| Lernbereich | 24 Stichpunkte, **0 echte Kurse** | 658 Zeilen (`learnService.ts`) |
| Assistent | 9 vorgefertigte Antworten | — |
| Sahabah | **fehlt komplett** | 14 Einträge (`add_sahabah_batch.ts`) |
| Frauen im Islam | **fehlt komplett** | `add_women_batch.ts` |

**Wichtig:** all das liegt in Dateien, nicht in Firestore. Kein Datenbankzugang nötig. Weitere ~336 Quizfragen liegen zusätzlich in Firestore und wären nur mit Zugangsdaten erreichbar — für den Launch nicht nötig.

### Kaputte oder tote Stellen

- `QuranReaderScreen.tsx:177` — ein Knopf meldet „Leseeinstellungen sind noch nicht verfügbar". Eine Funktion, die es in der Oberfläche gibt, aber nicht tut.
- Qibla zeigt nur die berechnete Gradzahl, kein Gerätekompass.
- Quran ohne Rezitation.

### Design-Schulden

98 Stylesheets, **2281 `!important`**, 33 Override-Ebenen, 706 KB CSS. Jede Sichtänderung braucht heute eine neue Ebene, statt die Regel zu ändern, die das Problem verursacht. Das ist der Grund, warum sich das Fertigwerden zieht.

---

## 2. Die vier Baustellen

```
A · INHALT      die 7 Stichpunkt-Bereiche füllen, Quiz, Hadith, Lernkurse
B · FUNKTION    Leseeinstellungen, Qibla-Sensor, Assistent-Grenzen
C · DESIGN      CSS-Schulden, jeder Screen in echter Breite geprüft
D · RELEASE     Prüfliste, RLS-Test, Geräte-Test, Store-Weg
```

---

## 3. Arbeitspakete in Reihenfolge

### A1 — Quiz auf 60 Fragen · Größe: S
Die Fragen liegen im Klartext in `add_quiz_data.ts`, `add_quiz_data2.ts`, `add_quiz_data3.ts`, je mit Antwortoptionen und **Erklärung**. Übertragen, Kategorien anlegen, Erklärung nach der Antwort anzeigen. Prüfskript auf Vollständigkeit und eindeutige IDs.

*Warum zuerst: größter sichtbarer Gewinn pro Aufwand, reine Übertragung, kein neuer Text.*

### A2 — Propheten, Sahabah, Frauen im Islam · Größe: L
Aus `prophetService.ts` die 11 vollständigen Einträge übernehmen (Einleitung, Beschreibung, Kernpunkte, Lehren). Sahabah und Frauen im Islam als neue Bereiche ergänzen. Eigene Datendatei `src/data/`, eigener Screen statt der Stichpunktliste.

### A3 — Wissensbibliothek, Sunnah, Reue, Ummah · Größe: M
Aus `knowledgeService.ts`, `sunnahSinsService.ts`, `ummahService.ts` übertragen. Struktur wie bei den Duas: Kategorie, Eintrag, Quelle, Favorit.

### A4 — Hajj & Umrah, Islamische Orte · Größe: M
Die einzigen Bereiche ohne Altbestand. Muss neu geschrieben werden — **strikt mit Quellenangabe**, und in die Prüfliste, weil neu verfasst.

### A5 — Hadithe 8 → 25 · Größe: S
Aus `hadithService.ts`, mit Sammlung und Nummer je Eintrag.

### A6 — Anleitungen für Wudu und Gebet · **erledigt**
**Korrektur zur ersten Fassung dieses Plans:** der Lernbereich hatte nie „24 Stichpunkte und keine Lektion". Er trägt 18 vollständige Lektionen mit Absätzen, Kernpunkten, Quellenangaben und Verständnisfrage. Gezählt wurden damals `id:`-Zeilen, was 6 Kategorien und 18 Lektionen zusammenwarf.

Die echte Lücke lag bei den Anleitungen: Wudu und Salah führten je sechs verkürzte Schritte **ohne arabischen Text**, drei Anleitungen fehlten ganz. Jetzt 5 Anleitungen, 50 Schritte, 18 davon mit arabischem Wortlaut und Umschrift — übernommen aus `learnService.ts`.

### A7 — Assistent: Grenze und Antworten aus dem Bestand · **erledigt**
Statt 40 handgeschriebener Antworten sucht der Assistent jetzt im Bestand der App: Lektionen, Wissensthemen, Hadithe, Duas, Propheten und Anleitungen. Jede Antwort verweist auf einen Eintrag, den man öffnen und prüfen kann — und wächst mit dem Inhalt, ohne neue Behauptungen.

Die **Grenze** ist der eigentliche Punkt: 26 Formulierungen für Rechts-, Fatwa- und persönliche Fragen werden **vor** jeder Suche abgewiesen. Ohne diese Reihenfolge hätte „Darf ich im Ramadan Wasser trinken?" einen Ramadan-Artikel getroffen und wie eine Antwort ausgesehen.

### A8 — Prüfliste `docs/INHALTE-PRUEFUNG.md` · **erledigt**
186 Einträge mit Herkunft, Quelle und Häkchenfeld. Wird über `npm run review:write` aus den Datendateien erzeugt; `review:check` in der Prüfkette schlägt fehl, sobald sie nicht mehr zum Inhalt passt. Vorrangig zu prüfen: die 15 hier verfassten Pilgerfahrt-Einträge, die undatierten Ummah-Zahlen und die 17 Hadith-Belegstellen ohne Nummer.

### B1 — Leseeinstellungen im Quran · Größe: S
Den toten Knopf ersetzen: Schriftgröße, arabische Schriftart, Bedeutung ein/aus, dauerhaft gespeichert.

### B2 — Qibla-Gerätekompass · Größe: M
`deviceorientation` mit iOS-Berechtigung. Ohne Sensor bleibt die berechnete Gradzahl sichtbar — kein Rückschritt für Geräte ohne Magnetometer.

### B3 — Fehlerfälle glätten · Größe: M
Jeder Screen ohne Netz, ohne Standort, ohne Daten, beim ersten Start. Nie leere Flächen, immer eine ehrliche Aussage.

### C1 — Design-Tokens · Größe: M
Farben, Radien, Abstände, Schatten als einzige Quelle. Voraussetzung für alles Weitere im Design.

### C2 — Override-Ebenen auflösen · Größe: L
33 Lock- und Parallel-Pass-Dateien schrittweise in die Dateien zurückführen, die die Regel definieren. Ziel: **unter 25 Stylesheets, unter 300 `!important`**. Nach jedem Schritt Vorher/Nachher-Screenshots aller Screens; `style-debt:check` verhindert das Zurückwachsen.

### C3 — Jeder Screen bei 320, 375 und 430px · Größe: M
Nicht im Testlauf, sondern im Browser nachgemessen. Genau so wurde der 126px-Navigationsfehler gefunden, den kein grüner Test bemerkt hat.

### C4 — Hell-Modus, Reduced Motion, Tastatur · Größe: M
Alle drei existieren, aber sind nie vollständig durchgegangen worden.

### C5 — Bundle aufteilen · Größe: S
706 KB CSS in einer Datei, JS ungesplittet. Nach C2 deutlich einfacher.

### D1 — `npm run rls:verify` · Größe: S
Braucht zwei Testkonten. Erst dieser Lauf beweist, dass ein Konto wirklich nur eigene Daten sieht.

### D2 — `/security-review` auf dem fertigen Stand · Größe: S

### D3 — Echtes iPhone und Android · Größe: M
PWA installieren, Benachrichtigungen, Standort, Offline-Start, Safe-Area am Notch.

### D4 — Store-Entscheidung · Größe: M
PWA über GitHub Pages, oder native Hülle über Capacitor für App Store und Play Store. Entscheidet über Aufwand und Zeitplan — deshalb früh besprechen, spät umsetzen.

---

## 4. Reihenfolge

```
A1 Quiz ──► A5 Hadith ──► A2 Propheten ──► A3 Wissen ──► A4 Hajj ──► A6 Kurse ──► A7 Assistent
                │
                └──► A8 Prüfliste ──────────────► fachliche Prüfung (Arman, parallel)
B1 ──► B2 ──► B3        (zwischen den Inhaltspaketen)
                              C1 ──► C2 ──► C3 ──► C4 ──► C5
                                                            └──► D1 ──► D2 ──► D3 ──► D4
```

**Warum diese Reihenfolge:**
- **A8 so früh wie möglich**, sobald genug Inhalt steht. Die fachliche Prüfung ist der langsamste Vorgang im ganzen Projekt und läuft dann parallel zu allem anderen.
- **Inhalt vor Design.** Ein Screen mit echtem Inhalt sieht anders aus als einer mit vier Stichpunkten. Design vorher zu polieren heißt, es zweimal zu machen.
- **C2 vor C3.** Solange 33 Override-Ebenen existieren, wird jede Sichtkorrektur zur 34. Ebene.
- **D zuletzt**, weil es den fertigen Stand prüft.

---

## 5. Was ich nicht kann

- **Fachliche Richtigkeit religiöser Inhalte.** Ich prüfe Struktur, Vollständigkeit, Quellenangaben und Konsistenz. Ob eine Übersetzung, ein Hadith oder eine Fiqh-Aussage korrekt ist, bestätigt ein qualifizierter Mensch. A8 liefert dafür die Vorlage.
- **Supabase-Dashboard.** E-Mail-Bestätigung, Rate-Limits, JWT-Laufzeit, Schutz gegen geleakte Passwörter.
- **Zwei Testkonten** für D1.
- **Rezitationslizenz**, falls Audio noch in v1.0 soll.

---

## 6. Zwei Empfehlungen für Tempo

1. **Weitere Sprachen erst nach der fachlichen Freigabe.** Das alte Repo hatte elf. Jede Sprache vervielfacht jede spätere Inhaltsänderung, und nicht freigegebene Texte müsste man zweimal übersetzen lassen. Die Datenstruktur bleibt vorbereitet.
2. **Quran-Rezitation nach v1.0.** Das ist eine Lizenzfrage, keine Programmieraufgabe. Die Oberfläche täuscht heute korrekterweise keine Wiedergabe vor.

Werden beide mitgetragen, ist der Weg deutlich kürzer. Werden sie es nicht, bleibt der Plan gültig — er dauert länger.

---

## 7. Arbeitsweise

- **Ein Branch, ein Bearbeiter.** Kein paralleler Zugriff mehr. Der Parallelbetrieb hat heute eine doppelte `src/main.tsx` erzeugt und mehrfach Rebases erzwungen.
- **Kleine Commits, sofort gepusht**, jeder mit grünem `npm run check`.
- **Nichts gilt als fertig, bevor es im Browser in echter Breite nachgemessen wurde.**
- **Jedes neue Inhaltspaket bekommt ein Prüfskript**, das Vollständigkeit, eindeutige IDs und vorhandene Quellenangaben erzwingt — damit später niemand still etwas entfernt.
