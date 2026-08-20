# Nur Islam Premium — Visual-System-Gehirn

> **Stand:** 20.08.2026  
> **Zweck:** Dauerhafter Projekt-Handoff für neue ChatGPT-/Claude-/Codex-Arbeit. Diese Datei ist die **Single Source of Truth** für das komplette Visual-Redesign: Zielbild, Bildsystem, Figuren, Icons, Komponenten, Asset-Migration, Screen-Reihenfolge, Referenzbilder und Qualitätsregeln.

---

# 0. Startauftrag für jeden neuen Chat

Ein neuer Chat soll **nicht wieder von vorne anfangen** und keine bereits geklärten Designfragen erneut stellen.

```text
Öffne das Repository `memetreza34-ux/nur-islam-premium-redesign`.
Arbeite für dieses Redesign auf dem Branch `visual-system-redesign`.
Lies zuerst vollständig `docs/VISUAL-SYSTEM-BRAIN.md`.
Prüfe danach den aktuellen Branch-HEAD sowie den tatsächlichen Code-, Asset- und CSS-Stand erneut.
Setze anschließend genau den hier dokumentierten Redesign-Prozess fort.
Nicht ein völlig neues fremdes App-Konzept bauen. Die bestehende Nur-Islam-App und ihre Funktionen bleiben die Basis.
Neue Bilder und Screens müssen dem freigegebenen Visual-System folgen. Keine eigenen abweichenden Stilinterpretationen.
Alte Bilder nicht vorschnell löschen. Zuerst neue Assets planen, erzeugen, einbauen und visuell prüfen; erst danach Altbestand entfernen.
```

Das ältere `docs/CHATGPT-BRAIN-HANDOFF.md` enthält allgemeinen Projektkontext. Für Design, Bilder, Figuren, Icons und die aktuelle Visual-Redesign-Strategie ist **diese Datei maßgeblich**.

---

# 1. Oberstes Ziel

Die App **Nur Islam Premium** soll visuell von einem bereits umfangreichen, aber teilweise uneinheitlichen Design zu einer **sehr hochwertigen, ruhigen, spirituellen und systematischen Premium-App** weiterentwickelt werden.

Die App wird **nicht komplett neu erfunden**. Vorhandene Funktionen, Navigation und gute Grundentscheidungen bleiben die Basis.

Ziel:

- ein klar erkennbares Nur-Islam-Designsystem,
- ein zusammenhängender Bildstil,
- ein zusammenhängender Figurenstil,
- ein einheitlicher Iconstil,
- klare Hero-/Feature-/Utility-Hierarchie,
- ruhige visuelle Komposition,
- weniger unnötiges Gold und Glow,
- weniger Asset-Aliase und Duplikate,
- weniger CSS-Override-Schulden,
- kanonische Assets mit klaren Rollen,
- jeder Screen wirkt sichtbar wie Teil **derselben App**.

Leitsatz:

> **Premium bedeutet nicht mehr Effekte. Premium bedeutet bessere Hierarchie, bessere Komposition, bessere Materialien, Ruhe, Konsistenz und Qualität.**

---

# 2. Feste Nutzerentscheidungen

Diese Punkte sind entschieden und sollen nicht erneut abgefragt werden.

## 2.1 Reale Dinge realistisch darstellen

Alles, was in der realen Welt wirklich existiert, soll im Regelfall **realistisch, hochwertig und glaubwürdig** aussehen.

Beispiele:

- Moschee
- Kaaba
- Quran
- Tasbih
- Gebetsteppich
- Mihrab
- Laterne
- Qibla-Kompass
- islamische Architektur
- Kuppeln
- Minarette
- Gebetsräume

Gewünschter Look:

- realistisch
- cinematic
- hochwertige 3D/CGI- oder fotorealistische Render-Qualität
- glaubwürdige Materialien
- warmes, kontrolliertes Licht
- ruhige Komposition
- edel statt kitschig
- keine billige typische KI-Optik
- nicht cartoonig

