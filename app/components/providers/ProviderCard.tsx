import Image from "next/image";
import Link from "next/link";

import { SERVICE_TYPES } from "@/lib/types/provider";
import type { ProviderSearchResult } from "@/lib/types/provider";

const SERVICE_BADGE: Record<string, string> = {
  vet: "bg-orange-light text-orange",
  groomer: "bg-teal-light text-teal",
  walker: "bg-purple-light text-purple",
  boarder: "bg-amber-light text-amber",
  food_supplier: "bg-yellow-100 text-yellow-700",
  trainer: "bg-purple-light text-purple",
  other: "bg-slate-100 text-slate-600",
};

const SERVICE_AVATAR: Record<string, string> = {
  vet: "bg-orange-light text-orange",
  groomer: "bg-teal-light text-teal",
  walker: "bg-purple-light text-purple",
  boarder: "bg-amber-light text-amber",
  food_supplier: "bg-amber-light text-amber",
  trainer: "bg-purple-light text-purple",
  other: "bg-slate-100 text-slate-600",
};

function StarRating({ rating }: { rating: number }) {
  const filled = Math.round(rating);
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          className={`h-4 w-4 ${i < filled ? "text-amber-400" : "text-slate-200"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function InitialsAvatar({ name, sizeClass, colorClass }: { name: string; sizeClass: string; colorClass: string }) {
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <div
      className={`flex items-center justify-center rounded-full font-semibold ${sizeClass} ${colorClass}`}
    >
      {initials || "?"}
    </div>
  );
}

type Props = {
  provider: ProviderSearchResult;
};

export default function ProviderCard({ provider }: Props) {
  const serviceLabel =
    SERVICE_TYPES.find((s) => s.value === provider.service_type)?.label ??
    provider.service_type;
  const badgeColor = SERVICE_BADGE[provider.service_type] ?? SERVICE_BADGE.other;
  const avatarColor = SERVICE_AVATAR[provider.service_type] ?? SERVICE_AVATAR.other;

  const priceDisplay =
    provider.price_from !== null && provider.price_to !== null
      ? `₹${provider.price_from.toLocaleString("en-IN")} – ₹${provider.price_to.toLocaleString("en-IN")}`
      : provider.price_from !== null
        ? `From ₹${provider.price_from.toLocaleString("en-IN")}`
        : null;

  const priceUnitLabel = provider.price_unit?.replace(/_/g, " ");

  return (
    <article className="flex flex-col rounded-2xl border border-border bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-orange hover:shadow-xl">
      {/* Header: avatar + name + badge */}
      <div className="flex items-start gap-4">
        <div className="relative h-14 w-14 flex-shrink-0">
          {provider.avatar_url ? (
            <Image
              src={provider.avatar_url}
              alt={provider.business_name}
              fill
              className="rounded-full object-cover"
              sizes="56px"
            />
          ) : (
            <InitialsAvatar name={provider.business_name} sizeClass="h-14 w-14 text-lg" colorClass={avatarColor} />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-semibold text-slate-900">{provider.business_name}</h3>
          <span
            className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${badgeColor}`}
          >
            {serviceLabel}
          </span>
        </div>
      </div>

      {/* Location */}
      <p className="mt-3 flex items-center gap-1 text-sm text-slate-500">
        <svg className="h-3.5 w-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        {provider.city}, {provider.state}
      </p>

      {/* Star rating */}
      <div className="mt-2 flex items-center gap-2">
        <StarRating rating={provider.avg_rating} />
        <span className="text-sm text-slate-600">
          {provider.avg_rating > 0 ? provider.avg_rating.toFixed(1) : "No ratings"}
          {provider.review_count > 0 && (
            <span className="ml-1 text-slate-400">({provider.review_count})</span>
          )}
        </span>
      </div>

      {/* Price */}
      {priceDisplay && (
        <p className="mt-2 text-base font-bold text-orange [font-family:var(--font-fraunces)]">
          {priceDisplay}
          {priceUnitLabel && (
            <span className="ml-1 text-sm font-medium text-muted"> / {priceUnitLabel}</span>
          )}
        </p>
      )}

      {/* Footer: availability + CTA */}
      <div className="mt-auto pt-4 flex items-center justify-between">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
            provider.is_available
              ? "bg-emerald-100 text-emerald-700"
              : "bg-slate-100 text-slate-500"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              provider.is_available ? "bg-emerald-500" : "bg-slate-400"
            }`}
          />
          {provider.is_available ? "Available today" : "Unavailable"}
        </span>
        <div className="flex items-center gap-2">
          <Link
            href={`/dashboard/pet-owner/providers/${provider.id}`}
            className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            View profile
          </Link>
          <Link
            href={`/dashboard/pet-owner/providers/${provider.id}/book`}
            className={`rounded-full px-5 py-2 text-sm font-bold text-white transition ${
              provider.is_available
                ? "bg-orange hover:bg-orange-dark"
                : "bg-slate-400 hover:bg-slate-500"
            }`}
          >
            Book now
          </Link>
        </div>
      </div>
    </article>
  );
}
