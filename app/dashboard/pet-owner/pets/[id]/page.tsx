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
    <main className="min-h-screen bg-bg px-6 py-10">
      <section className="mx-auto w-full max-w-4xl space-y-6">
        <div className="card flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-sage">
              PawConnect
            </p>
            <h1 className="mt-1 text-3xl font-semibold text-ink">{pet.name}</h1>
            <p className="mt-2 text-sm text-muted">
              {pet.species} {pet.breed ? `- ${pet.breed}` : ""}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/dashboard/pet-owner/pets"
              className="btn btn-outline btn-sm"
            >
              Back to pets
            </Link>
            <Link
              href={`/dashboard/pet-owner/pets/${pet.id}/edit`}
              className="btn btn-primary btn-sm"
            >
              Edit profile
            </Link>
          </div>
        </div>

        {status === "updated" ? (
          <p className="rounded-lg border border-sage-light bg-sage-light px-4 py-3 text-sm text-sage">
            Pet profile updated successfully.
          </p>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <article className="card overflow-hidden">
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
              <div className="flex h-72 w-full items-center justify-center bg-bg text-muted">
                No photo uploaded
              </div>
            )}
          </article>

          <article className="card">
            <h2 className="heading-sm">Profile details</h2>
            <dl className="mt-4 grid grid-cols-1 gap-4 text-sm text-muted sm:grid-cols-2">
              <div>
                <dt className="font-medium text-ink">Age</dt>
                <dd>{pet.age_years ?? "Not set"}</dd>
              </div>
              <div>
                <dt className="font-medium text-ink">Weight</dt>
                <dd>{pet.weight_kg ? `${pet.weight_kg} kg` : "Not set"}</dd>
              </div>
              <div>
                <dt className="font-medium text-ink">Gender</dt>
                <dd>{pet.gender ?? "Not set"}</dd>
              </div>
              <div>
                <dt className="font-medium text-ink">Blood type</dt>
                <dd>{pet.blood_type ?? "Not set"}</dd>
              </div>
              <div>
                <dt className="font-medium text-ink">Color</dt>
                <dd>{pet.color ?? "Not set"}</dd>
              </div>
              <div>
                <dt className="font-medium text-ink">Microchip ID</dt>
                <dd>{pet.microchip_id ?? "Not set"}</dd>
              </div>
              <div>
                <dt className="font-medium text-ink">Vaccination</dt>
                <dd>{pet.is_vaccinated ? "Vaccinated" : "Not vaccinated"}</dd>
              </div>
              <div>
                <dt className="font-medium text-ink">Created</dt>
                <dd>{new Date(pet.created_at).toLocaleDateString()}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="font-medium text-ink">Medical notes</dt>
                <dd>{pet.medical_notes ?? "No medical notes added."}</dd>
              </div>
            </dl>
          </article>
        </div>

        <article className="card">
          <h2 className="heading-sm">Danger zone</h2>
          <p className="mt-1 text-sm text-muted">
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
