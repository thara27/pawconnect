"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function GlobalHomeLink() {
  const pathname = usePathname();

  if (pathname === "/") {
    return null;
  }

  return (
    <Link
      href="/"
      className="fixed left-4 top-4 z-50 inline-flex items-center gap-1 rounded-full border border-orange-200 bg-white/95 px-3 py-1.5 text-xs font-semibold text-[#E8602C] shadow-sm backdrop-blur transition hover:bg-orange-50"
      aria-label="Go to main page"
    >
      <span aria-hidden="true">←</span>
      Main Page
    </Link>
  );
}
