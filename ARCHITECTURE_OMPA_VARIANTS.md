# OMPA 2.0 – Architektur für drei Varianten (Light · Medium · Heavy)

**Stand:** Februar 2026 · Internes Arbeitsdokument  
**Autor:** Robert-Alexander Sonnenberger / ZweiMeter.Consulting  
**Technische Beratung:** Claude (Anthropic)

---

## 1. Architektur-Entscheidung: Eine Codebasis, ein Varianten-Parameter

### Empfehlung: Zentrale Variantensteuerung über URL-Parameter + Konfigurationsdatei

**URL-Struktur:**

```
/wizard?variant=light     → OMPA Light (kostenlos, 20 Fragen, E-Mail-Gate)
/wizard?variant=medium    → OMPA Medium (49 €, alle 99 Fragen, Stripe-Gate)
/wizard?variant=heavy     → OMPA Heavy (149–490 €, alle 99 Fragen + Extras, Stripe-Gate)
/wizard                   → Fallback auf "light"
```

**Warum dieser Ansatz?**

1. **Eine Codebasis** – kein doppelter oder dreifacher Wartungsaufwand
2. **Eine Konfigurationsdatei** steuert alles: Fragen, Report-Umfang, Gates, Preise, Upsell-Texte
3. **Gemeinsame Komponenten** (Slider, RadarChart, Navigation) bleiben identisch
4. **Einfaches A/B-Testing** – Varianten können per URL-Parameter getestet werden
5. **Saubere Trennung** – die Variante wird einmal beim Start gesetzt und fließt durch die gesamte Anwendung

---

## 2. Zentrale Konfigurationsdatei: `config/ompaVariants.ts`

Die gesamte Varianten-Logik wird in einer einzigen Konfigurationsdatei definiert. Jede Variante beschreibt:

| Eigenschaft | Beschreibung |
|---|---|
| `id` | Technischer Bezeichner (`light`, `medium`, `heavy`) |
| `label` | Anzeigename im UI |
| `price` | Preis in Euro netto (0 für Light) |
| `questionFilter` | Welche Fragen-Nummern gezeigt werden (alle 99 oder eine Auswahl) |
| `gate` | Welcher Zugangs-Gate vor dem Report erscheint (`email`, `stripe`, `none`) |
| `reportSections` | Welche Report-Abschnitte gerendert werden |
| `showBenchmark` | Ob der Branchenvergleich angezeigt wird |
| `showPriorityInput` | Ob der Nutzer Prioritäten setzen kann |
| `upsell` | Konfiguration für den Upsell-Bereich nach dem Report |
| `pdfEnabled` | Ob PDF-Export verfügbar ist |
| `maxTopRecommendations` | Wie viele Top-Handlungsfelder angezeigt werden |

---

## 3. Fragenauswahl für OMPA Light (20 Kernfragen)

### Auswahlprinzip

Für die Light-Variante werden genau **2 Fragen pro Themenblock** ausgewählt (10 Blöcke × 2 = 20 Fragen). Das stellt sicher, dass:

- Alle 10 Dimensionen im Radar-Diagramm abgedeckt sind
- Der Nutzer einen vollständigen ersten Eindruck seines Online-Marketing-Status erhält
- Die Analyse trotz reduziertem Umfang valide und aussagekräftig bleibt

### Auswahlkriterien

1. **Strategische Relevanz:** Die Frage trifft den Kern des jeweiligen Themenblocks
2. **Verständlichkeit:** Die Frage ist ohne Fachvokabular sofort verständlich
3. **Differenzierungskraft:** Die Frage trennt gut zwischen fortgeschrittenen und weniger fortgeschrittenen Unternehmen
4. **Neugier-Effekt:** Die Frage regt zum Nachdenken an und macht Lust auf die vollständige Analyse

### Vorschlag: 20 Kernfragen für OMPA Light

