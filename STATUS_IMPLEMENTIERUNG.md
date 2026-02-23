# OMPA 2.0 – Implementierungsstatus

**Stand:** 22. Februar 2026  
**Build:** Erfolgreich (Next.js 16, Turbopack, 0 Fehler)  
**Gesamtumfang:** ~4.600 Zeilen TypeScript/TSX

---

## Implementierte Phasen

### Phase 1: Fundament (Varianten-System) ✅ Vollständig

| Datei | Zeilen | Status |
|---|---|---|
| `types/variant.ts` | 105 | Vollständige Typdefinitionen für alle drei Varianten |
| `config/ompaVariants.ts` | 218 | Konfiguration Light/Medium/Heavy mit 20 Kernfragen für Light |
| `context/VariantContext.tsx` | 42 | React Context Provider |
| `hooks/useWizardNavigation.ts` | 136 | Dynamische Step-Generierung nach Variante |
| `config/ompaWizardSteps.ts` | 123 | `buildWizardSteps()` mit Gate-Einbindung |
| `app/wizard/page.tsx` | 63 | URL-Parameter `?variant=` auslesen |
| `components/wizard/wizardShell.tsx` | 113 | Varianten-Badge, VariantProvider |
| `components/wizard/OmpaBlockStep.tsx` | 77 | Fragenfilterung nach Variante |
| `components/wizard/OmpaSliderQuestion.tsx` | 146 | Einfache/Vollständige Prioritätseingabe |

**Wizard-Ablauf je Variante:**
- **Light:** Intro → 10 Blöcke (je 2 Fragen) → E-Mail-Gate → Report
- **Medium:** Intro → Branchenauswahl → 10 Blöcke (alle Fragen) → Payment-Gate → Report
- **Heavy:** Intro → Branchenauswahl → 10 Blöcke (alle Fragen) → Payment-Gate → Report

### Phase 2: Gates (E-Mail + Stripe) ✅ Vollständig

| Datei | Zeilen | Status |
|---|---|---|
| `components/wizard/BranchSelectStep.tsx` | 80 | 6 Branchen-Optionen, Radio-Buttons |
| `components/wizard/EmailGate.tsx` | 213 | Vorname + E-Mail + Firma + DSGVO, Validierung, API-Anbindung |
| `components/wizard/PaymentGate.tsx` | 175 | Stripe-Checkout mit Feature-Liste, Dev-Simulation |
| `app/api/ompa-lead/route.ts` | 90 | Lead-Erfassung (Phase 1: Console-Log, Phase 2: Brevo vorbereitet) |
| `app/api/create-checkout/route.ts` | 101 | Stripe-Checkout (Dev-Simulation + Produktionscode vorbereitet) |
| `app/api/verify-payment/route.ts` | 74 | Session-Verifizierung |
| `components/wizard/WizardFooterNav.tsx` | 93 | Gate-aware Navigation (Button versteckt bis Gate abgeschlossen) |
| `types/wizard.ts` | 118 | WizardState mit leadData, stripeSessionId, gateCompleted |

### Phase 3: Report-Differenzierung ✅ Vollständig

| Datei | Zeilen | Status |
|---|---|---|
| `components/wizard/ResultSummary.tsx` | 669 | **Komplett refactored** – variantenspezifisch |
| `components/RadarChart.tsx` | 202 | **Erweitert** – optionales Benchmark-Dataset (blaue Linie) |
| `config/ompaBenchmarks.ts` | 158 | 6 Branchen mit statischen Erfahrungswerten |
| `components/wizard/UpsellSection.tsx` | 53 | Varianten-CTA am Report-Ende |

**Report-Abschnitte nach Variante:**

| Abschnitt | Light | Medium | Heavy |
|---|---|---|---|
| Gesamtscore + Score-Karten | ✅ | ✅ | ✅ |
| Radar-Chart | ✅ | ✅ | ✅ |
| Radar-Chart mit Benchmark-Overlay | ❌ | ✅ | ✅ |
| Branchenvergleich-Tabelle | ❌ | ✅ | ✅ |
| Top-3 Handlungsfelder | ✅ | – | – |
| Top-10 Handlungsfelder | – | ✅ | ✅ |
| Stärkste Bereiche | ❌ | ✅ | ✅ |
| Profil-Ausgeglichenheit | ❌ | ✅ | ✅ |
| Block-Übersichtstabelle | ❌ | ✅ | ✅ |
| Deep Dive pro Block | ❌ (Teaser → Medium) | ✅ | ✅ |
| Top-N Fragen-Empfehlungen | ✅ (3) | ✅ (10) | ✅ (10) |
| CSV-Export | ❌ | ✅ | ✅ |
| PDF-Export | ✅ | ✅ | ✅ |
| Calendly-Einbettung | ❌ | ❌ | ✅ |
| Strategiememo-Hinweis | ❌ | ❌ | ✅ |
| Premium-Badge | ❌ | ❌ | ✅ |
| Upsell-CTA | → Medium | → Heavy | → Retainer |

### Phase 4: Startseite + Polish ✅ Grundstruktur

