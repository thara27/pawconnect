"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, useTransition } from "react";

import { cancelBooking } from "@/lib/actions/bookings";
import type { BookingStatus, BookingWithDetails } from "@/lib/types/booking";

type Tab = "all" | BookingStatus;

const TAB_LABELS: Array<{ key: Tab; label: string }> = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "confirmed", label: "Confirmed" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
];

function statusBadge(status: BookingStatus): string {
  if (status === "pending") return "bg-amber-100 text-amber-800";
  if (status === "confirmed") return "bg-emerald-100 text-emerald-800";
  if (status === "completed") return "bg-slate-100 text-slate-700";
  return "bg-red-100 text-red-700";
}

function statusText(status: BookingStatus): string {
  if (status === "pending") return "⏳ Pending";
  if (status === "confirmed") return "✓ Confirmed";
  if (status === "completed") return "✓ Completed";
  return "✗ Cancelled";
}

type Props = {
  bookings: BookingWithDetails[];
  success: boolean;
};

export default function PetOwnerBookingsClient({ bookings, success }: Props) {
  const [tab, setTab] = useState<Tab>("all");
  const [activeBookings, setActiveBookings] = useState(bookings);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (tab === "all") return activeBookings;
    return activeBookings.filter((booking) => booking.status === tab);
  }, [activeBookings, tab]);

  function handleCancel(booking: BookingWithDetails) {
    const reason = window.prompt("Reason for cancellation (optional):") ?? "";
    const confirmed = window.confirm("Are you sure you want to cancel this booking?");
    if (!confirmed) return;

    startTransition(async () => {
      const result = await cancelBooking(booking.id, reason);
      if (!result.success) {
        setError(result.error ?? "Could not cancel booking.");
        return;
      }

      setActiveBookings((current) =>
        current.map((row) =>
          row.id === booking.id
            ? {
                ...row,
                status: "cancelled",
                cancellation_reason: reason || null,
              }
            : row,
        ),
      );
    });
  }

  return (
    <main className="min-h-screen bg-bg px-4 py-8">
      <section className="mx-auto w-full max-w-4xl">
        <h1 className="text-3xl font-semibold text-slate-900">My bookings</h1>
        <p className="mt-1 text-sm text-slate-600">Track all your service bookings in one place.</p>

        {success && (
          <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            Booking request sent successfully.
          </div>
        )}

        {error && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

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

        {filtered.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <p className="text-slate-700">No {tab === "all" ? "" : tab} bookings yet</p>
            {tab === "all" && (
              <Link
                href="/search"
                className="mt-3 inline-flex rounded-lg bg-[#E8602C] px-4 py-2 text-sm font-semibold text-white"
              >
                Find a service
              </Link>
            )}
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {filtered.map((booking) => {
              const canCancel = booking.status === "pending" || booking.status === "confirmed";
              return (
                <article key={booking.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 overflow-hidden rounded-full bg-slate-100">
                        {booking.provider.avatar_url ? (
                          <Image
                            src={booking.provider.avatar_url}
                            alt={booking.provider.business_name}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-xs font-semibold text-slate-500">
                            {booking.provider.business_name.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{booking.provider.business_name}</p>
                        <p className="text-xs text-slate-500">{booking.provider.service_type}</p>
                      </div>
                    </div>
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusBadge(booking.status)}`}>
                      {statusText(booking.status)}
                    </span>
                  </div>

                  <div className="mt-3 grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
                    <p><span className="font-medium">Pet:</span> {booking.pet.name} ({booking.pet.breed || booking.pet.species})</p>
                    <p><span className="font-medium">Date:</span> {booking.booking_date}</p>
                    <p><span className="font-medium">Time:</span> {booking.start_time} - {booking.end_time}</p>
                    <p><span className="font-medium">Price:</span> ₹{(booking.total_price ?? 0).toLocaleString("en-IN")}</p>
                  </div>

                  {canCancel && (
                    <div className="mt-3">
                      <button
                        type="button"
                        disabled={isPending}
                        onClick={() => handleCancel(booking)}
                        className="rounded-lg border border-red-300 px-3 py-1.5 text-sm font-medium text-red-700 transition hover:bg-red-50 disabled:opacity-60"
                      >
                        Cancel booking
                      </button>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
