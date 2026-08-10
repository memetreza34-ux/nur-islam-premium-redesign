# 04 – UX/UI Premium-System

## Ziel

Nur Islam Premium soll sich wie **eine einzige hochwertige App** anfühlen, nicht wie viele einzeln gebaute Screens.

Die bestehende visuelle Richtung – dunkles Smaragdgrün, Gold, Creme, ruhige Karten, hochwertige islamische Objekte – bleibt Grundlage.

## 1. Designprinzipien

### Ruhig statt überladen

- klare Hierarchie;
- wenige starke Akzente;
- Gold nur für wichtige Premium-/Fokusmomente;
- kein unnötiges Glitzern oder hektische Animationen;
- spirituelle Inhalte erhalten Raum.

### Funktion vor Dekoration

Dekorative Moschee-, Quran-, Tasbih- oder Qibla-Objekte dürfen:

- Text nicht verdecken;
- Touchflächen nicht blockieren;
- Kontrast nicht verschlechtern;
- Layout auf kleinen Geräten nicht sprengen.

### Arabisch ist First-Class Content

- passende Schrift;
- ausreichend Zeilenhöhe;
- RTL korrekt;
- keine abgeschnittenen Diakritika;
- Textskalierung testen;
- Kopieren/Teilen darf Zeichen nicht verändern.

## 2. Design-Tokens

Für v1 zentralisieren:

```text
colors
spacing
radius
shadows
font families
font sizes
line heights
motion duration/easing
z-index layers
safe-area values
component heights
```

Ziel: späte `reference-*`-CSS-Fixes schrittweise in ein überschaubares System überführen, ohne vor Release einen riskanten Komplett-Rewrite zu erzwingen.

## 3. Kernkomponenten

Einheitlich definieren:

- App Header
- Back Button
- Bottom Navigation
- Cards
- Hero Card
- Filter Chips
- Search Field
- List Row
- Modal/Bottom Sheet
- Toast
- Empty State
- Error State
- Offline State
- Skeleton/Loading
- Primary Button
- Secondary Button
- Icon Button
- Progress
- Source/Reference Card
- Permission Card
- Premium Badge
- Experimental Badge

## 4. Hauptnavigation

Bestehende fünf Tabs sind sinnvoll:

1. Home
2. Gebete
3. Kalender
4. Lernen
5. Mehr

Quran, Dhikr, Qibla, Duas, Namen, Moscheen, Sammlungen und Assistent bleiben sekundäre Ziele.

Keine weitere Bottom-Nav-Vergrößerung für v1.

## 5. Screen-Abnahme

Für jeden Hauptscreen prüfen:

- Zweck in 3 Sekunden erkennbar;
- eine klare Hauptaktion;
- Loading;
- Empty;
- Error;
- Offline;
- lange deutsche Texte;
- arabischer Text;
- Tastatur/Fokus;
- Screenreader-Namen;
- 200 % Textskalierung soweit Plattform realistisch;
- Touchflächen mindestens ca. 44 × 44 px;
- Safe Areas;
- keine Überlagerung durch Bottom Nav;
- keine abgeschnittenen Modals.

## 6. Testgrößen

Mindestens real/rendered prüfen:

- 320 × 568
- 360 × 800
- 390 × 844
- 430 × 932
- Tablet/PWA größer
- Desktop-Browser, falls Web öffentlich angeboten wird

Zusätzlich:

- iOS Safari/PWA;
- Android Chrome/PWA;
- installierte PWA;
- Browser mit Zoom/Textskalierung.

## 7. Accessibility

Pflicht:

- semantische Buttons statt klickbarer `div`s;
- sichtbarer Fokus;
- sinnvolle `aria-label`s;
- Farbe nie als einzige Information;
- Kontrast prüfen;
- Reduced Motion respektieren;
- Screenreader-Reihenfolge;
- Dialogfokus;
- Escape/Back-Verhalten;
- Formfehler verständlich;
- Touch-Ziele;
- keine reine Gestenbedienung ohne Alternative.

## 8. Permission UX

Standort, Benachrichtigung, Kompass/Motion und Mikrofon nie sofort ohne Erklärung anfragen.

Muster:

```text
Warum brauchen wir das?
→ welche Daten/Funktion?
→ optional/erforderlich?
→ Button „Weiter“
→ echte Systempermission
→ verständlicher Denied-State
→ Einstellungen/Retry
```

## 9. Gebetszeiten-UX

Immer sichtbar/leicht erreichbar:

- Standort;
- Quelle;
- Berechnungsmethode;
- Asr-Schule;
- Live/Cache/Fallback;
- Hinweis auf mögliche lokale Abweichung;
- letzte Aktualisierung.

Fallback darf nicht wie eine live verifizierte Zeit aussehen.

## 10. Quran-UX

Reader muss klar zeigen:

- arabische Edition/Quelle;
- deutsche Übersetzung/Bedeutung;
- offline/online/cache;
- Ayah-Nummer;
- Lesezeichen;
- Schriftgröße;
- Quelle/Info.

Audio-Button nur zeigen, wenn echte Wiedergabe verfügbar ist.

## 11. Lern-/Fiqh-UX

Quelle und Variantenhinweis nicht in versteckten Einstellungen vergraben.

Bei sensiblen Themen:

- Quellenkarte;
- „Grunddarstellung“/„Varianten möglich“;
- keine aggressive Gamification;
- keine Schuld-/Angstmechanik zur Retention.

## 12. Premium UX

Paywall-Regeln:

- klarer Mehrwert;
- Preis/Laufzeit sichtbar;
- Kündigung verständlich;
- Restore verfügbar;
- keine künstliche Panik oder religiöser Druck;
- keine Aussage wie „Sei ein besserer Muslim – kaufe Premium“;
- Kern-Glaubensinhalte nicht mit manipulativem moralischem Druck verkaufen.

## 13. Visuelle Definition of Done

Kein Screen gilt als fertig, bevor ein echter Screenshot/Video-Nachweis existiert.

Check:

- Bilder geladen;
- kein Fallback ohne Grund;
- kein Overflow;
- keine abgeschnittenen arabischen Zeichen;
- konsistente Abstände;
- konsistente Typografie;
- gleiche Headerlogik;
- gleiche Modal-/Toastlogik;
- Dark/Premium-Kontrast;
- Motion ruhig;
- keine Layoutverschiebung beim Laden.
