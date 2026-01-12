import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Wichtig: sparticuz/chromium bringt .br Dateien unter:
   * node_modules/@sparticuz/chromium/bin
   * Diese Assets werden ohne Include beim Vercel-Function-Bundle gern "wegoptimiert".
   */
  outputFileTracingIncludes: {
    "/api/ompa-report": [
      "./node_modules/@sparticuz/chromium/bin/**/*",
      "./node_modules/@sparticuz/chromium/**",
    ],
  },

  /**
   * Erzwingt, dass diese Pakete serverseitig nicht gebundled werden.
   * Next dokumentiert dafür serverExternalPackages. :contentReference[oaicite:2]{index=2}
   */
  serverExternalPackages: ["@sparticuz/chromium", "puppeteer-core"],
};

export default nextConfig;