Bestehende Repo-Bilder dürfen als **Vorlage für Motiv, Rolle oder Komposition** dienen. Neue Hauptassets sollen möglichst gezielt und konsistent für Nur Islam erstellt werden.

## 2.2 Menschen niemals als echte Fotopersonen

Wenn ein Screen einen menschlichen Begleiter braucht, wird **keine reale Fotoperson** verwendet.

Stattdessen:

- hochwertige stilisierte 3D-Animationsfigur
- Pixar-artige Grundrichtung
- freundlich
- modern
- sympathisch
- weich modelliert
- hochwertig
- nicht albern
- nicht zu kindlich
- Kleidung/Farben passend zur Nur-Islam-Marke

Geeignete Bereiche:

- Onboarding
- Nur-Assistent
- Lernhilfe
- Erklärscreens
- Empty States
- Hilfesituationen

Home, Gebete, Quran, Qibla, Dhikr usw. sollen primär ruhig und spirituell bleiben und nicht unnötig mit Figuren gefüllt werden.

## 2.3 Kleine UI-Icons bleiben Vektoricons

Navigation und Bedienhandlungen werden **nicht** als 3D-/Pixar-Objekte gebaut.

Beispiele:

- Home
- Zurück
- Suche
- Favorit
- Teilen
- Einstellungen
- Menü
- Play
- Filter
- Glocke
- Kalender
- Navigation

Richtung:

- bevorzugt Lucide oder gleichartiger Outline-Stil
- konsistente optische Größe
- konsistente Strichstärke
- klare aktive/inaktive Zustände
- Cream / Gold / Muted Green je Zustand

Keine Mischung mehrerer Iconstile.

## 2.4 Die bestehende App bleibt die Basis

Behalten:

- Deep Emerald / Smaragdgrün
- Gold als Akzent
- Creme/Warm Ivory
- Inter für UI
- Cormorant Garamond für hochwertige Headlines
- bestehende Hauptnavigation
- bestehende Funktionsbreite
- warme Papier-/Creme-Welt des Quran Readers als bewusste Ausnahme

Nicht behalten müssen:

- inkonsistente Bilder
- doppelte Asset-Versionen
- kaputte Fallback-Ketten
- unnötige Glow-Flut
- übermäßig viele Card-Stile
- weitere CSS-Lock-Schichten als Dauerlösung

---

# 3. Die drei visuellen Welten

## A. Sacred Premium Realistic

Für reale islamische Motive, spirituelle Hauptbilder und hochwertige Objekte.

Verwendung:

- Dashboard/Home
- Gebete
- Quran
- Qibla
- Dhikr
- Duas
- Kalender
- Moscheen
- Hajj/Kaaba
- Daily Ayah/Hadith, wenn ein reales Objekt sinnvoll ist
- große Hero-Flächen

Merkmale:

- Deep Emerald
- Warm Ivory / Cream
- gezieltes Gold
- cinematic lighting
- hochwertige Materialien
- realistische Tiefe
- subtile Atmosphäre
- viel negativer Raum
- keine Glow-Flut
- keine übertriebene Sättigung

## B. Friendly 3D Character

Für erklärende oder menschliche Situationen ohne reale Personen.

Verwendung:

- Onboarding
- Assistent
- Lernhilfe
- Empty States
- Hilfescreens

Merkmale:

- hochwertige stilisierte 3D-Figur
- Pixar-artige Qualität
- modern
- freundlich
- weich
- nicht fotorealistisch
- nicht kindisch
- Nur-Islam-Farben

## C. Clean UI Iconography

Für Navigation und Bedienung.

Merkmale:

- Vektor
- Outline
- konsistente Strichstärke
- konsistente optische Größe
- keine 3D-Icons
- keine Asset-Bilder für einfache Bedienhandlungen

---

# 4. Brand-System

## Farben

