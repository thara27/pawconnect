"use client";

import { useState } from "react";
import Link from "next/link";

type AuthPromptButtonProps = {
  triggerText: string;
  promptText?: string;
  variant?: "primary" | "ghost";
};

export default function AuthPromptButton({
  triggerText,
  promptText = "Sign up free to continue",
  variant = "primary",
}: AuthPromptButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className={
          variant === "primary"
            ? "rounded-lg bg-[#E8602C] px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-[#cf5222]"
            : "rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        }
      >
        {triggerText}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-11 z-20 w-72 rounded-xl border border-slate-200 bg-white p-4 shadow-lg">
          <p className="text-sm text-slate-700">{promptText}</p>
          <div className="mt-3 flex gap-2">
            <Link
              href="/signup"
              className="rounded-md bg-[#E8602C] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#cf5222]"
            >
              Sign up
            </Link>
            <Link
              href="/login"
              className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Login
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
