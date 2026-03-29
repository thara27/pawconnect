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
      ? "badge badge-success"
      : value === "medium"
        ? "badge badge-warning"
        : "badge badge-neutral";

  return (
    <span className={colorClass}>
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
    <main className="bg-bg px-4 py-10">
        <div className="mx-auto w-full max-w-6xl">
        <h1 className="heading-xl">Breed Directory</h1>
        <p className="mt-2 text-sm text-muted">
          Search popular breeds and discover climate-smart care guidance for India.
        </p>

        <div className="card mt-6">
          <input
            type="text"
            placeholder="Search breeds by name"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>

        {isFallback && (
          <div className="alert alert-info mt-5">
            No breed profiles found in database yet. Showing popular breeds while profiles are being generated.
          </div>
        )}

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredBreeds.map((breed) => (
            <Link
              key={breed.breed_slug}
              href={`/breeds/${breed.breed_slug}`}
              className="card transition hover:-translate-y-0.5 hover:shadow-md"
            >
                <h2 className="heading-sm">{breed.breed_name}</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="badge badge-neutral transition hover:bg-brand hover:text-white">
                  {breed.size}
                </span>
                <span className="badge badge-neutral transition hover:bg-brand hover:text-white">
                  Energy {breed.energy_level}/5
                </span>
                <SuitabilityBadge level={breed.india_climate_suitability} />
              </div>
              <p className="mt-3 text-sm text-muted">
                {isFallback ? "Generating..." : breed.summary}
              </p>
            </Link>
          ))}
        </div>
        </div>
    </main>
  );
}
