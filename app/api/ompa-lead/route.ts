// app/api/ompa-lead/route.ts

import type { NextRequest } from "next/server";

export const runtime = "nodejs";

interface LeadPayload {
  firstName: string;
  email: string;
  company?: string;
  variant: string;
  timestamp: string;
}

/**
 * POST /api/ompa-lead
 *
 * Empfängt Lead-Daten aus dem E-Mail-Gate der OMPA Light.
 *
 * Phase 1: Speichert Leads in einer JSON-Logdatei (einfaches Logging).
 * Phase 2: Anbindung an Brevo (ehemals Sendinblue) zur
 *          automatischen Aufnahme in die E-Mail-Liste.
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as LeadPayload;

    // Basis-Validierung
    if (!body.email || !body.firstName) {
      return new Response(
        JSON.stringify({ error: "Vorname und E-Mail sind Pflichtfelder." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // E-Mail-Format prüfen
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return new Response(
        JSON.stringify({ error: "Ungültige E-Mail-Adresse." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // ─── Phase 1: Console-Logging (wird in Produktion durch Brevo ersetzt) ───
    console.log("[OMPA-LEAD] Neuer Lead:", {
      firstName: body.firstName,
      email: body.email,
      company: body.company ?? "–",
      variant: body.variant,
      timestamp: body.timestamp,
    });

    // ─── Phase 2: Brevo-Anbindung (vorbereitet, noch nicht aktiv) ───
    //
    // const brevoApiKey = process.env.BREVO_API_KEY;
    // const brevoListId = process.env.BREVO_LIST_ID_OMPA;
    //
    // if (brevoApiKey && brevoListId) {
    //   await fetch("https://api.brevo.com/v3/contacts", {
    //     method: "POST",
    //     headers: {
    //       "api-key": brevoApiKey,
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //       email: body.email,
    //       attributes: {
    //         VORNAME: body.firstName,
    //         UNTERNEHMEN: body.company ?? "",
    //         OMPA_VARIANTE: body.variant,
    //       },
    //       listIds: [Number(brevoListId)],
    //       updateEnabled: true,
    //     }),
    //   });
    // }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[OMPA-LEAD] Fehler:", error);
    return new Response(
      JSON.stringify({ error: "Interner Serverfehler." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
