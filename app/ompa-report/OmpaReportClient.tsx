// app/ompa-report/OmpaReportClient.tsx
"use client";

import { useSearchParams } from "next/navigation";
import ResultSummary from "@/components/wizard/ResultSummary";
import type { WizardState } from "@/types/wizard";

export default function OmpaReportClient() {
  const searchParams = useSearchParams();
  const encoded = searchParams.get("data");

  if (!encoded) {
    return (
      <main className="min-h-screen bg-slate-950 text-gray-100 flex items-center justify-center">
        <p className="text-sm text-gray-400">
          Kein Report-Datensatz gefunden. Bitte PDF-Export von der Ergebnisseite aus
          starten.
        </p>
      </main>
    );
  }

  let state: WizardState;
      try {
    state = JSON.parse(decodeURIComponent(encoded));
      } catch {
        return (
          <main className="min-h-screen bg-slate-950 text-gray-100 flex items-center justify-center">
            <p className="text-sm text-gray-400">
              Der Report konnte nicht geladen werden. Bitte starte den OMPA-Wizard neu.
            </p>
          </main>
        );
      }

  return (
    <div className="ompa-pdf px-8 py-12 bg-slate-950 text-gray-100">
      <ResultSummary state={state} pdfMode />
    </div>
  );
}
