"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { createReplyAction, type ReplyFormState } from "@/lib/actions/community";

const initialState: ReplyFormState = { error: null };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="btn btn-primary btn-sm disabled:opacity-60"
    >
      {pending ? "Posting…" : "Post reply"}
    </button>
  );
}

export default function ReplyForm({ postId }: { postId: string }) {
  const [state, formAction] = useActionState(createReplyAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!state.error && formRef.current) {
      formRef.current.reset();
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-3">
      <input type="hidden" name="post_id" value={postId} />
      <textarea
        name="content"
        rows={3}
        required
        maxLength={1000}
        placeholder="Write a reply…"
        className="w-full resize-none rounded-xl border border-border bg-white px-4 py-3 text-sm text-ink placeholder:text-muted focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
      />
      {state.error && (
        <p className="text-xs font-medium text-red-600">{state.error}</p>
      )}
      <SubmitButton />
    </form>
  );
}
