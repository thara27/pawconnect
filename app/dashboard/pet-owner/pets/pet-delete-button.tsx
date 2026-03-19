"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { deletePetAction, type PetDeleteState } from "@/lib/actions/pets";

const initialState: PetDeleteState = {
  error: null,
};

function DeleteButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Deleting..." : "Delete"}
    </button>
  );
}

export function PetDeleteButton({ petId }: { petId: string }) {
  const [state, formAction] = useActionState(deletePetAction, initialState);

  return (
    <form action={formAction} className="space-y-2">
      <input type="hidden" name="id" value={petId} />
      <DeleteButton />
      {state.error ? <p className="text-sm text-red-700">{state.error}</p> : null}
    </form>
  );
}
