# 17 – Internationalisierung, Lokalisierung und RTL

**Stand:** 8. August 2026  
**Ziel:** Nur Islam Premium wird zuerst deutschsprachig sauber fertiggestellt und kann danach kontrolliert auf weitere Sprachen/Märkte erweitert werden, ohne religiösen Inhalt, Layout oder Quellenstatus zu beschädigen.

## 1. Grundsatz

Internationalisierung ist mehr als Text übersetzen.

Sie betrifft:

- Sprache;
- Schrift;
- RTL/LTR;
- religiöse Terminologie;
- Quran-/Hadith-Editionen;
- Zahlen/Datum/Uhrzeit;
- Hijri-Darstellung;
- Prayer-Methoden;
- lokale Moschee-/Store-/Rechtskontexte;
- Support;
- Marketing;
- Preis/Steuern;
- Contentreview.

## 2. Reihenfolge

### v1

**Deutsch zuerst vollständig.**

Warum:

- klarer Zielmarkt;
- bestehende UI/Copy ist deutsch;
- Fachreview kann konzentriert werden;
- Support bleibt beherrschbar;
- Store-/Rechts-/Marketingpfad wird nicht gleichzeitig vervielfacht.

### Danach mögliche Kandidaten

Nur nach Nachfrage/Evidenz:

- Englisch;
- Arabisch;
- Türkisch;
- Persisch/Dari;
- weitere Sprachen.

Keine Sprache nur wegen großer theoretischer Nutzerzahl hinzufügen.

## 3. i18n-Architektur

Keine sichtbaren UI-Texte dauerhaft quer im JSX hardcoden.

Ziel:

```text
locales/
  de/
    common.json
    prayer.json
    quran.json
    learning.json
  en/
  ar/
```

Oder gleichwertiges typsicheres System.

Schlüssel stabil:

```text
home.nextPrayer
quran.translationLabel
prayer.locationPermission.title
content.source.summaryLabel
```

Keine Schlüssel wie `text1`, `button2`.

## 4. Textarten trennen

### UI Copy

- Buttons;
- Labels;
- Navigation;
- Fehlermeldungen.

### redaktioneller Content

- Lektionen;
- Erklärtexte;
- Hinweise.

### religiöser Primär-/Quellencontent

- Quran;
- Hadith;
- Dua;
- Dhikr;
- Fachbegriffe.

Diese drei Ebenen haben unterschiedliche Review- und Releaseprozesse.

## 5. Arabisch und RTL

Arabische Sprache erfordert echte RTL-Unterstützung, nicht nur `dir="rtl"` auf einzelnen Quran-Zeilen.

Testen:

- gesamte Navigation;
- Header/Backbutton;
- Karten;
- Icons mit Richtung;
- Chevron-Pfeile;
- Tabellen/Listen;
- Modals;
- Inputfelder;
- Zahlen;
- Mischtext Arabisch + Latein;
- Quran bleibt semantisch korrekt;
- Qibla-Kompass nicht spiegeln, wenn physikalische Richtung gemeint ist.

## 6. Bidirektionaler Text

Problemfälle:

```text
Sahih Muslim 597a
Al-Baqara 2:255
Berlin, Deutschland
13:45
```

In arabischer UI dürfen Referenzen/Zahlen nicht unlesbar umgeordnet werden.

Explizite bidi-isolation/semantische Spans prüfen.

## 7. Fonts

Pro Sprache/Schrift definieren:

- arabischer Primärfont;
- Quranfont falls gesondert;
- Lateinfont;
- Fallbacks;
- Fontgewicht;
- Diakritika;
- Zeilenhöhe.

Testdaten:

- lange arabische Ayah;
- viele Harakat;
- sehr lange deutsche Komposita;
- türkische Sonderzeichen;
- persisch/arabische Zeichenunterschiede.

## 8. Religiöse Terminologie

Glossar pro Sprache:

```text
term_id
arabic
transliteration
de
alternative_de
en
notes
review_status
```

Beispiele:

- Salah/Gebet;
- Wudu/Gebetswaschung;
- Dhikr;
- Dua;
- Fajr;
- Dhuhr;
- Asr;
- Maghrib;
- Isha;
- Rakʿah;
- Madhhab.

Nicht innerhalb einer Sprache zufällig zwischen Schreibweisen wechseln.

## 9. Quran je Sprache

Arabischer Qurantext ist nicht einfach ein Locale-String.

Pro Übersetzung/Bedeutung:

- Sprache;
- Übersetzer;
- Edition;
- Quelle;
- Lizenz;
- Version;
- Reviewstatus.

UI kann mehrere Übersetzungen anbieten, aber jede bleibt eigener Datensatz.

## 10. Hadith je Sprache

