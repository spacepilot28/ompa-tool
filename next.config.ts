import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Wichtig: diese Pakete nicht "einbacken", sondern als extern behandeln
  serverExternalPackages: ["@sparticuz/chromium", "puppeteer-core"],

  // Wichtig: Chromium-Binaries in die Serverless Function reintracen
  outputFileTracingIncludes: {
    "/api/ompa-report": ["./node_modules/@sparticuz/chromium/**"],
  },
};

export default nextConfig;
