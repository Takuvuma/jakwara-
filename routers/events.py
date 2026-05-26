from typing import Optional
from fastapi import APIRouter, Query
from fastapi_cache.decorator import cache
from models.event import Event, EventList
from services import aggregator
from config import settings

router = APIRouter(prefix="/events", tags=["events"])


@router.get("", response_model=EventList)
@cache(expire=settings.cache_ttl_seconds)
async def list_events(
    start_date: Optional[str] = Query(None, description="YYYY-MM-DD"),
    end_date: Optional[str] = Query(None, description="YYYY-MM-DD"),
    category: Optional[str] = Query(None, description="e.g. sports, music, arts"),
    venue_id: Optional[str] = Query(None),
    source: Optional[str] = Query(None, description="ticketmaster | seatgeek | eventbrite"),
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=50),
):
    events = await aggregator.get_events(
        start_date=start_date,
        end_date=end_date,
        category=category,
        venue_id=venue_id,
        source=source,
        page=page,
        size=size,
    )
    paginated = events[(page - 1) * size : page * size]
    return EventList(total=len(events), page=page, size=size, events=paginated)


@router.get("/worldcup", response_model=list[Event])
@cache(expire=settings.cache_ttl_seconds)
async def worldcup_events():
    return await aggregator.get_worldcup_events()


@router.get("/trending", response_model=list[Event])
@cache(expire=300)
async def trending_events():
    return await aggregator.get_trending_events()


@router.get("/{event_id}", response_model=Event)
async def get_event(event_id: str):
    # Try each source based on the ID prefix
    all_events = await aggregator.get_events(size=50)
    for event in all_events:
        if event.id == event_id:
            return event
    from fastapi import HTTPException
    raise HTTPException(status_code=404, detail="Event not found")
