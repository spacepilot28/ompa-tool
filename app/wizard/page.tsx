//* app/wizard/page.tsx *//

"use client";

import { WizardShell } from "@/components/wizard/wizardShell";

export default function WizardPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-gray-100">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-10">
        <header className="space-y-2">
          <p className="text-sm uppercase tracking-wide text-indigo-400">
            Schritt-für-Schritt-Analyse
          </p>

          <h1 className="text-2xl font-bold">
            OMPA 2.0 – Online-Marketing-Potentialanalyse
          </h1>

          <p className="text-sm text-gray-400">
            Beantworte die folgenden Fragen, um deinen aktuellen Online-Marketing-Status 
            inklusive Handlungsbedarf und Reifegrad auszuwerten.
          </p>
        </header>

        <section>
          <WizardShell />
        </section>
      </div>
    </main>
  );
}

