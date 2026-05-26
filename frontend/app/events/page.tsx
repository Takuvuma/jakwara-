import { Suspense } from "react";
import { getEvents } from "@/lib/api";
import EventCard from "@/components/EventCard";

export const metadata = {
  title: "Browse Events — Jakwara Atlanta 2026",
};

const CATEGORIES = [
  { value: "", label: "All Events" },
  { value: "sports", label: "⚽ Sports" },
  { value: "music", label: "🎵 Music" },
  { value: "arts", label: "🎨 Arts" },
  { value: "food-drink", label: "🍽️ Food & Drink" },
  { value: "comedy", label: "😂 Comedy" },
  { value: "community", label: "🌍 Community" },
];

interface PageProps {
  searchParams: Promise<{ category?: string; keyword?: string }>;
}

async function EventsGrid({ category, keyword }: { category?: string; keyword?: string }) {
  const events = await getEvents({ category, keyword, size: 20 });

  if (!events.length) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-4xl mb-3">🔍</p>
        <p className="font-medium">No events found</p>
        <p className="text-sm mt-1">Try a different category or search term</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}

export default async function EventsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const { category, keyword } = params;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Atlanta Summer 2026 Events</h1>
        <p className="text-gray-500 text-sm">Browse all events or filter by category</p>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
        {CATEGORIES.map(({ value, label }) => {
          const isActive = (value === "" && !category) || value === category;
          return (
            <a
              key={value}
              href={value ? `/events?category=${value}` : "/events"}
              className={`shrink-0 text-sm font-medium px-4 py-2 rounded-xl border transition-colors whitespace-nowrap ${
                isActive
                  ? "bg-blue-600 border-blue-600 text-white"
                  : "bg-white border-gray-200 text-gray-600 hover:border-blue-300"
              }`}
            >
              {label}
            </a>
          );
        })}
      </div>

      {/* Search bar */}
      <form className="mb-8">
        <div className="flex gap-2 max-w-md">
          <input
            type="text"
            name="keyword"
            defaultValue={keyword}
            placeholder="Search events, artists, venues…"
            className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors"
          >
            Search
          </button>
        </div>
      </form>

      <Suspense
        fallback={
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-2xl h-64 animate-pulse" />
            ))}
          </div>
        }
      >
        <EventsGrid category={category} keyword={keyword} />
      </Suspense>
    </div>
  );
}
