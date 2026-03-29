"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import type { UserType } from "@/lib/types/auth";

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
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

  redirect("/dashboard");
}
