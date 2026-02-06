"use client";

import { useMemo, useState } from "react";
import { vcFirms } from "@/lib/data";

const unique = (values: string[]) => Array.from(new Set(values)).sort();

const stageOptions = unique(vcFirms.flatMap((firm) => firm.stages));
const sectorOptions = unique(vcFirms.flatMap((firm) => firm.sectors));
const geographyOptions = unique(vcFirms.flatMap((firm) => firm.geographies));

export default function VcDirectoryExplorer() {
  const [query, setQuery] = useState("");
  const [stages, setStages] = useState<string[]>([]);
  const [sectors, setSectors] = useState<string[]>([]);
  const [geographies, setGeographies] = useState<string[]>([]);

  const toggle = (
    value: string,
    current: string[],
    setter: (next: string[]) => void,
  ) => {
    setter(
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value],
    );
  };

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return vcFirms.filter((firm) => {
      const matchesQuery =
        !normalized ||
        firm.name.toLowerCase().includes(normalized) ||
        firm.description.toLowerCase().includes(normalized);
      const matchesStages =
        stages.length === 0 || stages.some((stage) => firm.stages.includes(stage));
      const matchesSectors =
        sectors.length === 0 || sectors.some((sector) => firm.sectors.includes(sector));
      const matchesGeos =
        geographies.length === 0 ||
        geographies.some((geo) => firm.geographies.includes(geo));

      return matchesQuery && matchesStages && matchesSectors && matchesGeos;
    });
  }, [query, stages, sectors, geographies]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-5 rounded-3xl border border-[var(--stroke)] bg-white p-6">
        <div className="flex w-full items-center gap-3 rounded-full border border-[var(--stroke)] bg-[var(--card)] px-4 py-3">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--muted)]">
            Search
          </span>
          <input
            className="w-full bg-transparent text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none"
            placeholder="Search by firm name or focus"
            aria-label="Search VC firms"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <button
            className="rounded-full bg-[var(--primary)] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-[var(--primary-dark)]"
            type="button"
            onClick={() => {
              setQuery("");
              setStages([]);
              setSectors([]);
              setGeographies([]);
            }}
          >
            Reset
          </button>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <FilterGroup
            label="Stage"
            options={stageOptions}
            selected={stages}
            onToggle={(value) => toggle(value, stages, setStages)}
          />
          <FilterGroup
            label="Sector"
            options={sectorOptions}
            selected={sectors}
            onToggle={(value) => toggle(value, sectors, setSectors)}
          />
          <FilterGroup
            label="Geography"
            options={geographyOptions}
            selected={geographies}
            onToggle={(value) => toggle(value, geographies, setGeographies)}
          />
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-[var(--muted)]">
        <span>{filtered.length} firms</span>
        <span>Filtered by credible sources</span>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {filtered.map((firm) => (
          <div
            key={firm.slug}
            className="flex flex-col gap-4 rounded-2xl border border-[var(--stroke)] bg-[var(--card)] p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--accent)]">
                  {firm.stages.join(" / ")}
                </p>
                <h3 className="mt-2 font-display text-2xl text-[var(--foreground)]">
                  {firm.name}
                </h3>
              </div>
              <span
                className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                  firm.topTierSourcesAvailable
                    ? "border-[var(--primary)] text-[var(--primary)]"
                    : "border-[var(--stroke)] text-[var(--muted)]"
                }`}
              >
                {firm.topTierSourcesAvailable
                  ? "Top-tier sources"
                  : "Sources pending"}
              </span>
            </div>
            <p className="text-sm text-[var(--muted)]">{firm.description}</p>
            <div className="flex flex-wrap gap-2 text-xs font-semibold text-[var(--muted)]">
              {firm.sectors.map((sector) => (
                <span
                  key={sector}
                  className="rounded-full border border-[var(--stroke)] bg-white px-3 py-1"
                >
                  {sector}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--muted)]">
              <span>Check size: {firm.checkSize}</span>
              <span>Geo: {firm.geographies.join(", ")}</span>
              <span>Updated: {firm.updatedAt}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FilterGroup({
  label,
  options,
  selected,
  onToggle,
}: {
  label: string;
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            className={`rounded-full border px-3 py-2 text-xs font-semibold transition ${
              selected.includes(option)
                ? "border-[var(--primary)] text-[var(--primary)]"
                : "border-[var(--stroke)] bg-white text-[var(--muted)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
            }`}
            onClick={() => onToggle(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
