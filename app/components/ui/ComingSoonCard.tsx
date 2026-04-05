import Link from "next/link";

type Props = {
  title?: string;
  message?: string;
  backHref?: string;
  backLabel?: string;
};

export default function ComingSoonCard({
  title = "Coming Soon",
  message = "We're working on this feature. Check back soon 🐾",
  backHref = "/",
  backLabel = "Back to home",
}: Props) {
  return (
    <div className="mx-auto max-w-sm rounded-[20px] border border-[#EDE3D4] bg-[#FFFCF7] px-8 py-10 text-center shadow-sm">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-3xl ring-1 ring-orange-100">
        🐾
      </div>
      <h2 className="font-fraunces text-xl font-bold text-stone-900">{title}</h2>
      <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-stone-500">
        {message}
      </p>
      <Link
        href={backHref}
        className="mt-6 inline-block rounded-xl bg-[#FF5722] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#E64A19]"
      >
        {backLabel}
      </Link>
    </div>
  );
}
