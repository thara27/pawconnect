import Link from "next/link";

import { createClient } from "@/lib/supabase/server";
import { getMyBookings } from "@/lib/actions/bookings";
import { searchProviders } from "@/lib/actions/providers";
import ProviderCard from "@/app/components/providers/ProviderCard";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default async function PetOwnerDashboardPage() {
  const todayISO = new Date().toISOString().slice(0, 10);

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const rawName: string = user?.user_metadata?.full_name ?? user?.user_metadata?.name ?? user?.email ?? "";
  const firstName = rawName.split(/[\s@]/)[0] ?? "there";
  const greeting = getGreeting();

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
              {nearbyAvailableCount} providers available near you
            </p>
            <h1 className="heading-lg">
              {greeting}, <span className="italic">{firstName}</span> 🐾
            </h1>
            <p className="mt-2 text-muted" style={{ maxWidth: "440px" }}>
              {upcomingBookings.length > 0
                ? `You have ${upcomingBookings.length} upcoming booking${upcomingBookings.length !== 1 ? "s" : ""}. Need to book anything else for your pup?`
                : nearbyAvailableCount > 0
                  ? `${nearbyAvailableCount} providers are available near you right now. Find the right care for your dog.`
                  : "Explore pet care services, manage your dogs, and connect with your community."}
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/dashboard/pet-owner/search" className="btn btn-primary">
                Book a service
              </Link>
              <Link href="/dashboard/pet-owner/pets" className="btn btn-outline">
                Manage pets
              </Link>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <div style={{ background: "var(--color-white)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)", padding: "var(--space-3) var(--space-4)" }}>
                <p className="text-brand" style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-2xl)", fontWeight: 900 }}>{nearbyAvailableCount}</p>
                <p className="text-muted" style={{ fontSize: "var(--text-xs)" }}>Providers nearby</p>
              </div>
              <div style={{ background: "var(--color-white)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)", padding: "var(--space-3) var(--space-4)" }}>
                <p className="text-sage" style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-2xl)", fontWeight: 900 }}>{upcomingBookings.length}</p>
                <p className="text-muted" style={{ fontSize: "var(--text-xs)" }}>Upcoming bookings</p>
              </div>
              <div style={{ background: "var(--color-white)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)", padding: "var(--space-3) var(--space-4)" }}>
                <p className="text-brand" style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-2xl)", fontWeight: 900 }}>{featuredProviders.length}</p>
                <p className="text-muted" style={{ fontSize: "var(--text-xs)" }}>Featured now</p>
              </div>
              <div style={{ background: "var(--color-white)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)", padding: "var(--space-3) var(--space-4)" }}>
                <p className="text-ink" style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-2xl)", fontWeight: 900 }}>24x7</p>
                <p className="text-muted" style={{ fontSize: "var(--text-xs)" }}>Community support</p>
              </div>
            </div>
          </div>
        </div>

        <article className="mt-5 rounded-[14px] bg-gradient-to-br from-[#FF1744] to-[#FF5252] p-5 text-white shadow-[0_12px_28px_rgba(255,23,68,0.35)]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wide"><span className="h-2 w-2 animate-pulse rounded-full bg-white" />Urgent</span>
              <h2 className="mt-2 text-2xl font-black">Need blood donor support?</h2>
              <p className="mt-1 text-sm text-white/90">Activate emergency visibility in your city and notify matching donor groups instantly.</p>
            </div>
            <Link href="/coming-soon" className="btn btn-primary rounded-full">Request help</Link>
          </div>
        </article>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link href="/dashboard/pet-owner/search?service=vet" className="group rounded-[14px] border-[1.5px] border-border bg-white p-4 transition hover:-translate-y-[3px] hover:border-brand hover:bg-brand-light">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-light text-xl">🩺</div>
            <h3 className="font-bold text-ink">Find Vet</h3><p className="mt-1 text-sm text-muted">Book trusted doctors nearby</p>
          </Link>
          <Link href="/dashboard/pet-owner/search?service=groomer" className="group rounded-[14px] border-[1.5px] border-border bg-white p-4 transition hover:-translate-y-[3px] hover:border-sage hover:bg-sage-light">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-sage-light text-xl">✂️</div>
            <h3 className="font-bold text-ink">Grooming</h3><p className="mt-1 text-sm text-muted">Salon slots in one tap</p>
          </Link>
          <Link href="/breeds" className="group rounded-[14px] border-[1.5px] border-border bg-white p-4 transition hover:-translate-y-[3px] hover:border-brand hover:bg-brand-light">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-light text-xl">🤖</div>
            <h3 className="font-bold text-ink">AI Chat</h3><p className="mt-1 text-sm text-muted">Breed-wise smart guidance</p>
          </Link>
          <Link href="/dashboard/pet-owner/search?service=walker" className="group rounded-[14px] border-[1.5px] border-border bg-white p-4 transition hover:-translate-y-[3px] hover:border-sage hover:bg-sage-light">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-sage-light text-xl">🐕</div>
            <h3 className="font-bold text-ink">Dog Walker</h3><p className="mt-1 text-sm text-muted">Daily walks by local pros</p>
          </Link>
        </div>

        <div className="mt-8 rounded-2xl border border-border bg-white p-5">
          <div className="section-header">
            <h2 className="section-title">Upcoming bookings</h2>
            <Link href="/dashboard/pet-owner/bookings" className="section-link">
              View all
            </Link>
          </div>
          {upcomingBookings.length === 0 ? (
            <p className="text-sm text-muted">No confirmed upcoming bookings yet.</p>
          ) : (
            <div className="space-y-3">
              {upcomingBookings.map((booking) => (
                <div key={booking.id} className="rounded-xl border border-border bg-bg p-3 text-sm text-ink">
                  <p className="font-medium text-ink">{booking.provider.business_name}</p>
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
            <div className="section-header mb-4">
              <h2 className="section-title">Available now</h2>
              <Link
                href="/dashboard/pet-owner/search?available=true"
                className="section-link"
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
