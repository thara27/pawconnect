"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import {
  PET_FORM_LIMITS,
  PET_GENDERS,
  PET_PHOTO_MAX_SIZE_LABEL,
  PET_PHOTO_TYPES,
  PET_SPECIES,
  type Pet,
} from "@/lib/types/pet";

export type PetFormState = {
  error: string | null;
};

export type PetDeleteState = {
  error: string | null;
};

function asOptionalString(value: FormDataEntryValue | null): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function asOptionalNumber(value: FormDataEntryValue | null): number | null {
  if (typeof value !== "string") {
    return null;
  }

  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function buildPhotoPath(ownerId: string, originalName: string) {
  const hasExtension = originalName.includes(".");
  const extension = hasExtension
    ? originalName.split(".").pop()?.toLowerCase() ?? "jpg"
    : "jpg";

  return `${ownerId}/${crypto.randomUUID()}.${extension}`;
}

function validateTextLength(
  value: string | null,
  label: string,
  maxLength: number,
) {
  if (value && value.length > maxLength) {
    throw new Error(`${label} must be ${maxLength} characters or fewer.`);
  }
}

function requirePetOwner(userType: unknown) {
  if (userType !== "pet_owner") {
    throw new Error("Only pet owners can manage pet profiles.");
  }
}

function validatePetPayload(formData: FormData) {
  const name = asOptionalString(formData.get("name"));
  const species = asOptionalString(formData.get("species"));
  const breed = asOptionalString(formData.get("breed"));
  const ageYears = asOptionalNumber(formData.get("age_years"));
  const weightKg = asOptionalNumber(formData.get("weight_kg"));
  const gender = asOptionalString(formData.get("gender"));
  const bloodType = asOptionalString(formData.get("blood_type"));
  const color = asOptionalString(formData.get("color"));
  const microchipId = asOptionalString(formData.get("microchip_id"));
  const medicalNotes = asOptionalString(formData.get("medical_notes"));
  const breedSize = asOptionalString(formData.get("breed_size"));
  const isVaccinated = formData.get("is_vaccinated") === "on";
  const isVaccinatedRabies = formData.get("is_vaccinated_rabies") === "on";
  const isVaccinatedDhpp = formData.get("is_vaccinated_dhpp") === "on";
  const lastDewormed = asOptionalString(formData.get("last_dewormed"));
  const nextDeworming = asOptionalString(formData.get("next_deworming"));
  const neutered = formData.get("neutered") === "on";
  const photo = formData.get("photo");

  if (!name) {
    throw new Error("Pet name is required.");
  }

  validateTextLength(name, "Name", PET_FORM_LIMITS.nameMaxLength);

  if (!species || !PET_SPECIES.includes(species as (typeof PET_SPECIES)[number])) {
    throw new Error("Select a valid species.");
  }

  validateTextLength(breed, "Breed", PET_FORM_LIMITS.breedMaxLength);
  validateTextLength(color, "Color", PET_FORM_LIMITS.colorMaxLength);
  validateTextLength(bloodType, "Blood type", PET_FORM_LIMITS.bloodTypeMaxLength);
  validateTextLength(
    microchipId,
    "Microchip ID",
    PET_FORM_LIMITS.microchipIdMaxLength,
  );
  validateTextLength(
    medicalNotes,
    "Medical notes",
    PET_FORM_LIMITS.medicalNotesMaxLength,
  );

  if (ageYears !== null && (ageYears < 0 || ageYears > PET_FORM_LIMITS.maxAgeYears)) {
    throw new Error(
      `Age must be between 0 and ${PET_FORM_LIMITS.maxAgeYears} years.`,
    );
  }

  if (weightKg !== null && (weightKg < 0 || weightKg > PET_FORM_LIMITS.maxWeightKg)) {
    throw new Error(
      `Weight must be between 0 and ${PET_FORM_LIMITS.maxWeightKg} kg.`,
    );
  }

  if (gender && !PET_GENDERS.includes(gender as (typeof PET_GENDERS)[number])) {
    throw new Error("Select a valid gender.");
  }

  if (microchipId && !/^[A-Za-z0-9-]+$/.test(microchipId)) {
    throw new Error("Microchip ID can only contain letters, numbers, and hyphens.");
  }

  if (photo instanceof File && photo.size > 0) {
    if (photo.size > PET_FORM_LIMITS.maxPhotoSizeBytes) {
      throw new Error(`Photo must be ${PET_PHOTO_MAX_SIZE_LABEL} or smaller.`);
    }

    if (
      photo.type &&
      !PET_PHOTO_TYPES.includes(photo.type as (typeof PET_PHOTO_TYPES)[number])
    ) {
      throw new Error("Photo must be a JPG, PNG, or WebP image.");
    }
  }

  return {
    name,
    species,
    breed,
    breed_size: breedSize,
    age_years: ageYears,
    weight_kg: weightKg,
    gender,
    blood_type: bloodType,
    color,
    microchip_id: microchipId,
    is_vaccinated: isVaccinated,
    is_vaccinated_rabies: isVaccinatedRabies,
    is_vaccinated_dhpp: isVaccinatedDhpp,
    last_dewormed: lastDewormed,
    next_deworming: nextDeworming,
    neutered,
    medical_notes: medicalNotes,
    photo,
  };
}

export async function getPets(): Promise<Pet[]> {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw new Error(userError.message);
  }

  if (!user) {
    return [];
  }

  requirePetOwner(user.user_metadata?.user_type);

  const { data, error } = await supabase
    .from("pets")
    .select("*")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as Pet[];
}

