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
    <main className="bg-bg pb-10">
      <section className="mx-auto w-full max-w-6xl px-4 pt-6">
        <div
          className="relative overflow-hidden rounded-2xl p-6 sm:p-8"
          style={{ background: "linear-gradient(160deg, #FFF8E7 0%, #FDECC8 30%, #FBD99A 100%)" }}
        >
          <div className="pointer-events-none absolute -right-4 top-1 text-8xl opacity-10 sm:text-9xl">🐾</div>

          <div className="relative z-10">
            <p
              className="text-brand"
              style={{ fontSize: "var(--text-xs)", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "var(--space-2)" }}
            >
              {pendingCount} new requests waiting
            </p>
            <h1 className="heading-lg">
              {profile?.business_name ? (
                <>Welcome, <span className="italic">{profile.business_name}</span> 👋</>
              ) : (
                <>Grow faster with <span className="italic">PawConnect</span></>
              )}
            </h1>
            <p className="mt-2 text-muted" style={{ maxWidth: "440px" }}>
              {pendingCount > 0
                ? `You have ${pendingCount} pending request${pendingCount !== 1 ? "s" : ""} waiting for your response.`
                : todaysConfirmedCount > 0
                  ? `${todaysConfirmedCount} confirmed booking${todaysConfirmedCount !== 1 ? "s" : ""} today. Have a great day!`
                  : "Optimise your schedule, confirm requests quickly, and build your reputation."}
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/dashboard/service-provider/bookings" className="btn btn-primary">Manage bookings</Link>
              <Link href="/dashboard/service-provider/profile/edit" className="btn btn-outline">Update profile</Link>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <div style={{ background: "var(--color-white)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)", padding: "var(--space-3) var(--space-4)" }}>
                <p className="text-brand" style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-2xl)", fontWeight: 900 }}>{todaysConfirmedCount}</p>
                <p className="text-muted" style={{ fontSize: "var(--text-xs)" }}>Today&apos;s confirmed</p>
              </div>
              <div style={{ background: "var(--color-white)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)", padding: "var(--space-3) var(--space-4)" }}>
                <p className="text-sage" style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-2xl)", fontWeight: 900 }}>{pendingCount}</p>
                <p className="text-muted" style={{ fontSize: "var(--text-xs)" }}>Pending requests</p>
              </div>
              <div style={{ background: "var(--color-white)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)", padding: "var(--space-3) var(--space-4)" }}>
                <p className="text-brand" style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-2xl)", fontWeight: 900 }}>₹{thisMonthRevenue.toLocaleString("en-IN")}</p>
                <p className="text-muted" style={{ fontSize: "var(--text-xs)" }}>This month earnings</p>
              </div>
              <div style={{ background: "var(--color-white)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)", padding: "var(--space-3) var(--space-4)" }}>
                <p className="text-ink" style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-2xl)", fontWeight: 900 }}>4.8</p>
                <p className="text-muted" style={{ fontSize: "var(--text-xs)" }}>Average rating</p>
              </div>
            </div>
          </div>
        </div>

        <article className="mt-5 rounded-[14px] bg-gradient-to-br from-[#FF1744] to-[#FF5252] p-5 text-white shadow-[0_12px_28px_rgba(255,23,68,0.35)]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wide"><span className="h-2 w-2 animate-pulse rounded-full bg-white" />Urgent</span>
              <h2 className="mt-2 text-2xl font-black">Emergency blood donor request nearby</h2>
              <p className="mt-1 text-sm text-white/90">Boost your visibility now and help nearby pet parents in critical need.</p>
            </div>
            <button className="btn btn-primary rounded-full">Respond now</button>
          </div>
        </article>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link href="/dashboard/service-provider/bookings" className="rounded-[14px] border-[1.5px] border-border bg-white p-4 transition hover:-translate-y-[3px] hover:border-brand hover:bg-brand-light"><div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-light text-xl">📅</div><h3 className="font-bold text-ink">Bookings</h3><p className="mt-1 text-sm text-muted">Review and confirm requests</p></Link>
          <Link href="/dashboard/service-provider/profile/edit" className="rounded-[14px] border-[1.5px] border-border bg-white p-4 transition hover:-translate-y-[3px] hover:border-sage hover:bg-sage-light"><div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-sage-light text-xl">🧾</div><h3 className="font-bold text-ink">Profile</h3><p className="mt-1 text-sm text-muted">Update offerings and pricing</p></Link>
          <Link href="/dashboard/service-provider/profile" className="rounded-[14px] border-[1.5px] border-border bg-white p-4 transition hover:-translate-y-[3px] hover:border-brand hover:bg-brand-light"><div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-light text-xl">⭐</div><h3 className="font-bold text-ink">Reviews</h3><p className="mt-1 text-sm text-muted">Build trust with great service</p></Link>
          <Link href="/dashboard/service-provider/bookings" className="rounded-[14px] border-[1.5px] border-border bg-white p-4 transition hover:-translate-y-[3px] hover:border-sage hover:bg-sage-light"><div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-sage-light text-xl">📈</div><h3 className="font-bold text-ink">Growth</h3><p className="mt-1 text-sm text-muted">Track conversions and revenue</p></Link>
        </div>

        {profile ? (
          <div className="mt-6 rounded-2xl border border-border bg-bg p-4">
            <p className="text-sm font-medium text-ink">Your profile is live</p>
            <p className="mt-1 text-sm text-muted">
              Pet owners can now discover your service details and availability.
            </p>
            <Link
              href="/dashboard/service-provider/profile"
              className="btn btn-outline btn-sm mt-3"
            >
              View profile
            </Link>
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-brand-light bg-brand-light p-4">
            <p className="text-sm font-medium text-brand-dark">Complete your profile</p>
            <p className="mt-1 text-sm text-muted">
              Add your service details so pet owners can find and book you.
            </p>
            <Link
              href="/dashboard/service-provider/profile/edit"
              className="btn btn-primary btn-sm mt-3"
            >
              Complete profile
            </Link>
          </div>
        )}

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <article className="rounded-xl border border-border p-4">
            <h2 className="heading-sm">Manage offerings</h2>
            <p className="mt-1 text-sm text-muted">
              Add services, set pricing, and update your availability.
            </p>
          </article>
          <article className="rounded-xl border border-border p-4">
            <h2 className="heading-sm">Client requests</h2>
            <p className="mt-1 text-sm text-muted">
              Review bookings and respond to pet owner inquiries.
            </p>
            <Link
              href="/dashboard/service-provider/bookings"
              className="btn btn-outline btn-sm mt-3"
            >
              Open bookings
            </Link>
          </article>
        </div>
      </section>
    </main>
  );
}