- **Deep Emerald** = Haupt-Hintergrund
- **Emerald Surface** = Karten/Panels
- **Cream / Warm Ivory** = Haupttext und ausgewählte helle Flächen
- **Gold** = kontrollierter Premium-Akzent
- **Muted Green** = sekundäre Informationen

## Gold-Regel

Gold nicht gleichzeitig überall als Rand, Text, Icon, Bild, Glow, Button, Progress, Ornament und Navigation verwenden.

Faustregel:

- Emerald/Creme tragen den Screen.
- Gold hebt Wichtiges hervor.
- Gold ist nicht Standardfarbe für alles.

## Typografie

- **Inter** → UI, Body, Buttons, Labels
- **Cormorant Garamond** → Hero-Titel und hochwertige Headlines

Wichtig:

- wenige klare Schriftstufen
- gute Zeilenhöhe
- keine gequetschten Hero-Titel
- kleine Geräte mitdenken

---

# 5. Komponenten-System

Jeder Hauptscreen soll im Kern nur drei visuelle Ebenen verwenden.

## 5.1 Hero Card

- maximal eine dominante Hero-Fläche pro Hauptscreen
- stärkstes Bild / stärkste Atmosphäre
- große Headline bzw. zentrale Funktion
- viel Luft
- keine Badge-/Button-Überladung

## 5.2 Feature Card

- wichtiges Feature
- mittlere visuelle Gewichtung
- darf ein Objektbild enthalten
- klare CTA

## 5.3 Utility Row / Utility Card

- funktional
- minimal dekoriert
- meist Icon + Text + Status
- kein großes Bild ohne echten Mehrwert

---

# 6. Verbindliche Referenzbild-Strategie

Dieser Abschnitt ist **besonders wichtig**, weil die finalen Bilder später an Claude/Codex übergeben werden und dort als Designvorlage dienen.

## 6.1 Nicht möglichst viele Bilder erzeugen

Ziel ist **nicht**, viele Moodboards oder Übersichtsillustrationen zu sammeln.

Ziel ist:

> **wenige, gezielte, autoritative Referenzbilder, die untereinander vollständig einheitlich und widerspruchsfrei sind.**

Viele ähnliche Varianten führen dazu, dass Claude/Codex unklar wird, welche Version verbindlich ist. Deshalb wird pro klarer Designentscheidung möglichst nur **eine freigegebene Referenz** behalten.

## 6.2 Vier erlaubte Referenzbild-Rollen

Jedes bewusst erzeugte Referenzbild muss genau eine Hauptrolle besitzen:

### A. Hero-Referenzbild

Für das zentrale visuelle Motiv eines Screens.

Beispiele:

- Home-Moschee
- Prayer-Hero
- Quran-Hero

### B. Objekt-Referenzbild

Für ein wichtiges wiederverwendbares Einzelobjekt.

Beispiele:

- Quran
- Tasbih
- Qibla-Kompass
- Kaaba
- Laterne
- Gebetsteppich

### C. Character-Referenzbild

Für eine klar definierte 3D-Figur.

Beispiele:

- Nur-Assistent
- Onboarding-Guide
- Lernhilfe

### D. UI-/Screen-Referenzbild

Für den **konkreten Aufbau eines echten Screens oder einer klar abgegrenzten Komponente**.

Es dient Claude/Codex als Umsetzungsreferenz für:

- Layout
- Hierarchie
- Abstände
- Bildposition
- Karten
- Buttons
- Textzonen
- visuelle Gewichtung

Keine allgemeinen Übersichtsboards erzeugen, wenn ein konkreter Screen besser als Referenz dient.

## 6.3 Single Source of Truth pro Bereich

Für einen Screen soll später möglichst gelten:

- 1 verbindliche Screen-/UI-Referenz
- 1 verbindliches Hero-Asset, falls nötig
- klar definierte wiederverwendbare Objektassets
- 1 schriftliche Screen-Spezifikation

