// components/wizard/WizardShell.tsx

"use client";

import { useWizardNavigation } from "../../hooks/useWizardNavigation";
import { WizardStepRenderer } from "./WizardStepRenderer";
import { WizardFooterNav } from "./WizardFooterNav";
import { WizardProgressBar } from "./WizardProgressBar";

export function WizardShell() {
  const {
    state,
    currentStep,
    canGoBack,
    canGoNext,
    goBack,
    goNext,
    setAnswer,
    setPriority,
  } = useWizardNavigation();

  return (
    <div className="ompa-wizard min-h-screen bg-black text-gray-100">
      <div className="mx-auto max-w-4xl px-4 py-6 space-y-6">
        {/* Logo */}
        <header className="flex justify-center mb-4">
          <img
            src="/zweimeter-consulting-logo.png"
            alt="Zweimeter Consulting Logo"
            className="h-16 md:h-20 object-contain"
          />
        </header>

        {/* Progress-Bar */}
        <header>
          <WizardProgressBar currentStep={currentStep} state={state} />
        </header>

        {/* Inhalt */}
        <main className="rounded-2xl border border-gray-800 bg-gray-950 p-6">
          <WizardStepRenderer
            step={currentStep}
            state={state}
            onChangeAnswer={setAnswer}
            onChangePriority={setPriority}
          />
        </main>

        {/* Navigation */}
        <footer>
          <WizardFooterNav
            currentStep={currentStep}
            state={state}
            canGoBack={canGoBack}
            canGoNext={canGoNext}
            onBack={goBack}
            onNext={goNext}
            onValidate={() => {}}   // <— Dummy-Handler, erfüllt den Typ
          />
        </footer>
      </div>
    </div>
  );
}
