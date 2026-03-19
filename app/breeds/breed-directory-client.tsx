"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import type { BreedProfile } from "@/lib/types/breed";

type BreedDirectoryClientProps = {
  breeds: BreedProfile[];
  isFallback: boolean;
};

function SuitabilityBadge({ level }: { level: string }) {
  const value = level.toLowerCase();
  const colorClass =
    value === "high"
      ? "bg-emerald-100 text-emerald-700"
      : value === "medium"
        ? "bg-amber-100 text-amber-700"
        : "bg-slate-100 text-slate-600";

  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${colorClass}`}>
      {level}
    </span>
  );
}

export default function BreedDirectoryClient({ breeds, isFallback }: BreedDirectoryClientProps) {
  const [query, setQuery] = useState("");

  const filteredBreeds = useMemo(
    () =>
      breeds.filter((breed) =>
        breed.breed_name.toLowerCase().includes(query.trim().toLowerCase()),
      ),
    [breeds, query],
  );

  return (
    <main className="min-h-screen bg-[#FDF8F3] px-4 py-10">
      <div className="mx-auto w-full max-w-6xl">
        <h1 className="text-4xl text-slate-900">Breed Directory</h1>
        <p className="mt-2 text-sm text-slate-600">
          Search popular breeds and discover climate-smart care guidance for India.
        </p>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <input
            type="text"
            placeholder="Search breeds by name"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#E8602C] focus:outline-none focus:ring-1 focus:ring-[#E8602C]"
          />
        </div>

        {isFallback && (
          <div className="mt-5 rounded-xl border border-orange-200 bg-orange-50 p-4 text-sm text-orange-800">
            No breed profiles found in database yet. Showing popular breeds while profiles are being generated.
          </div>
        )}

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredBreeds.map((breed) => (
            <Link
              key={breed.breed_slug}
              href={`/breeds/${breed.breed_slug}`}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <h2 className="text-2xl text-slate-900">{breed.breed_name}</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full border border-border bg-white px-2.5 py-0.5 text-xs font-semibold text-slate-700 transition hover:border-orange hover:bg-orange hover:text-white hover:shadow-[0_6px_16px_rgba(255,87,34,0.25)]">
                  {breed.size}
                </span>
                <span className="rounded-full border border-border bg-white px-2.5 py-0.5 text-xs font-semibold text-slate-700 transition hover:border-orange hover:bg-orange hover:text-white hover:shadow-[0_6px_16px_rgba(255,87,34,0.25)]">
                  Energy {breed.energy_level}/5
                </span>
                <SuitabilityBadge level={breed.india_climate_suitability} />
              </div>
              <p className="mt-3 text-sm text-slate-600">
                {isFallback ? "Generating..." : breed.summary}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
