import Link from "next/link";

import { ProviderProfileForm } from "@/app/dashboard/service-provider/profile/provider-profile-form";
import { getMyProfile } from "@/lib/actions/providers";

export default async function EditServiceProviderProfilePage() {
  const { profile, availability } = await getMyProfile();

  return (
    <main className="bg-bg px-6 py-10">
      <section className="mx-auto w-full max-w-4xl card sm:p-8">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-sage">
              PawConnect
            </p>
            <h1 className="mt-1 text-2xl font-semibold text-ink">
              {profile ? "Edit provider profile" : "Create provider profile"}
            </h1>
          </div>
          <Link
            href="/dashboard/service-provider/profile"
            className="text-sm font-medium text-muted underline hover:text-ink"
          >
            Back to profile
          </Link>
        </div>

        <ProviderProfileForm profile={profile} availability={availability} />
      </section>
    </main>
  );
}
