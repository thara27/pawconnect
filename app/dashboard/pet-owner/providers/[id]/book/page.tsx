import { notFound } from "next/navigation";

import BookingWizard from "@/app/dashboard/pet-owner/providers/[id]/book/booking-wizard";
import { getPets } from "@/lib/actions/pets";
import { getProviderById } from "@/lib/actions/providers";

export default async function ProviderBookingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [providerResult, pets] = await Promise.all([getProviderById(id), getPets()]);

  if (!providerResult) {
    notFound();
  }

  const availabilityDays = Array.from(
    new Set(providerResult.provider.availability.map((slot) => slot.day_of_week)),
  ).sort((a, b) => a - b);

  return (
    <BookingWizard
      provider={{
        id: providerResult.provider.id,
        business_name: providerResult.provider.business_name,
        service_type: providerResult.provider.service_type,
        price_from: providerResult.provider.price_from,
        availabilityDays,
      }}
      pets={pets.map((pet) => ({
        id: pet.id,
        name: pet.name,
        breed: pet.breed,
        species: pet.species,
        photo_url: pet.photo_url,
      }))}
    />
  );
}
