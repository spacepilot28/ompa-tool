// components/wizard/OmpaBlockStep.tsx

"use client";

import type { WizardState } from "../../types/wizard";
import type { OmpaBlock } from "../../config/ompaBlocks";
import { OmpaSliderQuestion } from "./OmpaSliderQuestion";
import { useVariant } from "../../context/VariantContext";
import { isQuestionIncluded } from "../../config/ompaVariants";

interface Props {
  block: OmpaBlock;
  state: WizardState;
  onChangeAnswer: (questionNr: number, value: number) => void;
  onChangePriority: (questionNr: number, value: 1 | 2 | 3 | 4) => void;
}

export function OmpaBlockStep({
  block,
  state,
  onChangeAnswer,
  onChangePriority,
}: Props) {
  // Variante aus Context lesen (falls vorhanden, sonst undefined)
  let variant: ReturnType<typeof useVariant> | undefined;
  try {
    variant = useVariant();
  } catch {
    // Kein VariantProvider → alle Fragen anzeigen (Abwärtskompatibilität)
  }

  // Fragen filtern: nur die der aktuellen Variante
  const filteredQuestions = variant
    ? block.questions.filter((q) => isQuestionIncluded(variant!, q.nr))
    : block.questions;

  // Prioritätsmodus bestimmen
  const priorityMode = variant?.priorityMode ?? "full";

  if (filteredQuestions.length === 0) {
    return null; // Block hat keine Fragen in dieser Variante → wird nicht gerendert
  }

  return (
    <div className="space-y-6">
      {/* Blocküberschrift */}
      <div>
        <h1 className="ompa-block-title font-bold text-gray-100">
          {block.index}. {block.title}
        </h1>
        <p className="mt-2 text-base text-gray-300">
          Bewerte jede Aussage auf der Skala von 0 (trifft gar nicht zu) bis
          100 (trifft voll zu).
          {priorityMode === "full" &&
            " Zusätzlich kannst du festlegen, wie wichtig diese Frage für dich ist."}
          {priorityMode === "simple" &&
            " Gib außerdem an, wie wichtig dir dieses Thema aktuell ist."}
        </p>
      </div>

      {/* Fragenliste */}
      <div className="space-y-4">
        {filteredQuestions.map((q) => (
          <OmpaSliderQuestion
            key={q.nr}
            question={q}
            value={state.answers[q.nr]}
            priority={state.priorities[q.nr]}
            priorityMode={priorityMode}
            onChange={(val) => onChangeAnswer(q.nr, val)}
            onChangePriority={(p) => onChangePriority(q.nr, p)}
          />
        ))}
      </div>
    </div>
  );
}
