# Nur Islam – Functional Release QA Matrix

Diese Matrix ist die manuelle Freigabeprüfung für `premium-design-finish`. Ein Bereich gilt erst als freigabefähig, wenn Design **und** Verhalten geprüft wurden. Sichtbare Controls dürfen keine Toast-only-, Demo- oder No-op-Aktion vortäuschen.

## Freigaberegel

Für jeden Test wird auf mindestens einem Desktop-Browser und einem echten Mobilgerät/PWA geprüft:

- **PASS** – Verhalten entspricht dem Sollzustand.
- **FAIL** – Aktion funktioniert nicht, zeigt falsche Daten oder führt in einen Dead-End.
- **BLOCKED** – Geräte-/Browserfähigkeit fehlt; der Fallback muss trotzdem korrekt und verständlich sein.
- **REVIEW** – religiöser Inhalt funktioniert technisch, benötigt aber noch fachliche Inhaltsprüfung.

Bei FAIL wird nicht gemergt.

## 1. App-Start / Shell

| Test | Sollzustand |
| --- | --- |
| Erststart | Splash erscheint, danach Onboarding; kein weißer Screen. |
| Wiederholter Start | Nach abgeschlossenem Onboarding direkt in die App. |
| Preview/Development | App bleibt bedienbar; kein Onboarding-Dead-End. |
| Bottom Navigation | Home, Gebete, Kalender, Lernen und Mehr öffnen den richtigen Screen. |
| Detailseiten | Reader/Ayah/Hadith/Wudu/Salah zeigen keine Bottom Navigation. |
| Back-Aktionen | Kehren zum erwarteten Elternbereich zurück. |
| Error Boundary | Renderfehler zeigt verständliche Reload-Fläche statt leere App. |
| Offline-Status | Verbindungsverlust wird sichtbar, lokale Bereiche bleiben bedienbar. |

## 2. Home

| Test | Sollzustand |
| --- | --- |
| Tagesgruß | Text ändert sich nach Uhrzeit; keine statische CSS-Pseudoüberschrift. |
| Branding | Nur-Logo ist nicht klickbar und zeigt keinen Pointer-Cursor. |
| Qibla-Schnellzugriff | Öffnet Qibla. |
| Mehr-Schnellzugriff | Öffnet Mehr/Profile. |
| Kalenderdatum | Öffnet Kalender. |
| Nächstes Gebet | Zeigt gemeinsamen aktuellen Gebetszeitplan und Quelle/Methode. |
| Quran Journey | Zeigt zuletzt gelesene Sure/Ayah aus Local Storage. |
| Quran Weiterlesen | Öffnet exakt die zuletzt gelesene Ayah. |
| Dhikr Journey | Zeigt heutige reale Zählung. |
| Quick Actions | Jede sichtbare Karte öffnet einen echten Zielbereich. |
| Assistent-Karte | Öffnet lokalen Quellenmodus. |

## 3. Gebetszeiten / Tracker / Reminder

| Test | Sollzustand |
| --- | --- |
| Initiale Zeiten | Fallback ist klar als Offline-Ersatz gekennzeichnet, nicht als Demo. |
| Live-Fetch | AlAdhan-Zeiten ersetzen Fallback bei Erfolg. |
| Standort | Eigener Standort aktualisiert gemeinsame Prayer-/Qibla-Basis. |
| Standort verweigert | App bleibt nutzbar; gespeicherter/Standardstandort bleibt aktiv. |
| Methode | Änderung der Berechnungsmethode lädt passende Zeiten neu. |
| Asr-Schule | Änderung wird gespeichert und neu berechnet. |
| Nächstes Pflichtgebet | Sonnenaufgang wird nicht als Pflichtgebet ausgegeben. |
| Tracker | Nur Pflichtgebete sind trackbar. |
| Tageswechsel | Neuer lokaler Tag erhält eigenen Tracker-State. |
| Reminder Default | Nach frischem Start ist kein Gebetsreminder still aktiviert. |
| Reminder IDs | Nur Fajr, Dhuhr, Asr, Maghrib, Isha können Reminder sein. |
| Notification erlaubt | Systemnotification + In-App-Banner funktionieren. |
| Notification verweigert | In-App-Erinnerung bleibt möglich und wird korrekt erklärt. |
| Notification-Klick | Öffnet Gebets-Tracker direkt. |
| Scheduler-Bootstrap | Reminder startet erst nach initialer Prayer-Time-Synchronisierung. |