Wenn Varianten während der Entwicklung getestet werden, werden sie **nicht alle gleichzeitig als finale Referenzen geführt**. Nach einer Entscheidung wird eine Version als `approved`/kanonisch behandelt; verworfene Varianten dürfen Claude/Codex nicht als gleichwertige Vorgabe präsentiert werden.

## 6.4 Widerspruchsfreiheit zwischen Screens

Home, Prayer, Quran, Qibla, Dhikr usw. müssen dieselbe visuelle Familie bilden.

Nicht erlaubt:

- Home stark fotorealistisch, Prayer plötzlich cartoonig
- unterschiedliche Goldtöne ohne Grund
- andere Materialqualität bei jedem Objekt
- komplett andere Lichtlogik pro Screen
- zufällig wechselnde Card-Radien
- verschiedene Iconfamilien
- Assistent sehr kindlich, Onboarding deutlich realistischer 3D-Stil

Erlaubt sind unterschiedliche **Stimmungen innerhalb derselben Art-Direction**, z. B. Fajr-Licht auf Home und ruhigere Gebetsarchitektur auf Prayer.

## 6.5 Referenzbilder sind Produktionsvorgaben

Ein freigegebenes Bild ist nicht nur Inspiration, sondern soll Claude/Codex später als **Umsetzungsvorgabe** dienen.

Deshalb muss vor jeder finalen Bildgenerierung feststehen:

- Screen/Rolle
- Motiv
- Bildstil
- Licht
- Farbwelt
- Perspektive
- Crop
- freie Textzone
- Safe Zone
- Seitenverhältnis
- UI-Position des Motivs
- was ausdrücklich nicht vorkommen darf

## 6.6 Keine Übersichtsbild-Flut

Moodboards/Designübersichten dürfen intern einmal zur Orientierung existieren, sind aber **nicht** die primären Umsetzungsreferenzen.

Ab jetzt bevorzugt:

1. Screen schriftlich definieren
2. benötigte Bildrollen bestimmen
3. genau ein gezieltes Referenzbild erzeugen
4. dieses als verbindliche Version dokumentieren
5. erst dann weiter zum nächsten Screen

---

# 7. Allgemeine Bildregeln

## 7.1 Jedes Bild braucht eine klare Rolle

Jedes Bild muss beantworten:

- Auf welchem Screen wird es benutzt?
- Ist es Hero, Objekt, Ornament oder Character?
- Warum braucht dieser Bereich ein Bild?
- Ist ein Vektoricon besser?

Keine Bilder nur deshalb hinzufügen, weil eine Fläche leer ist.

## 7.2 Bilder müssen für die UI komponiert werden

Vor Erzeugung festlegen:

- Seitenverhältnis
- Position des Hauptmotivs
- freie Textfläche
- Lichtquelle
- Hintergrund
- Crop-Zone
- sichere Zone für Mobilgeräte

Dadurch sollen spätere Korrekturen wie `scale(1.8)`, starke `translate()`, aggressive Masken oder extreme Filter weitgehend entfallen.

## 7.3 Konsistente reale Objekte

Quran, Tasbih, Laterne, Kaaba usw. müssen aus derselben Art-Direction wirken:

- ähnliche Lichtqualität
- ähnliche Materialqualität
- ähnliche Tiefenwirkung
- ähnliche Farbstimmung
- keine sichtbare Mischung aus flachem SVG und fotorealistischem CGI als Hauptmotive

## 7.4 Fallbacks

Technische Fallbacks dürfen existieren, aber nicht stilistisch komplett umspringen.

Besser:

- neutraler Emerald-Marken-Fallback
- dezentes Ornament
- semantisches Icon

statt eines völlig anderen Illustrationsstils.

---

# 8. Ziel-Asset-Struktur

