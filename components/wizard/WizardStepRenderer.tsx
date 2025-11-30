// components/wizard/WizardStepRenderer.tsx

"use client";

import type { WizardState, WizardStepConfig } from "../../types/wizard";
import { OMPA_BLOCKS } from "../../config/ompaBlocks";
import { OmpaBlockStep } from "./OmpaBlockStep";
import ResultSummary from "./ResultSummary";

interface Props {
  step: WizardStepConfig;
  state: WizardState;
  onChangeAnswer: (questionNr: number, value: number) => void;
  onChangePriority: (questionNr: number, value: 1 | 2 | 3 | 4) => void;
}

export function WizardStepRenderer({
  step,
  state,
  onChangeAnswer,
  onChangePriority,
}: Props) {
  // Intro-Schritt
  if (step.type === "intro") {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-gray-100">
          Willkommen im OMPA Wizard
        </h1>
        <p className="text-lg text-gray-300">
          Wir führen dich Schritt für Schritt durch deine Online-Marketing-Potenzialanalyse.
        </p>
      </div>
    );
  }

  // Block-Schritt (Ausrichtung, Marketing, Vertrieb etc.)
  if (step.type === "block" && step.blockId) {
    const block = OMPA_BLOCKS.find((b) => b.id === step.blockId);

    if (!block) {
      return (
        <div className="text-red-400">
          Der konfigurierte Fragenblock konnte nicht gefunden werden.
        </div>
      );
    }

    return (
      <OmpaBlockStep
        block={block}
        state={state}
        onChangeAnswer={onChangeAnswer}
        onChangePriority={onChangePriority}
      />
    );
  }

  // Summary / Ergebnis-Schritt (Platzhalter)
    if (step.type === "summary") {
    return <ResultSummary state={state} />;
  }

  // Fallback
  return (
    <div className="text-red-400">
      Unbekannter Schritt-Typ: <code>{step.type}</code>
    </div>
  );
}

