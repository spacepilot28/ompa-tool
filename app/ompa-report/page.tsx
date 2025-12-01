// app/ompa-report/page.tsx
import { Suspense } from "react";
import OmpaReportClient from "./OmpaReportClient";

export const dynamic = "force-dynamic";

export default function OmpaReportPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-slate-950 text-gray-100 flex items-center justify-center">
          <p className="text-sm text-gray-400">
            Report wird geladen…
          </p>
        </main>
      }
    >
      <OmpaReportClient />
    </Suspense>
  );
}
