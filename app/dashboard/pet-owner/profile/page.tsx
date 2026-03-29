import Link from "next/link";

export default function PetOwnerProfilePage() {
  return (
    <main className="bg-bg px-4 py-6">
      <section className="mx-auto w-full max-w-4xl rounded-2xl border border-border bg-white p-6">
        <h1 className="heading-md">My Profile</h1>
        <p className="mt-2 text-sm text-muted">
          Pet owner profile page is now available. You can expand this with personal info,
          emergency contact, and preferred vet details.
        </p>

        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/dashboard/pet-owner" className="btn btn-outline btn-sm">
            Back to Dashboard
          </Link>
          <Link href="/dashboard/pet-owner/pets" className="btn btn-primary btn-sm">
            Manage My Dogs
          </Link>
        </div>
      </section>
    </main>
  );
}
