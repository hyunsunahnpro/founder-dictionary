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

export type Term = {
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

export const categories = [
  "Fundraising",
  "Finance",
  "Product",
  "Operations",
  "Legal",
];

export const terms: Term[] = [
  {
    slug: "pre-seed",
    term: "Pre-seed",
    category: "Fundraising",
    definition:
      "The earliest fundraising stage, when a team is proving the problem, early product direction, and founder-market fit.",
    example:
      "A founder raises $300k from angels to build a prototype and validate demand.",
    context:
      "You will hear this when founders are raising their very first outside capital.",
    relatedTerms: ["angel", "seed", "runway"],
    sources: [
      {
        label: "Y Combinator - Fundraising Stages",
        url: "https://www.ycombinator.com/library",
      },
      {
        label: "First Round - Funding Stages",
        url: "https://firstround.com/review/",
      },
    ],
    updatedAt: "2026-02-05",
    videos: [
      {
        platform: "youtube",
        url: "https://www.youtube.com/watch?v=Q8Q8qzJtR0k",
        title: "Pre-seed explained in 3 minutes",
      },
      {
        platform: "instagram",
        url: "https://www.instagram.com/reel/C3rZb3rM2xB/",
        title: "The pre-seed checklist",
      },
    ],
    realLifeExample: {
      summary:
        "A pre-seed AI startup raised a small angel round to build an MVP and land its first design partners.",
      url: "https://www.ycombinator.com/companies",
      illustrates: "How early angel capital helps founders validate demand quickly.",
      source: {
        label: "Y Combinator Companies",
        url: "https://www.ycombinator.com/companies",
      },
      updatedAt: "2026-02-05",
    },
  },
  {
    slug: "cap-table",
    term: "Cap table",
    category: "Finance",
    definition:
      "A table that shows who owns how much of the company, including founders, employees, and investors.",
    example:
      "After a seed round, the cap table shows founders at 60%, investors at 30%, and employee options at 10%.",
    context:
      "You will update this after funding rounds, option grants, or equity transfers.",
    relatedTerms: ["dilution", "option pool", "preferred shares"],
    sources: [
      {
        label: "Carta - Cap Table Basics",
        url: "https://carta.com/learn/startups/cap-table/",
      },
    ],
    updatedAt: "2026-02-05",
    videos: [
      {
        platform: "youtube",
        url: "https://www.youtube.com/watch?v=2YbKXy3z0l4",
        title: "Cap tables without the jargon",
      },
    ],
  },
  {
    slug: "runway",
    term: "Runway",
    category: "Finance",
    definition:
      "How many months your startup can operate before it runs out of cash.",
    example:
      "If you spend $50k per month and have $300k in the bank, your runway is 6 months.",
    context:
      "Investors ask this to understand urgency and fundraising timing.",
    relatedTerms: ["burn", "cash flow", "bridge round"],
    sources: [
      {
        label: "Sequoia - Startup Finance Basics",
        url: "https://www.sequoiacap.com/article/",
      },
    ],
    updatedAt: "2026-02-05",
    videos: [],
  },
];

export const featuredTerms = terms.slice(0, 2);

export type VcFirm = {
  slug: string;
  name: string;
  description: string;
  stages: string[];
  sectors: string[];
  geographies: string[];
  checkSize: string;
  topTierSourcesAvailable: boolean;
  updatedAt: string;
  sources: Source[];
};

export const vcFirms: VcFirm[] = [
  {
    slug: "north-fjord-capital",
    name: "North Fjord Capital",
    description:
      "Early-stage firm backing product-led SaaS and developer tools with a hands-on platform team.",
    stages: ["Pre-seed", "Seed"],
    sectors: ["SaaS", "Developer Tools"],
    geographies: ["North America", "Europe"],
    checkSize: "$250k - $1.5M",
    topTierSourcesAvailable: true,
    updatedAt: "2026-02-05",
    sources: [
      {
        label: "Forbes - VC Profiles",
        url: "https://www.forbes.com/",
      },
      {
        label: "Crunchbase - Firm Data",
        url: "https://www.crunchbase.com/",
      },
    ],
  },
  {
    slug: "brightline-ventures",
    name: "Brightline Ventures",
    description:
      "Seed fund focused on marketplace and fintech founders in North America.",
    stages: ["Seed", "Series A"],
    sectors: ["Fintech", "Marketplace"],
    geographies: ["North America"],
    checkSize: "$500k - $3M",
    topTierSourcesAvailable: true,
    updatedAt: "2026-02-05",
    sources: [
      {
        label: "Dealroom - Firm Snapshot",
        url: "https://dealroom.co/",
      },
      {
        label: "Crunchbase - Firm Data",
        url: "https://www.crunchbase.com/",
      },
    ],
  },
  {
    slug: "harbor-signal-partners",
    name: "Harbor Signal Partners",
    description:
      "Climate and industrial tech investors supporting hard science teams at formation.",
    stages: ["Pre-seed", "Seed"],
    sectors: ["Climate", "Industrial Tech"],
    geographies: ["North America"],
    checkSize: "$300k - $2M",
    topTierSourcesAvailable: false,
    updatedAt: "2026-02-05",
    sources: [
      {
        label: "Firm Website",
        url: "https://example.com/",
      },
      {
        label: "Press Release",
        url: "https://example.com/",
      },
    ],
  },
];
