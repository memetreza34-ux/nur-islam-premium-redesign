# ChatGPT-Gehirn: Nur Islam Premium Redesign

> **Zweck:** Dieses Dokument ist der dauerhafte Projektkontext für einen neuen ChatGPT-Chat. Vor jeder weiteren Änderung vollständig lesen und anschließend den aktuellen GitHub-Stand erneut prüfen.

## Startauftrag für einen neuen Chat

Kopiere diesen Text in einen neuen Chat:

```text
Nutze den GitHub-Connector. Öffne das private Repository `memetreza34-ux/nur-islam-premium-redesign`, wechsle auf den Branch `premium-home-redesign` und lies zuerst vollständig `docs/CHATGPT-BRAIN-HANDOFF.md`. Prüfe danach den aktuellen Branch-HEAD und Pull Request #1 erneut. Arbeite anschließend selbstständig weiter, bis die App visuell, technisch und funktional wirklich fertig ist. Verändere niemals das Original-Repository `memetreza34-ux/nur-islam`, merge nichts und lasse den Pull Request als Draft, bis Build, visuelle Kontrolle und die in diesem Dokument genannten Abnahmekriterien tatsächlich erfüllt sind. Beginne mit der echten lokalen beziehungsweise laufenden Vorschau, prüfe zuerst alle Bilder und behebe sichtbare Fehler statt nur weitere Funktionen zu stapeln.
```

---

## 1. Oberstes Ziel

Die App **Nur Islam** soll zu einer vollständig zusammenhängenden, hochwertigen mobilen Premium-App ausgebaut werden. Das Ergebnis soll nicht nur viele Funktionen enthalten, sondern in einer echten laufenden Vorschau überzeugend aussehen und stabil funktionieren.

Designrichtung:

- dunkles Smaragdgrün
- Gold- und Creme-Akzente
- hochwertige islamische 3D-/WebP-Objekte
- moderne mobile Karten
- ruhige Animationen
- klare Typografie
- konsistente Abstände, Radien, Schatten und Navigation
- keine kaputten Bilder, leeren Demo-Schaltflächen oder widersprüchlichen Screens

Der Nutzer möchte am Ende ein **perfektes sichtbares Ergebnis**, nicht nur Commit-Listen oder theoretische Beschreibungen.

---

## 2. Verbindliche Repository-Regeln

### Niemals verändern

- Original-Repository: `memetreza34-ux/nur-islam`
- Dieses Original dient ausschließlich als lesbare Quelle für alte Funktionen und Daten.

### Ausschließlich hier arbeiten

- Ziel-Repository: `memetreza34-ux/nur-islam-premium-redesign`
- Arbeitsbranch: `premium-home-redesign`
- Pull Request: `#1`
- PR-URL: `https://github.com/memetreza34-ux/nur-islam-premium-redesign/pull/1`

### Aktueller dokumentierter Stand beim Erstellen dieses Gehirns

- Branch-HEAD vor diesem Dokument: `8ef1a629bc100426dc527dfbd38d6c8a8d3b67a9`
- PR #1: offen
- PR #1: Draft
- PR #1: mergebar
- PR #1: nicht gemergt
- Original-Repository wurde nicht verändert

**Wichtig:** Nach dem Lesen dieses Dokuments immer erneut den tatsächlichen Branch-HEAD abrufen, weil dieses Dokument selbst und spätere Arbeiten neue Commits erzeugen.

### Nicht ausführen

- PR nicht mergen
- PR nicht als „ready for review“ markieren
- Original-Repo nicht bearbeiten
- keine religiösen Inhalte ungeprüft als endgültig korrekt darstellen
- keinen erfolgreichen Build behaupten, solange er nicht wirklich ausgeführt wurde

---

## 3. Arbeitsweise

Der Nutzer erwartet direkte Umsetzung und schreibt häufig nur „weiter“. In diesem Fall:

1. Nicht erneut lange planen.
2. Aktuellen GitHub-Stand prüfen.
3. Den wichtigsten offenen Block auswählen.
4. Dateien lesen, bevor sie geändert werden.
5. Änderungen direkt auf `premium-home-redesign` committen.
6. Nach zusammenhängenden Arbeitspaketen den PR kommentieren.
7. Ehrlich zwischen Codeänderung, statischer Prüfung, echtem Build und visueller Prüfung unterscheiden.