export async function getPetById(id: string): Promise<Pet | null> {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw new Error(userError.message);
  }

  if (!user) {
    return null;
  }

  requirePetOwner(user.user_metadata?.user_type);

  const { data, error } = await supabase
    .from("pets")
    .select("*")
    .eq("id", id)
    .eq("owner_id", user.id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return (data as Pet | null) ?? null;
}

export async function addPet(formData: FormData): Promise<{ id: string }> {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw new Error(userError.message);
  }

  if (!user) {
    throw new Error("You must be logged in to add a pet.");
  }

  requirePetOwner(user.user_metadata?.user_type);

  const validatedPayload = validatePetPayload(formData);

  let photoUrl: string | null = null;
  const photoEntry = validatedPayload.photo;

  if (photoEntry instanceof File && photoEntry.size > 0) {
    const filePath = buildPhotoPath(user.id, photoEntry.name || "pet-photo.jpg");
    const fileBuffer = Buffer.from(await photoEntry.arrayBuffer());

    const { error: uploadError } = await supabase.storage
      .from("pet-photos")
      .upload(filePath, fileBuffer, {
        contentType: photoEntry.type || "image/jpeg",
        upsert: false,
      });

    if (uploadError) {
      throw new Error(uploadError.message);
    }

    const { data: publicUrlData } = supabase.storage
      .from("pet-photos")
      .getPublicUrl(filePath);

    photoUrl = publicUrlData.publicUrl;
  }

  const payload = {
    owner_id: user.id,
    name: validatedPayload.name,
    species: validatedPayload.species,
    breed: validatedPayload.breed,
    breed_size: validatedPayload.breed_size,
    age_years: validatedPayload.age_years,
    weight_kg: validatedPayload.weight_kg,
    gender: validatedPayload.gender,
    blood_type: validatedPayload.blood_type,
    color: validatedPayload.color,
    microchip_id: validatedPayload.microchip_id,
    is_vaccinated: validatedPayload.is_vaccinated,
    is_vaccinated_rabies: validatedPayload.is_vaccinated_rabies,
    is_vaccinated_dhpp: validatedPayload.is_vaccinated_dhpp,
    last_dewormed: validatedPayload.last_dewormed,
    next_deworming: validatedPayload.next_deworming,
    neutered: validatedPayload.neutered,
    medical_notes: validatedPayload.medical_notes,
    photo_url: photoUrl,
  };

  const { data, error } = await supabase
    .from("pets")
    .insert(payload)
    .select("id")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard/pet-owner/pets");
  return { id: data.id };
}

