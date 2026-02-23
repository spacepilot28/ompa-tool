// components/wizard/EmailGate.tsx

"use client";

import { useState } from "react";
import type { WizardState } from "../../types/wizard";

interface Props {
  state: WizardState;
  onSubmit: (data: NonNullable<WizardState["leadData"]>) => void;
}

export function EmailGate({ state, onSubmit }: Props) {
  const [firstName, setFirstName] = useState(state.leadData?.firstName ?? "");
  const [email, setEmail] = useState(state.leadData?.email ?? "");
  const [company, setCompany] = useState(state.leadData?.company ?? "");
  const [privacyAccepted, setPrivacyAccepted] = useState(
    state.leadData?.privacyAccepted ?? false
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!firstName.trim()) {
      newErrors.firstName = "Bitte gib deinen Vornamen ein.";
    }

    if (!email.trim()) {
      newErrors.email = "Bitte gib deine E-Mail-Adresse ein.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Bitte gib eine gültige E-Mail-Adresse ein.";
    }

    if (!privacyAccepted) {
      newErrors.privacy = "Bitte bestätige die Datenschutzhinweise.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      // Lead an die API senden
      const response = await fetch("/api/ompa-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: firstName.trim(),
          email: email.trim(),
          company: company.trim(),
          variant: "light",
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        console.error("[EmailGate] API-Fehler:", response.status);
        // Trotzdem weiter zum Report – Lead-Erfassung darf Report nicht blockieren
      }
    } catch (error) {
      console.error("[EmailGate] Netzwerkfehler:", error);
    }

    // Report freischalten, auch wenn API-Aufruf fehlschlägt
    onSubmit({
      firstName: firstName.trim(),
      email: email.trim(),
      company: company.trim(),
      privacyAccepted,
    });

    setIsSubmitting(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-100">
          Fast geschafft – dein Report wartet
        </h1>
        <p className="mt-2 text-base text-gray-300">
          Gib deine E-Mail-Adresse ein und erhalte deinen persönlichen
          OMPA-Light-Report sofort und kostenlos. Zusätzlich bekommst du
          eine kurze Einordnung deiner Ergebnisse per E-Mail.
        </p>
      </div>

      <div className="space-y-4">
        {/* Vorname */}
        <div>
          <label
            htmlFor="gate-firstName"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Vorname *
          </label>
          <input
            id="gate-firstName"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Dein Vorname"
            className={[
              "w-full rounded-xl border bg-gray-900/50 px-4 py-3 text-base text-gray-100",
              "placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#fbb03b]/50",
              errors.firstName ? "border-red-500" : "border-gray-700",
            ].join(" ")}
          />
          {errors.firstName && (
            <p className="mt-1 text-sm text-red-400">{errors.firstName}</p>
          )}
        </div>

        {/* E-Mail */}
        <div>
          <label
            htmlFor="gate-email"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            E-Mail-Adresse *
          </label>
          <input
            id="gate-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="deine@email.de"
            className={[
              "w-full rounded-xl border bg-gray-900/50 px-4 py-3 text-base text-gray-100",
              "placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#fbb03b]/50",
              errors.email ? "border-red-500" : "border-gray-700",
            ].join(" ")}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-400">{errors.email}</p>
          )}
        </div>

        {/* Unternehmen (optional) */}
        <div>
          <label
            htmlFor="gate-company"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Unternehmen (optional)
          </label>
          <input
            id="gate-company"
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Dein Unternehmen"
            className="w-full rounded-xl border border-gray-700 bg-gray-900/50 px-4 py-3 text-base text-gray-100 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#fbb03b]/50"
          />
        </div>

        {/* Datenschutz */}
        <div className="flex items-start gap-3">
          <input
            id="gate-privacy"
            type="checkbox"
            checked={privacyAccepted}
            onChange={(e) => setPrivacyAccepted(e.target.checked)}
            className="mt-1 h-5 w-5 rounded border-gray-600 accent-[#fbb03b]"
          />
          <label
            htmlFor="gate-privacy"
            className={[
              "text-sm",
              errors.privacy ? "text-red-400" : "text-gray-400",
            ].join(" ")}
          >
            Ich stimme zu, dass meine Daten zur Erstellung des Reports und
            zum Versand der Ergebnis-E-Mail verwendet werden. Die{" "}
            <a
              href="https://zweimeter.online/datenschutz"
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-[#fbb03b]/80 hover:text-[#fbb03b]"
            >
              Datenschutzhinweise
            </a>{" "}
            habe ich gelesen. *
          </label>
        </div>
        {errors.privacy && (
          <p className="text-sm text-red-400">{errors.privacy}</p>
        )}
      </div>

      {/* Submit-Button */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="w-full rounded-xl bg-[#fbb03b] px-6 py-4 text-lg font-bold text-black hover:bg-[#fdd28a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Wird verarbeitet…" : "Report jetzt anzeigen"}
      </button>

      <p className="text-xs text-gray-500 text-center">
        Kein Spam. Kein Abo. Du erhältst maximal 3 E-Mails zu deiner Analyse.
      </p>
    </div>
  );
}
