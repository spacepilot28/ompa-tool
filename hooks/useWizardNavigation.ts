// hooks/useWizardNavigation.ts

"use client";

import { useState } from "react";
import { OMPA_WIZARD_STEPS } from "../config/ompaWizardSteps";
import type { WizardState, WizardStepId } from "../types/wizard";

export function useWizardNavigation() {
  const [state, setState] = useState<WizardState>({
    currentStepId: OMPA_WIZARD_STEPS[0].id,
    visitedSteps: [OMPA_WIZARD_STEPS[0].id],
    answers: {},
    priorities: {},
  });

  const currentIndex = OMPA_WIZARD_STEPS.findIndex(
    (s) => s.id === state.currentStepId
  );

  const currentStep = OMPA_WIZARD_STEPS[currentIndex];

  const goToStep = (stepId: WizardStepId) => {
    setState((prev) => ({
      ...prev,
      currentStepId: stepId,
      visitedSteps: Array.from(new Set([...prev.visitedSteps, stepId])),
    }));
  };

  const goNext = () => {
    const next = OMPA_WIZARD_STEPS[currentIndex + 1];
    if (next) goToStep(next.id);
  };

  const goBack = () => {
    const prev = OMPA_WIZARD_STEPS[currentIndex - 1];
    if (prev) goToStep(prev.id);
  };

  const canGoBack = currentIndex > 0;
  const canGoNext = currentIndex < OMPA_WIZARD_STEPS.length - 1;

  const setAnswer = (questionNr: number, value: number) => {
    setState((prev) => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionNr]: value,
      },
    }));
  };

  const setPriority = (questionNr: number, value: 1 | 2 | 3 | 4) => {
    setState((prev) => ({
      ...prev,
      priorities: {
        ...prev.priorities,
        [questionNr]: value,
      },
    }));
  };

  return {
    state,
    currentStep,
    canGoBack,
    canGoNext,
    goNext,
    goBack,
    goToStep,
    setAnswer,
    setPriority,
  };
}
