# Release-Reife

Ein Blick auf alles: was fertig ist, was automatisch geprüft wird, was noch ein
Mensch tun muss.

Stand: 22.08.2026 · Branch `feat/v1-beginner-release-plan`

**Spaltenbedeutung**

- *Code fertig* — im Repository umgesetzt
- *Automatisch* — durch `npm run check` oder `npm run e2e` abgesichert
- *Manuell* — durch einen Menschen abgenommen
- *Extern* — braucht jemanden außerhalb dieses Repositories
- *Blocker* — verhindert die Veröffentlichung

---

## FUNCTIONAL

| Bereich | Code fertig | Automatisch | Manuell | Extern | Blocker | Nächster Schritt |
| --- | :-: | :-: | :-: | :-: | :-: | --- |
| Navigation, Verlauf, Zurück | ja | ja | nein | – | nein | Gerätetest |
| Home mit echtem Fortschritt | ja | ja | nein | – | nein | – |
| Anfängerpfad | ja | ja | nein | – | nein | Gerätetest |
| Quran-Reader | ja | ja | nein | – | nein | Gerätetest mit langen Suren |
| Dhikr-Zähler | ja | ja | nein | – | nein | – |
| Sammlung / Favoriten | ja | ja | nein | – | nein | – |
| Moscheesuche | ja | ja | nein | – | nein | Feldtest |
| Leere Zustände, Fehlerzustände | ja | ja | nein | – | nein | – |

## CONTENT

| Bereich | Code fertig | Automatisch | Manuell | Extern | Blocker | Nächster Schritt |
| --- | :-: | :-: | :-: | :-: | :-: | --- |
| Anfängerlektionen (10) | ja | Struktur | nein | ja | **ja** | fachliche Prüfung |
| Vertiefungslektionen (18) | ja | Struktur | nein | ja | **ja** | fachliche Prüfung |
| 99 Namen | ja | Struktur | nein | ja | **ja** | 67 Namen ohne Einzelbeleg |
| Duas (34) | ja | Quellen-Audit | nein | ja | **ja** | fachliche Prüfung |
| Hadith-Tagespool (7) | ja | Referenzen | nein | ja | **ja** | fachliche Prüfung |
| Dhikr-Formeln | ja | Struktur | nein | ja | **ja** | Wiederholungszahlen belegen |
| Wudu-/Salah-Anleitungen | ja | Struktur | nein | ja | **ja** | fachliche Prüfung |
| Rakʿah-Ablauf | ja | Struktur | nein | ja | **ja** | fachliche Prüfung |
| Kalendertermine | ja | Struktur | nein | ja | **ja** | fachliche Prüfung |

## RELIGIOUS REVIEW

| Bereich | Stand | Blocker |
| --- | --- | :-: |
| 42 Blöcke im Release-Gate | **0 freigegeben, 42 offen** | **ja** |
| Review-Paket für die Prüfung | fertig, generiert aus den Daten | nein |
| Gate am Deployment | greift, geprüft | nein |

Der größte einzelne Blocker. Details: [RELIGIOUS-HUMAN-REVIEW-PACK.md](RELIGIOUS-HUMAN-REVIEW-PACK.md).

## QURAN

| Frage | Stand | Blocker |
| --- | --- | :-: |
| Arabischer Wortlaut | 6236/6236 identisch mit `quran-uthmani` | nein |
| Deutscher Wortlaut | 6236/6236 identisch mit `de.aburida` (Abu Rida) | nein |
| Struktur, kufische Zählung | geprüft | nein |
| Sicherung gegen Änderung | sha256 über 229 Dateien, in `npm run check` | nein |
| Ursprüngliche Herkunft der Dateien | nicht dokumentiert | nein |
| **Lizenz arabische Edition** | **ungeklärt** | **ja** |
| **Lizenz deutsche Übersetzung** | **ungeklärt** | **ja** |

Details: [QURAN-PROVENANCE.md](QURAN-PROVENANCE.md).

