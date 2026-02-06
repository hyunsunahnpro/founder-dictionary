export default function SiteFooter() {
  return (
    <footer className="border-t border-[var(--stroke)] bg-[var(--card)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-10 text-sm text-[var(--muted)]">
        <div className="flex flex-col gap-2">
          <span className="font-display text-lg text-[var(--primary)]">FounderLex</span>
          <p className="max-w-xl">
            A founder-first dictionary and VC directory built to make fundraising
            and startup language feel clear, grounded, and human.
          </p>
        </div>
        <div className="flex flex-wrap gap-4">
          <span>© 2026 FounderLex</span>
          <span>Curated with credible sources</span>
          <span>Built for first-time founders</span>
        </div>
      </div>
    </footer>
  );
}
