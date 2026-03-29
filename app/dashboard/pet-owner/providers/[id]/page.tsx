import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getProviderById } from "@/lib/actions/providers";
import { SERVICE_TYPES, DAYS_OF_WEEK, PRICE_UNITS } from "@/lib/types/provider";
import type { ProviderReview } from "@/lib/types/provider";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function StarRating({ rating, large = false }: { rating: number; large?: boolean }) {
  const filled = Math.round(rating);
  const size = large ? "h-5 w-5" : "h-4 w-4";
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          className={`${size} ${i < filled ? "text-brand" : "text-border"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function InitialsAvatar({ seed, sizeClass }: { seed: string; sizeClass: string }) {
  // Derive two initials from a UUID (use hex chars at positions 0 and 2)
  const a = seed[0]?.toUpperCase() ?? "U";
  const b = seed[2]?.toUpperCase() ?? "S";
  const initials = `${a}${b}`;
  return (
    <div
      className={`flex items-center justify-center rounded-full bg-bg font-semibold text-muted ${sizeClass}`}
    >
      {initials}
    </div>
  );
}

function ReviewCard({ review }: { review: ProviderReview }) {
  const date = new Date(review.created_at).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  return (
    <div className="rounded-xl border border-border bg-bg p-4">
      <div className="flex items-start gap-3">
        <InitialsAvatar seed={review.reviewer_id} sizeClass="h-9 w-9 flex-shrink-0 text-sm" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <StarRating rating={review.rating} />
            <time className="text-xs text-muted" dateTime={review.created_at}>
              {date}
            </time>
          </div>
          {review.comment && (
            <p className="mt-1.5 text-sm text-ink">{review.comment}</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default async function ProviderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getProviderById(id);

  if (!result) {
    notFound();
  }

  const { provider, reviews } = result;

  const serviceLabel =
    SERVICE_TYPES.find((s) => s.value === provider.service_type)?.label ??
    provider.service_type;

  const priceUnitLabel =
    PRICE_UNITS.find((u) => u.value === provider.price_unit)?.label ??
    provider.price_unit?.replace(/_/g, " ");

  // Build a set of open day indices for quick lookup
  const openDays = new Set(provider.availability.map((a) => a.day_of_week));

  return (
    <main className="min-h-screen bg-bg px-4 pb-28 pt-8 md:pb-10">
      <div className="mx-auto max-w-3xl space-y-6">
        {/* ---------------------------------------------------------------- */}
        {/* Back link                                                          */}
        {/* ---------------------------------------------------------------- */}
        <Link
          href="/dashboard/pet-owner/search"
          className="inline-flex items-center gap-1 text-sm text-muted transition hover:text-ink"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to search
        </Link>

        {/* ---------------------------------------------------------------- */}
        {/* HEADER                                                             */}
        {/* ---------------------------------------------------------------- */}
        <section className="card">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
            {/* Avatar */}
            <div className="relative h-20 w-20 flex-shrink-0">
              {provider.avatar_url ? (
                <Image
                  src={provider.avatar_url}
                  alt={provider.business_name}
                  fill
                  className="rounded-full object-cover"
                  sizes="80px"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-light text-2xl font-bold text-brand-dark">
                  {provider.business_name
                    .split(/\s+/)
                    .slice(0, 2)
                    .map((w) => w[0]?.toUpperCase() ?? "")
                    .join("")}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold text-ink">{provider.business_name}</h1>
                <span className="badge badge-brand">
                  {serviceLabel}
                </span>
                <span
                  className={`badge ${
                    provider.is_available
                      ? "badge-success"
                      : "badge-neutral"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      provider.is_available ? "bg-sage" : "bg-muted"
                    }`}
                  />
                  {provider.is_available ? "Available today" : "Unavailable"}
                </span>
              </div>

              <div className="mt-2 flex items-center gap-2">
                <StarRating rating={provider.avg_rating} large />
                <span className="text-sm text-muted">
                  {provider.avg_rating > 0
                    ? provider.avg_rating.toFixed(1)
                    : "No ratings yet"}
                  {provider.review_count > 0 && (
                    <span className="ml-1 text-muted">
                      ({provider.review_count} review{provider.review_count !== 1 ? "s" : ""})
                    </span>
                  )}
                </span>
              </div>

              <ul className="mt-3 space-y-1 text-sm text-muted">
                <li className="flex items-center gap-2">
                  <svg className="h-4 w-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {provider.address}, {provider.city}, {provider.state} – {provider.pincode}
                </li>
                <li className="flex items-center gap-2">
                  <svg className="h-4 w-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {provider.phone}
                </li>
                {provider.website && (
                  <li className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    <a
                      href={provider.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand hover:underline"
                    >
                      {provider.website}
                    </a>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* PRICING                                                            */}
        {/* ---------------------------------------------------------------- */}
        <section className="card">
          <h2 className="mb-4 font-semibold text-ink">Pricing &amp; experience</h2>
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {(provider.price_from !== null || provider.price_to !== null) && (
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-muted">
                  Price range
                </dt>
                <dd className="mt-1 text-sm font-semibold text-ink">
                  {provider.price_from !== null && provider.price_to !== null
                    ? `₹${provider.price_from.toLocaleString("en-IN")} – ₹${provider.price_to.toLocaleString("en-IN")}`
                    : provider.price_from !== null
                      ? `From ₹${provider.price_from.toLocaleString("en-IN")}`
                      : `Up to ₹${provider.price_to!.toLocaleString("en-IN")}`}
                  {priceUnitLabel && (
                    <span className="ml-1 font-normal text-muted">/ {priceUnitLabel}</span>
                  )}
                </dd>
              </div>
            )}
            {provider.years_experience !== null && (
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-muted">
                  Experience
                </dt>
                <dd className="mt-1 text-sm font-semibold text-ink">
                  {provider.years_experience} year{provider.years_experience !== 1 ? "s" : ""}
                </dd>
              </div>
            )}
            {provider.license_number && (
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-muted">
                  License
                </dt>
                <dd className="mt-1 text-sm text-ink">{provider.license_number}</dd>
              </div>
            )}
          </dl>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* WEEKLY SCHEDULE                                                    */}
        {/* ---------------------------------------------------------------- */}
        <section className="card">
          <h2 className="mb-4 font-semibold text-ink">Weekly schedule</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <tbody className="divide-y divide-border">
                {DAYS_OF_WEEK.map((day, idx) => {
                  const slot = provider.availability.find((a) => a.day_of_week === idx);
                  const isOpen = openDays.has(idx);
                  return (
                    <tr
                      key={day}
                      className={isOpen ? "text-ink" : "text-muted"}
                    >
                      <td className="py-2 pr-4 font-medium w-28">{day}</td>
                      <td className="py-2">
                        {isOpen && slot ? (
                          <span>
                            {slot.open_time.slice(0, 5)} – {slot.close_time.slice(0, 5)}
                          </span>
                        ) : (
                          <span className="italic">Closed</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* ABOUT                                                              */}
        {/* ---------------------------------------------------------------- */}
        {provider.description && (
          <section className="card">
            <h2 className="mb-3 font-semibold text-ink">About</h2>
            <p className="text-sm leading-relaxed text-muted">{provider.description}</p>
          </section>
        )}

        {/* ---------------------------------------------------------------- */}
        {/* REVIEWS                                                            */}
        {/* ---------------------------------------------------------------- */}
        <section className="card">
          <h2 className="mb-4 font-semibold text-ink">
            Reviews
            {provider.review_count > 0 && (
              <span className="ml-2 text-sm font-normal text-muted">
                ({provider.review_count})
              </span>
            )}
          </h2>
          {reviews.length > 0 ? (
            <div className="space-y-3">
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          ) : (
            <p className="text-sm italic text-muted">
              No reviews yet. Be the first to leave one!
            </p>
          )}
        </section>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* STICKY BOOK NOW (mobile)                                             */}
      {/* ------------------------------------------------------------------ */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-border bg-white px-4 py-3 md:hidden">
        <Link
          href={`/dashboard/pet-owner/providers/${provider.id}/book`}
          className="btn btn-primary btn-full"
        >
          Book now
        </Link>
      </div>

      {/* Desktop Book Now */}
      <div className="mx-auto mt-4 max-w-3xl px-4 hidden md:block">
        <Link
          href={`/dashboard/pet-owner/providers/${provider.id}/book`}
          className="btn btn-primary"
        >
          Book now
        </Link>
      </div>
    </main>
  );
}
