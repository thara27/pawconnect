import Link from "next/link";

import { getProviderBookings } from "@/lib/actions/bookings";
import { getMyProfile } from "@/lib/actions/providers";

export default async function ServiceProviderDashboardPage() {
  const [{ profile }, bookings] = await Promise.all([getMyProfile(), getProviderBookings()]);

  const todayISO = new Date().toISOString().slice(0, 10);
  const todaysConfirmedCount = bookings.filter(
    (booking) => booking.status === "confirmed" && booking.booking_date === todayISO,
  ).length;
  const pendingCount = bookings.filter((booking) => booking.status === "pending").length;
  const thisMonthRevenue = bookings
    .filter((booking) => booking.status === "completed")
    .reduce((sum, booking) => sum + (booking.total_price ?? 0), 0);

  return (
    <main className="min-h-screen bg-bg pb-10">
      <section className="mx-auto w-full max-w-6xl px-4 pt-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#FF5722] via-[#FF8A50] to-[#FFB74D] p-6 text-white shadow-xl sm:p-8">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(255,255,255,0.3),transparent_45%)]" />
          <div className="pointer-events-none absolute -right-4 top-1 text-8xl opacity-15 sm:text-9xl">🐾</div>

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur">
              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-300" />
              {pendingCount} new requests waiting
            </div>
            <h1 className="mt-4 text-3xl font-black leading-tight sm:text-4xl">Grow faster with <span className="italic">PawConnect</span></h1>
            <p className="mt-2 max-w-2xl text-sm text-white/90 sm:text-base">Optimise your schedule, confirm requests quickly, and convert more repeat bookings in your city.</p>

            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/dashboard/service-provider/bookings" className="inline-flex rounded-full bg-white px-5 py-2.5 text-sm font-bold text-orange shadow-sm transition hover:bg-orange-light">Manage bookings</Link>
              <Link href="/dashboard/service-provider/profile/edit" className="inline-flex rounded-full border-2 border-white px-5 py-2.5 text-sm font-bold text-white transition hover:bg-white/10">Update profile</Link>
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 overflow-hidden rounded-2xl border border-border bg-white sm:grid-cols-4">
          <div className="border-b border-border p-4 sm:border-b-0 sm:border-r"><p className="text-2xl font-black text-orange">{todaysConfirmedCount}</p><p className="text-xs text-muted">Today&apos;s confirmed</p></div>
          <div className="border-b border-border p-4 sm:border-b-0 sm:border-r"><p className="text-2xl font-black text-teal">{pendingCount}</p><p className="text-xs text-muted">Pending requests</p></div>
          <div className="border-r border-border p-4"><p className="text-2xl font-black text-purple">₹{thisMonthRevenue.toLocaleString("en-IN")}</p><p className="text-xs text-muted">This month earnings</p></div>
          <div className="p-4"><p className="text-2xl font-black text-ink">4.8</p><p className="text-xs text-muted">Average rating</p></div>
        </div>

        <article className="mt-5 rounded-[14px] bg-gradient-to-br from-[#FF1744] to-[#FF5252] p-5 text-white shadow-[0_12px_28px_rgba(255,23,68,0.35)]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wide"><span className="h-2 w-2 animate-pulse rounded-full bg-white" />Urgent</span>
              <h2 className="mt-2 text-2xl font-black">Emergency blood donor request nearby</h2>
              <p className="mt-1 text-sm text-white/90">Boost your visibility now and help nearby pet parents in critical need.</p>
            </div>
            <button className="rounded-full bg-white px-5 py-2.5 text-sm font-bold text-[#FF1744]">Respond now</button>
          </div>
        </article>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link href="/dashboard/service-provider/bookings" className="rounded-[14px] border-[1.5px] border-border bg-white p-4 transition hover:-translate-y-[3px] hover:border-orange hover:bg-orange-light"><div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-orange-light text-xl">📅</div><h3 className="font-bold text-ink">Bookings</h3><p className="mt-1 text-sm text-muted">Review and confirm requests</p></Link>
          <Link href="/dashboard/service-provider/profile/edit" className="rounded-[14px] border-[1.5px] border-border bg-white p-4 transition hover:-translate-y-[3px] hover:border-teal hover:bg-teal-light"><div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-teal-light text-xl">🧾</div><h3 className="font-bold text-ink">Profile</h3><p className="mt-1 text-sm text-muted">Update offerings and pricing</p></Link>
          <Link href="/dashboard/service-provider/profile" className="rounded-[14px] border-[1.5px] border-border bg-white p-4 transition hover:-translate-y-[3px] hover:border-purple hover:bg-purple-light"><div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-purple-light text-xl">⭐</div><h3 className="font-bold text-ink">Reviews</h3><p className="mt-1 text-sm text-muted">Build trust with great service</p></Link>
          <Link href="/dashboard/service-provider/bookings" className="rounded-[14px] border-[1.5px] border-border bg-white p-4 transition hover:-translate-y-[3px] hover:border-amber hover:bg-amber-light"><div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-amber-light text-xl">📈</div><h3 className="font-bold text-ink">Growth</h3><p className="mt-1 text-sm text-muted">Track conversions and revenue</p></Link>
        </div>

        {profile ? (
          <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
            <p className="text-sm font-medium text-emerald-900">Your profile is live</p>
            <p className="mt-1 text-sm text-emerald-800">
              Pet owners can now discover your service details and availability.
            </p>
            <Link
              href="/dashboard/service-provider/profile"
              className="mt-3 inline-flex rounded-full border border-emerald-300 px-5 py-2 text-sm font-bold text-emerald-900 transition hover:bg-emerald-100"
            >
              View profile
            </Link>
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-orange-200 bg-orange-50 p-4">
            <p className="text-sm font-medium text-orange-900">Complete your profile</p>
            <p className="mt-1 text-sm text-orange-800">
              Add your service details so pet owners can find and book you.
            </p>
            <Link
              href="/dashboard/service-provider/profile/edit"
              className="mt-3 inline-flex rounded-full bg-orange px-5 py-2 text-sm font-bold text-white transition hover:bg-orange-dark"
            >
              Complete profile
            </Link>
          </div>
        )}

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <article className="rounded-xl border border-border p-4">
            <h2 className="font-medium text-slate-900">Manage offerings</h2>
            <p className="mt-1 text-sm text-slate-600">
              Add services, set pricing, and update your availability.
            </p>
          </article>
          <article className="rounded-xl border border-border p-4">
            <h2 className="font-medium text-slate-900">Client requests</h2>
            <p className="mt-1 text-sm text-slate-600">
              Review bookings and respond to pet owner inquiries.
            </p>
            <Link
              href="/dashboard/service-provider/bookings"
              className="mt-3 inline-flex rounded-full border-2 border-orange px-5 py-2 text-sm font-bold text-orange transition hover:bg-orange-light"
            >
              Open bookings
            </Link>
          </article>
        </div>
      </section>
    </main>
  );
}
