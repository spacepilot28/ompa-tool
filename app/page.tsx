// app/page.tsx – Startseite mit Variantenauswahl

import Link from "next/link";

const variants = [
  {
    id: "light",
    label: "OMPA Light",
    listPrice: "29,95 € netto",
    price: "Kostenlos",
    showListPrice: true,
    description: "20 Kernfragen · Schnellcheck in 5 Minuten · Sofort-Report",
    features: [
      "Radar-Diagramm über alle 10 Themenbereiche",
      "Top-3-Handlungsfelder mit Prioritäten",
      "PDF-Report zum Download",
    ],
    cta: "Kostenlos starten",
    href: "/wizard?variant=light&coupon=Free",
    accent: "border-emerald-600 hover:border-emerald-400",
    ctaClass: "bg-emerald-600 hover:bg-emerald-500",
    badge: null,
  },
  {
    id: "medium",
    label: "OMPA Medium",
    listPrice: null,
    price: "149,95 € netto",
    showListPrice: false,
    description: "Alle 99 Fragen · Vollständige Analyse · Branchenvergleich",
    features: [
      "Alles aus Light, plus:",
      "Detaillierte Auswertung pro Themenblock",
      "Branchenvergleich mit ähnlichen Unternehmen",
      "Top-10-Handlungsfelder, priorisiert",
      "CSV-Export der Rohdaten",
    ],
    cta: "Medium starten – 149,95 €",
    href: "/wizard?variant=medium",
    accent: "border-amber-600 hover:border-amber-400",
    ctaClass: "bg-amber-600 hover:bg-amber-500",
    badge: "Beliebteste Wahl",
  },
  {
    id: "heavy",
    label: "OMPA Heavy",
    listPrice: null,
    price: "499,95 € netto",
    showListPrice: false,
    description: "Vollständige Analyse + 60-Min.-Strategiegespräch mit Robert",
    features: [
      "Alles aus Medium, plus:",
      "Persönliches 60-Minuten-Auswertungsgespräch",
      "Individuelles Strategiememo nach dem Gespräch",
      "Erweiterter Branchenvergleich",
      "Premium-Support und Nachbetreuung",
    ],
    cta: "Heavy starten – 499,95 €",
    href: "/wizard?variant=heavy",
    accent: "border-purple-600 hover:border-purple-400",
    ctaClass: "bg-purple-600 hover:bg-purple-500",
    badge: "Premium",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-gray-100 px-4 py-12">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <img
            src="/zweimeter-consulting-logo.png"
            alt="Zweimeter Consulting Logo"
            className="h-16 md:h-20 object-contain mx-auto mb-6"
          />
          <h1 className="text-3xl md:text-4xl font-bold">
            OMPA 2.0 – Online-Marketing-Potenzialanalyse
          </h1>
          <p className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto">
            Finde heraus, wo dein Online-Marketing wirklich steht – und was
            die nächsten Schritte sind. Wähle die Variante, die zu dir passt.
          </p>
        </div>

        {/* Varianten-Karten */}
        <div className="grid gap-6 md:grid-cols-3">
          {variants.map((v) => (
            <div
              key={v.id}
              className={[
                "relative flex flex-col rounded-2xl border-2 bg-gray-900/50 p-6 transition-all",
                v.accent,
              ].join(" ")}
            >
              {/* Badge */}
              {v.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-block rounded-full bg-amber-500 px-4 py-1 text-xs font-bold text-black">
                    {v.badge}
                  </span>
                </div>
              )}

              <div className="flex-1 space-y-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-100">{v.label}</h2>
                  {v.showListPrice && v.listPrice && (
                    <p className="text-sm text-gray-500 line-through mt-1">
                      {v.listPrice}
                    </p>
                  )}
                  <p className="text-2xl font-bold text-[#fbb03b] mt-1">
                    {v.price}
                  </p>
                </div>

                <p className="text-sm text-gray-400">{v.description}</p>

                <ul className="space-y-2 text-sm text-gray-300">
                  {v.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-emerald-400 mt-0.5 shrink-0">✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                href={v.href}
                className={[
                  "mt-6 block text-center rounded-xl px-6 py-3 text-sm font-bold text-white transition-colors",
                  v.ctaClass,
                ].join(" ")}
              >
                {v.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Vertrauens-Hinweis */}
        <div className="text-center mt-12 space-y-2">
          <p className="text-sm text-gray-500">
            Bereits über 50 Unternehmen haben ihre Online-Marketing-Strategie
            mit OMPA geschärft.
          </p>
          <p className="text-xs text-gray-600">
            Ein Produkt von{" "}
            <a
              href="https://zweimeter.online"
              className="underline hover:text-gray-400"
            >
              zweimeter.online
            </a>{" "}
            · Robert-Alexander Sonnenberger
          </p>
        </div>
      </div>
    </main>
  );
}
