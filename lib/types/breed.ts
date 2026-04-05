export type BreedProfile = {
  breed_name: string;
  breed_slug: string;
  size: "small" | "medium" | "large" | "giant" | string;
  origin: string;
  temperament: string[];
  energy_level: number;
  grooming_needs: number;
  training_difficulty: number;
  india_climate_suitability: "low" | "medium" | "high" | string;
  popularity_in_india: string;
  india_care_tips: string[];
  common_health_issues: string[];
  exercise_needs: string;
  feeding_guide: string;
  fun_fact: string;
  summary: string;
  generated_by_ai?: boolean;
};

export const PLACEHOLDER_BREEDS: BreedProfile[] = [
  {
    breed_name: "Indian Pariah Dog",
    breed_slug: "indian-pariah-dog",
    size: "medium",
    origin: "India",
    energy_level: 4,
    grooming_needs: 2,
    training_difficulty: 3,
    india_climate_suitability: "high",
    popularity_in_india: "Very high in urban and rural India",
    india_care_tips: [
      "Provide daily walks and puzzle play for mental stimulation",
      "Maintain regular tick and flea prevention in humid seasons",
    ],
    common_health_issues: ["Skin allergies", "Tick-borne diseases"],
    exercise_needs: "60-90 minutes of mixed activity daily",
    feeding_guide: "Balanced protein diet with portion control based on activity",
    fun_fact: "One of the oldest naturally evolved dog populations in the world.",
    summary: "Adaptable, intelligent and resilient Indian native dog.",
  },
  {
    breed_name: "Labrador Retriever",
    breed_slug: "labrador-retriever",
    size: "large",
    origin: "Canada",
    energy_level: 4,
    grooming_needs: 3,
    training_difficulty: 2,
    india_climate_suitability: "medium",
    popularity_in_india: "Very popular family breed in metros",
    india_care_tips: [
      "Avoid midday heat walks in summer",
      "Monitor weight closely and adjust treats",
    ],
    common_health_issues: ["Hip dysplasia", "Obesity", "Ear infections"],
    exercise_needs: "At least 90 minutes of exercise daily",
    feeding_guide: "High-quality kibble plus measured home meals",
    fun_fact: "Originally bred as a fisherman helper and retriever.",
    summary: "Friendly, trainable and social companion dog.",
  },
  {
    breed_name: "German Shepherd",
    breed_slug: "german-shepherd",
    size: "large",
    origin: "Germany",
    energy_level: 5,
    grooming_needs: 3,
    training_difficulty: 3,
    india_climate_suitability: "medium",
    popularity_in_india: "Widely preferred for families and security",
    india_care_tips: [
      "Schedule coat brushing at least 3 times weekly",
      "Train with short and structured sessions",
    ],
    common_health_issues: ["Hip/elbow dysplasia", "Digestive sensitivity"],
    exercise_needs: "120 minutes with obedience and agility tasks",
    feeding_guide: "Protein-rich meals split into 2-3 portions per day",
    fun_fact: "Known for exceptional working intelligence.",
    summary: "Loyal, protective and highly trainable working breed.",
  },
];
