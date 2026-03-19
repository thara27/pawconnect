import { signOutAction } from "@/lib/actions/auth";

export function SignOutButton() {
  return (
    <form action={signOutAction}>
      <button
        type="submit"
        className="rounded-full border-2 border-orange bg-white px-5 py-2.5 text-sm font-bold text-orange transition hover:bg-orange-light"
      >
        Sign out
      </button>
    </form>
  );
}
