"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

export type ReviewState = {
  success: boolean;
  error: string | null;
  alreadyReviewed?: boolean;
};

export async function createReview(
  _prevState: ReviewState,
  formData: FormData,
): Promise<ReviewState> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: "You must be logged in to leave a review." };
  }

  const bookingId = formData.get("booking_id") as string | null;
  const ratingRaw = formData.get("rating") as string | null;
  const comment = ((formData.get("comment") as string) ?? "").trim() || null;

  // provider_id from formData is used only as a hint for early exit;
  // the authoritative value is taken from the DB-verified booking below.

  if (!bookingId) {
    return { success: false, error: "Invalid request." };
  }

  const rating = Number.parseInt(ratingRaw ?? "", 10);
  if (!rating || rating < 1 || rating > 5) {
    return { success: false, error: "Please select a star rating before submitting." };
  }

  // Verify booking exists, belongs to this user, and is completed
  const { data: booking, error: bookingError } = await supabase
    .from("bookings")
    .select("id, status, pet_owner_id, provider_id")
    .eq("id", bookingId)
    .eq("pet_owner_id", user.id)
    .maybeSingle();

  if (bookingError || !booking) {
    return { success: false, error: "Booking not found." };
  }

  if (booking.status !== "completed") {
    return { success: false, error: "You can only review completed bookings." };
  }

  // Use the DB-verified provider_id from the booking — never trust the form field.
  const verifiedProviderId = booking.provider_id;

  const { error: insertError } = await supabase.from("provider_reviews").insert({
    provider_id: verifiedProviderId,
    reviewer_id: user.id,
    rating,
    comment,
  });

  if (insertError) {
    // PostgreSQL unique constraint violation
    if (insertError.code === "23505") {
      return {
        success: false,
        error: "You have already reviewed this provider.",
        alreadyReviewed: true,
      };
    }
    return { success: false, error: "Could not submit your review. Please try again." };
  }

  revalidatePath(`/providers/${verifiedProviderId}`);
  revalidatePath("/dashboard/pet-owner/bookings");

  return { success: true, error: null };
}

/** Returns the provider_profile IDs that the current user has already reviewed. */
export async function getMyReviewedProviderIds(): Promise<string[]> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("provider_reviews")
    .select("provider_id")
    .eq("reviewer_id", user.id);

  if (error || !data) return [];
  return data.map((r) => r.provider_id as string);
}
