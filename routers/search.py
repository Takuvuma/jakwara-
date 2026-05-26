from fastapi import APIRouter, Query
from models.event import Event
from services import aggregator

router = APIRouter(tags=["search"])


@router.get("/search", response_model=list[Event])
async def search_events(
    q: str = Query(..., min_length=2, description="Search term: artist, team, event name"),
    size: int = Query(20, ge=1, le=50),
):
    return await aggregator.get_events(keyword=q, size=size)


@router.get("/categories", tags=["utility"])
async def list_categories():
    return {
        "categories": [
            {"id": "sports", "label": "Sports"},
            {"id": "music", "label": "Music & Concerts"},
            {"id": "arts", "label": "Arts & Theatre"},
            {"id": "family", "label": "Family & Kids"},
            {"id": "comedy", "label": "Comedy"},
            {"id": "film", "label": "Film & Media"},
            {"id": "food-drink", "label": "Food & Drink"},
            {"id": "community", "label": "Community & Culture"},
        ]
    }
