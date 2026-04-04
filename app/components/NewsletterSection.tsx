"use client";

import { useState, useTransition } from "react";

import { subscribeToNewsletter } from "@/lib/actions/newsletter";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function NewsletterSection() {
  const [email, setEmail]     = useState("");
  const [error, setError]     = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
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
      } else {
        setError(result.message ?? "Something went wrong.");
      }
    });
  }

  return (
    <section className="bg-[#FAFAF7] px-4 py-14">
      <div className="mx-auto max-w-xl rounded-2xl bg-white p-8 shadow-[0_4px_32px_rgba(0,0,0,0.07)] ring-1 ring-black/[0.04]">
        <p className="mb-1 text-center text-xs font-bold uppercase tracking-widest text-[#E8920A]">
          Stay in the loop
        </p>
        <h2 className="mb-2 text-center font-fraunces text-2xl font-bold text-ink">
          Dog care tips, weekly 🐾
        </h2>
        <p className="mb-6 text-center text-sm leading-relaxed text-muted">
          Breed tips, health reminders and local events — straight to your inbox.
        </p>

        {success ? (
          <p className="rounded-xl bg-green-50 px-5 py-4 text-center text-sm font-semibold text-green-700 ring-1 ring-green-200">
            Thanks for joining PawConnect 🐾
          </p>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <label htmlFor="newsletter-email" className="mb-1.5 block text-sm font-medium text-ink">
              Your email
            </label>
            <div className="flex gap-2">
              <input
                id="newsletter-email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isPending}
                className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-ink outline-none transition focus:border-[#E8920A] focus:bg-white focus:ring-2 focus:ring-[#E8920A]/20 disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={isPending}
                className="shrink-0 rounded-xl bg-[#FF5722] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#E64A19] focus:outline-none focus:ring-2 focus:ring-[#FF5722]/40 disabled:opacity-60"
              >
                {isPending ? "Joining…" : "Join"}
              </button>
            </div>

            {error && (
              <p role="alert" className="mt-2 text-sm text-red-600">
                {error}
              </p>
            )}
          </form>
        )}
      </div>
    </section>
  );
}
