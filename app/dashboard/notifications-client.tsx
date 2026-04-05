"use client";

import Link from "next/link";
import type { Notification } from "@/lib/types/booking";
import EmptyState from "@/app/components/ui/EmptyState";

function iconForType(type: string): string {
  if (type === "booking_request") return "📝";
  if (type === "booking_confirmed") return "✅";
  if (type === "booking_cancelled") return "❌";
  return "🔔";
}

function timeAgo(dateString: string): string {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

type Props = {
  notifications: Notification[];
  backHref: string;
};

export default function NotificationsClient({ notifications, backHref }: Props) {
  return (
    <main className="bg-bg px-4 py-6">
      <section className="mx-auto w-full max-w-2xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-ink">Notifications</h1>
            <p className="mt-1 text-sm text-muted">
              {notifications.length === 0
                ? "You have no notifications yet."
                : `${notifications.length} notification${notifications.length !== 1 ? "s" : ""}`}
            </p>
          </div>
          <Link
            href={backHref}
            className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-ink hover:bg-bg"
          >
            ← Back
          </Link>
        </div>

        {notifications.length === 0 ? (
          <EmptyState
            emoji="🔔"
            title="All caught up!"
            description="No notifications yet. They'll show up here when you get bookings or updates."
          />
        ) : (
          <ul className="space-y-3">
            {notifications.map((n) => (
              <li
                key={n.id}
                className={`rounded-2xl border p-4 ${
                  n.is_read
                    ? "border-border bg-white"
                    : "border-brand/30 bg-brand-light/20"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 text-xl leading-none">{iconForType(n.type)}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-ink">{n.title}</p>
                    <p className="mt-0.5 text-sm text-muted">{n.message}</p>
                    <p className="mt-1.5 text-xs text-muted">{timeAgo(n.created_at)}</p>
                  </div>
                  {!n.is_read && (
                    <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-brand" />
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
