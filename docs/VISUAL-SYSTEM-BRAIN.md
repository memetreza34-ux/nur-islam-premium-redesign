# Nur Islam Premium — Visual-System-Gehirn

> **Stand:** 20.08.2026  
> **Zweck:** Dauerhafter Projekt-Handoff für neue ChatGPT-Chats. Diese Datei beschreibt vollständig, was beim visuellen Redesign der App gewollt ist, welche Entscheidungen bereits gefallen sind, wie Bilder/Figuren/Icons aufgebaut werden sollen und in welcher Reihenfolge weitergearbeitet wird.

---

# 0. Startauftrag für jeden neuen Chat

Ein neuer Chat soll **nicht wieder von vorne anfangen** und den Nutzer nicht dieselben Designfragen erneut stellen.

Zuerst:

```text
Öffne mit dem GitHub-Connector das Repository `memetreza34-ux/nur-islam-premium-redesign`.
Arbeite für dieses Redesign auf dem Branch `visual-system-redesign`.
Lies `docs/VISUAL-SYSTEM-BRAIN.md` vollständig.
Prüfe danach den aktuellen Branch-HEAD und den tatsächlichen aktuellen Code-/Asset-Stand erneut.
Setze anschließend genau den hier beschriebenen Visual-Redesign-Prozess fort.
Nicht ein völlig neues fremdes App-Konzept bauen. Die bestehende Nur-Islam-App und ihre Funktionen bleiben die Basis.
Alte Bilder nicht vorschnell löschen. Zuerst neue Assets planen, erzeugen, einbauen und visuell prüfen; erst danach Altbestand entfernen.
```

Das ältere `docs/CHATGPT-BRAIN-HANDOFF.md` enthält allgemeinen Projektkontext. Bei Design, Bildern und der aktuellen Visual-Redesign-Strategie ist **diese Datei maßgeblich**.

---

# 1. Oberstes Ziel

Die App **Nur Islam Premium** soll visuell von einem bereits umfangreichen, aber teilweise uneinheitlichen Design zu einer **sehr hochwertigen, ruhigen und systematischen Premium-App** weiterentwickelt werden.

Die App wird **nicht komplett neu erfunden**. Vorhandene Funktionen, Navigation und gute Grundentscheidungen bleiben die Basis.

Das Ziel ist:

- ein klar erkennbares Nur-Islam-Designsystem,
- ein zusammenhängender Bildstil,
- ein zusammenhängender Figurenstil,
- ein einheitlicher Iconstil,
- ruhige visuelle Hierarchie,
- bessere Bildkomposition statt aggressiver CSS-Korrekturen,
- weniger visuelles Chaos,
- weniger unnötiges Gold und Glow,
- weniger Asset-Aliase und Duplikate,
- langfristig eine saubere kanonische Asset-Struktur,
- jeder Screen soll sich wie Teil **derselben App** anfühlen.

Leitsatz:

> **Premium bedeutet nicht mehr Effekte. Premium bedeutet bessere Hierarchie, bessere Komposition, bessere Materialien, Ruhe, Konsistenz und Qualität.**

---

# 2. Was der Nutzer konkret will

Diese Entscheidungen sind bereits getroffen und sollen nicht erneut abgefragt werden.

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
- reale islamische Gegenstände

Gewünschter Look:

- realistisch
- cinematic
- hochwertige 3D/CGI- oder fotorealistische Render-Qualität
- glaubwürdige Materialien
- warmes, kontrolliertes Licht
- ruhige Komposition
- nicht kitschig
- keine billige typische KI-Bildoptik
- nicht cartoonig

Bestehende Bilder aus dem Repo dürfen als **Vorlage für Motiv, Rolle oder Komposition** dienen. Die neuen Assets sollen jedoch möglichst gezielt für Nur Islam neu aufgebaut werden.

---

## 2.2 Menschen niemals als echte Fotopersonen

Wenn ein Screen einen menschlichen Begleiter oder eine Figur benötigt, soll **keine reale Fotoperson** verwendet werden.

Stattdessen:

- hochwertige stilisierte 3D-Animationsfigur
- Pixar-artige Grundrichtung
- freundlich
- sympathisch
- modern
- weich modelliert
- hochwertig
- nicht albern
- nicht zu kindlich
- Kleidung und Farbgebung passend zur Nur-Islam-Marke

Geeignete Bereiche:

- Onboarding
- Nur-Assistent
- Lernhilfe
- Erklärscreens
- Empty States
- Hilfesituationen
- freundliche Guide-Szenen

