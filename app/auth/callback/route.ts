import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  // SECURITY: Only allow same-origin relative redirects to prevent open redirect.
  // new URL(absolute, origin) resolves to the absolute URL, ignoring origin.
  const rawNext = searchParams.get("next") ?? "/dashboard";
  const next =
    rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/dashboard";

  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);

    // If the user has no user_type yet (first-time Google sign-in), send to onboarding
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user && !user.user_metadata?.user_type) {
      return NextResponse.redirect(new URL("/onboarding", origin));
    }
  }

  return NextResponse.redirect(new URL(next, origin));
}
