// components/wizard/OmpaSliderQuestion.tsx

"use client";

import type { OmpaQuestion } from "../../config/ompaBlocks";

interface Props {
  question: OmpaQuestion;
  value?: number;                            // 0–100
  priority?: 1 | 2 | 3 | 4;                  // kundenspezifische Wichtigkeit
  onChange: (value: number) => void;
  onChangePriority: (value: 1 | 2 | 3 | 4) => void;
}

export function OmpaSliderQuestion({
  question,
  value,
  priority,
  onChange,
  onChangePriority,
}: Props) {
  const current = value ?? 0;
  const effectivePriority: 1 | 2 | 3 | 4 =
    priority ?? question.defaultPriority ?? 1;

  return (
    <div className="space-y-6 border-b border-gray-800 pb-8 last:border-0">
      {/* Frage */}
      <div>
        <div className="ompa-question-text font-semibold text-gray-100">
          {question.nr}. {question.text}
        </div>
      </div>

      {/* Slider + Skala */}
      <div>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={current}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-full"
          />
          <div className="w-14 text-right font-bold text-[#fbb03b] text-lg">
            {current}
          </div>
        </div>

        {/* Skala mit 1.0rem Schriftgröße */}
        <div className="mt-3 grid grid-cols-5 text-gray-400 gap-3 text-[1rem] leading-tight">
          <div>
            <div className="ompa-scale-number font-bold text-gray-200">0</div>
            <div>trifft gar nicht zu</div>
          </div>

          <div>
            <div className="ompa-scale-number font-bold text-gray-200">25</div>
            <div>trifft eher nicht zu</div>
          </div>

          <div className="text-center">
            <div className="ompa-scale-number font-bold text-gray-200">50</div>
            <div>teils / teils</div>
          </div>

          <div className="text-right">
            <div className="ompa-scale-number font-bold text-gray-200">75</div>
            <div>trifft überwiegend zu</div>
          </div>

          <div className="text-right">
            <div className="ompa-scale-number font-bold text-gray-200">100</div>
            <div>trifft voll zu</div>
          </div>
        </div>
      </div>

      {/* Wichtigkeitsfrage + Buttons */}
      <div>
        <div className="text-gray-300 text-base mb-2">
          Wie wichtig bzw. relevant ist dieses Thema für dich zur Zeit?
        </div>

        <div className="flex gap-2 mb-2">
          {[1, 2, 3, 4].map((p) => {
            const selected = p === effectivePriority;
            return (
              <button
                key={p}
                type="button"
                onClick={() => onChangePriority(p as 1 | 2 | 3 | 4)}
                className={[
                  "px-4 py-1 rounded-full text-sm font-semibold border transition-all",
                  selected
                    ? "bg-[#fbb03b] text-black border-[#fbb03b]"
                    : "bg-transparent text-gray-200 border-gray-600 hover:border-[#fbb03b]",
                ].join(" ")}
              >
                {p}
              </button>
            );
          })}
        </div>

        {/* Standard-Priorität JETZT unter der Wichtigkeitsfrage */}
        <div className="text-gray-400 text-sm">
          Standard-Priorität laut OMPA:{" "}
          <span className="font-semibold">{question.defaultPriority}</span>{" "}
          (1 = unwichtig / unrelevant, 4 = sehr wichtig / hohe Relevanz)
        </div>
      </div>
    </div>
  );
}
