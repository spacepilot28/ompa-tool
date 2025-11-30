// components/wizard/WizardProgressBar.tsx

import type { WizardState, WizardStepConfig } from "../../types/wizard";
import { OMPA_WIZARD_STEPS } from "../../config/ompaWizardSteps";

interface Props {
  currentStep: WizardStepConfig;
  state: WizardState;
}

export function WizardProgressBar({ currentStep }: Props) {
  const currentIndex = OMPA_WIZARD_STEPS.findIndex(
    (s) => s.id === currentStep.id
  );
  const total = OMPA_WIZARD_STEPS.length;
  const progress = ((currentIndex + 1) / total) * 100;

  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between">
        <p className="text-sm font-medium text-gray-100">
          Schritt {currentIndex + 1} von {total}
        </p>
        <p className="text-xs text-gray-400">
          {currentStep.title}
        </p>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-800">
        <div
          className="h-full rounded-full bg-indigo-500 transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
