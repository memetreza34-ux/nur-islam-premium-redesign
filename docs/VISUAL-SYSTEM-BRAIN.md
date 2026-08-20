# Nur Islam Premium — Visual-System-Gehirn

> **Stand:** 20.08.2026  
> **Zweck:** Dauerhafter Handoff für neue ChatGPT-Chats, damit das aktuelle Design-/Bild-Redesign ohne erneute Erklärung fortgesetzt werden kann.

---

## 0. Startauftrag für einen neuen Chat

Wenn ein neuer Chat eröffnet wird, zuerst genau das hier tun:

```text
Öffne mit dem GitHub-Connector das Repository `memetreza34-ux/nur-islam-premium-redesign` und arbeite auf dem Branch `visual-system-redesign`.
Lies zuerst vollständig `docs/VISUAL-SYSTEM-BRAIN.md`.
Prüfe danach den aktuellen Branch-HEAD, die aktuellen Screens, Assets und CSS-Dateien erneut, bevor du etwas änderst.
Setze den Visual-Redesign-Plan aus diesem Dokument fort. Nicht wieder von vorne planen und nicht ein komplett neues, fremdes App-Design erfinden.
Wichtig: Erst neue visuelle Assets und Komponenten systematisch planen/ersetzen; alte Bilder erst ganz am Ende löschen, wenn keine Referenzen mehr darauf zeigen.
```

Dieses Dokument ist für den **neuen visuellen Redesign-Plan** maßgeblich. Das ältere `docs/CHATGPT-BRAIN-HANDOFF.md` enthält allgemeinen Projektkontext, kann aber bei Branch-/Statusangaben veraltet sein.

---

# 1. Oberstes Ziel

Die bestehende App **Nur Islam Premium** wird nicht neu erfunden. Die vorhandene Funktionsstruktur bleibt die Basis.

Ziel ist ein vollständiges, zusammenhängendes Premium-Design-System, bei dem:

- jede Hauptseite eine klare visuelle Rolle hat,
- Bilder, Objekte, Figuren und Icons zueinander passen,
- nicht für jeden Screen ein anderer Stil entsteht,
- die App ruhig, hochwertig, spirituell und modern wirkt,
- der aktuelle Smaragd-/Gold-Charakter erhalten bleibt,
- alte kaputte, doppelte oder stilistisch widersprüchliche Assets schrittweise ersetzt werden,
- am Ende nur ein sauberes, kanonisches Asset-System übrig bleibt.

**Premium bedeutet nicht mehr Gold und mehr Effekte. Premium bedeutet Hierarchie, Ruhe, Qualität, Konsistenz und gute Bildkomposition.**

---

# 2. Feste Nutzerentscheidungen

Diese Punkte sind bereits entschieden und sollen in neuen Chats nicht erneut abgefragt werden.

## 2.1 Reale Gegenstände und Architektur

Dinge, die in der Realität existieren, sollen **realistisch und hochwertig** dargestellt werden.

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

Gewünschter Look:

- realistisch / cinematic
- hochwertiges 3D/CGI oder fotorealistischer Render-Look
- warme, kontrollierte Beleuchtung
- glaubwürdige Materialien
- edel statt kitschig
- keine billige KI-Optik
- kein Cartoon-Look für diese Gegenstände

## 2.2 Menschen / Figuren

Keine echten Menschen als visuelle Figuren.

Wenn eine menschliche Figur sinnvoll ist, soll sie als **hochwertige stilisierte 3D-Animationsfigur (Pixar-artig)** erscheinen.

Geeignete Einsatzorte:

- Onboarding
- Nur-Assistent
- Lernhilfe
- Erklärzustände
- Empty States
- freundliche Begleit-/Guide-Szenen

Nicht als echte Fotoperson darstellen.

Die Figuren sollen:

- freundlich,
- modern,
- hochwertig,
- weich modelliert,
- sympathisch,
- aber nicht kindisch oder albern wirken.

## 2.3 UI-Icons

Kleine Funktionsicons werden **nicht** als 3D-/Pixar-Objekte gebaut.

Für Navigation und Bedienung bleibt ein sauberes Vektor-System, bevorzugt Lucide oder ein gleichartiger konsistenter Outline-Stil.

Beispiele:

