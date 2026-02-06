import Link from "next/link";
import SectionTitle from "@/components/SectionTitle";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

const adminLinks = [
  {
    href: "/admin/terms",
    title: "Terms",
    description: "Create and update dictionary terms with sources and context.",
  },
  {
    href: "/admin/sources",
    title: "Sources",
    description: "Manage source records used across terms and VC profiles.",
  },
  {
    href: "/admin/videos",
    title: "Videos",
    description: "Attach your YouTube and Instagram explanations to terms.",
  },
  {
    href: "/admin/examples",
    title: "Real-life examples",
    description: "Add real-world examples with clear takeaways and citations.",
  },
];

export default function AdminPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-16">
        <SectionTitle
          eyebrow="Admin"
          title="FounderLex content studio"
          description="Use these tools to keep the dictionary and sources accurate. For MVP, access is limited to admin users."
        />
        <div className="grid gap-6 md:grid-cols-2">
          {adminLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-2xl border border-[var(--stroke)] bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg"
            >
              <h3 className="font-display text-2xl text-[var(--foreground)]">
                {link.title}
              </h3>
              <p className="mt-3 text-sm text-[var(--muted)]">
                {link.description}
              </p>
              <span className="mt-6 inline-flex text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
                Open &rarr;
              </span>
            </Link>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