| Block | Nr. | Fragetext | Begründung |
|---|---|---|---|
| **1. Ausrichtung / Strategie** | 1 | Wir haben eine klare Vision/Ausrichtung | Fundamentale Strategiefrage, sofort verständlich |
| | 9 | Es gibt eine klare Zielgruppenanalyse | Zielgruppe ist der Dreh- und Angelpunkt jeder Strategie |
| **2. Content & Inbound** | 11 | Wir haben eine dokumentierte Content-Strategie | Dokumentation = Professionalisierungsgrad |
| | 15 | Unsere Inhalte generieren organisch neue Besucher und Leads | Direkte Wirksamkeitsmessung |
| **3. Kundenpotenzial** | 21 | Das Potenzial unserer bestehenden Kunden wird optimal ausgeschöpft | Bestandskunden = niedrig hängende Früchte |
| | 28 | Wir kennen den Engpass / die Probleme unserer Kunden heute und in der Zukunft | Kundenverständnis als Kernkompetenz |
| **4. Marketing** | 36 | Webseite | Zentraler Touchpoint für jedes Unternehmen |
| | 38 | Automatisierter Leadgenerierungsprozess | Höchste Relevanz für Skalierung |
| **5. Akquisitionsweg** | 41 | Anfragen von Kunden/Neukunden | Indikator für Inbound-Qualität |
| | 45 | Empfehlungen | Empfehlungsgeschäft = höchste Konversionsrate |
| **6. E-Mail & Automation** | 51 | Wir nutzen E-Mail-Marketing aktiv | Basisfrage zum Kanal |
| | 53 | Wir haben automatisierte Sequenzen | Automation = Skalierbarkeit |
| **7. Analytics & Funnel** | 61 | Unsere Online-Marketing-Kanäle sind messbar | Messbarkeit = Grundvoraussetzung |
| | 67 | Wir haben definierte Funnel | Funnel-Denken als Reifegrad-Indikator |
| **8. Verkaufskompetenzen** | 73 | Sichere Bedarfsanalysen | Kernkompetenz im Vertrieb |
| | 80 | Sicher abschließen | Direkte Umsatzrelevanz |
| **9. Ergänzende Vertriebskomp.** | 83 | Interessenten zu Käufern machen | Konversionsfokus |
| | 85 | Empfehlungsgeschäft nutzen | Cross-Referenz zu Block 5 |
| **10. Vertriebsengpass** | 92 | Ausreichend Neukunden | Wachstumsindikator |
| | 95 | Optimale Abschlussquote aus Verkaufsgesprächen | Effizienz-Kennzahl |

> **Hinweis:** Diese Auswahl ist ein Vorschlag. Robert kann die Fragen nach inhaltlicher Einschätzung anpassen.

---

## 4. Gate-System: E-Mail-Gate und Stripe-Gate

### 4.1 E-Mail-Gate (OMPA Light)

**Ablauf:**
1. Nutzer beantwortet alle 20 Fragen
2. Nach dem letzten Fragenblock erscheint der **E-Mail-Gate-Schritt** (neuer Wizard-Step)
3. Pflichtfelder: Vorname, E-Mail-Adresse, Unternehmen (optional), Datenschutz-Checkbox
4. Nach Absenden: Report wird angezeigt + PDF-Download verfügbar
5. Im Hintergrund: E-Mail-Adresse wird an die E-Mail-Marketing-Plattform übermittelt (Brevo-API)

**Technische Umsetzung:**
- Neuer Wizard-Step-Typ: `type: "email_gate"`
- API-Route: `POST /api/ompa-lead` → speichert Lead + triggert Brevo-API
- Der Report wird erst nach erfolgreichem Gate gerendert

### 4.2 Stripe-Gate (OMPA Medium + Heavy)

