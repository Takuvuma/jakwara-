from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi_cache import FastAPICache
from fastapi_cache.backends.inmemory import InMemoryBackend
from routers import events, venues, search


@asynccontextmanager
async def lifespan(app: FastAPI):
    FastAPICache.init(InMemoryBackend())
    yield


app = FastAPI(
    title="Jakwara — Atlanta Events API",
    description=(
        "Aggregates live event data from Ticketmaster, SeatGeek, and Eventbrite "
        "for Atlanta, GA — including FIFA World Cup 2026 matches."
    ),
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET"],
    allow_headers=["*"],
)

app.include_router(events.router)
app.include_router(venues.router)
app.include_router(search.router)


@app.get("/health", tags=["utility"])
async def health():
    return {"status": "ok"}
