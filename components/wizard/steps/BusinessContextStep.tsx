// components/wizard/steps/BusinessContextStep.tsx

"use client";

import type { BusinessContextData } from "../../../types/wizard";

interface Props {
  value?: BusinessContextData;
  errors?: Record<string, string>;
  onChange: (value: BusinessContextData) => void;
}

export function BusinessContextStep({ value, errors, onChange }: Props) {
  const v: BusinessContextData = {
    companyName: "",
    offerShort: "",
    businessType: "b2b",
    ...value,
  };

  const updateField = <K extends keyof BusinessContextData>(
    key: K,
    newValue: BusinessContextData[K]
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
          Business-Kontext
        </h1>
        <p className="mt-2 text-sm text-gray-400">
          Beschreibe kurz dein Unternehmen und dein Angebot. Es geht nicht um
          perfekte Formulierungen, sondern um ein klares Bild.
        </p>
      </header>

      <div className="space-y-4">
        {/* Unternehmensname */}
        <div>
          <label className="block text-sm font-medium">
            Unternehmensname *
          </label>
          <input
            type="text"
            value={v.companyName}
            onChange={(e) => updateField("companyName", e.target.value)}
            className="mt-1 w-full rounded-xl border border-gray-700 bg-gray-900 px-3 py-2 text-sm outline-none focus:border-indigo-500"
            placeholder="z.B. Zweimeter.consulting"
          />
          {errors?.companyName && (
            <p className="mt-1 text-xs text-red-400">
              {errors.companyName}
            </p>
          )}
        </div>

        {/* Website */}
        <div>
          <label className="block text-sm font-medium">
            Website (optional)
          </label>
          <input
            type="url"
            value={v.website ?? ""}
            onChange={(e) => updateField("website", e.target.value)}
            className="mt-1 w-full rounded-xl border border-gray-700 bg-gray-900 px-3 py-2 text-sm outline-none focus:border-indigo-500"
            placeholder="https://deine-domain.tld"
          />
        </div>

        {/* Branche */}
        <div>
          <label className="block text-sm font-medium">
            Branche / Markt (optional)
          </label>
          <input
            type="text"
            value={v.industry ?? ""}
            onChange={(e) => updateField("industry", e.target.value)}
            className="mt-1 w-full rounded-xl border border-gray-700 bg-gray-900 px-3 py-2 text-sm outline-none focus:border-indigo-500"
            placeholder="z.B. B2B SaaS, Coaching, Industrie …"
          />
        </div>

        {/* Angebot */}
        <div>
          <label className="block text-sm font-medium">
            Kurzbeschreibung deines Angebots *
          </label>
          <textarea
            value={v.offerShort}
            onChange={(e) => updateField("offerShort", e.target.value)}
            className="mt-1 w-full rounded-xl border border-gray-700 bg-gray-900 px-3 py-2 text-sm outline-none focus:border-indigo-500"
            rows={3}
            placeholder="Was bietest du an? Für wen? Welches Problem löst du?"
          />
          {errors?.offerShort && (
            <p className="mt-1 text-xs text-red-400">
              {errors.offerShort}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
