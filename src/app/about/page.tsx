import SectionTitle from "@/components/SectionTitle";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-16">
        <SectionTitle
          eyebrow="Why FounderLex"
          title="Built to make startup language feel human"
          description="FounderLex pairs plain-English vocabulary with credible sources and founder-led videos, so first-time founders can move faster with confidence."
        />
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-[var(--stroke)] bg-white p-6 text-sm text-[var(--muted)]">
            <p className="font-medium text-[var(--foreground)]">Our promise</p>
            <p className="mt-3">
              Every term includes clear definitions, contextual examples, and a
              documented source. Every VC profile shows when it was last updated.
            </p>
          </div>
          <div className="rounded-2xl border border-[var(--stroke)] bg-white p-6 text-sm text-[var(--muted)]">
            <p className="font-medium text-[var(--foreground)]">What comes next</p>
            <p className="mt-3">
              We will expand the dictionary, build powerful filters, and add a
              founder-friendly way to request updates.
            </p>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
