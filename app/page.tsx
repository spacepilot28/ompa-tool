// app/page.tsx
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-gray-100 flex flex-col items-center justify-center p-10">
      <h1 className="text-3xl font-bold mb-6 text-gray-100">
        Willkommen zur OMPA 2.0 – Online-Marketing-Potentialanalyse
      </h1>

      <p className="text-gray-400 max-w-xl text-center mb-8">
        Starte jetzt die Analyse und erfahre deinen aktuellen Online-Marketing-Status
        inklusive Handlungsbedarf, Prioritäten und strategischen Empfehlungen.
      </p>

      <Link
        href="/wizard"
        className="rounded-xl bg-indigo-600 px-6 py-3 text-lg font-semibold hover:bg-indigo-500 transition"
      >
        OMPA starten
      </Link>
    </main>
  );
}
