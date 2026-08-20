# Nur Islam Premium — Prayer / Gebete Visual Spec

> **Status:** DESIGN SPEC — noch kein freigegebenes finales Referenzbild  
> **Branch:** `visual-system-redesign`  
> **Gehört zu:** `docs/VISUAL-SYSTEM-BRAIN.md`  
> **Zweck:** Eindeutige Umsetzungsgrundlage für ChatGPT, Claude und Codex. Diese Datei beschreibt den gewünschten Prayer-Screen, bevor das finale Referenzbild erstellt und der Code umgebaut wird.

---

# 1. Ziel des Screens

Der Gebete-Screen soll sich nicht wie eine Sammlung dekorierter Karten anfühlen, sondern wie ein **ruhiger täglicher Gebetsbegleiter**.

Primäre Fragen des Nutzers auf diesem Screen:

1. Welches Gebet ist als Nächstes?
2. Um wie viel Uhr ist es?
3. Wie lange ist es noch?
4. Welche Gebetszeiten gelten heute?
5. Welche Pflichtgebete habe ich bereits erledigt?
6. Sind Standort/Berechnung aktuell und korrekt eingestellt?

Die visuelle Hierarchie muss genau diese Reihenfolge unterstützen.

---

# 2. Bestehende Funktionen, die erhalten bleiben

Aus dem aktuellen `PrayerScreen.tsx`:

- Hijri-Datum im Header
- Zurück-Navigation
- Aktualisieren
- Live-/Cache-/Fallback-Status
- Standortanzeige
- optionaler Standortzugriff
- nächstes Gebet
- Uhrzeit
- Countdown
- Progress bis zum nächsten Gebet
- als gebetet markieren
- Hinweiston testen
- Tagesfortschritt 0–5
- Liste aller Gebetszeiten
- Erinnerungen für Pflichtgebete
- Erledigt-Status pro Pflichtgebet
- Berechnungsmethode
- Asr-Schule
- Settings-Modal
- Abschluss-/Celebration-Modal bei 5/5
- Reduced Motion / Accessibility-Verhalten

**Designänderung darf diese Funktionen nicht entfernen.**

---

# 3. Aktuelles visuelles Problem

Der Screen besitzt bereits gute Funktionen, aber das visuelle Gewicht ist nicht sauber verteilt.

Aktuell konkurrieren im Next-Prayer-Bereich gleichzeitig:

- großer Prayer-Name
- sehr große Uhrzeit
- Countdown
- Gold-Progress
- CTA
- Audio-Button
- Glow
- dekorativer Kreis
- über CSS eingeblendetes `dome-v2.webp`

Das Dome-Bild ist kein echtes JSX-Hauptasset, sondern wird über CSS als dekoratives `::before` eingebaut. Dadurch ist das Bild schwach, schwer steuerbar und nicht als klare Bildrolle dokumentiert.

Ziel des Redesigns:

> **Ein echtes Prayer-Hero-System statt eines dekorativen CSS-Hintergrundtricks.**

---

# 4. Verbindliche Grundentscheidung

Der Prayer-Screen bekommt **genau ein dominantes realistisches Hauptmotiv**.

Nicht:

- ein großes Bild für Fajr
- ein großes Bild für Dhuhr
- ein großes Bild für Asr
- ein großes Bild für Maghrib
- ein großes Bild für Isha

Stattdessen:

- 1 Prayer-Hero
- 1 konsistente Icon-Sprache für die Tageszeiten
- ruhige Utility Rows für alle Zeiten

Keine Pixar-/3D-Figur auf dem Prayer-Hauptscreen.

---

# 5. Kanonisches Prayer-Hero-Asset

Geplanter Dateiname:

`public/assets/heroes/hero-prayer-dome.webp`

## Rolle

Ein einziges realistisches Hauptmotiv für den Prayer-Screen.

## Motiv

Bevorzugt:

- hochwertige islamische Gebetsarchitektur
- elegante Moscheekuppel plus ein Teil eines Minaretts oder einer Mihrab-/Arkadenstruktur
- kein vollflächiges touristisches Moscheefoto
- kein zweiter Home-Moschee-Hero

