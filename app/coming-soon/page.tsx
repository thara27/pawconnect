import Link from "next/link";

export default function ComingSoonPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#FAFAF7] px-4 text-center">
      <div className="max-w-md">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-4xl mx-auto">
          🩸
        </div>
        <h1 className="font-fraunces text-3xl font-bold text-ink">Coming Soon</h1>
        <p className="mt-3 text-lg text-muted">This feature is coming soon 🐾</p>
        <p className="mt-2 text-sm text-muted">
          We&apos;re building the blood donation network for pets in India. Stay tuned!
        </p>
        <Link href="/" className="btn btn-primary mt-8 rounded-full px-8">
          Back to home
        </Link>
      </div>
    </main>
  );
}
