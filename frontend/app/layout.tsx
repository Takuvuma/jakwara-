import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jakwara — Atlanta Summer 2026 Events",
  description:
    "Your AI concierge for Atlanta events during Summer 2026 and the FIFA World Cup. Find events that match your culture, team, and taste.",
  openGraph: {
    title: "Jakwara — Atlanta Summer 2026",
    description: "AI-powered event discovery for World Cup visitors to Atlanta",
    siteName: "Jakwara",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-amber-500 flex items-center justify-center text-white font-bold text-sm">
                J
              </div>
              <span className="font-bold text-gray-900 text-lg">Jakwara</span>
              <span className="hidden sm:block text-xs text-gray-400 font-medium">Atlanta 2026</span>
            </Link>

            <nav className="flex items-center gap-1">
              <Link
                href="/discover"
                className="text-sm font-medium text-gray-600 hover:text-blue-600 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Discover
              </Link>
              <Link
                href="/events"
                className="text-sm font-medium text-gray-600 hover:text-blue-600 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Events
              </Link>
              <Link
                href="/planner"
                className="text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg transition-colors"
              >
                Plan Trip
              </Link>
            </nav>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="border-t border-gray-100 bg-white">
          <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-400">
            <span>© 2026 Jakwara. Atlanta&apos;s Summer 2026 AI Concierge.</span>
            <span>Powered by Claude AI · Events from Ticketmaster, SeatGeek, Eventbrite</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