Der Prayer-Hero soll sich von Home unterscheiden:

### Home
- weiter Blick
- klassische Moschee als Willkommensmotiv
- Fajr/Morgenstart
- emotionaler Einstieg

### Prayer
- näherer, ruhigerer architektonischer Ausschnitt
- kontemplativer
- stärker funktional eingebettet
- Fokus auf Gebetsmoment statt Marken-Intro

## Stil

- Sacred Premium Realistic
- realistisch/cinematic
- hochwertige Materialien
- Deep Emerald Umgebung
- warmes Ivory-Licht
- Gold nur in Lichtreflexen/Details
- subtile atmosphärische Tiefe
- kein HDR-/KI-Überglanz
- keine übertriebene Unschärfe
- keine Cartoon-Optik

## Licht

Nicht an ein einzelnes Gebet koppeln.

Bevorzugt:

- ruhiges neutrales Dämmerungs-/Innenlicht
- warmes Licht aus der Architektur
- genügend dunkle Bereiche für UI-Kontrast

Dadurch passt das Motiv zu jeder Tageszeit und widerspricht nicht dynamischem Fajr/Dhuhr/Asr/Maghrib/Isha-Inhalt.

## Personen

- keine echten Menschen
- idealerweise gar keine Person im Hero

## UI-Komposition

Das Bild muss von Anfang an für eine mobile Karte komponiert sein.

Hauptmotiv bevorzugt rechts/unten oder rechts/mittig.

Freie Zone links/oben für:

- Badge `Nächstes Pflichtgebet`
- arabischen Namen
- deutschen Gebetsnamen
- ggf. kurzen Kontext

Uhrzeit/Countdown müssen auf einer ruhigen Fläche lesbar bleiben.

Keine wichtigen architektonischen Details direkt hinter Text platzieren.

---

# 6. Zielaufbau des Screens

Reihenfolge von oben nach unten:

## 6.1 Header — Utility

Inhalt:

- Zurück
- `Gebetszeiten`
- Hijri-Datum klein
- Aktualisieren

Keine große Bildfläche im Header.

## 6.2 Status + Standort — kompakter Utility-Bereich

Der aktuelle Live-/Cache-/Fallback-Status und Standort bleiben vorhanden, sollen aber optisch **deutlich leichter** sein als der Hero.

Empfehlung:

- Live-Status als kleine Statuszeile/Chip
- Standort in einer kompakten Row
- Privacy-Hinweis klein darunter

Diese Fläche darf nicht wie eine zweite Hero-Card wirken.

## 6.3 Haupt-Hero — Nächstes Gebet

Dies ist der wichtigste visuelle Bereich.

Inhalt:

- Badge: `Nächstes Pflichtgebet` oder `Morgen früh`
- Gebetsname Arabisch
- Gebetsname Deutsch
- Uhrzeit
- Countdown
- kleiner Fortschritt bis zum Gebet
- primäre Aktion `Als gebetet markieren`, wenn sinnvoll
- sekundäre Reminder/Audio-Funktion als Icon-Control
- Prayer-Hero-Asset im Hintergrund/Seitenbereich

### Prioritätsreihenfolge im Hero

1. Gebetsname
2. Uhrzeit
3. Countdown
4. Bild
5. CTA
6. Zusatzinfo

Bild darf die Funktion nie überstrahlen.

## 6.4 Tagesfortschritt — Feature Card

`0/5` bis `5/5` bleibt als eigener Bereich.

Richtung:

- klarer Progress-Ring
- ruhiger Text
- keine zusätzliche große Illustration
- Completion State darf etwas goldener werden, aber nicht komplett Stil wechseln

## 6.5 Alle Gebetszeiten — Utility Rows

Jede Zeile zeigt:

- kleines semantisches Prayer-/Tageszeit-Icon
- arabischer Name klein
- deutscher Name
- ggf. kurze Beschreibung
- Uhrzeit
- Reminder-Icon
- Completion-Control für Pflichtgebete

Die nächste Gebetszeit wird subtil hervorgehoben.

Keine großen Mini-Bilder pro Gebetszeit.

## 6.6 Berechnung / Methode — Utility Card

