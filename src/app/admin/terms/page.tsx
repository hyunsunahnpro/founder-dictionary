import SectionTitle from "@/components/SectionTitle";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

const getTerms = async () =>
  prisma.term
    .findMany({ orderBy: { updatedAt: "desc" }, take: 8 })
    .catch(() => []);

const toSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

export default async function AdminTermsPage() {
  const terms = await getTerms();

  async function createOrUpdateTerm(formData: FormData) {
    "use server";
    const termValue = String(formData.get("term") || "").trim();
    const slugValue = String(formData.get("slug") || "").trim();
    const category = String(formData.get("category") || "").trim();
    const definition = String(formData.get("definition") || "").trim();
    const example = String(formData.get("example") || "").trim();
    const context = String(formData.get("context") || "").trim();
    const relatedTermsRaw = String(formData.get("relatedTerms") || "").trim();

    if (!termValue || !definition) {
      return;
    }

    const slug = slugValue ? toSlug(slugValue) : toSlug(termValue);
    const relatedSlugs = relatedTermsRaw
      .split(",")
      .map((entry) => toSlug(entry))
      .filter((entry) => entry && entry !== slug);

    const saved = await prisma.term.upsert({
      where: { slug },
      update: {
        term: termValue,
        category,
        definition,
        example,
        context,
      },
      create: {
        slug,
        term: termValue,
        category,
        definition,
        example,
        context,
      },
    });

    await prisma.relatedTerm.deleteMany({ where: { fromTermId: saved.id } });

    if (relatedSlugs.length) {
      const relatedTargets = await prisma.term.findMany({
        where: { slug: { in: relatedSlugs } },
        select: { id: true },
      });

      if (relatedTargets.length) {
        await prisma.relatedTerm.createMany({
          data: relatedTargets.map((target) => ({
            fromTermId: saved.id,
            toTermId: target.id,
          })),
          skipDuplicates: true,
        });
      }
    }

    revalidatePath("/admin/terms");
    revalidatePath("/dictionary");
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-16">
        <SectionTitle
          eyebrow="Admin"
          title="Manage dictionary terms"
          description="Create and update terms with definitions, context, sources, and related terms."
        />

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <form
            className="flex flex-col gap-4 rounded-3xl border border-[var(--stroke)] bg-white p-6"
            action={createOrUpdateTerm}
          >
            <Input label="Term" name="term" placeholder="e.g., Pre-seed" />
            <Input label="Slug" name="slug" placeholder="pre-seed" />
            <Input label="Category" name="category" placeholder="Fundraising" />
            <Textarea label="Definition" name="definition" />
            <Textarea label="Example" name="example" />
            <Textarea
              label="Context"
              name="context"
              placeholder="When founders hear this..."
            />
            <Input
              label="Related terms"
              name="relatedTerms"
              placeholder="angel, seed, runway"
            />
            <button
              type="submit"
              className="mt-2 rounded-full bg-[var(--primary)] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white"
            >
              Save term
            </button>
          </form>

          <div className="flex flex-col gap-4 rounded-3xl border border-[var(--stroke)] bg-[var(--card)] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--accent)]">
              Recent terms
            </p>
            {terms.map((term) => (
              <div
                key={term.slug}
                className="rounded-2xl border border-[var(--stroke)] bg-white p-4 text-sm"
              >
                <p className="font-semibold text-[var(--foreground)]">{term.term}</p>
                <p className="text-xs text-[var(--muted)]">{term.category}</p>
                <p className="mt-2 text-xs text-[var(--muted)]">
                  Updated: {term.updatedAt.toISOString().slice(0, 10)}
                </p>
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
      <textarea
        className="min-h-[120px] rounded-2xl border border-[var(--stroke)] bg-[var(--card)] px-4 py-3 text-sm text-[var(--foreground)]"
        placeholder={placeholder}
        name={name}
      />
    </label>
  );
}