- Zurück
- Suche
- Favorit
- Teilen
- Einstellungen
- Menü
- Play
- Filter
- Home
- Kalender

Icons: konsistente Größe, Strichstärke und aktive/inaktive Zustände.

## 2.4 Bestehende Bilder als Vorlage

Bestehende Assets dürfen als **Referenz für Motiv, Rolle oder Komposition** verwendet werden.

Die großen visuellen Assets sollen langfristig jedoch möglichst neu und speziell für Nur Islam erstellt werden, damit die Bildsprache wirklich zusammenhängend wird.

## 2.5 Löschen alter Bilder

**Nicht sofort alle alten Bilder löschen.**

Richtige Reihenfolge:

1. Inventar prüfen.
2. Neue Zielrollen definieren.
3. Neue Assets erstellen.
4. Referenzen im Code ersetzen.
5. Screens visuell prüfen.
6. Erst dann unbenutzte Alt-Assets, Aliase und Fallback-Duplikate löschen.

---

# 3. Die drei visuellen Welten

## A. Sacred Premium Realistic

Für spirituelle Hauptmotive, reale islamische Objekte und Architektur.

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
- große Hero-Flächen

Merkmale:

- Deep Emerald
- Creme
- wenig, gezieltes Gold
- cinematic lighting
- hochwertige reale Materialien
- ruhige Komposition
- viel negativer Raum
- keine übertriebene Glow-Flut

## B. Friendly 3D Character

Für erklärende oder menschliche Situationen, ohne reale Personen.

Verwendung:

- Onboarding
- Assistent
- Lernen
- Hilfen
- Empty States

Merkmale:

- hochwertige animierte 3D-Figur
- modern
- freundlich
- nicht fotorealistisch
- nicht kindisch
- Farben müssen zur Nur-Islam-Palette passen

## C. Clean UI Iconography

Für Interaktion und Navigation.

Merkmale:

- Vektor
- klare Outline
- konsistente Strichstärke
- Gold/Creme/Muted Green je Zustand
- keine dekorativen 3D-Icons in kleinen Controls

---

# 4. Feste Brand-Richtung

Die bestehende Grundidentität bleibt erhalten.

## Farben

- Deep Emerald als Haupt-Hintergrund
- Emerald-Surfaces für Karten
- Cream / Warm Ivory für Text und ausgewählte helle Flächen
- Gold nur als kontrollierter Akzent
- Muted Green für sekundäre Information

## Typografie

Beibehalten:

- **Inter** für UI, Body, Buttons, Labels
- **Cormorant Garamond** für hochwertige Headlines / Hero-Titel

## Gold-Regel

Gold nicht gleichzeitig überall als:

- Rand,
- Text,
- Icon,
- Bild,
- Glow,
- Button,
- Fortschritt,
- Ornament

verwenden.

Pro Bereich wenige klare Goldakzente.

---

# 5. Komponenten-System

Jeder Screen soll überwiegend aus drei klaren Ebenen bestehen.

## 5.1 Hero Card

- maximal eine dominante Hero-Fläche pro Hauptscreen
- stärkstes Bild / stärkste Atmosphäre
- große Headline
- viel Luft
- nicht mit zu vielen Controls überladen

## 5.2 Feature Card

- wichtiges Feature
- darf ein Objektbild enthalten
- mittlere visuelle Gewichtung

## 5.3 Utility Row / Utility Card

- funktional
- wenig Dekoration
- meistens Icon + Text + Status
- kein unnötiges großes Bild

Diese Hierarchie soll die bisherige Überladung reduzieren.

---

# 6. Ziel-Asset-Struktur

Langfristiges Ziel:

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

characters/
  character-assistant-guide.webp
  character-onboarding-welcome.webp
  character-learning-helper.webp
  character-empty-state.webp

ornaments/
  ornament-rosette.svg
  ornament-geometric-pattern.svg
  ornament-divider.svg
