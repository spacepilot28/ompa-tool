// components/wizard/UpsellSection.tsx

"use client";

import { useVariant } from "../../context/VariantContext";

/**
 * Upsell-Sektion am Ende des Reports.
 * Zeigt variantenspezifische Upgrade-Möglichkeiten.
 */
export function UpsellSection() {
  const variant = useVariant();
  const { upsell } = variant;

  if (!upsell.enabled) return null;

  return (
    <section className="mt-12 rounded-2xl border-2 border-[#fbb03b]/40 bg-gradient-to-br from-[#fbb03b]/10 to-transparent p-6 space-y-4">
      {/* Premium-Accent-Line */}
      <div className="h-1 w-16 rounded-full bg-[#fbb03b]" />

      <h2 className="text-xl font-bold text-gray-100">
        {upsell.headline}
      </h2>

      <p className="text-base text-gray-300 leading-relaxed">
        {upsell.text}
      </p>

      <a
        href={upsell.ctaUrl}
        className="inline-flex items-center justify-center rounded-xl bg-[#fbb03b] px-6 py-3 text-base font-bold text-black hover:bg-[#fdd28a] transition-colors"
      >
        {upsell.ctaLabel}
      </a>

      {/* Vertrauens-Hinweis */}
      {variant.id === "light" && (
        <p className="text-xs text-gray-500">
          Bereits über 50 Unternehmen haben OMPA Medium genutzt, um ihre
          Online-Marketing-Strategie zu schärfen.
        </p>
      )}

      {variant.id === "medium" && (
        <p className="text-xs text-gray-500">
          Das Strategiegespräch ist persönlich, vertraulich und auf dein
          Unternehmen zugeschnitten – kein Standardprogramm.
        </p>
      )}
    </section>
  );
}
