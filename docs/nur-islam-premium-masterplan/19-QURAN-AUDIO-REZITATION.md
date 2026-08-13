# 19 – Quran-Audio und Rezitationssystem

**Ziel:** Audio nur dann veröffentlichen, wenn Quelle, Rezitator, Rechte, technische Synchronisation, Offlinebetrieb und Kosten sauber geklärt sind.

## 1. Grundsatz

Quran-Audio ist kein dekoratives Medienfeature. Es braucht:

- identifizierten Rezitator;
- belastbare Audioquelle;
- Nutzungs-/Lizenzstatus;
- korrekte Surah-/Ayah-Zuordnung;
- technische Integritätsprüfung;
- Offline-/Streamingstrategie;
- nachvollziehbare Attribution.

Kein Audio aus zufälligen Downloads oder unklaren Reuploads übernehmen.

## 2. v1-Entscheidung

Drei mögliche Pfade:

### A – kein Audio in v1

Zulässig, wenn Rechte/Technik nicht fertig sind. UI zeigt dann keine Fake-Controls.

### B – Streaming only

Vorteile:

- kleiner App-Footprint;
- zentrale Aktualisierung.

Nachteile:

- Netzabhängigkeit;
- CDN/Egress;
- Latenz.

### C – Streaming + Offline Download

Premium-geeignet, aber technisch und wirtschaftlich anspruchsvoller.

## 3. Audioquellen-Register

Für jede Quelle:

```text
source_id
provider
reciter
recording/edition
license/permission
attribution
format
bitrate
ayah-granularity
hash/version
reviewed_at
owner
```

## 4. Ayah-Zuordnung

Bevorzugt stabile Struktur:

```text
reciter_id
surah_number
ayah_number
audio_url
duration_ms
checksum
```

Keine Zuordnung nur anhand Dateinamen ohne Validierung.

## 5. Synchronisation

Mögliche Stufen:

### Stufe 1

Sure komplett abspielen.

### Stufe 2

Ayah-by-Ayah.

### Stufe 3

aktuelle Ayah im Reader hervorheben.

### Stufe 4

Word-/Tajwid-Synchronisation nur mit belastbaren Timingdaten.

v1 nicht unnötig mit Stufe 4 blockieren.

## 6. Player-Funktionen

Basis:

- Play/Pause;
- Previous/Next Ayah;
- Surah wechseln;
- Seek;
- Geschwindigkeit nur wenn sinnvoll;
- Repeat Ayah;
- Repeat Range später;
- Lock-Screen/Media Controls native;
- Background Audio native;
- Bluetooth/Headphones.

## 7. Memorization

Später möglich:

- Ayah wiederholen x-mal;
- Pause zwischen Wiederholungen;
- Range A–B;
- Text optional ausblenden;
- Fortschritt lokal/cloud.

Keine Gamification über korrekte Rezitation behaupten, wenn keine echte Aussprachebewertung existiert.

## 8. Streamingarchitektur

```text
App
→ Audio Manifest
→ CDN
→ Audio Object
```

Manifest versioniert.

CDN/Storage muss:

- Range Requests unterstützen;
- passende Cache Header;
- CORS;
- stabile URLs oder signierte Strategie;
- Kostenmonitoring.

## 9. Offline Download

Pro Paket speichern:

- Reciter;
- Surah/Ayah-Abdeckung;
- Version;
- Größe;
- Downloadstatus;
- Prüfsumme;
- letzter Zugriff.

Nutzer kann Downloads löschen.

Speicherbedarf vor Download sichtbar machen.

## 10. Downloadmanager

Zustände:

- queued;
- downloading;
- paused;
- failed;
- retry;
- complete;
- outdated;
- deleting.

Schwaches Netz und App-Neustart testen.

## 11. Integrität

Nach Download:

- Größe;
- Checksum soweit möglich;
- Manifestversion;
- Surah/Ayah-Zuordnung.

Fehlerhafte Datei nicht als komplett markieren.

## 12. Rechte

Vor Release schriftlich klären:

- darf gestreamt werden?
- darf offline gespeichert werden?
- darf Premiumzugang verlangt werden?
- Attribution?
- geografische Einschränkungen?
- Bearbeitung/Kompression erlaubt?
- Kündigung/Entfernung?

## 13. Datenschutz

Wenn serverseitig Audio-Events geloggt werden:

- nur notwendige Telemetrie;
- keine unnötige detaillierte religiöse Profilbildung;
- Retention begrenzen;
- klare Analyticsentscheidung.

## 14. Kostenmodell

Berechnen:

```text
full_quran_size_per_reciter
x reciters
x offline downloads
+ streaming egress
+ storage
+ CDN requests
```

Szenarien für 1k/10k/100k MAU.

## 15. Premiumstrategie

Faire mögliche Grenze:

### Free

- ausgewählte/grundlegende Streamingrezitation;

### Premium

- weitere Rezitatoren;
- komplette Offlinepakete;
- erweiterte Repeat-/Memorization-Funktionen.

Nur wenn Rechte dies erlauben.

## 16. Native Anforderungen

Für iOS/Android testen:

- Background Audio;
- Media Session;
- Lock Screen;
- Headphone Controls;
- Interruptions/Phone Calls;
- Bluetooth;
- offline after reboot;
- Storage Limits;
- App Update.

## 17. Accessibility

- klare Player Labels;
- Screenreader;
- große Controls;
- keine nur farbliche Zustandsanzeige;
- Geschwindigkeit verständlich;
- Reduced Motion unabhängig von Audio.

## 18. Fehlerfälle

- CDN down;
- einzelne Datei 404;
- falsches Manifest;
- corrupt cache;
- zu wenig Speicher;
- Download unterbrochen;
- Lizenzquelle entfernt;
- Reciter-Version ersetzt.

## 19. Content-Rollback

Wenn eine Audiodatei falsch zugeordnet oder problematisch ist:

- Manifest deaktiviert Datei;
- Cacheversion invalidiert gezielt;
- Offlinepaket als outdated markieren;
- Nutzer kann reparieren/neu laden.

## 20. Release-Gate

Audio geht erst live, wenn:

- Quelle/Reciter/Rechte dokumentiert;
- Mapping validiert;
- Player auf Zielgeräten getestet;
- Streamingausfall behandelt;
- Offlineintegrität bei Downloads getestet;
- Kostenmodell vorhanden;
- Attribution sichtbar;
- kein unklar lizenziertes Audio enthalten ist.
