// context/VariantContext.tsx

"use client";

import {
  createContext,
  useContext,
  type ReactNode,
} from "react";
import type { OmpaVariantConfig } from "../types/variant";
import { OMPA_VARIANTS } from "../config/ompaVariants";

/**
 * Context für die aktive OMPA-Variante.
 * Wird einmal im WizardShell gesetzt und steht dann allen
 * Unter-Komponenten zur Verfügung.
 */
const VariantContext = createContext<OmpaVariantConfig>(OMPA_VARIANTS.light);

interface VariantProviderProps {
  variant: OmpaVariantConfig;
  children: ReactNode;
}

export function VariantProvider({ variant, children }: VariantProviderProps) {
  return (
    <VariantContext.Provider value={variant}>
      {children}
    </VariantContext.Provider>
  );
}

/**
 * Hook zum Abrufen der aktiven Variante.
 *
 * Beispiel:
 *   const variant = useVariant();
 *   if (variant.id === "light") { ... }
 */
export function useVariant(): OmpaVariantConfig {
  return useContext(VariantContext);
}
