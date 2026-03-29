import Link from "next/link";

export default function ServiceProviderSettingsPage() {
  return (
    <main className="bg-bg px-4 py-6">
      <section className="mx-auto w-full max-w-4xl rounded-2xl border border-border bg-white p-6">
        <h1 className="heading-md">Settings</h1>
        <p className="mt-2 text-sm text-muted">
          Service provider settings page is available for account preferences.
        </p>

        <div className="mt-5">
          <Link href="/dashboard/service-provider" className="btn btn-outline btn-sm">
            Back to Dashboard
          </Link>
        </div>
      </section>
    </main>
  );
}
