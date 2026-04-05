export const SERVICE_TYPES = [
  { value: "vet", label: "Veterinarian" },
  { value: "groomer", label: "Groomer" },
  { value: "walker", label: "Dog Walker" },
  { value: "boarder", label: "Pet Boarder" },
  { value: "food_supplier", label: "Food Supplier" },
  { value: "trainer", label: "Dog Trainer" },
  { value: "other", label: "Other" },
] as const;

export const PRICE_UNITS = [
  { value: "per_visit", label: "Per visit" },
  { value: "per_hour", label: "Per hour" },
  { value: "per_day", label: "Per day" },
  { value: "per_month", label: "Per month" },
] as const;

export const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export type ProviderServiceType = (typeof SERVICE_TYPES)[number]["value"];
export type ProviderPriceUnit = (typeof PRICE_UNITS)[number]["value"];

export type ProviderProfile = {
  id: string;
  provider_id: string;
  business_name: string;
  service_type: ProviderServiceType;
  description: string | null;
  address: string;
  city: string;
  state: string;
  pincode: string;
  lat: number | null;
  lng: number | null;
  phone: string;
  website: string | null;
  price_from: number | null;
  price_to: number | null;
  price_unit: ProviderPriceUnit;
  is_available: boolean;
  avatar_url: string | null;
  years_experience: number | null;
  license_number: string | null;
  created_at: string;
  updated_at: string;
};

export type ProviderAvailability = {
  id: string;
  provider_id: string;
  day_of_week: number;
  open_time: string;
  close_time: string;
};

export type ProviderReview = {
  id: string;
  provider_id: string;
  reviewer_id: string;
  rating: 1 | 2 | 3 | 4 | 5;
  comment: string | null;
  created_at: string;
  reviewer_display_name: string | null;
};

export type ProviderSearchResult = ProviderProfile & {
  avg_rating: number;
  review_count: number;
  availability: ProviderAvailability[];
};

export type SearchFilters = {
  service_type: string | null;
  city: string | null;
  is_available: boolean | null;
  min_rating: number | null;
};