## 4. Quran-Katalog

| Test | Sollzustand |
| --- | --- |
| Metadaten | 114 Suren erscheinen. |
| Offline-Filter | Nur fest eingebundene Offline-Suren erscheinen. |
| Favoriten | Suren-Favorit wird gespeichert und Filter aktualisiert. |
| Suche | Nummer, Name und Arabisch liefern passende Ergebnisse. |
| Mekkanisch/Medinensisch | Filter liefern korrekte Teilmengen. |
| Weiterlesen | Öffnet letzte Sure + letzte Ayah. |
| Ladefehler | Sichtbarer Fehler mit funktionierendem „Erneut versuchen“. |
| Online-Sure | Wird bei Bedarf über Al Quran Cloud geladen und gecacht. |

## 5. Quran Reader

| Test | Sollzustand |
| --- | --- |
| Deep Link | Gespeicherte Ayah wird nach Laden fokussiert und sichtbar markiert. |
| Letzter Lesestand | Antippen einer Ayah aktualisiert `nur_quran_last_read`. |
| Bedeutung | Toggle zeigt/versteckt Bedeutung wirklich. |
| Schriftgröße | +/- verändert Arabischgröße und speichert den Wert. |
| Lesezeichen | Ayah-Lesezeichen wird gespeichert/entfernt. |
| Kopieren | Clipboard enthält Arabisch, Bedeutung/Übersetzung und Referenz. |
| Teilen | Native Share API oder Clipboard-Fallback arbeitet. |
| Keine Fake-Audio-Aktion | Es gibt keinen sichtbaren Audio-Button ohne echte Rezitationsquelle. |
| Nächste Sure | Öffnet nächste Sure bei Ayah 1. |
| Ladefehler | Retry und Zurück zur Surenliste funktionieren. |

## 6. Sammlung

| Test | Sollzustand |
| --- | --- |
| Quran Bookmarks | Lesezeichen aus allen 114 Suren werden erkannt. |
| Ayah Bookmark öffnen | Öffnet exakt gespeicherte Sure + Ayah. |
| Surenfavorit | Öffnet gewählte Sure. |
| Dua Favorit | Öffnet direkt das gespeicherte Dua-Detail. |
| Name Favorit | Öffnet direkt den gespeicherten Namen. |
| Kalendertag | Öffnet richtigen Monat und Tag. |
| Tages-Ayah/Hadith | Öffnet echten Detail-Screen. |
| Leerzustand | Kein irreführender Inhalt; klare Empty-State-Fläche. |

## 7. Dhikr

| Test | Sollzustand |
| --- | --- |
| Zähler | Antippen erhöht nur bis zum Ziel. |
| Routinewechsel | Öffnet gewählte Routine und richtigen offenen Schritt. |
| Fortschritt | Routine-Prozent entspricht realen Zählungen. |
| Tageswechsel | Tageswerte setzen sich für neuen lokalen Tag zurück. |
| Manipulierter Storage | Ungültige Keys/Werte werden ignoriert bzw. auf Ziele begrenzt. |
| Statistik | Header-Chart öffnet echte Tagesstatistik, keinen Toast. |
| Statistikwerte | Gesamtzählung, Routinefortschritt und abgeschlossene Routinen stimmen. |
| Reset aktuell | Setzt nur aktuellen Dhikr zurück. |
| Reset Routine | Setzt ausgewählte Routine zurück. |