## PRAYER

| Bereich | Code fertig | Automatisch | Manuell | Blocker | Nächster Schritt |
| --- | :-: | :-: | :-: | :-: | --- |
| Live-Zeiten, gerätestandortgebunden | ja | ja | nein | nein | – |
| Ersatzplan ohne Uhrzeiten | ja | ja | – | nein | – |
| Tages-Cache über Sommerzeit | ja | ja | nein | nein | – |
| Erinnerungen nur auf verlässlichen Zeiten | ja | ja | nein | nein | – |
| Methodenwahl, Asr-Schule | ja | ja | nein | nein | – |
| Abgleich mit örtlicher Referenz | – | – | **nein** | nein | [PRAYER-TIMES-FIELD-QA.md](PRAYER-TIMES-FIELD-QA.md) |

## QIBLA

| Bereich | Code fertig | Automatisch | Manuell | Blocker | Nächster Schritt |
| --- | :-: | :-: | :-: | :-: | --- |
| Peilungsberechnung | ja | ja | nein | nein | – |
| Keine Gradzahl ohne Standort | ja | ja | – | nein | – |
| Absolute vs. relative Orientierung | ja | ja | nein | nein | – |
| Verhalten auf echten Geräten | – | – | **nein** | nein | [QIBLA-DEVICE-QA.md](QIBLA-DEVICE-QA.md) |

## CALENDAR

| Bereich | Code fertig | Automatisch | Manuell | Blocker | Nächster Schritt |
| --- | :-: | :-: | :-: | :-: | --- |
| Hijri-Datum, auf Umm al-Qura festgelegt | ja | ja | nein | nein | – |
| **Tageswechsel ab Maghrib** | **ja** | **ja** | nein | nein | – |
| Fastentage, verbotene Tage | ja | ja | nein | **ja** | fachliche Prüfung |
| Persönliche Termine, Erinnerungen | ja | ja | nein | nein | – |

## PWA

| Bereich | Code fertig | Automatisch | Manuell | Blocker | Nächster Schritt |
| --- | :-: | :-: | :-: | :-: | --- |
| Manifest, Icons, Installation | ja | ja | nein | nein | Gerätetest |
| Service Worker, Update-Pfad | ja | ja | nein | nein | Gerätetest |
| **Offline-Start inkl. On-Demand-Screens** | **ja** | **ja** | nein | nein | Gerätetest |
| Benachrichtigungen im Vordergrund | ja | ja | nein | nein | Gerätetest |
| Benachrichtigungen bei geschlossener App | nicht zugesagt | – | – | nein | bewusst offen gelassen |

## ACCOUNT / CLOUD

| Bereich | Code fertig | Automatisch | Manuell | Blocker | Nächster Schritt |
| --- | :-: | :-: | :-: | :-: | --- |
| Registrierung, Login, Logout | ja | ja | nein | nein | manueller Durchlauf |
| Cloud-Sicherung und Wiederherstellung | ja | ja | nein | nein | manueller Durchlauf |
| Unverträgliches Schema wird abgelehnt | ja | ja | – | nein | – |
| Cloud-Notizen | ja | ja | nein | nein | manueller Durchlauf |
| Cloud-Daten löschen | ja | ja | nein | nein | – |
| **Auth-Konto löschen** | nein | – | – | nur bei Stores | siehe NATIVE-STORE-ROADMAP.md |

## SECURITY

| Bereich | Stand | Blocker |
| --- | --- | :-: |
| Keine Service-Role-Keys im Frontend | geprüft, 578 Dateien | nein |
| RLS auf allen `nur_islam_*`-Tabellen | geprüft | nein |
| Content-Security-Policy | geprüft, deckt sich mit der Datenschutzerklärung | nein |
| Frame-Schutz gegen fremde Einbettung | geprüft, E2E | nein |
| Externe Links validiert | geprüft | nein |

## PRIVACY

