// config/ompaWizardSteps.ts

import type { WizardStepConfig } from "../types/wizard";
import { OMPA_BLOCKS } from "./ompaBlocks";

// Für jeden Fragenblock einen eigenen Wizard-Step erzeugen
const blockSteps: WizardStepConfig[] = OMPA_BLOCKS.map((block) => ({
  id: block.id,                             // z.B. "block_1"
  type: "block",
  title: `${block.index}. ${block.title}`,  // z.B. "1. Ausrichtung / Online-Marketingstrategie"
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
