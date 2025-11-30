// types/wizard.ts

// Alle möglichen Schritt-IDs im Wizard
export type WizardStepId =
  | "intro"
  | "block_1"
  | "block_2"
  | "block_3"
  | "block_4"
  | "block_5"
  | "block_6"
  | "block_7"
  | "block_8"
  | "block_9"
  | "block_10"
  | "summary";

// Konfiguration eines Wizard-Schritts
export interface WizardStepConfig {
  id: WizardStepId;
  type: "intro" | "block" | "summary";
  title: string;
  subtitle?: string;
  isSkippable?: boolean;

  // Referenz auf den passenden Fragenblock (ID aus OMPA_BLOCKS)
  blockId?: string;
}

// Zentraler Zustand des Wizards
export interface WizardState {
  currentStepId: WizardStepId;
  visitedSteps: WizardStepId[];

  // Antworten: Frage-Nr (1–100) → Wert 0–100
  answers: Record<number, number>;

  // Prioritäten: Frage-Nr → 1 | 2 | 3 | 4
  priorities: Record<number, 1 | 2 | 3 | 4>;
}


// Zustand des Wizards (Antworten + Prioritäten)
export interface WizardState {
  currentStepId: WizardStepId;
  visitedSteps: WizardStepId[];

  // Antworten: Frage-Nr -> 0–100
  answers: Record<number, number>;

  // Prioritäten: Frage-Nr -> 1–4
  priorities: Record<number, 1 | 2 | 3 | 4>;
}
