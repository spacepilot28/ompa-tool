// config/ompaCoupons.ts

import type { OmpaVariantId } from "../types/variant";

/**
 * Konfiguration eines einzelnen Rabattcoupons.
 *
 * Jeder Coupon hat einen eindeutigen Code, der als URL-Parameter
 * oder im Payment-Gate eingegeben werden kann.
 *
 * Beispiel-URL: /wizard?variant=light&coupon=Free
 * Beispiel-URL: /wizard?variant=medium&coupon=Sechzig
 */
export interface CouponConfig {
  /** Coupon-Code (case-insensitive bei Eingabe, hier in kanonischer Form) */
  code: string;

  /** Menschenlesbare Bezeichnung */
  label: string;

  /** Rabatt in Prozent (0–100) */
  discountPercent: number;

  /** Für welche Varianten ist dieser Coupon gültig? */
  validForVariants: OmpaVariantId[];

  /**
   * Stripe Coupon-ID (wird im Stripe-Dashboard angelegt).
   * Muss exakt mit der ID in Stripe übereinstimmen.
   * Bei 100%-Coupons wird kein Stripe-Checkout aufgerufen.
   */
  stripeCouponId: string;

  /** Ist dieser Coupon aktuell aktiv? */
  active: boolean;
}

/**
 * Alle verfügbaren Coupons.
 *
 * Die Coupon-Codes werden im Stripe-Dashboard als "Promotion Codes"
 * oder "Coupons" angelegt. Die stripeCouponId muss mit der Stripe-ID
 * übereinstimmen.
 *
 * Preisberechnung:
 *   Endpreis = Listenpreis × (1 - discountPercent / 100)
 *
 * Beispiel Light mit "Free":
 *   29,95 € × (1 - 100/100) = 0,00 € → E-Mail-Gate statt Stripe
 *
 * Beispiel Medium mit "Sechzig":
 *   149,95 € × (1 - 66/100) = 50,98 € → gerundet auf 49,95 € in Stripe
 *   (Stripe-Preis wird fest definiert, nicht berechnet)
 */
export const OMPA_COUPONS: CouponConfig[] = [
  // ── Light-Coupons ──
  {
    code: "Free",
    label: "100 % Rabatt – kostenlos",
    discountPercent: 100,
    validForVariants: ["light", "medium", "heavy"],
    stripeCouponId: "OMPA_FREE",
    active: true,
  },
  {
    code: "Fünfzig",
    label: "50 % Rabatt",
    discountPercent: 50,
    validForVariants: ["light"],
    stripeCouponId: "OMPA_LIGHT_50",
    active: true,
  },

  // ── Medium-Coupons ──
  {
    code: "Dreißig",
    label: "30 % Rabatt",
    discountPercent: 30,
    validForVariants: ["medium", "heavy"],
    stripeCouponId: "OMPA_30",
    active: true,
  },
  {
    code: "Sechzig",
    label: "66 % Rabatt",
    discountPercent: 66,
    validForVariants: ["medium", "heavy"],
    stripeCouponId: "OMPA_66",
    active: true,
  },
];

/**
 * Sucht einen Coupon anhand des Codes (case-insensitive).
 * Gibt null zurück, wenn der Code ungültig, inaktiv oder
 * nicht für die angegebene Variante gültig ist.
 */
export function findCoupon(
  code: string | null | undefined,
  variantId: OmpaVariantId
): CouponConfig | null {
  if (!code) return null;

  const normalized = code.trim();
  const coupon = OMPA_COUPONS.find(
    (c) => c.code.toLowerCase() === normalized.toLowerCase()
  );

  if (!coupon) return null;
  if (!coupon.active) return null;
  if (!coupon.validForVariants.includes(variantId)) return null;

  return coupon;
}

/**
 * Berechnet den effektiven Preis nach Coupon-Anwendung.
 * Gibt den Listenpreis zurück, wenn kein gültiger Coupon vorliegt.
 */
export function calculateDiscountedPrice(
  listPriceNet: number,
  coupon: CouponConfig | null
): number {
  if (!coupon) return listPriceNet;
  const discounted = listPriceNet * (1 - coupon.discountPercent / 100);
  // Auf 2 Dezimalstellen runden
  return Math.round(discounted * 100) / 100;
}

/**
 * Prüft, ob bei einem gegebenen Coupon eine Stripe-Zahlung nötig ist.
 * Bei 100%-Coupons entfällt die Zahlung komplett.
 */
export function isPaymentRequired(
  listPriceNet: number,
  coupon: CouponConfig | null
): boolean {
  return calculateDiscountedPrice(listPriceNet, coupon) > 0;
}

/**
 * Formatiert einen Preis für die Anzeige (deutsches Format).
 */
export function formatPrice(priceNet: number): string {
  if (priceNet <= 0) return "Kostenlos";
  return (
    priceNet.toLocaleString("de-DE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) + " € netto"
  );
}
