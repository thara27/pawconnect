"use client";

import { useState } from "react";

import { setUserTypeAction } from "@/lib/actions/auth";
import type { UserType } from "@/lib/types/auth";

export default function OnboardingPage() {
  const [selected, setSelected] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleContinue = async () => {
    if (!selected) return;
    setIsLoading(true);
    setErrorMessage(null);

    const result = await setUserTypeAction(selected);

    if (result?.error) {
      setErrorMessage(result.error);
      setIsLoading(false);
    }
    // On success, setUserTypeAction redirects — no client-side handling needed
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-bg px-6 py-12">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-wide text-brand">
          PawConnect
        </p>
        <h1 className="heading-md mt-2">
          How will you use PawConnect?
        </h1>
        <p className="mt-2 text-sm text-muted">
          Choose your profile type to set up your dashboard.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setSelected("pet_owner")}
            className={`flex flex-col items-start rounded-xl border-2 p-4 text-left transition ${
              selected === "pet_owner"
                ? "border-brand bg-brand-light"
                : "border-border bg-white hover:border-brand hover:bg-brand-light"
            }`}
          >
            <span className="text-2xl">🐾</span>
            <span className="mt-2 font-semibold text-ink">Pet Owner</span>
            <span className="mt-1 text-xs text-muted">
              Find and book pet care services
            </span>
          </button>

          <button
            type="button"
            onClick={() => setSelected("service_provider")}
            className={`flex flex-col items-start rounded-xl border-2 p-4 text-left transition ${
              selected === "service_provider"
                ? "border-brand bg-brand-light"
                : "border-border bg-white hover:border-brand hover:bg-brand-light"
            }`}
          >
            <span className="text-2xl">🏥</span>
            <span className="mt-2 font-semibold text-ink">
              Service Provider
            </span>
            <span className="mt-1 text-xs text-muted">
              Offer grooming, vet, or boarding services
            </span>
          </button>
        </div>

        {errorMessage ? (
          <p className="alert alert-error mt-4">
            {errorMessage}
          </p>
        ) : null}

        <button
          type="button"
          onClick={handleContinue}
          disabled={!selected || isLoading}
          className="btn btn-primary btn-full mt-6 disabled:opacity-50"
        >
          {isLoading ? "Setting up your account..." : "Continue"}
        </button>
      </section>
    </main>
  );
}
