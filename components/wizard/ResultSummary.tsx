// components/wizard/ResultSummary.tsx
"use client";


import type { WizardState } from "../../types/wizard";
import { OMPA_BLOCKS } from "../../config/ompaBlocks";
import {
  calculateBlockScore,
  calculateOverallScore,
  getTopRecommendations,
  getProfileBalance,
} from "../../utils/calcResults";
import RadarChart from "../RadarChart";
import { useState } from "react";

function getBlockRecommendation(title: string, need: number): string {
  if (need >= 70) {
    return `Hier besteht akuter Handlungsbedarf – „${title}“ sollte kurzfristig priorisiert werden. Fokus: schnell wirksame Maßnahmen und klare Verantwortlichkeiten.`;
  }
  if (need >= 40) {
    return `Mittlerer Handlungsbedarf – „${title}“ sollte in den nächsten 3–6 Monaten systematisch ausgebaut werden. Plane konkrete Maßnahmenpakete und Meilensteine ein.`;
  }
  if (need > 0) {
    return `Geringer Handlungsbedarf – „${title}“ ist solide aufgestellt. Regelmäßiges Monitoring und kleinere Optimierungen reichen aktuell aus.`;
  }
  return `Aktuell kein Handlungsbedarf – „${title}“ kann als Stärke genutzt werden. Baue hier Referenzen, Best Practices und Storytelling für Marketing & Vertrieb auf.`;
}

interface ResultSummaryProps {
  state: WizardState;
  pdfMode?: boolean;
}

// Verbales Label, Ton & Badge-Klasse für den Gesamt-Handlungsbedarf
function getOverallLabel(need: number) {
  if (need >= 70) {
    return {
      label: "Sehr hoher Handlungsbedarf",
      tone: "danger",
      badge: "bg-red-900/60 border border-red-600/60 text-red-300",
    };
  }

  if (need >= 40) {
    return {
      label: "Mittlerer Handlungsbedarf",
      tone: "warning",
      badge: "bg-amber-900/60 border border-amber-600/60 text-amber-300",
    };
  }

  return {
    label: "Geringer Handlungsbedarf",
    tone: "success",
    badge: "bg-emerald-900/60 border border-emerald-600/60 text-emerald-300",
  };
}

function getNeedLevelClass(need: number) {
  if (need >= 70) {
    // hoher Handlungsbedarf → kräftiges Orange
    return "bg-orange-500";
  }
  if (need >= 40) {
    // mittlerer Handlungsbedarf → Amber
    return "bg-amber-400";
  }
  // geringer Handlungsbedarf → eher beruhigendes Grün
  return "bg-emerald-500";
}

