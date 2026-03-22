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
      <div className="mb-1 flex items-center justify-between text-sm text-slate-700">
        <span>{label}</span>
        <span>{value}/5</span>
      </div>
      <div className="h-2 rounded-full bg-slate-200">
        <div className={`h-2 rounded-full bg-[#E8602C] ${widthClass}`} />
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
    <main className="min-h-screen bg-[#FDF8F3] px-4 py-10">
      <div className="mx-auto w-full max-w-4xl space-y-6">
        <Link href="/breeds" className="inline-flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to breeds
        </Link>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-4xl text-slate-900">{profile.breed_name}</h1>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
              {profile.size}
            </span>
            <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-[#E8602C]">
              {profile.origin}
            </span>
          </div>
          <p className="mt-3 text-sm text-slate-600">{profile.summary}</p>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl text-slate-900">Traits</h2>
          <div className="mt-4 space-y-4">
            <TraitBar label="Energy level" value={profile.energy_level} />
            <TraitBar label="Grooming needs" value={profile.grooming_needs} />
            <TraitBar label="Training difficulty" value={profile.training_difficulty} />
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl text-slate-900">India suitability</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
              Climate: {profile.india_climate_suitability}
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
              Popularity: {profile.popularity_in_india}
            </span>
          </div>
          <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-slate-700">
            {profile.india_care_tips.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl text-slate-900">Health</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700">
            {profile.common_health_issues.map((issue) => (
              <li key={issue}>{issue}</li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl text-slate-900">Care</h2>
          <p className="mt-2 text-sm text-slate-700"><span className="font-semibold">Exercise:</span> {profile.exercise_needs}</p>
          <p className="mt-2 text-sm text-slate-700"><span className="font-semibold">Feeding:</span> {profile.feeding_guide}</p>
        </section>

        <section className="rounded-2xl border border-orange-200 bg-orange-50 p-6 shadow-sm">
          <h2 className="text-2xl text-[#E8602C]">Fun fact</h2>
          <p className="mt-2 text-sm text-orange-900">{profile.fun_fact}</p>
        </section>

        <SignupNudge
          message={`Own a ${profile.breed_name}? Add them to PawConnect.`}
          ctaText="Join Free"
        />
      </div>
    </main>
  );
}
