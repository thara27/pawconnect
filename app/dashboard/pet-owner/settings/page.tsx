import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SignOutButton } from "@/app/components/sign-out-button";

export default async function PetOwnerSettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const isOAuthUser = (user.app_metadata?.provider ?? "") !== "email";

  return (
    <main className="bg-bg px-4 py-6">
      <section className="mx-auto w-full max-w-2xl space-y-6">
        <div>
          <h1 className="heading-md">Settings</h1>
          <p className="mt-1 text-sm text-muted">Manage your account preferences.</p>
        </div>

        {/* Account info */}
        <div className="rounded-2xl border border-border bg-white p-6 space-y-3">
          <h2 className="text-sm font-semibold text-ink">Account</h2>
          <div className="text-sm text-muted">
            <p>Email: <span className="font-medium text-ink">{user.email}</span></p>
            <p className="mt-1">
              Sign-in method:{" "}
              <span className="font-medium text-ink capitalize">
                {user.app_metadata?.provider ?? "email"}
              </span>
            </p>
          </div>
          <Link
            href="/dashboard/pet-owner/profile"
            className="btn btn-outline btn-sm"
          >
            Edit profile
          </Link>
        </div>

        {/* Password */}
        {!isOAuthUser && (
          <div className="rounded-2xl border border-border bg-white p-6 space-y-3">
            <h2 className="text-sm font-semibold text-ink">Password</h2>
            <p className="text-sm text-muted">
              Send a password reset link to your email address.
            </p>
            <Link href="/forgot-password" className="btn btn-outline btn-sm">
              Reset password
            </Link>
          </div>
        )}

        {/* Notifications placeholder */}
        <div className="rounded-2xl border border-border bg-white p-6 space-y-3">
          <h2 className="text-sm font-semibold text-ink">Notifications</h2>
          <p className="text-sm text-muted">
            Notification preferences will be available here soon.
          </p>
        </div>

        {/* Danger zone */}
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 space-y-3">
          <h2 className="text-sm font-semibold text-red-700">Sign out</h2>
          <p className="text-sm text-red-600">
            You will be signed out of your account on this device.
          </p>
          <SignOutButton />
        </div>
      </section>
    </main>
  );
}
