import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CRO Dashboard — Performance Golf",
  description: "Performance Golf · Conversion Rate Optimization",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#0a0e14] text-[#f4f5f7]">
        <header className="border-b border-white/[0.06] bg-[#0a0e14]/90 backdrop-blur sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-baseline gap-2 group">
              <span className="text-xs font-semibold tracking-[0.22em] text-white uppercase">
                Performance Golf
              </span>
              <span className="text-xs tracking-[0.22em] text-[#c9a55e] uppercase font-semibold">
                · CRO
              </span>
            </Link>
            <div className="text-[11px] text-[#8b95a7] tracking-wider uppercase">
              Internal
            </div>
          </div>
        </header>
        <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-10">{children}</main>
        <footer className="border-t border-white/[0.06] py-5 text-center">
          <div className="text-[10px] tracking-[0.22em] text-[#5a6478] uppercase">
            Stop Guessing · Start Improving
          </div>
        </footer>
      </body>
    </html>
  );
}