| Bereich | Stand | Blocker |
| --- | --- | :-: |
| Datenschutztext deckt sich mit dem Code | geprüft gegen die CSP | nein |
| Kein Tracking | zugesagt und eingehalten | nein |
| Standortdaten bleiben lokal | geprüft | nein |
| **Juristische Prüfung** | **nicht erfolgt** | **ja** |
| **Auftragsverarbeitung Supabase** | **offen** | **ja** |
| **Art. 9 DSGVO: Religionszugehörigkeit** | **zu bewerten** | **ja** |

## LEGAL

| Bereich | Stand | Blocker |
| --- | --- | :-: |
| **Impressum, Betreiberangaben** | **Platzhalter** | **ja** |
| Release-Build verweigert Platzhalter | geprüft | nein |
| Lizenzen der Abhängigkeiten | dokumentiert | nein |
| **Herkunft des Bildmaterials (30 Dateien)** | **nicht dokumentiert** | **ja** |
| Geschäftsmodell v1 | Texte sagen nichtkommerziell | nein |

Details: [LEGAL-MANUAL-ACTIONS.md](LEGAL-MANUAL-ACTIONS.md), [THIRD-PARTY-ASSET-REGISTER.md](THIRD-PARTY-ASSET-REGISTER.md).

## ACCESSIBILITY

| Bereich | Code fertig | Automatisch | Manuell | Blocker | Nächster Schritt |
| --- | :-: | :-: | :-: | :-: | --- |
| Dialog-Fokus, Escape | ja | ja | nein | nein | – |
| Touch-Ziele 44 px | ja | ja | nein | nein | – |
| **Kontrast im hellen Design** | **ja** | **ja** | nein | nein | – |
| Reduced Motion | ja | ja | nein | nein | – |
| VoiceOver, TalkBack | – | – | **nein** | nein | manuell |
| 200 % Zoom, große Systemschrift | – | – | **nein** | nein | manuell |
| RTL-Darstellung arabischer Texte | teilweise | teilweise | **nein** | nein | manuell |

## PERFORMANCE

| Bereich | Stand | Blocker |
| --- | --- | :-: |
| Startlast 287 KB gzip | gemessen, unter Budget | nein |
| Entry-Chunk 78 KB | gemessen, unter Budget (100) | nein |
| Stylesheet 95 KB gzip | gemessen, größter Einzelposten | nein |
| Lighthouse, Web Vitals | **nicht gemessen** | nein |
| Verhalten auf schwachen Geräten | **nicht gemessen** | nein |

Details: [PERFORMANCE-QA.md](PERFORMANCE-QA.md).

## DEVICE QA

| Bereich | Stand | Blocker |
| --- | --- | :-: |
| iPhone Safari | **offen** | nein |
| iPhone als installierte PWA | **offen** | nein |
| Android Chrome | **offen** | nein |
| Android als installierte PWA | **offen** | nein |
| Gerät ohne Magnetometer | **offen** | nein |
| Verweigerte Berechtigungen | **offen** | nein |

Kein Release-Blocker im technischen Sinn, aber ohne diese Tests weiß niemand,
ob die App auf echten Geräten das tut, was hier steht.

## DEPLOYMENT

