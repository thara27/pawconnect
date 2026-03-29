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
            ? "btn btn-primary btn-sm"
            : "btn btn-outline btn-sm"
        }
      >
        {triggerText}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-11 z-20 w-72 rounded-xl border border-border bg-white p-4 shadow-lg">
          <p className="text-sm text-muted">{promptText}</p>
          <div className="mt-3 flex gap-2">
            <Link href="/signup" className="btn btn-primary btn-sm">
              Sign up
            </Link>
            <Link href="/login" className="btn btn-ghost btn-sm">
              Login
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
