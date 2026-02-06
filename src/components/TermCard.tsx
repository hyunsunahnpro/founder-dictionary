"use client";

import Link from "next/link";
import type { TermView } from "@/lib/term-view";

export default function TermCard({ term }: { term: TermView }) {
  return (
    <Link
      href={`/dictionary/${term.slug}`}
      className="flex h-full flex-col gap-4 rounded-2xl border border-[var(--stroke)] bg-[var(--card)] p-5 transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--accent)]">
            {term.category}
          </p>
          <h3 className="mt-2 font-display text-2xl text-[var(--foreground)]">
            {term.term}
          </h3>
        </div>
        <span className="rounded-full border border-[var(--stroke)] bg-white px-3 py-1 text-xs font-semibold text-[var(--muted)]">
          {term.relatedTerms.length} related
        </span>
      </div>
      <p className="text-sm text-[var(--muted)]">{term.definition}</p>
      <span className="text-xs font-semibold text-[var(--primary)]">
        View term
      </span>
    </Link>
  );
}
