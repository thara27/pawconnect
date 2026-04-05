import Link from "next/link";

type Props = {
  emoji: string;
  title: string;
  description: string;
  cta?: {
    label: string;
    href: string;
  };
};

export default function EmptyState({ emoji, title, description, cta }: Props) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-border bg-white px-6 py-12 text-center">
      <p className="text-5xl" aria-hidden="true">{emoji}</p>
      <h2 className="mt-3 font-fraunces text-xl font-black text-ink">{title}</h2>
      <p className="mx-auto mt-1 max-w-xs text-sm text-muted">{description}</p>
      {cta && (
        <Link href={cta.href} className="btn btn-primary mt-5">
          {cta.label}
        </Link>
      )}
    </div>
  );
}