| Bereich | Stand | Blocker |
| --- | --- | :-: |
| Nur `main` veröffentlicht | geprüft | nein |
| **Religiöser Gate am Deployment** | **greift, Umgehung schlägt fehl** | nein |
| **E2E vor der Veröffentlichung** | **greift** | nein |
| Strikte Release-Prüfung (`NUR_RELEASE=true`) | greift | nein |
| Schutz von `main` gegen Force-Push und Löschen | eingerichtet (Ruleset „main safety") | nein |
| PR-Zwang auf `main` | **bewusst nicht eingerichtet** | nein |
| CI grün | **ja, beide Workflows** | nein |

Der Schutz von `main` ist die einzige Einstellung, die dieses Repository nicht
über sich selbst erzwingen kann. Eingerichtet sind die zwei Unfallbremsen:
`main` lässt sich nicht löschen und nicht mit Force überschreiben.

Ein **PR-Zwang mit Pflicht-Checks wurde bewusst nicht gesetzt.** Das Repository
hat einen Betreiber, der seinen eigenen Pull Request nicht freigeben kann, und
die Veröffentlichung ist ohnehin gesperrt: Der Pages-Workflow führt den
religiösen Gate, die strikte Release-Prüfung und die Browser-Tests selbst aus,
und der `deploy`-Job hängt an allen dreien. Ein versehentlicher Direkt-Push auf
`main` würde also nicht veröffentlicht — er würde den Deployment-Lauf zum
Fehlschlagen bringen und `main` so lange defekt lassen, bis jemand es bemerkt.

Das ist der bekannte und akzeptierte Restpunkt, keine offene Aufgabe. Wer das
später enger ziehen will, findet den passenden Aufruf in
[RELEASE-OPERATIONS.md](RELEASE-OPERATIONS.md).

## OPERATIONS

| Bereich | Stand | Blocker |
| --- | --- | :-: |
| Versionsanzeige in der App | **fehlt** | nein |
| Support-Kontakt in der App | **fehlt** | nein |
| Fehler melden | **fehlt** | nein |
| Bekannte Probleme, Release Notes | **fehlt** | nein |
| Rollback-Weg | dokumentiert | nein |
| Hotfix-Ablauf | dokumentiert | nein |

Details: [RELEASE-OPERATIONS.md](RELEASE-OPERATIONS.md).

## STORE

| Bereich | Stand | Blocker |
| --- | --- | :-: |
| Native Shell | nicht begonnen, bewusst | nein |
| Store-Accounts | nicht vorhanden | nein |
| Kontolöschung | fehlt — Blocker **nur** für Stores | nein |

Details: [NATIVE-STORE-ROADMAP.md](NATIVE-STORE-ROADMAP.md).

---

## Was die Veröffentlichung tatsächlich blockiert

In der Reihenfolge, in der es angegangen werden sollte:

1. **42 religiöse Inhaltsblöcke ohne Freigabe.** Braucht eine qualifizierte
   Fachperson. Das Prüfpaket liegt bereit. Längste Vorlaufzeit.
2. **Quran-Lizenz** für die arabische Edition und die Übersetzung von Abu Rida.
   Braucht Dritte, deshalb früh anfangen.
3. **Impressumsdaten.** Fünf Minuten Arbeit — sobald die Angaben feststehen.
4. **Juristische Prüfung der Datenschutzerklärung**, einschließlich der
   Art.-9-Frage und der Auftragsverarbeitung.
5. **Herkunft des Bildmaterials** für die 30 Dateien.

Punkt 3 ist der kleinste und der einzige, der die App heute daran hindert,
überhaupt einen Release-Build zu erzeugen.

## Was den Release nicht blockiert, aber vorher passieren sollte

1. Gerätetests: Qibla, Benachrichtigungen, installierte PWA.
2. Gebetszeitenabgleich mit örtlichen Referenzen.
3. Versionsanzeige und Support-Kontakt in der App.
4. Lighthouse-Messung.

## Was technisch fertig ist

`npm run check` und `npm run e2e` sind grün, lokal und auf GitHub Actions. Der
Weg zur Veröffentlichung kann keinen Gate umgehen. Der Quran-Wortlaut ist
vollständig verifiziert und gegen Änderung gesichert. Der islamische Tag
wechselt an einer Stelle und ab Maghrib. Die App zeigt keine erfundenen
Gebetszeiten, keine erfundene Qibla-Richtung und keine ungeprüften Inhalte in
der öffentlichen Navigation.

Der Branch ist **technisch releasefähig**. Die App ist **nicht öffentlich
releasefähig** — aus inhaltlichen und rechtlichen Gründen, nicht aus
technischen.
