import { createClient } from "@/lib/supabase/server";
import { PLACEHOLDER_BREEDS } from "@/lib/types/breed";
import type { BreedProfile } from "@/lib/types/breed";

import BreedDirectoryClient from "./breed-directory-client";

function normalizeBreedRow(row: Partial<BreedProfile>): BreedProfile {
  return {
    breed_name: row.breed_name ?? "Unknown Breed",
    breed_slug:
      row.breed_slug ??
      (row.breed_name ?? "unknown")
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-"),
    size: row.size ?? "medium",
    origin: row.origin ?? "Unknown",
    temperament: row.temperament ?? [],
    energy_level: row.energy_level ?? 3,
    grooming_needs: row.grooming_needs ?? 3,
    training_difficulty: row.training_difficulty ?? 3,
    india_climate_suitability: row.india_climate_suitability ?? "medium",
    popularity_in_india: row.popularity_in_india ?? "Growing",
    india_care_tips: row.india_care_tips ?? [],
    common_health_issues: row.common_health_issues ?? [],
    exercise_needs: row.exercise_needs ?? "Moderate exercise",
    feeding_guide: row.feeding_guide ?? "Balanced daily nutrition",
    fun_fact: row.fun_fact ?? "Every dog has a unique personality.",
    summary: row.summary ?? "Breed profile is being generated.",
  };
}

export default async function BreedsPage() {
  const supabase = await createClient();
  let breeds: BreedProfile[] = PLACEHOLDER_BREEDS;
  let isFallback = true;

  try {
    const { data, error } = await supabase
      .from("breed_profiles")
      .select("*")
      .order("breed_name", { ascending: true });

    if (!error && data && data.length > 0) {
      breeds = (data as Partial<BreedProfile>[]).map(normalizeBreedRow);
      isFallback = false;
    }
  } catch {
    breeds = PLACEHOLDER_BREEDS;
    isFallback = true;
  }

  return <BreedDirectoryClient breeds={breeds} isFallback={isFallback} />;
}
