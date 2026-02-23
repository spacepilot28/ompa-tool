// config/ompaVariants.ts

import type { OmpaVariantConfig, OmpaVariantId } from "../types/variant";

/**
 * OMPA Light – 20 Kernfragen (2 pro Block).
 *
 * Auswahlkriterien:
 * 1. Strategische Relevanz (Kernfrage des Themenblocks)
 * 2. Verständlichkeit (kein Fachvokabular)
 * 3. Differenzierungskraft (trennt fortgeschritten von Anfänger)
 * 4. Neugier-Effekt (regt Nachdenken an → Upsell zu Medium)
 */
const LIGHT_QUESTION_NUMBERS: number[] = [
  // Block 1: Ausrichtung / Online-Marketingstrategie
  1,   // Wir haben eine klare Vision/Ausrichtung
  9,   // Es gibt eine klare Zielgruppenanalyse

  // Block 2: Content & Inbound-Marketing
  11,  // Wir haben eine dokumentierte Content-Strategie
  15,  // Unsere Inhalte generieren organisch neue Besucher und Leads

  // Block 3: Kundenpotenzial / Marktausschöpfung
  21,  // Das Potenzial unserer bestehenden Kunden wird optimal ausgeschöpft
  28,  // Wir kennen den Engpass / die Probleme unserer Kunden

  // Block 4: Marketing
  36,  // Webseite
  38,  // Automatisierter Leadgenerierungsprozess

  // Block 5: Akquisitionsweg / Neukundengewinnung
  41,  // Anfragen von Kunden/Neukunden
  45,  // Empfehlungen

  // Block 6: E-Mail-Marketing & Automation
  51,  // Wir nutzen E-Mail-Marketing aktiv
  53,  // Wir haben automatisierte Sequenzen

  // Block 7: Analytics, Systeme & Funnel
  61,  // Unsere Online-Marketing-Kanäle sind messbar
  67,  // Wir haben definierte Funnel

  // Block 8: Verkaufskompetenzen
  73,  // Sichere Bedarfsanalysen
  80,  // Sicher abschließen

  // Block 9: Ergänzende Vertriebskompetenzen
  83,  // Interessenten zu Käufern machen
  85,  // Empfehlungsgeschäft nutzen

  // Block 10: Vertriebsengpass
  92,  // Ausreichend Neukunden
  95,  // Optimale Abschlussquote aus Verkaufsgesprächen
];

/**
 * Konfiguration aller drei OMPA-Varianten.
 */
