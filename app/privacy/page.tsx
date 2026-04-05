import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy · PawConnect",
  description: "How PawConnect collects, uses, and protects your personal information.",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="font-fraunces text-xl font-semibold text-stone-800">{title}</h2>
      <div className="space-y-3 text-[0.9rem] leading-7 text-stone-600">{children}</div>
    </section>
  );
}

function Strong({ children }: { children: React.ReactNode }) {
  return <strong className="font-semibold text-stone-800">{children}</strong>;
}

export default function PrivacyPage() {
  return (
    <main className="bg-bg px-4 py-12 sm:py-16">
      <div className="mx-auto w-full max-w-3xl">

        {/* Page header */}
        <div className="mb-10 border-b border-[#EBEBEB] pb-8">
          <p className="badge badge-brand mb-4">Legal</p>
          <h1 className="font-fraunces text-4xl font-bold leading-tight text-stone-900">
            Privacy Policy
          </h1>
          <p className="mt-3 text-sm text-stone-400">
            Last updated: <time dateTime="2026-04-05">5 April 2026</time>
          </p>
          <p className="mt-5 text-[0.9rem] leading-7 text-stone-600">
            At PawConnect, your privacy matters as much as your pet does. This policy
            explains in plain language what information we collect, why we collect it, and
            how you stay in control. We&apos;ll never sell your data — full stop.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-10">

          <Section title="What information we collect">
            <p>
              We collect only what&apos;s needed to give you a great experience. Here&apos;s
              a straightforward breakdown:
            </p>

            <div className="space-y-4 rounded-2xl border border-[#EBEBEB] bg-white p-5">
              <div className="flex gap-3">
                <span className="mt-0.5 text-lg">👤</span>
                <div>
                  <p className="font-semibold text-stone-800">Account information</p>
                  <p className="mt-0.5">
                    Your name and email address when you sign up. If you use Google to log
                    in, we receive your name and email from Google — nothing else.
                  </p>
                </div>
              </div>
              <hr className="border-[#EBEBEB]" />
              <div className="flex gap-3">
                <span className="mt-0.5 text-lg">🐕</span>
                <div>
                  <p className="font-semibold text-stone-800">Pet details</p>
                  <p className="mt-0.5">
                    Information you add about your pets — name, breed, age, weight, medical
                    notes, and photos. This helps providers give your dog the right care.
                  </p>
                </div>
              </div>
              <hr className="border-[#EBEBEB]" />
              <div className="flex gap-3">
                <span className="mt-0.5 text-lg">📅</span>
                <div>
                  <p className="font-semibold text-stone-800">Booking information</p>
                  <p className="mt-0.5">
                    Service dates, times, provider details, and any notes you add when
                    booking. This is needed to confirm and manage your appointments.
                  </p>
                </div>
              </div>
              <hr className="border-[#EBEBEB]" />
              <div className="flex gap-3">
                <span className="mt-0.5 text-lg">📊</span>
                <div>
                  <p className="font-semibold text-stone-800">Usage data</p>
                  <p className="mt-0.5">
                    Pages you visit, features you use, and basic device and browser details.
                    This helps us understand what&apos;s working and what to improve.
                  </p>
                </div>
              </div>
            </div>
          </Section>

          <Section title="How we use your information">
            <p>Your data is used to run and improve PawConnect — nothing shady, nothing hidden.</p>
            <ul className="list-none space-y-2.5 pl-1">
              {[
                "Create and manage your account securely",
                "Match you with pet care providers in your city",
                "Confirm and manage your bookings",
                "Send you booking notifications and service updates",
                "Show community posts, tips, and reviews",
                "Send our newsletter — only if you subscribed",
                "Understand how people use PawConnect so we can keep making it better",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#FF5722]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 font-medium text-green-700">
              We will never sell, rent, or trade your personal information. That&apos;s a promise.
            </p>
          </Section>

          <Section title="Who we share data with">
            <p>
              We share your information only when necessary to provide the service:
            </p>
            <div className="space-y-3">
              <div className="rounded-xl border border-[#EBEBEB] bg-white px-4 py-3">
                <p><Strong>Service providers you book with:</Strong> They receive your name,
                city, and your pet&apos;s relevant details so they can prepare for your appointment.</p>
              </div>
              <div className="rounded-xl border border-[#EBEBEB] bg-white px-4 py-3">
                <p><Strong>Infrastructure partners:</Strong> We use Supabase to store your data
                securely. They act as a data processor under strict agreements and cannot use
                your data for their own purposes.</p>
              </div>
              <div className="rounded-xl border border-[#EBEBEB] bg-white px-4 py-3">
                <p><Strong>Legal obligations:</Strong> We may share information when required
                by Indian law or to protect the safety of our users — and only to the extent
                legally required.</p>
              </div>
            </div>
          </Section>

          <Section title="Data storage and security">
            <p>
              Your data is stored on secure servers via Supabase. All data transferred between
              your browser and our servers is encrypted using TLS. We use row-level security
              and access controls so each user can only see their own data.
            </p>
            <p>
              Profile photos are stored in secure cloud storage. Service provider profile
              photos are publicly accessible (that&apos;s how search works), while your personal
              photos and pet photos are visible only to you.
            </p>
            <p>
              No system is 100% bulletproof, but we take security seriously and follow
              industry best practices to keep your data safe.
            </p>
          </Section>

          <Section title="Your rights">
            <p>You are always in control of your data. You have the right to:</p>
            <ul className="list-none space-y-2.5 pl-1">
              {[
                "View and update your profile information from your dashboard",
                "Update or delete your pet profiles at any time",
                "Delete your account and all associated data by writing to us",
                "Unsubscribe from our newsletter with one click",
                "Ask us for a copy of the data we hold about you",
              ].map((right) => (
                <li key={right} className="flex items-start gap-2.5">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#FF5722]" />
                  <span>{right}</span>
                </li>
              ))}
            </ul>
            <p>
              To exercise any of these rights, email us at{" "}
              <a
                href="mailto:support@petcommunity.in"
                  className="font-medium text-[#FF5722] hover:underline"
                >
                  support@petcommunity.in
              </a>{" "}
              and we&apos;ll respond within 7 working days.
            </p>
          </Section>

          <Section title="Cookies">
            <p>
              PawConnect uses cookies to keep you logged in between sessions. We do not use
              advertising cookies or track you across other websites.
            </p>
            <p>
              You can disable cookies in your browser settings. If you do, you&apos;ll need to
              log in again each time you visit and some features may not work as expected.
            </p>
          </Section>

          <Section title="Children's privacy">
            <p>
              PawConnect is designed for adults. We do not knowingly collect personal
              information from anyone under 13. If you believe a child has signed up, please
              contact us and we will promptly delete the account.
            </p>
          </Section>

          <Section title="Changes to this policy">
            <p>
              If we make significant changes to this policy, we&apos;ll notify you by email or
              by displaying a notice on PawConnect before the changes take effect. The updated
              date at the top of this page will always reflect the latest revision.
            </p>
          </Section>

          {/* Contact card */}
          <div className="rounded-2xl border border-[#EDE3D4] bg-[#FFFCF7] px-6 py-7">
            <div className="flex items-center gap-3">
              <span className="text-2xl">💬</span>
              <h2 className="font-fraunces text-lg font-semibold text-stone-800">
                Still have questions?
              </h2>
            </div>
            <p className="mt-2 text-[0.9rem] leading-relaxed text-stone-600">
              We&apos;re happy to help. Reach out via our{" "}
              <Link href="/contact" className="font-medium text-[#FF5722] hover:underline">
                contact page
              </Link>{" "}
              or write to us directly at{" "}
              <a
                href="mailto:support@petcommunity.in"
                className="font-medium text-[#FF5722] hover:underline"
              >
                support@petcommunity.in
              </a>
              .
            </p>
          </div>

        </div>
      </div>
    </main>
  );
}
