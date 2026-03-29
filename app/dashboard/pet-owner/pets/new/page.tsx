import Link from "next/link";

import { PetForm } from "@/app/dashboard/pet-owner/pets/pet-form";

export default function NewPetPage() {
  return (
    <main className="min-h-screen bg-bg px-6 py-10">
      <section className="mx-auto w-full max-w-3xl card sm:p-8">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-sage">
              PawConnect
            </p>
            <h1 className="mt-1 text-2xl font-semibold text-ink">Add New Pet</h1>
          </div>
          <Link
            href="/dashboard/pet-owner/pets"
            className="text-sm font-medium text-muted underline hover:text-ink"
          >
            Back to pets
          </Link>
        </div>

        <PetForm mode="create" />
      </section>
    </main>
  );
}
