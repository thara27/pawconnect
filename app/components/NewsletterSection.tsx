"use client";

import { useState, useTransition } from "react";

import { subscribeToNewsletter } from "@/lib/actions/newsletter";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function NewsletterSection() {
  const [email, setEmail]            = useState("");
  const [error, setError]            = useState<string | null>(null);
  const [success, setSuccess]        = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!EMAIL_RE.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    startTransition(async () => {
      const result = await subscribeToNewsletter(email);
      if (result.success) {
        setSuccess(true);
        setEmail("");
        setTimeout(() => setSuccess(false), 5000);
      } else {
        setError(result.message ?? "Something went wrong.");
      }
    });
  }

  return (
    <section className="bg-[#FAF7F2] px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-2xl">

        {/* Card */}
        <div className="relative overflow-hidden rounded-[20px] border border-[#EDE3D4] bg-[#FFFCF7] px-6 py-10 shadow-sm transition-shadow duration-300 hover:shadow-md sm:px-12 sm:py-12">

          {/* Decorative blobs */}
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-orange-100 opacity-40 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-amber-100 opacity-50 blur-2xl" />

          {/* Header */}
          <div className="relative mb-8 text-center">
            <span className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-2xl ring-1 ring-orange-100">
              🐾
            </span>
            <h2 className="mt-3 font-fraunces text-2xl font-bold text-stone-900 sm:text-3xl">
              Stay in the loop 🐾
            </h2>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-stone-500">
              Dog care tips, trusted service updates, and PawConnect launches — straight to your inbox.
            </p>
          </div>

          {/* Success state */}
          {success ? (
            <div className="relative flex flex-col items-center gap-2 rounded-2xl border border-green-100 bg-green-50 px-6 py-6 text-center">
              <span className="text-2xl">🎉</span>
              <p className="text-sm font-semibold text-green-800">
                Thanks for joining PawConnect 🐾
              </p>
              <p className="text-xs text-green-600">
                We&apos;ll be in touch with the good stuff.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="relative">
              <label
                htmlFor="newsletter-email"
                className="mb-2 block text-xs font-semibold uppercase tracking-widest text-stone-400"
              >
                Your email address
              </label>

              {/* Input row — stacked on mobile, inline on sm+ */}
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  id="newsletter-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isPending}
                  className="min-w-0 flex-1 rounded-xl border border-[#EDE3D4] bg-white px-4 py-3 text-sm text-stone-800 placeholder-stone-300 outline-none ring-0 transition duration-150 focus:border-orange-300 focus:ring-2 focus:ring-orange-200 disabled:cursor-not-allowed disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={isPending}
                  className="shrink-0 rounded-xl bg-[#FF5722] px-7 py-3 text-sm font-semibold text-white shadow-sm transition duration-150 hover:bg-[#E64A19] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#FF5722] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                >
                  {isPending ? "Joining PawConnect..." : "Join for free"}
                </button>
              </div>

              {error && (
                <p role="alert" className="mt-3 text-xs font-medium text-red-500">
                  {error}
                </p>
              )}

              <p className="mt-4 text-center text-xs text-stone-400">
                No spam. Unsubscribe anytime.
              </p>
              <p className="mt-2 text-center text-xs font-medium text-stone-400">
                Loved by dog parents across India 🇮🇳
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
