"use client";

import { useMemo, useState } from "react";
import TermCard from "@/components/TermCard";
import type { TermView } from "@/lib/term-view";

export default function DictionaryExplorer({
  terms,
  categories,
}: {
  terms: TermView[];
  categories: string[];
}) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const filteredTerms = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return terms.filter((term) => {
      const matchesCategory =
        activeCategory === "All" || term.category === activeCategory;
      const matchesQuery =
        !normalized ||
        term.term.toLowerCase().includes(normalized) ||
        term.definition.toLowerCase().includes(normalized) ||
        term.context.toLowerCase().includes(normalized);

      return matchesCategory && matchesQuery;
    });
  }, [query, activeCategory]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <div className="flex w-full max-w-2xl items-center gap-3 rounded-full border border-[var(--stroke)] bg-white px-4 py-3 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--muted)]">
            Search
          </span>
          <input
            className="w-full bg-transparent text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none"
            placeholder="Search 200+ terms"
            aria-label="Search terms"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <button
            className="rounded-full bg-[var(--primary)] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-[var(--primary-dark)]"
            type="button"
            onClick={() => setQuery("")}
          >
            Clear
          </button>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition ${
              activeCategory === "All"
                ? "border-[var(--primary)] text-[var(--primary)]"
                : "border-[var(--stroke)] bg-white text-[var(--muted)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
            }`}
            type="button"
            onClick={() => setActiveCategory("All")}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition ${
                activeCategory === category
                  ? "border-[var(--primary)] text-[var(--primary)]"
                  : "border-[var(--stroke)] bg-white text-[var(--muted)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
              }`}
              type="button"
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-[var(--muted)]">
        <span>{filteredTerms.length} terms</span>
        <span>Sorted alphabetically</span>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {filteredTerms
          .slice()
          .sort((a, b) => a.term.localeCompare(b.term))
          .map((term) => (
            <TermCard key={term.slug} term={term} />
          ))}
      </div>
    </div>
  );
}
