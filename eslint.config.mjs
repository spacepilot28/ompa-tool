import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  // Basis-Konfigurationen von Next.js
  ...nextVitals,
  ...nextTs,

  // Eigene Projekt-Regeln
  {
    rules: {
      // 1) "any" nicht mehr als Fehler behandeln
      "@typescript-eslint/no-explicit-any": "off",

      // 2) Unbenutzte Variablen nur als Warnung
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",   // Funktionsargumente, die mit "_" beginnen, werden ignoriert
          varsIgnorePattern: "^_",   // Variablen, die mit "_" beginnen, werden ignoriert
        },
      ],
    },
  },

  // 3) Ignores wie bisher
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);
