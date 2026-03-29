import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import SignupNudge from "@/app/components/ui/SignupNudge";
import { getProviderById } from "@/lib/actions/providers";
import { DAYS_OF_WEEK, PRICE_UNITS, SERVICE_TYPES } from "@/lib/types/provider";
import type { ProviderReview } from "@/lib/types/provider";

function StarRating({ rating, large = false }: { rating: number; large?: boolean }) {
  const filled = Math.round(rating);
  const size = large ? "h-5 w-5" : "h-4 w-4";

  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, index) => (
        <svg
          key={index}
          className={`${size} ${index < filled ? "text-brand" : "text-border"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: ProviderReview }) {
  return (
    <article className="card">
      <div className="flex items-center justify-between">
        <StarRating rating={review.rating} />
        <time className="text-xs text-muted" dateTime={review.created_at}>
          {new Date(review.created_at).toLocaleDateString("en-IN", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </time>
      </div>
      {review.comment && <p className="mt-2 text-sm text-muted">{review.comment}</p>}
    </article>
  );
}

export default async function PublicProviderDetailPage({
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
    SERVICE_TYPES.find((serviceType) => serviceType.value === provider.service_type)
      ?.label ?? provider.service_type;
  const priceUnitLabel =
    PRICE_UNITS.find((unit) => unit.value === provider.price_unit)?.label ?? provider.price_unit;

  const availabilityMap = new Map(provider.availability.map((slot) => [slot.day_of_week, slot]));

  return (
    <main className="bg-bg px-4 py-8 pb-24 md:pb-10">
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <Link href="/search" className="inline-flex items-center gap-1 text-sm text-muted hover:text-ink">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to search
        </Link>

        <section className="card">
          <div className="flex flex-col gap-5 sm:flex-row">
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
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-light text-2xl font-bold text-brand">
                  {provider.business_name
                    .split(/\s+/)
                    .slice(0, 2)
                    .map((word) => word[0]?.toUpperCase() ?? "")
                    .join("")}
                </div>
              )}
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="heading-sm">{provider.business_name}</h1>
                <span className="badge badge-brand">
                  {serviceLabel}
                </span>
                <span
                  className={`${
                    provider.is_available
                      ? "badge badge-success"
                      : "badge badge-neutral"
                  }`}
                >
                  {provider.is_available ? "Available" : "Unavailable"}
                </span>
              </div>

              <div className="mt-2 flex items-center gap-2">
                <StarRating rating={provider.avg_rating} large />
                <span className="text-sm text-muted">
                  {provider.avg_rating > 0 ? provider.avg_rating.toFixed(1) : "No ratings yet"}
                  {provider.review_count > 0 && (
                    <span className="ml-1 text-muted">({provider.review_count})</span>
                  )}
                </span>
              </div>

              <p className="mt-2 text-sm text-muted">{provider.city}, {provider.state}</p>
              <p className="text-sm text-muted">{provider.phone}</p>
              {provider.website && (
                <a
                  href={provider.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-block text-sm text-brand hover:underline"
                >
                  {provider.website}
                </a>
              )}
            </div>
          </div>
        </section>

        <SignupNudge
          message={`Want to book with ${provider.business_name}? Create a free account to book, message and review.`}
          ctaText="Sign up to book"
        />

        <section className="card">
          <h2 className="heading-sm">Pricing</h2>
          <p className="mt-2 text-sm text-muted">
            {provider.price_from !== null && provider.price_to !== null
              ? `₹${provider.price_from.toLocaleString("en-IN")} – ₹${provider.price_to.toLocaleString("en-IN")}`
              : "Pricing not listed"}
            {provider.price_unit && (
              <span className="text-muted"> / {priceUnitLabel.replace(/_/g, " ")}</span>
            )}
          </p>
          {provider.years_experience !== null && (
            <p className="mt-1 text-sm text-muted">Experience: {provider.years_experience} years</p>
          )}
          {provider.license_number && (
            <p className="mt-1 text-sm text-muted">License: {provider.license_number}</p>
          )}
        </section>

        <section className="card">
          <h2 className="heading-sm">Weekly Schedule</h2>
          <table className="mt-3 w-full text-sm text-ink">
            <tbody className="divide-y divide-border">
              {DAYS_OF_WEEK.map((day, dayIndex) => {
                const slot = availabilityMap.get(dayIndex);
                return (
                  <tr key={day} className={slot ? "text-ink" : "text-muted"}>
                    <td className="py-2 font-medium">{day}</td>
                    <td className="py-2 text-right">
                      {slot ? `${slot.open_time.slice(0, 5)} - ${slot.close_time.slice(0, 5)}` : "Closed"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>

        {provider.description && (
          <section className="card">
            <h2 className="heading-sm">About</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">{provider.description}</p>
          </section>
        )}

        <section className="card">
          <h2 className="heading-sm">Reviews</h2>
          {reviews.length > 0 ? (
            <div className="mt-4 space-y-3">
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          ) : (
            <p className="mt-2 text-sm text-muted">No reviews yet.</p>
          )}
        </section>
      </div>

      <div className="fixed bottom-0 left-0 right-0 border-t border-border bg-white px-4 py-3 md:hidden">
        <Link
          href="/signup"
          className="block btn btn-primary btn-full"
        >
          Sign up to book
        </Link>
      </div>
    </main>
  );
}
