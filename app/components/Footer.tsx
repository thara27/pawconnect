"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer
      className="relative overflow-hidden text-white"
      style={{ background: "#1C1A14", padding: "4rem 2rem 2rem" }}
    >
      <div className="relative mx-auto" style={{ maxWidth: "1200px" }}>
        <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-[2fr_1fr_1fr_1fr] md:gap-12">

          {/* Col 1 - Brand */}
          <div>
            <Link href="/" className="inline-flex items-center gap-1 font-fraunces text-[1.5rem] font-black no-underline">
              <span aria-hidden="true" style={{ color: "#E8920A" }}>&#x1F43E;</span>
              <span style={{ background: "linear-gradient(135deg, #E8920A, #F9C74F)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                PawConnect
              </span>
            </Link>
            <p className="mb-6 mt-3 max-w-[240px] text-[0.85rem] leading-[1.6]" style={{ color: "rgba(255,255,255,0.45)" }}>
              India&apos;s home for dog owners. Find care, connect with community, and give your pup the best life.
            </p>
            <div className="flex gap-2">
              <a href="#" aria-label="Instagram" className="inline-flex h-[38px] w-[38px] items-center justify-center rounded-full border border-white/10 bg-white/[0.07] text-white/65 transition-all hover:border-[#E8920A]/50 hover:bg-[#E8920A]/25">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
              <a href="#" aria-label="Twitter / X" className="inline-flex h-[38px] w-[38px] items-center justify-center rounded-full border border-white/10 bg-white/[0.07] text-white/65 transition-all hover:border-[#E8920A]/50 hover:bg-[#E8920A]/25">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="#" aria-label="Facebook" className="inline-flex h-[38px] w-[38px] items-center justify-center rounded-full border border-white/10 bg-white/[0.07] text-white/65 transition-all hover:border-[#E8920A]/50 hover:bg-[#E8920A]/25">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href="#" aria-label="YouTube" className="inline-flex h-[38px] w-[38px] items-center justify-center rounded-full border border-white/10 bg-white/[0.07] text-white/65 transition-all hover:border-[#E8920A]/50 hover:bg-[#E8920A]/25">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.96-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg>
              </a>
            </div>
          </div>

          {/* Col 2 - Platform */}
          <div>
            <p className="mb-4 text-[0.7rem] font-bold uppercase tracking-[0.12em]" style={{ color: "rgba(255,255,255,0.35)" }}>PLATFORM</p>
            <ul className="m-0 flex list-none flex-col gap-[0.65rem] p-0">
              {[
                { label: "Find services",  href: "/search"    },
                { label: "Dog breeds",     href: "/breeds"    },
                { label: "Community",      href: "/community" },
                { label: "Blood donation", href: "/search"    },
                { label: "AI vet chat",    href: "#"          },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-[0.875rem] no-underline transition-colors hover:text-[#E8920A]" style={{ color: "rgba(255,255,255,0.60)" }}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 - Providers */}
          <div>
            <p className="mb-4 text-[0.7rem] font-bold uppercase tracking-[0.12em]" style={{ color: "rgba(255,255,255,0.35)" }}>FOR PROVIDERS</p>
            <ul className="m-0 flex list-none flex-col gap-[0.65rem] p-0">
              {[
                { label: "List your services", href: "/signup" },
                { label: "How it works",       href: "#"       },
                { label: "Pricing",            href: "#"       },
                { label: "Provider login",     href: "/login"  },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-[0.875rem] no-underline transition-colors hover:text-[#E8920A]" style={{ color: "rgba(255,255,255,0.60)" }}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 - Newsletter */}
          <div>
            <p className="mb-4 text-[0.7rem] font-bold uppercase tracking-[0.12em]" style={{ color: "rgba(255,255,255,0.35)" }}>STAY UPDATED</p>
            <div className="rounded-[12px] p-5" style={{ background: "rgba(232,146,10,0.10)", border: "1px solid rgba(232,146,10,0.22)" }}>
              <p className="mb-1 font-fraunces text-[0.95rem] font-bold text-white">Dog care tips, weekly</p>
              <p className="mb-4 text-[0.78rem] leading-[1.5]" style={{ color: "rgba(255,255,255,0.50)" }}>Breed tips, health reminders &amp; events</p>
              <div className="flex gap-2">
                <input
                  suppressHydrationWarning
                  type="email"
                  autoComplete="email"
                  placeholder="your@email.com"
                  className="min-w-0 flex-1 rounded-lg px-3 py-2 text-[0.8rem] text-white outline-none"
                  style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.14)" }}
                />
                <button type="button" className="rounded-lg px-3 py-2 text-[0.8rem] font-semibold text-white" style={{ background: "#E8920A", cursor: "pointer", whiteSpace: "nowrap" }}>
                  Join
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6" style={{ height: "1px", background: "rgba(255,255,255,0.08)" }} />

        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-[0.8rem]" style={{ color: "rgba(255,255,255,0.32)" }}>
            &copy; 2026 PawConnect. Made with love for dog owners in India.
          </p>
          <div className="flex flex-wrap gap-2">
            {["Secure", "Made in India", "Dog first"].map((badge) => (
              <span key={badge} className="rounded-full px-3 py-1 text-[0.72rem]" style={{ background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.55)" }}>
                {badge}
              </span>
            ))}
          </div>
          <div className="flex gap-5">
            {[
              { label: "Privacy", href: "#"        },
              { label: "Terms",   href: "#"        },
              { label: "Contact", href: "/contact" },
            ].map((link) => (
              <Link key={link.label} href={link.href} className="text-[0.8rem] no-underline transition-colors hover:text-[#E8920A]" style={{ color: "rgba(255,255,255,0.32)" }}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
