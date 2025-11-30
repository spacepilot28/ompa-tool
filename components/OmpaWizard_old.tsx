"use client";

import { useMemo, useState } from "react";
import questionsData from "../data/ompa_questions_v2.json";
import type { OmpaQuestion, Dimension } from "../types/ompa";

const allQuestions = questionsData as OmpaQuestion[];

type AnswersMap = Record<string, number | null>;

interface Block {
  id: string;
  title: string;
  questions: OmpaQuestion[];
}

const dimensionOrder: Dimension[] = [
  "strategie",
  "content",
  "kundenpotenzial",
  "marketing_kanaele",
  "email_automation",
  "analytics_funnel",
  "akquisewege",
  "verkaufskompetenzen",
  "vertriebs_skills",
  "vertriebsengpass",
];

function buildBlocks(qs: OmpaQuestion[]): Block[] {
  const map = new Map<string, Block>();

  qs.forEach((q) => {
    const existing = map.get(q.blockId);
    if (existing) {
      existing.questions.push(q);
    } else {
      map.set(q.blockId, {
        id: q.blockId,
        title: q.blockTitle,
        questions: [q],
      });
    }
  });

  const blocks = Array.from(map.values());
  blocks.forEach((b) => b.questions.sort((a, b) => a.number - b.number));
  blocks.sort((a, b) => a.questions[0].number - b.questions[0].number);

  return blocks;
}

function calcDimensionScore(
  dim: Dimension,
  questions: OmpaQuestion[],
  answers: AnswersMap
): number | null {
  const qs = questions.filter((q) => q.dimension === dim);
  let sumWeighted = 0;
  let sumMax = 0;

  qs.forEach((q) => {
    const val = answers[q.id];
    if (val === null || val === undefined) return;
    sumWeighted += val * q.weight;
    sumMax += q.scaleMax * q.weight;
  });

  if (sumMax === 0) return null;
  return (sumWeighted / sumMax) * 100;
}

function classifyScore(score: number | null): "red" | "yellow" | "green" | null {
  if (score === null) return null;
  if (score < 40) return "red";
  if (score < 70) return "yellow";
  return "green";
}

const OmpaWizard: React.FC = () => {
  const blocks = useMemo(() => buildBlocks(allQuestions), []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswersMap>(() => {
    const initial: AnswersMap = {};
    allQuestions.forEach((q) => {
      initial[q.id] = null;
    });
    return initial;
  });
  const [showResults, setShowResults] = useState(false);

  const currentBlock = blocks[currentIndex];

  const handleAnswerChange = (questionId: string, value: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handlePrev = () => {
    setShowResults(false);
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setShowResults(false);
    setCurrentIndex((prev) => Math.min(blocks.length - 1, prev + 1));
  };

  const handleShowResults = () => {
    setShowResults(true);
  };

  const dimensionScores = useMemo(() => {
    const result: Record<Dimension, number | null> = {} as any;
    dimensionOrder.forEach((dim) => {
      result[dim] = calcDimensionScore(dim, allQuestions, answers);
    });
    return result;
  }, [answers]);

  return (
    <div style={{ marginTop: "2rem", marginBottom: "4rem" }}>
      <h2>
        Schritt {currentIndex + 1} von {blocks.length}: {currentBlock.title}
      </h2>

      <p style={{ marginBottom: "1rem" }}>
        Bitte bewerte jede Aussage von 0 (trifft überhaupt nicht zu) bis 4
        (trifft voll zu).
      </p>

      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: 8,
          padding: "1.5rem",
          marginBottom: "1.5rem",
        }}
      >
        {currentBlock.questions.map((q) => {
          const options = [];
          for (let v = q.scaleMin; v <= q.scaleMax; v++) {
            options.push(v);
          }

          return (
            <div
              key={q.id}
              style={{
                marginBottom: "1.25rem",
                paddingBottom: "1rem",
                borderBottom: "1px solid #f0f0f0",
              }}
            >
              <div style={{ fontWeight: 600, marginBottom: "0.5rem" }}>
                {q.number}. {q.text}
              </div>

              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                {options.map((val) => (
                  <label key={val} style={{ fontSize: "0.9rem" }}>
                    <input
                      type="radio"
                      name={q.id}
                      value={val}
                      checked={answers[q.id] === val}
                      onChange={() => handleAnswerChange(q.id, val)}
                      style={{ marginRight: "0.25rem" }}
                    />
                    {val} – {q.scaleLabels[String(val)]}
                  </label>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
        <button
          type="button"
          onClick={handlePrev}
          disabled={currentIndex === 0}
        >
          ◀ Zurück
        </button>

        {currentIndex < blocks.length - 1 && (
          <button type="button" onClick={handleNext}>
            Weiter ▶
          </button>
        )}

        {currentIndex === blocks.length - 1 && (
          <button type="button" onClick={handleShowResults}>
            Ergebnisse anzeigen
          </button>
        )}
      </div>

      {showResults && (
        <div
          style={{
            borderTop: "1px solid #ddd",
            paddingTop: "1.5rem",
            marginTop: "1.5rem",
          }}
        >
          <h3>Auswertung (erste Version)</h3>
          <p>
            Die folgenden Werte sind Prozentwerte (0–100) pro Bereich. Später
            können wir hier ein Radar-Chart einbauen.
          </p>

          <ul>
            {dimensionOrder.map((dim) => {
              const score = dimensionScores[dim];
              const color = classifyScore(score);
              const label =
                dim === "strategie"
                  ? "Strategie & Ausrichtung"
                  : dim === "content"
                  ? "Content & Inbound"
                  : dim === "kundenpotenzial"
                  ? "Kundenpotenzial & Markt"
                  : dim === "marketing_kanaele"
                  ? "Marketing-Kanäle"
                  : dim === "email_automation"
                  ? "E-Mail & Automation"
                  : dim === "analytics_funnel"
                  ? "Analytics & Funnel"
                  : dim === "akquisewege"
                  ? "Akquisitionswege"
                  : dim === "verkaufskompetenzen"
                  ? "Verkaufskompetenzen"
                  : dim === "vertriebs_skills"
                  ? "Vertriebsskills"
                  : "Vertriebsengpässe";

              if (score === null) {
                return (
                  <li key={dim}>
                    {label}: <em>keine Daten</em>
                  </li>
                );
              }

              const scoreText = `${score.toFixed(1)} %`;
              const colorText =
                color === "red"
                  ? "🔴 Engpass"
                  : color === "yellow"
                  ? "🟡 Ausbaupotenzial"
                  : "🟢 Stärke";

              return (
                <li key={dim}>
                  <strong>{label}:</strong> {scoreText} – {colorText}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default OmpaWizard;
