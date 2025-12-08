"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import type { WizardState } from "@/types/wizard";

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
  const params = useSearchParams();
  const encoded = params.get("data");
  const state = decodeStateFromSearch(encoded);

  const [loading, setLoading] = useState(false);

  async function handleDownload() {
    if (!state) return;

    try {
      setLoading(true);

      // --- WICHTIG: Aufruf muss RELATIV sein ---
      const res = await fetch("/api/ompa-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ state }),
      });

      if (!res.ok) {
        console.error("PDF API returned non-OK:", res.status);
        alert("Fehler beim Erstellen des PDF-Reports.");
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "OMPA-Ergebnis.pdf";
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Fehler beim PDF-Download:", err);
      alert("PDF konnte nicht erstellt werden.");
    } finally {
      setLoading(false);
    }
  }

  if (!state) {
    return (
      <main className="min-h-screen bg-slate-950 text-gray-100 flex items-center justify-center">
        <p className="text-lg text-gray-300 text-center max-w-xl">
          Der Report konnte nicht geladen werden. Bitte starte den OMPA-Wizard
          neu.
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-900 text-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-4">OMPA 2.0 – Ergebnisübersicht</h1>

      {/* Beispielinhalt */}
      <p className="text-gray-300 mb-6">
        Dies ist die Zusammenfassung deines Analyse-Ergebnisses.
      </p>

      <button
        onClick={handleDownload}
        disabled={loading}
        className="px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold disabled:opacity-50"
      >
        {loading ? "PDF wird erzeugt…" : "PDF-Report herunterladen"}
      </button>
    </main>
  );
}
