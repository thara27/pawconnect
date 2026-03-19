"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { createBooking, getAvailableSlots } from "@/lib/actions/bookings";
import type { TimeSlot } from "@/lib/types/booking";

type PetOption = {
  id: string;
  name: string;
  breed: string | null;
  species: string;
  photo_url: string | null;
};

type ProviderBookingInfo = {
  id: string;
  business_name: string;
  service_type: string;
  price_from: number | null;
  availabilityDays: number[];
};

type BookingWizardProps = {
  provider: ProviderBookingInfo;
  pets: PetOption[];
};

const STEP_LABELS = ["Select pet", "Select date", "Select time", "Confirm"];

function toDayIndex(dateISO: string): number {
  return new Date(`${dateISO}T00:00:00`).getDay();
}

function formatDate(dateISO: string): string {
  return new Date(`${dateISO}T00:00:00`).toLocaleDateString("en-IN", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function BookingWizard({ provider, pets }: BookingWizardProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [notes, setNotes] = useState("");
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, startSubmitting] = useTransition();

  const selectedPet = useMemo(
    () => pets.find((pet) => pet.id === selectedPetId) ?? null,
    [pets, selectedPetId],
  );

  const todayISO = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const maxDateISO = useMemo(() => {
    const max = new Date();
    max.setDate(max.getDate() + 60);
    return max.toISOString().slice(0, 10);
  }, []);

  async function loadSlots(dateISO: string) {
    setLoadingSlots(true);
    setError(null);
    setSelectedSlot(null);

    try {
      const nextSlots = await getAvailableSlots(provider.id, dateISO);
      setSlots(nextSlots);
      if (nextSlots.length === 0) {
        setError("No slots available for this date.");
      }
    } catch (slotError) {
      setError(slotError instanceof Error ? slotError.message : "Unable to load slots.");
      setSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  }

  function handleDateChange(value: string) {
    setSelectedDate(value);
    if (!value) {
      setSlots([]);
      return;
    }

    const day = toDayIndex(value);
    if (!provider.availabilityDays.includes(day)) {
      setError("Provider is not available on this day. Please choose an open day.");
      setSlots([]);
      return;
    }

    void loadSlots(value);
  }

  function goNext() {
    setError(null);

    if (step === 1 && !selectedPetId) {
      setError("Please select a pet to continue.");
      return;
    }

    if (step === 2 && !selectedDate) {
      setError("Please select a date to continue.");
      return;
    }

    if (step === 3 && !selectedSlot) {
      setError("Please select a time slot to continue.");
      return;
    }

    setStep((current) => Math.min(4, current + 1));
  }

  function goBack() {
    setError(null);
    setStep((current) => Math.max(1, current - 1));
  }

  function submitBooking() {
    if (!selectedPet || !selectedSlot) {
      setError("Booking details are incomplete.");
      return;
    }

    startSubmitting(async () => {
      const result = await createBooking({
        provider_id: provider.id,
        pet_id: selectedPet.id,
        booking_date: selectedSlot.date,
        start_time: selectedSlot.start_time,
        end_time: selectedSlot.end_time,
        notes,
      });

      if (!result.success) {
        setError(result.error ?? "Could not create booking.");
        return;
      }

      router.push("/dashboard/pet-owner/bookings?success=true");
    });
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <div>
          <Link
            href={`/dashboard/pet-owner/providers/${provider.id}`}
            className="text-sm font-medium text-slate-500 hover:text-slate-900"
          >
            ← Back to provider
          </Link>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">Book service</h1>
          <p className="mt-1 text-sm text-slate-600">
            Booking with {provider.business_name} ({provider.service_type})
          </p>
        </div>

        <div className="grid grid-cols-4 gap-2 rounded-xl border border-slate-200 bg-white p-3">
          {STEP_LABELS.map((label, index) => {
            const current = index + 1;
            const active = step === current;
            const completed = step > current;
            return (
              <div key={label} className="text-center">
                <div
                  className={`mx-auto mb-1 flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                    active
                      ? "bg-[#E8602C] text-white"
                      : completed
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {current}
                </div>
                <p className="text-xs text-slate-600">{label}</p>
              </div>
            );
          })}
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {step === 1 && (
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Step 1: Select pet</h2>
            {pets.length === 0 ? (
              <p className="mt-3 text-sm text-slate-600">
                You need at least one pet profile before booking.
              </p>
            ) : (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {pets.map((pet) => {
                  const selected = selectedPetId === pet.id;
                  return (
                    <button
                      key={pet.id}
                      type="button"
                      onClick={() => setSelectedPetId(pet.id)}
                      className={`flex items-center gap-3 rounded-xl border p-3 text-left transition ${
                        selected
                          ? "border-[#E8602C] bg-orange-50"
                          : "border-slate-200 hover:border-[#E8602C]"
                      }`}
                    >
                      <div className="relative h-14 w-14 overflow-hidden rounded-full bg-slate-100">
                        {pet.photo_url ? (
                          <Image
                            src={pet.photo_url}
                            alt={pet.name}
                            fill
                            className="object-cover"
                            sizes="56px"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-xs font-semibold text-slate-500">
                            {pet.name.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{pet.name}</p>
                        <p className="text-sm text-slate-600">{pet.breed || pet.species}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {step === 2 && (
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Step 2: Select date</h2>
            <p className="mt-1 text-sm text-slate-600">
              Available weekdays: {provider.availabilityDays.map((day) => ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][day]).join(", ") || "None"}
            </p>
            <input
              type="date"
              min={todayISO}
              max={maxDateISO}
              value={selectedDate}
              onChange={(event) => handleDateChange(event.target.value)}
              className="mt-4 rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-900 focus:border-[#E8602C] focus:outline-none focus:ring-1 focus:ring-[#E8602C]"
            />
          </section>
        )}

        {step === 3 && (
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Step 3: Select time slot</h2>
            <p className="mt-1 text-sm text-slate-600">
              {selectedDate ? formatDate(selectedDate) : "Select a date first"}
            </p>

            {loadingSlots ? (
              <p className="mt-4 text-sm text-slate-500">Loading available slots...</p>
            ) : slots.length === 0 ? (
              <p className="mt-4 text-sm text-slate-500">No slots available.</p>
            ) : (
              <div className="mt-4 flex flex-wrap gap-2">
                {slots.map((slot) => {
                  const selected =
                    selectedSlot?.start_time === slot.start_time &&
                    selectedSlot?.end_time === slot.end_time;
                  return (
                    <button
                      key={`${slot.start_time}-${slot.end_time}`}
                      type="button"
                      disabled={!slot.is_available}
                      onClick={() => setSelectedSlot(slot)}
                      className={`rounded-full border px-4 py-1.5 text-sm transition ${
                        !slot.is_available
                          ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400 line-through"
                          : selected
                            ? "border-[#E8602C] bg-[#E8602C] text-white"
                            : "border-slate-300 bg-white text-slate-700 hover:border-[#E8602C]"
                      }`}
                    >
                      {slot.start_time} - {slot.end_time}
                    </button>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {step === 4 && (
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Step 4: Confirm booking</h2>
            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
              <p><span className="font-medium">Provider:</span> {provider.business_name} ({provider.service_type})</p>
              <p className="mt-1"><span className="font-medium">Pet:</span> {selectedPet?.name} ({selectedPet?.breed || selectedPet?.species})</p>
              <p className="mt-1"><span className="font-medium">Date:</span> {selectedSlot ? formatDate(selectedSlot.date) : "-"}</p>
              <p className="mt-1"><span className="font-medium">Time:</span> {selectedSlot?.start_time} - {selectedSlot?.end_time}</p>
              <p className="mt-1"><span className="font-medium">Price:</span> ₹{(provider.price_from ?? 0).toLocaleString("en-IN")}</p>
            </div>

            <label className="mt-4 block text-sm font-medium text-slate-700">Notes (optional)</label>
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              rows={4}
              placeholder="Anything your provider should know"
              className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#E8602C] focus:outline-none focus:ring-1 focus:ring-[#E8602C]"
            />
          </section>
        )}

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={goBack}
            disabled={step === 1}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Back
          </button>

          {step < 4 ? (
            <button
              type="button"
              onClick={goNext}
              className="rounded-lg bg-[#E8602C] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#cf5222]"
            >
              Continue
            </button>
          ) : (
            <button
              type="button"
              onClick={submitBooking}
              disabled={isSubmitting}
              className="rounded-lg bg-[#E8602C] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#cf5222] disabled:opacity-60"
            >
              {isSubmitting ? "Confirming..." : "Confirm Booking"}
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
