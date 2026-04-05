import { createClient } from "@/lib/supabase/server";
import { PLACEHOLDER_BREEDS } from "@/lib/types/breed";
import type { BreedProfile } from "@/lib/types/breed";

// ── Slug helpers ──────────────────────────────────────────────────────────────

export function slugifyBreed(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function breedNameFromSlug(slug: string): string {
  return slug
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");
}

// ── Normalizer ────────────────────────────────────────────────────────────────

export function normalizeBreed(row: Partial<BreedProfile>, fallbackSlug: string): BreedProfile {
  return {
    breed_name:               row.breed_name               ?? breedNameFromSlug(fallbackSlug),
    breed_slug:               row.breed_slug               ?? fallbackSlug,
    size:                     row.size                     ?? "medium",
    origin:                   row.origin                   ?? "Unknown",
    temperament:              row.temperament              ?? [],
    energy_level:             row.energy_level             ?? 3,
    grooming_needs:           row.grooming_needs           ?? 3,
    training_difficulty:      row.training_difficulty      ?? 3,
    india_climate_suitability: row.india_climate_suitability ?? "medium",
    popularity_in_india:      row.popularity_in_india      ?? "Growing",
    india_care_tips:          row.india_care_tips          ?? [],
    common_health_issues:     row.common_health_issues     ?? [],
    exercise_needs:           row.exercise_needs           ?? "Moderate daily exercise",
    feeding_guide:            row.feeding_guide            ?? "Balanced nutrition based on age and weight",
    fun_fact:                 row.fun_fact                 ?? "Each dog has unique behavior traits.",
    summary:                  row.summary                  ?? "Profile generated for PawConnect users.",
    generated_by_ai:          row.generated_by_ai          ?? false,
  };
}

// ── Claude AI generator ───────────────────────────────────────────────────────

type ClaudeMessage = {
  role: "user" | "assistant";
  content: string;
};

type ClaudeResponse = {
  content: Array<{ type: string; text: string }>;
};

const CLAUDE_API_URL = "https://api.anthropic.com/v1/messages";
const CLAUDE_MODEL   = "claude-3-5-haiku-20241022";
const CLAUDE_TIMEOUT = 20_000; // 20 s

function buildBreedPrompt(breedName: string): string {
  return `You are a veterinary expert. Generate a breed profile for "${breedName}" dogs that is specifically useful for Indian pet owners.

Return ONLY a valid JSON object — no markdown fences, no explanation — with these exact fields:

{
  "breed_name": "<proper display name>",
  "breed_slug": "<hyphen-lowercase slug>",
  "size": "<small|medium|large|giant>",
  "origin": "<country or region>",
  "temperament": ["<trait1>", "<trait2>", "<trait3>"],
  "energy_level": <1-5>,
  "grooming_needs": <1-5>,
  "training_difficulty": <1-5>,
  "india_climate_suitability": "<low|medium|high>",
  "popularity_in_india": "<short description>",
  "india_care_tips": ["<tip1>", "<tip2>", "<tip3>"],
  "common_health_issues": ["<issue1>", "<issue2>", "<issue3>"],
  "exercise_needs": "<description>",
  "feeding_guide": "<description>",
  "fun_fact": "<one interesting fact>",
  "summary": "<2-3 sentence summary>"
}

Scores: 1 = very low, 5 = very high.
india_climate_suitability: high = thrives in Indian climate, medium = manageable, low = struggles in heat.`;
}

async function callClaude(breedName: string): Promise<BreedProfile | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;

  const messages: ClaudeMessage[] = [
    { role: "user", content: buildBreedPrompt(breedName) },
  ];

  let response: Response;
  try {
    response = await fetch(CLAUDE_API_URL, {
      method: "POST",
      headers: {
        "x-api-key":         apiKey,
        "anthropic-version": "2023-06-01",
        "content-type":      "application/json",
      },
      body: JSON.stringify({
        model:      CLAUDE_MODEL,
        max_tokens: 1024,
        messages,
      }),
      signal: AbortSignal.timeout(CLAUDE_TIMEOUT),
    });
  } catch {
    // Network error or timeout
    return null;
  }

  if (!response.ok) return null;

  let json: ClaudeResponse;
  try {
    json = (await response.json()) as ClaudeResponse;
  } catch {
    return null;
  }

  const raw = json.content?.[0]?.text ?? "";

  // Strip any accidental markdown fences
  const cleaned = raw
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();

  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(cleaned) as Record<string, unknown>;
  } catch {
    return null;
  }

  return normalizeBreed(
    { ...(parsed as Partial<BreedProfile>), generated_by_ai: true },
    slugifyBreed(breedName),
  );
}

// ── Cache helpers ─────────────────────────────────────────────────────────────

async function cacheBreed(profile: BreedProfile): Promise<void> {
  try {
    const supabase = await createClient();
    await supabase
      .from("breed_profiles")
      .upsert(
        { ...profile, breed_slug: profile.breed_slug || slugifyBreed(profile.breed_name) },
        { onConflict: "breed_slug" },
      );
  } catch {
    // Caching is best-effort; never block the response.
  }
}

// ── Public API ────────────────────────────────────────────────────────────────

export async function fetchBreedProfile(breedSlug: string): Promise<BreedProfile> {
  const supabase = await createClient();

  // 1. DB cache hit
  try {
    const { data, error } = await supabase
      .from("breed_profiles")
      .select("*")
      .or(
        `breed_slug.eq.${breedSlug},breed_name.ilike.${breedSlug.replace(/-/g, " ")}`,
      )
      .limit(1)
      .maybeSingle();

    if (!error && data) {
      return normalizeBreed(data as Partial<BreedProfile>, breedSlug);
    }
  } catch {
    // Fall through to generation.
  }

  // 2. AI generation
  const breedName = breedNameFromSlug(breedSlug);
  const aiProfile = await callClaude(breedName);

  if (aiProfile) {
    // Persist asynchronously — don't await so the response is instant
    void cacheBreed(aiProfile);
    return aiProfile;
  }

  // 3. Static placeholder fallback
  const placeholder =
    PLACEHOLDER_BREEDS.find((b) => b.breed_slug === breedSlug) ??
    normalizeBreed(
      {
        breed_name:               breedName,
        breed_slug:               breedSlug,
        size:                     "medium",
        origin:                   "Unknown",
        temperament:              ["Loyal", "Adaptable", "Friendly"],
        energy_level:             3,
        grooming_needs:           3,
        training_difficulty:      3,
        india_climate_suitability: "medium",
        popularity_in_india:      "Emerging",
        india_care_tips: [
          "Provide shade and fresh water in summer.",
          "Schedule regular deworming and vaccinations.",
          "Visit a vet every 6 months for check-ups.",
        ],
        common_health_issues:     ["Skin sensitivity", "Digestive upset"],
        exercise_needs:           "45–60 minutes daily",
        feeding_guide:            "Two balanced meals with adequate protein",
        fun_fact:                 "Every dog breed has its own unique personality.",
        summary:                  "More detailed information will be available soon.",
        generated_by_ai:          false,
      },
      breedSlug,
    );

  void cacheBreed(placeholder);
  return placeholder;
}
