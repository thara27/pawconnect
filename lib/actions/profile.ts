"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

// ── Types ─────────────────────────────────────────────────────────────────────

export type PetOwnerProfile = {
  id: string;
  user_id: string;
  display_name: string | null;
  phone: string | null;
  city: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

export type ProfileFormState = {
  error: string | null;
  success: boolean;
};

// ── Constants ─────────────────────────────────────────────────────────────────

const AVATAR_ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
const AVATAR_MAX_BYTES = 2 * 1024 * 1024; // 2 MB
const AVATAR_BUCKET = "pet-owner-avatars";

// ── Helpers ───────────────────────────────────────────────────────────────────

function asOptionalString(value: FormDataEntryValue | null): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function buildAvatarPath(userId: string, originalName: string): string {
  const ext = originalName.includes(".")
    ? (originalName.split(".").pop()?.toLowerCase() ?? "jpg")
    : "jpg";
  return `${userId}/${crypto.randomUUID()}.${ext}`;
}

// ── Read ──────────────────────────────────────────────────────────────────────

export async function getPetOwnerProfile(): Promise<{
  user: { id: string; email: string | undefined; user_metadata: Record<string, unknown> };
  profile: PetOwnerProfile | null;
} | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("pet_owner_profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  return {
    user: {
      id: user.id,
      email: user.email,
      user_metadata: (user.user_metadata ?? {}) as Record<string, unknown>,
    },
    profile: profile as PetOwnerProfile | null,
  };
}

// ── Write ─────────────────────────────────────────────────────────────────────

export async function updatePetOwnerProfile(
  _prevState: ProfileFormState,
  formData: FormData,
): Promise<ProfileFormState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const displayName = asOptionalString(formData.get("display_name"));
  const phone = asOptionalString(formData.get("phone"));
  const city = asOptionalString(formData.get("city"));

  // ── Avatar upload ────────────────────────────────────────────
  let avatarUrl: string | undefined;
  const avatarFile = formData.get("avatar");

  if (avatarFile instanceof File && avatarFile.size > 0) {
    if (!AVATAR_ALLOWED_TYPES.includes(avatarFile.type as (typeof AVATAR_ALLOWED_TYPES)[number])) {
      return { error: "Avatar must be a JPEG, PNG, or WebP image.", success: false };
    }

    if (avatarFile.size > AVATAR_MAX_BYTES) {
      return { error: "Avatar must be 2 MB or smaller.", success: false };
    }

    const path = buildAvatarPath(user.id, avatarFile.name);

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(AVATAR_BUCKET)
      .upload(path, avatarFile, { upsert: false });

    if (uploadError) {
      return { error: "Failed to upload avatar. Please try again.", success: false };
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(uploadData.path);

    avatarUrl = publicUrl;
  }

  // ── Upsert profile ───────────────────────────────────────────
  const payload: Record<string, unknown> = {
    user_id: user.id,
    display_name: displayName,
    phone,
    city,
    updated_at: new Date().toISOString(),
  };

  if (avatarUrl !== undefined) {
    payload.avatar_url = avatarUrl;
  }

  const { error } = await supabase
    .from("pet_owner_profiles")
    .upsert(payload, { onConflict: "user_id" });

  if (error) {
    // Do not expose raw DB error messages to the client (information disclosure)
    console.error("pet_owner_profiles upsert error:", error.message);
    return { error: "Could not save your profile. Please try again.", success: false };
  }

  revalidatePath("/dashboard/pet-owner/profile");
  return { error: null, success: true };
}
