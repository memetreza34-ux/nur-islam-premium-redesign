# Nur Islam – technischer Rechts- und Datenschutz-Audit

**Stand:** 11. September 2026
**Status:** Nicht zur Veröffentlichung freigegeben. Dieser Audit ist eine technische Arbeitsunterlage und keine Rechtsberatung.

## Bereits umgesetzt

- Keine Werbe-, Analyse- oder Trackingdienste im ausgelieferten Code.
- Lokale Nutzung ohne Konto; Cloud und Standort sind optional.
- Standort, lokale Notizen, Suchergebnisse und Sitzungsdaten sind vom Cloud-Backup ausgeschlossen.
- Export und Löschung der app-spezifischen Cloud-Daten sind in der App vorhanden.
- RLS trennt die Datensätze der angemeldeten Nutzer; Übertragung erfolgt per HTTPS.
- Vor Backup, Wiederherstellung und dem Schreiben von Cloud-Notizen wird eine ausdrückliche, versionierte Einwilligung für potenziell religiöse Daten verlangt und im Profil protokolliert.
- Datenschutzerklärung beschreibt lokale Speicherung, Rechtsgrundlagen, besondere Datenkategorien, Empfänger, mögliche Drittlandverarbeitung, Speicherdauer, Betroffenenrechte und den fehlenden KI-Laufzeitdienst.
- Ein Release-Build bleibt blockiert, solange Betreiberangaben fehlen.

## P0 – vor jeder öffentlichen Veröffentlichung

- [ ] Ladungsfähige Anschrift und echte Kontakt-E-Mail eintragen.
- [ ] Rechtsform, Registerangaben, Umsatzsteuer-ID und Aufsichtsbehörde ergänzen, sofern einschlägig.
- [ ] Zuständige Datenschutz-Aufsichtsbehörde des Betreibers konkret benennen.
- [ ] Supabase-DPA/AVV, aktuelle Unterauftragnehmer und tatsächliche Datenregion dokumentieren.
- [ ] Für GitHub Pages, AlAdhan/Islamic Network, Al Quran Cloud und Overpass Rollen, Serverländer, Datenschutzhinweise, Löschfristen und Transfergrundlagen belegen.
- [ ] Prüfen, ob die bestehende Standortfreigabe für Artikel 9 DSGVO ausreichend ausdrücklich ist; andernfalls vorgeschaltete Einwilligung ergänzen oder die Abfragen über einen datenschutzgeprüften EU-Proxy führen.
- [ ] Verzeichnis der Verarbeitungstätigkeiten, Löschkonzept, Berechtigungskonzept und Verfahren für Datenschutzvorfälle intern dokumentieren.
- [ ] Zielgruppe und Umgang mit Konten Minderjähriger festlegen.
- [ ] Audio-, Übersetzungs-, Text- und Bildrechte sowie religiösen Fachreview abschließen.
- [ ] Rechtstexte durch eine qualifizierte Stelle mit den realen Betreiber- und Vertragsdaten final prüfen lassen.

## Zahlung und Barrierefreiheit

Zahlungen sind derzeit nicht aktiviert. Vor einem Abo-Start zusätzlich:

- [ ] Zahlungsanbieter, Preise einschließlich Steuern, Leistungsumfang, Laufzeit und Verlängerung festlegen.
- [ ] Vorvertragliche Informationen, Widerrufsbelehrung, Vertragsbestätigung und eindeutigen Bestellbutton umsetzen.
- [ ] Dauerhaft erreichbare Kündigungsschaltfläche und elektronische Kündigungsbestätigung umsetzen.
- [ ] Datenschutztext um Zahlungsdaten, Anbieter, Rechtsgrundlagen, Empfänger und Aufbewahrungsfristen ergänzen.
- [ ] BFSG-Anwendbarkeit anhand Mitarbeiterzahl, Umsatz/Bilanzsumme und Vertriebsweg entscheiden und dokumentieren.

## EU AI Act

Im ausgelieferten Produkt ist kein Chatbot, Empfehlungssystem oder generatives KI-System integriert. Die App ist daher nach dem geprüften Stand kein Hochrisiko-KI-System; die Transparenzpflicht für eine direkte KI-Interaktion greift nicht. KI-erzeugte Illustrationen werden in der Lizenzansicht offengelegt und sind keine als echt dargestellten Aufnahmen bestehender Personen oder Ereignisse.

Die professionelle Nutzung von KI-Werkzeugen in Entwicklung und Content-Erstellung bleibt intern zu dokumentieren. Ein kurzer Nachweis über verwendete Systeme, Zwecke, menschliche Prüfung, bekannte Risiken und Verantwortlichkeiten genügt als angemessene AI-Literacy-Maßnahme; Zertifikat oder eigener AI Officer sind nicht vorgeschrieben.

## Maßgebliche offizielle Quellen

- § 5 DDG: https://www.gesetze-im-internet.de/ddg/__5.html
- § 25 TDDDG: https://www.gesetze-im-internet.de/ttdsg/__25.html
- DSGVO-Grundsätze und Informationspflichten: https://commission.europa.eu/law/law-topic/data-protection/information-business-and-organisations/principles-gdpr_en
- Besondere Datenkategorien: https://commission.europa.eu/law/law-topic/data-protection/information-individuals_en
- Auftragsverarbeitung: https://commission.europa.eu/law/law-topic/data-protection/information-business-and-organisations/application-gdpr_en
- Internationale Übermittlungen: https://commission.europa.eu/law/law-topic/data-protection/international-dimension-data-protection/rules-international-data-transfers_en
- § 312j BGB: https://www.gesetze-im-internet.de/bgb/__312j.html
- § 312k BGB: https://www.gesetze-im-internet.de/bgb/__312k.html
- § 2 und § 3 BFSG: https://www.gesetze-im-internet.de/bfsg/__2.html und https://www.gesetze-im-internet.de/bfsg/__3.html
- AI-Act-Transparenz: https://digital-strategy.ec.europa.eu/en/faqs/transparency-obligations-under-article-50-ai-act
- AI Literacy: https://digital-strategy.ec.europa.eu/en/faqs/ai-literacy-questions-answers