## 8. Qibla

| Test | Sollzustand |
| --- | --- |
| Berechnung | Gradzahl zur Kaaba wird aus gespeichertem Standort berechnet. |
| Standort aktualisieren | Speichert Standort und aktualisiert gemeinsame Gebetszeiten. |
| Sensor Permission | iOS/unterstützte Geräte fragen korrekt nach Berechtigung. |
| Live-Kompass | Nadel reagiert auf Orientation Events. |
| Stop | Entfernt Orientation Listener und setzt Sensorstatus zurück. |
| Kein Sensorsignal | Nach Timeout werden Listener entfernt; keine spätere Status-Wiederbelebung. |
| Screen verlassen | Timeout und Listener sind aufgeräumt. |
| Settings-Icon | Scrollt/fokussiert echte Kompasssteuerung. |
| Sensor nicht unterstützt | Berechnete Gradzahl bleibt nutzbar, verständlicher Fallback. |

## 9. Kalender / persönliche Reminder

| Test | Sollzustand |
| --- | --- |
| Monatsnavigation | Vor/zurück ändert Monat korrekt. |
| Direkter gespeicherter Tag | Öffnet exakt Zielmonat und Tag. |
| Termin anlegen | Titel/Zeit werden gespeichert. |
| Ungültiger leerer Titel | Wird nicht gespeichert. |
| Reminder Permission | Wird nur bei aktivierter Termin-Erinnerung angefragt. |
| Reminder ohne Systempermission | Termin wird trotzdem gespeichert, Status erklärt Einschränkung. |
| Reminder Scheduler | 5-Minuten-Nachholfenster verhindert leicht verpasste Timer. |
| Hintergrund | Scheduler blockiert sich nicht künstlich bei hidden state. |
| In-App-Banner | Öffnet Kalender direkt über App-State. |
| Systemnotification-Klick | Öffnet Kalender ohne simulierten Bottom-Nav-Klick. |
| Termin löschen | Entfernt Eintrag aus Storage und UI. |

## 10. Fasten-Assistent

| Test | Sollzustand |
| --- | --- |
| Toggle aus | Managed Fasten-Reminder sind entfernt. |
| Toggle an | Rolling-Service plant passende Reminder. |
| Montag/Donnerstag | Kommende Tage werden erkannt. |
| Weiße Tage | Berechnete Hijri-Tage 13–15 werden einbezogen und als berechnet gekennzeichnet. |
| Vorabend | Reminder-Termin liegt am Vortag zur gewählten Zeit. |
| Rolling Window | Plan wird 45 Tage voraus gepflegt. |
| Maintenance | Läuft nur alle 15 Minuten + bei Fokus/Sichtbarkeit, nicht alle 15 Sekunden. |
| Cleanup | Interval/Event Listener werden beim Unmount entfernt. |

## 11. Duas

| Test | Sollzustand |
| --- | --- |
| Suche/Filter | Filtern echte Einträge. |
| Favorit | Speichert und aktualisiert Zustand. |
| Detail | Öffnet korrektes Dua. |
| Deep Link aus Sammlung | Öffnet direkt Ziel-Dua. |
| Copy/Share | Echte Browseraktion oder verständlicher Fehler. |
| Quellenhinweis | Bleibt sichtbar; ungeprüfte Inhalte bleiben entsprechend gekennzeichnet. |

## 12. 99 Namen

| Test | Sollzustand |
| --- | --- |
| Suche | Arabisch/Transliteration/Bedeutung funktionieren. |
| Favorit | Wird gespeichert. |
| Gelernt | Wird gespeichert und Fortschritt aktualisiert. |
| Deep Link | Sammlung öffnet exakt den Namen. |
| Detailmodal | Öffnet/schließt korrekt. |
| Inhaltsstatus | Fachliche Endprüfung bleibt sichtbar gekennzeichnet. |

## 13. Lernen / Gebetskurs

