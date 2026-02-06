import Link from "next/link";
import { notFound } from "next/navigation";
import RealLifeExampleCard from "@/components/RealLifeExampleCard";
import SectionTitle from "@/components/SectionTitle";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import VideoEmbed from "@/components/VideoEmbed";
import { terms as sampleTerms } from "@/lib/data";
import { prisma } from "@/lib/prisma";
import { mapTermToView } from "@/lib/term-view";

export default async function TermDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const dbTerm = await prisma.term
    .findUnique({
      where: { slug: params.slug },
      include: {
        videos: true,
        sources: { include: { source: true } },
        exampleCase: { include: { source: true } },
        relatedFrom: { include: { toTerm: true } },
      },
    })
    .catch(() => null);

  const term = dbTerm
    ? mapTermToView(dbTerm)
    : sampleTerms.find((item) => item.slug === params.slug);

  if (!term) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-16">
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-[var(--accent)]">
            <span>{term.category}</span>
            <span className="text-[var(--muted)]">Updated {term.updatedAt}</span>
          </div>
          <h1 className="text-balance font-display text-5xl text-[var(--foreground)]">
            {term.term}
          </h1>
          <p className="max-w-3xl text-lg text-[var(--muted)]">
            {term.definition}
          </p>
        </div>

        <section className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
          <div className="flex flex-col gap-6 rounded-3xl border border-[var(--stroke)] bg-[var(--card)] p-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--accent)]">
                Example
              </p>
              <p className="mt-3 text-base text-[var(--foreground)]">{term.example}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--accent)]">
                When you will see this
              </p>
              <p className="mt-3 text-base text-[var(--foreground)]">{term.context}</p>
            </div>
          </div>
          <div className="flex flex-col gap-4 rounded-3xl border border-[var(--stroke)] bg-white p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--accent)]">
              Related terms
            </p>
            <div className="flex flex-wrap gap-3">
              {term.relatedTerms.map((related) => (
                <span
                  key={related}
                  className="rounded-full border border-[var(--stroke)] bg-[var(--card)] px-4 py-2 text-xs font-semibold text-[var(--muted)]"
                >
                  {related}
                </span>
              ))}
            </div>
            <Link
              href="/dictionary"
              className="mt-auto text-sm font-semibold text-[var(--primary)]"
            >
              Back to dictionary
            </Link>
          </div>
        </section>

        {term.realLifeExample ? (
          <section className="flex flex-col gap-6">
            <SectionTitle
              eyebrow="In the wild"
              title="Real-life example"
              description="Concrete moments that show how this term plays out for founders."
            />
            <RealLifeExampleCard example={term.realLifeExample} />
          </section>
        ) : null}

        {term.videos.length ? (
          <section className="flex flex-col gap-6">
            <SectionTitle
              eyebrow="Founder explains"
              title="Your video walkthroughs"
              description="Short clips from you that make the concept stick."
            />
            <div className="grid gap-6 md:grid-cols-2">
              {term.videos.map((video) => (
                <VideoEmbed key={video.url} video={video} />
              ))}
            </div>
          </section>
        ) : null}

        <section className="flex flex-col gap-6 rounded-3xl border border-[var(--stroke)] bg-white p-8">
          <SectionTitle
            eyebrow="Sources"
            title="Where this definition comes from"
            description="We cite the most credible sources available and keep everything updated."
          />
          <div className="flex flex-col gap-3 text-sm text-[var(--muted)]">
            {term.sources.map((source) => (
              <a
                key={source.url}
                href={source.url}
                target="_blank"
                rel="noreferrer"
                className="flex flex-wrap items-center gap-2 rounded-2xl border border-[var(--stroke)] bg-[var(--card)] px-4 py-3 text-[var(--foreground)]"
              >
                <span className="font-semibold">{source.label}</span>
                <span className="text-xs text-[var(--muted)]">{source.url}</span>
              </a>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
