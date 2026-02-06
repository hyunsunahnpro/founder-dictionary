import { terms as sampleTerms, type Term } from "@/lib/data";

const hasDatabase = () => Boolean(process.env.DATABASE_URL);

const normalizeSlug = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const compactSlug = (value: string) =>
  value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "");

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
    const normalizedSlug = normalizeSlug(slug);
    const compactedSlug = compactSlug(slug);
    const [{ prisma }, { mapTermToView }] = await Promise.all([
      import("@/lib/prisma"),
      import("@/lib/term-view"),
    ]);

    const dbTerm = await prisma.term
      .findUnique({
        where: { slug: normalizedSlug },
        include: {
          videos: true,
          sources: { include: { source: true } },
          exampleCase: { include: { source: true } },
          relatedFrom: { include: { toTerm: true } },
        },
      })
      .catch(() => null);

    if (dbTerm) {
      return mapTermToView(dbTerm);
    }

    const fallbackCandidates = await prisma.term
      .findMany({
        select: { slug: true, term: true },
      })
      .catch(() => []);

    const matched = fallbackCandidates.find((candidate) => {
      const normalizedCandidate = normalizeSlug(candidate.slug || candidate.term);
      const compactedCandidate = compactSlug(candidate.slug || candidate.term);
      return (
        normalizedCandidate === normalizedSlug ||
        compactedCandidate === compactedSlug
      );
    });

    if (matched?.slug) {
      const resolved = await prisma.term
        .findUnique({
          where: { slug: matched.slug },
          include: {
            videos: true,
            sources: { include: { source: true } },
            exampleCase: { include: { source: true } },
            relatedFrom: { include: { toTerm: true } },
          },
        })
        .catch(() => null);

      if (resolved) {
        return mapTermToView(resolved);
      }
    }

    return sampleTerms.find((item) => item.slug === normalizedSlug);
  } catch {
    return sampleTerms.find((item) => item.slug === normalizeSlug(slug));
  }
}
