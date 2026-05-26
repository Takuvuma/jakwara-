"use client";

import { useState } from "react";
import { Loader2, Globe, Users, Calendar, Wallet, Trophy } from "lucide-react";
import EventCard from "./EventCard";
import { Event } from "@/lib/mockData";

interface Profile {
  name: string;
  country: string;
  team: string;
  interests: string[];
  budget: string;
}

interface Dates {
  arrival: string;
  departure: string;
}

interface PlanDay {
  date: string;
  label: string;
  local_tip: string;
  events: {
    event_id: string;
    time: string;
    note: string;
    event: Event | null;
  }[];
}

interface Plan {
  title: string;
  overview: string;
  budget_estimate: string;
  days: PlanDay[];
}

const INTERESTS = ["Football/Soccer", "Music", "Food & Drink", "Arts & Culture", "Comedy", "Basketball", "Community Events"];
const BUDGETS = ["Budget ($50–100/day)", "Moderate ($100–250/day)", "Comfortable ($250–500/day)", "Luxury ($500+/day)"];
const COUNTRIES = [
  "Brazil", "USA", "Mexico", "Argentina", "France", "Germany", "England",
  "Japan", "Morocco", "Portugal", "Spain", "Netherlands", "Canada", "Australia",
  "South Korea", "Senegal", "Nigeria", "Ecuador", "Uruguay", "Colombia", "Other",
];

export default function TripPlanner() {
  const [step, setStep] = useState<"form" | "loading" | "result">("form");
  const [profile, setProfile] = useState<Profile>({
    name: "", country: "", team: "", interests: [], budget: "",
  });
  const [dates, setDates] = useState<Dates>({ arrival: "2026-06-10", departure: "2026-06-20" });
  const [plan, setPlan] = useState<Plan | null>(null);
  const [error, setError] = useState<string | null>(null);

  const toggleInterest = (interest: string) => {
    setProfile((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const generate = async () => {
    setStep("loading");
    setError(null);

    try {
      const res = await fetch("/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile, dates }),
      });

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let resultData: Plan | null = null;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        for (const line of chunk.split("\n")) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6);
          if (data === "[DONE]") break;
          try {
            const parsed = JSON.parse(data);
            if (parsed.days) resultData = parsed as Plan;
            if (parsed.error) setError(parsed.error);
          } catch {
            // ignore
          }
        }
      }

      if (resultData) {
        setPlan(resultData);
        setStep("result");
      } else {
        setError("No itinerary was generated. Please try again.");
        setStep("form");
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setStep("form");
    }
  };

  if (step === "loading") {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-gray-500">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-amber-500 flex items-center justify-center">
          <Loader2 size={28} className="animate-spin text-white" />
        </div>
        <p className="text-sm">Jakwara is building your Atlanta itinerary…</p>
        <p className="text-xs text-gray-400">This may take 15–30 seconds</p>
      </div>
    );
  }

  if (step === "result" && plan) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-2">{plan.title}</h2>
          <p className="text-blue-100 text-sm leading-relaxed">{plan.overview}</p>
          <div className="mt-3 inline-block bg-white/20 rounded-full px-3 py-1 text-xs font-medium">
            Estimated budget: {plan.budget_estimate}
          </div>
        </div>

        {plan.days.map((day, di) => (
          <div key={di} className="space-y-3">
            <div>
              <h3 className="font-semibold text-gray-900">{day.label}</h3>
              <p className="text-xs text-amber-700 bg-amber-50 rounded-lg px-3 py-1.5 mt-1 inline-block">
                💡 {day.local_tip}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {day.events.map((ev, ei) => (
                <div key={ei}>
                  <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                    {ev.time}
                  </div>
                  {ev.event ? (
                    <EventCard event={ev.event} reason={ev.note} />
                  ) : (
                    <div className="bg-gray-50 border border-dashed border-gray-200 rounded-xl p-4 text-sm text-gray-500">
                      {ev.note}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        <button
          onClick={() => { setStep("form"); setPlan(null); }}
          className="w-full text-sm text-blue-600 hover:text-blue-800 py-2 border border-blue-200 rounded-xl transition-colors"
        >
          Plan another trip
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-700 text-sm rounded-xl px-4 py-3">{error}</div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
            <Globe size={12} className="inline mr-1" />Your Name
          </label>
          <input
            type="text"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            placeholder="e.g. Carlos"
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
            <Globe size={12} className="inline mr-1" />Country
          </label>
          <select
            value={profile.country}
            onChange={(e) => setProfile({ ...profile, country: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select country…</option>
            {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
            <Trophy size={12} className="inline mr-1" />Favorite Team
          </label>
          <input
            type="text"
            value={profile.team}
            onChange={(e) => setProfile({ ...profile, team: e.target.value })}
            placeholder="e.g. Brazil, Mexico…"
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
            <Wallet size={12} className="inline mr-1" />Budget
          </label>
          <select
            value={profile.budget}
            onChange={(e) => setProfile({ ...profile, budget: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select budget…</option>
            {BUDGETS.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
          <Users size={12} className="inline mr-1" />Interests (pick all that apply)
        </label>
        <div className="flex flex-wrap gap-2">
          {INTERESTS.map((interest) => (
            <button
              key={interest}
              onClick={() => toggleInterest(interest)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                profile.interests.includes(interest)
                  ? "bg-blue-600 border-blue-600 text-white"
                  : "bg-white border-gray-200 text-gray-600 hover:border-blue-300"
              }`}
            >
              {interest}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
            <Calendar size={12} className="inline mr-1" />Arrival
          </label>
          <input
            type="date"
            value={dates.arrival}
            min="2026-06-01"
            max="2026-08-31"
            onChange={(e) => setDates({ ...dates, arrival: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
            <Calendar size={12} className="inline mr-1" />Departure
          </label>
          <input
            type="date"
            value={dates.departure}
            min="2026-06-01"
            max="2026-08-31"
            onChange={(e) => setDates({ ...dates, departure: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <button
        onClick={generate}
        disabled={!profile.country || !dates.arrival || !dates.departure}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors"
      >
        Build My Atlanta Itinerary
      </button>
    </div>
  );
}
