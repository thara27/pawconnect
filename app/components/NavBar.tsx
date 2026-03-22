"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/search", label: "Services" },
  { href: "/community", label: "Community" },
  { href: "/contact", label: "Contact" },
];

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

export function NavBar({ isLoggedIn }: { isLoggedIn: boolean }) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 h-[62px] border-b border-[#F0E4C5] bg-white/95 backdrop-blur">
      <nav className="mx-auto flex h-full w-full max-w-7xl items-center justify-between px-4">
        <Link href="/" className="font-sans text-xl font-bold tracking-tight text-ink">
          <span aria-hidden="true">🐾 </span>
          Paw<span className="text-amber">Connect</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map(({ href, label }) => (
            <NavLink
              key={href}
              href={href}
              label={label}
              active={pathname === href || (href !== "/" && pathname.startsWith(href))}
            />
          ))}
        </div>

        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <Link
              href="/dashboard"
              className="rounded-lg border border-amber bg-white px-4 py-2 text-sm font-semibold text-amber transition hover:bg-amber-light"
            >
              Go to Dashboard →
            </Link>
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
      </nav>
    </header>
  );
}
