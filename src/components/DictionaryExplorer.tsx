"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import RealLifeExampleCard from "@/components/RealLifeExampleCard";
import VideoEmbed from "@/components/VideoEmbed";
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
  const [openSlug, setOpenSlug] = useState<string | null>(null);

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
          .map((term) => {
            const isOpen = openSlug === term.slug;

            return (
              <article
                key={term.slug}
                className="flex h-full flex-col gap-4 rounded-2xl border border-[var(--stroke)] bg-[var(--card)] p-5"
              >
                <button
                  type="button"
                  className="flex w-full items-start justify-between gap-4 text-left"
                  onClick={() => setOpenSlug(isOpen ? null : term.slug)}
                  aria-expanded={isOpen}
                  aria-controls={`term-${term.slug}`}
                >
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--accent)]">
                      {term.category}
                    </p>
                    <h3 className="mt-2 font-display text-2xl text-[var(--foreground)]">
                      {term.term}
                    </h3>
                  </div>
                  <span className="rounded-full border border-[var(--stroke)] bg-white px-3 py-1 text-xs font-semibold text-[var(--muted)]">
                    {isOpen ? "Hide" : "View"} details
                  </span>
                </button>

                <p className="text-sm text-[var(--muted)]">{term.definition}</p>

                {isOpen ? (
                  <div
                    id={`term-${term.slug}`}
                    className="flex flex-col gap-6 rounded-2xl border border-[var(--stroke)] bg-white p-5 text-sm text-[var(--muted)]"
                  >
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--accent)]">
                        Example
                      </p>
                      <p className="mt-2 text-base text-[var(--foreground)]">
                        {term.example}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--accent)]">
                        When you will see this
                      </p>
                      <p className="mt-2 text-base text-[var(--foreground)]">
                        {term.context}
                      </p>
                    </div>

                    {term.relatedTerms.length ? (
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--accent)]">
                          Related terms
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {term.relatedTerms.map((related) => (
                            <span
                              key={related}
                              className="rounded-full border border-[var(--stroke)] bg-[var(--card)] px-3 py-1 text-xs font-semibold text-[var(--muted)]"
                            >
                              {related}
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : null}

                    {term.realLifeExample ? (
                      <RealLifeExampleCard example={term.realLifeExample} />
                    ) : null}

                    {term.videos.length ? (
                      <div className="grid gap-4 md:grid-cols-2">
                        {term.videos.map((video) => (
                          <VideoEmbed key={video.url} video={video} />
                        ))}
                      </div>
                    ) : null}

                    {term.sources.length ? (
                      <div className="flex flex-col gap-2">
                        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--accent)]">
                          Sources
                        </p>
                        {term.sources.map((source) => (
                          <a
                            key={source.url}
                            href={source.url}
                            target="_blank"
                            rel="noreferrer"
                            className="flex flex-wrap items-center gap-2 rounded-2xl border border-[var(--stroke)] bg-[var(--card)] px-4 py-3 text-sm text-[var(--foreground)]"
                          >
                            <span className="font-semibold">{source.label}</span>
                            <span className="text-xs text-[var(--muted)]">
                              {source.url}
                            </span>
                          </a>
                        ))}
                      </div>
                    ) : null}

                    <Link
                      href={`/dictionary/${term.slug}`}
                      className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--primary)]"
                    >
                      Open dedicated page
                    </Link>
                  </div>
                ) : null}
              </article>
            );
          })}
      </div>
    </div>
  );
}
