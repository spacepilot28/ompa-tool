// app/page.tsx – Ausschnitt mit dem Button
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-gray-100 flex items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-2xl">
        <h1 className="text-3xl md:text-4xl font-bold">
          Willkommen zur OMPA 2.0 – Online-Marketing-Potentialanalyse
        </h1>
        <p className="text-sm md:text-base text-gray-400">
          Starte jetzt die Analyse und erfahre deinen aktuellen Online-Marketing-Status
          inklusive Handlungsbedarf, Prioritäten und strategischen Empfehlungen.
        </p>

        <Link
          href="/wizard"
          className="inline-flex items-center justify-center rounded-xl bg-indigo-500 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-400 transition-colors"
        >
          OMPA starten
        </Link>
      </div>
    </main>
  );
}

