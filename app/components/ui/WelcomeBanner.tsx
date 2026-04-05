"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function WelcomeBanner({ firstName }: { firstName: string }) {
  const [visible, setVisible] = useState(true);

  // Strip the ?welcome param from the URL without a navigation
  useEffect(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.has("welcome")) {
      url.searchParams.delete("welcome");
      window.history.replaceState({}, "", url.pathname + (url.search || ""));
    }
  }, []);

  if (!visible) return null;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand via-[#FF8A50] to-[#FFC947] p-5 text-white shadow-lg sm:p-6">
      {/* Decorative paw */}
      <div className="pointer-events-none absolute -right-3 -top-3 text-[7rem] opacity-10 select-none" aria-hidden="true">🐾</div>

      {/* Dismiss */}
      <button
        onClick={() => setVisible(false)}
        aria-label="Dismiss welcome message"
        className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="relative z-10 pr-8">
        <p className="text-2xl leading-none">🎉</p>
        <h2 className="mt-2 font-fraunces text-xl font-black sm:text-2xl">
          Welcome to PawConnect, {firstName}! 🐾
        </h2>
        <p className="mt-1 text-sm text-white/90 max-w-md">
          You&apos;re all set. Start by adding your dog so we can personalise your experience.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/dashboard/pet-owner/pets/new"
            className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-bold text-brand shadow hover:bg-white/90 transition"
          >
            🐶 Add your first dog
          </Link>
          <Link
            href="/dashboard/pet-owner/search"
            className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-4 py-2 text-sm font-semibold text-white hover:bg-white/30 transition"
          >
            Browse providers →
          </Link>
        </div>
      </div>
    </div>
  );
}
