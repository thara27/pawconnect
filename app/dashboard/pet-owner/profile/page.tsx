import Link from "next/link";

export default function PetOwnerProfilePage() {
  return (
    <main className="min-h-screen bg-bg px-4 py-6">
      <section className="mx-auto w-full max-w-4xl rounded-2xl border border-border bg-white p-6">
        <h1 className="text-2xl font-bold text-ink">My Profile</h1>
        <p className="mt-2 text-sm text-muted">
          Pet owner profile page is now available. You can expand this with personal info,
          emergency contact, and preferred vet details.
        </p>

        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/dashboard/pet-owner"
            className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-ink hover:bg-bg"
          >
            Back to Dashboard
          </Link>
          <Link
            href="/dashboard/pet-owner/pets"
            className="rounded-lg bg-amber px-4 py-2 text-sm font-semibold text-white"
          >
            Manage My Dogs
          </Link>
        </div>
      </section>
    </main>
  );
}
