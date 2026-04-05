"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { createClient } from "@/lib/supabase/client";
import NotificationsBell from "@/app/components/ui/NotificationsBell";

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
          ? "bg-brand-light text-brand"
          : "text-muted hover:bg-brand-light hover:text-brand"
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
      { href: "/contact", label: "Contact" },
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
      { href: "/contact", label: "Contact" },
    ];
  }

  if (userRole === "service_provider") {
    return [
      { href: "/dashboard/service-provider", label: "Home" },
      { href: "/dashboard/service-provider/profile", label: "My Profile" },
      { href: "/dashboard/service-provider/bookings", label: "Bookings" },
      { href: "/breeds", label: "Breeds" },
      { href: "/community", label: "Community" },
      { href: "/contact", label: "Contact" },
    ];
  }

  return [
    { href: "/dashboard", label: "Home" },
    { href: "/breeds", label: "Breeds" },
    { href: "/community", label: "Community" },
    { href: "/contact", label: "Contact" },
  ];
}

export function NavBar({
  isLoggedIn,
  userRole,
  userId,
}: {
  isLoggedIn: boolean;
  userRole: string | null;
  userId: string | null;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

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

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setProfileOpen(false);
    setMenuOpen(false);
    router.push("/");
    router.refresh();
  };

  return (
    <>
      <header className="sticky top-0 z-[100] h-[62px] bg-white shadow-sm">
        <nav className="mx-auto flex h-full w-full max-w-7xl items-center justify-between px-4">
        <Link href="/" className="font-fraunces text-2xl font-black text-brand">
          <span aria-hidden="true">🐾 </span>
          PawConnect
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
              <NotificationsBell userId={userId} />

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setProfileOpen((value) => !value)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-light font-semibold text-brand"
                  aria-label="Open profile menu"
                >
                  A
                </button>


                {profileOpen ? (
                  <div className="absolute right-0 mt-2 w-44 rounded-xl border border-border bg-white p-1 shadow-lg">
                    <Link
                      href={profileHref}
                      className="block rounded-lg px-3 py-2 text-sm text-ink hover:bg-bg"
                      onClick={() => setProfileOpen(false)}
                    >
                      My Profile
                    </Link>
                    <Link
                      href={settingsHref}
                      className="block rounded-lg px-3 py-2 text-sm text-ink hover:bg-bg"
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
              <Link href="/login" className="btn btn-ghost btn-sm">
                Log In
              </Link>
              <Link href="/signup" className="btn btn-primary btn-sm">
                Sign Up
              </Link>
            </>
          )}
        </div>

          <div className="flex items-center gap-2 md:hidden">
            {isLoggedIn ? (
              <NotificationsBell userId={userId} />
            ) : null}

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border text-xl"
              aria-label="Open menu"
            >
              ☰
            </button>
          </div>
        </nav>
      </header>

      {menuOpen ? (
        <div className="fixed inset-0 z-[120] md:hidden">
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            className="absolute inset-0 bg-black/30"
            aria-label="Close menu backdrop"
          />

          <div className="absolute inset-0 flex flex-col bg-white text-ink shadow-2xl">
            <div className="flex items-center justify-between border-b border-border px-4 py-4">
            <Link
              href="/"
              className="font-fraunces text-2xl font-black text-brand"
              onClick={() => setMenuOpen(false)}
            >
              <span aria-hidden="true">🐾 </span>
              PawConnect
            </Link>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border text-xl"
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
                        ? "bg-brand-light text-brand"
                        : "text-muted hover:bg-brand-light hover:text-brand"
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
                    className="flex min-h-12 items-center rounded-xl px-4 text-base font-semibold text-muted hover:bg-brand-light hover:text-brand"
                  >
                    Notifications
                  </Link>
                  <Link
                    href={profileHref}
                    onClick={() => setMenuOpen(false)}
                    className="flex min-h-12 items-center rounded-xl px-4 text-base font-semibold text-muted hover:bg-brand-light hover:text-brand"
                  >
                    My Profile
                  </Link>
                  <Link
                    href={settingsHref}
                    onClick={() => setMenuOpen(false)}
                    className="flex min-h-12 items-center rounded-xl px-4 text-base font-semibold text-muted hover:bg-brand-light hover:text-brand"
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
                      className="btn btn-ghost btn-full flex min-h-12 items-center justify-center"
                    >
                      Log In
                    </Link>
                    <Link
                      href="/signup"
                      onClick={() => setMenuOpen(false)}
                      className="btn btn-primary btn-full flex min-h-12 items-center justify-center"
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
    </>
  );
}
