// app/api/ompa-report/route.ts
import type { NextRequest } from "next/server";
import puppeteer from "puppeteer";

export async function POST(req: NextRequest) {
  try {
    // 1. URL aus dem Request-Body holen
    const body = await req.json();
    const url = body?.url as string | undefined;

    if (!url) {
      return new Response(
        JSON.stringify({ error: "Missing or invalid 'url' in body" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    console.log("[OMPA-PDF] Starte PDF-Generation für URL:", url);

    // 2. Puppeteer-Browser starten
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    // 3. Report-Seite laden
    await page.goto(url, {
      waitUntil: "networkidle0",
    });

    // 4. Einmal nach unten scrollen, damit alles gerendert ist
    await page.evaluate(async () => {
      await new Promise<void>((resolve) => {
        const totalHeight = document.body.scrollHeight;
        window.scrollTo(0, totalHeight);
        setTimeout(resolve, 300);
      });
    });

    // 5. PDF erzeugen
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "12mm",
        right: "12mm",
        bottom: "16mm",
        left: "12mm",
      },
    });

    await browser.close();

    // Debug-Ausgabe
    console.log("[OMPA-PDF] PDF fertig, Bytes:", pdfBuffer.length);
    console.log(
      "[OMPA-PDF] Header:",
      pdfBuffer.subarray(0, 4).toString("utf8")
    );

    // 6. Buffer -> ArrayBuffer, damit der BodyInit-Typ passt
    const pdfArrayBuffer = pdfBuffer.buffer.slice(
      pdfBuffer.byteOffset,
      pdfBuffer.byteOffset + pdfBuffer.byteLength
    );

    // TypeScript ist beim BodyInit etwas pingelig → explizit casten
    const responseBody = pdfArrayBuffer as unknown as BodyInit;

    // 7. PDF an den Client zurückgeben
    return new Response(responseBody, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="ompa-ergebnis.pdf"',
      },
    });
  } catch (error) {
    console.error("[OMPA-PDF] PDF generation error:", error);

    return new Response(
      JSON.stringify({ error: "PDF generation failed" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
