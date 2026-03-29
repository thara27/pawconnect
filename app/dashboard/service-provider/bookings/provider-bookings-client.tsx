"use client";

import Image from "next/image";
import { useEffect, useMemo, useState, useTransition } from "react";

import { createClient } from "@/lib/supabase/client";
import { updateBookingStatus } from "@/lib/actions/bookings";
import type { BookingStatus, BookingWithDetails } from "@/lib/types/booking";

type Tab = BookingStatus;

const TAB_LABELS: Array<{ key: Tab; label: string }> = [
  { key: "pending", label: "Pending" },
  { key: "confirmed", label: "Confirmed" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
];

type Props = {
  initialBookings: BookingWithDetails[];
  providerProfileId: string;
  todayCount: number;
  pendingCount: number;
  completedThisMonth: number;
  earningsThisMonth: number;
};

export default function ProviderBookingsClient({
  initialBookings,
  providerProfileId,
  todayCount,
  pendingCount,
  completedThisMonth,
  earningsThisMonth,
}: Props) {
  const [bookings, setBookings] = useState(initialBookings);
  const [tab, setTab] = useState<Tab>("pending");
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const filtered = useMemo(
    () => bookings.filter((booking) => booking.status === tab),
    [bookings, tab],
  );

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("provider-bookings")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "bookings",
          filter: `provider_id=eq.${providerProfileId}`,
        },
        (payload) => {
          const row = payload.new as { pet_owner_id?: string };
          setToast(`New booking request from ${row.pet_owner_id?.slice(0, 6) ?? "a pet owner"}!`);
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [providerProfileId]);

  function updateLocalStatus(bookingId: string, status: BookingStatus, cancellationReason?: string) {
    setBookings((current) =>
      current.map((booking) =>
        booking.id === bookingId
          ? {
              ...booking,
              status,
              cancellation_reason: status === "cancelled" ? cancellationReason ?? null : booking.cancellation_reason,
            }
          : booking,
      ),
    );
  }

  function handleStatusUpdate(bookingId: string, status: BookingStatus) {
    let reason = "";

    if (status === "cancelled") {
      reason = window.prompt("Please provide a cancellation reason:") ?? "";
      if (!reason.trim()) {
        setError("Cancellation reason is required.");
        return;
      }
    }

    const confirmed = window.confirm(`Are you sure you want to mark this booking as ${status}?`);
    if (!confirmed) {
      return;
    }

    startTransition(async () => {
      const result = await updateBookingStatus(bookingId, status, reason);
      if (!result.success) {
        setError(result.error ?? "Failed to update booking status.");
        return;
      }

      setError(null);
      updateLocalStatus(bookingId, status, reason);
    });
  }

  return (
    <main className="bg-bg px-4 py-8">
      <section className="mx-auto w-full max-w-5xl">
        <h1 className="heading-md">Manage bookings</h1>

        {toast && (
          <div className="alert alert-success mt-4">
            {toast}
          </div>
        )}

        {error && (
          <div className="alert alert-error mt-4">
            {error}
          </div>
        )}

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <article className="card">
            <p className="text-sm text-muted">Today&apos;s bookings</p>
            <p className="mt-2 text-2xl font-semibold text-ink">{todayCount}</p>
          </article>
          <article className="card" style={{ borderColor: 'var(--color-warning)', background: 'color-mix(in srgb, var(--color-warning) 8%, white)' }}>
            <p className="text-sm text-muted">Pending requests</p>
            <p className="mt-2 text-2xl font-semibold text-ink">{pendingCount}</p>
          </article>
          <article className="card">
            <p className="text-sm text-muted">Completed this month</p>
            <p className="mt-2 text-2xl font-semibold text-ink">{completedThisMonth}</p>
          </article>
          <article className="card" style={{ borderColor: 'var(--color-success)', background: 'color-mix(in srgb, var(--color-success) 8%, white)' }}>
            <p className="text-sm text-muted">Earnings this month</p>
            <p className="mt-2 text-2xl font-semibold text-ink">₹{earningsThisMonth.toLocaleString("en-IN")}</p>
          </article>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {TAB_LABELS.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setTab(item.key)}
              className={`btn btn-sm rounded-full ${
                tab === item.key
                  ? "btn-primary"
                  : "btn-outline"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="mt-6 space-y-4">
          {filtered.length === 0 ? (
            <div className="empty-state card text-muted">
              No {tab} bookings yet.
            </div>
          ) : (
            filtered.map((booking) => (
              <article key={booking.id} className="card">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="font-semibold text-ink">{booking.owner.full_name}</p>
                    <p className="text-sm text-muted">Pet: {booking.pet.name} ({booking.pet.breed || booking.pet.species})</p>
                    <p className="text-sm text-muted">{booking.booking_date} · {booking.start_time} - {booking.end_time}</p>
                    <p className="mt-1 text-sm text-ink">Price: ₹{(booking.total_price ?? 0).toLocaleString("en-IN")}</p>
                    {booking.notes && <p className="mt-1 text-sm text-muted">Notes: {booking.notes}</p>}
                  </div>

                  {booking.pet.photo_url && (
                    <div className="relative h-14 w-14 overflow-hidden rounded-full bg-bg">
                      <Image
                        src={booking.pet.photo_url}
                        alt={booking.pet.name}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    </div>
                  )}
                </div>

                {tab === "pending" && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => handleStatusUpdate(booking.id, "confirmed")}
                      className="btn btn-primary btn-sm disabled:opacity-60"
                    >
                      Confirm
                    </button>
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => handleStatusUpdate(booking.id, "cancelled")}
                      className="btn btn-ghost btn-sm text-error hover:bg-error/10 disabled:opacity-60"
                    >
                      Decline
                    </button>
                  </div>
                )}

                {tab === "confirmed" && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => handleStatusUpdate(booking.id, "completed")}
                      className="btn btn-primary btn-sm disabled:opacity-60"
                    >
                      Mark Complete
                    </button>
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => handleStatusUpdate(booking.id, "cancelled")}
                      className="btn btn-ghost btn-sm text-error hover:bg-error/10 disabled:opacity-60"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </article>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
