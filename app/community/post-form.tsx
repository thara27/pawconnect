"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { createPostAction, type PostFormState } from "@/lib/actions/community";

// ── Submit button ──────────────────────────────────────────────────────────────

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="btn btn-primary w-full sm:w-auto disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Posting…" : "Post to community"}
    </button>
  );
}

// ── Post type options ──────────────────────────────────────────────────────────

const POST_TYPE_OPTIONS = [
  { value: "question", label: "Question" },
  { value: "tip",      label: "Tip" },
  { value: "story",    label: "Story" },
  { value: "lost_found",    label: "Lost & Found" },
] as const;

// ── Form ───────────────────────────────────────────────────────────────────────

const initialState: PostFormState = { error: null };

export function PostForm() {
  const [state, formAction] = useActionState(createPostAction, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {/* Post type */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="post_type"
          className="text-xs font-semibold uppercase tracking-widest text-stone-400"
        >
          Post type
        </label>
        <select
          id="post_type"
          name="post_type"
          defaultValue="question"
          className="rounded-xl border border-[#EBEBEB] bg-white px-4 py-3 text-sm text-stone-800 outline-none transition focus:border-[#FF5722] focus:ring-2 focus:ring-[#FF5722]/20"
        >
          {POST_TYPE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Title */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="title"
          className="text-xs font-semibold uppercase tracking-widest text-stone-400"
        >
          Title <span className="text-red-400">*</span>
        </label>
        <input
          id="title"
          name="title"
          type="text"
          placeholder="e.g. Any good dog walkers near Koramangala?"
          maxLength={120}
          required
          className="rounded-xl border border-[#EBEBEB] bg-white px-4 py-3 text-sm text-stone-800 placeholder-stone-300 outline-none transition focus:border-[#FF5722] focus:ring-2 focus:ring-[#FF5722]/20"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="content"
          className="text-xs font-semibold uppercase tracking-widest text-stone-400"
        >
          Content <span className="text-red-400">*</span>
        </label>
        <textarea
          id="content"
          name="content"
          rows={6}
          placeholder="Share details, ask your question, or tell your story…"
          maxLength={2000}
          required
          className="resize-y rounded-xl border border-[#EBEBEB] bg-white px-4 py-3 text-sm text-stone-800 placeholder-stone-300 outline-none transition focus:border-[#FF5722] focus:ring-2 focus:ring-[#FF5722]/20"
        />
        <p className="text-right text-xs text-stone-400">max 2000 characters</p>
      </div>

      {/* Tags */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="tags"
          className="text-xs font-semibold uppercase tracking-widest text-stone-400"
        >
          Tags{" "}
          <span className="normal-case font-normal text-stone-400">
            (optional · comma-separated · up to 5)
          </span>
        </label>
        <input
          id="tags"
          name="tags"
          type="text"
          placeholder="e.g. bangalore, dog-walker, golden-retriever"
          className="rounded-xl border border-[#EBEBEB] bg-white px-4 py-3 text-sm text-stone-800 placeholder-stone-300 outline-none transition focus:border-[#FF5722] focus:ring-2 focus:ring-[#FF5722]/20"
        />
      </div>

      {/* Error */}
      {state.error && (
        <p
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600"
        >
          {state.error}
        </p>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3 pt-1">
        <SubmitButton />
      </div>
    </form>
  );
}
