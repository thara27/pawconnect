"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { createClient } from "@/lib/supabase/client";

type UserRole = "pet_owner" | "service_provider" | null;

type NavItem = {
  href: string;
  label: string;
};

function NavLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
        active
          ? "bg-amber-light text-amber"
          : "text-[#4A4637] hover:bg-amber-light hover:text-amber"
      }`}
    >
      {label}
    </Link>
  );
}

function getRoleSegment(userRole: UserRole) {
  if (userRole === "pet_owner") {
    return "pet-owner";
  }

  if (userRole === "service_provider") {
    return "service-provider";
  }

  return "";
}

function getNavItems(isLoggedIn: boolean, userRole: UserRole): NavItem[] {
  if (!isLoggedIn) {
    return [
      { href: "/", label: "Home" },
      { href: "/search", label: "Services" },
      { href: "/breeds", label: "Breeds" },
      { href: "/community", label: "Community" },
    ];
  }

  if (userRole === "pet_owner") {
    return [
      { href: "/dashboard/pet-owner", label: "Home" },
      { href: "/dashboard/pet-owner/pets", label: "My Dogs" },
      { href: "/dashboard/pet-owner/search", label: "Services" },
      { href: "/dashboard/pet-owner/bookings", label: "Bookings" },
      { href: "/breeds", label: "Breeds" },
      { href: "/community", label: "Community" },
    ];
  }

  if (userRole === "service_provider") {
    return [
      { href: "/dashboard/service-provider", label: "Home" },
      { href: "/dashboard/service-provider/profile", label: "My Profile" },
      { href: "/dashboard/service-provider/bookings", label: "Bookings" },
      { href: "/breeds", label: "Breeds" },
      { href: "/community", label: "Community" },
    ];
  }

  return [
    { href: "/dashboard", label: "Home" },
    { href: "/breeds", label: "Breeds" },
    { href: "/community", label: "Community" },
  ];
}

export function NavBar({
  isLoggedIn,
  userRole,
}: {
  isLoggedIn: boolean;
  userRole: string | null;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const normalizedRole: UserRole =
    userRole === "pet_owner" || userRole === "service_provider"
      ? userRole
      : pathname.startsWith("/dashboard/pet-owner")
        ? "pet_owner"
        : pathname.startsWith("/dashboard/service-provider")
          ? "service_provider"
          : null;

  const navItems = useMemo(
    () => getNavItems(isLoggedIn, normalizedRole),
    [isLoggedIn, normalizedRole],
  );

  const roleSegment = getRoleSegment(normalizedRole);

  const notificationsHref = roleSegment
    ? `/dashboard/${roleSegment}/notifications`
    : "/dashboard/notifications";

  const profileHref =
    normalizedRole === "pet_owner"
      ? "/dashboard/pet-owner/profile"
      : normalizedRole === "service_provider"
        ? "/dashboard/service-provider/profile"
        : "/dashboard/profile";

  const settingsHref = roleSegment
    ? `/dashboard/${roleSegment}/settings`
    : "/dashboard/settings";

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setMenuOpen(false);
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) {
      document.body.style.overflow = "";
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  useEffect(() => {
    const loadUnreadCount = async () => {
      if (!isLoggedIn) {
        setUnreadCount(0);
        return;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setUnreadCount(0);
        return;
      }

      const { count } = await supabase
        .from("notifications")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("is_read", false);

      setUnreadCount(count ?? 0);
    };

    void loadUnreadCount();
  }, [isLoggedIn, pathname, supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setProfileOpen(false);
    setMenuOpen(false);
    router.push("/");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 h-[62px] border-b border-[#F0E4C5] bg-white/95 backdrop-blur">
      <nav className="mx-auto flex h-full w-full max-w-7xl items-center justify-between px-4">
        <Link href="/" className="font-sans text-xl font-bold tracking-tight text-ink">
          <span aria-hidden="true">🐾 </span>
          Paw<span className="text-amber">Connect</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navItems.map(({ href, label }) => (
            <NavLink
              key={href}
              href={href}
              label={label}
              active={pathname === href || (href !== "/" && pathname.startsWith(href))}
            />
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {isLoggedIn ? (
            <>
              <Link
                href={notificationsHref}
                className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-lg transition hover:bg-slate-50"
                aria-label="Notifications"
              >
                <span aria-hidden="true">🔔</span>
                {unreadCount > 0 ? (
                  <span className="absolute right-1 top-1 inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
                ) : null}
              </Link>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setProfileOpen((value) => !value)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-amber-light font-semibold text-amber"
                  aria-label="Open profile menu"
                >
                  A
                </button>

                {profileOpen ? (
                  <div className="absolute right-0 mt-2 w-44 rounded-xl border border-slate-200 bg-white p-1 shadow-lg">
                    <Link
                      href={profileHref}
                      className="block rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                      onClick={() => setProfileOpen(false)}
                    >
                      My Profile
                    </Link>
                    <Link
                      href={settingsHref}
                      className="block rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                      onClick={() => setProfileOpen(false)}
                    >
                      Settings
                    </Link>
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="block w-full rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : null}
              </div>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-semibold text-[#3D3A2E] transition hover:text-amber"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                className="rounded-lg bg-[linear-gradient(180deg,#F6C14D_0%,#E8920A_100%)] px-4 py-2 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(232,146,10,0.32)] transition hover:brightness-105"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          {isLoggedIn ? (
            <Link
              href={notificationsHref}
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-lg transition hover:bg-slate-50"
              aria-label="Notifications"
            >
              <span aria-hidden="true">🔔</span>
              {unreadCount > 0 ? (
                <span className="absolute right-1 top-1 inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
              ) : null}
            </Link>
          ) : null}

          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-xl"
            aria-label="Open menu"
          >
            ☰
          </button>
        </div>
      </nav>

      {menuOpen ? (
        <div className="fixed inset-0 z-[120] md:hidden">
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            className="absolute inset-0 bg-black/30"
            aria-label="Close menu backdrop"
          />

          <div className="absolute inset-0 flex flex-col bg-white text-slate-900 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4">
            <Link
              href="/"
              className="font-sans text-xl font-bold tracking-tight text-ink"
              onClick={() => setMenuOpen(false)}
            >
              <span aria-hidden="true">🐾 </span>
              Paw<span className="text-amber">Connect</span>
            </Link>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-xl"
              aria-label="Close menu"
            >
              ×
            </button>
            </div>

            <div className="flex flex-1 flex-col overflow-y-auto px-4 py-4">
              <div className="space-y-2">
              {navItems.map(({ href, label }) => {
                const active = pathname === href || (href !== "/" && pathname.startsWith(href));
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMenuOpen(false)}
                    className={`flex min-h-12 items-center rounded-xl px-4 text-base font-semibold transition ${
                      active
                        ? "bg-amber-light text-amber"
                        : "text-[#4A4637] hover:bg-amber-light hover:text-amber"
                    }`}
                  >
                    {label}
                  </Link>
                );
              })}

              {isLoggedIn ? (
                <>
                  <Link
                    href={notificationsHref}
                    onClick={() => setMenuOpen(false)}
                    className="flex min-h-12 items-center rounded-xl px-4 text-base font-semibold text-[#4A4637] hover:bg-amber-light hover:text-amber"
                  >
                    Notifications
                    {unreadCount > 0 ? (
                      <span className="ml-2 inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
                    ) : null}
                  </Link>
                  <Link
                    href={profileHref}
                    onClick={() => setMenuOpen(false)}
                    className="flex min-h-12 items-center rounded-xl px-4 text-base font-semibold text-[#4A4637] hover:bg-amber-light hover:text-amber"
                  >
                    My Profile
                  </Link>
                  <Link
                    href={settingsHref}
                    onClick={() => setMenuOpen(false)}
                    className="flex min-h-12 items-center rounded-xl px-4 text-base font-semibold text-[#4A4637] hover:bg-amber-light hover:text-amber"
                  >
                    Settings
                  </Link>
                </>
              ) : null}
              </div>

              <div className="mt-auto space-y-3 pb-4 pt-6">
                {isLoggedIn ? (
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="flex min-h-12 w-full items-center justify-center rounded-lg border border-red-200 bg-red-50 px-4 text-base font-semibold text-red-600"
                  >
                    Sign Out
                  </button>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setMenuOpen(false)}
                      className="flex min-h-12 items-center justify-center rounded-lg border border-slate-300 px-4 text-base font-semibold text-[#3D3A2E]"
                    >
                      Log In
                    </Link>
                    <Link
                      href="/signup"
                      onClick={() => setMenuOpen(false)}
                      className="flex min-h-12 items-center justify-center rounded-lg bg-[linear-gradient(180deg,#F6C14D_0%,#E8920A_100%)] px-4 text-base font-semibold text-white"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
