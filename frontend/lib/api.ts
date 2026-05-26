import { Event, searchMockEvents, getWorldCupEvents } from "./mockData";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

async function fetchFromBackend<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_URL}${path}`, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    return res.json() as Promise<T>;
  } catch {
    return null;
  }
}

export async function getEvents(params: {
  start_date?: string;
  end_date?: string;
  category?: string;
  keyword?: string;
  page?: number;
  size?: number;
}): Promise<Event[]> {
  const qs = new URLSearchParams();
  if (params.start_date) qs.set("start_date", params.start_date);
  if (params.end_date) qs.set("end_date", params.end_date);
  if (params.category) qs.set("category", params.category);
  if (params.page) qs.set("page", String(params.page));
  if (params.size) qs.set("size", String(params.size));

  const data = await fetchFromBackend<{ events: Event[] }>(`/events?${qs}`);
  if (data?.events?.length) return data.events;

  // Fall back to mock data when backend is offline (no API keys yet)
  return searchMockEvents({ keyword: params.keyword, category: params.category });
}

export async function getWorldCupMatches(): Promise<Event[]> {
  const data = await fetchFromBackend<Event[]>("/events/worldcup");
  if (data?.length) return data;
  return getWorldCupEvents();
}

export async function searchEvents(query: string): Promise<Event[]> {
  const data = await fetchFromBackend<Event[]>(`/search?q=${encodeURIComponent(query)}`);
  if (data?.length) return data;
  return searchMockEvents({ keyword: query });
}
