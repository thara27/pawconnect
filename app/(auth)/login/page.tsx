"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";

import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setIsLoading(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  const handleGoogleLogin = async () => {
    setErrorMessage(null);
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
      <h1 className="mt-2 text-2xl font-semibold text-slate-900">Log in</h1>
      <p className="mt-2 text-sm text-slate-600">
        Welcome back. Access your pet community account.
      </p>

      <form onSubmit={handleLogin} className="mt-8 space-y-4">
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
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 outline-none ring-emerald-200 transition focus:ring"
          />
        </div>

        {errorMessage ? (
          <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {errorMessage}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-lg bg-slate-900 px-4 py-2.5 font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? "Logging in..." : "Log in"}
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
          onClick={handleGoogleLogin}
          disabled={isGoogleLoading}
          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 font-medium text-slate-800 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isGoogleLoading ? "Redirecting to Google..." : "Continue with Google"}
        </button>
      </div>

      <p className="mt-6 text-sm text-slate-600">
        New to PawConnect?{" "}
        <Link href="/signup" className="font-medium text-slate-900 underline">
          Create an account
        </Link>
      </p>
    </>
  );
}