```

Regeln:

- keine sinnlosen `v2`, `v3`, `final-final`-Namen
- eine kanonische Datei pro Rolle
- keine mehreren byte-identischen Dateien unter anderen Namen
- Aliase nur vorübergehend während Migration
- jedes Asset hat eine klare semantische Aufgabe

---

# 7. Screen-Reihenfolge

Der Redesign-Prozess erfolgt **Screen für Screen**, nicht überall gleichzeitig.

Empfohlene Reihenfolge:

1. Dashboard / Start
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
15. Empty States / Systemzustände
16. Sekundäre Legacy-/Detail-Screens

Ein Screen soll erst als visuell stabil gelten, bevor sein System auf den nächsten übertragen wird.

---

# 8. Bereits festgelegte Richtung für Dashboard / Home

Home ist der Referenzscreen für die gesamte App.

## Zielgefühl

- spirituell
- ruhig
- elegant
- modern
- hochwertig
- warm
- nicht überladen

## Hero

Geplantes Asset:

`hero-home-mosque.webp`

Richtung:

- klassische Moschee mit Kuppel und Minaretten
- realistischer/cinematischer Look
- Morgenlicht / Fajr-inspirierte Stimmung
- Deep-Emerald-Umgebung
- dezente goldene Lichtakzente
- genügend negativer Raum für Text
- kein echter Mensch
- keine 3D-Figur auf Home

## Home-Nebenassets

- `object-quran-book.webp`
- `object-tasbih.webp`
- `object-qibla-compass.webp`
- `object-mihrab.webp`
- `object-crescent.webp`

Nicht alle gleichzeitig groß zeigen. Die visuelle Hierarchie entscheidet, welche Assets tatsächlich sichtbar nötig sind.

## Home-Struktur

1. Top Bar: Nur-Brand + Erinnerung + Menü
2. Hero: Begrüßung + Headline + Datum + Moschee
3. Nächstes Gebet
4. Quran / Dein Weg / Weiterlesen
5. ausgewählte Quick Actions
6. Tagesinspiration

Home vermeiden:

- 3D-Character im Hero
- mehrere konkurrierende große Bilder
- übermäßiges Gold
- zu viele Card-Stile
- zu viele Ornamente
- zu viel Hero-Text

---

# 9. Nächster Arbeitsblock: Gebete / Prayer

Nach diesem Dokument soll als nächstes der reale `PrayerScreen` analysiert werden.

Für den Gebete-Screen konkret prüfen:

1. aktuelle React-Struktur
2. aktuelle CSS-Regeln
3. vorhandene Bilder und Fallbacks
4. Gebetszeiten-Liste und nächstes Gebet
5. welche Information Hero-Priorität verdient
6. ob ein eigener realistischer Prayer-Hero nötig ist
7. welche Gebetsphasen besser nur durch saubere Icons statt Bilder dargestellt werden
8. responsive Verhalten auf ca. 320 / 375 / 390 / 430 px
9. Dark-Theme-Hierarchie
10. Übertragung in das gemeinsame Komponenten-System

Erst danach das genaue Asset-Briefing für Prayer schreiben.

---

# 10. Wichtige bekannte Probleme aus der bisherigen Analyse

Bei der weiteren Arbeit berücksichtigen:

- Der bisherige Bildbestand enthält unterschiedliche Versionen, Aliase und Fallbacks.
- Die frühere Home-Moschee-Datei war problematisch/trunkiert; der Runtime-Pfad wurde zeitweise auf ein anderes Dome-Asset umgebogen.
- Einige Assets/Fallback-SVGs unterscheiden sich stilistisch stark von realistischen WebP-Motiven.
- CSS skaliert und maskiert Bilder teilweise sehr aggressiv, weil Ausgangsassets nicht optimal für ihre Zielkomposition vorbereitet sind.
- Das Stylesheet-System besitzt viele übereinander liegende Override-/Lock-Dateien und sehr viele `!important`-Regeln.
- Deshalb **keine weitere neue `final-lock-vX.css`-Schicht** als Standardlösung hinzufügen.
- Komponenten nach und nach in kanonische Styles konsolidieren.
- Niemals automatisch vermeintliche CSS-Duplikate löschen, ohne Render-/Computed-Style-Prüfung; Cascade-Reihenfolge kann absichtlich Werte zurückholen.

---

# 11. Arbeitsweise für jeden Screen

Immer dieselbe Reihenfolge:

## Schritt A — Ist-Zustand lesen

- JSX/TSX
- zugehörige Styles
- Asset-Pfade
- Runtime-Aliase
- vorhandene Fallbacks

## Schritt B — visuelle Rolle bestimmen

- was ist Hero?
- was ist Feature Card?
- was ist Utility?
- welches Bild ist wirklich nötig?
- welches Element braucht nur ein Icon?
- ist eine 3D-Figur sinnvoll oder unnötig?

## Schritt C — Asset-Briefing

Für jedes neue Bild festlegen:

- Dateiname
- Rolle
- Motiv
- Perspektive
- Licht
- Hintergrund
- Platz für UI/Text
- Seitenverhältnis
- gewünschter Stil
- was ausdrücklich vermieden wird

## Schritt D — Implementieren

- neue Assets einbauen
- Pfade vereinheitlichen
- CSS aufräumen statt weitere Override-Schichten stapeln
- nur betroffene Komponenten anfassen

## Schritt E — visuell prüfen

Mindestens:

- 320 px
- 375 px
- 390 × 844
- 430 px

Prüfen:

- Crop
- Überlagerungen
- Textkontrast
- Safe Area
- Taps/Focus
- Scroll
- Bild lädt wirklich
- kein falscher Fallback sichtbar
- keine abgeschnittenen Inhalte

## Schritt F — Altbestand erst dann entfernen

Erst löschen, wenn:

- keine Code-Referenz mehr existiert,
- kein Fallback mehr darauf angewiesen ist,
- neuer Screen geprüft wurde.

---

# 12. Religiöse Inhalte

Dieses Projekt enthält islamische Inhalte.

Bei Designarbeit keine religiösen Aussagen, Quran-Texte, Hadithe, Gebetsregeln oder Quellen beiläufig verändern.

Wenn religiöse Inhalte geändert oder ergänzt werden müssen:

- nur belegbare Quellen verwenden,
- Unsicherheit klar markieren,
- fachliche/scholarly Review als separate Anforderung respektieren.

Visual Redesign und religiöse Inhaltskorrektur sind zwei getrennte Aufgaben.

---

# 13. Was ausdrücklich nicht passieren soll

- Kein vollständiges fremdes Redesign, das mit Nur Islam nichts mehr zu tun hat.
- Nicht alle Bilder sofort löschen.
- Nicht jeden Screen mit 3D-Bildern überladen.
- Keine echten menschlichen Fotofiguren.
- Keine cartoonigen Moschee-/Kaaba-/Quran-Hauptbilder.
- Keine 3D-Pixar-Navigation-Icons.
- Kein Gold auf jedem Element.
- Keine neue CSS-Override-Schicht nur um alte Probleme zu überdecken.
- Keine Behauptung „pixel-perfect“, solange kein echter Rendervergleich erfolgt ist.
- Keine Designänderung nur anhand von Dateinamen; tatsächlichen Screen und Asset-Einsatz prüfen.

---

# 14. Aktueller Stand dieses Visual-Plans

**Planung abgeschlossen:**

- Grundidee bestätigt
- drei visuelle Welten definiert
- Asset-System definiert
- Lösch-/Migrationsstrategie definiert
- Home-Richtung definiert
- Screen-Reihenfolge definiert

**Noch nicht durchgeführt:**

- alte Bilder wurden noch nicht systematisch gelöscht
- neue finale Asset-Bibliothek ist noch nicht vollständig erstellt
- Prayer-Screen ist der nächste konkrete Analyse-/Designblock

---

# 15. Definition of Done für den gesamten Visual-Redesign

Fertig ist das visuelle Projekt erst, wenn:

- jeder relevante Screen einem gemeinsamen Design-System folgt,
- reale islamische Motive dieselbe hochwertige realistische Bildsprache besitzen,
- 3D-Figuren nur gezielt und konsistent genutzt werden,
- UI-Icons einheitlich sind,
- alte kaputte/doppelte/unnötige Assets entfernt sind,
- Asset-Pfade klar und semantisch sind,
- keine versteckten Alias-Ketten mehr nötig sind,
- CSS-Overrides deutlich reduziert und konsolidiert wurden,
- Home, Prayer, Quran, Lernen und weitere Hauptscreens auf echten mobilen Viewports geprüft wurden,
- Dark Theme hochwertig funktioniert,
- Bildkompositionen UI-Texte nicht blockieren,
- die App insgesamt wie **eine** bewusst gestaltete Premium-App aussieht und nicht wie viele getrennte KI-Designversuche.
