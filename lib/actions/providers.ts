"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import {
  DAYS_OF_WEEK,
  PRICE_UNITS,
  SERVICE_TYPES,
  type ProviderAvailability,
  type ProviderProfile,
  type ProviderReview,
  type ProviderSearchResult,
  type SearchFilters,
} from "@/lib/types/provider";

type ProviderFieldName =
  | "business_name"
  | "service_type"
  | "description"
  | "address"
  | "city"
  | "state"
  | "pincode"
  | "phone"
  | "website"
  | "price_from"
  | "price_to"
  | "price_unit"
  | "years_experience"
  | "license_number"
  | "avatar"
  | "availability";

export type ProviderProfileFormState = {
  error: string | null;
  fieldErrors: Partial<Record<ProviderFieldName, string>>;
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

function requireServiceProvider(userType: unknown) {
  if (userType !== "service_provider") {
    throw new Error("Only service providers can manage provider profiles.");
  }
}

function buildAvatarPath(providerId: string, originalName: string) {
  const extension = originalName.includes(".")
    ? originalName.split(".").pop()?.toLowerCase() ?? "jpg"
    : "jpg";

  return `${providerId}/${crypto.randomUUID()}.${extension}`;
}

function getServiceTypeValues(): string[] {
  return SERVICE_TYPES.map((serviceType) => serviceType.value);
}

function getPriceUnitValues(): string[] {
  return PRICE_UNITS.map((priceUnit) => priceUnit.value);
}

function parseAvailability(formData: FormData): ProviderAvailability[] {
  return DAYS_OF_WEEK.flatMap((_, dayIndex) => {
    const enabled = formData.get(`availability_enabled_${dayIndex}`) === "on";

    if (!enabled) {
      return [];
    }

    const openTime = asOptionalString(formData.get(`availability_open_${dayIndex}`));
    const closeTime = asOptionalString(formData.get(`availability_close_${dayIndex}`));

    if (!openTime || !closeTime) {
      return [];
    }

    return [
      {
        id: `${dayIndex}`,
        provider_id: "",
        day_of_week: dayIndex,
        open_time: openTime,
        close_time: closeTime,
      },
    ];
  });
}

function validateProviderForm(formData: FormData) {
  const fieldErrors: ProviderProfileFormState["fieldErrors"] = {};
  const businessName = asOptionalString(formData.get("business_name"));
  const serviceType = asOptionalString(formData.get("service_type"));
  const description = asOptionalString(formData.get("description"));
  const address = asOptionalString(formData.get("address"));
  const city = asOptionalString(formData.get("city"));
  const state = asOptionalString(formData.get("state"));
  const pincode = asOptionalString(formData.get("pincode"));
  const phone = asOptionalString(formData.get("phone"));
  const website = asOptionalString(formData.get("website"));
  const priceFrom = asOptionalNumber(formData.get("price_from"));
  const priceTo = asOptionalNumber(formData.get("price_to"));
  const priceUnit = asOptionalString(formData.get("price_unit"));
  const yearsExperience = asOptionalNumber(formData.get("years_experience"));
  const licenseNumber = asOptionalString(formData.get("license_number"));
  const isAvailable = formData.get("is_available") === "on";
  const avatar = formData.get("avatar");
  const availability = parseAvailability(formData);

  if (!businessName) {
    fieldErrors.business_name = "Business name is required.";
  }

  if (!serviceType || !getServiceTypeValues().includes(serviceType)) {
    fieldErrors.service_type = "Select a valid service type.";
  }

  if (description && description.length > 300) {
    fieldErrors.description = "Description must be 300 characters or fewer.";
  }

  if (!address) {
    fieldErrors.address = "Address is required.";
  }

  if (!city) {
    fieldErrors.city = "City is required.";
  }

  if (!state) {
    fieldErrors.state = "State is required.";
  }

  if (!pincode) {
    fieldErrors.pincode = "Pincode is required.";
  } else if (!/^\d{6}$/.test(pincode)) {
    fieldErrors.pincode = "Enter a valid 6-digit Indian pincode.";
  }

  if (!phone) {
    fieldErrors.phone = "Phone number is required.";
  } else if (!/^(\+91|91)?[6-9]\d{9}$/.test(phone.replace(/[\s-]/g, ""))) {
    fieldErrors.phone = "Enter a valid Indian phone number.";
  }

  if (website) {
    try {
      new URL(website);
    } catch {
      fieldErrors.website = "Enter a valid website URL.";
    }
  }

  if (priceFrom !== null && priceFrom < 0) {
    fieldErrors.price_from = "Price must be zero or more.";
  }

  if (priceTo !== null && priceTo < 0) {
    fieldErrors.price_to = "Price must be zero or more.";
  }

  if (priceFrom !== null && priceTo !== null && priceTo < priceFrom) {
    fieldErrors.price_to = "Price to must be greater than or equal to price from.";
  }

  if (!priceUnit || !getPriceUnitValues().includes(priceUnit)) {
    fieldErrors.price_unit = "Select a valid price unit.";
  }

  if (yearsExperience !== null && yearsExperience < 0) {
    fieldErrors.years_experience = "Years of experience must be zero or more.";
  }

  if (avatar instanceof File && avatar.size > 0) {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (avatar.size > 1024 * 1024) {
      fieldErrors.avatar = "Avatar must be 1 MB or smaller.";
    } else if (avatar.type && !allowedTypes.includes(avatar.type)) {
      fieldErrors.avatar = "Avatar must be a JPG, PNG, or WebP image.";
    }
  }

  for (const slot of availability) {
    if (slot.close_time <= slot.open_time) {
      fieldErrors.availability = "Each availability slot must have a closing time after its opening time.";
      break;
    }
  }

  return {
    fieldErrors,
    values: {
      business_name: businessName,
      service_type: serviceType,
      description,
      address,
      city,
      state,
      pincode,
      phone,
      website,
      price_from: priceFrom,
      price_to: priceTo,
      price_unit: priceUnit,
      years_experience: yearsExperience,
      license_number: licenseNumber,
      is_available: isAvailable,
      avatar,
      availability,
    },
  };
}

export async function getMyProfile(): Promise<{
  profile: ProviderProfile | null;
  availability: ProviderAvailability[];
}> {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw new Error(userError.message);
  }

  if (!user) {
    return { profile: null, availability: [] };
  }

  requireServiceProvider(user.user_metadata?.user_type);

  const { data: profile, error: profileError } = await supabase
    .from("provider_profiles")
    .select("*")
    .eq("provider_id", user.id)
    .maybeSingle();

  if (profileError) {
    throw new Error(profileError.message);
  }

  const { data: availability, error: availabilityError } = await supabase
    .from("provider_availability")
    .select("*")
    .eq("provider_id", user.id)
    .order("day_of_week", { ascending: true })
    .order("open_time", { ascending: true });

  if (availabilityError) {
    throw new Error(availabilityError.message);
  }

  return {
    profile: (profile as ProviderProfile | null) ?? null,
    availability: (availability as ProviderAvailability[] | null) ?? [],
  };
}

