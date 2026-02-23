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
  // ── Sichtbarkeit und Zustand des Weiter-Buttons je nach Step-Typ ──

  // E-Mail-Gate: Kein Weiter-Button, die Komponente handelt das selbst
  // (nach erfolgreicher Eingabe wird gateCompleted=true und automatisch weitergeblättert)
  const isGateStep =
    currentStep.type === "email_gate" || currentStep.type === "payment_gate";

  // Bei Gate-Steps: Weiter nur wenn Gate abgeschlossen
  const isGateBlocking = isGateStep && !state.gateCompleted;

  // Branchenauswahl: Weiter nur wenn Branche gewählt
  const isBranchBlocking =
    currentStep.type === "branch_select" && !state.selectedBranch;

  // Weiter-Button deaktiviert?
  const nextDisabled = !canGoNext || isGateBlocking || isBranchBlocking;

  // Bei Gate-Steps den Button ausblenden (nicht nur deaktivieren)
  const hideNextButton = isGateStep && !state.gateCompleted;

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

  // Button-Text je nach Step
  let nextLabel = "Weiter";
  if (currentStep.type === "summary") {
    nextLabel = "Fertig";
  } else if (currentStep.type === "email_gate" && state.gateCompleted) {
    nextLabel = "Zum Report";
  } else if (currentStep.type === "payment_gate" && state.gateCompleted) {
    nextLabel = "Zum Report";
  }

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

      {!hideNextButton && (
        <button
          type="button"
          onClick={handleNext}
          disabled={nextDisabled}
          className="ml-auto rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
        >
          {nextLabel}
        </button>
      )}
    </div>
  );
}
