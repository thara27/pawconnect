import Link from "next/link";

import { ProviderProfileForm } from "@/app/dashboard/service-provider/profile/provider-profile-form";
import { getMyProfile } from "@/lib/actions/providers";

export default async function EditServiceProviderProfilePage() {
  const { profile, availability } = await getMyProfile();

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <section className="mx-auto w-full max-w-4xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-emerald-700">
              PawConnect
            </p>
            <h1 className="mt-1 text-2xl font-semibold text-slate-900">
              {profile ? "Edit provider profile" : "Create provider profile"}
            </h1>
          </div>
          <Link
            href="/dashboard/service-provider/profile"
            className="text-sm font-medium text-slate-700 underline"
          >
            Back to profile
          </Link>
        </div>

        <ProviderProfileForm profile={profile} availability={availability} />
      </section>
    </main>
  );
}