export async function upsertProfile(formData: FormData): Promise<{
  success: boolean;
  error: string | null;
}> {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    return { success: false, error: userError.message };
  }

  if (!user) {
    return { success: false, error: "You must be logged in to update your profile." };
  }

  try {
    requireServiceProvider(user.user_metadata?.user_type);
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unauthorized.",
    };
  }

  const { fieldErrors, values } = validateProviderForm(formData);

  if (Object.keys(fieldErrors).length > 0) {
    return { success: false, error: "Please fix the highlighted fields." };
  }

  let avatarUrl: string | null = null;
  const avatarEntry = values.avatar;

  if (avatarEntry instanceof File && avatarEntry.size > 0) {
    const filePath = buildAvatarPath(user.id, avatarEntry.name || "provider-avatar.jpg");
    const fileBuffer = Buffer.from(await avatarEntry.arrayBuffer());

    const { error: uploadError } = await supabase.storage
      .from("provider-avatars")
      .upload(filePath, fileBuffer, {
        contentType: avatarEntry.type || "image/jpeg",
        upsert: false,
      });

    if (uploadError) {
      return { success: false, error: uploadError.message };
    }

    const { data: publicUrlData } = supabase.storage
      .from("provider-avatars")
      .getPublicUrl(filePath);

    avatarUrl = publicUrlData.publicUrl;
  } else {
    const { profile } = await getMyProfile();
    avatarUrl = profile?.avatar_url ?? null;
  }

  const { error } = await supabase.from("provider_profiles").upsert(
    {
      provider_id: user.id,
      business_name: values.business_name,
      service_type: values.service_type,
      description: values.description,
      address: values.address,
      city: values.city,
      state: values.state,
      pincode: values.pincode,
      phone: values.phone,
      website: values.website,
      price_from: values.price_from,
      price_to: values.price_to,
      price_unit: values.price_unit,
      is_available: values.is_available,
      avatar_url: avatarUrl,
      years_experience: values.years_experience,
      license_number: values.license_number,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "provider_id" },
  );

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}

