
// app/api/ompa-report/route.ts
import type { NextRequest } from "next/server";
import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";
import type { Browser } from "puppeteer-core";
import type { WizardState } from "@/types/wizard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Optional, aber sinnvoll (Vercel Function Timeout/Limit):
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  let browser: Browser | null = null;

  try {
    // 1) State aus dem Request holen
    const body = (await request.json()) as { state?: WizardState };
    const state = body.state;

    if (!state) {
      return new Response("Missing state", { status: 400 });
    }

    // 2) Origin aus Request-URL (lokal & Vercel korrekt)
    const url = new URL(request.url);
    const origin = `${url.protocol}//${url.host}`;

    // 3) Report-URL bauen
    const encoded = encodeURIComponent(JSON.stringify(state));
    const reportUrl = `${origin}/ompa-report?data=${encoded}`;

    console.log("[OMPA-PDF] reportUrl:", reportUrl);

    // 4) Chromium Pfad holen (sparticuz)
    const executablePath = await chromium.executablePath();

    if (!executablePath) {
      console.error("[OMPA-PDF] No executablePath from @sparticuz/chromium");
      return new Response("Chromium executable not found", { status: 500 });
    }

    // 5) Puppeteer starten
    browser = await puppeteer.launch({
      args: chromium.args,
      executablePath,
      headless: true, // <- wichtig: TS ruhigstellen + stabil auf Vercel
    });

    const page = await browser.newPage();

    // Optional, hilft manchmal bei stabilen Layouts
    await page.setViewport({ width: 1280, height: 720 });

    // 6) Seite laden
    await page.goto(reportUrl, { waitUntil: "networkidle0" });

    // 7) PDF generieren
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
    });

    // 8) Response (Buffer direkt als Body)
    return new Response(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="ompa-report.pdf"',
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("[OMPA-PDF] PDF generation error:", error);
    return new Response("Error generating PDF", { status: 500 });
  } finally {
    if (browser) {
      try {
        await browser.close();
      } catch {
        // ignore
      }
    }
  }
}
