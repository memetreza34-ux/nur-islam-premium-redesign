# Nur Islam – Funktionsmigration in die Premium-Struktur

Ziel: Das neue Premium-Design bleibt die einzige zukünftige App-Struktur. Sinnvolle Funktionen aus `memetreza34-ux/nur-islam` werden kontrolliert übernommen, ohne das Original-Repository zu verändern.

## Statuslegende

- **Vorhanden** – bereits als eigener Premium-Screen umgesetzt
- **Migriert** – aus der alten Funktionsstruktur wieder erreichbar und funktional
- **Teilweise** – Oberfläche und Kerninteraktion vorhanden, vollständige geprüfte Datenquelle fehlt noch
- **Offen** – noch nicht in die neue Struktur übernommen

## Hauptfunktionen

| Funktion | Status | Nächster Qualitätsschritt |
|---|---|---|
| Startseite | Vorhanden | Gemeinsamer dynamischer Demo-Zeitplan mit Gebetsseite eingebunden; echte Quelle bleibt offen |
| Gebetszeiten | Teilweise | Echte standort- und methodenabhängige Quelle anbinden |
| Islamischer Kalender | Vorhanden | Regionale Hijri-Abweichungen und Ereignisquelle ergänzen |
| Quran | Teilweise | 114-Suren-Katalog, Suche, Filter, Favoriten und dynamischer Offline-Reader vorhanden; aktuell Al-Fatiha, Al-Ikhlas, Al-Falaq und An-Nas vollständig lokal, restliche arabische und deutsche Dateien werden weiter aus dem Altbestand übertragen |
| Dhikr | Teilweise | Vollständige Kategorien, Quellen und Ziele übernehmen |
| Qibla | Vorhanden | Gerätesensor für reale Kompassrotation ergänzen |
| Duas | Migriert | 34 Einträge in 13 Kategorien, Suche, Favoriten, Lesefortschritt, Detailansicht, Kopieren und Teilen; fachliche Einzelprüfung ausstehend |
| 99 Namen Allahs | Migriert | 99 Einträge, Suche, Favoriten, Lernstatus, Fortschritt und Detailansicht; fachliche Endprüfung von Reihenfolge, Schreibweisen und Bedeutungen ausstehend |
| Moscheesuche | Teilweise | Live-Karten- und Standortdaten anbinden |
| Sammlungen | Vorhanden | Quran-Lesezeichen über alle lokal verfügbaren Suren zusammenführen, weitere Inhaltstypen und Export ergänzen |
| Nur-Assistent | Teilweise | Sicheren Backend- und Quellenprozess entwickeln |

## Quran-Migration

| Bestandteil | Status | Umsetzung |
|---|---|---|
| Surenverzeichnis | Migriert | Lokale Metadaten für alle 114 Suren, fortlaufende Nummern, Ayah-Anzahl und Offenbarungsort |
| Surensuche | Migriert | Suche nach Nummer, Transliteration und arabischem Namen |
| Filter | Migriert | Alle, offline verfügbar, Favoriten, mekkanisch und medinensisch |
| Reader | Migriert | Dynamische Sure, arabischer Text, sinngemäße deutsche Bedeutung, Schriftgröße, Bedeutungsanzeige, Kopieren, Teilen und lokale Lesezeichen |
| Lesefortschritt | Migriert | Letzte Sure und aktive Ayah werden lokal gespeichert und auf Home/Quran weitergeführt |
| Offline-PWA | Migriert | Katalog und aktuell verfügbare Suren werden durch Service Worker v5 vorab gespeichert |
| Vollständiger Textbestand | Teilweise | 4 von 114 Suren paarweise in Arabisch und Deutsch übertragen; restliche Dateien offen |
| Audio | Offen | Erst mit geprüfter Rezitationsquelle aktivieren; aktuelle Oberfläche täuscht keine Wiedergabe vor |
| Deutsche Bedeutungen | Teilweise | Altbestand übernommen und ausdrücklich als sinngemäße Bedeutung markiert; fachliche Endprüfung ausstehend |

## Wiederhergestellte Lernfunktionen

| Funktion | Status | Umsetzung im Premium-Repo |
|---|---|---|
| Hadith-Sammlung | Migriert | Suche, 8 gekennzeichnete Inhaltsangaben, Quellen und lokale Favoriten |
| Wissensbibliothek | Migriert | Premium-Übersicht mit lokalem Fortschritt |
| Propheten | Migriert | Strukturierte Themenübersicht mit lokalem Fortschritt |
| Islam-Quiz | Migriert | 5 Fragen, direkte Auswertung und lokaler Bestwert |
| Hajj & Umrah | Migriert | Geordnete Stationen und lokaler Lernfortschritt |
| Sunnah im Alltag | Migriert | Alltagspunkte mit lokalem Fortschritt |
| Fehler & Reue | Migriert | Ruhige Schrittstruktur mit Sicherheitshinweis |
| Wudu & Salah | Vorhanden | Schrittanleitungen und gespeicherter Fortschritt |

## Wiederhergestellte Dienste

| Funktion | Status | Umsetzung im Premium-Repo |
|---|---|---|
| Fasten-Assistent | Migriert | Nächster Montag/Donnerstag, berechnete weiße Tage, lokale Erinnerung |
| Ummah-Weltkarte | Migriert | Premium-Übersicht; echte Karten- und Community-Daten noch offen |
| Islamische Orte | Migriert | Makkah, Madinah und Al-Aqsa als strukturierte Einführung |
| Jumuah | Migriert | Freitagscheckliste mit lokalem Fortschritt |
| Zakat | Migriert | Grundlagenstruktur und deutlicher Beratungshinweis |
| Gebetsanzeige/Standby | Migriert | Funktionsstruktur; echter Vollbild- und Wake-Lock-Modus noch offen |

## Verbindliche Regeln

1. Das Original-Repository bleibt unverändert.
2. Das neue Premium-Repository ist die Zielanwendung.
3. Keine religiöse Übersetzung, Rechtsauskunft oder Quellenangabe wird ungeprüft als endgültig veröffentlicht.
4. Demo-, lokale oder berechnete Daten werden sichtbar als solche gekennzeichnet.
5. Eine alte Funktion gilt erst als vollständig migriert, wenn Navigation, Daten, Speicherung, Fehlerzustände und mobile Darstellung geprüft wurden.
