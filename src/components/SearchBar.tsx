export default function SearchBar({
  placeholder,
}: {
  placeholder: string;
}) {
  return (
    <div className="flex w-full max-w-2xl items-center gap-3 rounded-full border border-[var(--stroke)] bg-white px-4 py-3 shadow-sm">
      <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--muted)]">
        Search
      </span>
      <input
        className="w-full bg-transparent text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none"
        placeholder={placeholder}
        aria-label={placeholder}
      />
      <button className="rounded-full bg-[var(--primary)] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-[var(--primary-dark)]">
        Search
      </button>
    </div>
  );
}
