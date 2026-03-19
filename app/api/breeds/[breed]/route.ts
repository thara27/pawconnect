import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { PLACEHOLDER_BREEDS } from "@/lib/types/breed";
import type { BreedProfile } from "@/lib/types/breed";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function normalizeBreed(row: Partial<BreedProfile>, fallbackSlug: string): BreedProfile {
  return {
    breed_name: row.breed_name ?? fallbackSlug.replace(/-/g, " "),
    breed_slug: row.breed_slug ?? fallbackSlug,
    size: row.size ?? "medium",
    origin: row.origin ?? "Unknown",
    energy_level: row.energy_level ?? 3,
    grooming_needs: row.grooming_needs ?? 3,
    training_difficulty: row.training_difficulty ?? 3,
    india_climate_suitability: row.india_climate_suitability ?? "medium",
    popularity_in_india: row.popularity_in_india ?? "Growing",
    india_care_tips: row.india_care_tips ?? [],
    common_health_issues: row.common_health_issues ?? [],
    exercise_needs: row.exercise_needs ?? "Moderate daily exercise",
    feeding_guide: row.feeding_guide ?? "Balanced nutrition based on age and weight",
    fun_fact: row.fun_fact ?? "Each dog has unique behavior traits.",
    summary: row.summary ?? "Profile generated for PawConnect users.",
  };
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ breed: string }> },
) {
  const { breed } = await context.params;
  const breedSlug = slugify(decodeURIComponent(breed));

  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("breed_profiles")
      .select("*")
      .or(`breed_slug.eq.${breedSlug},breed_name.ilike.${breedSlug.replace(/-/g, " ")}`)
      .limit(1)
      .maybeSingle();

    if (!error && data) {
      return NextResponse.json(normalizeBreed(data as Partial<BreedProfile>, breedSlug), {
        status: 200,
      });
    }
  } catch {
    // Continue with fallback generation.
  }

  const fallback =
    PLACEHOLDER_BREEDS.find((breedProfile) => breedProfile.breed_slug === breedSlug) ??
    normalizeBreed(
      {
        breed_name: breedSlug
          .split("-")
          .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
          .join(" "),
        breed_slug: breedSlug,
        size: "medium",
        origin: "Unknown",
        energy_level: 3,
        grooming_needs: 3,
        training_difficulty: 3,
        india_climate_suitability: "medium",
        popularity_in_india: "Emerging",
        india_care_tips: [
          "Provide hydration and shade in hot weather.",
          "Schedule regular deworming and vaccinations.",
        ],
        common_health_issues: ["Skin sensitivity", "Digestive upset"],
        exercise_needs: "45-60 minutes daily",
        feeding_guide: "Two balanced meals with adequate protein",
        fun_fact: "This profile was generated from PawConnect defaults.",
        summary: "AI profile generation will become richer in the next sprint.",
      },
      breedSlug,
    );

  try {
    await supabase.from("breed_profiles").upsert(
      {
        ...fallback,
        breed_slug: fallback.breed_slug || slugify(fallback.breed_name),
      },
      { onConflict: "breed_slug" },
    );
  } catch {
    // Caching is best-effort.
  }

  return NextResponse.json(fallback, { status: 200 });
}
