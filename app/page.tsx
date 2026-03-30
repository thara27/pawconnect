import Image from "next/image";
import Link from "next/link";

export default async function Home() {

  return (
    <main className="bg-bg text-ink">
      <section className="px-3 pb-10 pt-4 sm:px-4 sm:pt-5">
        <div className="relative mx-auto h-[600px] w-full max-w-7xl overflow-hidden rounded-[32px] bg-[#FFF8E7] shadow-[0_24px_80px_rgba(187,132,42,0.24)]">
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
          {/* Hero text */}
          <div className="relative z-20 flex h-full max-w-lg flex-col justify-center px-8 py-10">
            <span className="inline-flex w-fit items-center rounded-full border border-[#E7C56F] bg-white px-4 py-1.5 text-xs font-semibold text-[#8B5E00] shadow-sm">
              🐾 India&apos;s #1 Dog Community
            </span>

            <h1 className="mt-5 max-w-[520px] font-fraunces text-[2.8rem] font-black leading-[1.1] text-ink">
              Where Every <span className="italic text-brand">Paw</span> Finds Its Pack
            </h1>

            <p className="mt-3 max-w-[400px] text-[0.92rem] leading-[1.7] text-gray-700">
              Connect with dog owners, find trusted vets, book grooming and training &mdash; all in one place. Powered by AI to understand your dog&apos;s unique needs.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/search" className="btn btn-primary">
                Explore Services
              </Link>
              <Link href="/signup" className="btn btn-outline">
                Join Community
              </Link>
            </div>
          </div>

          {/* WHAT WE OFFER heading — above the white wave */}
          <div className="absolute bottom-20 left-0 right-0 z-20 text-center">
            <p className="mb-0.5 text-[0.65rem] font-bold uppercase tracking-[0.12em]" style={{ color: '#ff5722' }}>
              WHAT WE OFFER
            </p>
            <p className="font-fraunces text-[1.1rem] font-black leading-[1.2] text-ink">
              Everything your dog deserves,{' '}
              <em style={{ fontStyle: 'italic', color: '#ff5722' }}>in one place</em>
            </p>
          </div>

          {/* Bottom wave */}
          <div className="absolute bottom-0 left-0 right-0 z-30 h-16 rounded-t-[50%] bg-[#FAFAF7]" />

          {/* Stats — inside white wave */}
          <div className="absolute bottom-3 left-0 right-0 z-40 flex flex-wrap justify-center gap-x-6 gap-y-0.5 text-[0.75rem] font-semibold text-gray-600">
            <span>&#10003; 10,000+ dog owners</span>
            <span>&#10003; 500+ verified vets</span>
            <span>&#10003; Free to join</span>
          </div>
        </div>
      </section>

      {/* ── FEATURES SECTION ── */}
      <section
        id="about"
        className="relative overflow-hidden"
        style={{ padding: '3rem 2rem', background: 'linear-gradient(180deg, #FDF8F3 0%, #FFF8EE 50%, #FDF8F3 100%)' }}
      >
        <div className="mx-auto" style={{ maxWidth: '1100px' }}>

          {/* Cards */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

            {/* Card 1 — Trusted services — warm amber */}
            <article
              className="relative overflow-hidden rounded-[20px] transition-transform duration-200 hover:-translate-y-[6px]"
              style={{ background: '#FFFCF7', border: '1.5px solid #E8C97A', boxShadow: '0 4px 24px rgba(200,121,10,0.10)', padding: '2rem 1.75rem' }}
            >
              <div aria-hidden="true" className="pointer-events-none absolute right-[-2rem] top-[-2rem]" style={{ width: '140px', height: '140px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(217,119,6,0.18) 0%, transparent 70%)' }} />
              <div className="mb-5 flex h-[52px] w-[52px] items-center justify-center rounded-[14px] text-[1.5rem]" style={{ background: 'rgba(217,119,6,0.10)' }}>🩺</div>
              <p className="mb-1 text-[0.7rem] font-bold uppercase tracking-[0.1em]" style={{ color: '#C8790A' }}>SERVICES</p>
              <h3 className="mb-3 font-fraunces text-[1.35rem] font-bold leading-[1.2] text-ink">Trusted services</h3>
              <p className="mb-5 text-[0.85rem] leading-[1.6] text-muted">Find verified vets, trainers, walkers and groomers tailored to your city and your dog.</p>
              <Link href="/search" className="inline-block rounded-full text-[0.8rem] font-semibold no-underline" style={{ padding: '0.45rem 1.1rem', background: 'rgba(217,119,6,0.10)', border: '1px solid rgba(200,121,10,0.35)', color: '#B45309' }}>
                Find services →
              </Link>
            </article>

            {/* Card 2 — AI guidance — sage green */}
            <article
              className="relative overflow-hidden rounded-[20px] transition-transform duration-200 hover:-translate-y-[6px]"
              style={{ background: '#FFFCF7', border: '1.5px solid #A8D5CF', boxShadow: '0 4px 24px rgba(46,139,122,0.10)', padding: '2rem 1.75rem' }}
            >
              <div aria-hidden="true" className="pointer-events-none absolute right-[-2rem] top-[-2rem]" style={{ width: '140px', height: '140px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(46,139,122,0.15) 0%, transparent 70%)' }} />
              <div className="mb-5 flex h-[52px] w-[52px] items-center justify-center rounded-[14px] text-[1.5rem]" style={{ background: 'rgba(46,139,122,0.10)' }}>🤖</div>
              <p className="mb-1 text-[0.7rem] font-bold uppercase tracking-[0.1em]" style={{ color: '#2E8B7A' }}>AI POWERED</p>
              <h3 className="mb-3 font-fraunces text-[1.35rem] font-bold leading-[1.2] text-ink">AI guidance</h3>
              <p className="mb-5 text-[0.85rem] leading-[1.6] text-muted">Get breed-aware care tips, health reminders, and suggestions tuned for Indian weather and routines.</p>
              <span className="inline-block rounded-full text-[0.8rem] font-semibold" style={{ padding: '0.45rem 1.1rem', background: 'rgba(46,139,122,0.10)', border: '1px solid rgba(46,139,122,0.30)', color: '#2E8B7A' }}>
                Coming soon →
              </span>
            </article>

            {/* Card 3 — Community — soft purple */}
            <article
              className="relative overflow-hidden rounded-[20px] transition-transform duration-200 hover:-translate-y-[6px]"
              style={{ background: '#FFFCF7', border: '1.5px solid #C9B8E8', boxShadow: '0 4px 24px rgba(124,92,191,0.10)', padding: '2rem 1.75rem' }}
            >
              <div aria-hidden="true" className="pointer-events-none absolute right-[-2rem] top-[-2rem]" style={{ width: '140px', height: '140px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,92,191,0.14) 0%, transparent 70%)' }} />
              <div className="mb-5 flex h-[52px] w-[52px] items-center justify-center rounded-[14px] text-[1.5rem]" style={{ background: 'rgba(124,92,191,0.10)' }}>🐾</div>
              <p className="mb-1 text-[0.7rem] font-bold uppercase tracking-[0.1em]" style={{ color: '#7C5CBF' }}>COMMUNITY</p>
              <h3 className="mb-3 font-fraunces text-[1.35rem] font-bold leading-[1.2] text-ink">Real community</h3>
              <p className="mb-5 text-[0.85rem] leading-[1.6] text-muted">Meet dog lovers, discover local events, and build a support system for every walk, vet visit, and wag.</p>
              <Link href="/community" className="inline-block rounded-full text-[0.8rem] font-semibold no-underline" style={{ padding: '0.45rem 1.1rem', background: 'rgba(124,92,191,0.10)', border: '1px solid rgba(124,92,191,0.30)', color: '#7C5CBF' }}>
                Join community →
              </Link>
            </article>
          </div>

          {/* Stats strip */}
          <div
            className="mt-16 grid grid-cols-2 rounded-[16px] md:grid-cols-4"
            style={{ padding: '1.5rem 2rem', background: '#FFFCF7', border: '1.5px solid #E8C97A', boxShadow: '0 4px 20px rgba(200,121,10,0.08)' }}
          >
            {([
              { num: '40M+', label: 'Dog owners in India', color: '#C8790A' },
              { num: '500+', label: 'Verified providers',  color: '#2E8B7A' },
              { num: '200+', label: 'Breed profiles',      color: '#7C5CBF' },
              { num: 'Free', label: 'Always free to join', color: '#C8790A' },
            ] as const).map((stat, i) => (
              <div
                key={stat.label}
                className="py-2 text-center"
                style={{ borderLeft: i > 0 ? '1px solid #EDE8E0' : 'none', padding: '0.5rem 1.5rem' }}
              >
                <p className="font-fraunces text-[1.8rem] font-black leading-[1.1]" style={{ color: stat.color }}>{stat.num}</p>
                <p className="mt-1 text-[0.72rem] uppercase tracking-[0.08em] text-muted">{stat.label}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section
        className="relative overflow-hidden"
        style={{ padding: '5rem 2rem', background: '#FFF8EE' }}
      >
        <div className="mx-auto" style={{ maxWidth: '1000px' }}>

          <div className="mb-14 text-center">
            <p className="mb-3 text-[0.72rem] font-bold uppercase tracking-[0.12em]" style={{ color: '#C8790A' }}>
              Getting started
            </p>
            <h2 className="mb-4 font-fraunces text-[2.4rem] font-black leading-[1.15] text-ink">
              Up and running{' '}
              <em style={{ fontStyle: 'italic', color: '#C8790A' }}>in minutes</em>
            </h2>
            <p className="mx-auto max-w-[420px] text-[0.9rem] leading-[1.7] text-muted">
              No complicated setup. Just four simple steps to the best care for your dog.
            </p>
          </div>

          {/* Steps */}
          <div className="relative grid grid-cols-1 gap-8 md:grid-cols-4">
            {/* Connecting line (desktop only) */}
            <div
              aria-hidden="true"
              className="absolute left-0 right-0 top-[26px] hidden md:block"
              style={{ height: '2px', background: 'linear-gradient(90deg, transparent 0%, #E8C97A 15%, #E8C97A 85%, transparent 100%)', zIndex: 0 }}
            />

            {([
              { step: '01', emoji: '🐶', title: 'Create your profile', desc: 'Sign up free and tell us about your dog — breed, age, city.' },
              { step: '02', emoji: '🔍', title: 'Discover services',   desc: 'Browse verified vets, groomers, trainers and walkers near you.' },
              { step: '03', emoji: '📅', title: 'Book instantly',      desc: 'Confirm appointments in one tap — no calls, no waiting.' },
              { step: '04', emoji: '⭐', title: 'Review & grow',       desc: 'Share feedback, post in the community, help others.' },
            ] as const).map(s => (
              <div key={s.step} className="relative z-10 flex flex-col items-center text-center">
                {/* Circle */}
                <div
                  className="mb-5 flex h-[52px] w-[52px] items-center justify-center rounded-full font-fraunces text-[1rem] font-black text-white"
                  style={{ background: 'linear-gradient(135deg, #E8920A, #F9C74F)', boxShadow: '0 4px 16px rgba(200,121,10,0.30)' }}
                >
                  {s.step}
                </div>
                <p className="mb-2 text-2xl">{s.emoji}</p>
                <h3 className="mb-2 font-fraunces text-[1rem] font-bold text-ink">{s.title}</h3>
                <p className="text-[0.83rem] leading-[1.6] text-muted">{s.desc}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-14 flex justify-center">
            <Link href="/signup" className="btn btn-primary">
              Get started — it&apos;s free
            </Link>
          </div>

        </div>
      </section>

    </main>
  );
}