**Ablauf für Medium:**
1. Nutzer landet auf `/wizard?variant=medium`
2. Vor dem Start: Kurze Produktbeschreibung + Preisanzeige (49 €)
3. Klick auf „Jetzt kaufen" → Stripe Checkout Session
4. Nach erfolgreicher Zahlung: Redirect zurück mit Session-ID
5. Session-ID wird validiert → Wizard wird freigeschaltet
6. Nach Abschluss: Vollständiger Report + PDF

**Ablauf für Heavy:**
1. Identisch zu Medium, aber mit Preis 149–490 €
2. Zusätzlich nach Report: Calendly-Einbettung für 60-Min.-Gespräch mit Robert
3. Strategiememo wird manuell nachgeliefert (kein automatischer Prozess)

**Technische Umsetzung:**
- API-Route: `POST /api/create-checkout` → erstellt Stripe Checkout Session
- API-Route: `POST /api/verify-payment` → validiert Session nach Redirect
- Wizard-Step-Typ: `type: "payment_gate"` (vor dem ersten Fragenblock)
- Umgebungsvariablen: `STRIPE_SECRET_KEY`, `STRIPE_PRICE_ID_MEDIUM`, `STRIPE_PRICE_ID_HEAVY`

---

## 5. Report-Differenzierung nach Variante

### 5.1 OMPA Light Report

