import Image from "next/image";
import Link from "next/link";

export default async function Home() {

  return (
    <main className="min-h-screen bg-[#FAFAF7] text-[#1A1A0E]">
      <section className="px-3 pb-10 pt-4 sm:px-4 sm:pt-5">
        <div className="relative mx-auto h-[560px] w-full max-w-7xl overflow-hidden rounded-[32px] bg-[#FFF8E7] shadow-[0_24px_80px_rgba(187,132,42,0.24)]">
          {/* Full-width background image — warm gold behind transparent areas */}
          <div className="absolute inset-0 z-0 bg-[#FFF0C0]">
            <Image
              src="/images/dogbg.png"
              alt="Dogs playing in park"
              fill
              className="object-cover object-center"
              priority
            />
          </div>

          {/* Gradient overlays: warm cream on left + amber glow on right */}
          <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#FFF8E7]/95 via-[#FFF8E7]/65 via-40% to-transparent" />
          <div className="absolute inset-0 z-10 bg-gradient-to-l from-[#FFE082]/25 to-transparent" />

          {/* Hero text */}
          <div className="relative z-20 flex h-full max-w-lg flex-col justify-center px-8 py-10">
            <span className="inline-flex w-fit items-center rounded-full border border-[#E7C56F] bg-white px-4 py-1.5 text-xs font-semibold text-[#8B5E00] shadow-sm">
              🐾 India&apos;s #1 Dog Community
            </span>

            <h1 className="mt-5 max-w-[520px] font-fraunces text-[2.8rem] font-black leading-[1.1] text-gray-900">
              Where Every <span className="italic text-amber">Paw</span> Finds Its Pack
            </h1>

            <p className="mt-3 max-w-[400px] text-[0.92rem] leading-[1.7] text-gray-700">
              Connect with dog owners, find trusted vets, book grooming and training &mdash; all in one place. Powered by AI to understand your dog&apos;s unique needs.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/search"
                className="rounded-lg bg-[linear-gradient(180deg,#F6C14D_0%,#E8920A_100%)] px-5 py-2.5 text-sm font-bold text-white shadow-[0_4px_14px_rgba(232,146,10,0.4)] transition hover:brightness-105"
              >
                Explore Services
              </Link>
              <Link
                href="/signup"
                className="rounded-lg border border-[#3D3A2E] bg-white px-5 py-2.5 text-sm font-bold text-[#1A1A0E] transition hover:border-amber hover:text-amber"
              >
                Join Community
              </Link>
            </div>

            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[0.78rem] font-semibold text-gray-600">
              <span>&#10003; 10,000+ dog owners</span>
              <span>&#10003; 500+ verified vets</span>
              <span>&#10003; Free to join</span>
            </div>
          </div>

          {/* Bottom wave */}
          <div className="absolute bottom-0 left-0 right-0 z-30 h-12 rounded-t-[50%] bg-[#FAFAF7]" />
        </div>
      </section>

      <section id="about" className="mx-auto grid w-full max-w-7xl gap-5 px-4 py-4 md:grid-cols-3">
        <article className="rounded-3xl border border-[#EFE6CF] bg-white p-6 shadow-sm">
          <p className="text-2xl">🩺</p>
          <h2 className="mt-3 font-fraunces text-2xl font-bold text-[#1A1A0E]">Trusted services</h2>
          <p className="mt-2 text-sm leading-7 text-[#5A5542]">Find verified vets, trainers, walkers and groomers tailored to your city and your dog.</p>
        </article>
        <article className="rounded-3xl border border-[#EFE6CF] bg-white p-6 shadow-sm">
          <p className="text-2xl">🤖</p>
          <h2 className="mt-3 font-fraunces text-2xl font-bold text-[#1A1A0E]">AI guidance</h2>
          <p className="mt-2 text-sm leading-7 text-[#5A5542]">Get breed-aware care tips, health reminders, and suggestions tuned for Indian weather and routines.</p>
        </article>
        <article className="rounded-3xl border border-[#EFE6CF] bg-white p-6 shadow-sm">
          <p className="text-2xl">👥</p>
          <h2 className="mt-3 font-fraunces text-2xl font-bold text-[#1A1A0E]">Real community</h2>
          <p className="mt-2 text-sm leading-7 text-[#5A5542]">Meet dog lovers, discover local events, and build a support system for every walk, vet visit, and wag.</p>
        </article>
      </section>

      <footer className="mt-16 border-t border-[#EFE6CF] bg-white py-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <Link href="/" className="inline-block font-sans text-lg font-bold tracking-tight text-ink">
                <span aria-hidden="true">🐾 </span>
                Paw<span className="text-amber">Connect</span>
              </Link>
              <p className="mt-2 text-sm text-[#5A5542]">India&apos;s #1 dog community platform</p>
            </div>
            <div>
              <h3 className="font-fraunces font-bold text-[#1A1A0E]">Quick Links</h3>
              <ul className="mt-3 space-y-2 text-sm">
                <li><Link href="/search" className="text-[#5A5542] hover:text-amber">Services</Link></li>
                <li><Link href="/community" className="text-[#5A5542] hover:text-amber">Community</Link></li>
                <li><Link href="/contact" className="text-[#5A5542] hover:text-amber">Contact Us</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-fraunces font-bold text-[#1A1A0E]">Get Started</h3>
              <div className="mt-3 flex gap-2">
                <Link
                  href="/signup"
                  className="rounded-lg bg-amber px-4 py-2 text-sm font-semibold text-white hover:brightness-95"
                >
                  Join Now
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-[#EFE6CF] pt-6 text-center text-sm text-[#5A5542]">
            <p>&copy; 2024 PawConnect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}