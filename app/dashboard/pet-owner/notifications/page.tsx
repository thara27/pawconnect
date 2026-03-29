import Link from "next/link";

export default function PetOwnerNotificationsPage() {
  return (
    <main className="bg-bg px-4 py-6">
      <section className="mx-auto w-full max-w-4xl rounded-2xl border border-border bg-white p-6">
        <h1 className="text-2xl font-bold text-ink">Notifications</h1>
        <p className="mt-2 text-sm text-muted">
          Your pet owner notifications will appear here.
        </p>

        <div className="mt-5">
          <Link
            href="/dashboard/pet-owner"
            className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-ink hover:bg-bg"
          >
            Back to Dashboard
          </Link>
        </div>
      </section>
    </main>
  );
}
