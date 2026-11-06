# Unter Windows weiterarbeiten

Stand: 06.11.2026. Produktname **Awwaba**, Repositoryname weiterhin `nur-islam-premium-redesign`.

## Projekt holen und starten

Git für Windows und Node.js 22 installieren. Dann in PowerShell:

```powershell
git clone --config core.autocrlf=false --config core.longpaths=true --branch design/claude-design-system https://github.com/memetreza34-ux/nur-islam-premium-redesign.git
cd nur-islam-premium-redesign
npm.cmd ci
npm.cmd run dev -- --host=127.0.0.1 --port=3004 --strictPort
```

App: http://127.0.0.1:3004/

Für ein bereits vorhandenes Checkout zuerst eigene Änderungen sichern, dann auf `design/claude-design-system` wechseln und mit `git pull --ff-only` aktualisieren. Nicht auf `main` weiterarbeiten.

Die Endung `.cmd` vermeidet die PowerShell-Sperre für `npm.ps1`. Eine Änderung der Windows-Ausführungsrichtlinie ist dafür nicht nötig.

## Prüfungen

```powershell
npm.cmd run check
npx.cmd playwright install chromium
npm.cmd run e2e
```

Playwright nutzt unter Windows den installierten Chromium. Den auf dem Mac verwendeten `NUR_E2E_CHROME_PATH` nicht übernehmen. Die Browserprüfungen starten ihren eigenen Build und Server; `check` und `e2e` deshalb nacheinander ausführen.

## Übernommener Arbeitsstand

- Umbenennung zu Awwaba; technische Altkennungen bleiben für gespeicherte Daten bestehen.
- Islam-Quiz inklusive Fragen und Auswertung entfernt. Alte Quiz-Navigation führt zur Startseite.
- Gemeinsame Bildbanner, Leseflächen und Navigation für Lern- und Unteransichten.
- Zurück-Taste oben links; Lesepositionen und Quellen bleiben erhalten.
- Korrekturen bei Notizen mit blockierter Speicherung und bei nicht verfügbaren Gebetszeiten.
- Kontrastkorrekturen für Suche, Standort, Premium-Einstieg, Hadith-Lesekarten und mehrere Detailansichten.
- Benötigte Bilder, Herkunftsnachweise, Tests und vorhandene Prüfbilder liegen im Repository.

## Bestehende Gestaltungsentscheidungen beibehalten

- Smaragdgrün, Elfenbein und Altgold mit der bisherigen Bildwelt. Neue Bilder dürfen entstehen, sollen aber dazu passen.
- Themenkarten grundsätzlich mit Bild links und Text rechts. Wudu-Schritte haben stattdessen einen vollbreiten Titel, das Bild mittig darunter und danach den Erklärungstext.
- Kopfbereiche scrollen aus der Ansicht. Nur die Zurück-Taste bleibt oben links sichtbar.
- Keine Lernpläne, Abschlussfenster, Lern-Prozentanzeigen oder abschließenden Wissensfragen. Lesepositionen bleiben gespeichert. Der tägliche Gebetstracker ist davon getrennt und bleibt erhalten.
- Ein zentraler Einstieg „Gebetsablauf“, mit Fajr bis Isha im Kurs. Beim Wechsel des Gebets bleibt die Ansicht oben bei der Auswahl.
- Gesprochener Wortlaut im Gebetskurs: vier Klappbereiche für Arabisch, Aussprache als Fließtext, Aussprache mit Silbenstrichen und sinngemäße Bedeutung. Jeweils nur einer geöffnet; Hinweise und Quellen darunter.
- Alle sechs Gebetszeit-Zeilen behalten ihre Landschaftsbilder. Sonnenaufgang bleibt eine eigene Zeile und steht nicht zusätzlich bei Fajr.
- Fachliche Texte und Quellen nicht beiläufig beim Gestalten ändern. Die App verwendet die deutsche Schreibweise „Basmala“.

## In Codex fortsetzen

Den geklonten Projektordner in Codex öffnen. Ein passender Startauftrag:

> Lies AGENTS.md, CURRENT-STATUS.md und docs/WINDOWS-WEITERARBEITEN.md. Setze die offene appweite Endkontrolle fort: Schriften, Bilder, Kontraste, Abstände, Navigation und Funktionen auf Handy- und Tabletbreiten prüfen. Bestehende Gestaltungsentscheidungen beibehalten. Die offenen Punkte im Windows-Leitfaden sind noch kein abgeschlossener Check.

## Noch offene Endkontrolle

Prüfstand vom 06.11.2026 auf dem Mac: `npm run check` vollständig bestanden, einschließlich 1.115 Tests, TypeScript, Produktionsbuild und 56 eingebundener Prüfregeln. Der vollständige Browserlauf ist ebenfalls bestanden: 372 erfolgreiche Tests, zwei optionale Bildaufnahme-Helfer ohne gesetzten Zielpfad übersprungen, keine fehlgeschlagenen Tests. Die Bildbanner wurden für alle 29 Verzeichniseinträge bei 320 und 768 Pixeln in beiden Farbmodi geprüft. Die zuvor unterbrochenen Prüfungen wurden damit durch einen vollständigen Lauf ersetzt.

Diese automatischen Prüfungen schließen die noch offene visuelle Endkontrolle nicht ab. Sie ersetzen auch keine Prüfung auf echten Geräten.

Als Nächstes auf Windows:

1. Nach dem Rechnerwechsel `npm.cmd run check` und `npm.cmd run e2e` auch auf Windows ausführen.
2. Hellen Modus bei 320 und 768 Pixeln visuell prüfen: Duas-Bedeutungstexte, Dhikr-Hinweise, Nummern der Namensliste und arabische Beschriftungen der Rechtsschulen waren teilweise zu blass. Die letzten Qibla-, Gebetskurs- und Propheten-Korrekturen ebenfalls visuell fertig prüfen; die Bildbanner selbst bestehen bereits den automatischen Durchlauf.
3. Notiz-Speichern und -Löschen bei blockiertem Browser-Speicher samt erneutem Versuch kontrollieren.
4. Erst danach den appweiten Gestaltungscheck abschließen. Die offenen Betreiber-/Hosting-/Rechte- und echten Geräteprüfungen aus `AGENTS.md` bleiben separat bestehen.

## Was GitHub nicht überträgt

Browserdaten wie Notizen, Favoriten, Lesezeichen und lokale Premium-Daten liegen auf dem jeweiligen Gerät. Sie werden durch `git clone` nicht übertragen. Auch lokale `.env`-Dateien, Abhängigkeiten und Build-Verzeichnisse gehören nicht in GitHub. Für optionale eigene Cloud-Konfiguration ist `.env.example` die Vorlage; Zugangsdaten getrennt übertragen.

Die bisherige Adresse `127.0.0.1` zeigt immer auf den gerade benutzten Rechner. Der Mac muss nach dem Wechsel nicht weiterlaufen.
