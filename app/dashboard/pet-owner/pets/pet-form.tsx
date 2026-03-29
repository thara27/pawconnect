"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";

import {
  createPetAction,
  type PetFormState,
  updatePetAction,
} from "@/lib/actions/pets";
import {
  PET_BREED_SIZES,
  PET_FORM_LIMITS,
  PET_GENDERS,
  PET_PHOTO_MAX_SIZE_LABEL,
  PET_PHOTO_TYPES,
  PET_SPECIES,
  type Pet,
} from "@/lib/types/pet";

type ValidationErrors = Partial<Record<string, string>>;

type PetFormProps = {
  mode: "create" | "edit";
  pet?: Pet;
};

const initialState: PetFormState = {
  error: null,
};

function SubmitButton({ mode }: { mode: PetFormProps["mode"] }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full btn btn-primary sm:w-auto disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? (mode === "create" ? "Saving..." : "Updating...") : mode === "create" ? "Save pet profile" : "Update pet profile"}
    </button>
  );
}

export function PetForm({ mode, pet }: PetFormProps) {
  const action = mode === "create" ? createPetAction : updatePetAction;
  const [state, formAction] = useActionState(action, initialState);
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateForm = (formData: FormData) => {
    const nextErrors: ValidationErrors = {};
    const name = String(formData.get("name") ?? "").trim();
    const species = String(formData.get("species") ?? "").trim();
    const breed = String(formData.get("breed") ?? "").trim();
    const breedSize = String(formData.get("breed_size") ?? "").trim();
    const ageYears = String(formData.get("age_years") ?? "").trim();
    const weightKg = String(formData.get("weight_kg") ?? "").trim();
    const gender = String(formData.get("gender") ?? "").trim();
    const bloodType = String(formData.get("blood_type") ?? "").trim();
    const color = String(formData.get("color") ?? "").trim();
    const microchipId = String(formData.get("microchip_id") ?? "").trim();
    const medicalNotes = String(formData.get("medical_notes") ?? "").trim();
    const lastDewormed = String(formData.get("last_dewormed") ?? "").trim();
    const nextDeworming = String(formData.get("next_deworming") ?? "").trim();
    const photo = formData.get("photo");

    if (!name) {
      nextErrors.name = "Name is required.";
    } else if (name.length > PET_FORM_LIMITS.nameMaxLength) {
      nextErrors.name = `Name must be ${PET_FORM_LIMITS.nameMaxLength} characters or fewer.`;
    }

    if (!PET_SPECIES.includes(species as (typeof PET_SPECIES)[number])) {
      nextErrors.species = "Select a valid species.";
    }

    if (breed.length > PET_FORM_LIMITS.breedMaxLength) {
      nextErrors.breed = `Breed must be ${PET_FORM_LIMITS.breedMaxLength} characters or fewer.`;
    }

    if (
      breedSize &&
      !PET_BREED_SIZES.includes(breedSize as (typeof PET_BREED_SIZES)[number])
    ) {
      nextErrors.breed_size = "Select a valid breed size.";
    }

    if (ageYears) {
      const parsedAge = Number.parseFloat(ageYears);
      if (!Number.isFinite(parsedAge)) {
        nextErrors.age_years = "Enter a valid age.";
      } else if (parsedAge < 0 || parsedAge > PET_FORM_LIMITS.maxAgeYears) {
        nextErrors.age_years = `Age must be between 0 and ${PET_FORM_LIMITS.maxAgeYears}.`;
      }
    }

    if (weightKg) {
      const parsedWeight = Number.parseFloat(weightKg);
      if (!Number.isFinite(parsedWeight)) {
        nextErrors.weight_kg = "Enter a valid weight.";
      } else if (parsedWeight < 0 || parsedWeight > PET_FORM_LIMITS.maxWeightKg) {
        nextErrors.weight_kg = `Weight must be between 0 and ${PET_FORM_LIMITS.maxWeightKg} kg.`;
      }
    }

    if (!PET_GENDERS.includes(gender as (typeof PET_GENDERS)[number])) {
      nextErrors.gender = "Select a valid gender.";
    }

    if (bloodType.length > PET_FORM_LIMITS.bloodTypeMaxLength) {
      nextErrors.blood_type = `Blood type must be ${PET_FORM_LIMITS.bloodTypeMaxLength} characters or fewer.`;
    }

    if (color.length > PET_FORM_LIMITS.colorMaxLength) {
      nextErrors.color = `Color must be ${PET_FORM_LIMITS.colorMaxLength} characters or fewer.`;
    }

    if (microchipId.length > PET_FORM_LIMITS.microchipIdMaxLength) {
      nextErrors.microchip_id = `Microchip ID must be ${PET_FORM_LIMITS.microchipIdMaxLength} characters or fewer.`;
    } else if (microchipId && !/^[A-Za-z0-9-]+$/.test(microchipId)) {
      nextErrors.microchip_id = "Use only letters, numbers, and hyphens in Microchip ID.";
    }

    if (medicalNotes.length > PET_FORM_LIMITS.medicalNotesMaxLength) {
      nextErrors.medical_notes = `Medical notes must be ${PET_FORM_LIMITS.medicalNotesMaxLength} characters or fewer.`;
    }

    if (
      lastDewormed &&
      nextDeworming &&
      new Date(nextDeworming).getTime() < new Date(lastDewormed).getTime()
    ) {
      nextErrors.next_deworming = "Next deworming must be on or after the last deworming date.";
    }

    if (photo instanceof File && photo.size > 0) {
      if (photo.size > PET_FORM_LIMITS.maxPhotoSizeBytes) {
        nextErrors.photo = `Photo must be ${PET_PHOTO_MAX_SIZE_LABEL} or smaller.`;
      } else if (
        photo.type &&
        !PET_PHOTO_TYPES.includes(photo.type as (typeof PET_PHOTO_TYPES)[number])
      ) {
        nextErrors.photo = "Photo must be a JPG, PNG, or WebP image.";
      }
    }

    return nextErrors;
  };

  return (
    <form
      action={formAction}
      className="mt-8 space-y-5"
      onSubmit={(event) => {
        const formData = new FormData(event.currentTarget);
        const nextErrors = validateForm(formData);
        setErrors(nextErrors);

        if (Object.keys(nextErrors).length > 0) {
          event.preventDefault();
        }
      }}
    >
      {mode === "edit" && pet ? <input type="hidden" name="id" value={pet.id} /> : null}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="name" className="form-label mb-1.5">
            Name *
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            maxLength={PET_FORM_LIMITS.nameMaxLength}
            defaultValue={pet?.name ?? ""}
            className="w-full rounded-lg border border-border px-3 py-2.5 text-ink outline-none ring-brand-light transition focus:ring"
          />
          {errors.name ? <p className="mt-1 text-sm text-red-700">{errors.name}</p> : null}
        </div>

        <div>
          <label htmlFor="species" className="form-label mb-1.5">
            Species *
          </label>
          <select
            id="species"
            name="species"
            required
            defaultValue={pet?.species ?? "dog"}
            className="w-full rounded-lg border border-border px-3 py-2.5 text-ink outline-none ring-brand-light transition focus:ring"
          >
            {PET_SPECIES.map((speciesOption) => (
              <option key={speciesOption} value={speciesOption}>
                {speciesOption.charAt(0).toUpperCase() + speciesOption.slice(1)}
              </option>
            ))}
          </select>
          {errors.species ? <p className="mt-1 text-sm text-red-700">{errors.species}</p> : null}
        </div>

        <div>
          <label htmlFor="breed" className="form-label mb-1.5">
            Breed
          </label>
          <input
            id="breed"
            name="breed"
            type="text"
            maxLength={PET_FORM_LIMITS.breedMaxLength}
            defaultValue={pet?.breed ?? ""}
            className="w-full rounded-lg border border-border px-3 py-2.5 text-ink outline-none ring-brand-light transition focus:ring"
          />
          {errors.breed ? <p className="mt-1 text-sm text-red-700">{errors.breed}</p> : null}
        </div>

        <div>
          <label
            htmlFor="breed_size"
            className="form-label mb-1.5"
          >
            Breed size
          </label>
          <select
            id="breed_size"
            name="breed_size"
            defaultValue={pet?.breed_size ?? ""}
            className="w-full rounded-lg border border-border px-3 py-2.5 text-ink outline-none ring-brand-light transition focus:ring"
          >
            <option value="">Select size</option>
            {PET_BREED_SIZES.map((breedSizeOption) => (
              <option key={breedSizeOption} value={breedSizeOption}>
                {breedSizeOption.charAt(0).toUpperCase() + breedSizeOption.slice(1)}
              </option>
            ))}
          </select>
          {errors.breed_size ? (
            <p className="mt-1 text-sm text-red-700">{errors.breed_size}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="age_years" className="form-label mb-1.5">
            Age (years)
          </label>
          <input
            id="age_years"
            name="age_years"
            type="number"
            min={0}
            max={PET_FORM_LIMITS.maxAgeYears}
            step="0.1"
            defaultValue={pet?.age_years ?? ""}
            className="w-full rounded-lg border border-border px-3 py-2.5 text-ink outline-none ring-brand-light transition focus:ring"
          />
          {errors.age_years ? <p className="mt-1 text-sm text-red-700">{errors.age_years}</p> : null}
        </div>

        <div>
          <label htmlFor="weight_kg" className="form-label mb-1.5">
            Weight (kg)
          </label>
          <input
            id="weight_kg"
            name="weight_kg"
            type="number"
            min={0}
            max={PET_FORM_LIMITS.maxWeightKg}
            step="0.1"
            defaultValue={pet?.weight_kg ?? ""}
            className="w-full rounded-lg border border-border px-3 py-2.5 text-ink outline-none ring-brand-light transition focus:ring"
          />
          {errors.weight_kg ? <p className="mt-1 text-sm text-red-700">{errors.weight_kg}</p> : null}
        </div>

        <div>
          <label htmlFor="gender" className="form-label mb-1.5">
            Gender
          </label>
          <select
            id="gender"
            name="gender"
            defaultValue={pet?.gender ?? "unknown"}
            className="w-full rounded-lg border border-border px-3 py-2.5 text-ink outline-none ring-brand-light transition focus:ring"
          >
            {PET_GENDERS.map((genderOption) => (
              <option key={genderOption} value={genderOption}>
                {genderOption.charAt(0).toUpperCase() + genderOption.slice(1)}
              </option>
            ))}
          </select>
          {errors.gender ? <p className="mt-1 text-sm text-red-700">{errors.gender}</p> : null}
        </div>

        <div>
          <label htmlFor="blood_type" className="form-label mb-1.5">
            Blood type
          </label>
          <input
            id="blood_type"
            name="blood_type"
            type="text"
            maxLength={PET_FORM_LIMITS.bloodTypeMaxLength}
            defaultValue={pet?.blood_type ?? ""}
            className="w-full rounded-lg border border-border px-3 py-2.5 text-ink outline-none ring-brand-light transition focus:ring"
          />
          {errors.blood_type ? <p className="mt-1 text-sm text-red-700">{errors.blood_type}</p> : null}
        </div>

        <div>
          <label htmlFor="color" className="form-label mb-1.5">
            Color
          </label>
          <input
            id="color"
            name="color"
            type="text"
            maxLength={PET_FORM_LIMITS.colorMaxLength}
            defaultValue={pet?.color ?? ""}
            className="w-full rounded-lg border border-border px-3 py-2.5 text-ink outline-none ring-brand-light transition focus:ring"
          />
          {errors.color ? <p className="mt-1 text-sm text-red-700">{errors.color}</p> : null}
        </div>

        <div>
          <label htmlFor="microchip_id" className="form-label mb-1.5">
            Microchip ID
          </label>
          <input
            id="microchip_id"
            name="microchip_id"
            type="text"
            maxLength={PET_FORM_LIMITS.microchipIdMaxLength}
            pattern="[A-Za-z0-9-]+"
            defaultValue={pet?.microchip_id ?? ""}
            className="w-full rounded-lg border border-border px-3 py-2.5 text-ink outline-none ring-brand-light transition focus:ring"
          />
          {errors.microchip_id ? <p className="mt-1 text-sm text-red-700">{errors.microchip_id}</p> : null}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="medical_notes" className="form-label mb-1.5">
            Medical notes
          </label>
          <textarea
            id="medical_notes"
            name="medical_notes"
            rows={4}
            maxLength={PET_FORM_LIMITS.medicalNotesMaxLength}
            defaultValue={pet?.medical_notes ?? ""}
            className="w-full rounded-lg border border-border px-3 py-2.5 text-ink outline-none ring-brand-light transition focus:ring"
          />
          {errors.medical_notes ? <p className="mt-1 text-sm text-red-700">{errors.medical_notes}</p> : null}
        </div>

        <div className="sm:col-span-2 card-flat p-4">
          <h2 className="text-base font-semibold text-ink">Health &amp; Medical</h2>
          <p className="mt-1 text-sm text-muted">
            Track vaccination status and deworming dates for this pet.
          </p>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="last_dewormed"
                className="form-label mb-1.5"
              >
                Last dewormed
              </label>
              <input
                id="last_dewormed"
                name="last_dewormed"
                type="date"
                defaultValue={pet?.last_dewormed ? pet.last_dewormed.slice(0, 10) : ""}
                className="w-full rounded-lg border border-border px-3 py-2.5 text-ink outline-none ring-brand-light transition focus:ring"
              />
            </div>

            <div>
              <label
                htmlFor="next_deworming"
                className="form-label mb-1.5"
              >
                Next deworming
              </label>
              <input
                id="next_deworming"
                name="next_deworming"
                type="date"
                defaultValue={pet?.next_deworming ? pet.next_deworming.slice(0, 10) : ""}
                className="w-full rounded-lg border border-border px-3 py-2.5 text-ink outline-none ring-brand-light transition focus:ring"
              />
              {errors.next_deworming ? (
                <p className="mt-1 text-sm text-red-700">{errors.next_deworming}</p>
              ) : null}
            </div>

            <label className="flex items-center gap-2 text-sm text-ink">
              <input
                type="checkbox"
                name="is_vaccinated_rabies"
                defaultChecked={pet?.is_vaccinated_rabies ?? false}
                className="rounded border-border" style={{ width: 'auto', minHeight: 'auto' }}
              />
              Rabies vaccinated
            </label>

            <label className="flex items-center gap-2 text-sm text-ink">
              <input
                type="checkbox"
                name="is_vaccinated_dhpp"
                defaultChecked={pet?.is_vaccinated_dhpp ?? false}
                className="rounded border-border" style={{ width: 'auto', minHeight: 'auto' }}
              />
              DHPP vaccinated
            </label>

            <label className="sm:col-span-2 flex items-center gap-2 text-sm text-ink">
              <input
                type="checkbox"
                name="neutered"
                defaultChecked={pet?.neutered ?? false}
                className="rounded border-border" style={{ width: 'auto', minHeight: 'auto' }}
              />
              Neutered
            </label>
          </div>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="photo" className="form-label mb-1.5">
            {mode === "create" ? "Photo" : "Replace photo"}
          </label>
          <input
            id="photo"
            name="photo"
            type="file"
            accept={PET_PHOTO_TYPES.join(",")}
            onChange={(event) => {
              const file = event.currentTarget.files?.[0];

              setErrors((currentErrors) => {
                const nextErrors = { ...currentErrors };

                if (!file) {
                  delete nextErrors.photo;
                  return nextErrors;
                }

                if (file.size > PET_FORM_LIMITS.maxPhotoSizeBytes) {
                  nextErrors.photo = `Photo must be ${PET_PHOTO_MAX_SIZE_LABEL} or smaller.`;
                  return nextErrors;
                }

                if (
                  file.type &&
                  !PET_PHOTO_TYPES.includes(file.type as (typeof PET_PHOTO_TYPES)[number])
                ) {
                  nextErrors.photo = "Photo must be a JPG, PNG, or WebP image.";
                  return nextErrors;
                }

                delete nextErrors.photo;
                return nextErrors;
              });
            }}
            className="w-full rounded-lg border border-border px-3 py-2 text-sm text-ink file:mr-3 file:rounded-md file:border-0 file:bg-bg file:px-3 file:py-2 file:text-sm file:font-medium"
          />
          <p className="mt-1 text-xs text-muted">
            JPG, PNG, or WebP up to {PET_PHOTO_MAX_SIZE_LABEL}.
          </p>
          {pet?.photo_url ? (
            <p className="mt-1 text-xs text-muted">Leave blank to keep the current photo.</p>
          ) : null}
          {errors.photo ? <p className="mt-1 text-sm text-red-700">{errors.photo}</p> : null}
        </div>

        <label className="sm:col-span-2 flex items-center gap-2 text-sm text-ink">
          <input
            type="checkbox"
            name="is_vaccinated"
            defaultChecked={pet?.is_vaccinated ?? false}
            className="rounded border-border" style={{ width: 'auto', minHeight: 'auto' }}
          />
          Is vaccinated
        </label>
      </div>

      {mode === "edit" && pet?.photo_url ? (
        <div className="rounded-lg border border-border bg-bg p-3 text-sm text-muted">
          Current photo is already saved for this pet.
        </div>
      ) : null}

      {state.error ? (
        <p className="alert alert-error">
          {state.error}
        </p>
      ) : null}

      <SubmitButton mode={mode} />
    </form>
  );
}

