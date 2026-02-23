// app/wizard/page.tsx

"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { WizardShell } from "@/components/wizard/wizardShell";
import { getVariantConfig } from "@/config/ompaVariants";

/**
 * Innere Komponente, die useSearchParams() verwenden darf.
 * Wird in <Suspense> eingebettet, wie von Next.js 16 gefordert.
 */
function WizardPageInner() {
  const searchParams = useSearchParams();
  const variantParam = searchParams.get("variant");
  const couponParam = searchParams.get("coupon");

  // Variante aus URL auslesen (Fallback: light)
  const variant = getVariantConfig(variantParam);

  return (
    <main className="min-h-screen bg-slate-950 text-gray-100">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-10">
        <header className="space-y-2">
          <p className="text-sm uppercase tracking-wide text-indigo-400">
            Schritt-für-Schritt-Analyse
          </p>

          <h1 className="text-2xl font-bold">
            {variant.label} – Online-Marketing-Potenzialanalyse
          </h1>

          <p className="text-sm text-gray-400">
            {variant.id === "light"
              ? "Beantworte 20 Kernfragen und erhalte deinen kostenlosen Schnellcheck."
              : "Beantworte die folgenden Fragen, um deinen aktuellen Online-Marketing-Status inklusive Handlungsbedarf und Reifegrad auszuwerten."}
          </p>
        </header>

        <section>
          <WizardShell variant={variant} initialCouponCode={couponParam} />
        </section>
      </div>
    </main>
  );
}

/**
 * Wizard-Seite mit Suspense-Boundary für useSearchParams().
 */
export default function WizardPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-slate-950 text-gray-100 flex items-center justify-center">
          <p className="text-sm text-gray-400">Wizard wird geladen…</p>
        </main>
      }
    >
      <WizardPageInner />
    </Suspense>
  );
}
