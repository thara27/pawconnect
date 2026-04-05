"use client";

import { useState } from "react";

import { setUserTypeAction } from "@/lib/actions/auth";
import type { UserType } from "@/lib/types/auth";

const PET_OWNER_STEPS = [
  { icon: "🐶", title: "Add your dog", desc: "Create a profile for your pup — breed, age, vaccination status." },
  { icon: "🔍", title: "Search providers", desc: "Browse verified vets, groomers, and trainers near you." },
  { icon: "📅", title: "Book & track", desc: "Request sessions, get confirmations, and manage everything in one place." },
];

const PROVIDER_STEPS = [
  { icon: "🏥", title: "Set up your profile", desc: "Add your services, pricing, and availability." },
  { icon: "📣", title: "Get discovered", desc: "Dog owners in your area will find and book you." },
  { icon: "✅", title: "Manage bookings", desc: "Accept requests and grow your client base." },
];

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

  const steps = selected === "service_provider" ? PROVIDER_STEPS : PET_OWNER_STEPS;

  return (
    <main className="flex min-h-screen items-center justify-center bg-bg px-4 py-12">
      <div className="w-full max-w-lg space-y-4">

        {/* Welcome banner */}
        <div className="rounded-2xl bg-gradient-to-br from-[#FFF8E7] to-[#FDECC8] px-6 py-5 text-center shadow-sm">
          <p className="text-3xl">🐾</p>
          <h1 className="mt-2 font-fraunces text-2xl font-black text-ink">
            Welcome to PawConnect!
          </h1>
          <p className="mt-1 text-sm text-muted">
            India&apos;s home for dog owners. You&apos;re in good company — let&apos;s get you set up.
          </p>
          {/* Trust signals */}
          <div className="mt-3 flex flex-wrap justify-center gap-3 text-xs font-semibold text-[#8B5E00]">
            <span>✓ 10,000+ dog parents</span>
            <span>✓ Verified providers only</span>
            <span>✓ Free to join</span>
          </div>
        </div>

        {/* Role picker */}
        <section className="rounded-2xl border border-border bg-white p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-widest text-brand">Step 1 of 1</p>
          <h2 className="heading-sm mt-1">How will you use PawConnect?</h2>
          <p className="mt-1 text-sm text-muted">Choose your profile type — you can always switch later.</p>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
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
              <span className="mt-1 text-xs text-muted">Find trusted vets, groomers &amp; more</span>
              {selected === "pet_owner" && (
                <span className="mt-2 inline-block rounded-full bg-brand px-2 py-0.5 text-[10px] font-bold text-white">Selected ✓</span>
              )}
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
              <span className="mt-2 font-semibold text-ink">Service Provider</span>
              <span className="mt-1 text-xs text-muted">Offer grooming, vet or boarding services</span>
              {selected === "service_provider" && (
                <span className="mt-2 inline-block rounded-full bg-brand px-2 py-0.5 text-[10px] font-bold text-white">Selected ✓</span>
              )}
            </button>
          </div>

          {errorMessage ? (
            <p className="alert alert-error mt-4">{errorMessage}</p>
          ) : null}

          <button
            type="button"
            onClick={handleContinue}
            disabled={!selected || isLoading}
            className="btn btn-primary btn-full mt-5 disabled:opacity-50"
          >
            {isLoading ? "Setting up your account…" : "Continue →"}
          </button>
        </section>

        {/* What happens next */}
        <section className="rounded-2xl border border-border bg-white p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-widest text-muted">What happens next</p>
          <div className="mt-4 space-y-3">
            {steps.map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-brand-light text-lg">
                  {step.icon}
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink">{step.title}</p>
                  <p className="text-xs text-muted">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}
