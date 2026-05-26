export interface Event {
  id: string;
  source: string;
  name: string;
  description?: string;
  category?: string;
  subcategory?: string;
  start_datetime?: string;
  venue?: {
    id: string;
    name: string;
    address?: string;
    city: string;
    state: string;
  };
  ticket_url?: string;
  min_price?: number;
  max_price?: number;
  currency: string;
  availability?: string;
  image_url?: string;
}

export const MOCK_EVENTS: Event[] = [
  {
    id: "tm-wc-atl-01",
    source: "ticketmaster",
    name: "FIFA World Cup 2026 — Group Stage Match",
    description: "International football's biggest stage comes to Atlanta. Two of the world's top national teams compete at Mercedes-Benz Stadium in front of 75,000 fans.",
    category: "sports",
    subcategory: "soccer",
    start_datetime: "2026-06-15T19:00:00-04:00",
    venue: { id: "KovZpZAEdntA", name: "Mercedes-Benz Stadium", address: "1 AMB Drive NW", city: "Atlanta", state: "GA" },
    ticket_url: "https://www.ticketmaster.com",
    min_price: 120, max_price: 850, currency: "USD", availability: "available",
    image_url: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800",
  },
  {
    id: "tm-wc-atl-02",
    source: "ticketmaster",
    name: "FIFA World Cup 2026 — Round of 16",
    description: "The knockout stage begins. The top teams from the group stage battle for survival at Mercedes-Benz Stadium.",
    category: "sports",
    subcategory: "soccer",
    start_datetime: "2026-07-02T15:00:00-04:00",
    venue: { id: "KovZpZAEdntA", name: "Mercedes-Benz Stadium", address: "1 AMB Drive NW", city: "Atlanta", state: "GA" },
    ticket_url: "https://www.ticketmaster.com",
    min_price: 200, max_price: 1500, currency: "USD", availability: "limited",
    image_url: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800",
  },
  {
    id: "tm-music-01",
    source: "ticketmaster",
    name: "Atlanta Summer Music Festival",
    description: "Three days of live music featuring 40+ artists across 5 stages. From hip-hop to R&B, jazz to gospel — Atlanta's diverse music scene on full display.",
    category: "music",
    subcategory: "festival",
    start_datetime: "2026-06-20T12:00:00-04:00",
    venue: { id: "piedmont-park", name: "Piedmont Park", address: "400 Park Dr NE", city: "Atlanta", state: "GA" },
    ticket_url: "https://www.eventbrite.com",
    min_price: 45, max_price: 299, currency: "USD", availability: "available",
    image_url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800",
  },
  {
    id: "sg-nba-01",
    source: "seatgeek",
    name: "Atlanta Hawks vs. Boston Celtics",
    description: "NBA action at State Farm Arena. Watch the Hawks host the Celtics in a high-stakes conference matchup.",
    category: "sports",
    subcategory: "basketball",
    start_datetime: "2026-06-10T19:30:00-04:00",
    venue: { id: "state-farm-arena", name: "State Farm Arena", address: "1 State Farm Drive", city: "Atlanta", state: "GA" },
    ticket_url: "https://seatgeek.com",
    min_price: 35, max_price: 450, currency: "USD", availability: "available",
    image_url: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800",
  },
  {
    id: "eb-culture-01",
    source: "eventbrite",
    name: "Atlanta International Food & Culture Festival",
    description: "Celebrate the cultures of the 32 World Cup nations. Authentic food, music, dance performances, and cultural exhibits from every participating country.",
    category: "community",
    subcategory: "cultural",
    start_datetime: "2026-06-12T11:00:00-04:00",
    venue: { id: "centennial-park", name: "Centennial Olympic Park", address: "265 Park Ave W NW", city: "Atlanta", state: "GA" },
    ticket_url: "https://www.eventbrite.com",
    min_price: 15, max_price: 35, currency: "USD", availability: "available",
    image_url: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800",
  },
  {
    id: "eb-comedy-01",
    source: "eventbrite",
    name: "ATL Laughs — World Cup Comedy Night",
    description: "Stand-up comedy celebrating football culture from around the world. Comedians from Brazil, Mexico, Argentina, England, and the US share their hilarious takes on the beautiful game.",
    category: "comedy",
    subcategory: "stand-up",
    start_datetime: "2026-06-18T20:00:00-04:00",
    venue: { id: "tabernacle-atl", name: "The Tabernacle", address: "152 Luckie St NW", city: "Atlanta", state: "GA" },
    ticket_url: "https://www.eventbrite.com",
    min_price: 30, max_price: 75, currency: "USD", availability: "available",
    image_url: "https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=800",
  },
  {
    id: "tm-concert-01",
    source: "ticketmaster",
    name: "Bad Bunny — World Hottest Tour 2026",
    description: "The global reggaeton superstar brings his massive world tour to Atlanta. An unmissable night for Latin music fans.",
    category: "music",
    subcategory: "latin",
    start_datetime: "2026-07-05T20:00:00-04:00",
    venue: { id: "KovZpZAEdntA", name: "Mercedes-Benz Stadium", address: "1 AMB Drive NW", city: "Atlanta", state: "GA" },
    ticket_url: "https://www.ticketmaster.com",
    min_price: 85, max_price: 600, currency: "USD", availability: "limited",
    image_url: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800",
  },
  {
    id: "eb-art-01",
    source: "eventbrite",
    name: "World Cup Fan Art Exhibition — Global Perspectives",
    description: "Artists from 32 nations present football-inspired works. Paintings, sculptures, digital art, and street murals celebrating the World Cup and global football culture.",
    category: "arts",
    subcategory: "exhibition",
    start_datetime: "2026-06-10T10:00:00-04:00",
    venue: { id: "high-museum", name: "High Museum of Art", address: "1280 Peachtree St NE", city: "Atlanta", state: "GA" },
    ticket_url: "https://www.eventbrite.com",
    min_price: 18, max_price: 30, currency: "USD", availability: "available",
    image_url: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800",
  },
  {
    id: "eb-food-01",
    source: "eventbrite",
    name: "Atlanta Restaurant Week — World Cup Edition",
    description: "60+ Atlanta restaurants offer special prix-fixe menus inspired by World Cup nations. Explore Brazilian churrasco, Moroccan tagine, Japanese ramen, and more.",
    category: "food-drink",
    subcategory: "culinary",
    start_datetime: "2026-06-14T17:00:00-04:00",
    venue: { id: "beltline", name: "Atlanta BeltLine Eastside Trail", address: "BeltLine Eastside", city: "Atlanta", state: "GA" },
    ticket_url: "https://www.eventbrite.com",
    min_price: 35, max_price: 95, currency: "USD", availability: "available",
    image_url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800",
  },
  {
    id: "eb-fanfest-01",
    source: "eventbrite",
    name: "FIFA Fan Festival Atlanta — Opening Week",
    description: "The official FIFA Fan Festival experience at Centennial Park. Free entry, live match screenings on giant screens, entertainment, food, and merchandise.",
    category: "sports",
    subcategory: "fan experience",
    start_datetime: "2026-06-11T10:00:00-04:00",
    venue: { id: "centennial-park", name: "Centennial Olympic Park", address: "265 Park Ave W NW", city: "Atlanta", state: "GA" },
    ticket_url: "https://www.eventbrite.com",
    min_price: 0, max_price: 0, currency: "USD", availability: "available",
    image_url: "https://images.unsplash.com/photo-1540747913346-19212a4b32a7?w=800",
  },
];

export function searchMockEvents(params: {
  keyword?: string;
  category?: string;
  start_date?: string;
  end_date?: string;
}): Event[] {
  let results = [...MOCK_EVENTS];

  if (params.keyword) {
    const kw = params.keyword.toLowerCase();
    results = results.filter(
      (e) =>
        e.name.toLowerCase().includes(kw) ||
        e.description?.toLowerCase().includes(kw) ||
        e.subcategory?.toLowerCase().includes(kw) ||
        e.category?.toLowerCase().includes(kw)
    );
  }

  if (params.category) {
    const cat = params.category.toLowerCase();
    results = results.filter(
      (e) =>
        e.category?.toLowerCase().includes(cat) ||
        e.subcategory?.toLowerCase().includes(cat)
    );
  }

  return results;
}

export function getWorldCupEvents(): Event[] {
  return MOCK_EVENTS.filter((e) => e.subcategory === "soccer");
}