Keine erfundenen Erfolgsbehauptungen. Ein fehlgeschlagener GitHub-Actions-Lauf ist aktuell **kein bestätigter Testfehler**, weil der Runner vor den eigentlichen Steps stoppt.

---

## 4. Bekannter CI-Blocker

GitHub Actions startet für dieses Repository derzeit nicht korrekt. Die bisherigen Läufe enden als `failure`, liefern aber:

- `steps: null`
- `logs_url: null`
- keine ausgeführten Build-, TypeScript- oder Datenprüfungen

Ursache ist sehr wahrscheinlich der bekannte Billing-/Spending-/Runner-Blocker des Kontos.

Deshalb gilt:

- Nicht schreiben: „Build fehlgeschlagen“, sofern keine Build-Steps liefen.
- Nicht schreiben: „Build bestanden“, solange kein echter Build ausgeführt wurde.
- Lokale Prüfung oder eine andere echte Preview-/Build-Umgebung wird benötigt.

Normale lokale Prüfung:

```bash
git checkout premium-home-redesign
git pull --ff-only
npm install
npm run check
npm run dev
```

Erwarteter Dev-Port laut `package.json`: `3000`.

---

## 5. Bereits umgesetzte Hauptbereiche

### App-Grundstruktur

- React 19
- TypeScript
- Vite
- Motion/Framer-Motion-ähnliche Animationen über `motion/react`
- Lucide Icons
- PWA-Grundstruktur
- Onboarding
- Splash Screen
- Bottom Navigation
- Detailseiten ohne störende Bottom Navigation
- lokale Speicherung wichtiger Zustände

### Premium-Startseite

- Moschee-Hero
- Begrüßung abhängig von Tageszeit
- islamisches Datum
- nächstes Gebet mit Countdown
- Gebetsübersicht
- Quran-, Dhikr- und Qibla-Karten
- Schnellaktionen
- Ayah und Hadith des Tages
- Empfehlungen
- Sammlungen und Assistent verlinkt

### Gebet und Kalender

- gemeinsame Prayer-Schedule-Hilfe in `src/prayerSchedule.ts`
- dynamische Demo-Gebetszeiten
- nächstes Gebet und Restzeit
- Gebetsseite
- islamischer Kalender
- lokale Favoriten und Erinnerungen

**Noch nicht produktiv:** echte standort- und methodenabhängige Gebetszeitquelle.

### Quran

- Metadaten für alle 114 Suren
- Suche
- Filter
- Lieblingssuren
- dynamischer Quran-Reader
- arabischer Text
- sinngemäße deutsche Bedeutung
- Schriftgröße
- Bedeutung ein-/ausblenden
- Ayat kopieren, teilen und speichern
- letzte Sure und aktive Ayah speichern
- Quran-Lesezeichen in Sammlungen
- statische Datenprüfung in `scripts/check-quran-data.mjs`

Aktuell vollständig offline in Arabisch und Deutsch vorhanden:

- Sure 1: Al-Fatiha
- Sure 112: Al-Ikhlas
- Sure 113: Al-Falaq
- Sure 114: An-Nas

**Noch offen:** restliche 110 Suren aus dem Originalbestand übertragen und fachlich prüfen.

### Dhikr

- mehrere Routinen
- Einzelzähler je Dhikr
- Tagesfortschritt
- Routinefortschritt
- automatischer Tageswechsel
- lokaler Zustand
- Quellenhinweise
- statische Prüfung

Verwendete Grundquellen:

- Sahih Muslim 597a
- Sahih Muslim 2726a
- Sahih al-Bukhari 6318

Religiöse Formulierungen und Varianten vor Veröffentlichung noch einmal fachlich prüfen.

### Duas

- `src/duaData.ts`
- 34 Duas
- 13 Kategorien
- Suche
- Kategorienfilter
- Favoriten
- angesehen-/gelesen-Fortschritt
- Detailansicht
- Arabisch kopieren
- Teilen
- Legacy-Favoritenmigration
- Integration in Sammlungen
- `scripts/check-duas-data.mjs`

### 99 Namen Allahs

- `src/namesOfAllahData.ts`
- alle 99 Einträge
- Suche
- Favoriten
- Lernstatus
- Fortschritt
- Detailmodal
- `scripts/check-names-data.mjs`

