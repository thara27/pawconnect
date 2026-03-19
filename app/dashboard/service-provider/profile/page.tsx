import Image from "next/image";
import Link from "next/link";

import { getMyProfile } from "@/lib/actions/providers";
import { DAYS_OF_WEEK, SERVICE_TYPES } from "@/lib/types/provider";

function PawMark() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className="h-12 w-12 text-slate-900">
      <path
        fill="currentColor"
        d="M19 23c-3.3 0-6-3.6-6-8s2.7-8 6-8 6 3.6 6 8-2.7 8-6 8Zm26 0c-3.3 0-6-3.6-6-8s2.7-8 6-8 6 3.6 6 8-2.7 8-6 8ZM10 38c-2.8 0-5-3.1-5-7s2.2-7 5-7 5 3.1 5 7-2.2 7-5 7Zm44 0c-2.8 0-5-3.1-5-7s2.2-7 5-7 5 3.1 5 7-2.2 7-5 7Zm-22 18c-9.9 0-17-5.7-17-12.5 0-6.1 5.2-11.5 12.7-13.1 1.9-.4 3.9.3 5.1 1.8 1.6 2 4.8 2 6.4 0 1.2-1.5 3.2-2.2 5.1-1.8C51.8 32 57 37.4 57 43.5 57 50.3 49.9 56 40 56h-8Z"
      />
    </svg>
  );
}

export default async function ServiceProviderProfilePage() {
  const { profile, availability } = await getMyProfile();

  if (!profile) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-12">
        <section className="mx-auto flex min-h-[60vh] w-full max-w-xl items-center justify-center">
          <article className="w-full rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
              <PawMark />
            </div>
            <h1 className="mt-6 text-2xl font-semibold text-slate-900">Complete your profile</h1>
            <p className="mt-2 text-slate-600">
              Pet owners are looking for services like yours.
            </p>
            <Link
              href="/dashboard/service-provider/profile/edit"
              className="mt-6 inline-flex rounded-lg bg-slate-900 px-4 py-2.5 font-medium text-white transition hover:bg-slate-700"
            >
              Complete profile
            </Link>
          </article>
        </section>
      </main>
    );
  }

  const serviceTypeLabel =
    SERVICE_TYPES.find((serviceType) => serviceType.value === profile.service_type)?.label ??
    "Service Provider";

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <section className="mx-auto w-full max-w-5xl space-y-6">
        <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-emerald-700">
              PawConnect
            </p>
            <h1 className="mt-1 text-2xl font-semibold text-slate-900">Your provider profile</h1>
            <p className="mt-1 text-sm text-slate-600">
              Keep your business details and schedule up to date.
            </p>
          </div>

          <Link
            href="/dashboard/service-provider/profile/edit"
            className="inline-flex rounded-lg bg-slate-900 px-4 py-2.5 font-medium text-white transition hover:bg-slate-700"
          >
            Edit profile
          </Link>
        </div>

        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="relative h-24 w-24 overflow-hidden rounded-full border border-slate-200 bg-slate-100">
              {profile.avatar_url ? (
                <Image
                  src={profile.avatar_url}
                  alt={profile.business_name}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <PawMark />
                </div>
              )}
            </div>

            <div className="flex-1">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-slate-900">{profile.business_name}</h2>
                  <p className="mt-1 text-sm text-slate-600">
                    {profile.city}, {profile.state}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm font-medium text-slate-700">
                    {serviceTypeLabel}
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 text-sm font-medium ${
                      profile.is_available
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {profile.is_available ? "Available" : "Unavailable"}
                  </span>
                </div>
              </div>

              <div className="mt-4 grid gap-3 text-sm text-slate-600 sm:grid-cols-3">
                <div>
                  <dt className="font-medium text-slate-900">Pricing</dt>
                  <dd>
                    {profile.price_from !== null && profile.price_to !== null
                      ? `₹${profile.price_from} - ₹${profile.price_to} / ${profile.price_unit.replace("per_", "")}`
                      : "Not set"}
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-slate-900">Phone</dt>
                  <dd>{profile.phone}</dd>
                </div>
                <div>
                  <dt className="font-medium text-slate-900">Experience</dt>
                  <dd>
                    {profile.years_experience !== null
                      ? `${profile.years_experience} years`
                      : "Not set"}
                  </dd>
                </div>
              </div>
            </div>
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Availability schedule</h2>
          {availability.length === 0 ? (
            <p className="mt-3 text-sm text-slate-600">No availability schedule added yet.</p>
          ) : (
            <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50 text-left text-slate-700">
                  <tr>
                    <th className="px-4 py-3 font-medium">Day</th>
                    <th className="px-4 py-3 font-medium">Hours</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white text-slate-600">
                  {DAYS_OF_WEEK.map((dayLabel, dayIndex) => {
                    const slots = availability.filter(
                      (slot) => slot.day_of_week === dayIndex,
                    );

                    return (
                      <tr key={dayLabel}>
                        <td className="px-4 py-3 font-medium text-slate-900">{dayLabel}</td>
                        <td className="px-4 py-3">
                          {slots.length > 0
                            ? slots.map((slot) => `${slot.open_time} - ${slot.close_time}`).join(", ")
                            : "Closed"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </article>
      </section>
    </main>
  );
}
