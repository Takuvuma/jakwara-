from fastapi import APIRouter, HTTPException
from fastapi_cache.decorator import cache
from models.event import Event, Venue
from services import ticketmaster, aggregator
from config import settings

router = APIRouter(prefix="/venues", tags=["venues"])


def _raw_to_venue(raw: dict) -> Venue:
    loc = raw.get("location", {})
    addr = raw.get("address", {})
    return Venue(
        id=raw.get("id", ""),
        name=raw.get("name", ""),
        address=addr.get("line1"),
        city=raw.get("city", {}).get("name", "Atlanta"),
        state=raw.get("state", {}).get("stateCode", "GA"),
        latitude=float(loc["latitude"]) if loc.get("latitude") else None,
        longitude=float(loc["longitude"]) if loc.get("longitude") else None,
    )


@router.get("", response_model=list[Venue])
@cache(expire=settings.cache_ttl_seconds)
async def list_venues():
    raw_venues = await ticketmaster.fetch_venues()
    return [_raw_to_venue(v) for v in raw_venues]


@router.get("/{venue_id}/events", response_model=list[Event])
@cache(expire=settings.cache_ttl_seconds)
async def venue_events(venue_id: str):
    events = await aggregator.get_events(venue_id=venue_id, size=50)
    if not events:
        raise HTTPException(status_code=404, detail="Venue not found or no upcoming events")
    return events
