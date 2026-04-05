import PetOwnerBookingsClient from "@/app/dashboard/pet-owner/bookings/bookings-client";
import { getMyBookings } from "@/lib/actions/bookings";
import { getMyReviewedProviderIds } from "@/lib/actions/reviews";

export default async function PetOwnerBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>;
}) {
  const [bookings, reviewedProviderIds, params] = await Promise.all([
    getMyBookings(),
    getMyReviewedProviderIds(),
    searchParams,
  ]);
  const success = params.success === "true";

  return (
    <PetOwnerBookingsClient
      bookings={bookings}
      success={success}
      reviewedProviderIds={reviewedProviderIds}
    />
  );
}
