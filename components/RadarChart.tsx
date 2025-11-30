"use client";

import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  type ChartOptions,
} from "chart.js";
import { Radar } from "react-chartjs-2";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface Props {
  labels: string[];
  values: number[]; // 0–100: Handlungsbedarf
}

/**
 * CI-orientierte Farben für OMPA (Dark Theme):
 * - Orange = Handlungsbedarf (Priorität)
 * - Desaturierte Grautöne für Grid & Achsen
 * - Helle Label-Farben für Dark-Mode-Hintergrund
 */
const COLOR_NEED = "rgba(251, 146, 60, 1)";       // orange-400
const COLOR_NEED_BG = "rgba(251, 146, 60, 0.22)"; // weiche Füllung
const GRID_COLOR = "rgba(148, 163, 184, 0.30)";   // slate-400-ish
const ANGLE_COLOR = "rgba(75, 85, 99, 0.75)";     // slate-600-ish
const TICK_COLOR = "rgba(148, 163, 184, 0.95)";   // helle Skala
const LABEL_COLOR = "#E5E7EB";                    // fast weiß (gray-200)

const options: ChartOptions<"radar"> = {
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 900,
    easing: "easeOutQuart",
  },
  scales: {
    r: {
      suggestedMin: 0,
      suggestedMax: 100,
      ticks: {
        stepSize: 20,
        backdropColor: "transparent",
        color: TICK_COLOR,
        showLabelBackdrop: false,
        z: 2,
      },
      grid: {
        color: GRID_COLOR,
        lineWidth: 1,
      },
      angleLines: {
        color: ANGLE_COLOR,
        lineWidth: 1,
      },
      pointLabels: {
        color: LABEL_COLOR,
        font: {
          size: 11,
          weight: 600,
        },
        callback: (label: string) => {
          if (label.length > 26) {
            const mid = Math.floor(label.length / 2);
            return label.slice(0, mid) + "\n" + label.slice(mid);
          }
          return label;
        },
      },
    },
  },
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      enabled: true,
      callbacks: {
        label: (ctx) => {
          const label = ctx.label || "";
          const value =
            typeof ctx.parsed === "number" ? ctx.parsed : ctx.parsed.r;
          const valNumber = typeof value === "number" ? value : 0;
          return `${label}: ${valNumber.toFixed(1)} % Handlungsbedarf`;
        },
      },
    },
  },
  elements: {
    line: {
      tension: 0.25, // leichte Rundung
      borderWidth: 2,
    },
    point: {
      radius: 4,
      hitRadius: 8,
      borderWidth: 2,
      hoverRadius: 6,
      hoverBorderWidth: 2,
    },
  },
};

export default function RadarChart({ labels, values }: Props) {
  const data = {
    labels,
    datasets: [
      {
        label: "Handlungsbedarf je Themenblock",
        data: values,
        fill: true,
        backgroundColor: COLOR_NEED_BG,
        borderColor: COLOR_NEED,
        pointBackgroundColor: COLOR_NEED,
        pointBorderColor: "#020617", // sehr dunkler Hintergrundton
        pointHoverBackgroundColor: "#ffffff",
        pointHoverBorderColor: COLOR_NEED,
        pointHoverBorderWidth: 2,
      },
    ],
  };

  return (
    <div
      style={{
        width: "100%",
        // Höhe: Desktop max. ~480px, auf kleineren Screens max. 80% der Breite
        height: "min(480px, 80vw)",
        margin: "0 auto",
      }}
    >
      <Radar data={data} options={options} />
    </div>
  );
}