Nicht jeder Screen braucht eine Figur. Vor allem Home, Gebete, Quran usw. sollen primär ruhig und spirituell bleiben.

---

## 2.3 UI-Icons nicht als 3D-Pixar-Objekte

Kleine Funktionsicons bleiben **saubere Vektoricons**.

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

- Lucide oder gleichartiger Outline-Stil
- konsistente Strichstärke
- konsistente Größen
- klare aktive/inaktive Zustände
- Cream / Gold / Muted Green nach Zustand

Keine 3D-Icons in kleinen Controls und keine Mischung aus mehreren Iconstilen.

---

## 2.4 Die App soll nicht komplett anders werden

Die bestehende Grundrichtung ist gut genug, um darauf aufzubauen.

Behalten:

- Deep Emerald / Smaragdgrün
- Gold als Akzent
- Creme/Warm Ivory
- Inter für UI
- Cormorant Garamond für hochwertige Headlines
- bestehende Hauptnavigation
- starke Funktionsbreite
- Quran-Reader darf eine eigene warme Papier-/Creme-Welt behalten

Nicht behalten müssen:

- inkonsistente Bilder
- doppelte Asset-Versionen
- kaputte Fallback-Ketten
- unnötige Glow-Flut
- übermäßig viele verschiedene Card-Stile
- zusätzliche CSS-Lock-Schichten als Dauerlösung

---

# 3. Die drei visuellen Welten

Die gesamte App soll aus **drei klar getrennten visuellen Kategorien** bestehen.

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
- kein billiges Compositing
- keine übertriebene Sättigung
- keine Glow-Flut

---

## B. Friendly 3D Character

Für menschlich erklärende Situationen ohne reale Personen.

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
- Kleidung/Farben passend zur App
- Hintergründe nicht zu bunt

---

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

## 4.1 Farben

Grundidentität bleibt:

- **Deep Emerald** = Haupt-Hintergrund
- **Emerald Surface** = Karten und Panels
- **Cream / Warm Ivory** = Haupttext und ausgewählte helle Flächen
- **Gold** = kontrollierter Premium-Akzent
- **Muted Green** = sekundäre Informationen

Vorhandene Kernrichtung aus dem Repo darf als Basis dienen, insbesondere die dunkle Smaragd-/Gold-Welt.

## 4.2 Gold-Regel

Gold darf nicht gleichzeitig überall vorkommen als:

- Rand
- Text
- Icon
- Bild
- Glow
- Button
- Progress
- Ornament
- Navigation

Pro Bereich wenige gezielte Goldakzente.

Faustregel:

- Emerald/Creme tragen den Screen
- Gold hebt Wichtiges hervor
- Gold ist **nicht** die Standardfarbe für alles

## 4.3 Typografie

Beibehalten:

- **Inter** → UI, Body, Buttons, Labels
- **Cormorant Garamond** → Hero-Titel, hochwertige Headlines

Wichtig:

- weniger verschiedene Schriftgrößen
- gute Zeilenhöhe
- keine zu engen Hero-Headlines
- gute Lesbarkeit auf kleinen Geräten

---

# 5. Komponenten-System

Jeder Hauptscreen soll im Kern nur drei visuelle Ebenen verwenden.

## 5.1 Hero Card

- maximal eine dominante Hero-Fläche pro Hauptscreen
- stärkstes Bild / stärkste Atmosphäre
- große Headline
- klarer Schwerpunkt
- viel Luft
- nicht mit zu vielen Buttons und Badges überladen

## 5.2 Feature Card

- wichtiges Feature
- mittlere visuelle Gewichtung
- darf ein Objektbild enthalten
- klare CTA

## 5.3 Utility Row / Utility Card

- funktional
- minimal dekoriert
- meist Icon + Text + Status
- kein großes Bild, wenn es keinen echten Mehrwert bringt

Ziel: weniger konkurrierende Kartentypen und klarere Hierarchie.

---

# 6. Bildregeln

## 6.1 Ein Bild braucht eine klare Rolle

Jedes Bild muss beantworten:

- Auf welchem Screen wird es benutzt?
- Ist es Hero, Objekt, Ornament oder Character?
- Warum braucht dieser Bereich ein Bild?
- Ist ein Vektoricon vielleicht besser?

Keine Bilder nur deshalb hinzufügen, weil eine Fläche leer ist.

## 6.2 Bilder müssen für die UI komponiert werden

Neue Hero-/Objektbilder sollen von Anfang an zur späteren UI passen.

