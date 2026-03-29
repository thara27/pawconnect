"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { createClient } from "@/lib/supabase/client";
import { getNotifications, markNotificationsRead } from "@/lib/actions/bookings";
import type { Notification } from "@/lib/types/booking";

type NotificationsBellProps = {
  userId: string | null;
};

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

export default function NotificationsBell({ userId }: NotificationsBellProps) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Notification[]>([]);
  const [error, setError] = useState<string | null>(null);

  const unreadCount = useMemo(
    () => items.filter((notification) => !notification.is_read).length,
    [items],
  );

  useEffect(() => {
    if (!userId) {
      return;
    }

    void (async () => {
      try {
        const data = await getNotifications();
        setItems(data);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Failed to load notifications.");
      }
    })();
  }, [userId]);

  useEffect(() => {
    if (!userId) {
      return;
    }

    const supabase = createClient();
    const channel = supabase
      .channel("notifications-live")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const next = payload.new as Notification;
          setItems((current) => [next, ...current]);
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [userId]);

  async function handleToggle() {
    const nextOpen = !open;
    setOpen(nextOpen);

    if (nextOpen) {
      await markNotificationsRead();
      setItems((current) => current.map((notification) => ({ ...notification, is_read: true })));
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleToggle}
        className="relative rounded-full border border-border bg-white p-2 text-ink shadow-sm transition hover:border-brand hover:bg-brand-light"
        aria-label="Notifications"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>

        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white ring-2 ring-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-border bg-white p-3 shadow-xl">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-semibold text-ink">Notifications</p>
            <button
              type="button"
              onClick={async () => {
                await markNotificationsRead();
                setItems((current) => current.map((notification) => ({ ...notification, is_read: true })));
              }}
              className="text-xs font-semibold text-brand hover:underline"
            >
              Mark all read
            </button>
          </div>

          {error && <p className="mb-2 text-xs text-red-600">{error}</p>}

          {items.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted">No notifications yet.</p>
          ) : (
            <ul className="max-h-80 space-y-2 overflow-y-auto">
              {items.slice(0, 12).map((notification) => (
                <li
                  key={notification.id}
                  className={`rounded-lg border px-3 py-2 ${
                    notification.is_read ? "border-border bg-white" : "border-brand bg-brand-light"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <span aria-hidden="true">{iconForType(notification.type)}</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-ink">{notification.title}</p>
                      <p className="mt-0.5 text-xs text-muted">{notification.message}</p>
                      <p className="mt-1 text-[11px] text-muted">{timeAgo(notification.created_at)}</p>
                      {notification.booking_id && (
                        <Link
                          href="/dashboard"
                          className="mt-1 inline-block text-[11px] font-semibold text-brand hover:underline"
                        >
                          Open dashboard
                        </Link>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
