import { ReactNode } from "react";

export default function SectionTitle({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3">
      {eyebrow ? (
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--accent)]">
          {eyebrow}
        </span>
      ) : null}
      <h2 className="text-balance font-display text-3xl text-[var(--foreground)]">
        {title}
      </h2>
      {description ? (
        <p className="max-w-2xl text-base text-[var(--muted)]">{description}</p>
      ) : null}
    </div>
  );
}