export async function updatePet(formData: FormData): Promise<{ id: string }> {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw new Error(userError.message);
  }

  if (!user) {
    throw new Error("You must be logged in to update a pet.");
  }

  requirePetOwner(user.user_metadata?.user_type);

  const petId = asOptionalString(formData.get("id"));

  if (!petId) {
    throw new Error("Pet ID is required.");
  }

  const existingPet = await getPetById(petId);

  if (!existingPet) {
    throw new Error("Pet profile not found.");
  }

  const validatedPayload = validatePetPayload(formData);
  let photoUrl = existingPet.photo_url;
  const photoEntry = validatedPayload.photo;

  if (photoEntry instanceof File && photoEntry.size > 0) {
    const filePath = buildPhotoPath(user.id, photoEntry.name || "pet-photo.jpg");
    const fileBuffer = Buffer.from(await photoEntry.arrayBuffer());

    const { error: uploadError } = await supabase.storage
      .from("pet-photos")
      .upload(filePath, fileBuffer, {
        contentType: photoEntry.type || "image/jpeg",
        upsert: false,
      });

    if (uploadError) {
      throw new Error(uploadError.message);
    }

    const { data: publicUrlData } = supabase.storage
      .from("pet-photos")
      .getPublicUrl(filePath);

    photoUrl = publicUrlData.publicUrl;
  }

  const { data, error } = await supabase
    .from("pets")
    .update({
      name: validatedPayload.name,
      species: validatedPayload.species,
      breed: validatedPayload.breed,
      breed_size: validatedPayload.breed_size,
      age_years: validatedPayload.age_years,
      weight_kg: validatedPayload.weight_kg,
      gender: validatedPayload.gender,
      blood_type: validatedPayload.blood_type,
      color: validatedPayload.color,
      microchip_id: validatedPayload.microchip_id,
      is_vaccinated: validatedPayload.is_vaccinated,
      is_vaccinated_rabies: validatedPayload.is_vaccinated_rabies,
      is_vaccinated_dhpp: validatedPayload.is_vaccinated_dhpp,
      last_dewormed: validatedPayload.last_dewormed,
      next_deworming: validatedPayload.next_deworming,
      neutered: validatedPayload.neutered,
      medical_notes: validatedPayload.medical_notes,
      photo_url: photoUrl,
      updated_at: new Date().toISOString(),
    })
    .eq("id", petId)
    .eq("owner_id", user.id)
    .select("id")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard/pet-owner/pets");
  revalidatePath(`/dashboard/pet-owner/pets/${petId}`);

  return { id: data.id };
}

export async function deletePet(id: string): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw new Error(userError.message);
  }

  if (!user) {
    throw new Error("You must be logged in to delete a pet.");
  }

  requirePetOwner(user.user_metadata?.user_type);

  const { error } = await supabase
    .from("pets")
    .delete()
    .eq("id", id)
    .eq("owner_id", user.id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard/pet-owner/pets");
}

export async function createPetAction(
  _previousState: PetFormState,
  formData: FormData,
): Promise<PetFormState> {
  try {
    await addPet(formData);
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unable to save pet profile.",
    };
  }

  redirect("/dashboard/pet-owner/pets?status=created");
}

export async function updatePetAction(
  _previousState: PetFormState,
  formData: FormData,
): Promise<PetFormState> {
  try {
    const { id } = await updatePet(formData);
    redirect(`/dashboard/pet-owner/pets/${id}?status=updated`);
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unable to update pet profile.",
    };
  }
}

export async function deletePetAction(
  _previousState: PetDeleteState,
  formData: FormData,
): Promise<PetDeleteState> {
  const id = asOptionalString(formData.get("id"));

  if (!id) {
    return {
      error: "Pet ID is required.",
    };
  }

  try {
    await deletePet(id);
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unable to delete pet profile.",
    };
  }

  redirect("/dashboard/pet-owner/pets?status=deleted");
}
