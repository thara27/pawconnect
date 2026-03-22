"use client";

import Link from "next/link";
import { type FormEvent, useState } from "react";

import { createClient } from "@/lib/supabase/client";
import type { UserType } from "@/lib/types/auth";

export default function SignupPage() {
  const supabase = createClient();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState<UserType>("pet_owner");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleSignup = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    const emailRedirectTo = `${window.location.origin}/auth/callback`;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo,
        data: {
          full_name: fullName,
          user_type: userType,
        },
      },
    });

    setIsLoading(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    setSuccessMessage("Check your email to confirm your account, then log in.");
  };

  const handleGoogleSignup = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsGoogleLoading(true);

    const redirectTo = `${window.location.origin}/auth/callback?next=/dashboard`;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
      },
    });

    if (error) {
      setErrorMessage(error.message);
      setIsGoogleLoading(false);
    }
  };

  return (
    <>
      <p className="text-sm font-medium uppercase tracking-wide text-emerald-700">
        PawConnect
      </p>
      <h1 className="mt-2 text-2xl font-semibold text-slate-900">Create account</h1>
      <p className="mt-2 text-sm text-slate-600">
        Choose your profile type to get started.
      </p>

      <form onSubmit={handleSignup} className="mt-8 space-y-4">
        <div>
          <label
            htmlFor="fullName"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Full name
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            required
            autoComplete="name"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 outline-none ring-emerald-200 transition focus:ring"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 outline-none ring-emerald-200 transition focus:ring"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 outline-none ring-emerald-200 transition focus:ring"
          />
        </div>

        <fieldset>
          <legend className="mb-1.5 block text-sm font-medium text-slate-700">
            I am a
          </legend>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 px-3 py-2">
              <input
                type="radio"
                name="userType"
                value="pet_owner"
                checked={userType === "pet_owner"}
                onChange={() => setUserType("pet_owner")}
              />
              <span className="text-sm text-slate-700">Pet owner</span>
            </label>
            <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 px-3 py-2">
              <input
                type="radio"
                name="userType"
                value="service_provider"
                checked={userType === "service_provider"}
                onChange={() => setUserType("service_provider")}
              />
              <span className="text-sm text-slate-700">Service provider</span>
            </label>
          </div>
        </fieldset>

        {errorMessage ? (
          <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {errorMessage}
          </p>
        ) : null}

        {successMessage ? (
          <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
            {successMessage}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-lg bg-slate-900 px-4 py-2.5 font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? "Creating account..." : "Create account"}
        </button>
      </form>

      <div className="mt-4">
        <div className="mb-4 flex items-center gap-3 text-xs text-slate-400">
          <div className="h-px flex-1 bg-slate-200" />
          <span>OR</span>
          <div className="h-px flex-1 bg-slate-200" />
        </div>
        <button
          type="button"
          onClick={handleGoogleSignup}
          disabled={isGoogleLoading}
          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 font-medium text-slate-800 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isGoogleLoading ? "Redirecting to Google..." : "Continue with Google"}
        </button>
      </div>

      <p className="mt-6 text-sm text-slate-600">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-slate-900 underline">
          Log in
        </Link>
      </p>
    </>
  );
}
