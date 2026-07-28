"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";

import { createClient } from "@/lib/supabase/server";
import type { UserType } from "@/lib/types/auth";

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function sendPasswordResetAction(
  email: string,
): Promise<{ error: string | null }> {
  const email_trimmed = email.trim().toLowerCase();
  if (!email_trimmed) return { error: "Email is required." };

  const headersList = await headers();
  const origin = headersList.get("origin") ?? "";

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email_trimmed, {
    redirectTo: `${origin}/auth/callback?next=/auth/update-password`,
  });

  // Always return success to avoid leaking whether an email is registered
  if (error) console.error("resetPasswordForEmail error:", error.message);
  return { error: null };
}

export async function resendVerificationAction(
  email: string,
): Promise<{ error: string | null }> {
  const email_trimmed = email.trim().toLowerCase();
  if (!email_trimmed) return { error: "Email is required." };

  const headersList = await headers();
  const origin = headersList.get("origin") ?? "";

  const supabase = await createClient();
  const { error } = await supabase.auth.resend({
    type: "signup",
    email: email_trimmed,
    options: { emailRedirectTo: `${origin}/auth/callback` },
  });

  if (error) console.error("resend verification error:", error.message);
  return { error: null };
}

export async function setUserTypeAction(userType: UserType) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { error } = await supabase.auth.updateUser({
    data: { user_type: userType },
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/dashboard/pet-owner?welcome=1");
}
