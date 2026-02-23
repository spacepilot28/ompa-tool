// components/wizard/WizardStepRenderer.tsx

"use client";

import type { WizardState, WizardStepConfig, BranchId } from "../../types/wizard";
import { OMPA_BLOCKS } from "../../config/ompaBlocks";
import { OmpaBlockStep } from "./OmpaBlockStep";
import ResultSummary from "./ResultSummary";
import { BranchSelectStep } from "./BranchSelectStep";
import { EmailGate } from "./EmailGate";
import { PaymentGate } from "./PaymentGate";

interface Props {
  step: WizardStepConfig;
  state: WizardState;
  onChangeAnswer: (questionNr: number, value: number) => void;
  onChangePriority: (questionNr: number, value: 1 | 2 | 3 | 4) => void;
  onSelectBranch?: (branchId: BranchId) => void;
  onSubmitEmail?: (data: NonNullable<WizardState["leadData"]>) => void;
  onPaymentComplete?: (sessionId: string) => void;
  onCompleteGate?: () => void;
  onCouponChange?: (code: string | null) => void;
}

export function WizardStepRenderer({
  step,
  state,
  onChangeAnswer,
  onChangePriority,
  onSelectBranch,
  onSubmitEmail,
  onPaymentComplete,
  onCompleteGate,
  onCouponChange,
}: Props) {
  // ── Intro ──
  if (step.type === "intro") {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-gray-100">
          {step.title ?? "Willkommen im OMPA Wizard"}
        </h1>
        <p className="text-lg text-gray-300">
          {step.subtitle ??
            "Wir führen dich Schritt für Schritt durch deine Online-Marketing-Potenzialanalyse."}
        </p>
      </div>
    );
  }

  // ── Branchenauswahl ──
  if (step.type === "branch_select" && onSelectBranch) {
    return (
      <BranchSelectStep
        state={state}
        onSelectBranch={onSelectBranch}
      />
    );
  }

  // ── Fragenblock ──
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

  // ── E-Mail-Gate (Light) ──
  if (step.type === "email_gate" && onSubmitEmail) {
    return (
      <EmailGate
        state={state}
        onSubmit={(data) => {
          onSubmitEmail(data);
        }}
      />
    );
  }

  // ── Payment-Gate (Medium / Heavy) ──
  if (step.type === "payment_gate" && onPaymentComplete) {
    return (
      <PaymentGate
        state={state}
        onPaymentComplete={onPaymentComplete}
        onCouponChange={onCouponChange}
      />
    );
  }

  // ── Summary / Report ──
  if (step.type === "summary") {
    return <ResultSummary wizardState={state} />;
  }

  // ── Fallback ──
  return (
    <div className="text-red-400">
      Unbekannter Schritt-Typ: <code>{step.type}</code>
    </div>
  );
}
