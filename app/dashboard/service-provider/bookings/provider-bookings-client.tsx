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
    <main className="min-h-screen bg-bg px-4 py-8">
      <section className="mx-auto w-full max-w-5xl">
        <h1 className="text-3xl font-semibold text-slate-900">Manage bookings</h1>

        {toast && (
          <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            {toast}
          </div>
        )}

        {error && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <article className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-sm text-slate-500">Today&apos;s bookings</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{todayCount}</p>
          </article>
          <article className="rounded-xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm text-amber-700">Pending requests</p>
            <p className="mt-2 text-2xl font-semibold text-amber-900">{pendingCount}</p>
          </article>
          <article className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-sm text-slate-500">Completed this month</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{completedThisMonth}</p>
          </article>
          <article className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            <p className="text-sm text-emerald-700">Earnings this month</p>
            <p className="mt-2 text-2xl font-semibold text-emerald-900">₹{earningsThisMonth.toLocaleString("en-IN")}</p>
          </article>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {TAB_LABELS.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setTab(item.key)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                tab === item.key
                  ? "bg-orange text-white shadow-sm"
                  : "border border-border bg-white text-muted hover:border-orange hover:bg-orange-light hover:text-orange"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="mt-6 space-y-4">
          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-600">
              No {tab} bookings yet.
            </div>
          ) : (
            filtered.map((booking) => (
              <article key={booking.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="font-semibold text-slate-900">{booking.owner.full_name}</p>
                    <p className="text-sm text-slate-600">Pet: {booking.pet.name} ({booking.pet.breed || booking.pet.species})</p>
                    <p className="text-sm text-slate-600">{booking.booking_date} · {booking.start_time} - {booking.end_time}</p>
                    <p className="mt-1 text-sm text-slate-700">Price: ₹{(booking.total_price ?? 0).toLocaleString("en-IN")}</p>
                    {booking.notes && <p className="mt-1 text-sm text-slate-500">Notes: {booking.notes}</p>}
                  </div>

                  {booking.pet.photo_url && (
                    <div className="relative h-14 w-14 overflow-hidden rounded-full bg-slate-100">
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
                      className="rounded-full bg-emerald-600 px-5 py-2 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:opacity-60"
                    >
                      Confirm
                    </button>
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => handleStatusUpdate(booking.id, "cancelled")}
                      className="rounded-full bg-red-600 px-5 py-2 text-sm font-bold text-white transition hover:bg-red-700 disabled:opacity-60"
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
                      className="rounded-full bg-ink px-5 py-2 text-sm font-bold text-white transition hover:bg-slate-700 disabled:opacity-60"
                    >
                      Mark Complete
                    </button>
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => handleStatusUpdate(booking.id, "cancelled")}
                      className="rounded-full border border-red-300 px-5 py-2 text-sm font-bold text-red-700 transition hover:bg-red-50 disabled:opacity-60"
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
