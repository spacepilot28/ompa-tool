// utils/calcResults.ts

import type { WizardState } from "../types/wizard";
import type { OmpaBlock } from "../config/ompaBlocks";

//
// 1. Handlungsbedarf einer Frage
//
export function calculateQuestionScore(
  answer: number,
  priority: number
): number {
  const a = Math.max(0, Math.min(100, answer ?? 0));
  const p = Math.max(1, Math.min(4, priority ?? 1));
  return (100 - a) * p;
}

//
// 2. Block-Score (Handlungsbedarf in %)
//
export function calculateBlockScore(
  block: OmpaBlock,
  state: WizardState
) {
  let total = 0;
  let max = 0;

  for (const q of block.questions) {
    const answer = state.answers[q.nr] ?? 0;
    const priority = state.priorities[q.nr] ?? q.defaultPriority;

    const score = calculateQuestionScore(answer, priority);

    total += score;
    max += 100 * 4; // max Score pro Frage
  }

  const percent = max > 0 ? Math.round((total / max) * 100) : 0; // 0–100 Handlungsbedarf

  return {
    total,
    percent,
  };
}

//
// 3. OMPA Gesamtscore (Durchschnitt aller Block-Handlungsbedarfe)
//
export function calculateOverallScore(blockResults: { percent: number }[]) {
  if (!blockResults.length) return 0;
  const avg =
    blockResults.reduce((acc, b) => acc + b.percent, 0) /
    blockResults.length;

  return Math.round(avg);
}

//
// 4. Ranking aller Fragen nach Handlungsbedarf
//
export function getTopRecommendations(blocks: OmpaBlock[], state: WizardState) {
  const list: {
    nr: number;
    text: string;
    blockTitle: string;
    score: number;
  }[] = [];

  for (const block of blocks) {
    for (const q of block.questions) {
      const answer = state.answers[q.nr] ?? 0;
      const priority = state.priorities[q.nr] ?? q.defaultPriority;

      const score = calculateQuestionScore(answer, priority);

      list.push({
        nr: q.nr,
        text: q.text,
        blockTitle: block.title,
        score,
      });
    }
  }

  // absteigend nach Handlungsbedarf sortieren
  return list.sort((a, b) => b.score - a.score).slice(0, 10);
}
// utils/calcResults.ts

interface BlockResult {
  id: string;
  index: number;
  title: string;
  percent: number;
}

/**
 * Ermittelt die Rundheit (Balance) des Profils.
 * stdDev = Streuung der Block-Handlungsbedarfe
 * balanceScore = Normierung 0–100 (100 = perfekt rund)
 */
export function getProfileBalance(blockResults: BlockResult[]) {
  if (!blockResults.length) {
    return {
      stdDev: 0,
      balanceScore: 100,
      label: "Keine Daten",
      description: "Für eine Auswertung der Rundheit werden mehrere Themenblöcke benötigt.",
    };
  }

  const values = blockResults.map(b =>
    Math.min(100, Math.max(0, b.percent ?? 0))
  );

  const mean = values.reduce((s, x) => s + x, 0) / values.length;

  const variance =
    values.reduce((s, x) => s + Math.pow(x - mean, 2), 0) / values.length;

  const stdDev = Math.sqrt(variance);

  const balanceRaw = 100 - stdDev * 2; 
  const balanceScore = Math.max(0, Math.min(100, Math.round(balanceRaw)));

  let label = "";
  let description = "";

  if (stdDev < 10) {
    label = "Sehr ausgewogenes Profil";
    description =
      "Deine Themenblöcke sind sehr gleichmäßig ausgeprägt. Du hast kaum starke Ausreißer im Online-Marketing.";
  } else if (stdDev < 20) {
    label = "Mittel ausgewogen";
    description =
      "Einige Bereiche sind schwächer als andere – das Profil ist etwas unausgeglichen.";
  } else {
    label = "Stark unausgewogenes Profil";
    description =
      "Große Unterschiede zwischen den Themenblöcken. Einige Bereiche sind deutlich schlechter entwickelt.";
  }

  return {
    stdDev: Math.round(stdDev),
    balanceScore,
    label,
    description,
  };
}
