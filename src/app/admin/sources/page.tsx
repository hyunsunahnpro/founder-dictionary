import SectionTitle from "@/components/SectionTitle";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

const getSources = async () =>
  prisma.source
    .findMany({ orderBy: { createdAt: "desc" }, take: 8 })
    .catch(() => []);

const extractDomain = (url: string) => {
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch {
    return "";
  }
};

export default async function AdminSourcesPage() {
  const sources = await getSources();

  async function createSource(formData: FormData) {
    "use server";
    const label = String(formData.get("label") || "").trim();
    const url = String(formData.get("url") || "").trim();
    const domainInput = String(formData.get("domain") || "").trim();
    const domain = domainInput || extractDomain(url);

    if (!label || !url || !domain) {
      return;
    }

    await prisma.source.upsert({
      where: { url },
      update: { label, domain },
      create: { label, url, domain },
    });

    revalidatePath("/admin/sources");
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-16">
        <SectionTitle
          eyebrow="Admin"
          title="Manage sources"
          description="Add or update sources that back dictionary terms and VC profiles."
        />

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <form
            className="flex flex-col gap-4 rounded-3xl border border-[var(--stroke)] bg-white p-6"
            action={createSource}
          >
            <Input
              label="Source label"
              name="label"
              placeholder="Forbes - VC Profiles"
            />
            <Input
              label="URL"
              name="url"
              placeholder="https://www.forbes.com/..."
            />
            <Input label="Domain" name="domain" placeholder="forbes.com" />
            <button
              type="submit"
              className="mt-2 rounded-full bg-[var(--primary)] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white"
            >
              Save source
            </button>
          </form>

          <div className="flex flex-col gap-4 rounded-3xl border border-[var(--stroke)] bg-[var(--card)] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--accent)]">
              Recent sources
            </p>
            {sources.map((source) => (
              <div
                key={source.url}
                className="rounded-2xl border border-[var(--stroke)] bg-white p-4 text-sm"
              >
                <p className="font-semibold text-[var(--foreground)]">
                  {source.label}
                </p>
                <p className="text-xs text-[var(--muted)]">{source.url}</p>
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
