import { createClient } from "@/lib/supabase/server";
import { NavBar } from "@/app/components/NavBar";

export async function Header() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const isLoggedIn = !!session;
  const userRole = (session?.user?.user_metadata?.user_type as string | undefined) || null;
  const userId = session?.user?.id ?? null;

  return <NavBar isLoggedIn={isLoggedIn} userRole={userRole} userId={userId} />;
}
