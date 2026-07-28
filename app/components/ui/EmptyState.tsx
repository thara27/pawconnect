import Link from "next/link";

type Props = {
  emoji?: string;
  title: string;
  description: string;
  /** Link-based CTA — navigates to a route */
  cta?: {
    label: string;
    href: string;
  };
  /** Callback-based CTA — fires an action in the same page */
  actionLabel?: string;
  onAction?: () => void;
};

export default function EmptyState({ emoji = "🐾", title, description, cta, actionLabel, onAction }: Props) {
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
      {actionLabel && onAction && (
        <button type="button" onClick={onAction} className="btn btn-primary mt-5">
          {actionLabel}
        </button>
      )}
    </div>
  );
}
