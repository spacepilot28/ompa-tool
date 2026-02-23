// components/wizard/PaymentGate.tsx

"use client";

import { useState } from "react";
import { useVariant } from "../../context/VariantContext";
import type { WizardState } from "../../types/wizard";
import {
  findCoupon,
  calculateDiscountedPrice,
  formatPrice,
  type CouponConfig,
} from "../../config/ompaCoupons";

interface Props {
  state: WizardState;
  onPaymentComplete: (sessionId: string) => void;
  onCouponChange?: (code: string | null) => void;
}

export function PaymentGate({ state, onPaymentComplete, onCouponChange }: Props) {
  const variant = useVariant();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Coupon-Eingabe
  const [couponInput, setCouponInput] = useState(state.couponCode ?? "");
  const [appliedCoupon, setAppliedCoupon] = useState<CouponConfig | null>(
    state.couponCode ? findCoupon(state.couponCode, variant.id) : null
  );
  const [couponError, setCouponError] = useState<string | null>(null);

  // Preisberechnung
  const listPrice = variant.listPriceNet;
  const effectivePrice = calculateDiscountedPrice(listPrice, appliedCoupon);
  const hasDiscount = appliedCoupon !== null && effectivePrice < listPrice;
  const isFree = effectivePrice <= 0;

  // Coupon einlösen
  const handleApplyCoupon = () => {
    setCouponError(null);

    if (!couponInput.trim()) {
      setCouponError("Bitte gib einen Coupon-Code ein.");
      return;
    }

    const coupon = findCoupon(couponInput.trim(), variant.id);
    if (!coupon) {
      setCouponError(
        "Dieser Coupon-Code ist ungültig oder nicht für diese Variante gültig."
      );
      return;
    }

    setAppliedCoupon(coupon);
    onCouponChange?.(coupon.code);
  };

  // Coupon entfernen
  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput("");
    setCouponError(null);
    onCouponChange?.(null);
  };

  // Stripe-Checkout starten
  const handleCheckout = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          variantId: variant.id,
          priceNet: listPrice,
          couponCode: appliedCoupon?.code ?? null,
          stripeCouponId: appliedCoupon?.stripeCouponId ?? null,
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Fehler beim Erstellen der Checkout-Session.");
      }

      const data = await response.json();

      if (data.url) {
        // Wizard-State im SessionStorage sichern
        sessionStorage.setItem("ompa_wizard_state", JSON.stringify(state));
        sessionStorage.setItem("ompa_variant", variant.id);

        window.location.href = data.url;
      } else {
        throw new Error("Keine Checkout-URL erhalten.");
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Unbekannter Fehler.";
      setError(message);
      setIsLoading(false);
    }
  };

  // Bei 100%-Coupon: Direkt freischalten (kein Stripe nötig)
  const handleFreeUnlock = () => {
    onPaymentComplete(`coupon_free_${appliedCoupon?.code}_${Date.now()}`);
  };

  // Bereits bezahlt? Erfolgsanzeige.
  if (state.gateCompleted) {
    return (
      <div className="space-y-4 text-center">
        <div className="text-4xl">✓</div>
        <h2 className="text-xl font-bold text-emerald-400">
          {isFree ? "Report freigeschaltet" : "Zahlung erfolgreich"}
        </h2>
        <p className="text-gray-300">
          Dein Report wird jetzt erstellt. Klicke auf „Weiter", um dein
          Ergebnis zu sehen.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-100">
          Report freischalten
        </h1>
        <p className="mt-2 text-base text-gray-300">
          Du hast alle Fragen beantwortet – großartig. Jetzt fehlt nur noch
          ein Schritt, um deinen vollständigen {variant.label}-Report zu erhalten.
        </p>
      </div>

      {/* Produkt-Info-Box */}
      <div className="rounded-2xl border border-gray-700 bg-gray-900/50 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-100">{variant.label}</h2>
            <p className="text-sm text-gray-400">{variant.subtitle}</p>
          </div>
          <div className="text-right">
            {hasDiscount && (
              <div className="text-sm text-gray-500 line-through">
                {variant.listPriceLabel}
              </div>
            )}
            <div className="text-2xl font-bold text-[#fbb03b]">
              {isFree ? "Kostenlos" : formatPrice(effectivePrice)}
            </div>
            {hasDiscount && (
              <div className="text-xs text-emerald-400 font-semibold">
                {appliedCoupon!.label}
              </div>
            )}
          </div>
        </div>

        <hr className="border-gray-700" />

        {/* Leistungsumfang */}
        <ul className="space-y-2 text-sm text-gray-300">
          {variant.report.radarChart && (
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 mt-0.5">✓</span>
              <span>Vollständiges Radar-Diagramm über alle 10 Themenbereiche</span>
            </li>
          )}
          {variant.report.deepDivePerBlock && (
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 mt-0.5">✓</span>
              <span>Detaillierte Auswertung mit Handlungsempfehlung pro Block</span>
            </li>
          )}
          {variant.report.benchmark && (
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 mt-0.5">✓</span>
              <span>Branchenvergleich mit ähnlichen Unternehmen</span>
            </li>
          )}
          {variant.report.topRecommendations && (
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 mt-0.5">✓</span>
              <span>Top {variant.report.maxRecommendations} priorisierte Handlungsfelder</span>
            </li>
          )}
          {variant.report.pdfExport && (
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 mt-0.5">✓</span>
              <span>PDF-Report zum Download</span>
            </li>
          )}
          {variant.report.calendlyEmbed && (
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 mt-0.5">✓</span>
              <span>60-Minuten-Strategiegespräch mit Robert Sonnenberger</span>
            </li>
          )}
          {variant.report.strategieMemoHint && (
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 mt-0.5">✓</span>
              <span>Individuelles Strategiememo nach dem Gespräch</span>
            </li>
          )}
        </ul>
      </div>

      {/* ── Coupon-Eingabe ── */}
      <div className="rounded-xl border border-gray-700 bg-gray-900/30 p-4 space-y-3">
        <p className="text-sm font-medium text-gray-300">
          Hast du einen Rabatt-Code?
        </p>

        {appliedCoupon ? (
          <div className="flex items-center justify-between rounded-lg bg-emerald-900/30 border border-emerald-700/50 px-4 py-2">
            <div>
              <span className="text-sm font-semibold text-emerald-300">
                „{appliedCoupon.code}" – {appliedCoupon.label}
              </span>
            </div>
            <button
              type="button"
              onClick={handleRemoveCoupon}
              className="text-xs text-gray-400 hover:text-red-400 transition-colors"
            >
              Entfernen
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <input
              type="text"
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
              placeholder="Coupon-Code eingeben"
              className="flex-1 rounded-lg border border-gray-600 bg-gray-900/50 px-3 py-2 text-sm text-gray-100 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#fbb03b]/50"
            />
            <button
              type="button"
              onClick={handleApplyCoupon}
              className="rounded-lg border border-gray-600 px-4 py-2 text-sm font-medium text-gray-200 hover:border-[#fbb03b] hover:text-[#fbb03b] transition-colors"
            >
              Einlösen
            </button>
          </div>
        )}

        {couponError && (
          <p className="text-sm text-red-400">{couponError}</p>
        )}
      </div>

      {/* Fehler-Anzeige */}
      {error && (
        <div className="rounded-xl border border-red-800 bg-red-900/30 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {/* ── Checkout- oder Freischalt-Button ── */}
      {isFree ? (
        <button
          type="button"
          onClick={handleFreeUnlock}
          className="w-full rounded-xl bg-emerald-600 px-6 py-4 text-lg font-bold text-white hover:bg-emerald-500 transition-colors"
        >
          Report kostenlos freischalten
        </button>
      ) : (
        <button
          type="button"
          onClick={handleCheckout}
          disabled={isLoading}
          className="w-full rounded-xl bg-[#fbb03b] px-6 py-4 text-lg font-bold text-black hover:bg-[#fdd28a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading
            ? "Wird weitergeleitet…"
            : `Jetzt ${formatPrice(effectivePrice)} bezahlen`}
        </button>
      )}

      <p className="text-xs text-gray-500 text-center">
        {isFree
          ? "Kein Zahlungsvorgang nötig. Dein Report wird sofort erstellt."
          : "Sichere Bezahlung über Stripe. Du erhältst eine Rechnung per E-Mail. Alle Preise zzgl. MwSt."}
      </p>
    </div>
  );
}
