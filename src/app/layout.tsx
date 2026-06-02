import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "CRO Dashboard",
  description: "Performance Golf Zone CRO test management",
};

const navLinks = [
  { href: "/", label: "Prioritized" },
  { href: "/in-progress", label: "In Progress" },
  { href: "/recap", label: "Monthly Recap" },
  { href: "/submit", label: "Submit Idea" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100">
        <header className="border-b border-slate-800 bg-slate-900">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="font-semibold text-lg tracking-tight">
              CRO Dashboard
            </Link>
            <nav className="flex gap-1">
              {navLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="px-3 py-1.5 text-sm rounded-md text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>
        <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">{children}</main>
      </body>
    </html>
  );
}
