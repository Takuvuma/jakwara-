"use client";

import Image from "next/image";
import { Calendar, MapPin, Ticket, DollarSign } from "lucide-react";
import { Event } from "@/lib/mockData";

function formatDate(iso?: string) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatPrice(min?: number, max?: number) {
  if (!min && !max) return null;
  if (min === 0 && max === 0) return "Free";
  if (min && max && min !== max) return `$${min}–$${max}`;
  if (min) return `From $${min}`;
  return null;
}

const CATEGORY_COLORS: Record<string, string> = {
  sports: "bg-blue-100 text-blue-700",
  music: "bg-purple-100 text-purple-700",
  arts: "bg-pink-100 text-pink-700",
  "food-drink": "bg-orange-100 text-orange-700",
  comedy: "bg-yellow-100 text-yellow-700",
  community: "bg-green-100 text-green-700",
};

interface EventCardProps {
  event: Event;
  reason?: string;
  compact?: boolean;
}

export default function EventCard({ event, reason, compact = false }: EventCardProps) {
  const price = formatPrice(event.min_price, event.max_price);
  const date = formatDate(event.start_datetime);
  const categoryColor = CATEGORY_COLORS[event.category ?? ""] ?? "bg-gray-100 text-gray-700";

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      {event.image_url && !compact && (
        <div className="relative h-44 w-full">
          <Image
            src={event.image_url}
            alt={event.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 400px"
          />
          {event.availability === "limited" && (
            <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
              Limited
            </span>
          )}
        </div>
      )}

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-gray-900 leading-tight text-sm line-clamp-2">
            {event.name}
          </h3>
          {event.category && (
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${categoryColor}`}>
              {event.category}
            </span>
          )}
        </div>

        {date && (
          <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
            <Calendar size={12} />
            <span>{date}</span>
          </div>
        )}

        {event.venue && (
          <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
            <MapPin size={12} />
            <span className="truncate">{event.venue.name}</span>
          </div>
        )}

        {price && (
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <DollarSign size={12} />
            <span>{price}</span>
          </div>
        )}

        {reason && (
          <p className="mt-3 text-xs text-gray-600 bg-blue-50 rounded-lg p-2.5 leading-relaxed border-l-2 border-blue-400">
            {reason}
          </p>
        )}

        {event.ticket_url && (
          <a
            href={event.ticket_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex items-center justify-center gap-1.5 w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2 rounded-lg transition-colors"
          >
            <Ticket size={12} />
            Get Tickets
          </a>
        )}
      </div>
    </div>
  );
}
