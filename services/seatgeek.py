from __future__ import annotations
from typing import Optional
import httpx
from config import settings
from models.event import Event, Venue

_BASE = "https://api.seatgeek.com/2"


def _parse_event(raw: dict) -> Event:
    performers = raw.get("performers", [])
    image_url = performers[0].get("image") if performers else None

    venue_raw = raw.get("venue", {})
    venue = Venue(
        id=str(venue_raw.get("id", "")),
        name=venue_raw.get("name", ""),
        address=venue_raw.get("address"),
        city=venue_raw.get("city", "Atlanta"),
        state=venue_raw.get("state", "GA"),
        latitude=venue_raw.get("location", {}).get("lat"),
        longitude=venue_raw.get("location", {}).get("lon"),
    )

    stats = raw.get("stats", {})
    min_price = stats.get("lowest_price")
    max_price = stats.get("highest_price")

    listing_count = stats.get("listing_count", 0)
    if listing_count and listing_count > 0:
        availability = "available"
    elif raw.get("visible_until_utc"):
        availability = "sold_out"
    else:
        availability = "unknown"

    taxonomy = raw.get("taxonomies", [{}])
    category = taxonomy[0].get("name", "").lower() if taxonomy else None

    return Event(
        id=f"sg-{raw['id']}",
        source="seatgeek",
        name=raw.get("title", ""),
        category=category,
        start_datetime=raw.get("datetime_utc"),
        venue=venue,
        ticket_url=raw.get("url"),
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
    page: int = 1,
    size: int = 20,
) -> list[Event]:
    if not settings.seatgeek_client_id:
        return []

    params: dict = {
        "client_id": settings.seatgeek_client_id,
        "client_secret": settings.seatgeek_client_secret,
        "venue.city": "Atlanta",
        "venue.state": "GA",
        "per_page": size,
        "page": page,
        "sort": "datetime_utc.asc",
    }
    if start_date:
        params["datetime_utc.gte"] = f"{start_date}T00:00:00"
    if end_date:
        params["datetime_utc.lte"] = f"{end_date}T23:59:59"
    if category:
        params["type"] = category
    if venue_id:
        params["venue.id"] = venue_id
    if keyword:
        params["q"] = keyword

    async with httpx.AsyncClient(timeout=10) as client:
        resp = await client.get(f"{_BASE}/events", params=params)
        resp.raise_for_status()
        data = resp.json()

    return [_parse_event(e) for e in data.get("events", [])]
