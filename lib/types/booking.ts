export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";

export type Booking = {
  id: string;
  pet_owner_id: string;
  provider_id: string;
  pet_id: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  service_type: string;
  status: BookingStatus;
  notes: string | null;
  total_price: number | null;
  cancellation_reason: string | null;
  created_at: string;
  updated_at: string;
};

export type BookingWithDetails = Booking & {
  provider: {
    business_name: string;
    service_type: string;
    avatar_url: string | null;
    city: string;
    phone: string;
  };
  pet: {
    name: string;
    breed: string | null;
    species: string;
    photo_url: string | null;
  };
  owner: {
    full_name: string;
    email: string;
  };
};

export type TimeSlot = {
  date: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
};

export type NotificationType =
  | "booking_request"
  | "booking_confirmed"
  | "booking_cancelled"
  | "system"
  | string;

export type Notification = {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: NotificationType;
  is_read: boolean;
  booking_id: string | null;
  created_at: string;
};