export default function ResultSummary({ state, pdfMode = false }: ResultSummaryProps) {

  // Block-Ergebnisse berechnen
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const blockResults = OMPA_BLOCKS.map((block) => {
    const res: any = calculateBlockScore(block, state);
    return {
      id: block.id,
      index: (block as any).index ?? 0,
      title: block.title,
      ...res, // z.B. percent, need, rawScore – was calcBlockScore liefert
    };
  });
  // ... dein blockResults / radarData Code folgt danach

  // ------------------------------------------------------------
  // Scores & Auswertung
  // ------------------------------------------------------------

  // 1. Handlungsbedarf pro Themenblock aus Reifegrad ableiten
  //    Annahme: b.percent ist ein 0–100 Reifegrad-Score pro Block
  const radarData = blockResults.map((b: any, idx: number) => {
    const maturity = b.percent ?? 0;             // 0–100, je höher, desto besser
    const need = Math.max(0, 100 - maturity);    // 0–100, je höher, desto mehr Baustelle

    return {
      subject: `${idx + 1}. ${b.title}`,
      need,
      fullMark: 100,
    };
  });

  // 2. OMPA-Gesamthandlungsbedarf = Durchschnitt aller Needs
  const overallNeed = Math.round(
    radarData.reduce((sum, item) => sum + item.need, 0) / radarData.length
  );

  // 3. Gesamt-Reifegrad = Gegenstück
  const overallMaturity = 100 - overallNeed;

  // 4. Meta-Info für Badge / verbales Label
  const overallMeta = getOverallLabel(overallNeed);

  // 5. Profil-Ausgeglichenheit (Varianz-Auswertung bleibt wie gehabt)
  const profileBalance = getProfileBalance(blockResults as any);

  // 6. Themenblöcke nach Handlungsbedarf sortiert (für die Liste unten)
  const blocksByNeed = radarData
    .map((item, idx) => ({
      index: idx + 1,
      title: item.subject,
      need: item.need,
    }))
    .sort((a, b) => b.need - a.need);

      function exportNeedCsv() {
    const header = [
      "Index",
      "Themenblock",
      "Handlungsbedarf_Prozent",
      "Reifegrad_Prozent",
    ];

    const rows = blocksByNeed.map((b) => {
      const maturity = 100 - b.need;
      return [
        b.index.toString(),
        `"${b.title.replace(/"/g, '""')}"`,
        b.need.toFixed(0).replace(".", ","),
        maturity.toFixed(0).replace(".", ","),
      ].join(";");
    });

    const csv = [header.join(";"), ...rows].join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ompa-handlungsbedarf.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }
// 7. Top 5 Handlungsfelder (höchster Handlungsbedarf)
const topNeedBlocks = blocksByNeed.slice(0, 5);

// 8. Stärkste Bereiche: Relevanz = 4 UND Reifegrad >= 75 %
// 8. Stärkste Bereiche: Relevanz = 4 UND Reifegrad >= 75 %
const topStrengthBlocks = blocksByNeed
  .map((b) => {
    const maturity = 100 - b.need;
    const relevance =
      (b as any).relevance ??
      (b as any).weight ??
      4; // Fallback, bis du echte Relevanz-Werte pro Block pflegst
    return {
      ...b,
      maturity,
      relevance,
    };
  })
  .filter((b) => b.relevance === 4 && b.maturity >= 75)
  .sort((a: any, b: any) => b.maturity - a.maturity)
  .slice(0, 5);
// 9. Top 10 Empfehlungen je Frage
const topRecommendations = getTopRecommendations(
  OMPA_BLOCKS as any,
  state
);
  return (
    <div className="space-y-8">
      {/* Kopfbereich mit Gesamteindruck */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
            <div>
              {pdfMode && (
              <p className="text-xs text-gray-400 mb-2">
               OMPA 2.0 – Report • Erstellt am{" "}
               {new Date().toLocaleDateString("de-DE")}
              </p>
              )}
            </div>
          <h1 className="text-[2.5rem] font-bold text-gray-100 mb-4">
            OMPA 2.0 – Ergebnisübersicht
          </h1>
          <p className="text-[1rem] text-gray-300 leading-relaxed mb-8">
            Unten siehst du eine Zusammenfassung deines aktuellen Online-
            Marketing-Status. Das Spinnendiagramm zeigt den Handlungsbedarf in
            den einzelnen Themenblöcken, die Liste darunter deine wichtigsten
            Baustellen nach Priorität.
          </p>
        </div>
{/* Export-Buttons */}
<div className="mt-4 flex flex-wrap gap-3 justify-end print:hidden">
  <button
  type="button"
  onClick={async () => {
    try {
      setIsExportingPdf(true);

      // 1. Wizard-Status serialisieren
      const payload = JSON.stringify(state);
      const encoded = encodeURIComponent(btoa(payload));

      // 2. Report-URL bauen (unsere neue Seite!)
      const reportUrl = `${window.location.origin}/ompa-report?data=${encoded}`;

      // 3. API zum PDF-Rendern aufrufen
      const res = await fetch("/api/ompa-report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: reportUrl }),
      });

      if (!res.ok) {
        console.error("PDF Export failed", await res.text());
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "OMPA-Ergebnis.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } finally {
      setIsExportingPdf(false);
    }
  }}
  className="inline-flex items-center gap-2 rounded-full bg-slate-900/70 border border-slate-600 px-4 py-2 text-xs font-semibold text-gray-100 hover:bg-slate-800 transition"
>
  {isExportingPdf ? "PDF wird erstellt…" : "PDF-Report herunterladen"}
</button>

</div>
        <div className="flex flex-col gap-3 items-stretch md:items-end min-w-[260px]">
          {/* Gesamt-Handlungsbedarf */}
          <div className="inline-flex items-center justify-between gap-4 rounded-full bg-gray-900/70 border border-gray-700 px-4 py-2">
            <div className="text-xs text-gray-400">
              OMPA-Gesamt-Handlungsbedarf
            </div>
            <div className="text-3xl font-bold text-[#fbb03b]">
              {overallNeed}%
            </div>
          </div>

          {/* Verbales Label */}
          <div
            className={`inline-flex items-center justify-between gap-4 rounded-full px-4 py-2 ${overallMeta.badge}`}
          >
            <span className="text-xs text-gray-200">Einschätzung</span>
            <span className="text-sm font-semibold">{overallMeta.label}</span>
          </div>

          {/* Gesamt-Reifegrad */}
          <div className="inline-flex items-center justify-between gap-4 rounded-full bg-gray-900/70 border border-gray-700 px-4 py-2">
            <div className="text-xs text-gray-400">Gesamt-Reifegrad</div>
            <div className="text-3xl font-bold text-emerald-300">
              {overallMaturity}%
            </div>
          </div>
        </div>
      </div>

      {/* Handlungsbedarf je Themenblock + Profil-Balance */}
      <section className="rounded-2xl border border-gray-800 bg-gray-950/80 p-6 space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[2rem] font-bold text-gray-100">
            Handlungsbedarf je Themenblock
          </h2>

          <div className="flex flex-col items-end gap-1">
            <div className="inline-flex items-center gap-2 rounded-full bg-gray-900/70 border border-gray-700 px-3 py-1">
              <span className="text-xs text-gray-400">
                Profil-Ausgeglichenheit
              </span>
              <span className="text-sm font-semibold text-emerald-300">
                {profileBalance.balanceScore}%
              </span>
            </div>
            <div className="text-[0.8rem] text-gray-400">
              {profileBalance.label}
            </div>
          </div>
        </div>
          <p className="text-[1rem] text-gray-400 mt-2">
          Je weiter der Wert nach außen geht, desto größer der Handlungsbedarf
          im jeweiligen Themenblock. Ein gleichmäßig runder Verlauf deutet auf
          ein ausgewogenes Online-Marketing hin.
        </p>
      </section>

<div className="mt-6">
  <div className="w-full flex justify-center my-4">
  <div className="w-full max-w-[820px]"> 
    <RadarChart
      labels={radarData.map((item) => item.subject)}
      values={radarData.map((item) => item.need)}
    />
  </div>
</div>


  <p className="text-[0.9rem] text-gray-400 mt-2">
    Je weiter der Wert nach außen geht, desto größer ist der Handlungsbedarf
    im jeweiligen Themenblock. Ein gleichmäßig runder Verlauf deutet auf ein
    ausgewogenes Online-Marketing hin.
  </p>
</div>

      <section className="mt-10">
  <h3 className="text-xl font-semibold text-gray-100 mb-2">
    Themenblöcke nach Handlungsbedarf
  </h3>
  <p className="text-sm text-gray-400 mb-4">
    Die Liste ist absteigend nach Handlungsbedarf sortiert. Oben stehen die
    Themen, bei denen die meisten Punkte liegen bleiben.
  </p>
  </section>
{/* --------------------------------------------------
    Executive Summary
   -------------------------------------------------- */}
{pdfMode && (
<section className="mt-12 ompa-page-break-before">
  <h2 className="text-2xl font-semibold text-gray-100 mb-4">
    Executive Summary
  </h2>

  <p className="text-sm text-gray-400 mb-6">
    Die folgende Zusammenfassung fasst die wichtigsten Ergebnisse der
    Online-Marketing-Potenzialanalyse zusammen. Der Fokus liegt auf den
    größten Handlungsfeldern sowie den bereits stark ausgeprägten
    Bereichen mit hohem Reifegrad.
  </p>

  <div className="grid gap-8 md:grid-cols-2">
    {/* Größte Baustellen */}
    <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-5">
      <h3 className="text-lg font-semibold text-gray-100 mb-3">
        Top 5 Handlungsfelder (höchster Handlungsbedarf)
      </h3>
      {topNeedBlocks.length === 0 ? (
        <p className="text-sm text-gray-400">
          Aktuell wurden keine Handlungsfelder mit relevantem
          Handlungsbedarf identifiziert.
        </p>
      ) : (
        <ol className="space-y-2 text-sm text-gray-300 list-decimal list-inside">
          {topNeedBlocks.map((b) => (
            <li key={b.index}>
              <span className="font-semibold">{b.title}</span>{" "}
              – Handlungsbedarf{" "}
              <span className="font-semibold">
                {b.need.toFixed(0)}%
              </span>
              .
            </li>
          ))}
        </ol>
      )}
      <p className="mt-3 text-xs text-gray-500">
        Diese Themenblöcke sollten in der Planung der nächsten 3–6 Monate
        priorisiert werden, da hier aktuell das größte Optimierungspotenzial
        besteht.
      </p>
    </div>

    {/* Stärkste Bereiche */}
    <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-5">
      <h3 className="text-lg font-semibold text-gray-100 mb-3">
        Top 5 stärkste Bereiche (höchster Reifegrad)
      </h3>
      {topStrengthBlocks.length === 0 ? (
        <p className="text-sm text-gray-400">
          Es wurden keine Themenblöcke mit einem Reifegrad von mindestens
          75&nbsp;% identifiziert. Mit zunehmender Optimierung werden hier
          zukünftig Stärken sichtbar.
        </p>
      ) : (
        <ol className="space-y-2 text-sm text-gray-300 list-decimal list-inside">
          {topStrengthBlocks.map((b) => (
            <li key={b.index}>
              <span className="font-semibold">{b.title}</span>{" "}
              – Reifegrad{" "}
              <span className="font-semibold">
                {b.maturity.toFixed(0)}%
              </span>
              , Handlungsbedarf {b.need.toFixed(0)}%.
            </li>
          ))}
        </ol>
      )}
      <p className="mt-3 text-xs text-gray-500">
        Diese Bereiche können genutzt werden, um Erfolgsgeschichten,
        Best Practices und Referenzen aufzubauen und so das Profil nach
        außen zu schärfen.
      </p>
    </div>
  </div>
</section>
)}
{/* --------------------------------------------------
    Übersicht der Themenblöcke (Tabelle)
   -------------------------------------------------- */}
<section className="mt-12 ompa-section-avoid-break">
  <h2 className="text-2xl font-semibold text-gray-100 mb-4">
    Übersicht der Themenblöcke (Handlungsbedarf &amp; Reifegrad)
  </h2>

  <p className="text-sm text-gray-400 mb-4">
    Die folgende Übersicht zeigt alle Themenblöcke mit ihrem aktuellen
    Handlungsbedarf und Reifegrad. Die Sortierung erfolgt nach
    absteigendem Handlungsbedarf.
  </p>

  <div className="overflow-x-auto rounded-2xl bg-slate-900/70 border border-slate-800">
    <table className="w-full text-sm text-left text-gray-200">
      <thead>
        <tr className="border-b border-slate-800 bg-slate-900/80">
          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400">
            #
          </th>
          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400">
            Themenblock
          </th>
          <th className="px-4 py-3 text-right text-xs font-semibold text-gray-400">
            Handlungsbedarf
          </th>
          <th className="px-4 py-3 text-right text-xs font-semibold text-gray-400">
            Reifegrad
          </th>
        </tr>
      </thead>
      <tbody>
        {blocksByNeed.map((block) => {
          const maturity = 100 - block.need;
          return (
            <tr
              key={block.index}
              className="border-b border-slate-800/60 last:border-b-0"
            >
              <td className="px-4 py-2 text-xs text-gray-500">
                {block.index}
              </td>
              <td className="px-4 py-2 text-sm text-gray-100">
                {block.title}
              </td>
              <td className="px-4 py-2 text-sm text-right text-orange-300">
                {block.need.toFixed(0)}%
              </td>
              <td className="px-4 py-2 text-sm text-right text-emerald-300">
                {maturity.toFixed(0)}%
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
</section>
  {/* --------------------------------------------------
      Deep Dive nach Themenblock
     -------------------------------------------------- */}
  <section className="mt-12 ompa-page-break-before">
    <h2 className="text-2xl font-semibold text-gray-100 mb-4">
      Deep Dive nach Themenblock
    </h2>

    <p className="text-sm text-gray-400 mb-6">
      In diesem Abschnitt werden alle Themenblöcke einzeln betrachtet.
      Neben dem numerischen Handlungsbedarf und Reifegrad erhältst du
      eine kurze Einschätzung sowie eine konkrete Handlungsempfehlung
      je Block.
    </p>

    <div className="space-y-4 ompa-avoid-break-inside">
      {blocksByNeed.map((block, index) => {
        const maturity = 100 - block.need;
        const recommendation = getBlockRecommendation(
          block.title,
          block.need
        );

        let needLabel = "geringer Handlungsbedarf";
        if (block.need >= 70) {
          needLabel = "sehr hoher Handlungsbedarf";
        } else if (block.need >= 40) {
          needLabel = "mittlerer Handlungsbedarf";
        }

        return (
          <article
            key={block.index ?? index}
            className="rounded-2xl bg-slate-900/70 border border-slate-800 px-5 py-4"
          >
            <header className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-lg font-semibold text-gray-100">
                {block.index}. {block.title}
              </h3>
              <div className="flex flex-wrap gap-3 text-sm">
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-800/80 px-3 py-1 text-xs text-orange-200">
                  Handlungsbedarf:{" "}
                  <span className="font-semibold">
                    {block.need.toFixed(0)}%
                  </span>
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-800/80 px-3 py-1 text-xs text-emerald-200">
                  Reifegrad:{" "}
                  <span className="font-semibold">
                    {maturity.toFixed(0)}%
                  </span>
                </span>
              </div>
            </header>

            <p className="mt-3 text-sm text-gray-300">
              In diesem Themenblock besteht aktuell{" "}
              <span className="font-semibold">{needLabel}</span>. Ein
              Reifegrad von{" "}
              <span className="font-semibold">
                {maturity.toFixed(0)}%
              </span>{" "}
              zeigt, wie weit die bestehenden Maßnahmen bereits entwickelt
              sind.
            </p>

            <p className="mt-2 text-sm text-gray-300">
              <span className="font-semibold">Handlungsempfehlung:</span>{" "}
              {recommendation}
            </p>

            {/* Optional: kleiner Hinweis fürs PDF */}
            {pdfMode && (
              <p className="mt-2 text-xs text-gray-500">
                Hinweis: Die detaillierte Handlungsempfehlung zu diesem
                Themenblock besprichst du im Strategie-Gespräch mit ZweiMeter
                Consulting.
              </p>
            )}
          </article>
        );
      })}
    </div>
  </section>

  {/* Top 10 Handlungsfelder */}
  <section className="rounded-2xl border border-gray-800 bg-gray-950/80 p-6 space-y-4 ompa-page-break-before">
    <h2 className="text-[1.2rem] font-bold text-gray-100">
      Wichtigste Handlungsfelder (Top 10)
    </h2>

    <p className="text-[1rem] text-gray-400">
      Sortiert nach Handlungsbedarf (Antwort vs. Wichtigkeit/Priorität).
    </p>

    <div className="space-y-3 ompa-avoid-break-inside">
      {topRecommendations.map((item: any, index: number) => (
        <div
          key={`rec-${index}`}
          className="flex flex-col gap-1 rounded-xl bg-gray-900/70 border border-gray-800 px-4 py-3"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-800 text-sm font-semibold text-gray-100">
              {index + 1}
            </div>

            <div className="flex-1">
              <div className="text-sm font-semibold text-gray-100">
                Frage {item.questionNumber}: {item.questionText}
              </div>
              <div className="text-xs text-gray-400">
                Block: {item.blockTitle}
              </div>
            </div>
          </div>

          <div className="text-sm font-bold text-[#ffbb3b]">
            Handlungsbedarf {item.needScore}
          </div>
        </div>
      ))}
    </div>
  </section>

    </div>
  );
}
