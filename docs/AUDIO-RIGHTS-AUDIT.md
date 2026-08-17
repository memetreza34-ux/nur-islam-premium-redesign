# Nur Islam – Audio-/Quellenrechte Audit

**Stand:** 17. August 2026  
**Zweck:** Arbeitsnachweis für die spätere qualifizierte Rechtsprüfung. Dies ist keine Rechtsberatung und keine pauschale Rechtefreigabe.

## 1. Islamic Network / Al Quran Cloud – Quran-Rezitation

Verwendeter Pfad in Nur Islam: Quran-Rezitation, unter anderem Mishary Alafasy, über `cdn.islamic.network`.

Offizielle Quellen:

- Terms & Conditions: `https://alquran.cloud/terms-and-conditions`
- CDN-Dokumentation: `https://alquran.cloud/cdn`

Die am 17. August 2026 geprüften Terms nennen als letzten Aktualisierungsstand den 14. Juni 2026. Sie erklären unter anderem:

- Audio-Dateien behalten die jeweiligen Copyrights ihrer Rechteinhaber.
- Rezitationen seien dem Dienst von Rezitatoren bzw. deren Nachlässen für freie, nichtkommerzielle Weiterverteilung lizenziert worden.
- Streaming, Einbettung und Download für persönliche/edukative Nutzung werden genannt.
- Die Terms sagen zugleich ausdrücklich, dass Rezitationen in ein kommerzielles Produkt eingebunden werden dürfen.
- Das Copyright verbleibt trotzdem bei den Rezitatoren; diese können nach den Terms die Entfernung verlangen.
- Die CDN-Dokumentation beschreibt `cdn.islamic.network` ausdrücklich als Integrations-CDN für Apps und dokumentiert `ar.alafasy` als Audio-Edition.

### Bewertung für Nur Islam

Das ist eine deutlich bessere dokumentierte Nutzungsgrundlage als eine bloß technisch erreichbare MP3-URL. Trotzdem wird daraus **keine unbeschränkte eigene Rechtefreigabe** abgeleitet, weil die Terms selbst fortbestehende Rechte der Rezitatoren und ein mögliches Entfernungsverlangen nennen.

Für den geplanten 0,99-€-Premium-Pfad sollte Quran-Audio nicht künstlich hinter die Premium-Paywall verschoben werden. Der religiöse Kern einschließlich Quran bleibt unabhängig davon frei; die Premium-Funktionen sind Komfort-/Personalisierungsfunktionen.

Vor öffentlichem kommerziellem Release sollte eine qualifizierte Rechtsprüfung bestätigen, ob die konkrete Einbindung unter den dann aktuellen Terms ausreichend ist. Bei Unsicherheit kann die Audiofunktion ohne Verlust der übrigen App deaktiviert werden.

## 2. Hisn al-Muslim – Gebetsformel-/Dhikr-Audio

Verwendeter Host: `www.hisnmuslim.com` / Hisn-al-Muslim-Angebot.

Am 17. August 2026 wurden die öffentlich erreichbare Website und der öffentlich verlinkte API-Einstieg geprüft:

- `https://hisnmuslim.com/`
- `https://hisnmuslim.com/api/husn.json`

Die Website stellt Inhalte und eine Entwickler-API bereit. In den bei dieser Prüfung auffindbaren öffentlichen Seiten wurde jedoch **keine eindeutige Lizenz für die Weiterverwendung bzw. Einbettung der Audioaufnahmen in einer fremden App** gefunden.

### Bewertung für Nur Islam

Dieser Punkt bleibt offen. Die technische Abrufbarkeit und die Existenz einer API werden nicht als Audio-Rechtefreigabe behandelt.

Vor öffentlichem Release ist daher eine der folgenden Lösungen nötig:

1. belastbare Audio-Nutzungserlaubnis/Lizenz dokumentieren; oder
2. die betroffenen Hisn-al-Muslim-Audioaufrufe für den Release deaktivieren/entfernen.

Die Text-/Hadith-/Dua-Inhalte sind separat vom konkreten Audio-Recht zu betrachten.

## 3. Release-Entscheidung

Aktueller sicherer Release-Pfad:

- Islamic-Network-/Al-Quran-Cloud-Quelle und aktuelle Terms dokumentiert halten;
- Quran-Audio nicht als exklusives Premium-Gut vermarkten;
- Hisn-al-Muslim-Audio bis zu eindeutiger Rechteklärung als offenen P0-Punkt behandeln;
- vor Aktivierung einer Zahlung die dann aktuellen Terms erneut prüfen;
- bei unklarer Rechtslage Audio abschalten statt den gesamten Release zu blockieren oder eine Rechtefreigabe zu behaupten.

## 4. Was dieses Audit nicht behauptet

Dieses Dokument behauptet nicht:

- dass Nur Islam Inhaber der Audio-Copyrights ist;
- dass alle Rezitatoren identische Rechtebedingungen haben;
- dass Hisn-al-Muslim-Audio freigegeben ist;
- dass eine spätere Änderung der Anbieterbedingungen automatisch abgedeckt ist;
- dass die qualifizierte rechtliche Endprüfung dadurch entfällt.
