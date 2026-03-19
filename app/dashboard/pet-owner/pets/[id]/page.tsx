import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PetDeleteButton } from "@/app/dashboard/pet-owner/pets/pet-delete-button";
import { getPetById } from "@/lib/actions/pets";

export default async function PetDetailsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ status?: string }>;
}) {
  const { id } = await params;
  const { status } = await searchParams;
  const pet = await getPetById(id);

  if (!pet) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <section className="mx-auto w-full max-w-4xl space-y-6">
        <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-emerald-700">
              PawConnect
            </p>
            <h1 className="mt-1 text-3xl font-semibold text-slate-900">{pet.name}</h1>
            <p className="mt-2 text-sm text-slate-600">
              {pet.species} {pet.breed ? `- ${pet.breed}` : ""}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/dashboard/pet-owner/pets"
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              Back to pets
            </Link>
            <Link
              href={`/dashboard/pet-owner/pets/${pet.id}/edit`}
              className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
            >
              Edit profile
            </Link>
          </div>
        </div>

        {status === "updated" ? (
          <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            Pet profile updated successfully.
          </p>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            {pet.photo_url ? (
              <div className="relative h-72 w-full overflow-hidden">
                <Image
                  src={pet.photo_url}
                  alt={pet.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            ) : (
              <div className="flex h-72 w-full items-center justify-center bg-slate-100 text-slate-500">
                No photo uploaded
              </div>
            )}
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Profile details</h2>
            <dl className="mt-4 grid grid-cols-1 gap-4 text-sm text-slate-600 sm:grid-cols-2">
              <div>
                <dt className="font-medium text-slate-900">Age</dt>
                <dd>{pet.age_years ?? "Not set"}</dd>
              </div>
              <div>
                <dt className="font-medium text-slate-900">Weight</dt>
                <dd>{pet.weight_kg ? `${pet.weight_kg} kg` : "Not set"}</dd>
              </div>
              <div>
                <dt className="font-medium text-slate-900">Gender</dt>
                <dd>{pet.gender ?? "Not set"}</dd>
              </div>
              <div>
                <dt className="font-medium text-slate-900">Blood type</dt>
                <dd>{pet.blood_type ?? "Not set"}</dd>
              </div>
              <div>
                <dt className="font-medium text-slate-900">Color</dt>
                <dd>{pet.color ?? "Not set"}</dd>
              </div>
              <div>
                <dt className="font-medium text-slate-900">Microchip ID</dt>
                <dd>{pet.microchip_id ?? "Not set"}</dd>
              </div>
              <div>
                <dt className="font-medium text-slate-900">Vaccination</dt>
                <dd>{pet.is_vaccinated ? "Vaccinated" : "Not vaccinated"}</dd>
              </div>
              <div>
                <dt className="font-medium text-slate-900">Created</dt>
                <dd>{new Date(pet.created_at).toLocaleDateString()}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="font-medium text-slate-900">Medical notes</dt>
                <dd>{pet.medical_notes ?? "No medical notes added."}</dd>
              </div>
            </dl>
          </article>
        </div>

        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Danger zone</h2>
          <p className="mt-1 text-sm text-slate-600">
            Delete this pet profile if you no longer want it in PawConnect.
          </p>
          <div className="mt-4">
            <PetDeleteButton petId={pet.id} />
          </div>
        </article>
      </section>
    </main>
  );
}
