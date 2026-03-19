"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import PublicProviderCard from "@/app/components/providers/PublicProviderCard";
import SignupNudge from "@/app/components/ui/SignupNudge";
import { searchProviders } from "@/lib/actions/providers";
import { SERVICE_TYPES } from "@/lib/types/provider";
import type { ProviderSearchResult, SearchFilters } from "@/lib/types/provider";

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-start gap-4">
        <div className="h-14 w-14 rounded-full bg-slate-200" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/5 rounded bg-slate-200" />
          <div className="h-3 w-1/3 rounded bg-slate-200" />
        </div>
      </div>
      <div className="mt-4 h-3 w-1/2 rounded bg-slate-200" />
      <div className="mt-2 h-3 w-2/3 rounded bg-slate-200" />
      <div className="mt-5 h-8 w-28 rounded bg-slate-200" />
    </div>
  );
}

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [city, setCity] = useState(searchParams.get("city") ?? "");
  const [serviceType, setServiceType] = useState(searchParams.get("service") ?? "");
  const [isAvailable, setIsAvailable] = useState(searchParams.get("available") === "true");
  const [minRating, setMinRating] = useState(searchParams.get("rating") ?? "");

  const [results, setResults] = useState<ProviderSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const fetchProviders = useCallback(async (filters: SearchFilters) => {
    setIsLoading(true);
    setFetchError(null);

    try {
      const data = await searchProviders(filters);
      setResults(data);
    } catch (error) {
      setFetchError(error instanceof Error ? error.message : "Failed to load providers.");
    } finally {
      setIsLoading(false);
      setHasLoaded(true);
    }
  }, []);

  useEffect(() => {
    const filters: SearchFilters = {
      city: searchParams.get("city") || null,
      service_type: searchParams.get("service") || null,
      is_available: searchParams.get("available") === "true" ? true : null,
      min_rating: searchParams.get("rating") ? Number(searchParams.get("rating")) : null,
    };

    setCity(searchParams.get("city") ?? "");
    setServiceType(searchParams.get("service") ?? "");
    setIsAvailable(searchParams.get("available") === "true");
    setMinRating(searchParams.get("rating") ?? "");

    fetchProviders(filters);
  }, [fetchProviders, searchParams]);

  function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const params = new URLSearchParams();
    if (city.trim()) params.set("city", city.trim());
    if (serviceType) params.set("service", serviceType);
    if (isAvailable) params.set("available", "true");
    if (minRating) params.set("rating", minRating);

    const query = params.toString();
    router.push(query ? `/search?${query}` : "/search");
  }

  const activeCity = searchParams.get("city");
  const resultLabel = activeCity
    ? `${results.length} provider${results.length !== 1 ? "s" : ""} found in ${activeCity}`
    : `${results.length} provider${results.length !== 1 ? "s" : ""} found`;

  return (
    <main className="min-h-screen bg-[#FDF8F3]">
      <div className="mx-auto w-full max-w-6xl px-4 py-8">
        <SignupNudge
          message="Sign up free to book appointments, save favourites and manage your dog's health records"
          ctaText="Join Free"
        />
      </div>

      <div className="border-y border-orange-100 bg-white/80 px-4 py-5">
        <div className="mx-auto w-full max-w-6xl">
          <h1 className="mb-4 text-3xl text-slate-900">Find Services</h1>
          <form onSubmit={handleSearch} className="flex flex-wrap gap-3">
            <input
              type="text"
              placeholder="Search by city e.g. Bangalore"
              value={city}
              onChange={(event) => setCity(event.target.value)}
              className="min-w-[220px] flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#E8602C] focus:outline-none focus:ring-1 focus:ring-[#E8602C]"
            />

            <select
              value={serviceType}
              onChange={(event) => setServiceType(event.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-[#E8602C] focus:outline-none focus:ring-1 focus:ring-[#E8602C]"
            >
              <option value="">All Services</option>
              {SERVICE_TYPES.map((service) => (
                <option key={service.value} value={service.value}>
                  {service.label}
                </option>
              ))}
            </select>

            <label className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={isAvailable}
                onChange={(event) => setIsAvailable(event.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-[#E8602C] focus:ring-[#E8602C]"
              />
              Available now
            </label>

            <select
              value={minRating}
              onChange={(event) => setMinRating(event.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-[#E8602C] focus:outline-none focus:ring-1 focus:ring-[#E8602C]"
            >
              <option value="">Any</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
              <option value="4.5">4.5+</option>
            </select>

            <button
              type="submit"
              className="rounded-lg bg-[#E8602C] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#cf5222]"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      <div className="mx-auto w-full max-w-6xl px-4 py-8">
        {fetchError && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {fetchError}
          </div>
        )}

        {!isLoading && hasLoaded && <p className="mb-5 text-sm text-slate-600">{resultLabel}</p>}

        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }, (_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        ) : results.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((provider) => (
              <PublicProviderCard key={provider.id} provider={provider} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center rounded-2xl border border-dashed border-slate-300 bg-white py-20 text-center">
            <div className="text-6xl" aria-hidden="true">🔎</div>
            <h2 className="mt-4 text-2xl text-slate-900">No providers found</h2>
            <p className="mt-2 max-w-sm text-sm text-slate-600">Try a different city or service type</p>
          </div>
        )}
      </div>
    </main>
  );
}

export default function PublicSearchPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#FDF8F3]">
          <p className="text-slate-600">Loading search...</p>
        </main>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
