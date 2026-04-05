"use client";

import Image from "next/image";
import { useActionState, useRef, useState } from "react";
import { useFormStatus } from "react-dom";

import {
  updatePetOwnerProfile,
  type PetOwnerProfile,
  type ProfileFormState,
} from "@/lib/actions/profile";

// ── Types ─────────────────────────────────────────────────────────────────────

type ProfileFormProps = {
  email: string | undefined;
  initialProfile: PetOwnerProfile | null;
};

// ── Submit button ─────────────────────────────────────────────────────────────

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="btn btn-primary w-full sm:w-auto disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Saving…" : "Save changes"}
    </button>
  );
}

// ── Avatar picker ─────────────────────────────────────────────────────────────

function AvatarPicker({ currentUrl }: { currentUrl: string | null }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(currentUrl);
  const [fileError, setFileError] = useState<string | null>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileError(null);

    const ALLOWED = ["image/jpeg", "image/png", "image/webp"];
    if (!ALLOWED.includes(file.type)) {
      setFileError("Use a JPEG, PNG, or WebP image.");
      e.target.value = "";
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setFileError("Image must be 2 MB or smaller.");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  const initials = "👤";

  return (
    <div className="flex items-center gap-5">
      {/* Avatar ring */}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="group relative h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-[#EDE3D4] bg-[#FAF7F2] transition hover:border-[#FF5722] focus:outline-none focus:ring-2 focus:ring-[#FF5722] focus:ring-offset-2"
        aria-label="Change profile photo"
      >
        {preview ? (
          <Image
            src={preview}
            alt="Profile photo"
            fill
            className="object-cover"
            sizes="80px"
            unoptimized={preview.startsWith("data:")}
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-3xl">
            {initials}
          </span>
        )}
        {/* Overlay hint */}
        <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 text-[10px] font-semibold uppercase tracking-widest text-white opacity-0 transition group-hover:opacity-100">
          Change
        </span>
      </button>

      <div>
        <p className="text-sm font-medium text-stone-700">Profile photo</p>
        <p className="text-xs text-stone-400">JPEG, PNG, or WebP · max 2 MB</p>
        {fileError && (
          <p className="mt-1 text-xs font-medium text-red-500">{fileError}</p>
        )}
      </div>

      {/* Hidden file input — named "avatar" so FormData picks it up */}
      <input
        ref={inputRef}
        type="file"
        name="avatar"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFile}
      />
    </div>
  );
}

// ── Field ─────────────────────────────────────────────────────────────────────

function Field({
  label,
  id,
  children,
}: {
  label: string;
  id: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-xs font-semibold uppercase tracking-widest text-stone-400"
      >
        {label}
      </label>
      {children}
    </div>
  );
}

// ── Main form ─────────────────────────────────────────────────────────────────

const initialState: ProfileFormState = { error: null, success: false };

export function ProfileForm({ email, initialProfile }: ProfileFormProps) {
  const [state, formAction] = useActionState(updatePetOwnerProfile, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-8">
      {/* Avatar */}
      <AvatarPicker currentUrl={initialProfile?.avatar_url ?? null} />

      {/* Divider */}
      <hr className="border-[#EBEBEB]" />

      {/* Fields grid */}
      <div className="grid gap-5 sm:grid-cols-2">
        {/* Display name */}
        <Field label="Display name" id="display_name">
          <input
            id="display_name"
            name="display_name"
            type="text"
            autoComplete="name"
            placeholder="e.g. Priya Sharma"
            defaultValue={initialProfile?.display_name ?? ""}
            maxLength={80}
          />
        </Field>

        {/* Email — read-only */}
        <Field label="Email address" id="email">
          <input
            id="email"
            type="email"
            value={email ?? ""}
            readOnly
            className="cursor-not-allowed bg-[#F7F7F5] text-stone-400"
            aria-readonly="true"
          />
        </Field>

        {/* Phone */}
        <Field label="Phone number" id="phone">
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="e.g. +91 98765 43210"
            defaultValue={initialProfile?.phone ?? ""}
            maxLength={20}
          />
        </Field>

        {/* City */}
        <Field label="City" id="city">
          <input
            id="city"
            name="city"
            type="text"
            autoComplete="address-level2"
            placeholder="e.g. Bengaluru"
            defaultValue={initialProfile?.city ?? ""}
            maxLength={60}
          />
        </Field>
      </div>

      {/* Feedback */}
      {state.success && (
        <p
          role="status"
          className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700"
        >
          Profile updated successfully 🎉
        </p>
      )}
      {state.error && (
        <p
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600"
        >
          {state.error}
        </p>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3">
        <SubmitButton />
      </div>
    </form>
  );
}