**Bekannter potenzieller Fehler:** Favoriten werden möglicherweise über lateinische Namen gespeichert. Doppelte Transliteration wie `Al-Majid` kann kollidieren. Besser auf stabile numerische IDs umstellen und alte Werte migrieren.

### Lern- und Legacy-Funktionen

In `src/LegacyFeatureScreens.tsx` und weiteren Screens sind unter anderem erreichbar:

- Hadith-Sammlung
- Wissensbibliothek
- Propheten
- Islam-Quiz
- Hajj & Umrah
- Sunnah im Alltag
- Fehler und Reue
- Fasten-Assistent
- Ummah-Weltkarte
- islamische Orte
- Jumuah
- Zakat
- Gebetsanzeige/Standby
- Wudu und Salah

### Weitere Screens

- Qibla
- Moschee-Finder
- Sammlungen
- Profil/Mehr
- Nur-Assistent als klar gekennzeichneter Prototyp

---

## 6. Zuletzt behobener Hauptfehler: Bilder

Der Nutzer meldete, dass die Premium-Bilder weiterhin nicht sichtbar waren.

Gefundene Ursache:

`src/styles/reference-asset-recovery.css` enthielt zuvor sinngemäß:

```css
.premium-image > img {
  display: none !important;
}
```

Dadurch wurden selbst gültige WebP-Dateien immer versteckt.

Bereits geändert:

- echte `<img>`-Elemente werden wieder angezeigt
- SVG-Fallback erscheint nur bei tatsächlichem Ladefehler
- widersprüchliche CSS-Bildlayer wurden bereinigt
- Hauptbilder verwenden gültige `-v2.webp`-Dateien
- dekorative Sprite-Ersatzgrafiken wurden durch echte WebP-Objekte ersetzt
- Bild-URLs erhalten einen Cache-Buster `?v=20260806-3`
- Service Worker wurde auf Cache-Version 7 erhöht
- Service Worker registriert sich mit Versionsparameter und `updateViaCache: 'none'`
- lokaler Entwicklungsmodus überspringt das Onboarding automatisch
- doppelte Installationsanzeige wurde entfernt

Wichtige Dateien:

- `src/PremiumVisuals.tsx`
- `src/ReferenceArtworkHost.tsx`
- `src/styles/reference-asset-recovery.css`
- `src/styles/reference-valid-assets-v2.css`
- `src/styles/reference-valid-assets-secondary.css`
- `src/styles/reference-sprite.css`
- `src/pwa.ts`
- `public/sw.js`
- `src/main.tsx`

**Trotzdem noch zwingend:** echte laufende Vorschau laden und visuell prüfen. Nicht allein vom Code ableiten, dass jedes Bild korrekt positioniert ist.

Bei altem PWA-Cache:

1. DevTools öffnen.
2. Application → Service Workers.
3. Alten Service Worker `Unregister`.
4. Application → Storage → `Clear site data`.
5. Seite hart neu laden.

---

## 7. Höchste nächste Priorität

### Phase A – Sichtbaren Stand wirklich prüfen

1. Branch lokal oder in echter Preview-Umgebung ausführen.
2. `npm install` und `npm run check` ausführen.
3. TypeScript- und Buildfehler vollständig beheben.
4. App bei ungefähr 390 × 844 Pixel testen.
5. Startseite, Quran, Reader, Dhikr, Qibla, Kalender, Duas, Namen, Lernen und Profil visuell prüfen.
6. Echte Screenshots erstellen.
7. Alle kaputten Bilder, abgeschnittenen Texte, Überlagerungen und ungleichmäßigen Abstände beheben.

### Phase B – Bekannte Codefehler prüfen

1. Quiz-Bestwert in `src/LegacyFeatureScreens.tsx` prüfen.
   - Verdacht: Antwort wird bereits zu `score` addiert und am Ende nochmals als `finalScore` gezählt.
   - Mögliches Resultat: 6/5.
   - Nicht blind ändern; aktuelle Implementierung zuerst lesen.

2. Namen-Favoriten auf stabile IDs migrieren.

3. Prüfen, ob `CollectionsScreen` alte numerische Dua-Favoriten auch ohne vorheriges Öffnen des Dua-Screens migriert.