Am Ende:

- Quelle/Berechnungsmethode
- Asr-Schule
- `Anpassen`

Diese Information bleibt funktional und visuell zurückhaltend.

---

# 7. Prayer-Icon-System

Bestehende Lucide-basierte Tageszeit-Idee bleibt grundsätzlich richtig.

Zuordnung soll semantisch und einheitlich bleiben:

- Fajr → `Sunrise` / Morgenlicht-Semantik
- Sunrise → `Sunrise`
- Dhuhr → klare Tages-/Sonnen-Semantik, z. B. `SunMedium`
- Asr → Nachmittag, z. B. `SunDim`
- Maghrib → `Sunset`
- Isha → `MoonStar`

Wichtig:

- gleiche optische Größe
- gleiche Stroke-Stärke
- Icon-Holder nicht unnötig unterschiedlich gestalten
- Active/Next State darf Gold erhalten
- normale Zustände eher Cream/Muted Green

Keine 3D-Icons.

---

# 8. Farben und Materialien

Prayer folgt der gleichen Brand wie Home.

## Basis

- Deep Emerald Hintergrund
- Emerald Panels
- Cream/Warm Ivory Text
- Muted Green Secondary Text
- Gold gezielt

## Gold verwenden für

- Next-Prayer-Badge oder kleiner Akzent
- Progress
- nächste aktive Prayer Row
- ausgewählte CTA

## Gold vermeiden als gleichzeitig

- voller Rand aller Karten
- jedes Icon
- jeder Titel
- jeder Button
- jede Uhrzeit
- Glow auf jedem Panel

---

# 9. Typografie

## Header

- Inter/Cormorant entsprechend bestehendem System

## Hero Prayer Name

- Cormorant Garamond für deutschen Hauptnamen
- arabischer Name als unterstützende Ebene

## Uhrzeit

- groß, aber nicht mit Gebetsnamen konkurrierend
- maximal zwei starke Typografieanker im Hero: Prayer Name + Uhrzeit

## Utility Rows

- Inter für funktionale Lesbarkeit
- Uhrzeit darf Cormorant als ruhigen Akzent nutzen

---

# 10. Radien und Geometrie

Bestehende Design-System-Richtung beibehalten:

- Hero Radius etwa 42px
- Card etwa 28px
- Controls etwa 18px

Aber:

Nicht jeden einzelnen Prayer Row künstlich wie eine massive Karte wirken lassen.

Rows können flacher und ruhiger werden, solange Touch Targets und Abgrenzung klar bleiben.

---

# 11. Responsive Verhalten

Verbindliche Prüfbreiten:

- 320 px
- 375 px
- 390 × 844
- 430 px

## Bei 390/430

Hero darf Gebetsname und Uhrzeit nebeneinander bzw. in klarer Zwei-Zonen-Komposition tragen, wenn es sauber passt.

## Bei 320/350

Keine gequetschte Zwei-Spalten-Komposition erzwingen.

Bevorzugt:

- Textblock oben/links
- Uhrzeit darunter oder klar versetzt
- Hero-Bild weiter nach rechts/unten
- CTA volle Breite oder klare Mobile-Zeile

Gebetslisten müssen ohne abgeschnittene Namen funktionieren.

---

# 12. Motion

Bestehende dezente Screen-/Row-Transitions dürfen bleiben.

Kein:

- schweben der Moschee
- permanentes Pulsieren großer Flächen
- starke Parallax-Bewegung
- große Bildanimation nur für Dekoration

Reduced Motion weiterhin respektieren.

Completion-Animation darf etwas emotionaler sein, bleibt aber kurz und hochwertig.

---

# 13. Fallback-Regel

Wenn `hero-prayer-dome.webp` nicht lädt:

Nicht auf eine stilistisch völlig andere flache Moscheeillustration wechseln.

Fallback bevorzugt:

- gleiche Emerald-Hero-Fläche
- dezentes geometrisches Ornament
- `MoonStar`/Mihrab-artige semantische Vektorform
- keine falsche Bildillusion

---

# 14. Aktuelle Assets / Migration

Aktuell relevante Prayer-Art:

