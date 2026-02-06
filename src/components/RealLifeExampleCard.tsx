import type { RealLifeExample } from "@/lib/data";

export default function RealLifeExampleCard({
  example,
}: {
  example: RealLifeExample;
}) {
  const domain = new URL(example.url).hostname.replace("www.", "");

  return (
    <div className="rounded-2xl border border-[var(--stroke)] bg-[var(--card)] p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--accent)]">
        Real-life example
      </p>
      <p className="mt-4 text-base font-medium text-[var(--foreground)]">
        {example.summary}
      </p>
      <p className="mt-3 text-sm text-[var(--muted)]">{example.illustrates}</p>
      <div className="mt-6 flex flex-wrap items-center gap-3 text-xs font-semibold text-[var(--muted)]">
        <a
          href={example.url}
          target="_blank"
          rel="noreferrer"
          className="rounded-full border border-[var(--stroke)] bg-white px-3 py-2 text-[var(--primary)]"
        >
          Read source ({domain})
        </a>
        <span>Source: {example.source.label}</span>
        <span>Updated: {example.updatedAt}</span>
      </div>
    </div>
  );
}
