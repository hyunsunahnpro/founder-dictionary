import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import SectionTitle from "@/components/SectionTitle";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import TermCard from "@/components/TermCard";
import { featuredTerms } from "@/lib/data";

export default function Home() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main>
        <section className="mx-auto flex max-w-6xl flex-col gap-12 px-6 pb-16 pt-16">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="flex flex-col gap-6">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--accent)]">
                Founder Lexicon
              </p>
              <h1 className="text-balance font-display text-5xl text-[var(--foreground)]">
                A founder-first dictionary and VC directory for the moments that matter.
              </h1>
              <p className="text-lg text-[var(--muted)]">
                Clear definitions, real-world examples, and curated VC profiles with
                transparent sources. Built for first-time founders who want confidence
                without the noise.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/dictionary"
                  className="rounded-full bg-[var(--primary)] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[rgba(15,107,95,0.25)] transition hover:bg-[var(--primary-dark)]"
                >
                  Explore the dictionary
                </Link>
                <Link
                  href="/vc"
                  className="rounded-full border border-[var(--stroke)] bg-white px-6 py-3 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--primary)]"
                >
                  Browse VC directory
                </Link>
              </div>
            </div>
            <div className="flex flex-col gap-6 rounded-3xl border border-[var(--stroke)] bg-[var(--card)] p-8 shadow-xl">
              <SectionTitle
                eyebrow="Get started"
                title="Find the right term in seconds"
                description="Search across fundraising, finance, product, and operations. Every term includes examples, context, and your founder videos."
              />
              <SearchBar placeholder="Search startup terms" />
              <div className="flex flex-wrap gap-3 text-xs font-semibold text-[var(--muted)]">
                <span className="rounded-full border border-[var(--stroke)] bg-white px-3 py-2">
                  Pre-seed
                </span>
                <span className="rounded-full border border-[var(--stroke)] bg-white px-3 py-2">
                  Cap table
                </span>
                <span className="rounded-full border border-[var(--stroke)] bg-white px-3 py-2">
                  Runway
                </span>
                <span className="rounded-full border border-[var(--stroke)] bg-white px-3 py-2">
                  Term sheet
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto flex max-w-6xl flex-col gap-10 px-6 pb-20">
          <SectionTitle
            eyebrow="Dictionary"
            title="Start with the essential founder vocabulary"
            description="Curated terms focused on the first 18 months of building. Real-life examples and founder videos keep each concept grounded."
          />
          <div className="grid gap-6 md:grid-cols-2">
            {featuredTerms.map((term) => (
              <TermCard key={term.slug} term={term} />
            ))}
          </div>
          <Link
            href="/dictionary"
            className="text-sm font-semibold text-[var(--primary)]"
          >
            View all dictionary terms &rarr;
          </Link>
        </section>

        <section className="mx-auto flex max-w-6xl flex-col gap-10 px-6 pb-24">
          <SectionTitle
            eyebrow="VC Directory"
            title="Investors curated with credible sources"
            description="Every firm profile prioritizes sources from Forbes, Crunchbase, and Dealroom, with last updated dates for transparency."
          />
          <div className="grid gap-6 lg:grid-cols-3">
            {[
              "Stage focus and check size",
              "Sectors and geography filters",
              "Public approach notes",
            ].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-[var(--stroke)] bg-white p-6 text-sm text-[var(--muted)]"
              >
                <p className="font-medium text-[var(--foreground)]">{item}</p>
                <p className="mt-3">
                  Built to help you narrow the list to the investors that truly fit your
                  stage and market.
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