Keine automatische Maschinenübersetzung als freigegebene Hadithübersetzung veröffentlichen.

Wenn Maschinenübersetzung intern hilft:

```text
machine draft
→ redaktionell/fachlich reviewen
→ eigene Kennzeichnung
→ erst dann R4
```

## 11. Fiqh-/Madhhab-Kontext

Lokalisierung darf nicht dazu führen, dass regionale Gewohnheiten als universelle Regel übersetzt werden.

Beispiel:

- Prayer-Methode;
- Asr-Schule;
- lokale Moscheekorrektur;
- Hijri-Kalender;
- Ramadan-/Eid-Feststellung.

Regionale Hinweise separat modellieren.

## 12. Datum/Uhrzeit

Locale-aware:

- 24h vs. 12h;
- Wochentage;
- Monatsnamen;
- Gregorianisch;
- Hijri;
- Zeitzone;
- Sommerzeit.

Keine Serverzeit ungeprüft als Nutzerlokalzeit anzeigen.

## 13. Hijri-Kalender

Browser-/Algorithmusdatum kann regional von offizieller Feststellung abweichen.

UI benötigt:

- Berechnungs-/Kalenderquelle;
- Abweichungshinweis;
- gegebenenfalls lokale Einstellung/Korrektur;
- keine universelle Eid-/Ramadan-Gewissheit aus nur einem Algorithmus.

## 14. Prayer-Lokalisierung

Pro Region prüfen:

- verfügbare Berechnungsmethoden;
- lokale Behörden/Moscheen;
- hohe Breitengrade;
- Zeitzonen;
- DST;
- Asr-Präferenz;
- lokale Korrekturen.

Keine einzelne Berlin-Konfiguration global ausrollen.

## 15. Store-Lokalisierung

Pro Sprache:

- Name/Subtitle;
- Description;
- Keywords;
- Screenshots;
- Previewtext;
- Release Notes;
- Support;
- Privacy Links.

Storetexte sind Marketingcontent und brauchen eigenen Review, aber dürfen keine Funktionen erfinden.

## 16. Recht/Datenschutz je Markt

Neue Sprache ≠ automatisch neuer Markt, aber internationale Veröffentlichung kann neue Pflichten auslösen.

Vor neuem Land prüfen:

- Betreiberangaben;
- Datenschutz;
- Verbraucherrecht;
- Steuern;
- Payment;
- Minderjährige;
- App-Store-Regeln;
- KI-/Contentregeln;
- Datenübertragung.

## 17. Support je Sprache

Keine Sprache veröffentlichen, wenn kritischer Support gar nicht verstanden werden kann.

Mindestens:

- technische Standardantworten;
- Account/Payment;
- Datenschutz;
- Contentfehler;
- Eskalation an Fachreview.

## 18. Übersetzungsworkflow

```text
Source Copy DE
→ String Freeze für Release
→ Übersetzungsentwurf
→ sprachlicher Review
→ UI-Context Review
→ religiöser Review falls Fachcontent
→ Screenshot/RTL Test
→ Release
```

Ändert sich Source Copy nach Übersetzung:

- Translation Memory/Status markieren;
- veraltete Übersetzungen sichtbar im Workflow;
- keine stille Fallback-Mischung in kritischem Content.

## 19. Pseudolokalisierung

Vor echter zweiter Sprache:

- Texte künstlich 30–50 % verlängern;
- Sonderzeichen;
- RTL-Testmodus;
- Buttons/Karten/Modals prüfen.

Damit Layoutfehler früh finden.

## 20. Lokalisierungs-QA

Pro Release:

- fehlende Keys;
- Fallbacktexte;
- abgeschnittene Texte;
- falsche Richtung;
- falsche Datumsformate;
- falsche Pluralformen;
- religiöse Begriffe;
- Quellenlabels;
- Store Screenshots;
- Screenreader-Sprache;
- VoiceOver/TalkBack.

## 21. Sprachmetriken

Pro Locale getrennt:

- Aktivierung;
- Retention;
- Support;
- Contentfehler;
- Crashrate;
- Premium Conversion;
- Store Conversion.

Keine Sprache allein wegen niedriger Conversion entfernen, bevor Qualitäts-/Übersetzungsfehler geprüft wurden.

## 22. Gate

Neue Sprache darf Public gehen, wenn:

- UI vollständig übersetzt ist;
- keine kritischen Fallbacks;
- religiöser Content passende Quellen/Review besitzt;
- RTL vollständig getestet ist, falls relevant;
- Prayer/Datum/Region korrekt behandelt werden;
- Store-/Privacy-/Supportmaterial vorhanden ist;
- reale Geräte getestet wurden;
- Verantwortlicher für laufende Updates benannt ist.
