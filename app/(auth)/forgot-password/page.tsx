"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { sendPasswordResetAction } from "@/lib/actions/auth";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    await sendPasswordResetAction(email);
    setIsLoading(false);
    setSubmitted(true);
  };

  return (
    <>
      <p className="badge badge-brand">PawConnect</p>
      <h1 className="heading-md mt-2">Reset your password</h1>
      <p className="mt-2 text-sm text-muted">
        Enter your email and we'll send you a link to reset your password.
      </p>

      {submitted ? (
        <div className="mt-8 rounded-xl border border-green-200 bg-green-50 px-4 py-5 text-sm text-green-800">
          <p className="font-semibold">Check your inbox</p>
          <p className="mt-1">
            If an account exists for <strong>{email}</strong>, you'll receive a reset link shortly.
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
            {isLoading ? "Sending…" : "Send reset link"}
          </button>
        </form>
      )}

      <p className="mt-6 text-sm text-muted">
        Remembered it?{" "}
        <Link href="/login" className="font-semibold text-brand underline">
          Back to login
        </Link>
      </p>
    </>
  );
}
