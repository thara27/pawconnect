import Link from "next/link";

import { PetForm } from "@/app/dashboard/pet-owner/pets/pet-form";

export default function NewPetPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <section className="mx-auto w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-emerald-700">
              PawConnect
            </p>
            <h1 className="mt-1 text-2xl font-semibold text-slate-900">Add New Pet</h1>
          </div>
          <Link
            href="/dashboard/pet-owner/pets"
            className="text-sm font-medium text-slate-700 underline"
          >
            Back to pets
          </Link>
        </div>

        <PetForm mode="create" />
      </section>
    </main>
  );
}
