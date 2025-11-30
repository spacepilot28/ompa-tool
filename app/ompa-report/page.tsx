"use client";

import { useSearchParams } from "next/navigation";
import ResultSummary from "@/components/wizard/ResultSummary";
import type { WizardState } from "@/types/wizard";

export default function OmpaReportPage() {
  const searchParams = useSearchParams();
  const encoded = searchParams.get("data");

  if (!encoded) {
    return (
      <main className="min-h-screen bg-slate-950 text-gray-100 flex items-center justify-center">
        <p className="text-sm text-gray-400">
          Kein Report-Datensatz gefunden. Bitte PDF-Export von der Ergebnisseite
          aus starten.
        </p>
      </main>
    );
  }

    // 1. Daten dekodieren (Base64 → JSON)
  let state: WizardState;
  try {
    const json = atob(encoded);       // Base64 decodieren
    state = JSON.parse(json);         // JSON parsen
  } catch (e) {
    return (
      <main className="min-h-screen bg-slate-950 text-gray-100 flex items-center justify-center">
        <p className="text-sm text-red-400">
          Fehler beim Laden der Daten. Bitte erneut versuchen.
        </p>
      </main>
    );
  }

  // 2. Pure PDF-Ansicht (keine Buttons, keine Navigation)
  return (
    <div className="ompa-pdf px-8 py-12 bg-slate-950 text-gray-100">
      <ResultSummary state={state} pdfMode />
    </div>
  );
}
