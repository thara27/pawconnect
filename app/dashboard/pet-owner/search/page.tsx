"use client";

import { Suspense, useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { searchProviders } from "@/lib/actions/providers";
import { SERVICE_TYPES } from "@/lib/types/provider";
import type { ProviderSearchResult, SearchFilters } from "@/lib/types/provider";
import ProviderCard from "@/app/components/providers/ProviderCard";
import { Analytics } from "@/lib/analytics";

// ---------------------------------------------------------------------------
// Skeleton card while loading
// ---------------------------------------------------------------------------
function SkeletonCard() {
  return (
    <div className="card animate-pulse p-5">
      <div className="flex items-start gap-4">
        <div className="h-14 w-14 flex-shrink-0 rounded-full bg-border" />
        <div className="flex-1 space-y-2 pt-1">
          <div className="h-4 w-3/4 rounded bg-border" />
          <div className="h-3 w-1/3 rounded bg-border" />
        </div>
      </div>
      <div className="mt-3 h-3 w-1/3 rounded bg-border" />
      <div className="mt-2 h-3 w-1/2 rounded bg-border" />
      <div className="mt-4 flex justify-between">
        <div className="h-6 w-28 rounded-full bg-border" />
        <div className="h-8 w-24 rounded-lg bg-border" />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main search content (uses useSearchParams â€” must be inside Suspense)
// ---------------------------------------------------------------------------
function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Controlled filter inputs â€” initialised from URL
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
    } catch (err) {
      setFetchError(err instanceof Error ? err.message : "Failed to load providers.");
    } finally {
      setIsLoading(false);
      setHasLoaded(true);
    }
  }, []);

  // Re-fetch whenever URL search params change
  useEffect(() => {
    const filters: SearchFilters = {
      city: searchParams.get("city") || null,
      service_type: searchParams.get("service") || null,
      is_available: searchParams.get("available") === "true" ? true : null,
      min_rating: searchParams.get("rating") ? Number(searchParams.get("rating")) : null,
    };
    // Sync form inputs with URL
    setCity(searchParams.get("city") ?? "");
    setServiceType(searchParams.get("service") ?? "");
    setIsAvailable(searchParams.get("available") === "true");
    setMinRating(searchParams.get("rating") ?? "");

    fetchProviders(filters);
    Analytics.pageView("/dashboard/pet-owner/search");
  }, [searchParams, fetchProviders]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (city.trim()) params.set("city", city.trim());
    if (serviceType) params.set("service", serviceType);
    if (isAvailable) params.set("available", "true");
    if (minRating) params.set("rating", minRating);
    router.push(`/dashboard/pet-owner/search?${params.toString()}`);
  }

  const activeCity = searchParams.get("city");
  const resultLabel = isLoading
    ? ""
    : activeCity
      ? `${results.length} provider${results.length !== 1 ? "s" : ""} found in ${activeCity}`
      : `${results.length} provider${results.length !== 1 ? "s" : ""} available`;

  return (
    <main className="bg-bg">
      {/* ------------------------------------------------------------------ */}
      {/* Filters bar                                                          */}
      {/* ------------------------------------------------------------------ */}
      <div className="border-b border-border bg-white px-4 py-6">
        <div className="mx-auto max-w-6xl">
          <h1 className="mb-5 text-2xl font-semibold text-ink">Find pet services</h1>
          <form onSubmit={handleSearch} className="flex flex-wrap gap-3">
            {/* City */}
            <input
              type="text"
              placeholder="Search by city e.g. Bangalore"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="min-w-[200px] flex-1 rounded-lg border border-border px-4 py-2.5 text-sm text-ink placeholder:text-muted focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
            />

            {/* Service type */}
            <select
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
              className="rounded-lg border border-border px-4 py-2.5 text-sm text-ink focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
            >
              <option value="">All Services</option>
              {SERVICE_TYPES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>

            {/* Min rating */}
            <select
              value={minRating}
              onChange={(e) => setMinRating(e.target.value)}
              className="rounded-lg border border-border px-4 py-2.5 text-sm text-ink focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
            >
              <option value="">Any Rating</option>
              <option value="3">3+ stars</option>
              <option value="4">4+ stars</option>
              <option value="4.5">4.5+ stars</option>
            </select>

            {/* Available now toggle */}
            <label className="flex cursor-pointer select-none items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm text-ink transition hover:border-brand">
              <input
                type="checkbox"
                checked={isAvailable}
                onChange={(e) => setIsAvailable(e.target.checked)}
                className="rounded border-border" style={{ width: 'auto', minHeight: 'auto' }}
              />
              Available now
            </label>

            {/* Search button */}
            <button
              type="submit"
              className="btn btn-primary"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Results area                                                         */}
      {/* ------------------------------------------------------------------ */}
      <div className="mx-auto max-w-6xl px-4 py-8">
        {fetchError && (
          <div className="mb-6 alert alert-error">
            {fetchError}
          </div>
        )}

        {!isLoading && hasLoaded && (
          <p className="mb-5 text-sm text-muted">{resultLabel}</p>
        )}

        {isLoading ? (
          // Loading skeletons
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }, (_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : results.length > 0 ? (
          // Provider grid
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((provider) => (
              <ProviderCard key={provider.id} provider={provider} />
            ))}
          </div>
        ) : hasLoaded ? (
          // Empty state
          <div className="flex flex-col items-center py-24 text-center">
            <div className="mb-4 text-6xl" aria-hidden="true">ðŸ¾</div>
            <h2 className="text-lg font-semibold text-ink">No providers found</h2>
            <p className="mt-2 max-w-xs text-sm text-muted">
              Try a different city or service type, or remove some filters.
            </p>
          </div>
        ) : null}
      </div>
    </main>
  );
}

// ---------------------------------------------------------------------------
// Page wrapper â€” Suspense is required around useSearchParams
// ---------------------------------------------------------------------------
export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-bg">
          <p className="text-muted">Loadingâ€¦</p>
        </main>
      }
    >
      <SearchContent />
    </Suspense>
  );
}

