import ProviderBookingsClient from "@/app/dashboard/service-provider/bookings/provider-bookings-client";
import { getProviderBookings } from "@/lib/actions/bookings";
import { getMyProfile } from "@/lib/actions/providers";

export default async function ServiceProviderBookingsPage() {
  const [bookings, profileResult] = await Promise.all([getProviderBookings(), getMyProfile()]);

  const providerProfileId = profileResult.profile?.id ?? "";

  const todayISO = new Date().toISOString().slice(0, 10);
  const monthKey = new Date().toISOString().slice(0, 7);

  const todayCount = bookings.filter(
    (booking) => booking.booking_date === todayISO && booking.status === "confirmed",
  ).length;

  const pendingCount = bookings.filter((booking) => booking.status === "pending").length;

  const completedThisMonth = bookings.filter(
    (booking) => booking.status === "completed" && booking.booking_date.startsWith(monthKey),
  ).length;

  const earningsThisMonth = bookings
    .filter(
      (booking) => booking.status === "completed" && booking.booking_date.startsWith(monthKey),
    )
    .reduce((total, booking) => total + (booking.total_price ?? 0), 0);

  return (
    <ProviderBookingsClient
      initialBookings={bookings}
      providerProfileId={providerProfileId}
      todayCount={todayCount}
      pendingCount={pendingCount}
      completedThisMonth={completedThisMonth}
      earningsThisMonth={earningsThisMonth}
    />
  );
}
