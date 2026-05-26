# Jakwara — Atlanta Summer 2026 Events Platform

An AI-powered event discovery platform for Summer 2026 and the FIFA World Cup 2026 in Atlanta. Jakwara helps visitors from around the world find events that match their culture, nationality, team allegiance, and personal taste — using Claude AI as the concierge.

---

## What It Does

- **AI Chat Concierge** — Tell Jakwara where you're from and what you love; it searches events and explains why each one fits you specifically
- **Personalized Recommendations** — Profile-based event curation connecting your cultural background to Atlanta's event calendar
- **Trip Planner** — Day-by-day Atlanta itinerary builder that includes World Cup matches, concerts, food, and local culture
- **Event Browser** — Filter and search all Atlanta Summer 2026 events by category, date, or keyword

---

## Tech Stack

### Frontend

| Layer | Tool |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript + React 19 |
| Styling | Tailwind CSS |
| AI | Claude claude-opus-4-7 via `@anthropic-ai/sdk` |
| Streaming | Server-Sent Events (SSE) |

### Backend

| Layer | Tool |
|---|---|
| Framework | [FastAPI](https://fastapi.tiangolo.com/) |
| HTTP client | `httpx` (async) |
| Data validation | Pydantic v2 |
| Caching | `fastapi-cache2` (in-memory or Redis) |
| Config | `python-dotenv` |
| Runtime | Python 3.11+ |

---

## Project Structure

```
jakwara/
├── README.md
├── .env.example             # Backend API keys template
│
├── main.py                  # FastAPI app entry point
├── config.py                # Settings from environment variables
├── requirements.txt
│
├── models/
│   └── event.py             # Unified Event + Venue Pydantic schemas
│
├── services/
│   ├── ticketmaster.py      # Ticketmaster Discovery API client
│   ├── seatgeek.py          # SeatGeek API client
│   ├── eventbrite.py        # Eventbrite API client
│   └── aggregator.py        # Merges + deduplicates across all sources
│
├── routers/
│   ├── events.py            # /events endpoints
│   ├── venues.py            # /venues endpoints
│   └── search.py            # /search endpoint
│
└── frontend/                # Next.js 15 web app
    ├── app/
    │   ├── layout.tsx        # Root layout + navigation
    │   ├── page.tsx          # Landing page with hero + category links
    │   ├── discover/         # AI chat concierge page
    │   ├── events/           # Browse + filter all events
    │   ├── planner/          # Trip planner UI
    │   └── api/
    │       ├── chat/         # Streaming Claude chat endpoint
    │       ├── recommend/    # Profile-based recommendation endpoint
    │       └── plan/         # Trip itinerary generation endpoint
    ├── components/
    │   ├── EventCard.tsx     # Reusable event card with image, price, tickets
    │   ├── ChatInterface.tsx # Real-time SSE chat UI
    │   └── TripPlanner.tsx   # Multi-step trip planner form + result
    └── lib/
        ├── mockData.ts       # 10 mock Atlanta/World Cup events (dev fallback)
        └── api.ts            # FastAPI client with mock fallback
```

---

## API Endpoints

### Events

| Method | Path | Description |
|---|---|---|
| `GET` | `/events` | List Atlanta events. Supports filters: `start_date`, `end_date`, `category`, `venue_id`, `page`, `size` |
| `GET` | `/events/{id}` | Single event detail by source ID |
| `GET` | `/events/worldcup` | FIFA World Cup 2026 Atlanta matches only |
| `GET` | `/events/trending` | Events with high activity or low remaining availability |

### Venues

| Method | Path | Description |
|---|---|---|
| `GET` | `/venues` | Atlanta venues with upcoming events |
| `GET` | `/venues/{id}/events` | All upcoming events at a specific venue |

### Search & Utility

| Method | Path | Description |
|---|---|---|
| `GET` | `/search?q=...` | Full-text search across event names, artists, teams |
| `GET` | `/categories` | List available event categories |
| `GET` | `/health` | Health check — confirms API is up and sources are reachable |

---

## Query Parameters — `/events`

| Param | Type | Default | Description |
|---|---|---|---|
| `start_date` | `YYYY-MM-DD` | today | Filter events on or after this date |
| `end_date` | `YYYY-MM-DD` | — | Filter events on or before this date |
| `category` | string | — | e.g. `sports`, `music`, `arts` |
| `venue_id` | string | — | Restrict to a specific venue |
| `source` | string | — | `ticketmaster`, `seatgeek`, or `eventbrite` |
| `page` | int | 1 | Pagination page |
| `size` | int | 20 | Results per page (max 50) |

**Example:**
```
GET /events?start_date=2026-06-01&end_date=2026-07-31&category=sports
```

---

## Event Schema

All sources are normalized to this model:

```json
{
  "id": "tm-G5v0Z9Yf1e_Zu",
  "source": "ticketmaster",
  "name": "FIFA World Cup 2026 - Group Stage Match",
  "description": "...",
  "category": "sports",
  "subcategory": "soccer",
  "start_datetime": "2026-06-15T19:00:00-04:00",
  "end_datetime": null,
  "venue": {
    "id": "KovZpZAEdntA",
    "name": "Mercedes-Benz Stadium",
    "address": "1 AMB Drive NW, Atlanta, GA 30313",
    "latitude": 33.7554,
    "longitude": -84.4008
  },
  "ticket_url": "https://www.ticketmaster.com/event/...",
  "min_price": 120.00,
  "max_price": 850.00,
  "currency": "USD",
  "availability": "available",
  "image_url": "https://..."
}
```

---

## Getting Started

### Backend (FastAPI)

```bash
git clone https://github.com/Takuvuma/jakwara-.git
cd jakwara
python -m venv .venv
source .venv/bin/activate      # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env           # then fill in your API keys
uvicorn main:app --reload
```

Open http://localhost:8000/docs for the interactive Swagger UI.

**Where to get API keys (all free):**
- Ticketmaster: https://developer.ticketmaster.com/
- SeatGeek: https://seatgeek.com/account/develop
- Eventbrite: https://www.eventbrite.com/platform/api

### Frontend (Next.js)

```bash
cd frontend
npm install
cp .env.local.example .env.local   # then add your ANTHROPIC_API_KEY
npm run dev
```

Open http://localhost:3000 — the frontend works immediately with mock data. Add your `ANTHROPIC_API_KEY` to `.env.local` to enable AI features, and start the backend on port 8000 for live event data.

**Where to get Claude API key (required for AI):**
- Anthropic Console: https://console.anthropic.com/

---

## Development

### Run with auto-reload

```bash
uvicorn main:app --reload --port 8000
```

### Run tests

```bash
pytest
```

### Environment variables

| Variable | Required | Description |
|---|---|---|
| `TICKETMASTER_API_KEY` | Yes | Ticketmaster Discovery API key |
| `SEATGEEK_CLIENT_ID` | Yes | SeatGeek OAuth client ID |
| `SEATGEEK_CLIENT_SECRET` | Yes | SeatGeek OAuth client secret |
| `EVENTBRITE_API_KEY` | Yes | Eventbrite private token |
| `CACHE_TTL_SECONDS` | No (default 600) | How long to cache API responses |
| `REDIS_URL` | No | Redis URL for distributed caching; falls back to in-memory |

---

## Data Sources

| Source | API Docs | Coverage |
|---|---|---|
| Ticketmaster | https://developer.ticketmaster.com/products-and-docs/apis/discovery-api/v2/ | Sports, concerts, theatre — richest inventory |
| SeatGeek | https://platform.seatgeek.com/ | Strong secondary market + resale |
| Eventbrite | https://www.eventbrite.com/platform/api | Community events, festivals, non-sports |

---

## FIFA World Cup 2026 — Atlanta

Atlanta's Mercedes-Benz Stadium is one of 16 North American host venues. Atlanta is scheduled to host **Group Stage and Round of 16** matches in June–July 2026.

The `/events/worldcup` endpoint filters by:
- Ticketmaster attraction ID for the FIFA World Cup 2026 series
- Venue: Mercedes-Benz Stadium, Atlanta
- Date range: June 1 – July 20, 2026

---

## License

MIT
