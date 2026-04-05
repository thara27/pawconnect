import Image from "next/image";
import Link from "next/link";

import { PetDeleteButton } from "@/app/dashboard/pet-owner/pets/pet-delete-button";
import { getPets } from "@/lib/actions/pets";
import TrackEvent from "@/app/components/ui/TrackEvent";

function petGradient(breed: string | null) {
  const value = (breed ?? "").toLowerCase();
  if (value.includes("golden") || value.includes("labrador")) {
    return "bg-gradient-to-br from-amber-100 via-orange-100 to-orange-200";
  }
  if (value.includes("pomeranian") || value.includes("shih tzu")) {
    return "bg-gradient-to-br from-rose-100 via-pink-100 to-fuchsia-100";
  }
  if (value.includes("beagle") || value.includes("indie") || value.includes("indian")) {
    return "bg-gradient-to-br from-sky-100 via-blue-100 to-cyan-100";
  }
  return "bg-gradient-to-br from-emerald-100 via-lime-100 to-green-100";
}

export default async function PetProfilesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const pets = await getPets();

  return (
    <main className="bg-bg px-6 py-10">
      <section className="mx-auto w-full max-w-6xl">
        <div className="card-flat flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="badge badge-brand">
              PawConnect
            </p>
            <h1 className="heading-md mt-2">
              Pet Profiles
            </h1>
            <p className="mt-1 text-sm text-muted">
              Manage your pets and keep their profile details up to date.
            </p>
          </div>

          <Link
            href="/dashboard/pet-owner/pets/new"
            className="btn btn-primary"
          >
            Add new pet
          </Link>
        </div>

        {status === "created" ? (
          <>
            <TrackEvent event="pet_added" />
            <p className="alert alert-success mt-6">
              Pet profile created successfully.
            </p>
          </>
        ) : null}

        {status === "deleted" ? (
          <p className="alert alert-success mt-6">
            Pet profile deleted successfully.
          </p>
        ) : null}

        {pets.length === 0 ? (
          <div className="mt-6 rounded-2xl border-2 border-dashed border-border bg-white px-6 py-12 text-center">
            <p className="text-5xl">🐶</p>
            <h2 className="mt-3 font-fraunces text-xl font-black text-ink">Add your first dog</h2>
            <p className="mt-1 text-sm text-muted">
              Create a profile for your pup — breed, age, vaccination status and more.
            </p>
            <Link
              href="/dashboard/pet-owner/pets/new"
              className="btn btn-primary mt-5"
            >
              Add my dog 🐾
            </Link>
            <p className="mt-4 text-xs text-muted">
              Providers use your dog&apos;s profile to tailor their service.
            </p>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pets.map((pet) => (
              <article
                key={pet.id}
                className="card overflow-hidden"
              >
                {pet.photo_url ? (
                  <div className={`relative h-44 w-full overflow-hidden ${petGradient(pet.breed)}`}>
                    <div className="absolute right-3 top-3 z-10">
                      {pet.is_vaccinated ? (
                      <span className="badge badge-success">✓ Vaccinated</span>
                    ) : (
                      <span className="badge badge-warning">⚠ Shots due</span>
                      )}
                    </div>
                    <Image
                      src={pet.photo_url}
                      alt={pet.name}
                      fill
                      className="object-cover mix-blend-multiply"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                ) : (
                  <div className={`relative flex h-44 w-full items-center justify-center ${petGradient(pet.breed)} text-muted`}>
                    <div className="absolute right-3 top-3">
                      {pet.is_vaccinated ? (
                        <span className="badge badge-success">✓ Vaccinated</span>
                      ) : (
                        <span className="badge badge-warning">⚠ Shots due</span>
                      )}
                    </div>
                    <span className="text-sm font-semibold">No photo</span>
                  </div>
                )}

                <div className="space-y-1 p-4">
                  <h2 className="heading-sm">{pet.name}</h2>
                  <p className="text-sm text-muted">
                    {pet.species} {pet.breed ? `- ${pet.breed}` : ""}
                  </p>
                  <p className="text-sm text-muted">
                    Age: {pet.age_years !== null ? `${pet.age_years} years` : "Not set"}
                  </p>

                  <div className="pt-3 flex flex-wrap gap-2">
                    <Link href={`/dashboard/pet-owner/pets/${pet.id}`} className="btn btn-outline btn-sm">
                      View details
                    </Link>
                    <Link href={`/dashboard/pet-owner/pets/${pet.id}/edit`} className="btn btn-ghost btn-sm">
                      Edit
                    </Link>
                    <PetDeleteButton petId={pet.id} />
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
