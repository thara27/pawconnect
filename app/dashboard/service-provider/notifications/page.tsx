import { getNotifications, markNotificationsRead } from "@/lib/actions/bookings";
import NotificationsClient from "@/app/dashboard/notifications-client";

export default async function ServiceProviderNotificationsPage() {
  const notifications = await getNotifications();
  await markNotificationsRead();

  return (
    <NotificationsClient
      notifications={notifications}
      backHref="/dashboard/service-provider"
    />
  );
}
