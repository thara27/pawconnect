import Link from "next/link";
import { redirect } from "next/navigation";

import { getPetOwnerProfile } from "@/lib/actions/profile";
import { ProfileForm } from "./profile-form";

export const metadata = {
  title: "My Profile · PawConnect",
};

export default async function PetOwnerProfilePage() {
  const data = await getPetOwnerProfile();

  if (!data) {
    redirect("/login");
  }

  const { user, profile } = data;

  // Derive display name for the greeting: prefer saved display_name, fall back to
  // Google full_name metadata, then email prefix.
  const displayName =
    profile?.display_name ??
    (user.user_metadata?.full_name as string | undefined) ??
    user.email?.split("@")[0] ??
    "there";

  return (
    <main className="bg-bg px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto w-full max-w-2xl space-y-6">

        {/* Page header */}
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/pet-owner"
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#EBEBEB] bg-white text-stone-500 transition hover:border-[#FF5722] hover:text-[#FF5722]"
            aria-label="Back to dashboard"
          >
            ←
          </Link>
          <div>
            <p className="badge badge-brand">My account</p>
            <h1 className="heading-md mt-1">Profile</h1>
          </div>
        </div>

        {/* Greeting card */}
        <div className="card-flat flex items-center gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#FFF3EE] text-xl">
            🐾
          </div>
          <div>
            <p className="text-sm font-semibold text-stone-800">
              Hey {displayName}!
            </p>
            <p className="text-xs text-stone-500">
              Keep your profile up to date so service providers can reach you easily.
            </p>
          </div>
        </div>

        {/* Profile form card */}
        <div className="card-flat">
          <h2 className="heading-sm mb-6">Personal information</h2>
          <ProfileForm email={user.email} initialProfile={profile} />
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-stone-400">
          Your email is managed by your sign-in provider and cannot be changed here.
        </p>

      </div>
    </main>
  );
}
