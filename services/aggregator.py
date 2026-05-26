from __future__ import annotations
import asyncio
from typing import Optional
from models.event import Event
from services import ticketmaster, seatgeek, eventbrite


def _deduplicate(events: list[Event]) -> list[Event]:
    """Remove likely duplicates by matching on normalized name + date."""
    seen: set[str] = set()
    unique: list[Event] = []
    for event in events:
        date_str = event.start_datetime.date().isoformat() if event.start_datetime else ""
        key = f"{event.name.lower().strip()}|{date_str}"
        if key not in seen:
            seen.add(key)
            unique.append(event)
    return unique


async def get_events(
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    category: Optional[str] = None,
    venue_id: Optional[str] = None,
    keyword: Optional[str] = None,
    source: Optional[str] = None,
    page: int = 1,
    size: int = 20,
) -> list[Event]:
    tasks = []

    if source in (None, "ticketmaster"):
        tasks.append(ticketmaster.fetch_events(start_date, end_date, category, venue_id, keyword, page - 1, size))
    if source in (None, "seatgeek"):
        tasks.append(seatgeek.fetch_events(start_date, end_date, category, venue_id, keyword, page, size))
    if source in (None, "eventbrite"):
        tasks.append(eventbrite.fetch_events(start_date, end_date, category, keyword, page, size))

    results = await asyncio.gather(*tasks, return_exceptions=True)

    all_events: list[Event] = []
    for result in results:
        if isinstance(result, list):
            all_events.extend(result)

    all_events = _deduplicate(all_events)
    all_events.sort(key=lambda e: e.start_datetime or "9999")
    return all_events


async def get_worldcup_events() -> list[Event]:
    events = await ticketmaster.fetch_worldcup_events()
    return events


async def get_trending_events() -> list[Event]:
    # SeatGeek surfaces popularity/listing_count — use it as the trending signal
    params: dict = {
        "start_date": None,
        "end_date": None,
        "category": None,
        "venue_id": None,
        "keyword": None,
        "page": 1,
        "size": 50,
    }
    events = await seatgeek.fetch_events(**params)
    # Sort by ascending min_price availability as a proxy for demand
    events.sort(key=lambda e: (e.min_price or 9999))
    return events[:20]