| Abschnitt | Enthalten? |
|---|---|
| Gesamtscore (Handlungsbedarf + Reifegrad) | ✅ |
| Radar-Diagramm (alle 10 Blöcke) | ✅ |
| Top-3-Handlungsfelder | ✅ (nur 3, nicht 10) |
| Kurztext pro Block (1 Satz) | ✅ |
| Deep Dive pro Block | ❌ (Upsell-Teaser: „Vollständige Analyse in OMPA Medium") |
| Branchenvergleich | ❌ |
| Profilbalance-Analyse | ❌ |
| Themenblock-Tabelle | ❌ |
| PDF-Export | ✅ (kompakter Report) |
| Upsell-Bereich | ✅ (CTA → OMPA Medium) |

### 5.2 OMPA Medium Report

| Abschnitt | Enthalten? |
|---|---|
| Gesamtscore | ✅ |
| Radar-Diagramm | ✅ |
| Top-10-Handlungsfelder | ✅ |
| Deep Dive pro Block mit Empfehlung | ✅ |
| Branchenvergleich | ✅ |
| Profilbalance-Analyse | ✅ |
| Themenblock-Tabelle | ✅ |
| PDF-Export | ✅ (ausführlicher Report) |
| CSV-Export | ✅ |
| Upsell-Bereich | ✅ (CTA → OMPA Heavy oder Retainer) |

### 5.3 OMPA Heavy Report

| Abschnitt | Enthalten? |
|---|---|
| Alles aus Medium | ✅ |
| Calendly-Einbettung für Strategiegespräch | ✅ |
| Hinweis auf persönliches Strategiememo | ✅ |
| Premium-Badge im Report | ✅ |
| Erweiterter Branchenvergleich (falls Daten vorhanden) | ✅ |
| Upsell-Bereich | ✅ (CTA → ZweiMeter.Consulting Retainer) |

---

## 6. Branchenvergleich (Benchmark)

### Konzept

Der Branchenvergleich zeigt dem Nutzer, wie sein Unternehmen im Vergleich zu ähnlichen Unternehmen abschneidet. Für den Start wird mit **statischen Benchmark-Daten** gearbeitet, die auf Roberts Erfahrungswerten basieren.

### Datenstruktur

```typescript
// config/ompaBenchmarks.ts
export interface BenchmarkData {
  industry: string;           // z.B. "Produzierendes Gewerbe"
  sampleSize: number;         // Anzahl Vergleichsunternehmen
  blockAverages: Record<string, number>;  // Block-ID → Durchschnittswert (0–100)
}
```

### Umsetzungsphase

**Phase 1 (Start):** 3–5 vordefinierte Branchen-Benchmarks, manuell gepflegt.  
**Phase 2 (nach 50+ Analysen):** Anonymisierte Aggregation echter OMPA-Daten zur automatischen Benchmark-Berechnung.

### Darstellung im Report

- Zweites Dataset im Radar-Diagramm (gestrichelte Linie: „Branchendurchschnitt")
- Pro Block: „Ihr Unternehmen: 35 % Handlungsbedarf | Branche: 52 % Handlungsbedarf"
- Farbcodierung: Grün wenn besser als Branche, Orange wenn schlechter

---

## 7. Dateistruktur nach Umbau

```
ompa-tool/
├── app/
│   ├── page.tsx                          # Startseite (Variantenauswahl)
│   ├── wizard/
│   │   └── page.tsx                      # Wizard (liest ?variant= aus URL)
│   ├── ompa-report/
│   │   ├── page.tsx
│   │   └── OmpaReportClient.tsx
│   └── api/
│       ├── ompa-report/route.ts          # PDF-Export
│       ├── ompa-lead/route.ts            # NEU: E-Mail-Lead-Erfassung
│       ├── create-checkout/route.ts      # NEU: Stripe Checkout
│       └── verify-payment/route.ts       # NEU: Stripe Verifizierung
│
├── config/
│   ├── ompaBlocks.ts                     # Alle 99 Fragen in 10 Blöcken
│   ├── ompaVariants.ts                   # NEU: Varianten-Konfiguration
│   ├── ompaWizardSteps.ts                # Wizard-Steps (erweitert um Gates)
│   └── ompaBenchmarks.ts                 # NEU: Branchenvergleichsdaten
│
├── components/
│   ├── OmpaWizard.tsx
│   ├── RadarChart.tsx                    # Erweitert um Benchmark-Dataset
│   └── wizard/
│       ├── wizardShell.tsx               # Erweitert um Varianten-Context
│       ├── WizardStepRenderer.tsx        # Erweitert um Gate-Steps
│       ├── WizardFooterNav.tsx
│       ├── WizardProgressBar.tsx
│       ├── OmpaBlockStep.tsx
│       ├── OmpaSliderQuestion.tsx
│       ├── ResultSummary.tsx             # Erweitert um variantenspez. Sektionen
│       ├── EmailGate.tsx                 # NEU: E-Mail-Erfassung
│       ├── PaymentGate.tsx               # NEU: Stripe-Kaufprozess
│       ├── BenchmarkComparison.tsx       # NEU: Branchenvergleich
│       ├── UpsellSection.tsx             # NEU: Upsell-CTA nach Report
│       └── ompaEncoding.ts
│
├── context/
│   └── VariantContext.tsx                # NEU: React Context für Variante
│
├── hooks/
│   ├── useWizardNavigation.ts            # Erweitert um Variantenfilter
│   └── useVariant.ts                     # NEU: Hook für Variantenzugriff
│
├── types/
│   ├── ompa.ts
│   ├── wizard.ts                         # Erweitert um Gate-Steps
│   └── variant.ts                        # NEU: Varianten-Typen
│
├── utils/
│   ├── calcResults.ts
│   └── calcBenchmark.ts                  # NEU: Benchmark-Berechnung
│
└── data/
    ├── ompa_questions_v2.json
    └── benchmarks/                       # NEU: Branchendaten (JSON)
        ├── produzierendes-gewerbe.json
        ├── dienstleistung.json
        └── handel.json
```

---

## 8. Implementierungsreihenfolge (4 Phasen)

### Phase 1: Fundament (Varianten-System)
**Ziel:** Alle drei Varianten sind technisch steuerbar, der Wizard filtert Fragen korrekt.

1. `config/ompaVariants.ts` anlegen mit allen drei Varianten-Definitionen
2. `types/variant.ts` mit TypeScript-Typen
3. `context/VariantContext.tsx` als React Context Provider
4. `hooks/useVariant.ts` als Zugriffs-Hook
5. `hooks/useWizardNavigation.ts` erweitern: Fragen nach Variante filtern
6. `config/ompaWizardSteps.ts` erweitern: Steps dynamisch nach Variante generieren
7. `/wizard/page.tsx` erweitern: URL-Parameter `variant` auslesen und Context setzen
8. Testen: Light zeigt 20 Fragen, Medium/Heavy zeigen 99 Fragen

### Phase 2: Gates (E-Mail + Stripe)
**Ziel:** Light erfordert E-Mail-Eingabe, Medium/Heavy erfordern Bezahlung.

1. `components/wizard/EmailGate.tsx` bauen
2. `app/api/ompa-lead/route.ts` bauen (zunächst als JSON-Speicher, später Brevo-Anbindung)
3. `types/wizard.ts` erweitern: neue Step-Typen `email_gate` und `payment_gate`
4. `WizardStepRenderer.tsx` erweitern: Gate-Komponenten rendern
5. `components/wizard/PaymentGate.tsx` bauen
6. `app/api/create-checkout/route.ts` und `verify-payment/route.ts` bauen
7. Stripe-Integration testen (zunächst im Test-Modus)

### Phase 3: Report-Differenzierung
**Ziel:** Jede Variante bekommt genau die Report-Abschnitte, die ihr zustehen.

1. `ResultSummary.tsx` refactoren: Abschnitte über Varianten-Config ein-/ausblenden
2. `components/wizard/UpsellSection.tsx` bauen (CTA-Texte pro Variante)
3. `components/wizard/BenchmarkComparison.tsx` bauen
4. `config/ompaBenchmarks.ts` mit ersten statischen Benchmark-Daten befüllen
5. `RadarChart.tsx` erweitern: zweites Dataset für Branchendurchschnitt
6. PDF-Export anpassen: unterschiedliche Report-Längen pro Variante

### Phase 4: Polish und Startseite
**Ziel:** Professionelle Nutzerführung von Landingpage bis Report.

1. Startseite (/) redesignen: Variantenauswahl mit Preisvergleich
2. Upsell-Flows testen (Light → Medium → Heavy)
3. Responsiveness prüfen (Mobile-First für Light)
4. Ladezeiten und Performance optimieren
5. DSGVO-Texte und Impressum einbinden
6. Analytics-Events für Funnel-Tracking vorbereiten

---

## 9. Umgebungsvariablen (`.env.local`)

```env
# Stripe (Test-Modus zuerst)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_PRICE_ID_MEDIUM=price_...
STRIPE_PRICE_ID_HEAVY=price_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Brevo (E-Mail-Marketing)
BREVO_API_KEY=xkeysib-...
BREVO_LIST_ID_OMPA=42

# App
NEXT_PUBLIC_BASE_URL=https://ompa.zweimeter.online
PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
```

---

## 10. Offene Fragen für Robert

1. **Light-Fragen:** Passt die vorgeschlagene Auswahl von 20 Kernfragen, oder möchtest du andere Fragen priorisieren?
2. **Prioritäts-Eingabe bei Light:** Soll der Nutzer in der Light-Variante auch Prioritäten setzen können, oder nur den Slider bedienen?
3. **Branchenauswahl:** Soll der Nutzer seine Branche am Anfang des Wizards auswählen (für den Benchmark)?
4. **Heavy-Preis:** Der Funnel-Plan nennt 149–490 €. Welcher feste Preis soll bei Stripe hinterlegt werden? Oder gibt es mehrere Untervarianten?
5. **Stripe vs. Calendly-First:** Soll bei Heavy zuerst bezahlt werden und dann der Wizard starten? Oder soll der Wizard frei zugänglich sein und erst am Ende bezahlt werden?
6. **Domain:** Soll das Tool auf `ompa.zweimeter.online` laufen oder auf einer Subdomain von `zweimeter.consulting`?

---

*Dieses Dokument ist die technische Grundlage für die OMPA-2.0-Implementierung. Es wird bei Änderungen aktualisiert.*
