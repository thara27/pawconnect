import Link from "next/link";

import { getMyBookings } from "@/lib/actions/bookings";
import { searchProviders } from "@/lib/actions/providers";
import ProviderCard from "@/app/components/providers/ProviderCard";

export default async function PetOwnerDashboardPage() {
  const todayISO = new Date().toISOString().slice(0, 10);

  // Fetch a few available providers for the featured row; fail silently
  let featuredProviders: Awaited<ReturnType<typeof searchProviders>> = [];
  let upcomingBookings: Awaited<ReturnType<typeof getMyBookings>> = [];
  let nearbyAvailableCount = 0;
  try {
    const [all, myBookings] = await Promise.all([
      searchProviders({
        is_available: true,
        service_type: null,
        city: null,
        min_rating: null,
      }),
      getMyBookings(),
    ]);
    featuredProviders = all.slice(0, 3);
    nearbyAvailableCount = all.length;
    upcomingBookings = myBookings
      .filter((booking) => booking.status === "confirmed" && booking.booking_date >= todayISO)
      .sort((a, b) =>
        `${a.booking_date}${a.start_time}`.localeCompare(`${b.booking_date}${b.start_time}`),
      )
      .slice(0, 3);
  } catch {
    // non-critical — dashboard still renders without it
  }

  return (
    <main className="min-h-screen bg-bg pb-10">
      <section className="mx-auto w-full max-w-6xl px-4 pt-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#FF5722] via-[#FF8A50] to-[#FFB74D] p-6 text-white shadow-xl sm:p-8">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(255,255,255,0.28),transparent_45%)]" />
          <div className="pointer-events-none absolute -right-4 top-1 text-8xl opacity-15 sm:text-9xl">🐾</div>

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur">
              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-300" />
              {nearbyAvailableCount} vets available near you
            </div>
            <h1 className="mt-4 text-3xl font-black leading-tight sm:text-4xl">
              Welcome back, <span className="italic">dog parent</span>
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-white/90 sm:text-base">
              Perfect weather for an evening walk. Want to schedule grooming and a quick vet health check this week?
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/dashboard/pet-owner/search"
                className="inline-flex rounded-full bg-white px-5 py-2.5 text-sm font-bold text-orange shadow-sm transition hover:bg-orange-light"
              >
                Book a service
              </Link>
              <Link
                href="/dashboard/pet-owner/pets"
                className="inline-flex rounded-full border-2 border-white px-5 py-2.5 text-sm font-bold text-white transition hover:bg-white/10"
              >
                Manage pets
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 overflow-hidden rounded-2xl border border-border bg-white sm:grid-cols-4">
          <div className="border-b border-border p-4 sm:border-b-0 sm:border-r"><p className="text-2xl font-black text-orange">{nearbyAvailableCount}</p><p className="text-xs text-muted">Providers nearby</p></div>
          <div className="border-b border-border p-4 sm:border-b-0 sm:border-r"><p className="text-2xl font-black text-teal">{upcomingBookings.length}</p><p className="text-xs text-muted">Upcoming bookings</p></div>
          <div className="border-r border-border p-4"><p className="text-2xl font-black text-purple">{featuredProviders.length}</p><p className="text-xs text-muted">Featured now</p></div>
          <div className="p-4"><p className="text-2xl font-black text-ink">24x7</p><p className="text-xs text-muted">Community support</p></div>
        </div>

        <article className="mt-5 rounded-[14px] bg-gradient-to-br from-[#FF1744] to-[#FF5252] p-5 text-white shadow-[0_12px_28px_rgba(255,23,68,0.35)]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wide"><span className="h-2 w-2 animate-pulse rounded-full bg-white" />Urgent</span>
              <h2 className="mt-2 text-2xl font-black">Need blood donor support?</h2>
              <p className="mt-1 text-sm text-white/90">Activate emergency visibility in your city and notify matching donor groups instantly.</p>
            </div>
            <button className="rounded-full bg-white px-5 py-2.5 text-sm font-bold text-[#FF1744]">Request help</button>
          </div>
        </article>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link href="/dashboard/pet-owner/search?service=vet" className="group rounded-[14px] border-[1.5px] border-border bg-white p-4 transition hover:-translate-y-[3px] hover:border-orange hover:bg-orange-light">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-orange-light text-xl">🩺</div>
            <h3 className="font-bold text-ink">Find Vet</h3><p className="mt-1 text-sm text-muted">Book trusted doctors nearby</p>
          </Link>
          <Link href="/dashboard/pet-owner/search?service=groomer" className="group rounded-[14px] border-[1.5px] border-border bg-white p-4 transition hover:-translate-y-[3px] hover:border-teal hover:bg-teal-light">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-teal-light text-xl">✂️</div>
            <h3 className="font-bold text-ink">Grooming</h3><p className="mt-1 text-sm text-muted">Salon slots in one tap</p>
          </Link>
          <Link href="/breeds" className="group rounded-[14px] border-[1.5px] border-border bg-white p-4 transition hover:-translate-y-[3px] hover:border-purple hover:bg-purple-light">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-purple-light text-xl">🤖</div>
            <h3 className="font-bold text-ink">AI Chat</h3><p className="mt-1 text-sm text-muted">Breed-wise smart guidance</p>
          </Link>
          <Link href="/dashboard/pet-owner/search?service=walker" className="group rounded-[14px] border-[1.5px] border-border bg-white p-4 transition hover:-translate-y-[3px] hover:border-amber hover:bg-amber-light">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-amber-light text-xl">🐕</div>
            <h3 className="font-bold text-ink">Dog Walker</h3><p className="mt-1 text-sm text-muted">Daily walks by local pros</p>
          </Link>
        </div>

        <div className="mt-8 rounded-2xl border border-border bg-white p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Upcoming bookings</h2>
            <Link
              href="/dashboard/pet-owner/bookings"
              className="text-sm font-bold text-orange hover:underline"
            >
              View all
            </Link>
          </div>
          {upcomingBookings.length === 0 ? (
            <p className="text-sm text-muted">No confirmed upcoming bookings yet.</p>
          ) : (
            <div className="space-y-3">
              {upcomingBookings.map((booking) => (
                <div key={booking.id} className="rounded-xl border border-border bg-bg p-3 text-sm text-ink">
                  <p className="font-medium text-slate-900">{booking.provider.business_name}</p>
                  <p className="mt-1">{booking.booking_date} · {booking.start_time} - {booking.end_time}</p>
                  <p className="mt-1 text-muted">{booking.pet.name} ({booking.pet.breed || booking.pet.species})</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Featured providers */}
        {featuredProviders.length > 0 && (
          <div className="mt-9">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Available now</h2>
              <Link
                href="/dashboard/pet-owner/search?available=true"
                className="text-sm font-bold text-orange hover:text-orange-dark"
              >
                View all →
              </Link>
            </div>
            {/* Horizontal scroll on mobile, grid on desktop */}
            <div className="flex gap-4 overflow-x-auto pb-2 sm:grid sm:grid-cols-3 sm:overflow-visible sm:pb-0">
              {featuredProviders.map((provider) => (
                <div key={provider.id} className="w-72 flex-shrink-0 sm:w-auto">
                  <ProviderCard provider={provider} />
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
