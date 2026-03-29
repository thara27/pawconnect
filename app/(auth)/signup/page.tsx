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
      <p className="badge badge-brand">
        PawConnect
      </p>
      <h1 className="heading-md mt-2">Create account</h1>
      <p className="mt-2 text-sm text-muted">
        Choose your profile type to get started.
      </p>

      <form onSubmit={handleSignup} className="mt-8 space-y-4">
        <div className="form-group">
          <label htmlFor="fullName" className="form-label">
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
          />
        </div>

        <div className="form-group">
          <label htmlFor="email" className="form-label">
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
          />
        </div>

        <div className="form-group">
          <label htmlFor="password" className="form-label">
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
          />
        </div>

        <fieldset>
          <legend className="form-label mb-2">
            I am a
          </legend>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-border px-3 py-2 transition hover:border-brand">
              <input
                type="radio"
                name="userType"
                value="pet_owner"
                checked={userType === "pet_owner"}
                onChange={() => setUserType("pet_owner")}
                style={{ width: "auto", minHeight: "auto" }}
              />
              <span className="text-sm text-ink">Pet owner</span>
            </label>
            <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-border px-3 py-2 transition hover:border-brand">
              <input
                type="radio"
                name="userType"
                value="service_provider"
                checked={userType === "service_provider"}
                onChange={() => setUserType("service_provider")}
                style={{ width: "auto", minHeight: "auto" }}
              />
              <span className="text-sm text-ink">Service provider</span>
            </label>
          </div>
        </fieldset>

        {errorMessage ? (
          <p className="alert alert-error">
            {errorMessage}
          </p>
        ) : null}

        {successMessage ? (
          <p className="alert alert-success">
            {successMessage}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isLoading}
          className="btn btn-primary btn-full"
        >
          {isLoading ? "Creating account..." : "Create account"}
        </button>
      </form>

      <div className="mt-4">
        <div className="mb-4 flex items-center gap-3 text-xs text-muted">
          <div className="h-px flex-1 bg-border" />
          <span>OR</span>
          <div className="h-px flex-1 bg-border" />
        </div>
        <button
          type="button"
          onClick={handleGoogleSignup}
          disabled={isGoogleLoading}
          className="btn btn-outline btn-full"
        >
          {isGoogleLoading ? "Redirecting to Google..." : "Continue with Google"}
        </button>
      </div>

      <p className="mt-6 text-sm text-muted">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-brand underline">
          Log in
        </Link>
      </p>
    </>
  );
}