```text
public/assets/

brand/
  nur-logo-mark.svg
  nur-logo-emblem.webp

heroes/
  hero-home-mosque.webp
  hero-prayer-dome.webp
  hero-quran.webp
  hero-learning-mihrab.webp
  hero-calendar.webp
  hero-mosque-finder.webp

objects/
  object-quran-book.webp
  object-kaaba.webp
  object-tasbih.webp
  object-qibla-compass.webp
  object-lantern.webp
  object-prayer-mat.webp
  object-mihrab.webp
  object-crescent.webp
  object-dua-hands.webp
  object-calendar.webp
  object-bookmark.webp

characters/
  character-assistant-guide.webp
  character-onboarding-welcome.webp
  character-onboarding-learning.webp
  character-learning-helper.webp
  character-empty-state.webp

ornaments/
  ornament-rosette.svg
  ornament-geometric-pattern.svg
  ornament-divider.svg

references/
  screens/
    home-approved.webp
    prayer-approved.webp
    quran-approved.webp
  components/
```

Regeln:

- keine sinnlosen `v2`, `v3`, `new`, `final-final`-Namen
- eine kanonische Datei pro Rolle
- keine byte-identischen Duplikate unter mehreren Namen
- Aliase nur während Migration
- Referenzbilder klar als `approved` kennzeichnen, sobald die Entscheidung final ist

---

# 9. Alte Bilder: Löschstrategie

Nicht sofort alles löschen.

Richtige Reihenfolge:

1. komplettes Bildinventar erfassen
2. Screen-Zuordnung erfassen
3. behalten / Vorlage / ersetzen / löschen entscheiden
4. neues Zielasset definieren
5. neues Bild erstellen
6. im Code referenzieren
7. Screen prüfen
8. alte Referenzen entfernen
9. unbenutztes Asset endgültig löschen

Am Ende soll der alte Bestand trotzdem konsequent bereinigt werden.

---

# 10. Bekannte aktuelle Design-/Asset-Schulden

- mehrere Versionen derselben Motive
- `.png`, `.webp`, `-v2`, SVG-Fallbacks und Aliase nebeneinander
- einzelne doppelte/semantisch unklare Assets
- frühere beschädigte/trunkierte Home-Moschee und Runtime-Umleitung auf ein anderes Dome-Asset
- realistische WebPs und deutlich andersartige SVG-Fallbacks
- Bilder werden teilweise stark skaliert, verschoben, maskiert, gefiltert oder in Opacity verändert
- sehr viele Stylesheets, Override-Layer und `!important`-Regeln

Deshalb:

- keine neue `final-lock-vX.css`-Mentalität
- Komponenten schrittweise in kanonische Styles zurückführen
- CSS-Duplikate nicht blind löschen; Cascade-Reihenfolge kann renderrelevant sein

---

# 11. Reihenfolge des Redesigns

1. Dashboard / Home
2. Gebete / Prayer
3. Quran
4. Qibla
5. Dhikr
6. Duas
7. Kalender
8. Lernen
9. Moscheen
10. Sammlungen
11. Profil / Mehr
12. Nur-Assistent
13. Splash
14. Onboarding
15. Empty States / Fehler-/Systemzustände
16. sekundäre Legacy-/Detail-Screens

Ein Screen wird erst als abgeschlossen betrachtet, wenn Bildrollen, Icons, Komponenten, Responsive-Verhalten und Referenzen konsistent sind.

---

# 12. Dashboard / Home — festgelegte Richtung

Home ist der Referenzscreen für die visuelle Sprache der App.

## Zielgefühl

- spirituell
- ruhig
- elegant
- modern
- hochwertig
- warm
- nicht überladen

## Hero

Kanonischer Zielname:

`hero-home-mosque.webp`

Richtung:

- klassische Moschee mit Kuppel und Minaretten
- realistisch/cinematic
- bevorzugt Fajr-/Morgenlicht
- Deep-Emerald-Umgebung
- dezente warme Goldlicht-Akzente
- genügend negativer Raum für Text
- keine echte Person
- keine 3D-Figur im Home-Hero

