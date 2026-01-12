
// app/api/ompa-report/route.ts
import type { NextRequest } from "next/server";
import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";
import type { Browser } from "puppeteer-core";
import type { WizardState } from "@/types/wizard";
import fs from "node:fs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

function pickLocalChrome(): string | null {
  // Optional: eigener Pfad per .env.local
  const envPath = process.env.PUPPETEER_EXECUTABLE_PATH;
  const candidates = [
    envPath,

    // Windows (Chrome)
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",

    // Windows (Edge)
    "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",

    // macOS
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",

    // Linux
    "/usr/bin/google-chrome",
    "/usr/bin/google-chrome-stable",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
  ];

  for (const p of candidates) {
    if (p && fs.existsSync(p)) return p;
  }
  return null;
}

function getOrigin(req: NextRequest): string {
  const u = new URL(req.url);
  const proto =
    req.headers.get("x-forwarded-proto") ?? u.protocol.replace(":", "");
  const host =
    req.headers.get("x-forwarded-host") ??
    req.headers.get("host") ??
    u.host;

  return `${proto}://${host}`;
}

export async function POST(request: NextRequest) {
  let browser: Browser | null = null;

  try {
    // 1) State aus dem Request holen (nur "state" ist offiziell)
    const body = (await request.json()) as { state?: WizardState } | null;
    const state = body?.state;

    if (!state) {
      console.error(
        "[OMPA-PDF] Missing state in request body. Keys:",
        Object.keys(body ?? {})
      );
      return new Response("Missing state", { status: 400 });
    }

    // 2) Report-URL bauen
    const origin = getOrigin(request);
    const encoded = encodeURIComponent(JSON.stringify(state));
    const reportUrl = `${origin}/ompa-report?data=${encoded}`;
    console.log("[OMPA-PDF] reportUrl:", reportUrl);

    // 3) Lokal vs. Vercel: unterschiedliche Chrome-Quelle
    const isVercel =
      !!process.env.VERCEL || !!process.env.AWS_LAMBDA_FUNCTION_VERSION;

    const executablePath = isVercel
      ? await chromium.executablePath()
      : pickLocalChrome();

    if (!executablePath) {
      console.error(
        "[OMPA-PDF] No Chrome executable found. Set PUPPETEER_EXECUTABLE_PATH in .env.local (local dev)."
      );
      return new Response("Chrome executable not found", { status: 500 });
    }

    const launchArgs = isVercel ? chromium.args : [];

    // 4) Puppeteer starten (headless MUSS boolean sein -> kein "new")
    browser = await puppeteer.launch({
      args: launchArgs,
      executablePath,
      headless: true,
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });

    // 5) Seite laden + warten bis Report wirklich da ist (verhindert Fallback-PDF)
    await page.goto(reportUrl, { waitUntil: "networkidle0", timeout: 60_000 });

    // Wir warten auf ein Element, das NUR im finalen Report existiert:
    await page.waitForSelector("#ompa-report-root", { timeout: 60_000 });

    // 6) PDF rendern
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
    });

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
