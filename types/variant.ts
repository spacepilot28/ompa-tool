// types/variant.ts

/**
 * OMPA-Varianten-Bezeichner.
 * Steuert Fragenumfang, Gate-Typ, Report-Abschnitte und Preisgestaltung.
 */
export type OmpaVariantId = "light" | "medium" | "heavy";

/**
 * Vereinfachte Prioritätsstufe für OMPA Light.
 * Wird intern auf die numerische Skala 1–4 gemappt:
 *   niedrig → 1, mittel → 2, hoch → 4
 */
export type SimplePriority = "niedrig" | "mittel" | "hoch";

/**
 * Gate-Typen: Was steht zwischen dem Nutzer und seinem Report?
 */
export type GateType = "email" | "stripe" | "none";

/**
 * Prioritäts-Modus je Variante.
 * - "simple" → drei Stufen (niedrig/mittel/hoch) für Light
 * - "full"   → vier Stufen (1/2/3/4) für Medium und Heavy
 */
export type PriorityMode = "simple" | "full";

/**
 * Konfiguration einer einzelnen Report-Sektion.
 * Steuert, welche Abschnitte im Ergebnis-Report angezeigt werden.
 */
export interface ReportSectionConfig {
  overallScore: boolean;
  radarChart: boolean;
  topRecommendations: boolean;
  maxRecommendations: number;           // Light: 3, Medium/Heavy: 10
  blockTable: boolean;
  deepDivePerBlock: boolean;
  profileBalance: boolean;
  benchmark: boolean;
  csvExport: boolean;
  pdfExport: boolean;
  calendlyEmbed: boolean;               // nur Heavy
  strategieMemoHint: boolean;           // nur Heavy
  premiumBadge: boolean;                // nur Heavy
}

/**
 * Upsell-Konfiguration nach dem Report.
 */
export interface UpsellConfig {
  enabled: boolean;
  targetVariant: OmpaVariantId | "consulting" | null;
  headline: string;
  text: string;
  ctaLabel: string;
  ctaUrl: string;
}

/**
 * Vollständige Konfiguration einer OMPA-Variante.
 */
export interface OmpaVariantConfig {
  id: OmpaVariantId;
  label: string;                        // z. B. "OMPA Light"
  subtitle: string;                     // kurze Beschreibung
  listPriceNet: number;                 // Listenpreis in Euro netto (Ankerpreis)
  listPriceLabel: string;               // z. B. "29,95 € netto"
  priceNet: number;                     // Effektiver Standard-Preis (0 für Light mit Free-Coupon)
  priceLabel: string;                   // z. B. "Kostenlos", "149,95 €"

  // Fragen
  questionNumbers: number[] | "all";    // Frage-Nummern oder "all" für alle 99
  showBranchSelect: boolean;            // Branchenauswahl im Wizard
  priorityMode: PriorityMode;

  // Gate
  gate: GateType;

  // Report
  report: ReportSectionConfig;

  // Upsell
  upsell: UpsellConfig;

  // Stripe (nur für Medium/Heavy relevant)
  stripePriceId?: string;               // aus Umgebungsvariable
}

/**
 * Mapping von vereinfachter Priorität auf die numerische Skala.
 * Wird in der Slider-Komponente verwendet.
 */
export const SIMPLE_PRIORITY_MAP: Record<SimplePriority, 1 | 2 | 3 | 4> = {
  niedrig: 1,
  mittel: 2,
  hoch: 4,
};

/**
 * Labels für die vereinfachte Prioritätsanzeige (Light).
 */
export const SIMPLE_PRIORITY_LABELS: { value: SimplePriority; label: string; numericValue: 1 | 2 | 3 | 4 }[] = [
  { value: "niedrig", label: "Niedrig", numericValue: 1 },
  { value: "mittel", label: "Mittel", numericValue: 2 },
  { value: "hoch", label: "Hoch", numericValue: 4 },
];
