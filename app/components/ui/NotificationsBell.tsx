"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

import { createClient } from "@/lib/supabase/client";
import {
  getNotifications,
  markNotificationRead,
  markNotificationsRead,
} from "@/lib/actions/bookings";
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
  const containerRef = useRef<HTMLDivElement>(null);

  const unreadCount = useMemo(
    () => items.filter((n) => !n.is_read).length,
    [items],
  );

  // Initial load
  useEffect(() => {
    if (!userId) return;

    void (async () => {
      try {
        const data = await getNotifications();
        setItems(data);
      } catch {
        setError("Could not load notifications.");
      }
    })();
  }, [userId]);

  // Real-time subscription
  useEffect(() => {
    if (!userId) return;

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
          setItems((current) => [payload.new as Notification, ...current]);
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [userId]);

  // Click-outside to close
  useEffect(() => {
    if (!open) return;

    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  async function handleItemClick(id: string) {
    const item = items.find((n) => n.id === id);
    if (!item || item.is_read) return;

    setItems((current) =>
      current.map((n) => (n.id === id ? { ...n, is_read: true } : n)),
    );
    await markNotificationRead(id);
  }

  async function handleMarkAllRead() {
    setItems((current) => current.map((n) => ({ ...n, is_read: true })));
    await markNotificationsRead();
  }

  return (
    <div className="relative" ref={containerRef}>
      {/* Bell button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white text-ink shadow-sm transition hover:border-brand hover:bg-brand-light"
        aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
        aria-expanded={open}
        aria-haspopup="true"
      >
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>

        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white ring-2 ring-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown — always in DOM so CSS transition works on both open and close */}
      <div
        className={`absolute right-0 z-50 mt-2 w-80 rounded-2xl border border-border bg-white shadow-xl transition-all duration-200 ease-out origin-top-right ${
          open
            ? "pointer-events-auto scale-100 opacity-100"
            : "pointer-events-none scale-95 opacity-0"
        }`}
        role="dialog"
        aria-label="Notifications panel"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <p className="text-sm font-semibold text-ink">Notifications</p>
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={handleMarkAllRead}
              className="text-xs font-semibold text-brand hover:underline"
            >
              Mark all read
            </button>
          )}
        </div>

        {/* Body */}
        <div className="p-3">
          {error && (
            <p className="mb-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">{error}</p>
          )}

          {items.length === 0 ? (
            <div className="flex flex-col items-center gap-1 py-8 text-center">
              <span className="text-3xl" aria-hidden="true">🐾</span>
              <p className="text-sm font-medium text-ink">No notifications yet</p>
              <p className="text-xs text-muted">You're all caught up!</p>
            </div>
          ) : (
            <ul className="max-h-[340px] space-y-1.5 overflow-y-auto pr-0.5">
              {items.slice(0, 15).map((notification) => (
                <li key={notification.id}>
                  <button
                    type="button"
                    onClick={() => handleItemClick(notification.id)}
                    className={`w-full rounded-xl border px-3 py-2.5 text-left transition hover:shadow-sm ${
                      notification.is_read
                        ? "border-border bg-white hover:bg-gray-50"
                        : "border-brand/40 bg-brand-light hover:bg-orange-100"
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <span className="mt-0.5 text-base leading-none" aria-hidden="true">
                        {iconForType(notification.type)}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-1">
                          <p className={`text-sm leading-snug ${notification.is_read ? "font-normal text-ink" : "font-semibold text-ink"}`}>
                            {notification.title}
                          </p>
                          {!notification.is_read && (
                            <span className="mt-1 inline-block h-2 w-2 flex-shrink-0 rounded-full bg-brand" />
                          )}
                        </div>
                        <p className="mt-0.5 text-xs text-muted">{notification.message}</p>
                        <p className="mt-1 text-[11px] text-muted/70">{timeAgo(notification.created_at)}</p>
                        {notification.booking_id && (
                          <Link
                            href="/dashboard"
                            onClick={() => setOpen(false)}
                            className="mt-1 inline-block text-[11px] font-semibold text-brand hover:underline"
                          >
                            Open dashboard →
                          </Link>
                        )}
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
