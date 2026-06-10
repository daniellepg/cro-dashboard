import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "CRO Dashboard — Performance Golf Zone",
  description: "CRO test management and funnel performance",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100">
        <header className="border-b border-slate-800/60 bg-slate-950/80 backdrop-blur sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
            <Link href="/" className="text-sm font-medium text-slate-300 hover:text-white">
              ← CRO Dashboard
            </Link>
          </div>
        </header>
        <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-10">{children}</main>
        <footer className="border-t border-slate-800/60 py-4 text-center text-xs text-slate-500">
          Performance Golf Zone · CRO
        </footer>
      </body>
    </html>
  );
}