## Mögliche Home-Objekte

- `object-quran-book.webp`
- `object-tasbih.webp`
- `object-qibla-compass.webp`
- `object-mihrab.webp`
- `object-crescent.webp`

Nicht alle gleichzeitig prominent einsetzen.

## Home-Struktur

1. Top Bar: Nur-Brand + Erinnerung + Menü
2. Hero: Begrüßung + Headline + Datum + Moschee
3. nächstes Gebet
4. Quran / Dein Weg / Weiterlesen
5. ausgewählte Quick Actions
6. Tagesinspiration

Vermeiden:

- Character im Hero
- mehrere konkurrierende große Bilder
- übermäßiges Gold
- zu viele Card-Stile
- Ornament-/Glow-Flut

---

# 13. Gebete / Prayer — aktueller aktiver Arbeitsblock

Der reale `PrayerScreen.tsx` wurde geprüft.

Aktuell vorhandene Kernfunktionen:

- Header mit Hijri-Datum
- Live-/Cache-/Fallback-Status
- Standortkarte
- optionaler Standort-Hinweis
- großes Next-Prayer-Panel
- Uhrzeit und Countdown
- Gebet als erledigt markieren
- Hinweiston testen
- Tagesfortschritt 0–5
- Liste aller Gebetszeiten
- Erinnerung pro Pflichtgebet
- Berechnungsmethode / Asr-Schule
- Abschluss-/Celebration-Modal

Diese Funktionen bleiben grundsätzlich erhalten.

## Aktuelles visuelles Problem

Der Screen ist funktional stark, aber visuell überwiegend CSS-/Icon-getrieben. Das aktuelle Prayer-Hauptmotiv wird über CSS als schwach eingeblendetes `dome-v2.webp` in das Next-Prayer-Panel gelegt. Gleichzeitig existieren Glow, Kreisdeko, Verlauf, Progress, große Zeit und mehrere Controls in derselben Fläche.

Das erzeugt viel visuelle Konkurrenz und kein klares, autoritatives Prayer-Hero-System.

## Neue Prayer-Grundentscheidung

Prayer soll **nicht** für Fajr, Dhuhr, Asr, Maghrib und Isha jeweils ein eigenes großes Bild bekommen.

Stattdessen:

- **ein einziges starkes realistisches Prayer-Hero-Motiv**
- Gebetszeiten darunter als ruhige Utility Rows
- Prayer-Zeit-Symbole weiterhin als saubere Vektoricons
- keine Pixar-Figur auf diesem Screen

Geplanter Hero-Zielname:

`hero-prayer-dome.webp`

Die genaue Prayer-Spezifikation wird separat in `docs/PRAYER-VISUAL-SPEC.md` geführt.

---

# 14. Vorläufige Bildrollen weiterer Hauptscreens

| Screen | Hauptvisual | Stil |
|---|---|---|
| Home | Moschee | realistisch/cinematic |
| Prayer | Kuppel/Mihrab/Gebetsarchitektur | realistisch |
| Quran | hochwertiger Quran | realistisch |
| Qibla | Qibla-Kompass + ggf. Kaaba | realistisch |
| Dhikr | Tasbih | realistisch |
| Duas | dezente Dua-/Lichtsymbolik | realistisch, respektvoll |
| Kalender | islamischer Kalender/Crescent | realistisches Premium-Objekt |
| Lernen | Mihrab/Quran + punktuell 3D-Guide | gemischt |
| Moscheen | Moschee | realistisch |
| Sammlungen | Bookmark/Quran-Objekt | realistisch/minimal |
| Profil/Mehr | Nur-Brand | clean UI |
| Assistent | definierte 3D-Guide-Figur | 3D Character |
| Splash | Nur-Brand + hochwertige Atmosphäre | Brand/realistisch |
| Onboarding | reale Objekte + 3D-Figur, wenn sinnvoll | gemischt |
| Empty States | 3D-Guide oder neutraler Brand-Fallback | 3D/Brand |