export const OMPA_VARIANTS: Record<OmpaVariantId, OmpaVariantConfig> = {
  // ──────────────────────────────────────────────
  // OMPA Light – Kostenloser Leadmagnet (Weg B)
  //
  // Listenpreis: 29,95 € netto → wird kommuniziert
  // Standard: Free-Coupon eingebettet → E-Mail-Gate statt Stripe
  // Wiederholungstäter: zahlen Listenpreis oder 50%-Coupon
  // ──────────────────────────────────────────────
  light: {
    id: "light",
    label: "OMPA Light",
    subtitle: "Schnellcheck: Dein Online-Marketing-Status in 5 Minuten",
    listPriceNet: 29.95,
    listPriceLabel: "29,95 € netto",
    priceNet: 0,
    priceLabel: "Kostenlos",

    questionNumbers: LIGHT_QUESTION_NUMBERS,
    showBranchSelect: false,
    priorityMode: "simple",

    gate: "email",

    report: {
      overallScore: true,
      radarChart: true,
      topRecommendations: true,
      maxRecommendations: 3,
      blockTable: false,
      deepDivePerBlock: false,
      profileBalance: false,
      benchmark: false,
      csvExport: false,
      pdfExport: true,
      calendlyEmbed: false,
      strategieMemoHint: false,
      premiumBadge: false,
    },

    upsell: {
      enabled: true,
      targetVariant: "medium",
      headline: "Du willst das vollständige Bild?",
      text: "Mit OMPA Medium analysierst du alle 99 Fragen in 10 Themenbereichen – inklusive Branchenvergleich, detaillierter Handlungsempfehlung pro Block und priorisierter Top-10-Maßnahmenliste.",
      ctaLabel: "OMPA Medium freischalten – 149,95 €",
      ctaUrl: "/wizard?variant=medium",
    },
  },

  // ──────────────────────────────────────────────
  // OMPA Medium – Vollständige Analyse (149,95 €)
  //
  // Coupons: Dreißig (30%) → 104,97 €
  //          Sechzig (66%) → 50,98 €
  //          Free (100%)   → 0,00 €
  // ──────────────────────────────────────────────
  medium: {
    id: "medium",
    label: "OMPA Medium",
    subtitle: "Die vollständige Online-Marketing-Potenzialanalyse",
    listPriceNet: 149.95,
    listPriceLabel: "149,95 € netto",
    priceNet: 149.95,
    priceLabel: "149,95 € netto",

    questionNumbers: "all",
    showBranchSelect: true,
    priorityMode: "full",

    gate: "stripe",

    report: {
      overallScore: true,
      radarChart: true,
      topRecommendations: true,
      maxRecommendations: 10,
      blockTable: true,
      deepDivePerBlock: true,
      profileBalance: true,
      benchmark: true,
      csvExport: true,
      pdfExport: true,
      calendlyEmbed: false,
      strategieMemoHint: false,
      premiumBadge: false,
    },

    upsell: {
      enabled: true,
      targetVariant: "heavy",
      headline: "Du willst maximalen Nutzen aus deinen Ergebnissen ziehen?",
      text: "Mit OMPA Heavy bekommst du ein persönliches 60-Minuten-Auswertungsgespräch mit Robert Sonnenberger. Dazu erhältst du ein individuelles Strategiememo mit konkreten Maßnahmen – zugeschnitten auf dein Unternehmen.",
      ctaLabel: "OMPA Heavy buchen – 499,95 €",
      ctaUrl: "/wizard?variant=heavy",
    },
  },

  // ──────────────────────────────────────────────
  // OMPA Heavy – Premium mit Strategiegespräch (499,95 €)
  //
  // Coupons: Dreißig (30%) → 349,97 €
  //          Sechzig (66%) → 169,98 €
  //          Free (100%)   → 0,00 €
  // ──────────────────────────────────────────────
  heavy: {
    id: "heavy",
    label: "OMPA Heavy",
    subtitle: "Die Premium-Analyse mit persönlichem Strategiegespräch",
    listPriceNet: 499.95,
    listPriceLabel: "499,95 € netto",
    priceNet: 499.95,
    priceLabel: "499,95 € netto",

    questionNumbers: "all",
    showBranchSelect: true,
    priorityMode: "full",

    gate: "stripe",

    report: {
      overallScore: true,
      radarChart: true,
      topRecommendations: true,
      maxRecommendations: 10,
      blockTable: true,
      deepDivePerBlock: true,
      profileBalance: true,
      benchmark: true,
      csvExport: true,
      pdfExport: true,
      calendlyEmbed: true,
      strategieMemoHint: true,
      premiumBadge: true,
    },

    upsell: {
      enabled: true,
      targetVariant: "consulting",
      headline: "Bereit für den nächsten Schritt?",
      text: "Du hast die OMPA-Analyse abgeschlossen und dein Strategiegespräch gebucht. Wenn du danach langfristige Begleitung bei der Umsetzung möchtest, ist ein ZweiMeter.Consulting-Retainer der logische nächste Schritt.",
      ctaLabel: "Retainer-Optionen entdecken",
      ctaUrl: "https://zweimeter.consulting/retainer",
    },
  },
};

/**
 * Hilfsfunktion: Varianten-Config sicher abrufen.
 * Gibt bei ungültigem Bezeichner die Light-Variante zurück.
 */
export function getVariantConfig(id: string | null | undefined): OmpaVariantConfig {
  if (id && id in OMPA_VARIANTS) {
    return OMPA_VARIANTS[id as OmpaVariantId];
  }
  return OMPA_VARIANTS.light;
}

/**
 * Hilfsfunktion: Prüft, ob eine Frage-Nummer in der aktuellen Variante enthalten ist.
 */
export function isQuestionIncluded(
  variant: OmpaVariantConfig,
  questionNr: number
): boolean {
  if (variant.questionNumbers === "all") return true;
  return variant.questionNumbers.includes(questionNr);
}

/**
 * Gibt die Frage-Nummern einer Variante als Array zurück.
 * Bei "all" werden alle Nummern von 1–99 zurückgegeben.
 */
export function getQuestionNumbers(variant: OmpaVariantConfig): number[] {
  if (variant.questionNumbers === "all") {
    return Array.from({ length: 99 }, (_, i) => i + 1);
  }
  return variant.questionNumbers;
}
