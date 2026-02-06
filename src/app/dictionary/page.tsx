import DictionaryExplorer from "@/components/DictionaryExplorer";
import SectionTitle from "@/components/SectionTitle";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { terms as sampleTerms } from "@/lib/data";
import { prisma } from "@/lib/prisma";
import { mapTermToView } from "@/lib/term-view";

export default async function DictionaryPage() {
  const dbTerms = await prisma.term
    .findMany({
      include: {
        videos: true,
        sources: { include: { source: true } },
        exampleCase: { include: { source: true } },
        relatedFrom: { include: { toTerm: true } },
      },
      orderBy: { term: "asc" },
    })
    .catch(() => []);

  const viewTerms = dbTerms.length ? dbTerms.map(mapTermToView) : sampleTerms;
  const categories = Array.from(
    new Set(viewTerms.map((term) => term.category)),
  ).sort();

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-16">
        <SectionTitle
          eyebrow="Dictionary"
          title="Startup vocabulary, explained in plain language"
          description="Every term includes a founder-friendly definition, real-life example, and curated sources."
        />
        <DictionaryExplorer terms={viewTerms} categories={categories} />
      </main>
      <SiteFooter />
    </div>
  );
}
