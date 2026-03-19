import Link from "next/link";

type SignupNudgeProps = {
  message: string;
  ctaText?: string;
};

export default function SignupNudge({
  message,
  ctaText = "Join Free",
}: SignupNudgeProps) {
  return (
    <section className="rounded-2xl border border-orange-200 bg-orange-50 p-5 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div
            aria-hidden="true"
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#E8602C] text-xl text-white"
          >
            🐾
          </div>
          <p className="text-sm leading-relaxed text-slate-700">{message}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href="/signup"
            className="inline-flex items-center justify-center rounded-lg bg-[#E8602C] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#cf5222]"
          >
            {ctaText}
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Login
          </Link>
        </div>
      </div>
    </section>
  );
}
