import Link from "next/link";

const navLinks = [
  { href: "/dictionary", label: "Dictionary" },
  { href: "/vc", label: "VC Directory" },
  { href: "/about", label: "About" },
  { href: "/admin", label: "Admin" },
];

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--stroke)] bg-[rgba(248,243,236,0.92)] backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          <span className="font-display text-2xl text-[var(--primary)]">FounderLex</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium text-[var(--muted)]">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition hover:text-[var(--primary)]"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/dictionary"
            className="rounded-full border border-[var(--primary)] px-4 py-2 text-sm font-semibold text-[var(--primary)] transition hover:bg-[var(--primary)] hover:text-white"
          >
            Start learning
          </Link>
        </nav>
      </div>
    </header>
  );
}
