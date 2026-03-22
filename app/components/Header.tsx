import { createClient } from "@/lib/supabase/server";
import { NavBar } from "@/app/components/NavBar";

export async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <NavBar isLoggedIn={!!user} />;
}
