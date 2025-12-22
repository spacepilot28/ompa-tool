
// app/api/ompa-report/route.ts
import type { NextRequest } from "next/server";
import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";
import type { WizardState } from "@/types/wizard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    // 1. State aus dem Request holen
    const body = (await request.json()) as { state?: WizardState };
    const state = body.state;

    if (!state) {
      console.error("[OMPA-REPORT] Missing state in request body");
      return new Response("Missing state", { status: 400 });
    }

    // 2. Origin (Host) aus der Request-URL berechnen – funktioniert lokal & auf Vercel
    const url = new URL(request.url);
    const origin = `${url.protocol}//${url.host}`;

    // 3. State für die Report-Seite kodieren
    const encoded = encodeURIComponent(JSON.stringify(state));
    const reportUrl = `${origin}/ompa-report?data=${encoded}`;

    console.log("[OMPA-REPORT] Using report URL:", reportUrl);

    // 4. Headless-Chrome (Puppeteer) mit Sparticuz-Chromium starten
      const executablePath = await chromium.executablePath();

      if (!executablePath) {
        console.error("[OMPA-PDF] No executablePath returned by @sparticuz/chromium");
        return new Response("Chromium executable not found", { status: 500 });
      }

      const browser = await puppeteer.launch({
        args: chromium.args,
        executablePath,
        headless: true,
      });
    const page = await browser.newPage();
    await page.goto(reportUrl, { waitUntil: "networkidle0" });

    // 4. PDF erstellen
      const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
      });

    // 5. Browser schließen
    await browser.close();

    // 6. Buffer -> ArrayBuffer (gültiger BodyInit-Typ für Response)
    const pdfArrayBuffer = pdfBuffer.buffer.slice(
    pdfBuffer.byteOffset,
    pdfBuffer.byteOffset + pdfBuffer.byteLength
  ) as ArrayBuffer;

  // 7. Response mit PDF
  // Typ-Hack: TypeScript kennt hier nur ArrayBuffer | SharedArrayBuffer,
  // Response erwartet BodyInit – zur Laufzeit ist das in Ordnung.
  return new Response(pdfArrayBuffer as any, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="ompa-report.pdf"',
    },
  });
  } catch (error) {
    console.error("[OMPA-REPORT] Error while generating PDF:", error);
    return new Response("Error generating PDF", { status: 500 });
  }
}
