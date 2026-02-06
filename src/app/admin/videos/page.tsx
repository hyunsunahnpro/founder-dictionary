import SectionTitle from "@/components/SectionTitle";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

const getVideos = async () =>
  prisma.videoLink
    .findMany({
      include: { term: true },
      orderBy: { createdAt: "desc" },
      take: 8,
    })
    .catch(() => []);

const normalizePlatform = (value: string) => {
  const normalized = value.trim().toLowerCase();
  if (normalized.startsWith("you")) return "YOUTUBE";
  if (normalized.startsWith("insta")) return "INSTAGRAM";
  return null;
};

export default async function AdminVideosPage() {
  const videos = await getVideos();

  async function createVideo(formData: FormData) {
    "use server";
    const termSlug = String(formData.get("term") || "").trim();
    const platformInput = String(formData.get("platform") || "").trim();
    const title = String(formData.get("title") || "").trim();
    const url = String(formData.get("url") || "").trim();
    const platform = normalizePlatform(platformInput);

    if (!termSlug || !platform || !title || !url) {
      return;
    }

    const term = await prisma.term.findUnique({ where: { slug: termSlug } });
    if (!term) return;

    await prisma.videoLink.create({
      data: {
        termId: term.id,
        platform,
        title,
        url,
      },
    });

    revalidatePath("/admin/videos");
    revalidatePath(`/dictionary/${term.slug}`);
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-16">
        <SectionTitle
          eyebrow="Admin"
          title="Manage founder videos"
          description="Attach your YouTube and Instagram explanations to relevant terms."
        />

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <form
            className="flex flex-col gap-4 rounded-3xl border border-[var(--stroke)] bg-white p-6"
            action={createVideo}
          >
            <Input label="Term slug" name="term" placeholder="pre-seed" />
            <Input label="Platform" name="platform" placeholder="YouTube or Instagram" />
            <Input
              label="Video title"
              name="title"
              placeholder="Pre-seed explained in 3 minutes"
            />
            <Input label="Video URL" name="url" placeholder="https://..." />
            <button
              type="submit"
              className="mt-2 rounded-full bg-[var(--primary)] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white"
            >
              Save video
            </button>
          </form>

          <div className="flex flex-col gap-4 rounded-3xl border border-[var(--stroke)] bg-[var(--card)] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--accent)]">
              Recent videos
            </p>
            {videos.map((video) => (
              <div
                key={video.id}
                className="rounded-2xl border border-[var(--stroke)] bg-white p-4 text-sm"
              >
                <p className="font-semibold text-[var(--foreground)]">
                  {video.title}
                </p>
                <p className="text-xs text-[var(--muted)]">{video.term.term}</p>
                <p className="mt-2 text-xs text-[var(--muted)]">{video.url}</p>
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