---

# 15. Workflow pro Screen

## A. Ist-Zustand analysieren

- TSX/JSX
- Datenabhängigkeiten
- Styles
- Komponenten
- Asset-Pfade
- Runtime-Aliase
- Fallbacks

## B. Screen-Hierarchie definieren

- Hero
- wichtigstes Feature
- Utility-Bereiche
- nötige Bilder
- reine Icons
- Character ja/nein

## C. Schriftliche Screen-Spezifikation erstellen

Vor Bildgenerierung genau dokumentieren:

- Aufbau
- Komponenten
- Informationshierarchie
- Bildrolle
- Farb-/Lichtstimmung
- responsive Verhalten

## D. Asset-Briefing

Für jedes neue Bild exakt festlegen:

- kanonischer Dateiname
- Screen
- Rolle
- Motiv
- Perspektive
- Licht
- Material
- Hintergrund
- freie Textfläche
- Seitenverhältnis
- Crop-/Safe-Zone
- Negativregeln

## E. Genaues Referenzbild erzeugen

- keine Variantenflut
- gezielt auf schriftliche Spezifikation
- erst nach Prüfung als `approved` behandeln

## F. Implementieren

- neue Pfade einbauen
- alte Aliase reduzieren
- CSS konsolidieren statt neue Lock-Schicht
- Funktionen erhalten

## G. Visuell prüfen

Mindestens:

- 320 px
- 375 px
- 390 × 844
- 430 px

Prüfen:

- Crop
- Bildposition
- Textüberlagerung
- Kontrast
- Safe Area
- Scroll
- Touch/Focus
- keine falschen Fallbacks
- Bild lädt wirklich

## H. Altbestand entfernen

Erst wenn neuer Screen stabil und referenzfrei vom Altasset ist.

---

# 16. Icon-System

- ein Outline-Stil
- bevorzugt Lucide
- gleiche optische Größe
- gleiche Strichstärke
- gleiche vertikale Ausrichtung
- Active State klar, aber zurückhaltend
- nicht jedes Icon Gold

Bottom Navigation bleibt grundsätzlich erhalten. Lange Labels dürfen für schmale Geräte verkürzt werden, ohne den Screen-Titel zu ändern.

---

# 17. Figuren-System

Nicht zehn unterschiedlich aussehende 3D-Personen erzeugen.

Ziel:

- ein Haupt-Guide oder kleine definierte Figurenfamilie
- gleiche Modellierungsqualität
- gleiche Gesichts-/Augenästhetik
- gleiche Materialwelt
- gleiche Lichtqualität
- passende Kleidung
- Emerald-/Cream-/Gold-Bezug

Der Nur-Assistent ist der stärkste Kandidat für eine charakteristische Hauptfigur.

---

# 18. Dark / Light

Priorität:

1. Dark Theme visuell perfektionieren
2. Light Theme danach systematisch angleichen

Light Theme = warmes Ivory/Creme, nicht einfach Weiß + Gold.

Quran Reader darf als bewusste Ausnahme seine warme Papierwelt behalten.

---

# 19. Responsive & Accessibility

Vorhandene Stärken nicht verschlechtern:

- Safe Areas
- Focus Visible
- Reduced Motion
- ausreichender Kontrast
- Touch Targets
- keine Art, die Buttons blockiert
- keine überstehenden Bilder
- keine abgeschnittenen Texte

Kernbreiten: 320 / 375 / 390 / 430.

---

# 20. Religiöse Inhalte

Designänderungen dürfen religiöse Inhalte nicht beiläufig umschreiben.

Bei Quran, Hadith, Gebetsregeln, Duas, islamischen Aussagen und Quellen:

- nicht aus Designgründen frei verändern
- fachliche Korrektheit separat prüfen
- bei Unsicherheit nicht als endgültig korrekt behaupten
- vorhandene Review-/Prüfprozesse respektieren