export async function upsertAvailability(
  providerId: string,
  slots: ProviderAvailability[],
): Promise<{ success: boolean; error: string | null }> {
  const supabase = await createClient();

  const { error: deleteError } = await supabase
    .from("provider_availability")
    .delete()
    .eq("provider_id", providerId);

  if (deleteError) {
    return { success: false, error: deleteError.message };
  }

  if (slots.length === 0) {
    return { success: true, error: null };
  }

  const { error: insertError } = await supabase.from("provider_availability").insert(
    slots.map((slot) => ({
      provider_id: providerId,
      day_of_week: slot.day_of_week,
      open_time: slot.open_time,
      close_time: slot.close_time,
    })),
  );

  if (insertError) {
    return { success: false, error: insertError.message };
  }

  return { success: true, error: null };
}

export async function saveProviderProfileAction(
  _previousState: ProviderProfileFormState,
  formData: FormData,
): Promise<ProviderProfileFormState> {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    return { error: userError.message, fieldErrors: {} };
  }

  if (!user) {
    return {
      error: "You must be logged in to update your profile.",
      fieldErrors: {},
    };
  }

  try {
    requireServiceProvider(user.user_metadata?.user_type);
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unauthorized.",
      fieldErrors: {},
    };
  }

  const { fieldErrors, values } = validateProviderForm(formData);

  if (Object.keys(fieldErrors).length > 0) {
    return {
      error: "Please fix the highlighted fields.",
      fieldErrors,
    };
  }

  const profileResult = await upsertProfile(formData);

  if (!profileResult.success) {
    return {
      error: profileResult.error ?? "Unable to save your profile.",
      fieldErrors: {},
    };
  }

  const availabilityResult = await upsertAvailability(user.id, values.availability);

  if (!availabilityResult.success) {
    return {
      error: availabilityResult.error ?? "Unable to save availability.",
      fieldErrors: {},
    };
  }

  redirect("/dashboard/service-provider/profile");
}

// ---------------------------------------------------------------------------
// Pet-owner discovery: search providers
// ---------------------------------------------------------------------------

type ProviderViewRow = ProviderProfile & {
  avg_rating: string | number;
  review_count: number;
};

