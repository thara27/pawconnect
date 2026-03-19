export type PetSpecies = "dog" | "cat" | "bird" | "rabbit" | "other";

export type PetGender = "male" | "female" | "unknown";

export type PetBreedSize =
  | "toy"
  | "small"
  | "medium"
  | "large"
  | "giant";

export const PET_SPECIES: PetSpecies[] = [
  "dog",
  "cat",
  "bird",
  "rabbit",
  "other",
];

export const PET_GENDERS: PetGender[] = ["male", "female", "unknown"];

export const PET_BREED_SIZES: PetBreedSize[] = [
  "toy",
  "small",
  "medium",
  "large",
  "giant",
];

export const PET_FORM_LIMITS = {
  nameMaxLength: 80,
  breedMaxLength: 80,
  colorMaxLength: 40,
  bloodTypeMaxLength: 20,
  microchipIdMaxLength: 50,
  medicalNotesMaxLength: 1000,
  maxAgeYears: 40,
  maxWeightKg: 250,
  maxPhotoSizeBytes: 1 * 1024 * 1024,
} as const;

export const PET_PHOTO_MAX_SIZE_LABEL = "1 MB";

export const PET_PHOTO_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export type Pet = {
  id: string;
  owner_id: string;
  name: string;
  species: PetSpecies;
  breed: string | null;
  breed_size: PetBreedSize | null;
  age_years: number | null;
  weight_kg: number | null;
  gender: PetGender | null;
  blood_type: string | null;
  color: string | null;
  microchip_id: string | null;
  is_vaccinated: boolean;
  is_vaccinated_rabies: boolean;
  is_vaccinated_dhpp: boolean;
  last_dewormed: string | null;
  next_deworming: string | null;
  neutered: boolean;
  medical_notes: string | null;
  photo_url: string | null;
  created_at: string;
  updated_at: string;
};
