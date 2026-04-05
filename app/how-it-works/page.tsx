import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How It Works · PawConnect",
  description:
    "Learn how PawConnect connects pet owners with trusted dog care professionals across India.",
};

function StepCard({
  number,
  emoji,
  title,
  description,
}: {
  number: number;
  emoji: string;
  title: string;
  description: string;
}) {
  return (
    <div className="relative flex flex-col gap-3 rounded-2xl border border-[#EDE3D4] bg-[#FFFCF7] px-5 py-5">
      {/* Step number badge */}
      <div className="flex items-center gap-2.5">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#FF5722] text-xs font-bold text-white">
          {number}
        </span>
        <span className="text-2xl leading-none">{emoji}</span>
      </div>
      <div>
        <h3 className="font-fraunces text-[1rem] font-semibold leading-snug text-stone-900">
          {title}
        </h3>
        <p className="mt-1.5 text-[0.85rem] leading-6 text-stone-500">{description}</p>
      </div>
    </div>
  );
}

export default function HowItWorksPage() {
  return (
    <main className="bg-bg px-4 py-12 sm:py-20">
      <div className="mx-auto w-full max-w-3xl space-y-16">

        {/* ── Hero ──────────────────────────────────────────── */}
        <div className="text-center">
          <p className="badge badge-brand mx-auto mb-4">Simple &amp; transparent</p>
          <h1 className="font-fraunces text-4xl font-bold leading-tight text-stone-900 sm:text-5xl">
            How PawConnect Works 🐾
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-[0.95rem] leading-7 text-stone-500">
            Whether you&apos;re a pet parent looking for trusted care or a professional
            ready to grow your practice — PawConnect makes it simple, fast, and reliable.
          </p>
        </div>

        {/* ── For Pet Owners ────────────────────────────────── */}
        <div>
          {/* Section heading */}
          <div className="mb-6 flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#FFF3EE] text-2xl">
              🐕
            </span>
            <div>
              <h2 className="font-fraunces text-2xl font-bold text-stone-900">
                For Pet Owners
              </h2>
              <p className="text-sm text-stone-500">
                Find the right care for your dog in minutes
              </p>
            </div>
          </div>

          {/* Step grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <StepCard
              number={1}
              emoji="👤"
              title="Create your profile"
              description="Sign up with email or Google in under a minute. Set your city and preferences — no credit card needed."
            />
            <StepCard
              number={2}
              emoji="🐶"
              title="Add your dog"
              description="Enter your dog's name, breed, age, and any health notes so providers can prepare the perfect care."
            />
            <StepCard
              number={3}
              emoji="🔍"
              title="Find trusted providers"
              description="Search groomers, trainers, walkers, and vets near you. Filter by city, price, and service type."
            />
            <StepCard
              number={4}
              emoji="📅"
              title="Book instantly"
              description="Pick a date and time that works for you. Receive a confirmation and track everything from your dashboard."
            />
            <StepCard
              number={5}
              emoji="📋"
              title="Manage bookings"
              description="View upcoming and past appointments, get notifications on status changes, and cancel if plans shift."
            />
          </div>
        </div>

        {/* ── Divider ───────────────────────────────────────── */}
        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-[#EDE3D4]" />
          <span className="text-xl">🤝</span>
          <div className="h-px flex-1 bg-[#EDE3D4]" />
        </div>

        {/* ── For Service Providers ─────────────────────────── */}
        <div>
          {/* Section heading */}
          <div className="mb-6 flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#FFF3EE] text-2xl">
              🧑‍⚕️
            </span>
            <div>
              <h2 className="font-fraunces text-2xl font-bold text-stone-900">
                For Service Providers
              </h2>
              <p className="text-sm text-stone-500">
                Grow your pet care business across India
              </p>
            </div>
          </div>

          {/* Step grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <StepCard
              number={1}
              emoji="🏪"
              title="Create your business profile"
              description="List your services — grooming, training, veterinary care, dog walking, or boarding. Showcase your experience and certifications."
            />
            <StepCard
              number={2}
              emoji="🗓️"
              title="Set services & availability"
              description="Define your working hours, pricing per service, and the breeds or pet types you specialise in."
            />
            <StepCard
              number={3}
              emoji="🔔"
              title="Receive bookings"
              description="Get notified instantly when a pet owner requests a slot. Accept or reschedule directly from your dashboard."
            />
            <StepCard
              number={4}
              emoji="👥"
              title="Manage customers"
              description="See upcoming appointments, track booking history, and stay on top of every client relationship in one place."
            />
            <StepCard
              number={5}
              emoji="📈"
              title="Grow your business"
              description="Build your reputation through verified reviews. As PawConnect expands across Indian cities, your profile grows with us."
            />
          </div>
        </div>

        {/* ── CTA ───────────────────────────────────────────── */}
        <div className="rounded-2xl border border-[#EDE3D4] bg-[#FFFCF7] px-8 py-10 text-center">
          <p className="text-2xl">🐾</p>
          <p className="mt-3 font-fraunces text-2xl font-bold text-stone-900">
            Ready to get started?
          </p>
          <p className="mt-2 text-[0.9rem] text-stone-500">
            Join pet parents and providers already using PawConnect across India.
          </p>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link href="/signup" className="btn btn-primary">
              Get Started — it&apos;s free
            </Link>
            <Link href="/search" className="btn btn-outline">
              Browse providers
            </Link>
          </div>
          <p className="mt-4 text-xs text-stone-400">
            Have questions?{" "}
            <Link href="/contact" className="font-medium text-[#FF5722] hover:underline">
              Contact us
            </Link>{" "}
            — we&apos;re happy to help.
          </p>
        </div>

      </div>
    </main>
  );
}