| Test | Sollzustand |
| --- | --- |
| Kategorien | Öffnen echte Lektionen, keinen Platzhalter. |
| Quiz | Antwortzustände und Erklärungen funktionieren. |
| Abschluss | Richtige Antwort speichert Lektion als abgeschlossen. |
| Reset | Entfernt Lektionsfortschritt. |
| Share | Share API oder Clipboard-Fallback. |
| Gebetskurs | Fajr/Dhuhr/Asr/Maghrib/Isha auswählbar. |
| Vorbereitung | Checkliste speichert Zustand. |
| Rakʿah-Übung | Vor/zurück und direkte Punkte funktionieren. |
| Qibla/Zeiten | Öffnen reale Zielbereiche. |
| Wudu/Salah Guide | Schrittfortschritt und Abschluss werden gespeichert. |

## 14. Moschee-Finder

| Test | Sollzustand |
| --- | --- |
| Standardstart | Kein erfundener Demo-Moschee-Eintrag. |
| Standort | Geolocation lädt reale OSM/Overpass-Ergebnisse. |
| Entfernung | Ergebnisse nach Entfernung sortiert. |
| Cache | Wiederholte Suche kann gültigen Cache verwenden. |
| Retry | Fehlerzustand bleibt verständlich und erneut ladbar. |
| Details | Öffnen reale Ergebnisdaten. |
| Navigation | OSM-Directions-Link öffnet korrekt. |
| Website | Nur validierte HTTP/HTTPS-Links sind anklickbar. |
| Manipulierter URL-Wert | `javascript:`, ungültige Protokolle etc. werden nicht als Website übernommen. |

## 15. Nur Assistent

| Test | Sollzustand |
| --- | --- |
| Vorschläge | Erzeugen lokale Antwort mit Quellenhinweis. |
| Unterstützte freie Frage | Passender lokaler Quellen-Treffer. |
| Unbekannte religiöse Frage | Keine erfundene Antwort; expliziter Nicht-Treffer. |
| Leere Eingabe | Send-Button deaktiviert. |
| Info-Icon | Öffnet echte Quellenmodus-Info, keinen Toast. |
| Info schließen | Backdrop, X und „Verstanden“ schließen Modal. |

## 16. Mehr / Profil / Einstellungen

| Test | Sollzustand |
| --- | --- |
| Direktzugriffe | Jeder Shortcut navigiert real. |
| Theme | Dark/Light/System wird sofort angewendet und gespeichert. |
| Sprache | Solange nur Deutsch verfügbar ist, darf die Darstellung nicht wie eine wirkungslose Auswahlaktion wirken. |
| Reminder global an | Aktiviert fünf Pflichtgebete; In-App bleibt auch ohne Systempermission aktiv. |
| Reminder global aus | Entfernt Reminder-IDs. |
| Cloud | Öffnet echtes Konto/Backup. |
| Notizen | Öffnet echten Notizbereich. |
| Onboarding wiederholen | Nur Onboarding-Flag wird zurückgesetzt. |
| Logout | Auth-Session wird beendet, lokale Daten bleiben. |

## 17. Konto / Cloud

| Test | Sollzustand |
| --- | --- |
| Registrierung | Supabase Auth; E-Mail-Bestätigung wird korrekt erklärt. |
| Login | Session wird gespeichert, Profil geladen/angelegt. |
| Session Refresh | Abgelaufene Session wird erneuert oder sauber entfernt. |
| Backup | Speichert unterstützten lokalen Fortschritt. |
| Datenschutz | Standortkoordinaten, Moschee-Suchcache und lokale Notizen sind nicht im generischen Backup. |
| Restore | Nur erlaubte `nur_`/`premium_`-Keys werden wiederhergestellt. |
| RLS | Nutzer kann nur eigene Cloud-Datensätze lesen/ändern. |
| Text | HTTPS-Transport wird nicht fälschlich als E2E-Verschlüsselung bezeichnet. |

## 18. Notizen

