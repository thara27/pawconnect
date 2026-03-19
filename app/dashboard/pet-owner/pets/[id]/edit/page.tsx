import Link from "next/link";
import { notFound } from "next/navigation";

import { PetForm } from "@/app/dashboard/pet-owner/pets/pet-form";
import { getPetById } from "@/lib/actions/pets";

export default async function EditPetPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const pet = await getPetById(id);

  if (!pet) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <section className="mx-auto w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-emerald-700">
              PawConnect
            </p>
            <h1 className="mt-1 text-2xl font-semibold text-slate-900">Edit Pet Profile</h1>
          </div>
          <Link
            href={`/dashboard/pet-owner/pets/${pet.id}`}
            className="text-sm font-medium text-slate-700 underline"
          >
            Back to details
          </Link>
        </div>

        <PetForm mode="edit" pet={pet} />
      </section>
    </main>
  );
}
