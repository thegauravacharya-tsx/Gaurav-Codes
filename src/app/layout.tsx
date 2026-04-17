import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import { Terminal, Home, Library, BookOpen } from "lucide-react";
import Search from "@/components/Search";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Gaurav Codes | AI Logic Engines & Automation",
  description:
    "High-end developer companion platform focusing on AI logic engines, Next.js architecture, and modern automation.",
  openGraph: {
    title: "Gaurav Codes",
    description:
      "Master modern full-stack development and AI automation.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body
        className={`${inter.className} bg-[#0a0a0a] text-gray-100 min-h-screen antialiased selection:bg-blue-500/30`}
      >
        {/* Sticky Global Navigation */}
        <header className="sticky top-0 z-50 w-full border-b border-gray-800/60 bg-[#0a0a0a]/80 backdrop-blur-xl">
          <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
            
            {/* Brand Identity */}
            <Link
              href="/"
              className="flex items-center gap-2 group transition-colors hover:text-blue-500"
            >
              <Terminal className="h-6 w-6 text-blue-500" />
              <span className="font-bold text-lg tracking-tight">
                Gaurav Codes
              </span>
            </Link>

            {/* Core Navigation */}
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
              <Link
                href="/"
                className="flex items-center gap-2 hover:text-gray-100 transition-colors"
              >
                <Home className="h-4 w-4" /> Home
              </Link>
              <Link
                href="/library"
                className="flex items-center gap-2 hover:text-gray-100 transition-colors"
              >
                <Library className="h-4 w-4" /> Library
              </Link>
              <Link
                href="/learning-hub"
                className="flex items-center gap-2 hover:text-gray-100 transition-colors"
              >
                <BookOpen className="h-4 w-4" /> Learning Hub
              </Link>
            </nav>

            {/* Search */}
            <div className="w-64 flex justify-end">
              <Search />
            </div>

          </div>
        </header>

        {/* Page Content */}
        <main className="max-w-[1600px] mx-auto px-6 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}