// components/wizard/WizardFooterNav.tsx

"use client";

import type { WizardState, WizardStepConfig } from "../../types/wizard";

interface Props {
  currentStep: WizardStepConfig;
  state: WizardState;
  canGoBack: boolean;
  canGoNext: boolean;
  onBack: () => void;
  onNext: () => void;
  onValidate: (errors: Record<string, string>) => void;
}

export function WizardFooterNav({
  currentStep,
  state,
  canGoBack,
  canGoNext,
  onBack,
  onNext,
  onValidate,
}: Props) {
  const handleNext = () => {
    if (currentStep.validate) {
      const result = currentStep.validate(state);
      if (!result.isValid) {
        onValidate(result.errors ?? {});
        return;
      }
    }
    onNext();
  };

  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        {canGoBack && (
          <button
            type="button"
            onClick={onBack}
            className="rounded-xl border border-gray-700 px-4 py-2 text-sm text-gray-300 hover:border-indigo-500"
          >
            Zurück
          </button>
        )}
      </div>

      <button
        type="button"
        onClick={handleNext}
        disabled={!canGoNext}
        className="ml-auto rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
      >
        {currentStep.id === "summary" ? "Fertig" : "Weiter"}
      </button>
    </div>
  );
}