Vor Erzeugung festlegen:

- Seitenverhältnis
- Position des Hauptmotivs
- freie Textfläche
- Lichtquelle
- Hintergrund
- Crop-Zone
- sichere Zone für Mobilgeräte

Dadurch soll später weniger nötig sein wie:

- `scale(1.8)`
- starke `translate()`-Korrekturen
- aggressive Masken
- extreme Filter
- zufällige Opacity-Korrekturen

## 6.3 Konsistente reale Objekte

Quran, Tasbih, Laterne, Kaaba usw. müssen wirken, als kämen sie aus derselben Art-Direction:

- ähnliche Lichtqualität
- ähnliche Materialqualität
- ähnliche Tiefenwirkung
- ähnliche Farbstimmung
- keine Mischung aus flachem SVG und fotorealistischem CGI als sichtbare Hauptmotive

## 6.4 Fallbacks

Technische Fallbacks dürfen existieren, sollen aber stilistisch nicht plötzlich komplett anders aussehen.

Besser:

- neutraler Marken-Fallback
- Emerald-Fläche
- dezentes Ornament
- semantisches Icon

statt eines völlig anderen flachen Illustrationsstils.

---

# 7. Ziel-Asset-Struktur

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
```

Regeln:

- keine sinnlosen `v2`, `v3`, `new`, `final-final`-Namen
- eine kanonische Datei pro Rolle
- keine byte-identischen Duplikate unter mehreren Namen
- Aliase nur während Migration
- Asset-Namen beschreiben die Rolle, nicht die Entstehungsgeschichte

---

# 8. Alte Bilder: Löschstrategie

Der ursprüngliche Gedanke war, alle Bilder zu löschen und komplett neu zu bauen. Die sichere Umsetzung ist jedoch bewusst anders:

## Nicht sofort löschen

Richtige Reihenfolge:

1. komplettes Bildinventar erfassen
2. Screen-Zuordnung erfassen
3. entscheiden: behalten / als Vorlage nutzen / ersetzen / löschen
4. neues Zielasset definieren
5. neues Bild erstellen
6. im Code referenzieren
7. Screen prüfen
8. alte Referenzen entfernen
9. unbenutztes Asset endgültig löschen

Warum:

- sonst brechen Pfade
- Fallbacks können ausfallen
- Screens können leer werden
- Tests können unerwartet fehlschlagen

Am Ende soll der Altbestand trotzdem konsequent bereinigt werden.

---

# 9. Bekannte Probleme des aktuellen Repos, die beim Redesign berücksichtigt werden müssen

Aus der bisherigen A-Z-Analyse:

## 9.1 Bild-/Asset-Schulden

- mehrere Versionen desselben Motivs
- `.png`, `.webp`, `-v2`, SVG-Fallbacks und Aliase nebeneinander
- mindestens einzelne doppelte Dateien unter verschiedenen Namen
- semantisch unklare Asset-Pfade

## 9.2 Home-Moschee

Ein früheres Moschee-Rasterasset war beschädigt/trunkiert. Runtime-Logik hat deshalb zeitweise auf ein anderes intaktes Dome-Asset umgeleitet.

Folge:

- JSX-/Dokumentationsrolle und tatsächlich gerendertes Bild können auseinanderlaufen
- genau solche Alias-Ketten sollen im neuen System verschwinden

## 9.3 Unterschiedliche Fallback-Stile

Ein realistisches WebP kann bei Fehler auf ein flaches SVG wechseln. Das ist technisch robust, aber visuell inkonsistent.

## 9.4 Aggressive Bild-CSS-Regeln

Aktuelle Bilder werden teilweise stark:

- skaliert
- verschoben
- maskiert
- gefiltert
- in Opacity verändert

Das ist ein Zeichen dafür, dass die Master-Assets nicht optimal für ihre Rolle komponiert wurden.

## 9.5 CSS-Cascade-Schulden

Das Repo besitzt sehr viele Stylesheets, Override-Layer und `!important`-Regeln.

Deshalb:

- keine neue `final-lock-v3.css`-Mentalität
- nicht immer noch eine letzte Override-Schicht hinzufügen
- Komponenten schrittweise in kanonische Styles zurückführen
- CSS-Duplikate nicht blind automatisiert löschen; Reihenfolge kann renderrelevant sein

---

# 10. Reihenfolge des gesamten Redesigns

Wir arbeiten **Screen für Screen**, nicht gleichzeitig an allem.

## Hauptreihenfolge

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

Ein Screen wird erst als abgeschlossen betrachtet, wenn:

- Bildrollen geklärt sind
- Assets passen
- Icons konsistent sind
- Card-Hierarchie stimmt
- Responsive geprüft ist
- keine sichtbaren falschen Fallbacks vorhanden sind

---

# 11. Dashboard / Home — bereits festgelegte Richtung

Home ist der Referenzscreen für den Stil der gesamten App.

## 11.1 Zielgefühl

- spirituell
- ruhig
- elegant
- modern
- hochwertig
- warm
- nicht überladen

## 11.2 Home-Hero

Geplanter kanonischer Dateiname:

`hero-home-mosque.webp`

Richtung:

- klassische Moschee
- Kuppel und Minarette
- realistisch/cinematic
- Fajr-/Morgenlicht als bevorzugte Grundstimmung
- Deep-Emerald-Umgebung
- dezente warme Goldlicht-Akzente
- genug negativer Raum für Text
- kein echter Mensch
- keine 3D-Figur im Home-Hero

## 11.3 Home-Nebenassets

Mögliche kanonische Assets:

- `object-quran-book.webp`
- `object-tasbih.webp`
- `object-qibla-compass.webp`
- `object-mihrab.webp`
- `object-crescent.webp`

Nicht alle gleichzeitig prominent verwenden. Erst Hierarchie entscheiden.

## 11.4 Home-Struktur

1. Top Bar: Nur-Brand + Erinnerung + Menü
2. Hero: Begrüßung + Headline + Datum + Moschee
3. Nächstes Gebet
4. Quran / Dein Weg / Weiterlesen
5. ausgewählte Quick Actions
6. Tagesinspiration

## 11.5 Home vermeiden

- 3D-Character als Hauptmotiv
- mehrere große konkurrierende Bilder
- übermäßiges Gold
- zu viele Card-Stile
- zu viele Ornamente
- zu langer Hero-Text
- Glow auf jedem Element

---

# 12. Gebete / Prayer — nächster konkreter Screen

Nach Sicherung dieses Gehirns ist der nächste aktive Screen **Gebete / Prayer**.

Dort zunächst den tatsächlichen Repo-Stand lesen:

- `PrayerScreen.tsx`
- alle zugehörigen CSS-Regeln
- aktuelle Asset-Pfade
- Fallbacks
- Gebetslisten
- Next-Prayer-Komponente
- etwaige Prayer-Learning-Verknüpfungen

Danach festlegen:

## 12.1 Hero-Frage

Der Screen braucht wahrscheinlich einen ruhigen realistischen Prayer-Hero, zum Beispiel:

`hero-prayer-dome.webp`

Mögliche Richtung:

- reale Moscheekuppel / Minarett / Gebetsarchitektur
- ruhige Himmelsstimmung
- nicht dieselbe Komposition wie Home
- stärker funktional/spirituell, weniger Marketing-Hero

## 12.2 Gebetszeiten selbst

Fajr, Dhuhr, Asr, Maghrib, Isha sollen nicht jeweils eigene große Bilder bekommen.

Besser:

- klare Icons oder kleine symbolische Zustände
- nächste Gebetszeit visuell hervorgehoben
- restliche Zeiten ruhig und funktional

## 12.3 Komponenten

- Hero / Next Prayer
- Prayer Times = Utility Rows
- Lern-/Gebetsfeature = Feature Card
- Settings/Methode/Ort = Utility

---

# 13. Vorläufige Bildrollen für weitere Hauptscreens

Diese Zuordnung ist ein Plan, kein unveränderbares Gesetz. Vor Umsetzung wird jeder echte Screen geprüft.

| Screen | Hauptvisual | Stil |
|---|---|---|
| Home | Moschee | realistisch/cinematic |
| Prayer | Kuppel/Mihrab/Gebetsarchitektur | realistisch |
| Quran | hochwertiger Quran | realistisch |
| Qibla | Qibla-Kompass + ggf. Kaaba | realistisch |
| Dhikr | Tasbih | realistisch |
| Duas | dezente Dua-Hand-/Lichtsymbolik | realistisch, respektvoll |
| Kalender | islamischer Kalender/Crescent | realistisch oder premium Objekt |
| Lernen | Mihrab/Quran + punktuell 3D-Guide | gemischt |
| Moscheen | Moschee | realistisch |
| Sammlungen | Bookmark/Quran-Objekt | realistisch/minimal |
| Profil/Mehr | Nur-Brand | clean UI |
| Assistent | eigene 3D-Guide-Figur | 3D Character |
| Splash | Nur-Brand + hochwertige Atmosphäre | Brand/realistisch |
| Onboarding | reale Objekte + 3D-Figur wo sinnvoll | gemischt |
| Empty States | 3D-Guide oder neutrale Brand-Grafik | 3D/Brand |

---

# 14. Screen-Workflow — immer gleich vorgehen

## Schritt A — Ist-Zustand analysieren

Für den jeweiligen Screen lesen:

- TSX/JSX
- Datenabhängigkeiten
- Styles
- importierte Komponenten
- Asset-Pfade
- Runtime-Aliase
- Fallbacks

## Schritt B — Screen-Hierarchie definieren

Festlegen:

- Was ist der Hero?
- Was ist wichtigstes Feature?
- Welche Bereiche sind nur Utility?
- Welches Bild ist nötig?
- Wo reicht ein Icon?
- Braucht der Screen wirklich eine 3D-Figur?

## Schritt C — Asset-Briefing schreiben

Für jedes neue Asset exakt festlegen:

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
- Stil
- Negativregeln: was ausdrücklich vermieden wird

## Schritt D — Neue Assets erzeugen

Neue Bilder müssen den gemeinsamen Stil einhalten.

Vorhandene Bilder dürfen als Referenz dienen, aber Ziel ist ein konsistentes neues Set.

## Schritt E — Implementieren

- neue Pfade einbauen
- alte Aliase reduzieren
- nur betroffene Komponenten anfassen
- CSS konsolidieren statt neue Lock-Schicht
- Fallbacks passend machen

## Schritt F — visuell prüfen

Mindestens:

- ca. 320 px Breite
- 375 px
- 390 × 844 als zentrale Referenz
- 430 px

Prüfen:

- Crop
- Bildposition
- Textüberlagerung
- Kontrast
- Safe Area
- Scroll
- Taps
- Focus
- kein abgeschnittener Inhalt
- keine falschen Fallbacks
- Bild lädt wirklich

## Schritt G — Altbestand entfernen

Erst löschen, wenn:

- keine Code-Referenz mehr existiert
- kein Fallback es braucht
- Screen geprüft wurde
- neues Asset stabil ist

---

# 15. Icon-System

Icons werden als eigenes System behandelt.

## Regeln

- ein Outline-Stil
- bevorzugt Lucide, sofern vorhandenes Icon passend ist
- gleiche optische Größe
- gleiche Strichstärke
- gleiche vertikale Ausrichtung
- Active State klar, aber nicht grell
- kein Gold auf jedem Icon gleichzeitig

## Bottom Navigation

Bestehende Hauptlogik bleibt grundsätzlich erhalten.

Navigation soll kurz, lesbar und auf kleinen Geräten stabil bleiben.

Wenn lange Labels auf 320 px problematisch sind, kann ein kürzeres Label verwendet werden, ohne den eigentlichen Screen-Titel zu ändern.

---

# 16. Figuren-System

Es soll später nicht zehn unterschiedlich aussehende Pixar-artige Personen geben.

Ziel:

- möglichst ein Haupt-Guide bzw. eine kleine definierte Figurenfamilie
- gleiche Modellierungsqualität
- gleiche Augen-/Gesichtsästhetik
- gleiche Materialwelt
- gleiche Lichtqualität
- passende Kleidung
- zurückhaltende Emerald-/Cream-/Gold-Farbwelt

Der Nur-Assistent eignet sich als stärkster Ort für eine charakteristische Hauptfigur.

---

# 17. Light/Dark

Priorität:

1. Dark Theme zuerst visuell perfekt machen
2. Light Theme danach systematisch angleichen

Das Light Theme soll nicht einfach Weiß + Gold sein, sondern warmes Ivory/Creme und klare Kontraste verwenden.

Quran Reader darf weiterhin eine besondere warme Papierwelt besitzen, solange sie zur App gehört.

---

# 18. Responsive & Accessibility

Das visuelle Redesign darf vorhandene Stärken nicht verschlechtern.

Weiterhin beachten:

- Safe Areas
- Focus Visible
- Reduced Motion
- ausreichender Kontrast
- Touch Targets
- keine Art, die Buttons blockiert
- keine überstehenden Bilder
- keine abgeschnittenen Texte

Kernbreiten:

- 320
- 375
- 390
- 430

---

# 19. Religiöse Inhalte

Designänderungen dürfen religiöse Inhalte **nicht beiläufig umschreiben**.

Bei Quran, Hadith, Gebetsregeln, Duas, islamischen Aussagen und Quellen gilt:

- nicht aus Designgründen frei verändern
- fachliche Korrektheit separat prüfen
- bei Unsicherheit nicht als endgültig korrekt behaupten
- vorhandene Review-/Prüfprozesse respektieren

Design und religiöse Inhaltsprüfung sind zwei getrennte Ebenen.

---

# 20. Was ausdrücklich nicht gemacht werden soll

- nicht alle Bilder sofort löschen
- nicht die komplette App neu erfinden
- nicht jeden Screen in einer anderen Stilwelt bauen
- nicht überall Pixar-3D verwenden
- nicht reale Moschee/Kaaba/Quran als Cartoon darstellen
- keine echten Menschen als Fotomotive einsetzen
- keine 3D-Pixar-Icons für Navigation
- keine neue CSS-Override-Schicht für jedes Problem
- nicht blind `!important`-Duplikate löschen
- keine fünf Gold-/Glow-Effekte auf einer Karte
- keine Assetnamen wie `final-v4-new2.webp`
- keine Erfolgsaussage „pixel perfect“, wenn kein echter Render geprüft wurde

---

# 21. Definition of Done für einen Screen

Ein Screen ist erst fertig, wenn:

- klare Hero-/Feature-/Utility-Hierarchie vorhanden ist
- Hauptvisual zur gemeinsamen Bildwelt passt
- Icons konsistent sind
- keine unnötigen großen Bilder verwendet werden
- alle Assets kanonisch benannt sind oder eine geplante Migration haben
- keine sichtbaren kaputten Fallbacks vorhanden sind
- responsive Kernbreiten geprüft sind
- Dark Theme stimmig ist
- Interaktionen weiterhin funktionieren
- keine unnötige neue CSS-Schulden-Schicht entstanden ist

---

# 22. Definition of Done für das gesamte Visual Redesign

Das Redesign ist erst abgeschlossen, wenn:

1. alle Hauptscreens nach demselben System überarbeitet wurden
2. jedes Hauptbild eine klare Rolle besitzt
3. reale Gegenstände in einer konsistenten realistischen Premium-Welt erscheinen
4. Figuren in einer konsistenten hochwertigen 3D-Animationswelt erscheinen
5. UI-Icons einheitlich sind
6. alte doppelte/kaputte/ungenutzte Assets entfernt wurden
7. Alias-Ketten weitgehend verschwunden sind
8. CSS nicht mehr durch neue Lock-Layer weiter anwächst
9. Home als Referenzscreen wirklich hochwertig wirkt
10. Prayer, Quran, Qibla, Dhikr, Duas, Kalender, Lernen usw. sichtbar zur selben App gehören
11. Responsive geprüft ist
12. keine echten Personenfotos gegen die Designentscheidung verwendet werden
13. ein neuer Chat allein anhand dieser Datei versteht, wie weiterzuarbeiten ist

---

# 23. Aktueller Arbeitsstand / nächster Schritt

## Bereits festgelegt

- grundlegende Visual-Strategie
- drei visuelle Welten
- realistische reale Objekte
- 3D-Animationsfiguren statt echter Menschen
- Vektoricons für UI
- Emerald/Gold/Creme bleibt
- Home-Grundrichtung
- Asset-Zielstruktur
- sichere Löschstrategie
- Screen-Reihenfolge

## Jetzt weiterarbeiten

1. bestehenden Prayer-Screen im Repo vollständig lesen
2. seine aktuelle Bild-/Icon-/Komponentenstruktur dokumentieren
3. neues Prayer-Layout und Asset-Briefing festlegen
4. danach neue Assets/Komponenten umsetzen
5. anschließend Quran nach demselben Verfahren

Home bleibt der bereits definierte visuelle Referenzscreen. Wenn bei der tatsächlichen Umsetzung von Home neue Erkenntnisse entstehen, diese **in dieser Datei dokumentieren**, damit der nächste Chat den aktuellen Stand kennt.

---

# 24. Pflege dieses Gehirns

Nach jedem größeren abgeschlossenen Screen diese Datei aktualisieren:

- was wurde beschlossen?
- welche Assets wurden final erstellt?
- welche Dateinamen sind kanonisch?
- welche alten Assets wurden entfernt?
- welcher Screen ist abgeschlossen?
- welcher Screen ist als nächstes dran?
- welche visuellen Regeln wurden geändert oder präzisiert?

Diese Datei soll immer der **aktuelle Single Source of Truth für das Visual Redesign** bleiben.