---

# 21. Was ausdrücklich nicht gemacht wird

- nicht alle Bilder sofort löschen
- nicht die komplette App neu erfinden
- nicht jeden Screen in anderer Stilwelt bauen
- nicht überall Pixar-3D einsetzen
- reale Moschee/Kaaba/Quran nicht als Cartoon darstellen
- keine echten Menschenfotos
- keine 3D-Pixar-Icons für Navigation
- keine neue CSS-Override-Schicht für jedes Problem
- nicht blind `!important`-Duplikate löschen
- keine Gold-/Glow-Flut
- keine unklaren Assetnamen
- keine fünf gleichberechtigten Designvarianten als Vorgabe für Claude/Codex
- keine Pixel-perfect-Behauptung ohne echten Rendervergleich

---

# 22. Definition of Done — einzelner Screen

Ein Screen ist erst fertig, wenn:

- klare Hero-/Feature-/Utility-Hierarchie vorhanden ist
- Hauptvisual zur gemeinsamen Bildwelt passt
- nur nötige Bilder verwendet werden
- Icons konsistent sind
- schriftliche Screen-Spezifikation existiert
- eine eindeutige freigegebene Referenz existiert, falls der Screen eine visuelle Referenz braucht
- Assets kanonisch benannt sind oder eine dokumentierte Migration besitzen
- keine sichtbaren kaputten Fallbacks vorhanden sind
- responsive Kernbreiten geprüft sind
- Dark Theme stimmig ist
- Interaktionen weiterhin funktionieren
- keine unnötige neue CSS-Schulden-Schicht entstanden ist

---

# 23. Definition of Done — gesamtes Visual Redesign

Abgeschlossen erst wenn:

1. alle Hauptscreens nach demselben System überarbeitet sind
2. jedes Hauptbild eine klare Rolle besitzt
3. reale Gegenstände konsistent realistisch wirken
4. Figuren konsistent als hochwertige 3D-Animationswelt auftreten
5. UI-Icons einheitlich sind
6. alte doppelte/kaputte/ungenutzte Assets entfernt sind
7. Alias-Ketten weitgehend verschwunden sind
8. CSS nicht durch neue Lock-Layer weiter anwächst
9. Home als Referenzscreen hochwertig wirkt
10. Prayer, Quran, Qibla, Dhikr, Duas, Kalender, Lernen usw. sichtbar derselben App angehören
11. Responsive geprüft ist
12. Claude/Codex nur eindeutige, widerspruchsfreie `approved` Referenzen erhält
13. ein neuer Chat allein anhand dieser Datei exakt weiterarbeiten kann

---

# 24. Aktueller Stand / nächster Schritt

Bereits festgelegt:

- drei visuelle Welten
- realistische reale Objekte
- 3D-Animationsfiguren statt echter Menschen
- Vektoricons für UI
- Emerald/Gold/Creme bleibt
- Home-Grundrichtung
- Asset-Zielstruktur
- sichere Löschstrategie
- Screen-Reihenfolge
- **neue autoritative Referenzbild-Strategie für Claude/Codex**

Aktuell aktiv:

1. Prayer-Screen vollständig analysieren
2. `docs/PRAYER-VISUAL-SPEC.md` erstellen
3. daraus genau ein gezieltes Prayer-Referenzbild definieren
4. Referenz auf Widersprüche zu Home/Brand prüfen
5. erst dann Prayer im Code umsetzen
6. danach Quran nach demselben Verfahren

---

# 25. Pflege dieses Gehirns

Nach jedem größeren Arbeitspaket aktualisieren:

- neue Designentscheidung
- freigegebene Referenzbilder
- kanonische Assetnamen
- entfernte Altassets
- abgeschlossene Screens
- nächster Screen
- geänderte/präzisierte visuelle Regeln

Diese Datei bleibt die **Single Source of Truth** für das Visual Redesign.
