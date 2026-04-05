import type { ProviderReview } from "@/lib/types/provider";

// ── Helpers ────────────────────────────────────────────────────────────────

function StarRow({ filled, size = "md" }: { filled: number; size?: "sm" | "md" | "lg" }) {
  const dim =
    size === "lg" ? "h-6 w-6" : size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";
  return (
    <div className="flex items-center gap-0.5" aria-label={`${filled} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          className={`${dim} ${i < filled ? "text-brand" : "text-border"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function ratingLabel(r: number): string {
  if (r >= 5) return "Excellent";
  if (r >= 4) return "Very Good";
  if (r >= 3) return "Good";
  if (r >= 2) return "Fair";
  return "Poor";
}

/** Derive up to 2 initials from a display name or fall back to UUID chars. */
function initials(displayName: string | null, uuid: string): string {
  if (displayName) {
    const parts = displayName.trim().split(/\s+/);
    return parts
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() ?? "")
      .join("");
  }
  // Fallback: two hex chars from the UUID
  return `${uuid[0]?.toUpperCase() ?? "U"}${uuid[2]?.toUpperCase() ?? "S"}`;
}

// ── Rating summary ─────────────────────────────────────────────────────────

function RatingSummary({
  reviews,
  avg,
  count,
}: {
  reviews: ProviderReview[];
  avg: number;
  count: number;
}) {
  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
    pct: count > 0 ? (reviews.filter((r) => r.rating === star).length / count) * 100 : 0,
  }));

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
      {/* Big average */}
      <div className="flex flex-col items-center sm:items-start">
        <p className="font-fraunces text-5xl font-black text-ink leading-none">
          {avg.toFixed(1)}
        </p>
        <StarRow filled={Math.round(avg)} size="md" />
        <p className="mt-1 text-xs text-muted">
          {count} review{count !== 1 ? "s" : ""}
        </p>
        <p className="text-xs font-semibold text-brand">{ratingLabel(avg)}</p>
      </div>

      {/* Distribution bars */}
      <div className="flex-1 space-y-1.5 min-w-0">
        {distribution.map(({ star, count: c, pct }) => (
          <div key={star} className="flex items-center gap-2 text-xs">
            <span className="w-3 flex-shrink-0 text-right text-muted">{star}</span>
            <svg className="h-3 w-3 flex-shrink-0 text-brand" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <div className="flex-1 overflow-hidden rounded-full bg-border">
              <div
                className="h-1.5 rounded-full bg-brand transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="w-4 flex-shrink-0 text-right text-muted">{c}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Single review card ─────────────────────────────────────────────────────

function ReviewCard({ review }: { review: ProviderReview }) {
  const name = review.reviewer_display_name ?? "Dog Parent";
  const avatarInitials = initials(review.reviewer_display_name, review.reviewer_id);
  const date = new Date(review.created_at).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <article className="rounded-xl border border-border bg-bg p-4">
      <div className="flex items-start gap-3">
        {/* Initials avatar */}
        <div
          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-brand-light text-sm font-bold text-brand"
          aria-hidden="true"
        >
          {avatarInitials}
        </div>

        <div className="min-w-0 flex-1">
          {/* Row: name + date */}
          <div className="flex flex-wrap items-center justify-between gap-1">
            <p className="text-sm font-semibold text-ink">{name}</p>
            <time className="text-xs text-muted" dateTime={review.created_at}>
              {date}
            </time>
          </div>

          {/* Stars + label */}
          <div className="mt-1 flex items-center gap-2">
            <StarRow filled={review.rating} size="sm" />
            <span className="text-xs font-medium text-brand">{ratingLabel(review.rating)}</span>
          </div>

          {/* Comment */}
          {review.comment && (
            <p className="mt-2 text-sm leading-relaxed text-muted">{review.comment}</p>
          )}
        </div>
      </div>
    </article>
  );
}

// ── Public export ──────────────────────────────────────────────────────────

export default function ProviderReviewsSection({
  reviews,
  avgRating,
  reviewCount,
}: {
  reviews: ProviderReview[];
  avgRating: number;
  reviewCount: number;
}) {
  return (
    <section className="card">
      {/* Header */}
      <div className="flex items-baseline gap-2">
        <h2 className="font-semibold text-ink">Reviews</h2>
        {reviewCount > 0 && (
          <span className="text-sm text-muted">({reviewCount})</span>
        )}
      </div>

      {reviews.length === 0 ? (
        <div className="mt-6 flex flex-col items-center gap-2 py-6 text-center">
          <span className="text-4xl" aria-hidden="true">🐾</span>
          <p className="text-sm font-medium text-ink">No reviews yet</p>
          <p className="text-xs text-muted">
            Be the first to review this provider after your booking.
          </p>
        </div>
      ) : (
        <>
          {/* Summary */}
          <div className="mt-4 rounded-xl bg-bg p-4">
            <RatingSummary reviews={reviews} avg={avgRating} count={reviewCount} />
          </div>

          {/* Review list */}
          <div className="mt-4 space-y-3">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
