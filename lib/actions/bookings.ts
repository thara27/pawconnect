"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import type {
  Booking,
  BookingStatus,
  BookingWithDetails,
  Notification,
  TimeSlot,
} from "@/lib/types/booking";

type ProviderProfileForBooking = {
  id: string;
  provider_id: string;
  business_name: string;
  service_type: string;
  price_from: number | null;
  avatar_url: string | null;
  city: string;
  phone: string;
};

type BookingCreateInput = {
  provider_id: string;
  pet_id: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  notes?: string;
};

function requirePetOwner(userType: unknown) {
  if (userType !== "pet_owner") {
    throw new Error("Only pet owners can perform this action.");
  }
}

function requireServiceProvider(userType: unknown) {
  if (userType !== "service_provider") {
    throw new Error("Only service providers can perform this action.");
  }
}

function getDayOfWeek(dateISO: string): number {
  const date = new Date(`${dateISO}T00:00:00`);
  return date.getDay();
}

function toMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map((part) => Number.parseInt(part, 10));
  return hours * 60 + minutes;
}

function toTimeString(minutes: number): string {
  const hh = String(Math.floor(minutes / 60)).padStart(2, "0");
  const mm = String(minutes % 60).padStart(2, "0");
  return `${hh}:${mm}`;
}

async function getProviderProfileById(profileId: string): Promise<ProviderProfileForBooking | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("provider_profiles")
    .select("id, provider_id, business_name, service_type, price_from, avatar_url, city, phone")
    .eq("id", profileId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return (data as ProviderProfileForBooking | null) ?? null;
}

