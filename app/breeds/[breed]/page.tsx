import Link from "next/link";

import { fetchBreedProfile, slugifyBreed } from "@/lib/data/breeds";
import SignupNudge from "@/app/components/ui/SignupNudge";

function TraitBar({ label, value }: { label: string; value: number }) {
  const clampedValue = Math.max(0, Math.min(5, Math.round(value)));
  const widthClass =
    clampedValue === 1
      ? "w-1/5"
      : clampedValue === 2
        ? "w-2/5"
        : clampedValue === 3
          ? "w-3/5"
          : clampedValue === 4
            ? "w-4/5"
            : "w-full";

  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-sm text-muted">
        <span>{label}</span>
        <span>{value}/5</span>
      </div>
      <div className="h-2 rounded-full bg-border">
        <div className={`h-2 rounded-full bg-brand ${widthClass}`} />
      </div>
    </div>
  );
}

export default async function BreedProfilePage({
  params,
}: {
  params: Promise<{ breed: string }>;
}) {
  const { breed } = await params;
  const breedSlug = slugifyBreed(decodeURIComponent(breed));
  const profile = await fetchBreedProfile(breedSlug);

  return (
    <main className="bg-bg px-4 py-10">
        <div className="mx-auto w-full max-w-4xl space-y-6">
        <Link href="/breeds" className="inline-flex items-center gap-1 text-sm text-muted hover:text-ink">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to breeds
        </Link>

        <section className="card">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="heading-lg">{profile.breed_name}</h1>
            <span className="badge badge-neutral">
              {profile.size}
            </span>
            <span className="badge badge-brand">
              {profile.origin}
            </span>
          </div>
          <p className="mt-3 text-sm text-muted">{profile.summary}</p>
          {profile.temperament.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {profile.temperament.map((trait) => (
                <span key={trait} className="badge badge-sage">{trait}</span>
              ))}
            </div>
          )}
        </section>

        <section className="card">
          <h2 className="heading-sm">Traits</h2>
          <div className="mt-4 space-y-4">
            <TraitBar label="Energy level" value={profile.energy_level} />
            <TraitBar label="Grooming needs" value={profile.grooming_needs} />
            <TraitBar label="Training difficulty" value={profile.training_difficulty} />
          </div>
        </section>

        <section className="card">
          <h2 className="heading-sm">India suitability</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="badge badge-success">
              Climate: {profile.india_climate_suitability}
            </span>
            <span className="badge badge-neutral">
              Popularity: {profile.popularity_in_india}
            </span>
          </div>
          <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-muted">
            {profile.india_care_tips.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        </section>

        <section className="card">
          <h2 className="heading-sm">Health</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted">
            {profile.common_health_issues.map((issue) => (
              <li key={issue}>{issue}</li>
            ))}
          </ul>
        </section>

        <section className="card">
          <h2 className="heading-sm">Care</h2>
          <p className="mt-2 text-sm text-muted"><span className="font-semibold">Exercise:</span> {profile.exercise_needs}</p>
          <p className="mt-2 text-sm text-muted"><span className="font-semibold">Feeding:</span> {profile.feeding_guide}</p>
        </section>

        <section className="card" style={{ background: 'var(--color-brand-light)', borderColor: 'var(--color-brand)' }}>
          <h2 className="heading-sm text-brand">Fun fact</h2>
          <p className="mt-2 text-sm text-ink">{profile.fun_fact}</p>
        </section>

        <SignupNudge
          message={`Own a ${profile.breed_name}? Add them to PawConnect.`}
          ctaText="Join Free"
        />
        </div>
    </main>
  );
}
