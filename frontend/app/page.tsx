import Link from "next/link";
import { ArrowRight, MessageCircle, Star, Map } from "lucide-react";

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-blue-700 via-blue-800 to-gray-900 text-white overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1400')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="relative max-w-6xl mx-auto px-4 py-24 sm:py-32 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-xs font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            FIFA World Cup 2026 · Atlanta Host City · June–July 2026
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-5">
            Atlanta&apos;s Most Exciting Summer
            <br />
            <span className="text-amber-400">Starts With You</span>
          </h1>

          <p className="text-blue-100 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Tell Jakwara where you&apos;re from, who you&apos;re cheering for, and what you love —
            and we&apos;ll find events that feel made for you.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/discover"
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-white font-bold px-8 py-3.5 rounded-xl transition-colors text-sm shadow-lg shadow-amber-500/30"
            >
              <MessageCircle size={18} />
              Chat with Jakwara
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/planner"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors text-sm"
            >
              <Map size={18} />
              Plan My Trip
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-5 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          {[
            { number: "32", label: "Nations Competing" },
            { number: "8", label: "Matches in Atlanta" },
            { number: "75K", label: "Fans Per Match" },
            { number: "100+", label: "Events This Summer" },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-2xl font-extrabold text-blue-600">{stat.number}</div>
              <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">How Jakwara Works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              icon: MessageCircle,
              title: "Tell us about yourself",
              description:
                "Share where you're from, your favorite team, what music you love, or what food you can't live without.",
              color: "bg-blue-50 text-blue-600",
            },
            {
              icon: Star,
              title: "Jakwara curates for you",
              description:
                "Our AI connects your cultural background and interests to Atlanta's events — with real explanations of why you'll love each one.",
              color: "bg-amber-50 text-amber-600",
            },
            {
              icon: Map,
              title: "Get your itinerary",
              description:
                "Receive a day-by-day Atlanta plan that includes World Cup matches, concerts, food, and local culture — all tailored to you.",
              color: "bg-green-50 text-green-600",
            },
          ].map(({ icon: Icon, title, description, color }) => (
            <div key={title} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className={`w-11 h-11 rounded-xl ${color} flex items-center justify-center mb-4`}>
                <Icon size={22} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Event Category Quick Links */}
      <section className="bg-white border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Browse by Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {[
              { label: "⚽ Sports", value: "sports" },
              { label: "🎵 Music", value: "music" },
              { label: "🎨 Arts", value: "arts" },
              { label: "🍽️ Food & Drink", value: "food-drink" },
              { label: "😂 Comedy", value: "comedy" },
              { label: "🌍 Community", value: "community" },
            ].map(({ label, value }) => (
              <Link
                key={value}
                href={`/events?category=${value}`}
                className="flex items-center justify-center text-sm font-medium text-gray-700 bg-gray-50 hover:bg-blue-50 hover:text-blue-700 border border-gray-100 hover:border-blue-200 rounded-xl py-3 px-4 transition-colors text-center"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Atlanta is ready. Are you?
        </h2>
        <p className="text-gray-500 mb-8 max-w-lg mx-auto">
          32 nations. One city. An unforgettable summer. Let Jakwara be your guide.
        </p>
        <Link
          href="/discover"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3.5 rounded-xl transition-colors shadow-lg shadow-blue-500/20"
        >
          Start Exploring
          <ArrowRight size={16} />
        </Link>
      </section>
    </div>
  );
}
