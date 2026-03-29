import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export default async function DashboardRedirectingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const userType = user.user_metadata?.user_type;

  if (!userType) {
    redirect("/onboarding");
  }

  if (userType === "service_provider") {
    redirect("/dashboard/service-provider");
  }

  redirect("/dashboard/pet-owner");
}
