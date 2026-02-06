import type { VideoLink } from "@/lib/data";

const getYouTubeId = (url: string) => {
  const match = url.match(/(v=|youtu.be\/)([\w-]+)/i);
  return match?.[2] ?? null;
};

const getInstagramId = (url: string) => {
  const match = url.match(/reel\/([\w-]+)/i);
  return match?.[1] ?? null;
};

const getEmbedUrl = (video: VideoLink) => {
  if (video.platform === "youtube") {
    const id = getYouTubeId(video.url);
    return id ? `https://www.youtube.com/embed/${id}` : null;
  }
  if (video.platform === "instagram") {
    const id = getInstagramId(video.url);
    return id ? `https://www.instagram.com/reel/${id}/embed` : null;
  }
  return null;
};

export default function VideoEmbed({ video }: { video: VideoLink }) {
  const embedUrl = getEmbedUrl(video);

  if (!embedUrl) {
    return (
      <a
        className="flex flex-col gap-2 rounded-2xl border border-[var(--stroke)] bg-white p-4 text-sm"
        href={video.url}
        target="_blank"
        rel="noreferrer"
      >
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
          {video.platform}
        </span>
        <span className="font-medium text-[var(--foreground)]">{video.title}</span>
        <span className="text-xs text-[var(--muted)]">Open video</span>
      </a>
    );
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-[var(--stroke)] bg-white p-4">
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
        {video.platform}
      </span>
      <div className="aspect-video overflow-hidden rounded-xl border border-[var(--stroke)] bg-black">
        <iframe
          src={embedUrl}
          title={video.title}
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      <span className="text-sm font-medium text-[var(--foreground)]">{video.title}</span>
    </div>
  );
}