| Datei | Zeilen | Status |
|---|---|---|
| `app/page.tsx` | 152 | Variantenauswahl mit 3 Pricing-Karten |

---

## Preismodell und Coupon-System

### Listenpreise (netto, zzgl. MwSt.)

| Variante | Listenpreis | Standard-Preis | Gate-Typ |
|---|---|---|---|
| Light | 29,95 € | 0,00 € (Free-Coupon) | E-Mail-Gate |
| Medium | 149,95 € | 149,95 € | Stripe-Payment |
| Heavy | 499,95 € | 499,95 € | Stripe-Payment |

### Coupon-Staffel

| Code | Rabatt | Gültig für | Stripe-ID | Netto-Preis Light | Medium | Heavy |
|---|---|---|---|---|---|---|
| Free | 100 % | Alle | OMPA_FREE | 0,00 € | 0,00 € | 0,00 € |
| Fünfzig | 50 % | Light | OMPA_LIGHT_50 | 14,98 € | – | – |
| Dreißig | 30 % | Medium, Heavy | OMPA_30 | – | 104,97 € | 349,97 € |
| Sechzig | 66 % | Medium, Heavy | OMPA_66 | – | 50,98 € | 169,98 € |

### Weg B – Strategische Logik

Light wird **immer als kostenloser Leadmagnet** kommuniziert. Der Listenpreis von 29,95 € wird auf der Startseite durchgestrichen angezeigt, um Wertwahrnehmung zu erzeugen. Der Free-Coupon ist standardmäßig in der URL eingebettet (`?variant=light&coupon=Free`), sodass Light-Nutzer direkt durch das E-Mail-Gate gehen – kein Stripe-Checkout nötig.

Wiederholungstäter und zahlende Light-Nutzer verwenden die URL ohne Coupon-Parameter oder mit dem Fünfzig-Coupon.

Bei 100%-Coupons auf Medium/Heavy wird das Stripe-Gate automatisch durch ein E-Mail-Gate ersetzt (gleiche Logik wie bei Light).

---

## Offene Punkte für Produktionsstart

### Priorität 1 (vor Go-Live)
1. **Stripe aktivieren:** Produkte und Preise im Stripe-Dashboard anlegen (Light: 29,95 €, Medium: 149,95 €, Heavy: 499,95 €), Coupons anlegen (OMPA_FREE, OMPA_LIGHT_50, OMPA_30, OMPA_66), API-Keys in `.env` eintragen, auskommentierter Code in `create-checkout/route.ts` aktivieren
2. **Brevo aktivieren:** API-Key in `.env`, auskommentierter Code in `ompa-lead/route.ts` aktivieren
3. **Calendly-URL prüfen:** In `ResultSummary.tsx` ist `https://calendly.com/zweimeter/ompa-heavy-auswertung` als Platzhalter eingetragen
4. **Domain konfigurieren:** Vercel-Deployment auf `ompa.zweimeter.online` oder gewünschte Domain
5. **DSGVO-Seiten:** Links zu Datenschutz und Impressum prüfen (aktuell `zweimeter.online/datenschutz`)
6. ~~**Light-Fragenauswahl:** Robert muss die 20 vorgeschlagenen Kernfragen inhaltlich freigeben~~ ✅ Freigegeben am 22.02.2026

### Priorität 2 (nach Launch)
7. **E-Mail-Sequenzen:** 3-teilige Follow-up-Sequenz in Brevo aufsetzen
8. **Analytics:** Funnel-Events (Start, Completion, Gate, Report-View) tracken
9. **Benchmark Phase 2:** Anonymisierte Aggregation echter OMPA-Daten
10. **Responsiveness:** Mobile-Optimierung insbesondere für Slider und Radar-Chart
11. **Heavy-Preis-Differenzierung:** Aktuell fest auf 490 € – Staffelung prüfen

### Priorität 3 (Weiterentwicklung)
12. **ompa_questions_v2.json integrieren:** Erweiterte Metadaten (BMC-Mapping, Dimensionen) nutzen
13. **A/B-Testing:** Unterschiedliche Light-Fragenauswahl testen
14. **Wiederholungs-Check:** OMPA nach 6-12 Monaten mit Fortschrittsmessung
15. **Webhook:** Stripe-Webhook für robustere Payment-Verifizierung

---

## Technische Architektur (Kurzfassung)

```
URL: /wizard?variant=light|medium|heavy
         ↓
    wizard/page.tsx (liest URL-Parameter)
         ↓
    getVariantConfig() → OmpaVariantConfig
         ↓
    WizardShell (VariantProvider)
         ↓
    buildWizardSteps(variant) → dynamische Steps
         ↓
    useWizardNavigation(variant) → State-Management
         ↓
    WizardStepRenderer → rendert je Step-Typ:
    ├── intro         → Willkommensseite
    ├── branch_select → Branchenauswahl (Medium/Heavy)
    ├── block         → OmpaBlockStep (gefilterte Fragen)
    ├── email_gate    → EmailGate (Light)
    ├── payment_gate  → PaymentGate (Medium/Heavy)
    └── summary       → ResultSummary (varianten-differenziert)
```

---

*Dieses Dokument wird bei Änderungen aktualisiert.*
