import type { VideoPlatform } from "@prisma/client";
import type { Term, RealLifeExample as Example, Source as SourceModel, VideoLink as VideoModel, RelatedTerm, TermSource } from "@prisma/client";

export type Source = {
  label: string;
  url: string;
};

export type VideoLink = {
  platform: "youtube" | "instagram";
  url: string;
  title: string;
};

export type RealLifeExample = {
  summary: string;
  url: string;
  illustrates: string;
  source: Source;
  updatedAt: string;
};

export type TermView = {
  slug: string;
  term: string;
  category: string;
  definition: string;
  example: string;
  context: string;
  relatedTerms: string[];
  sources: Source[];
  updatedAt: string;
  videos: VideoLink[];
  realLifeExample?: RealLifeExample;
};

const formatDate = (date: Date) => date.toISOString().slice(0, 10);

const platformToString = (platform: VideoPlatform): "youtube" | "instagram" =>
  platform === "YOUTUBE" ? "youtube" : "instagram";

export const mapTermToView = (
  term: Term & {
    videos: VideoModel[];
    sources: (TermSource & { source: SourceModel })[];
    exampleCase: (Example & { source: SourceModel }) | null;
    relatedFrom: (RelatedTerm & { toTerm: Term })[];
  },
): TermView => {
  return {
    slug: term.slug,
    term: term.term,
    category: term.category,
    definition: term.definition,
    example: term.example,
    context: term.context,
    relatedTerms: term.relatedFrom.map((relation) => relation.toTerm.term),
    sources: term.sources.map((link) => ({
      label: link.source.label,
      url: link.source.url,
    })),
    updatedAt: formatDate(term.updatedAt),
    videos: term.videos.map((video) => ({
      platform: platformToString(video.platform),
      url: video.url,
      title: video.title,
    })),
    realLifeExample: term.exampleCase
      ? {
          summary: term.exampleCase.summary,
          url: term.exampleCase.url,
          illustrates: term.exampleCase.illustrates,
          source: {
            label: term.exampleCase.source.label,
            url: term.exampleCase.source.url,
          },
          updatedAt: formatDate(term.exampleCase.updatedAt),
        }
      : undefined,
  };
};
