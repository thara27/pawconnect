"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import PublicProviderCard from "@/app/components/providers/PublicProviderCard";
import { searchProviders } from "@/lib/actions/providers";
import { SERVICE_TYPES } from "@/lib/types/provider";
import type { ProviderSearchResult, SearchFilters } from "@/lib/types/provider";

function SkeletonCard() {
  return (
    <div className="card">
      <div className="flex items-start gap-4">
        <div className="skeleton h-14 w-14 rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="skeleton h-4 w-3/5" />
          <div className="skeleton h-3 w-1/3" />
        </div>
      </div>
      <div className="skeleton mt-4 h-3 w-1/2" />
      <div className="skeleton mt-2 h-3 w-2/3" />
      <div className="skeleton mt-5 h-8 w-28" />
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
    <main className="page-wrapper">
      <div className="bg-white px-4 py-5 shadow-sm">
        <div className="mx-auto w-full max-w-6xl">
          <h1 className="heading-md mb-4">Find Services</h1>
          <form onSubmit={handleSearch} className="flex flex-wrap gap-3">
            <input
              type="text"
              placeholder="Search by city e.g. Bangalore"
              value={city}
              onChange={(event) => setCity(event.target.value)}
              className="min-w-[220px] flex-1"
            />

            <select
              value={serviceType}
              onChange={(event) => setServiceType(event.target.value)}
              style={{ width: 'auto' }}
            >
              <option value="">All Services</option>
              {SERVICE_TYPES.map((service) => (
                <option key={service.value} value={service.value}>
                  {service.label}
                </option>
              ))}
            </select>

            <label className="flex items-center gap-2 rounded-lg border border-border bg-white px-4 py-2.5 text-sm text-ink cursor-pointer">
              <input
                type="checkbox"
                checked={isAvailable}
                onChange={(event) => setIsAvailable(event.target.checked)}
                className="h-4 w-4"
                style={{ width: 'auto', minHeight: 'auto' }}
              />
              Available now
            </label>

            <select
              value={minRating}
              onChange={(event) => setMinRating(event.target.value)}
              style={{ width: 'auto' }}
            >
              <option value="">Any</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
              <option value="4.5">4.5+</option>
            </select>

            <button type="submit" className="btn btn-primary">
              Search
            </button>
          </form>
        </div>
      </div>

      <div className="mx-auto w-full max-w-6xl px-4 py-8">
        {fetchError && (
          <div className="alert alert-error mb-5">
            {fetchError}
          </div>
        )}

        {!isLoading && hasLoaded && <p className="mb-5 text-sm text-muted">{resultLabel}</p>}

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
          <div className="empty-state card">
            <div className="empty-state-icon">🔎</div>
            <h2 className="empty-state-title">No providers found</h2>
            <p className="empty-state-desc">Try a different city or service type</p>
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
          <p className="text-muted">Loading search...</p>
        </main>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
