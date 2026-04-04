"use server";

import { createClient } from "@/lib/supabase/server";

export type NewsletterResult =
  | { success: true }
  | { success: false; message: string };

export async function subscribeToNewsletter(email: string): Promise<NewsletterResult> {
  const trimmed = email.trim().toLowerCase();

  if (!trimmed) {
    return { success: false, message: "Email is required." };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("newsletter_subscribers")
    .insert({ email: trimmed });

  if (error) {
    // Duplicate email — Postgres unique violation code 23505
    if (error.code === "23505") {
      // Treat as success so we don't leak whether an email is subscribed
      return { success: true };
    }
    return { success: false, message: "Something went wrong. Please try again." };
  }

  return { success: true };
}
