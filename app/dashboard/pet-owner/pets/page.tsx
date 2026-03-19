import Image from "next/image";
import Link from "next/link";

import { PetDeleteButton } from "@/app/dashboard/pet-owner/pets/pet-delete-button";
import { getPets } from "@/lib/actions/pets";

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
    <main className="min-h-screen bg-bg px-6 py-10">
      <section className="mx-auto w-full max-w-6xl">
        <div className="flex flex-col gap-4 rounded-2xl border border-border bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-emerald-700">
              PawConnect
            </p>
            <h1 className="mt-1 text-2xl font-semibold text-slate-900">
              Pet Profiles
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Manage your pets and keep their profile details up to date.
            </p>
          </div>

          <Link
            href="/dashboard/pet-owner/pets/new"
            className="inline-flex items-center justify-center rounded-full bg-orange px-5 py-2.5 text-sm font-bold text-white transition hover:bg-orange-dark"
          >
            Add new pet
          </Link>
        </div>

        {status === "created" ? (
          <p className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            Pet profile created successfully.
          </p>
        ) : null}

        {status === "deleted" ? (
          <p className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            Pet profile deleted successfully.
          </p>
        ) : null}

        {pets.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <h2 className="text-lg font-medium text-slate-900">No pets yet</h2>
            <p className="mt-1 text-sm text-slate-600">
              Add your first pet profile to get started.
            </p>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pets.map((pet) => (
              <article
                key={pet.id}
                className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm"
              >
                {pet.photo_url ? (
                  <div className={`relative h-44 w-full overflow-hidden ${petGradient(pet.breed)}`}>
                    <div className="absolute right-3 top-3 z-10">
                      {pet.is_vaccinated ? (
                        <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-bold text-emerald-700">✓ Vaccinated</span>
                      ) : (
                        <span className="rounded-full bg-orange-light px-2.5 py-1 text-[11px] font-bold text-orange">⚠ Shots due</span>
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
                  <div className={`relative flex h-44 w-full items-center justify-center ${petGradient(pet.breed)} text-slate-600`}>
                    <div className="absolute right-3 top-3">
                      {pet.is_vaccinated ? (
                        <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-bold text-emerald-700">✓ Vaccinated</span>
                      ) : (
                        <span className="rounded-full bg-orange-light px-2.5 py-1 text-[11px] font-bold text-orange">⚠ Shots due</span>
                      )}
                    </div>
                    <span className="text-sm font-semibold">No photo</span>
                  </div>
                )}

                <div className="space-y-1 p-4">
                  <h2 className="text-lg font-semibold text-slate-900">{pet.name}</h2>
                  <p className="text-sm text-slate-600">
                    {pet.species} {pet.breed ? `- ${pet.breed}` : ""}
                  </p>
                  <p className="text-sm text-slate-600">
                    Age: {pet.age_years !== null ? `${pet.age_years} years` : "Not set"}
                  </p>

                  <div className="pt-3 flex flex-wrap gap-2">
                    <Link
                      href={`/dashboard/pet-owner/pets/${pet.id}`}
                      className="rounded-full border-2 border-orange px-5 py-2 text-sm font-bold text-orange transition hover:bg-orange-light"
                    >
                      View details
                    </Link>
                    <Link
                      href={`/dashboard/pet-owner/pets/${pet.id}/edit`}
                      className="rounded-full border border-border bg-white px-5 py-2 text-sm font-bold text-ink transition hover:bg-bg"
                    >
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
