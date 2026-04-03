import { getNotifications, markNotificationsRead } from "@/lib/actions/bookings";
import NotificationsClient from "@/app/dashboard/notifications-client";

export default async function PetOwnerNotificationsPage() {
  const notifications = await getNotifications();
  await markNotificationsRead();

  return (
    <NotificationsClient
      notifications={notifications}
      backHref="/dashboard/pet-owner"
    />
  );
}
