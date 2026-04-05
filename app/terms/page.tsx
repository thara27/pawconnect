import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service · PawConnect",
  description: "The terms and conditions governing your use of PawConnect.",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="font-fraunces text-xl font-semibold text-stone-800">{title}</h2>
      <div className="space-y-3 text-[0.9rem] leading-7 text-stone-600">{children}</div>
    </section>
  );
}

function Callout({
  variant,
  children,
}: {
  variant: "info" | "warning" | "success";
  children: React.ReactNode;
}) {
  const styles = {
    info:    "border-blue-200 bg-blue-50 text-blue-800",
    warning: "border-amber-200 bg-amber-50 text-amber-800",
    success: "border-green-200 bg-green-50 text-green-700",
  };
  return (
    <p className={`rounded-xl border px-4 py-3 text-[0.9rem] font-medium leading-relaxed ${styles[variant]}`}>
      {children}
    </p>
  );
}

function Dot() {
  return <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#FF5722]" />;
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="list-none space-y-2.5 pl-1">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5">
          <Dot />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function TermsPage() {
  return (
    <main className="bg-bg px-4 py-12 sm:py-16">
      <div className="mx-auto w-full max-w-3xl space-y-10">

        {/* Header */}
        <div>
          <p className="badge badge-brand mb-3">Legal</p>
          <h1 className="font-fraunces text-4xl font-bold text-stone-900">Terms of Service</h1>
          <p className="mt-3 text-sm text-stone-500">
            Last updated: <time dateTime="2026-04-05">5 April 2026</time>
          </p>
          <p className="mt-4 text-[0.9rem] leading-7 text-stone-600">
            Welcome to PawConnect. By creating an account or using our platform, you agree
            to be bound by these Terms of Service. Please read them carefully before
            proceeding.
          </p>
        </div>

        <hr className="border-[#EDE3D4]" />

        {/* 1. Introduction */}
        <Section title="Introduction">
          <p>
            PawConnect is an online marketplace that helps pet owners across India discover
            and connect with trusted pet care professionals — groomers, trainers, veterinary
            consultants, dog walkers, boarding providers, and more.
          </p>
          <p>
            These Terms of Service govern your access to and use of PawConnect. By signing
            up or continuing to use the platform, you confirm that you have read, understood,
            and agreed to these terms. If you do not agree, please discontinue use immediately.
          </p>
        </Section>

        {/* 2. Our role */}
        <Section title="Our role as a platform">
          <Callout variant="info">
            PawConnect is a marketplace — we connect pet owners with service providers. We do
            not employ providers, deliver pet care services, or act as an agent on your behalf.
          </Callout>
          <p>
            All service arrangements, pricing, and obligations are directly between the pet
            owner and the service provider. PawConnect facilitates discovery and scheduling,
            but is not a party to any service agreement.
          </p>
          <p>
            We do our best to surface quality providers through our verification and review
            system, but we cannot guarantee the conduct, qualifications, or outputs of any
            individual listed on the platform.
          </p>
        </Section>

        {/* 3. User responsibilities */}
        <Section title="User responsibilities">
          <p>
            All users — whether pet owners or service providers — agree to the following:
          </p>
          <BulletList
            items={[
              "Provide accurate, truthful, and up-to-date information in your profile and during bookings.",
              "Use the platform respectfully. Abusive, threatening, or harassing behaviour towards other users will result in account suspension.",
              "Do not post false reviews, spam, or misleading content in the community feed.",
              "Maintain the confidentiality of your account credentials. You are responsible for all activity under your account.",
              "Comply with all applicable Indian laws and local regulations in your use of PawConnect.",
            ]}
          />
        </Section>

        {/* 4. Booking terms */}
        <Section title="Booking terms">
          <p>
            PawConnect facilitates scheduling between pet owners and providers. When you
            create a booking, you are entering a direct arrangement with the service provider.
          </p>

          {/* Panel: cancellations */}
          <div className="rounded-xl border border-[#EDE3D4] bg-[#FFFCF7] divide-y divide-[#EDE3D4]">
            {[
              {
                icon: "📅",
                title: "Cancellations",
                body:
                  "Each provider sets their own cancellation policy. Always review a provider's policy before confirming a booking. Last-minute cancellations may incur fees at the provider's discretion.",
              },
              {
                icon: "🐾",
                title: "No-shows",
                body:
                  "Not showing up for a confirmed booking without notice is considered a no-show. Repeat no-shows may result in restrictions on your account.",
              },
              {
                icon: "💳",
                title: "Payments",
                body:
                  "Payment is currently arranged directly between pet owners and service providers. PawConnect does not process payments and is not responsible for payment disputes. In-platform payments may be introduced in a future update.",
              },
            ].map(({ icon, title, body }) => (
              <div key={title} className="flex items-start gap-3 px-4 py-3.5">
                <span className="mt-0.5 text-lg">{icon}</span>
                <div>
                  <p className="text-[0.875rem] font-semibold text-stone-800">{title}</p>
                  <p className="mt-0.5 text-[0.85rem] leading-6 text-stone-500">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* 5. Provider responsibilities */}
        <Section title="Provider responsibilities">
          <p>
            Service providers listed on PawConnect agree to the following obligations:
          </p>
          <BulletList
            items={[
              "Keep your profile, service descriptions, pricing, and availability accurate at all times.",
              "Hold any licences, certifications, or permits required for your services under applicable Indian law.",
              "Respond to booking requests promptly and communicate proactively if you need to cancel or reschedule.",
              "Handle all animals in your care responsibly and with full attention to their safety and well-being.",
              "Do not misrepresent your qualifications or copy another provider's profile content.",
            ]}
          />
          <Callout variant="success">
            Providers who consistently receive strong reviews and maintain accurate profiles
            are eligible for PawConnect&apos;s Verified badge.
          </Callout>
        </Section>

        {/* 6. Limitation of liability */}
        <Section title="Limitation of liability">
          <p>
            PawConnect is provided on an &quot;as is&quot; and &quot;as available&quot; basis.
            We make no warranties — express or implied — about the reliability, accuracy, or
            fitness of the platform for any particular purpose.
          </p>
          <p>
            As an intermediary marketplace, PawConnect is not liable for:
          </p>
          <BulletList
            items={[
              "Disputes between pet owners and service providers arising from bookings.",
              "Injury, illness, loss, or death of any animal arising from a service.",
              "Financial loss resulting from cancelled, incomplete, or unsatisfactory services.",
              "Downtime, data loss, or technical errors on the platform.",
            ]}
          />
          <Callout variant="warning">
            Our total liability to you for any claim arising out of your use of PawConnect
            shall not exceed the amount, if any, paid by you to PawConnect in the six months
            preceding the claim.
          </Callout>
        </Section>

        {/* 7. Account termination */}
        <Section title="Account termination">
          <p>
            You may close your account at any time from your account settings. Upon closure,
            your profile will be removed from public view and your data will be handled in
            accordance with our{" "}
            <Link href="/privacy" className="font-medium text-[#FF5722] hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
          <p>
            PawConnect reserves the right to suspend or permanently terminate accounts that:
          </p>
          <BulletList
            items={[
              "Violate these Terms of Service or our community guidelines.",
              "Engage in fraudulent activity, impersonation, or misrepresentation.",
              "Cause harm, distress, or financial loss to other users or providers on the platform.",
              "Are found to be operating in breach of applicable Indian law.",
            ]}
          />
          <p>
            Where permitted, we will notify you of a suspension and provide an opportunity to
            respond before a permanent termination is made.
          </p>
        </Section>

        {/* 8. Changes to terms */}
        <Section title="Changes to these terms">
          <p>
            We may revise these Terms from time to time to reflect changes in the law, our
            services, or our policies. When we make material changes, we will notify you via
            email or a prominent notice on the platform.
          </p>
          <p>
            Continued use of PawConnect after the effective date of updated Terms constitutes
            your acceptance of the revised terms. If you do not agree to the updated terms,
            please stop using the platform and close your account.
          </p>
        </Section>

        <hr className="border-[#EDE3D4]" />

        {/* Contact card */}
        <div className="rounded-2xl border border-[#EDE3D4] bg-[#FFFCF7] px-6 py-6">
          <p className="mb-1 text-lg">💬</p>
          <p className="font-fraunces text-lg font-semibold text-stone-800">
            Questions about these terms?
          </p>
          <p className="mt-2 text-[0.9rem] leading-7 text-stone-600">
            We&apos;re happy to help clarify anything. Reach us via our{" "}
            <Link href="/contact" className="font-medium text-[#FF5722] hover:underline">
              contact page
            </Link>{" "}
            or email us directly at{" "}
            <a
              href="mailto:support@petcommunity.in"
              className="font-medium text-[#FF5722] hover:underline"
            >
              support@petcommunity.in
            </a>
            . We aim to respond within 2 business days.
          </p>
        </div>

      </div>
    </main>
  );
}
