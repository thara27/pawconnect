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
    <section className="card">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div
            aria-hidden="true"
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-brand text-xl text-white"
          >
            🐾
          </div>
          <p className="text-sm leading-relaxed text-muted">{message}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link href="/signup" className="btn btn-primary btn-sm">
            {ctaText}
          </Link>
          <Link href="/login" className="btn btn-ghost btn-sm">
            Login
          </Link>
        </div>
      </div>
    </section>
  );
}
