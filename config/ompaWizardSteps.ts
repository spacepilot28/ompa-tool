// config/ompaWizardSteps.ts

import type { WizardStepConfig } from "../types/wizard";
import type { OmpaVariantConfig } from "../types/variant";
import { OMPA_BLOCKS } from "./ompaBlocks";
import { isQuestionIncluded } from "./ompaVariants";
import { findCoupon, isPaymentRequired } from "./ompaCoupons";

/**
 * Erzeugt die Wizard-Steps dynamisch basierend auf der aktiven Variante
 * und einem optionalen Coupon-Code.
 *
 * Gate-Logik:
 * - Wenn der effektive Preis > 0 → Stripe-Payment-Gate
 * - Wenn der effektive Preis = 0 → E-Mail-Gate (Lead-Erfassung)
 * - Light ohne Coupon → E-Mail-Gate (Standard-Flow über eingebetteten Free-Coupon)
 */
export function buildWizardSteps(
  variant: OmpaVariantConfig,
  couponCode?: string | null
): WizardStepConfig[] {
  const steps: WizardStepConfig[] = [];

  // Effektiven Gate-Typ bestimmen
  const coupon = findCoupon(couponCode, variant.id);
  const needsPayment = isPaymentRequired(variant.listPriceNet, coupon);

  // Fallback: Light ohne expliziten Coupon = immer E-Mail-Gate (Weg B)
  const effectiveGate =
    variant.gate === "email"
      ? "email"
      : needsPayment
        ? "stripe"
        : "email";

  // 1. Intro
  steps.push({
    id: "intro",
    type: "intro",
    title: variant.label,
    subtitle: variant.subtitle,
    isSkippable: false,
  });

  // 2. Branchenauswahl (nur Medium und Heavy)
  if (variant.showBranchSelect) {
    steps.push({
      id: "branch_select",
      type: "branch_select",
      title: "Branche auswählen",
      subtitle:
        "Damit wir dein Ergebnis mit ähnlichen Unternehmen vergleichen können, wähle bitte deine Branche.",
      isSkippable: false,
    });
  }

  // 3. Fragenblöcke – nur Blöcke einschließen, die mindestens eine Frage haben
  for (const block of OMPA_BLOCKS) {
    const hasQuestions = block.questions.some((q) =>
      isQuestionIncluded(variant, q.nr)
    );

    if (hasQuestions) {
      steps.push({
        id: block.id as WizardStepConfig["id"],
        type: "block",
        title: `${block.index}. ${block.title}`,
        blockId: block.id,
      });
    }
  }

  // 4. Gate (vor dem Report) – basiert auf effektivem Gate-Typ
  if (effectiveGate === "email") {
    steps.push({
      id: "email_gate",
      type: "email_gate",
      title: "Dein persönlicher Report",
      subtitle:
        "Gib deine E-Mail-Adresse ein und erhalte deinen OMPA-Report – kostenlos und sofort.",
      isSkippable: false,
    });
  }

  if (effectiveGate === "stripe") {
    steps.push({
      id: "payment_gate",
      type: "payment_gate",
      title: "Report freischalten",
      subtitle: `Schalte jetzt deinen vollständigen ${variant.label}-Report frei.`,
      isSkippable: false,
    });
  }

  // 5. Summary / Report
  steps.push({
    id: "summary",
    type: "summary",
    title: "Ergebnis & nächste Schritte",
    subtitle:
      "Hier siehst du deine Auswertung mit Handlungsempfehlungen und konkreten nächsten Schritten.",
    isSkippable: false,
  });

  return steps;
}

/**
 * Fallback: Statische Steps für Abwärtskompatibilität.
 * Wird nur noch verwendet, wenn kein Varianten-Context vorhanden ist.
 */
const blockSteps: WizardStepConfig[] = OMPA_BLOCKS.map((block) => ({
  id: block.id as WizardStepConfig["id"],
  type: "block" as const,
  title: `${block.index}. ${block.title}`,
  blockId: block.id,
}));

export const OMPA_WIZARD_STEPS: WizardStepConfig[] = [
  {
    id: "intro",
    type: "intro",
    title: "Online-Marketing-Potenzialanalyse (OMPA 2.0)",
    subtitle:
      "Wir führen dich Schritt für Schritt durch 10 Themenblöcke. Bitte beantworte alle Aussagen ehrlich – es geht um Standortbestimmung, nicht um Schönfärberei.",
    isSkippable: false,
  },
  ...blockSteps,
  {
    id: "summary",
    type: "summary",
    title: "Ergebnis & nächste Schritte",
    subtitle:
      "Hier fassen wir alle Antworten und Prioritäten zusammen und leiten konkrete Handlungsfelder ab.",
    isSkippable: false,
  },
];