export async function searchProviders(
  filters: SearchFilters,
): Promise<ProviderSearchResult[]> {
  const supabase = await createClient();

  let query = supabase.from("provider_search_view").select("*");

  if (filters.service_type) {
    query = query.eq("service_type", filters.service_type);
  }

  if (filters.city) {
    query = query.ilike("city", `%${filters.city}%`);
  }

  if (filters.is_available !== null && filters.is_available !== undefined) {
    query = query.eq("is_available", filters.is_available);
  }

  if (filters.min_rating !== null && filters.min_rating !== undefined) {
    query = query.gte("avg_rating", filters.min_rating);
  }

  const { data: profilesData, error } = await query;
  const profiles = (profilesData as ProviderViewRow[] | null) ?? null;

  if (error) {
    throw new Error(error.message);
  }

  if (!profiles || profiles.length === 0) {
    return [];
  }

  const providerIds = profiles.map((p) => p.provider_id);

  const { data: availability, error: availabilityError } = await supabase
    .from("provider_availability")
    .select("*")
    .in("provider_id", providerIds)
    .order("day_of_week", { ascending: true });

  if (availabilityError) {
    throw new Error(availabilityError.message);
  }

  const availabilityByProvider = (availability as ProviderAvailability[] | null ?? []).reduce<
    Record<string, ProviderAvailability[]>
  >((acc, slot) => {
    if (!acc[slot.provider_id]) acc[slot.provider_id] = [];
    acc[slot.provider_id].push(slot);
    return acc;
  }, {});

  return profiles.map((p) => ({
    ...p,
    avg_rating: Number(p.avg_rating ?? 0),
    review_count: Number(p.review_count ?? 0),
    availability: availabilityByProvider[p.provider_id] ?? [],
  })) as ProviderSearchResult[];
}

// ---------------------------------------------------------------------------
// Pet-owner discovery: get single provider with reviews
// ---------------------------------------------------------------------------

export async function getProviderById(id: string): Promise<{
  provider: ProviderSearchResult;
  reviews: ProviderReview[];
} | null> {
  const supabase = await createClient();

  const { data: profileDataRaw, error: profileError } = await supabase
    .from("provider_search_view")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  const profileData = (profileDataRaw as ProviderViewRow | null) ?? null;

  if (profileError) {
    throw new Error(profileError.message);
  }

  if (!profileData) {
    return null;
  }

  const [availabilityResult, reviewsResult] = await Promise.all([
    supabase
      .from("provider_availability")
      .select("*")
      .eq("provider_id", profileData.provider_id)
      .order("day_of_week", { ascending: true }),
    supabase
      .from("provider_reviews")
      .select("*")
      .eq("provider_id", id)
      .order("created_at", { ascending: false })
      .limit(50),
  ]);

  if (availabilityResult.error) {
    throw new Error(availabilityResult.error.message);
  }

  if (reviewsResult.error) {
    throw new Error(reviewsResult.error.message);
  }

  const rawReviews = (reviewsResult.data as Omit<ProviderReview, "reviewer_display_name">[] | null) ?? [];

  // Fetch reviewer display names in a single follow-up query
  let reviewerNames: Map<string, string | null> = new Map();
  if (rawReviews.length > 0) {
    const reviewerIds = rawReviews.map((r) => r.reviewer_id);
    const { data: profiles } = await supabase
      .from("pet_owner_profiles")
      .select("user_id, display_name")
      .in("user_id", reviewerIds);
    if (profiles) {
      for (const p of profiles) {
        reviewerNames.set(p.user_id as string, (p.display_name as string | null) ?? null);
      }
    }
  }

  const reviews: ProviderReview[] = rawReviews.map((r) => ({
    ...r,
    rating: r.rating as ProviderReview["rating"],
    reviewer_display_name: reviewerNames.get(r.reviewer_id) ?? null,
  }));

  const provider: ProviderSearchResult = {
    ...profileData,
    avg_rating: Number(profileData.avg_rating ?? 0),
    review_count: Number(profileData.review_count ?? 0),
    availability: (availabilityResult.data as ProviderAvailability[] | null) ?? [],
  } as ProviderSearchResult;

  return {
    provider,
    reviews,
  };
}
