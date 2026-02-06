import { terms as sampleTerms, type Term } from "@/lib/data";

const hasDatabase = () => Boolean(process.env.DATABASE_URL);

export async function getAllTerms(): Promise<Term[]> {
  if (!hasDatabase()) {
    return sampleTerms;
  }

  try {
    const [{ prisma }, { mapTermToView }] = await Promise.all([
      import("@/lib/prisma"),
      import("@/lib/term-view"),
    ]);

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

    return dbTerms.length ? dbTerms.map(mapTermToView) : sampleTerms;
  } catch {
    return sampleTerms;
  }
}

export async function getTermBySlug(slug: string): Promise<Term | undefined> {
  if (!hasDatabase()) {
    return sampleTerms.find((item) => item.slug === slug);
  }

  try {
    const [{ prisma }, { mapTermToView }] = await Promise.all([
      import("@/lib/prisma"),
      import("@/lib/term-view"),
    ]);

    const dbTerm = await prisma.term
      .findUnique({
        where: { slug },
        include: {
          videos: true,
          sources: { include: { source: true } },
          exampleCase: { include: { source: true } },
          relatedFrom: { include: { toTerm: true } },
        },
      })
      .catch(() => null);

    return dbTerm
      ? mapTermToView(dbTerm)
      : sampleTerms.find((item) => item.slug === slug);
  } catch {
    return sampleTerms.find((item) => item.slug === slug);
  }
}