async function createNotification(payload: {
  user_id: string;
  title: string;
  message: string;
  type: string;
  booking_id: string;
}) {
  const supabase = await createClient();

  const { error } = await supabase.from("notifications").insert({
    user_id: payload.user_id,
    title: payload.title,
    message: payload.message,
    type: payload.type,
    is_read: false,
    booking_id: payload.booking_id,
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function getAvailableSlots(providerId: string, date: string): Promise<TimeSlot[]> {
  const supabase = await createClient();

  const providerProfile = await getProviderProfileById(providerId);
  if (!providerProfile) {
    return [];
  }

  const dayOfWeek = getDayOfWeek(date);

  const { data: availabilityRows, error: availabilityError } = await supabase
    .from("provider_availability")
    .select("day_of_week, open_time, close_time")
    .eq("provider_id", providerProfile.provider_id)
    .eq("day_of_week", dayOfWeek)
    .order("open_time", { ascending: true });

  if (availabilityError) {
    throw new Error(availabilityError.message);
  }

  const { data: bookings, error: bookingError } = await supabase
    .from("bookings")
    .select("start_time, end_time, status")
    .eq("provider_id", providerId)
    .eq("booking_date", date)
    .in("status", ["pending", "confirmed"]);

  if (bookingError) {
    throw new Error(bookingError.message);
  }

  const bookedSlots = new Set(
    ((bookings as Array<{ start_time: string; end_time: string }> | null) ?? []).map(
      (booking) => `${booking.start_time}-${booking.end_time}`,
    ),
  );

  const slots: TimeSlot[] = [];

  for (const row of (availabilityRows as Array<{ open_time: string; close_time: string }> | null) ?? []) {
    const openMinutes = toMinutes(row.open_time);
    const closeMinutes = toMinutes(row.close_time);

    for (let start = openMinutes; start + 60 <= closeMinutes; start += 60) {
      const startTime = toTimeString(start);
      const endTime = toTimeString(start + 60);
      const key = `${startTime}-${endTime}`;

      slots.push({
        date,
        start_time: startTime,
        end_time: endTime,
        is_available: !bookedSlots.has(key),
      });
    }
  }

  return slots;
}

export async function createBooking(data: BookingCreateInput): Promise<{
  success: boolean;
  bookingId?: string;
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
    return { success: false, error: "You must be logged in to create a booking." };
  }

  try {
    requirePetOwner(user.user_metadata?.user_type);
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unauthorized.",
    };
  }

  if (!data.provider_id || !data.pet_id || !data.booking_date || !data.start_time || !data.end_time) {
    return { success: false, error: "Please complete all required booking fields." };
  }

  const providerProfile = await getProviderProfileById(data.provider_id);
  if (!providerProfile) {
    return { success: false, error: "Provider not found." };
  }

  const { data: pet, error: petError } = await supabase
    .from("pets")
    .select("id")
    .eq("id", data.pet_id)
    .eq("owner_id", user.id)
    .maybeSingle();

  if (petError) {
    return { success: false, error: petError.message };
  }

  if (!pet) {
    return { success: false, error: "Selected pet is not valid." };
  }

  const slots = await getAvailableSlots(data.provider_id, data.booking_date);
  const requestedSlot = slots.find(
    (slot) => slot.start_time === data.start_time && slot.end_time === data.end_time,
  );

  if (!requestedSlot || !requestedSlot.is_available) {
    return { success: false, error: "That slot is no longer available. Please pick another one." };
  }

  const totalPrice = providerProfile.price_from ?? 0;

  const { data: booking, error: bookingError } = await supabase
    .from("bookings")
    .insert({
      pet_owner_id: user.id,
      provider_id: data.provider_id,
      pet_id: data.pet_id,
      booking_date: data.booking_date,
      start_time: data.start_time,
      end_time: data.end_time,
      service_type: providerProfile.service_type,
      status: "pending",
      notes: data.notes?.trim() || null,
      total_price: totalPrice,
    })
    .select("id")
    .single();

  if (bookingError) {
    return { success: false, error: bookingError.message };
  }

  const ownerName =
    user.user_metadata?.full_name || user.user_metadata?.name || user.email || "A pet owner";

  await createNotification({
    user_id: providerProfile.provider_id,
    title: "New booking request",
    message: `${ownerName} wants to book ${providerProfile.service_type} on ${data.booking_date} at ${data.start_time}`,
    type: "booking_request",
    booking_id: booking.id,
  });

  revalidatePath("/dashboard/pet-owner/bookings");
  revalidatePath("/dashboard/service-provider/bookings");

  return { success: true, bookingId: booking.id, error: null };
}

type BookingRow = Booking & {
  provider_profile?: {
    business_name: string;
    service_type: string;
    avatar_url: string | null;
    city: string;
    phone: string;
  } | null;
  pet_profile?: {
    name: string;
    breed: string | null;
    species: string;
    photo_url: string | null;
  } | null;
};

export async function getMyBookings(): Promise<BookingWithDetails[]> {
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
    .from("bookings")
    .select(`
      *,
      provider_profile:provider_profiles!bookings_provider_id_fkey(
        business_name,
        service_type,
        avatar_url,
        city,
        phone
      ),
      pet_profile:pets!bookings_pet_id_fkey(
        name,
        breed,
        species,
        photo_url
      )
    `)
    .eq("pet_owner_id", user.id)
    .order("booking_date", { ascending: false })
    .order("start_time", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return ((data as BookingRow[] | null) ?? []).map((row) => ({
    ...row,
    provider: {
      business_name: row.provider_profile?.business_name ?? "Unknown provider",
      service_type: row.provider_profile?.service_type ?? row.service_type,
      avatar_url: row.provider_profile?.avatar_url ?? null,
      city: row.provider_profile?.city ?? "",
      phone: row.provider_profile?.phone ?? "",
    },
    pet: {
      name: row.pet_profile?.name ?? "Unknown pet",
      breed: row.pet_profile?.breed ?? null,
      species: row.pet_profile?.species ?? "dog",
      photo_url: row.pet_profile?.photo_url ?? null,
    },
    owner: {
      full_name: user.user_metadata?.full_name || user.user_metadata?.name || "You",
      email: user.email ?? "",
    },
  }));
}

export async function getProviderBookings(): Promise<BookingWithDetails[]> {
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

  requireServiceProvider(user.user_metadata?.user_type);

  const { data: profile, error: profileError } = await supabase
    .from("provider_profiles")
    .select("id, business_name, service_type, avatar_url, city, phone")
    .eq("provider_id", user.id)
    .maybeSingle();

  if (profileError) {
    throw new Error(profileError.message);
  }

  if (!profile) {
    return [];
  }

  const { data, error } = await supabase
    .from("bookings")
    .select(`
      *,
      pet_profile:pets!bookings_pet_id_fkey(
        name,
        breed,
        species,
        photo_url
      )
    `)
    .eq("provider_id", profile.id)
    .order("status", { ascending: true })
    .order("booking_date", { ascending: false })
    .order("start_time", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return ((data as BookingRow[] | null) ?? []).map((row) => ({
    ...row,
    provider: {
      business_name: profile.business_name,
      service_type: profile.service_type,
      avatar_url: profile.avatar_url,
      city: profile.city,
      phone: profile.phone,
    },
    pet: {
      name: row.pet_profile?.name ?? "Unknown pet",
      breed: row.pet_profile?.breed ?? null,
      species: row.pet_profile?.species ?? "dog",
      photo_url: row.pet_profile?.photo_url ?? null,
    },
    owner: {
      full_name: `Owner ${row.pet_owner_id.slice(0, 6)}`,
      email: "",
    },
  }));
}

export async function updateBookingStatus(
  bookingId: string,
  status: BookingStatus,
  reason?: string,
): Promise<{ success: boolean; error: string | null }> {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    return { success: false, error: userError.message };
  }

  if (!user) {
    return { success: false, error: "You must be logged in." };
  }

  try {
    requireServiceProvider(user.user_metadata?.user_type);
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unauthorized.",
    };
  }

  const { data: profile, error: profileError } = await supabase
    .from("provider_profiles")
    .select("id, business_name")
    .eq("provider_id", user.id)
    .maybeSingle();

  if (profileError) {
    return { success: false, error: profileError.message };
  }

  if (!profile) {
    return { success: false, error: "Provider profile not found." };
  }

  const { data: booking, error: bookingError } = await supabase
    .from("bookings")
    .select("id, provider_id, pet_owner_id, booking_date, start_time")
    .eq("id", bookingId)
    .eq("provider_id", profile.id)
    .maybeSingle();

  if (bookingError) {
    return { success: false, error: bookingError.message };
  }

  if (!booking) {
    return { success: false, error: "Booking not found." };
  }

  const { error: updateError } = await supabase
    .from("bookings")
    .update({
      status,
      cancellation_reason: status === "cancelled" ? reason?.trim() || null : null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", bookingId);

  if (updateError) {
    return { success: false, error: updateError.message };
  }

  if (status === "confirmed") {
    await createNotification({
      user_id: booking.pet_owner_id,
      title: "Booking confirmed!",
      message: `${profile.business_name} confirmed your booking for ${booking.booking_date} at ${booking.start_time}`,
      type: "booking_confirmed",
      booking_id: booking.id,
    });
  }

  if (status === "cancelled") {
    await createNotification({
      user_id: booking.pet_owner_id,
      title: "Booking cancelled",
      message: `${profile.business_name} cancelled your booking. Reason: ${reason?.trim() || "No reason provided"}`,
      type: "booking_cancelled",
      booking_id: booking.id,
    });
  }

  revalidatePath("/dashboard/pet-owner/bookings");
  revalidatePath("/dashboard/service-provider/bookings");

  return { success: true, error: null };
}

export async function cancelBooking(
  bookingId: string,
  reason?: string,
): Promise<{ success: boolean; error: string | null }> {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    return { success: false, error: userError.message };
  }

  if (!user) {
    return { success: false, error: "You must be logged in." };
  }

  try {
    requirePetOwner(user.user_metadata?.user_type);
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unauthorized.",
    };
  }

  const { data: booking, error: bookingError } = await supabase
    .from("bookings")
    .select("id, pet_owner_id, provider_id, status")
    .eq("id", bookingId)
    .eq("pet_owner_id", user.id)
    .maybeSingle();

  if (bookingError) {
    return { success: false, error: bookingError.message };
  }

  if (!booking) {
    return { success: false, error: "Booking not found." };
  }

  if (booking.status !== "pending" && booking.status !== "confirmed") {
    return { success: false, error: "Only pending or confirmed bookings can be cancelled." };
  }

  const { data: provider, error: providerError } = await supabase
    .from("provider_profiles")
    .select("provider_id, business_name")
    .eq("id", booking.provider_id)
    .maybeSingle();

  if (providerError) {
    return { success: false, error: providerError.message };
  }

  const { error: updateError } = await supabase
    .from("bookings")
    .update({
      status: "cancelled",
      cancellation_reason: reason?.trim() || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", bookingId);

  if (updateError) {
    return { success: false, error: updateError.message };
  }

  if (provider?.provider_id) {
    const ownerName =
      user.user_metadata?.full_name || user.user_metadata?.name || user.email || "A pet owner";

    await createNotification({
      user_id: provider.provider_id,
      title: "Booking cancelled",
      message: `${ownerName} cancelled a booking${reason?.trim() ? `. Reason: ${reason.trim()}` : "."}`,
      type: "booking_cancelled",
      booking_id: booking.id,
    });
  }

  revalidatePath("/dashboard/pet-owner/bookings");
  revalidatePath("/dashboard/service-provider/bookings");

  return { success: true, error: null };
}

export async function markNotificationRead(
  id: string,
): Promise<{ success: boolean; error: string | null }> {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    return { success: false, error: "Authentication error." };
  }

  if (!user) {
    return { success: false, error: "You must be logged in." };
  }

  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", id)
    .eq("user_id", user.id); // RLS + explicit ownership check

  if (error) {
    return { success: false, error: "Could not mark notification as read." };
  }

  return { success: true, error: null };
}

export async function getNotifications(): Promise<Notification[]> {
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

  const { data, error } = await supabase
    .from("notifications")
    .select("id, user_id, title, message, type, is_read, booking_id, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    throw new Error(error.message);
  }

  return (data as Notification[] | null) ?? [];
}

export async function markNotificationsRead(): Promise<{ success: boolean; error: string | null }> {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    return { success: false, error: userError.message };
  }

  if (!user) {
    return { success: false, error: "You must be logged in." };
  }

  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("user_id", user.id)
    .eq("is_read", false);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}
