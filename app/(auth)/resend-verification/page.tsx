"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { resendVerificationAction } from "@/lib/actions/auth";

export default function ResendVerificationPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    await resendVerificationAction(email);
    setIsLoading(false);
    setSubmitted(true);
  };

  return (
    <>
      <p className="badge badge-brand">PawConnect</p>
      <h1 className="heading-md mt-2">Resend verification email</h1>
      <p className="mt-2 text-sm text-muted">
        Didn't receive your confirmation email? Enter your address and we'll send it again.
      </p>

      {submitted ? (
        <div className="mt-8 rounded-xl border border-green-200 bg-green-50 px-4 py-5 text-sm text-green-800">
          <p className="font-semibold">Email sent</p>
          <p className="mt-1">
            If <strong>{email}</strong> is registered and unverified, a new confirmation link is on its way.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary btn-full"
          >
            {isLoading ? "Sending…" : "Resend verification email"}
          </button>
        </form>
      )}

      <p className="mt-6 text-sm text-muted">
        Already verified?{" "}
        <Link href="/login" className="font-semibold text-brand underline">
          Log in
        </Link>
      </p>
    </>
  );
}
