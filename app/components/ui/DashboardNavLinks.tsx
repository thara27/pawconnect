"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Home" },
  { href: "/dashboard/pet-owner/search", label: "Find Services" },
  { href: "/dashboard/pet-owner/bookings", label: "Bookings" },
];

export default function DashboardNavLinks() {
  const pathname = usePathname();

  return (
    <nav className="hidden items-center gap-2 lg:flex">
      {NAV_ITEMS.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
              active
                ? "bg-brand-light text-brand"
                : "text-muted hover:bg-brand-light hover:text-brand"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
