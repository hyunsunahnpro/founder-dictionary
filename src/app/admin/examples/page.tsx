import SectionTitle from "@/components/SectionTitle";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

const getExamples = async () =>
  prisma.realLifeExample
    .findMany({
      include: { term: true, source: true },
      orderBy: { updatedAt: "desc" },
      take: 8,
    })
    .catch(() => []);

export default async function AdminExamplesPage() {
  const examples = await getExamples();

  async function createExample(formData: FormData) {
    "use server";
    const termSlug = String(formData.get("term") || "").trim();
    const summary = String(formData.get("summary") || "").trim();
    const illustrates = String(formData.get("illustrates") || "").trim();
    const url = String(formData.get("url") || "").trim();
    const sourceLabel = String(formData.get("sourceLabel") || "").trim();
    const sourceUrl = String(formData.get("sourceUrl") || "").trim();

    if (!termSlug || !summary || !illustrates || !url || !sourceLabel || !sourceUrl) {
      return;
    }

    const term = await prisma.term.findUnique({ where: { slug: termSlug } });
    if (!term) return;

    const domain = new URL(sourceUrl).hostname.replace("www.", "");

    const source = await prisma.source.upsert({
      where: { url: sourceUrl },
      update: { label: sourceLabel, domain },
      create: { label: sourceLabel, url: sourceUrl, domain },
    });

    await prisma.realLifeExample.upsert({
      where: { termId: term.id },
      update: {
        summary,
        illustrates,
        url,
        sourceId: source.id,
      },
      create: {
        termId: term.id,
        summary,
        illustrates,
        url,
        sourceId: source.id,
      },
    });

    revalidatePath("/admin/examples");
    revalidatePath(`/dictionary/${term.slug}`);
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-16">
        <SectionTitle
          eyebrow="Admin"
          title="Manage real-life examples"
          description="Add real-world examples to make terms feel grounded and practical."
        />

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <form
            className="flex flex-col gap-4 rounded-3xl border border-[var(--stroke)] bg-white p-6"
            action={createExample}
          >
            <Input label="Term slug" name="term" placeholder="pre-seed" />
            <Textarea label="Summary" name="summary" />
            <Textarea label="What it illustrates" name="illustrates" />
            <Input label="Example URL" name="url" placeholder="https://..." />
            <Input
              label="Source label"
              name="sourceLabel"
              placeholder="Y Combinator Companies"
            />
            <Input label="Source URL" name="sourceUrl" placeholder="https://..." />
            <button
              type="submit"
              className="mt-2 rounded-full bg-[var(--primary)] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white"
            >
              Save example
            </button>
          </form>

          <div className="flex flex-col gap-4 rounded-3xl border border-[var(--stroke)] bg-[var(--card)] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--accent)]">
              Recent examples
            </p>
            {examples.map((example) => (
              <div
                key={example.id}
                className="rounded-2xl border border-[var(--stroke)] bg-white p-4 text-sm"
              >
                <p className="font-semibold text-[var(--foreground)]">
                  {example.term.term}
                </p>
                <p className="text-xs text-[var(--muted)]">{example.summary}</p>
                <p className="mt-2 text-xs text-[var(--muted)]">{example.url}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function Input({
  label,
  placeholder,
  name,
}: {
  label: string;
  placeholder?: string;
  name: string;
}) {
  return (
    <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
      {label}
      <input
        className="rounded-2xl border border-[var(--stroke)] bg-[var(--card)] px-4 py-3 text-sm text-[var(--foreground)]"
        placeholder={placeholder}
        name={name}
      />
    </label>
  );
}

function Textarea({
  label,
  name,
}: {
  label: string;
  name: string;
}) {
  return (
    <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
      {label}
      <textarea
        className="min-h-[120px] rounded-2xl border border-[var(--stroke)] bg-[var(--card)] px-4 py-3 text-sm text-[var(--foreground)]"
        name={name}
      />
    </label>
  );
}
