from __future__ import annotations
from datetime import datetime
from typing import Literal, Optional
from pydantic import BaseModel, HttpUrl


class Venue(BaseModel):
    id: str
    name: str
    address: Optional[str] = None
    city: str = "Atlanta"
    state: str = "GA"
    latitude: Optional[float] = None
    longitude: Optional[float] = None


class Event(BaseModel):
    id: str
    source: Literal["ticketmaster", "seatgeek", "eventbrite"]
    name: str
    description: Optional[str] = None
    category: Optional[str] = None
    subcategory: Optional[str] = None
    start_datetime: Optional[datetime] = None
    end_datetime: Optional[datetime] = None
    venue: Optional[Venue] = None
    ticket_url: Optional[str] = None
    min_price: Optional[float] = None
    max_price: Optional[float] = None
    currency: str = "USD"
    availability: Optional[Literal["available", "limited", "sold_out", "unknown"]] = "unknown"
    image_url: Optional[str] = None


class EventList(BaseModel):
    total: int
    page: int
    size: int
    events: list[Event]