| Test | Sollzustand |
| --- | --- |
| Gast | Lokale Notiz erstellen/bearbeiten/löschen. |
| Konto | Cloud-Notiz erstellen/bearbeiten/löschen. |
| Lokaler Import | Importiert fehlende lokale Notizen, ohne Duplikate. |
| Importfehler | Lokale Notizen bleiben erhalten. |
| Cloud-Ladefehler | Sichtbarer Fehler statt scheinbar leerer Liste. |
| Beschädigtes Datum | Ungültige lokale Note wird gefiltert; UI crasht nicht. |

## 19. PWA / Installation

| Test | Sollzustand |
| --- | --- |
| Native install prompt | Installieren öffnet Browserdialog. |
| Dialog akzeptiert | Prompt schließt/zeigt Erfolg. |
| Dialog abgebrochen | Kein toter „Installieren“-Button bleibt stehen. |
| Kein Install Event | Aktion ist deaktiviert/erklärt und kein No-op. |
| iPhone/iPad | Zeigt Share → Zum Home-Bildschirm Anleitung. |
| iPadOS Desktop-UA | Touch-basierte iPadOS-Erkennung funktioniert. |
| Bereits standalone | Install-Prompt erscheint nicht. |
| Service Worker Update | Aktuelle SW-Version registriert/übernimmt sauber. |
| Offline Navigation | App-Shell/Offline-Dokument verhält sich verständlich. |

## 20. Legacy-/Zusatzbereiche

| Test | Sollzustand |
| --- | --- |
| Islam Quiz | Fragen, Auswertung und Bestwert funktionieren. |
| Hadith-Sammlung | Suche und Favoriten funktionieren; Inhaltsprüfung bleibt gekennzeichnet. |
| Jumuah | Echte lokal gespeicherte Checkliste. |
| Zakat | 2,5%-Planungsrechnung rechnet transparent; keine Pflichtbehauptung. |
| Standby | Zeigt echte nächste Gebetszeit; Vollbild funktioniert oder erklärt Unsupported. |
| Knowledge/Prophets/Hajj/Sunnah/Sins/Ummah/Places | Übersicht ist nicht als Fake-Detailnavigation klickbar. |

## 21. Responsive / Accessibility

Prüfbreiten: **320, 350, 375, 390, 430 px**, plus Tablet/Desktop.

| Test | Sollzustand |
| --- | --- |
| Touch Targets | Zentrale Controls ungefähr 44×44 px oder größer. |
| Safe Areas | iPhone Notch/Home Indicator überdecken nichts. |
| Modals | In kleinen Viewports scrollbar; Close bleibt erreichbar. |
| Keyboard | Echte Buttons fokussierbar; statische Anzeige nicht als leere Aktion fokussierbar. |
| Focus Visible | Tastaturfokus sichtbar. |
| Zoom | Viewport blockiert User-Zoom nicht. |
| Light Theme | Text/Karten/Modals lesbar. |
| Reduced Motion | Animationen werden reduziert/entfernt. |
| Lange Texte | Keine kritischen Überläufe bei Suren-/Orts-/Namen-Labels. |

## 22. Release-Gate

Vor dem Merge müssen folgende Punkte gemeinsam erfüllt sein:

1. `npm run check` erfolgreich auf einem echten Runner oder lokalem Checkout.
2. `tsc --noEmit` erfolgreich.
3. Vite Production Build erfolgreich.
4. Kein FAIL in dieser QA-Matrix für Kernfunktionen.
5. Echter Mobile-Test für Qibla, Geolocation, Notifications und PWA-Install.
6. Offline-/schwaches-Netz-Test für Quran, Prayer Times, Mosque und Cloud.
7. Religiöse Inhaltsprüfung für alle als REVIEW gekennzeichneten Inhalte abgeschlossen oder vor Release deaktiviert/weiterhin klar als ungeprüft gekennzeichnet.
8. PR bleibt Draft, bis diese Gates erfüllt sind.
