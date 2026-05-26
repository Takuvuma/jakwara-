import ChatInterface from "@/components/ChatInterface";

export const metadata = {
  title: "Discover — Jakwara Atlanta 2026",
  description: "Chat with Jakwara to find Atlanta events that match your culture, team, and taste.",
};

export default function DiscoverPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: intro */}
        <div className="lg:col-span-1">
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Chat with Jakwara
          </h1>
          <p className="text-gray-500 text-sm leading-relaxed mb-6">
            Tell me where you&apos;re from, who you&apos;re rooting for, or what kinds of events
            you enjoy. I&apos;ll search Atlanta&apos;s event calendar and explain why each one is
            perfect for <em>you</em>.
          </p>

          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 space-y-3">
            <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide">Try asking:</p>
            {[
              "I'm from Brazil and love samba music",
              "Looking for family-friendly events in June",
              "What World Cup matches can I watch?",
              "I love street food and art markets",
            ].map((s) => (
              <p key={s} className="text-xs text-blue-600">
                &ldquo;{s}&rdquo;
              </p>
            ))}
          </div>

          <div className="mt-6 p-4 bg-amber-50 border border-amber-100 rounded-xl">
            <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-2">
              🏆 World Cup 2026
            </p>
            <p className="text-xs text-amber-700 leading-relaxed">
              Atlanta hosts 8 matches at Mercedes-Benz Stadium, June–July 2026. Ask Jakwara for
              ticket info and fan events around each match day.
            </p>
          </div>
        </div>

        {/* Right: chat */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden" style={{ height: "600px" }}>
          <ChatInterface />
        </div>
      </div>
    </div>
  );
}
