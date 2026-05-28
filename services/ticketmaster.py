from __future__ import annotations
from typing import Optional
import httpx
from config import settings
from models.event import Event, Venue

_BASE = "https://app.ticketmaster.com/discovery/v2"
# FIFA World Cup 2026 attraction ID on Ticketmaster
_WORLDCUP_ATTRACTION_ID = "K8vZ917rUHV"


def _parse_event(raw: dict) -> Event:
    embedded = raw.get("_embedded", {})
    venues_raw = embedded.get("venues", [{}])
    v = venues_raw[0] if venues_raw else {}
    loc = v.get("location", {})
    addr_parts = v.get("address", {})

    venue = Venue(
        id=v.get("id", ""),
        name=v.get("name", ""),
        address=addr_parts.get("line1"),
        city=v.get("city", {}).get("name", "Atlanta"),
        state=v.get("state", {}).get("stateCode", "GA"),
        latitude=float(loc["latitude"]) if loc.get("latitude") else None,
        longitude=float(loc["longitude"]) if loc.get("longitude") else None,
    )

    price_ranges = raw.get("priceRanges", [])
    min_price = price_ranges[0].get("min") if price_ranges else None
    max_price = price_ranges[0].get("max") if price_ranges else None

    dates = raw.get("dates", {}).get("start", {})
    start_dt = dates.get("dateTime")

    images = raw.get("images", [])
    image_url = images[0]["url"] if images else None

    classifications = raw.get("classifications", [{}])
    segment = classifications[0].get("segment", {}).get("name", "").lower() if classifications else ""
    genre = classifications[0].get("genre", {}).get("name", "").lower() if classifications else ""

    status = raw.get("dates", {}).get("status", {}).get("code", "").lower()
    if status == "onsale":
        availability = "available"
    elif status in ("offsale", "cancelled", "postponed"):
        availability = "sold_out"
    else:
        availability = "unknown"

    urls = raw.get("url", "")

    return Event(
        id=f"tm-{raw['id']}",
        source="ticketmaster",
        name=raw.get("name", ""),
        description=raw.get("info"),
        category=segment or None,
        subcategory=genre or None,
        start_datetime=start_dt,
        venue=venue,
        ticket_url=urls or None,
        min_price=float(min_price) if min_price is not None else None,
        max_price=float(max_price) if max_price is not None else None,
        availability=availability,
        image_url=image_url,
    )


async def fetch_events(
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    category: Optional[str] = None,
    venue_id: Optional[str] = None,
    keyword: Optional[str] = None,
    page: int = 0,
    size: int = 20,
) -> list[Event]:
    if not settings.ticketmaster_api_key:
        return []

    params: dict = {
        "apikey": settings.ticketmaster_api_key,
        "city": "Atlanta",
        "stateCode": "GA",
        "countryCode": "US",
        "size": size,
        "page": page,
    }
    if start_date:
        params["startDateTime"] = f"{start_date}T00:00:00Z"
    if end_date:
        params["endDateTime"] = f"{end_date}T23:59:59Z"
    if category:
        params["classificationName"] = category
    if venue_id:
        params["venueId"] = venue_id
    if keyword:
        params["keyword"] = keyword

    async with httpx.AsyncClient(timeout=10) as client:
        resp = await client.get(f"{_BASE}/events.json", params=params)
        resp.raise_for_status()
        data = resp.json()

    raw_events = data.get("_embedded", {}).get("events", [])
    return [_parse_event(e) for e in raw_events]


async def fetch_worldcup_events() -> list[Event]:
    if not settings.ticketmaster_api_key:
        return []

    params = {
        "apikey": settings.ticketmaster_api_key,
        "attractionId": _WORLDCUP_ATTRACTION_ID,
        "city": "Atlanta",
        "stateCode": "GA",
        "size": 50,
    }
    async with httpx.AsyncClient(timeout=10) as client:
        resp = await client.get(f"{_BASE}/events.json", params=params)
        resp.raise_for_status()
        data = resp.json()

    raw_events = data.get("_embedded", {}).get("events", [])
    return [_parse_event(e) for e in raw_events]


async def fetch_venues() -> list[dict]:
    if not settings.ticketmaster_api_key:
        return []

    params = {
        "apikey": settings.ticketmaster_api_key,
        "city": "Atlanta",
        "stateCode": "GA",
        "size": 20,
    }
    async with httpx.AsyncClient(timeout=10) as client:
        resp = await client.get(f"{_BASE}/venues.json", params=params)
        resp.raise_for_status()
        data = resp.json()

    return data.get("_embedded", {}).get("venues", [])
