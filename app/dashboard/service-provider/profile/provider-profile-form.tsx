"use client";

import Image from "next/image";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";

import {
  saveProviderProfileAction,
  type ProviderProfileFormState,
} from "@/lib/actions/providers";
import {
  DAYS_OF_WEEK,
  PRICE_UNITS,
  SERVICE_TYPES,
  type ProviderAvailability,
  type ProviderProfile,
} from "@/lib/types/provider";

type ProviderProfileFormProps = {
  profile: ProviderProfile | null;
  availability: ProviderAvailability[];
};

const initialState: ProviderProfileFormState = {
  error: null,
  fieldErrors: {},
};

const INDIAN_CITIES = [
  "Mumbai",
  "Delhi",
  "Bengaluru",
  "Hyderabad",
  "Chennai",
  "Pune",
  "Kolkata",
  "Ahmedabad",
  "Jaipur",
  "Lucknow",
];

function PawMark() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className="h-12 w-12 text-ink">
      <path
        fill="currentColor"
        d="M19 23c-3.3 0-6-3.6-6-8s2.7-8 6-8 6 3.6 6 8-2.7 8-6 8Zm26 0c-3.3 0-6-3.6-6-8s2.7-8 6-8 6 3.6 6 8-2.7 8-6 8ZM10 38c-2.8 0-5-3.1-5-7s2.2-7 5-7 5 3.1 5 7-2.2 7-5 7Zm44 0c-2.8 0-5-3.1-5-7s2.2-7 5-7 5 3.1 5 7-2.2 7-5 7Zm-22 18c-9.9 0-17-5.7-17-12.5 0-6.1 5.2-11.5 12.7-13.1 1.9-.4 3.9.3 5.1 1.8 1.6 2 4.8 2 6.4 0 1.2-1.5 3.2-2.2 5.1-1.8C51.8 32 57 37.4 57 43.5 57 50.3 49.9 56 40 56h-8Z"
      />
    </svg>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="btn btn-primary sm:w-auto disabled:opacity-60"
    >
      {pending ? "Saving profile..." : "Save profile"}
    </button>
  );
}

