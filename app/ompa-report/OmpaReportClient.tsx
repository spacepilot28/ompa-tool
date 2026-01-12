"use client";

import { useSearchParams } from "next/navigation";
import type { WizardState } from "@/types/wizard";
import ResultSummary from "@/components/wizard/ResultSummary";

function decodeStateFromSearch(encoded: string | null): WizardState | null {
  if (!encoded) return null;
  try {
    const json = decodeURIComponent(encoded);
    const parsed = JSON.parse(json) as WizardState;

    if (!parsed || typeof parsed !== "object") return null;
    return parsed;
  } catch (error) {
    console.error("[OMPA-REPORT] Failed to decode state from URL:", error);
    return null;
  }
}

export default function OmpaReportClient() {
  const searchParams = useSearchParams();
  const encoded = searchParams.get("data");

  const wizardState = decodeStateFromSearch(encoded);

  if (!encoded) {
    return (
      <main className="min-h-screen bg-slate-950 text-gray-100 flex items-center justify-center">
        <p className="text-sm text-gray-400">
          Kein Report-Datensatz gefunden. Bitte PDF-Export von der Ergebnisseite aus starten.
        </p>
      </main>
    );
  }

  if (!wizardState) {
    return (
      <main className="min-h-screen bg-slate-950 text-gray-100 flex items-center justify-center">
        <p className="text-sm text-red-400">
          Fehler beim Laden der Daten. Bitte erneut versuchen.
        </p>
      </main>
    );
  }

  return (
    <div className="ompa-pdf px-8 py-12 bg-slate-950 text-gray-100">
      <ResultSummary wizardState={wizardState} pdfMode />
    </div>
  );
}
