"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";

import { createReview } from "@/lib/actions/reviews";
import type { ReviewState } from "@/lib/actions/reviews";

const initialReviewState: ReviewState = { success: false, error: null };

// ── Star picker ──────────────────────────────────────────────────────────────

function StarPicker({ bookingId }: { bookingId: string }) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const active = hovered || rating;

  return (
    <div className="flex items-center gap-1">
      {/* hidden input carries the value on form submit */}
      <input type="hidden" name="rating" value={rating} />
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          aria-label={`Rate ${star} out of 5`}
          onClick={() => setRating(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="focus:outline-none"
          id={`star-${bookingId}-${star}`}
        >
          <svg
            className={`h-7 w-7 transition-colors ${
              star <= active ? "text-[#FF5722]" : "text-[#D4C5B0]"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      ))}
      {rating > 0 && (
        <span className="ml-1 text-xs font-medium text-stone-500">
          {["", "Poor", "Fair", "Good", "Great", "Excellent"][rating]}
        </span>
      )}
    </div>
  );
}

// ── Submit button ────────────────────────────────────────────────────────────

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="btn btn-primary btn-sm disabled:opacity-60"
    >
      {pending ? "Submitting…" : "Submit review"}
    </button>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

type Props = {
  bookingId: string;
  providerId: string;
  providerName: string;
  onSuccess: (providerId: string) => void;
};

export default function ReviewForm({ bookingId, providerId, providerName, onSuccess }: Props) {
  const [open, setOpen] = useState(false);
  const [state, formAction] = useActionState<ReviewState, FormData>(
    createReview,
    initialReviewState,
  );

  // Notify parent so it can hide this form across all bookings for this provider
  useEffect(() => {
    if (state.success) {
      onSuccess(providerId);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.success]);

  // Collapsed trigger
  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="btn btn-outline btn-sm"
      >
        ⭐ Leave a review
      </button>
    );
  }

  // Success state — shown inside the card
  if (state.success) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 px-3 py-2.5 text-sm font-medium text-green-700">
        ✓ Thank you! Your review has been submitted.
      </div>
    );
  }

  return (
    <form
      action={formAction}
      className="mt-2 space-y-3 rounded-xl border border-[#EDE3D4] bg-[#FFFCF7] p-4"
    >
      <p className="text-sm font-semibold text-stone-800">
        How was your experience with {providerName}?
      </p>

      {/* Hidden booking context — provider_id is resolved server-side from the booking */}
      <input type="hidden" name="booking_id" value={bookingId} />

      {/* Star rating */}
      <div>
        <label className="mb-1.5 block text-xs font-medium text-stone-600">
          Rating <span className="text-red-500">*</span>
        </label>
        <StarPicker bookingId={bookingId} />
      </div>

      {/* Comment */}
      <div>
        <label
          htmlFor={`comment-${bookingId}`}
          className="mb-1 block text-xs font-medium text-stone-600"
        >
          Comment{" "}
          <span className="font-normal text-stone-400">(optional)</span>
        </label>
        <textarea
          id={`comment-${bookingId}`}
          name="comment"
          rows={3}
          placeholder="Tell others what to expect…"
          className="w-full resize-none rounded-lg border border-[#EBEBEB] bg-white px-3 py-2 text-sm text-stone-800 placeholder:text-stone-400 focus:border-[#FF5722] focus:outline-none"
        />
      </div>

      {/* Error */}
      {state.error && (
        <p className="text-xs font-medium text-red-600">{state.error}</p>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2">
        <SubmitButton />
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="btn btn-ghost btn-sm text-muted"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