`public/premium-assets/high-res-objects/dome-v2.webp`

Aktuelle QA-Matrix ordnet Prayer / Next Prayer diesem Asset zu.

Aktuelle CSS-Art-Direction setzt `dome-v2.webp` über `::before` auf `.reference-next-prayer`.

Migration später:

1. neues `hero-prayer-dome.webp` erstellen
2. als echtes visuelles Asset in der Prayer-Komponente verwenden
3. CSS-Pseudo-Image entfernen
4. `dome-v2.webp` nicht sofort global löschen, da andere Features es eventuell noch referenzieren
5. QA-Matrix erst nach tatsächlicher Implementierung auf den kanonischen neuen Pfad ändern
6. Altasset erst löschen, wenn alle übrigen Referenzen geprüft sind

---

# 15. Was Claude/Codex aus dem späteren Referenzbild übernehmen soll

Wenn `prayer-approved.webp` später erstellt wird, ist es eine **Umsetzungsvorgabe**, keine lose Inspiration.

Claude/Codex soll daraus übernehmen:

- vertikale Reihenfolge
- Hero-Höhe
- Bildposition
- Textzonen
- visuelle Gewichtung von Gebetsname/Uhrzeit/Countdown
- Card-Hierarchie
- Abstände
- Radius-System
- Icon-Behandlung
- Gold-Dosierung
- Utility-Row-Dichte

Claude/Codex soll **nicht**:

- neue zusätzliche Bilder erfinden
- eine zweite Prayer-Art-Direction hinzufügen
- einzelne Gebetszeiten mit eigenen KI-Bildern ausstatten
- reale Personen ergänzen
- neue Farbwelt erfinden
- neue Iconfamilie verwenden
- weitere dekorative Karten nur zum Füllen hinzufügen

---

# 16. Negativliste für das finale Prayer-Referenzbild

Nicht zeigen:

- echte Menschen
- 3D-Pixar-Figur
- Kaaba als zufällige Prayer-Deko
- Quran als zusätzliches großes Objekt
- Tasbih als zusätzliches großes Objekt
- mehrere Moscheebilder
- fünf individuelle Gebetsbilder
- übertriebene goldene Rahmen
- Neon-Glow
- zu viel arabisches Ornament
- volle Fotografie als Hintergrund hinter jedem Text
- unrealistische Fantasie-Moschee
- unlesbare Mini-Typografie
- Desktop-Layout statt echter Mobile-App

---

# 17. Geplante Referenzen

## Schriftliche Referenz

Diese Datei:

`docs/PRAYER-VISUAL-SPEC.md`

## Späteres freigegebenes Screen-Referenzbild

Geplanter Pfad:

`public/assets/references/screens/prayer-approved.webp`

## Späteres Hero-Asset

Geplanter Pfad:

`public/assets/heroes/hero-prayer-dome.webp`

Solange diese Bilder nicht tatsächlich freigegeben/eingebaut sind, dürfen sie nicht als bereits im Repo vorhanden beschrieben werden.

---

# 18. Definition of Done für Prayer

Prayer ist visuell erst abgeschlossen, wenn:

- ein autoritatives `prayer-approved` Referenzbild festgelegt ist
- genau ein dominantes realistisches Prayer-Hero-Motiv verwendet wird
- Gebetszeiten als klare Utility Rows funktionieren
- keine großen Bilder je Prayer Row vorhanden sind
- Icons einheitlich sind
- alle bestehenden Funktionen erhalten sind
- altes CSS-Pseudo-Hero-Bild entfernt oder bewusst migriert ist
- 320/375/390/430 geprüft sind
- Dark Theme hochwertig wirkt
- Fallback visuell harmonisch ist
- neue Umsetzung dem freigegebenen Referenzbild entspricht

---

# 19. Nächster Schritt

Als Nächstes:

1. aus dieser Spezifikation **ein einziges gezieltes Prayer-Screen-Referenzbild** erstellen
2. dieses auf Konsistenz mit dem Nur-Islam-Visual-System prüfen
3. erst nach Freigabe als `prayer-approved` behandeln
4. dann Code-/Asset-Umsetzung starten
