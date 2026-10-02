# Startprüfung – Stand 24. September 2026

Nur Start wurde als erster Schritt für ein einheitliches App-Design geprüft.
Gebet, Quran, Lernen und Mehr sind damit nicht gestalterisch freigegeben.

## Urteil

Die Grundrichtung trägt: dunkles Tannengrün, warmes Gold, cremefarbene Lesekarte,
ein ruhiges Mihrab-Motiv und klare Einstiege für Gebet, Quran und Lernen.
Ein kompletter Neuaufbau oder neue Schriftfamilien würden die Seite eher
unruhiger machen. Hauptprobleme sind einzelne semantisch falsche Bilder,
winzige Nebeninformationen und die Länge des unteren Widget-Bereichs.

## Geprüft und korrigiert

- Die Start-Einstiege für Beten lernen, 99 Namen, Islam Quiz und Duas öffnen ihre
  passenden Ziele. Der Quiz-Titel und die Navigation bei Zurück, Vorwärts und
  Neuladen wurden korrigiert.
- Der Dhikr-Stand auf Start und im Widget verwendet dieselben validierten Tagesdaten
  wie der Zähler. Alte, unbekannte oder überhöhte Werte erscheinen nicht als
  heutiger Fortschritt.
- Start und Widget zeigen dasselbe Hijri-Datum für die eingestellte Zeitzone.
  Der Widget-Text „Ayah im Fokus“ behauptet keinen täglichen Wechsel der
  aktuell fest hinterlegten Ayah.
- „Meine Sammlung“ zählt auch die gespeicherte Fokus-Ayah, Hadithe und
  Kalendertage. Ungültige und doppelte Kalendertage werden nicht mitgezählt.
- Widget-Texte bleiben in der zweispaltigen mobilen Übersicht lesbar statt
  abgeschnitten. Die Widget-Vorschau und der Premium-Dialog erhalten Fokus,
  schließen per Escape und geben den Fokus an den Auslöser zurück.
- Die Startansicht wurde im App-Browser in Telefonbreite und breiter angesehen;
  Qibla-Vorschau, Premium-Anpassung und ihre Rückwege wurden dort geöffnet.

## Struktur und mobile Gestaltung

1. Gebets-Hero mit Uhrzeit und Tagesleiste ist der starke Einstieg: behalten.
2. Quran-Fortsetzung und sechs Schnellzugriffe funktionieren als zweite Ebene.
   Namen und Erläuterungen sollten vor Dekoration lesbar sein.
3. Die cremefarbene Ayah-Karte setzt einen guten Kontrast; Hadith darunter
   bleibt im dunklen Farbsystem. Unterschiedliche Karten dürfen bei Abständen
   und Typografie trotzdem verwandt sein.
4. „Weitere Bereiche“ ist neutral und ehrlich beschriftet. Keine künstliche
   Personalisierung behaupten.
5. Zwölf Widgets machen Start sehr lang und wiederholen Ziele aus den
   Schnellzugriffen. Empfehlung: zunächst zwei bis drei aktivierte Widgets
   zeigen und einen klaren Weg zu „Alle Widgets“ anbieten. Das ist eine
   Produktentscheidung, noch keine eigenmächtige Entfernung der Widgets.

Bei 390 px wirkt die Seite insgesamt ausgewogen. Bei 320 px wechselt die
Widget-Liste korrekt in eine Spalte; in der Sichtprüfung war nichts
abgeschnitten. Viele Metadaten und Versal-Etiketten liegen aber bei etwa
9–11 px und wirken auf kleinen Handys zu fein. Sekundärtexte und Kontrast
gezielt verbessern, nicht alles pauschal vergrößern.

## Bilder: behalten, gezielt neu erstellen

| Priorität | Bild | Empfehlung |
| --- | --- | --- |
| Behalten | Fajr-, Dhuhr-, Asr-, Maghrib- und Isha-Landschaften | Zusammenhängende Gebetsserie; Crops und Lesbarkeit der Uhrzeit erhalten. |
| Behalten | Geschlossener Quran, Tasbih, Ayah-Hintergrund, Logo | Inhaltlich passend und in der Startansicht verwendbar. |
| Neu | `mini-names-v1.webp` | Sieht wie eine Preismedaille aus. Für „99 Namen Allahs“ lieber eine ruhige Kalligrafie- oder Buchstudie ohne lesbare erfundene Schrift, in derselben Grün-Gold-Lichtführung. |
| Neu | `lantern-v2.webp` | Die Transparenz hat breite braune Artefakte. Laterne sauber freistellen oder als bewusstes Kartenmotiv mit vollständigem Hintergrund neu gestalten. |
| Optional später | `qibla-compass-v2.webp` | Nur ersetzen, falls Richtung und Kaaba bei kleiner Darstellung unklar bleiben; keine dekorative Nadel ohne eindeutige Funktion. |

Neue Assets brauchen saubere Kanten, ausreichende Auflösung, dieselbe
Lichtrichtung und Farbwelt sowie dokumentierte Rechte. Keine Quranverse oder
religiösen Aussagen in generierte Bildtexturen schreiben.

## Schriften, Farben und Text

- Beibehalten: Inter für Bedienung und Zahlen, Cormorant Garamond für kurze
  redaktionelle Titel und Amiri für Arabisch. Zusätzliche Display-Schriften
  würden das bestehende System schwächen.
- Tannengrün als Fläche, Gold als Akzent, Creme als gezielter Ruhepunkt.
  Gold nicht für jede kleine Information oder jeden Rahmen verwenden.
- Auf Start kurze, konkrete Aussagen: „Nächstes Gebet“, „Offline weiterlesen“,
  „Ayah im Fokus“. Quellen und Berechnung sichtbar lassen. Keine behauptete
  tägliche Aktualisierung statischer Inhalte.

## Technische Prüfung

- 433 Unit-Tests, TypeScript, Produktions-Build, Home-Referenz- und
  Visual-Check bestanden. Browser-Sichtprüfung bei 390 und 320 px.
- Ein gezielter Quiz-E2E-Test wurde ergänzt, startete aber nicht: Der
  Playwright-Vorschau-Server darf in dieser Umgebung Port 4173 nicht öffnen
  (`EPERM`). Das ist kein bestandener Browser-Test. Quiz, Zurück, Vorwärts
  und Neuladen wurden stattdessen direkt im laufenden App-Browser geprüft.
- Globaler Größencheck bleibt offen: JavaScript 346 KB gzip bei 328 KB Budget.
  Die 102 CSS-Ebenen sind außerdem ein Wartungsrisiko; das ist nicht durch
  die Startprüfung behoben.

Browser- und Unit-Tests ersetzen keine Prüfung auf echten Mobilgeräten,
vollständige Widget-Klicktests sowie keine fachliche, rechtliche und
Bildrechte-Freigabe.

Nächster sinnvoller Gestaltungsschritt: zwei Bildersatzstücke als Set
erstellen und in 320/390 px gegeneinander prüfen. Erst danach über eine
kompaktere Widget-Startansicht entscheiden.
