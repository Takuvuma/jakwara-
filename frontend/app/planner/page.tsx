import TripPlanner from "@/components/TripPlanner";

export const metadata = {
  title: "Trip Planner — Jakwara Atlanta 2026",
  description: "Build your personalized Atlanta Summer 2026 itinerary based on your interests and World Cup schedule.",
};

export default function PlannerPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: intro */}
        <div className="lg:col-span-1">
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Plan Your Atlanta Trip
          </h1>
          <p className="text-gray-500 text-sm leading-relaxed mb-6">
            Tell Jakwara about yourself and your travel dates. We&apos;ll build a complete
            day-by-day itinerary that includes World Cup matches, cultural events, food experiences,
            and local Atlanta highlights — all personalized to you.
          </p>

          <div className="space-y-3">
            {[
              { emoji: "⚽", title: "World Cup Matches", desc: "Atlanta hosts 8 games at Mercedes-Benz Stadium" },
              { emoji: "🎵", title: "Concerts & Festivals", desc: "Live music all summer in Piedmont Park and beyond" },
              { emoji: "🍽️", title: "Food & Culture", desc: "60+ restaurants with World Cup nation cuisines" },
              { emoji: "🏀", title: "More Sports", desc: "Atlanta Hawks NBA games and local sports events" },
            ].map(({ emoji, title, desc }) => (
              <div key={title} className="flex gap-3 p-3 bg-gray-50 rounded-xl">
                <span className="text-xl">{emoji}</span>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{title}</p>
                  <p className="text-xs text-gray-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: planner form / result */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <TripPlanner />
        </div>
      </div>
    </div>
  );
}
