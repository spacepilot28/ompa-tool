// app/api/create-checkout/route.ts

import type { NextRequest } from "next/server";

export const runtime = "nodejs";

/**
 * POST /api/create-checkout
 *
 * Erstellt eine Stripe Checkout Session für OMPA Light, Medium oder Heavy.
 *
 * Erwartet im Body:
 * - variantId: "light" | "medium" | "heavy"
 * - couponCode: string | null (Coupon-Code für Rabatt)
 * - stripeCouponId: string | null (Stripe-Coupon-ID)
 *
 * Umgebungsvariablen:
 * - STRIPE_SECRET_KEY
 * - STRIPE_PRICE_ID_LIGHT   (29,95 €)
 * - STRIPE_PRICE_ID_MEDIUM  (149,95 €)
 * - STRIPE_PRICE_ID_HEAVY   (499,95 €)
 *
 * Stripe-Dashboard Coupons (IDs müssen exakt übereinstimmen):
 * - OMPA_FREE       → 100 % Rabatt (alle Varianten)
 * - OMPA_LIGHT_50   → 50 %  Rabatt (Light)
 * - OMPA_30         → 30 %  Rabatt (Medium, Heavy)
 * - OMPA_66         → 66 %  Rabatt (Medium, Heavy)
 */

interface CheckoutRequestBody {
  variantId: string;
  couponCode?: string | null;
  stripeCouponId?: string | null;
}

export async function POST(request: NextRequest) {
  try {
    const body: CheckoutRequestBody = await request.json();
    const { variantId, couponCode, stripeCouponId } = body;

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

    if (!stripeSecretKey) {
      console.warn("[STRIPE] STRIPE_SECRET_KEY nicht gesetzt.");

      // ─── Entwicklungsmodus: Stripe simulieren ───
      if (process.env.NODE_ENV === "development") {
        console.log(
          `[STRIPE-DEV] Simuliert: ${variantId}` +
            (couponCode ? ` + Coupon "${couponCode}"` : "")
        );
        const origin = new URL(request.url).origin;
        return new Response(
          JSON.stringify({
            url: `${origin}/wizard?variant=${variantId}&payment=success&session_id=dev_sim_${Date.now()}`,
            sessionId: `dev_sim_${Date.now()}`,
            mode: "simulated",
          }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ error: "Bezahlung ist aktuell nicht verfügbar." }),
        { status: 503, headers: { "Content-Type": "application/json" } }
      );
    }

    // ─── Stripe Checkout Session erstellen ───
    //
    // Aktivieren, sobald `npm install stripe` ausgeführt wurde:
    //
    // import Stripe from "stripe";
    // const stripe = new Stripe(stripeSecretKey);
    //
    // const priceIdMap: Record<string, string | undefined> = {
    //   light: process.env.STRIPE_PRICE_ID_LIGHT,
    //   medium: process.env.STRIPE_PRICE_ID_MEDIUM,
    //   heavy: process.env.STRIPE_PRICE_ID_HEAVY,
    // };
    //
    // const priceId = priceIdMap[variantId];
    // if (!priceId) {
    //   return new Response(
    //     JSON.stringify({ error: `Preis-ID für "${variantId}" nicht konfiguriert.` }),
    //     { status: 500, headers: { "Content-Type": "application/json" } }
    //   );
    // }
    //
    // const origin = new URL(request.url).origin;
    //
    // const sessionParams: Stripe.Checkout.SessionCreateParams = {
    //   payment_method_types: ["card", "sepa_debit"],
    //   line_items: [{ price: priceId, quantity: 1 }],
    //   mode: "payment",
    //   success_url: `${origin}/wizard?variant=${variantId}&payment=success&session_id={CHECKOUT_SESSION_ID}`,
    //   cancel_url: `${origin}/wizard?variant=${variantId}&payment=cancelled`,
    //   locale: "de",
    //   metadata: {
    //     ompa_variant: variantId,
    //     coupon_code: couponCode ?? "",
    //   },
    //   ...(stripeCouponId
    //     ? { discounts: [{ coupon: stripeCouponId }] }
    //     : { allow_promotion_codes: true }),
    // };
    //
    // const session = await stripe.checkout.sessions.create(sessionParams);
    //
    // return new Response(
    //   JSON.stringify({ url: session.url, sessionId: session.id }),
    //   { status: 200, headers: { "Content-Type": "application/json" } }
    // );

    return new Response(
      JSON.stringify({ error: "Stripe-Integration wird eingerichtet." }),
      { status: 501, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[STRIPE] Checkout-Fehler:", error);
    return new Response(
      JSON.stringify({ error: "Fehler beim Erstellen der Checkout-Session." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