4. Alle Buttons untersuchen, die aktuell nur Toasts anzeigen, obwohl eine echte Funktion erwartet wird.

5. Alle Bildpfade repositoryweit auf nicht vorhandene Dateien prüfen.

### Phase C – Vollständigkeit

1. Restliche 110 Quran-Suren übertragen.
2. Vollständigen alten Hadith-Datenbestand migrieren.
3. Wissens-, Lern- und Propheten-Daten vervollständigen.
4. echte standortabhängige Gebetszeiten entwickeln.
5. echte Qibla-Sensorsteuerung ergänzen.
6. Moschee-Suche mit Live-Karten-/Standortquelle entwickeln.
7. sicheren Nur-Assistenten mit Quellenprozess und klaren Grenzen entwickeln.
8. finale religiöse und redaktionelle Prüfung durchführen.

---

## 8. Visuelle Abnahmekriterien

Die App darf erst als visuell fertig bezeichnet werden, wenn:

- sämtliche vorgesehenen WebP-Bilder sichtbar sind
- keine kaputten Bildsymbole erscheinen
- keine SVG-Ersatzgrafik ohne echten Bildfehler sichtbar ist
- Startseite auf Mobilbreite hochwertig und ruhig wirkt
- Bottom Navigation nichts überdeckt
- Karten nicht überlaufen
- arabischer Text nicht abgeschnitten wird
- Modals vollständig erreichbar sind
- lange deutsche Texte lesbar umbrechen
- Safe-Area-Abstände auf mobilen Geräten stimmen
- kein doppelter Installationsdialog erscheint
- kein Onboarding bei lokaler Designprüfung stört
- Dark-Mode-Kontrast ausreichend ist
- alle Hauptscreens dieselbe Designlogik besitzen

---

## 9. Technische Abnahmekriterien

Die App darf erst als technisch fertig bezeichnet werden, wenn:

- `npm run assets:check` erfolgreich läuft
- `npm run names:check` erfolgreich läuft
- `npm run duas:check` erfolgreich läuft
- `npm run quran:check` erfolgreich läuft
- `npm run dhikr:check` erfolgreich läuft
- `npm run lint` erfolgreich läuft
- `npm run build` erfolgreich läuft
- keine unbehandelten Browserfehler in der Konsole erscheinen
- lokale Speicherung auch bei beschädigten Werten nicht abstürzt
- PWA-Update und Cache-Wechsel funktionieren
- die App ohne Netzwerk mit bereits gecachten Kerninhalten startet
- Navigation zu jedem sichtbaren Hauptbereich funktioniert

---

## 10. Produkt-Abnahmekriterien

Vor Veröffentlichung zusätzlich nötig:

- echte Gebetszeitenquelle
- echte Standortbehandlung
- Datenschutzkonzept
- Impressum/Anbieterangaben abhängig von Veröffentlichung
- finale Übersetzungs- und Quellenprüfung
- klare Kennzeichnung sinngemäßer Bedeutungen
- sichere Grenzen des religiösen KI-Assistenten
- keine erfundenen Moscheedaten
- keine Demo-Daten, die wie Live-Daten aussehen
- App-Store-/Play-Store-Prüfung
- Barrierefreiheit und Reduced Motion

---

## 11. Kommunikationsstil mit dem Nutzer

- Deutsch schreiben.
- Direkt arbeiten.
- Keine langen allgemeinen Vorträge.
- Bei „weiter“ sofort das nächste Arbeitspaket durchführen.
- Nicht ständig um Erlaubnis fragen.
- Fortschritt kurz und konkret berichten.
- Klar sagen, was wirklich geprüft wurde und was noch nicht.
- Keine Behauptung „fertig“, solange Build und visuelle Vorschau fehlen.
- Der Nutzer möchte ein perfektes sichtbares Ergebnis und wird ungeduldig, wenn nur technische Statuslisten geliefert werden.

---

## 12. Abschlussregel

Der Pull Request bleibt Draft und ungemergt, bis mindestens diese drei Beweise vorhanden sind:

1. echter erfolgreicher Build,
2. echte visuelle Prüfung mit Screenshots,
3. keine bekannten kritischen Funktions- oder Bildfehler.

Erst danach den Nutzer ausdrücklich fragen, ob der PR finalisiert oder gemergt werden soll.
