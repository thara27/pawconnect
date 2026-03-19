import Link from "next/link";

import NotificationsBell from "@/app/components/ui/NotificationsBell";
import DashboardNavLinks from "@/app/components/ui/DashboardNavLinks";
import { SignOutButton } from "@/app/components/sign-out-button";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <>
      <header className="sticky top-0 z-20 border-b border-border bg-white/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <Link
            href="/"
            className="bg-gradient-to-r from-orange to-amber bg-clip-text text-xl font-black tracking-tight text-transparent [font-family:var(--font-fraunces)]"
          >
            PawConnect
          </Link>
          <DashboardNavLinks />
          <div className="flex items-center gap-3">
            <NotificationsBell userId={user?.id ?? null} />
            <SignOutButton />
          </div>
        </div>
      </header>
      {children}
    </>
  );
}
