import PetOwnerBookingsClient from "@/app/dashboard/pet-owner/bookings/bookings-client";
import { getMyBookings } from "@/lib/actions/bookings";

export default async function PetOwnerBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>;
}) {
  const [bookings, params] = await Promise.all([getMyBookings(), searchParams]);
  const success = params.success === "true";

  return <PetOwnerBookingsClient bookings={bookings} success={success} />;
}
