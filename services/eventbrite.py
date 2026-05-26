from __future__ import annotations
from typing import Optional
import httpx
from config import settings
from models.event import Event, Venue

_BASE = "https://www.eventbriteapi.com/v3"
# Eventbrite venue ID for Atlanta, GA area search
_ATLANTA_LOCATION_ID = "Atlanta, GA"


def _parse_event(raw: dict, venue_map: dict) -> Event:
    venue_id = raw.get("venue_id", "")
    venue_raw = venue_map.get(venue_id, {})
    address = venue_raw.get("address", {})

    venue = Venue(
        id=str(venue_id),
        name=venue_raw.get("name", ""),
        address=address.get("address_1"),
        city=address.get("city", "Atlanta"),
        state=address.get("region", "GA"),
        latitude=float(address["latitude"]) if address.get("latitude") else None,
        longitude=float(address["longitude"]) if address.get("longitude") else None,
    ) if venue_id else None

    ticket_availability = raw.get("ticket_availability", {})
    if ticket_availability.get("is_sold_out"):
        availability = "sold_out"
    elif ticket_availability.get("has_available_tickets"):
        availability = "available"
    else:
        availability = "unknown"

    min_price_raw = ticket_availability.get("minimum_ticket_price", {})
    max_price_raw = ticket_availability.get("maximum_ticket_price", {})
    min_price = float(min_price_raw.get("major_value", 0)) if min_price_raw else None
    max_price = float(max_price_raw.get("major_value", 0)) if max_price_raw else None

    logo = raw.get("logo", {})
    image_url = logo.get("url") if logo else None

    category_raw = raw.get("category", {})
    category = category_raw.get("name", "").lower() if category_raw else None

    return Event(
        id=f"eb-{raw['id']}",
        source="eventbrite",
        name=raw.get("name", {}).get("text", ""),
        description=raw.get("description", {}).get("text"),
        category=category,
        start_datetime=raw.get("start", {}).get("utc"),
        end_datetime=raw.get("end", {}).get("utc"),
        venue=venue,
        ticket_url=raw.get("url"),
        min_price=min_price,
        max_price=max_price,
        availability=availability,
        image_url=image_url,
    )


async def _fetch_venue(client: httpx.AsyncClient, venue_id: str) -> dict:
    headers = {"Authorization": f"Bearer {settings.eventbrite_api_key}"}
    try:
        resp = await client.get(f"{_BASE}/venues/{venue_id}/", headers=headers, timeout=5)
        return resp.json() if resp.is_success else {}
    except Exception:
        return {}


async def fetch_events(
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    category: Optional[str] = None,
    keyword: Optional[str] = None,
    page: int = 1,
    size: int = 20,
) -> list[Event]:
    if not settings.eventbrite_api_key:
        return []

    headers = {"Authorization": f"Bearer {settings.eventbrite_api_key}"}
    params: dict = {
        "location.address": _ATLANTA_LOCATION_ID,
        "location.within": "10mi",
        "expand": "ticket_availability,category,logo",
        "page_size": min(size, 50),
        "page": page,
        "sort_by": "date",
    }
    if start_date:
        params["start_date.range_start"] = f"{start_date}T00:00:00Z"
    if end_date:
        params["start_date.range_end"] = f"{end_date}T23:59:59Z"
    if keyword:
        params["q"] = keyword
    if category:
        params["categories"] = category

    async with httpx.AsyncClient(timeout=10) as client:
        resp = await client.get(f"{_BASE}/events/search/", headers=headers, params=params)
        resp.raise_for_status()
        data = resp.json()

        events_raw = data.get("events", [])
        venue_ids = {e.get("venue_id") for e in events_raw if e.get("venue_id")}
        venue_map = {}
        for vid in venue_ids:
            venue_map[vid] = await _fetch_venue(client, vid)

    return [_parse_event(e, venue_map) for e in events_raw]