export function ProviderProfileForm({
  profile,
  availability,
}: ProviderProfileFormProps) {
  const [state, formAction] = useActionState(saveProviderProfileAction, initialState);
  const [enabledDays, setEnabledDays] = useState<boolean[]>(() =>
    DAYS_OF_WEEK.map((_, dayIndex) =>
      availability.some((slot) => slot.day_of_week === dayIndex),
    ),
  );

  const availabilityByDay = DAYS_OF_WEEK.map((_, dayIndex) =>
    availability.find((slot) => slot.day_of_week === dayIndex) ?? null,
  );

  return (
    <form action={formAction} className="mt-8 space-y-8">
      <section className="form-section space-y-4">
        <div>
          <h2 className="font-fraunces font-semibold text-ink">Section 1 - Business info</h2>
          <p className="mt-1 text-sm text-muted">
            Share the basics pet owners need to trust your service.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="form-label" htmlFor="business_name">
              Business name *
            </label>
            <input
              id="business_name"
              name="business_name"
              type="text"
              required
              defaultValue={profile?.business_name ?? ""}
              className=""
            />
            {state.fieldErrors.business_name ? (
              <p className="form-error mt-1">{state.fieldErrors.business_name}</p>
            ) : null}
          </div>

          <div>
            <label className="form-label" htmlFor="service_type">
              Service type *
            </label>
            <select
              id="service_type"
              name="service_type"
              required
              defaultValue={profile?.service_type ?? "vet"}
              className=""
            >
              {SERVICE_TYPES.map((serviceType) => (
                <option key={serviceType.value} value={serviceType.value}>
                  {serviceType.label}
                </option>
              ))}
            </select>
            {state.fieldErrors.service_type ? (
              <p className="form-error mt-1">{state.fieldErrors.service_type}</p>
            ) : null}
          </div>

          <div>
            <label className="form-label" htmlFor="years_experience">
              Years experience
            </label>
            <input
              id="years_experience"
              name="years_experience"
              type="number"
              min={0}
              defaultValue={profile?.years_experience ?? ""}
              className=""
            />
            {state.fieldErrors.years_experience ? (
              <p className="form-error mt-1">{state.fieldErrors.years_experience}</p>
            ) : null}
          </div>

          <div className="sm:col-span-2">
            <label className="form-label" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              maxLength={300}
              defaultValue={profile?.description ?? ""}
              className=""
            />
            <p className="form-hint mt-1">Max 300 characters.</p>
            {state.fieldErrors.description ? (
              <p className="form-error mt-1">{state.fieldErrors.description}</p>
            ) : null}
          </div>

          <div>
            <label className="form-label" htmlFor="license_number">
              License number
            </label>
            <input
              id="license_number"
              name="license_number"
              type="text"
              defaultValue={profile?.license_number ?? ""}
              className=""
            />
          </div>

          <div>
            <label className="form-label" htmlFor="avatar">
              Avatar
            </label>
            <input
              id="avatar"
              name="avatar"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="text-sm"
            />
            {profile?.avatar_url ? (
              <div className="mt-3 flex items-center gap-3 rounded-lg border border-border bg-white p-3">
                <div className="relative h-14 w-14 overflow-hidden rounded-full border border-slate-200">
                  <Image src={profile.avatar_url} alt={profile.business_name} fill className="object-cover" sizes="56px" />
                </div>
                <span className="text-sm text-muted">Current avatar</span>
              </div>
            ) : (
              <div className="mt-3 flex items-center gap-3 rounded-lg border border-dashed border-border bg-white p-3 text-sm text-muted">
                <PawMark />
                <span>No avatar uploaded yet</span>
              </div>
            )}
            {state.fieldErrors.avatar ? (
              <p className="form-error mt-1">{state.fieldErrors.avatar}</p>
            ) : null}
          </div>
        </div>
      </section>

      <section className="form-section space-y-4">
        <div>
          <h2 className="font-fraunces font-semibold text-ink">Section 2 - Location</h2>
          <p className="mt-1 text-sm text-muted">
            Help pet owners find you in the right city and neighbourhood.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="form-label" htmlFor="address">
              Address *
            </label>
            <textarea
              id="address"
              name="address"
              rows={3}
              required
              defaultValue={profile?.address ?? ""}
              className=""
            />
            {state.fieldErrors.address ? (
              <p className="form-error mt-1">{state.fieldErrors.address}</p>
            ) : null}
          </div>

          <div>
            <label className="form-label" htmlFor="city">
              City *
            </label>
            <input
              id="city"
              name="city"
              list="indian-cities"
              required
              defaultValue={profile?.city ?? ""}
              className=""
            />
            <datalist id="indian-cities">
              {INDIAN_CITIES.map((city) => (
                <option key={city} value={city} />
              ))}
            </datalist>
            {state.fieldErrors.city ? (
              <p className="form-error mt-1">{state.fieldErrors.city}</p>
            ) : null}
          </div>

          <div>
            <label className="form-label" htmlFor="state">
              State *
            </label>
            <input
              id="state"
              name="state"
              required
              defaultValue={profile?.state ?? ""}
              className=""
            />
            {state.fieldErrors.state ? (
              <p className="form-error mt-1">{state.fieldErrors.state}</p>
            ) : null}
          </div>

          <div>
            <label className="form-label" htmlFor="pincode">
              Pincode *
            </label>
            <input
              id="pincode"
              name="pincode"
              required
              inputMode="numeric"
              defaultValue={profile?.pincode ?? ""}
              className=""
            />
            {state.fieldErrors.pincode ? (
              <p className="form-error mt-1">{state.fieldErrors.pincode}</p>
            ) : null}
          </div>
        </div>
      </section>

      <section className="form-section space-y-4">
        <div>
          <h2 className="font-fraunces font-semibold text-ink">Section 3 - Pricing</h2>
          <p className="mt-1 text-sm text-muted">
            Set a clear pricing range in rupees and mark whether you are currently taking bookings.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="form-label" htmlFor="price_from">
              Price from (₹)
            </label>
            <input
              id="price_from"
              name="price_from"
              type="number"
              min={0}
              defaultValue={profile?.price_from ?? ""}
              className=""
            />
            {state.fieldErrors.price_from ? (
              <p className="form-error mt-1">{state.fieldErrors.price_from}</p>
            ) : null}
          </div>

          <div>
            <label className="form-label" htmlFor="price_to">
              Price to (₹)
            </label>
            <input
              id="price_to"
              name="price_to"
              type="number"
              min={0}
              defaultValue={profile?.price_to ?? ""}
              className=""
            />
            {state.fieldErrors.price_to ? (
              <p className="form-error mt-1">{state.fieldErrors.price_to}</p>
            ) : null}
          </div>

          <div>
            <label className="form-label" htmlFor="price_unit">
              Price unit *
            </label>
            <select
              id="price_unit"
              name="price_unit"
              required
              defaultValue={profile?.price_unit ?? "per_visit"}
              className=""
            >
              {PRICE_UNITS.map((priceUnit) => (
                <option key={priceUnit.value} value={priceUnit.value}>
                  {priceUnit.label}
                </option>
              ))}
            </select>
            {state.fieldErrors.price_unit ? (
              <p className="form-error mt-1">{state.fieldErrors.price_unit}</p>
            ) : null}
          </div>

          <label className="flex items-center gap-2 text-sm text-ink sm:items-end sm:pb-2">
            <input
              type="checkbox"
              name="is_available"
              defaultChecked={profile?.is_available ?? true}
              className="h-4 w-4 rounded border-border" style={{ width: "auto", minHeight: "auto" }}
            />
            Currently available for bookings
          </label>
        </div>
      </section>

      <section className="form-section space-y-4">
        <div>
          <h2 className="font-fraunces font-semibold text-ink">Section 4 - Weekly availability</h2>
          <p className="mt-1 text-sm text-muted">
            Turn on the days you work and set opening and closing times.
          </p>
        </div>

        <div className="space-y-3">
          {DAYS_OF_WEEK.map((dayLabel, dayIndex) => {
            const dayAvailability = availabilityByDay[dayIndex];
            const enabled = enabledDays[dayIndex];

            return (
              <div
                key={dayLabel}
                className="card grid grid-cols-1 gap-3 sm:grid-cols-[140px_120px_120px] sm:items-center"
              >
                <label className="flex items-center gap-2 text-sm font-medium text-ink">
                  <input
                    type="checkbox"
                    name={`availability_enabled_${dayIndex}`}
                    checked={enabled}
                    onChange={() => {
                      setEnabledDays((currentDays) =>
                        currentDays.map((currentDay, currentIndex) =>
                          currentIndex === dayIndex ? !currentDay : currentDay,
                        ),
                      );
                    }}
                    className="h-4 w-4 rounded border-border" style={{ width: "auto", minHeight: "auto" }}
                  />
                  {dayLabel}
                </label>

                <input
                  type="time"
                  name={`availability_open_${dayIndex}`}
                  defaultValue={dayAvailability?.open_time ?? "09:00"}
                  disabled={!enabled}
                  className="disabled:opacity-50 disabled:cursor-not-allowed"
                />

                <input
                  type="time"
                  name={`availability_close_${dayIndex}`}
                  defaultValue={dayAvailability?.close_time ?? "18:00"}
                  disabled={!enabled}
                  className="disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            );
          })}
        </div>
        {state.fieldErrors.availability ? (
          <p className="form-error">{state.fieldErrors.availability}</p>
        ) : null}
      </section>

      <section className="form-section space-y-4">
        <div>
          <h2 className="font-fraunces font-semibold text-ink">Section 5 - Contact</h2>
          <p className="mt-1 text-sm text-muted">
            Share the best way for pet owners to reach you.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="form-label" htmlFor="phone">
              Phone *
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              defaultValue={profile?.phone ?? ""}
              className=""
            />
            {state.fieldErrors.phone ? (
              <p className="form-error mt-1">{state.fieldErrors.phone}</p>
            ) : null}
          </div>

          <div>
            <label className="form-label" htmlFor="website">
              Website
            </label>
            <input
              id="website"
              name="website"
              type="url"
              defaultValue={profile?.website ?? ""}
              className=""
            />
            {state.fieldErrors.website ? (
              <p className="form-error mt-1">{state.fieldErrors.website}</p>
            ) : null}
          </div>
        </div>
      </section>

      {state.error ? (
        <p className="alert alert-error">
          {state.error}
        </p>
      ) : null}

      <SubmitButton />
    </form>
  );
}
