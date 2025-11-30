// components/wizard/OmpaBlockStep.tsx

"use client";

import type { WizardState } from "../../types/wizard";
import type { OmpaBlock } from "../../config/ompaBlocks";
import { OmpaSliderQuestion } from "./OmpaSliderQuestion";

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
  return (
    <div className="space-y-6">
      {/* Blocküberschrift */}
      <div>
        <h1 className="ompa-block-title font-bold text-gray-100">
            {block.index}. {block.title}
        </h1>
        <p className="mt-2 text-base text-gray-300">
          Bewerte jede Aussage auf der Skala von 0 (trifft gar nicht zu) bis 100 (trifft voll zu).
          Zusätzlich kannst du festlegen, wie wichtig diese Frage für dich ist.
        </p>
      </div>

      {/* Fragenliste */}
      <div className="space-y-4">
        {block.questions.map((q) => (
          <OmpaSliderQuestion
            key={q.nr}
            question={q}
            value={state.answers[q.nr]}
            priority={state.priorities[q.nr]}
            onChange={(val) => onChangeAnswer(q.nr, val)}
            onChangePriority={(p) => onChangePriority(q.nr, p)}
          />
        ))}
      </div>
    </div>
  );
}
