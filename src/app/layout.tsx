import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FounderLex",
  description: "A startup dictionary and VC directory for first-time founders.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
