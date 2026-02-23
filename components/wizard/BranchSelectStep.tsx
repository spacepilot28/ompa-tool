// components/wizard/BranchSelectStep.tsx

"use client";

import type { WizardState, BranchId } from "../../types/wizard";
import { BRANCH_OPTIONS } from "../../types/wizard";

interface Props {
  state: WizardState;
  onSelectBranch: (branchId: BranchId) => void;
}

export function BranchSelectStep({ state, onSelectBranch }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-100">
          In welcher Branche ist dein Unternehmen tätig?
        </h1>
        <p className="mt-2 text-base text-gray-300">
          Deine Auswahl hilft uns, dein Ergebnis mit ähnlichen Unternehmen
          aus deiner Branche zu vergleichen. Der Branchenvergleich erscheint
          in deinem persönlichen Report.
        </p>
      </div>

      <div className="grid gap-3">
        {BRANCH_OPTIONS.map((branch) => {
          const isSelected = state.selectedBranch === branch.id;
          return (
            <button
              key={branch.id}
              type="button"
              onClick={() => onSelectBranch(branch.id)}
              className={[
                "w-full text-left rounded-xl px-5 py-4 text-base font-medium transition-all border",
                isSelected
                  ? "bg-[#fbb03b]/15 border-[#fbb03b] text-[#fbb03b]"
                  : "bg-gray-900/50 border-gray-700 text-gray-200 hover:border-[#fbb03b]/50 hover:bg-gray-900",
              ].join(" ")}
            >
              <div className="flex items-center gap-3">
                <div
                  className={[
                    "flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all",
                    isSelected
                      ? "border-[#fbb03b] bg-[#fbb03b]"
                      : "border-gray-600 bg-transparent",
                  ].join(" ")}
                >
                  {isSelected && (
                    <svg
                      className="h-3.5 w-3.5 text-black"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
                <span>{branch.label}</span>
              </div>
            </button>
          );
        })}
      </div>

      <p className="text-sm text-gray-500">
        Die Branchenzuordnung dient ausschließlich dem Vergleich im Report.
        Deine Daten werden anonymisiert behandelt.
      </p>
    </div>
  );
}
