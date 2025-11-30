// components/wizard/steps/TargetAudienceStep.tsx

"use client";

import type { TargetAudienceData } from "../../../types/wizard";

interface Props {
  value?: TargetAudienceData;
  errors?: Record<string, string>;
  onChange: (value: TargetAudienceData) => void;
}

export function TargetAudienceStep({ value, errors, onChange }: Props) {
  const v: TargetAudienceData = {
    mainPersonaName: "",
    ...value,
  };

  const updateField = <K extends keyof TargetAudienceData>(
    key: K,
    newValue: TargetAudienceData[K]
  ) => {
    onChange({
      ...v,
      [key]: newValue,
    });
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">
          Zielgruppen & Personas
        </h1>
        <p className="mt-2 text-sm text-gray-400">
          Fokussiere dich hier auf deine wichtigste Zielgruppe oder Hauptpersona.
          Es geht nicht um Perfektion, sondern darum, dass wir ein klares Bild
          von den Menschen bekommen, für die du Marketing machst.
        </p>
      </header>

      <div className="space-y-4">
        {/* Name / Label der Persona */}
        <div>
          <label className="block text-sm font-medium">
            Name der Hauptpersona / Zielgruppe *
          </label>
          <input
            type="text"
            value={v.mainPersonaName}
            onChange={(e) => updateField("mainPersonaName", e.target.value)}
            className="mt-1 w-full rounded-xl border border-gray-700 bg-gray-900 px-3 py-2 text-sm outline-none focus:border-indigo-500"
            placeholder="z.B. 'Marketing-Leiter:in im Mittelstand' oder 'HR-Manager:in DACH'"
          />
          {errors?.mainPersonaName && (
            <p className="mt-1 text-xs text-red-400">
              {errors.mainPersonaName}
            </p>
          )}
        </div>

        {/* Rolle / Jobtitel */}
        <div>
          <label className="block text-sm font-medium">
            Typische Rolle / Jobtitel
          </label>
          <input
            type="text"
            value={v.mainPersonaRole ?? ""}
            onChange={(e) => updateField("mainPersonaRole", e.target.value)}
            className="mt-1 w-full rounded-xl border border-gray-700 bg-gray-900 px-3 py-2 text-sm outline-none focus:border-indigo-500"
            placeholder="z.B. Marketing-Leitung, Geschäftsführer:in, HR-Manager:in …"
          />
        </div>

        {/* Branche */}
        <div>
          <label className="block text-sm font-medium">
            Typische Branche(n)
          </label>
          <input
            type="text"
            value={v.industry ?? ""}
            onChange={(e) => updateField("industry", e.target.value)}
            className="mt-1 w-full rounded-xl border border-gray-700 bg-gray-900 px-3 py-2 text-sm outline-none focus:border-indigo-500"
            placeholder="z.B. IT, Industrie, Agenturen, Coaching …"
          />
        </div>

        {/* Unternehmensgröße */}
        <div>
          <label className="block text-sm font-medium">
            Typische Unternehmensgröße
          </label>
          <input
            type="text"
            value={v.companySize ?? ""}
            onChange={(e) => updateField("companySize", e.target.value)}
            className="mt-1 w-full rounded-xl border border-gray-700 bg-gray-900 px-3 py-2 text-sm outline-none focus:border-indigo-500"
            placeholder="z.B. 10–50 MA, 50–250 MA, Konzern …"
          />
        </div>

        {/* Aufgaben / Verantwortungen */}
        <div>
          <label className="block text-sm font-medium">
            Wichtigste Aufgaben & Verantwortungen
          </label>
          <textarea
            value={v.responsibilities ?? ""}
            onChange={(e) => updateField("responsibilities", e.target.value)}
            className="mt-1 w-full rounded-xl border border-gray-700 bg-gray-900 px-3 py-2 text-sm outline-none focus:border-indigo-500"
            rows={3}
            placeholder="Wofür ist diese Person im Unternehmen verantwortlich?"
          />
        </div>

        {/* Ziele */}
        <div>
          <label className="block text-sm font-medium">
            Ziele dieser Persona
          </label>
          <textarea
            value={v.goals ?? ""}
            onChange={(e) => updateField("goals", e.target.value)}
            className="mt-1 w-full rounded-xl border border-gray-700 bg-gray-900 px-3 py-2 text-sm outline-none focus:border-indigo-500"
            rows={3}
            placeholder="Was möchte diese Person erreichen? Was wäre für sie ein Erfolg?"
          />
        </div>

        {/* Schmerzen / Probleme */}
        <div>
          <label className="block text-sm font-medium">
            Schmerzen / Probleme dieser Persona *
          </label>
          <textarea
            value={v.pains ?? ""}
            onChange={(e) => updateField("pains", e.target.value)}
            className="mt-1 w-full rounded-xl border border-gray-700 bg-gray-900 px-3 py-2 text-sm outline-none focus:border-indigo-500"
            rows={3}
            placeholder="Welche Probleme möchte diese Person unbedingt lösen?"
          />
          {errors?.pains && (
            <p className="mt-1 text-xs text-red-400">
              {errors.pains}
            </p>
          )}
        </div>

        {/* Kauf-Trigger */}
        <div>
          <label className="block text-sm font-medium">
            Typische Auslöser, wann sie aktiv wird
          </label>
          <textarea
            value={v.buyingTriggers ?? ""}
            onChange={(e) => updateField("buyingTriggers", e.target.value)}
            className="mt-1 w-full rounded-xl border border-gray-700 bg-gray-900 px-3 py-2 text-sm outline-none focus:border-indigo-500"
            rows={2}
            placeholder="Welche Situationen oder Ereignisse führen dazu, dass sie nach Lösungen sucht?"
          />
        </div>

        {/* Kaufkriterien & Einwände */}
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium">
              Wichtige Entscheidungs- / Einkaufskriterien
            </label>
            <textarea
              value={v.decisionCriteria ?? ""}
              onChange={(e) => updateField("decisionCriteria", e.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-700 bg-gray-900 px-3 py-2 text-sm outline-none focus:border-indigo-500"
              rows={3}
              placeholder="Worauf achtet sie besonders bei der Entscheidung?"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">
              Typische Einwände / Zweifel
            </label>
            <textarea
              value={v.objections ?? ""}
              onChange={(e) => updateField("objections", e.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-700 bg-gray-900 px-3 py-2 text-sm outline-none focus:border-indigo-500"
              rows={3}
              placeholder="Warum entscheidet sie sich manchmal gegen dich oder grundsätzlich gegen eine Lösung?"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
