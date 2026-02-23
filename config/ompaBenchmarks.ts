// config/ompaBenchmarks.ts

import type { BranchId } from "../types/wizard";

/**
 * Benchmark-Daten für den Branchenvergleich.
 *
 * Die Werte sind als Reifegrad (0–100) pro Themenblock angegeben,
 * NICHT als Handlungsbedarf. Der Handlungsbedarf wird berechnet als:
 *   Handlungsbedarf = 100 - Reifegrad
 *
 * Phase 1 (Start): Statische Erfahrungswerte von Robert.
 * Phase 2 (nach 50+ Analysen): Anonymisierte Aggregation echter OMPA-Daten.
 *
 * Achtung: Diese Information basiert auf Erfahrungswerten und
 * stellt keine wissenschaftlich erhobene Statistik dar.
 */
export interface BenchmarkEntry {
  branchId: BranchId;
  label: string;
  sampleSize: number;
  description: string;
  /** Reifegrad pro Block-ID (block_1 bis block_10), Werte 0–100 */
  blockAverages: Record<string, number>;
}

export const OMPA_BENCHMARKS: Record<BranchId, BenchmarkEntry> = {
  produzierendes_gewerbe: {
    branchId: "produzierendes_gewerbe",
    label: "Produzierendes Gewerbe / Industrie",
    sampleSize: 15,
    description:
      "Klassische Industrieunternehmen, Maschinenbau, Fertigung und Zulieferer.",
    blockAverages: {
      block_1: 45,  // Ausrichtung / Strategie – oft vorhanden, aber nicht digitalisiert
      block_2: 25,  // Content & Inbound – meist schwach, keine Content-Strategie
      block_3: 55,  // Kundenpotenzial – Bestandskunden werden gut bedient
      block_4: 30,  // Marketing – klassisch geprägt, digital unterentwickelt
      block_5: 50,  // Akquisitionsweg – Messe und Empfehlung funktionieren
      block_6: 15,  // E-Mail & Automation – kaum vorhanden
      block_7: 20,  // Analytics & Funnel – rudimentär
      block_8: 55,  // Verkaufskompetenzen – oft solide Außendienst-Erfahrung
      block_9: 50,  // Ergänzende Vertriebskomp. – gut, aber nicht systematisch
      block_10: 40, // Vertriebsengpass – mittlerer Druck
    },
  },

  dienstleistung: {
    branchId: "dienstleistung",
    label: "Dienstleistung / Beratung",
    sampleSize: 20,
    description:
      "Beratungsunternehmen, Agenturen, Freiberufler und wissensbasierte Dienstleister.",
    blockAverages: {
      block_1: 50,  // Ausrichtung – oft gut formuliert
      block_2: 40,  // Content – punktuell vorhanden
      block_3: 40,  // Kundenpotenzial – stark personenabhängig
      block_4: 35,  // Marketing – besser als Industrie, aber lückenhaft
      block_5: 45,  // Akquisitionsweg – Empfehlungen dominieren
      block_6: 25,  // E-Mail & Automation – ausbaufähig
      block_7: 30,  // Analytics & Funnel – bewusster als Industrie
      block_8: 50,  // Verkaufskompetenzen – variiert stark
      block_9: 45,  // Ergänzende Vertriebskomp. – solide
      block_10: 35, // Vertriebsengpass – oft zeitliche Ressourcen
    },
  },

  handel: {
    branchId: "handel",
    label: "Handel (Groß- und Einzelhandel)",
    sampleSize: 10,
    description:
      "Groß- und Einzelhandel, stationär und online.",
    blockAverages: {
      block_1: 40,  // Ausrichtung – oft preisfokussiert
      block_2: 30,  // Content – produktbezogen, nicht strategisch
      block_3: 50,  // Kundenpotenzial – Kundendaten oft vorhanden
      block_4: 45,  // Marketing – stärker als Industrie
      block_5: 40,  // Akquisitionsweg – Mischung aus Laufkundschaft und online
      block_6: 30,  // E-Mail & Automation – Newsletter vorhanden
      block_7: 35,  // Analytics & Funnel – E-Commerce hat Vorsprung
      block_8: 45,  // Verkaufskompetenzen – praxisnah
      block_9: 40,  // Ergänzende Vertriebskomp. – kundenorientiert
      block_10: 45, // Vertriebsengpass – saisonabhängig
    },
  },

  handwerk: {
    branchId: "handwerk",
    label: "Handwerk / Baugewerbe",
    sampleSize: 8,
    description:
      "Handwerksbetriebe, Bauwirtschaft und verwandte Gewerke.",
    blockAverages: {
      block_1: 30,  // Ausrichtung – selten dokumentiert
      block_2: 15,  // Content – fast nicht vorhanden
      block_3: 55,  // Kundenpotenzial – starke lokale Kundenbindung
      block_4: 20,  // Marketing – Mundpropaganda dominiert
      block_5: 55,  // Akquisitionsweg – Empfehlungen, lokale Bekanntheit
      block_6: 10,  // E-Mail & Automation – kaum existent
      block_7: 10,  // Analytics & Funnel – nicht vorhanden
      block_8: 50,  // Verkaufskompetenzen – praktisch, direkt
      block_9: 45,  // Ergänzende Vertriebskomp. – handwerklich stark
      block_10: 50, // Vertriebsengpass – oft Fachkräftemangel als Grenze
    },
  },

  it_software: {
    branchId: "it_software",
    label: "IT / Software / Technologie",
    sampleSize: 12,
    description:
      "Softwareunternehmen, IT-Dienstleister und Technologie-Startups.",
    blockAverages: {
      block_1: 55,  // Ausrichtung – oft klar, aber techniklastig
      block_2: 50,  // Content – Blog und Whitepapers verbreitet
      block_3: 35,  // Kundenpotenzial – oft wenig Bestandskunden-Strategie
      block_4: 50,  // Marketing – digital-affin, aber nicht immer strategisch
      block_5: 35,  // Akquisitionsweg – oft inbound-lastig
      block_6: 40,  // E-Mail & Automation – Tools vorhanden, nicht optimiert
      block_7: 45,  // Analytics & Funnel – datengetrieben
      block_8: 35,  // Verkaufskompetenzen – technisch stark, vertrieblich schwach
      block_9: 30,  // Ergänzende Vertriebskomp. – Produkt vor Verkauf
      block_10: 30, // Vertriebsengpass – Abschlussquote oft niedrig
    },
  },

  sonstige: {
    branchId: "sonstige",
    label: "Sonstige Branche",
    sampleSize: 50,
    description:
      "Branchenübergreifender Durchschnitt aller bisherigen OMPA-Analysen.",
    blockAverages: {
      block_1: 42,
      block_2: 30,
      block_3: 45,
      block_4: 35,
      block_5: 43,
      block_6: 22,
      block_7: 28,
      block_8: 48,
      block_9: 42,
      block_10: 38,
    },
  },
};

/**
 * Gibt die Benchmark-Daten für eine Branche zurück.
 * Fallback: "sonstige" (branchenübergreifender Durchschnitt).
 */
export function getBenchmarkForBranch(branchId: BranchId | null): BenchmarkEntry {
  if (branchId && branchId in OMPA_BENCHMARKS) {
    return OMPA_BENCHMARKS[branchId];
  }
  return OMPA_BENCHMARKS.sonstige;
}
